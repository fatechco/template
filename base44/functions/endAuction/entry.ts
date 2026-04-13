import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { auctionId } = await req.json();

  const auctions = await base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId });
  const auction = auctions[0];
  if (!auction) return Response.json({ error: 'Auction not found' }, { status: 404 });

  const endableStatuses = ['live', 'extended', 'scheduled', 'registration'];
  if (!endableStatuses.includes(auction.status)) {
    return Response.json({ error: `Auction cannot be ended from status: ${auction.status}` }, { status: 400 });
  }

  const now = new Date();
  const nowIso = now.toISOString();

  // No bids — cancel and refund seller
  if (!auction.totalBids || auction.totalBids === 0) {
    await base44.asServiceRole.entities.PropertyAuction.update(auctionId, {
      status: 'cancelled',
      finalEndAt: nowIso,
      sellerDepositRefunded: true,
      sellerDepositRefundedAt: nowIso,
    });

    await base44.asServiceRole.entities.AuctionEvent.create({
      auctionId,
      eventType: 'cancelled',
      actorType: 'system',
      description: `Auction ${auction.auctionCode} cancelled — no bids received. Seller deposit refunded.`,
      metaData: {},
      recordedAt: nowIso,
    });

    const sellers = await base44.asServiceRole.entities.User.filter({ id: auction.sellerUserId });
    const seller = sellers[0];
    if (seller?.email) {
      base44.asServiceRole.integrations.Core.SendEmail({
        to: seller.email,
        subject: `Auction Ended — No Bids Received — ${auction.auctionCode}`,
        body: `Your auction has ended with no bids received.\n\nAuction: ${auction.auctionTitle}\nYour seller deposit of ${auction.sellerDepositEGP.toLocaleString()} EGP has been refunded.`,
      }).catch(() => {});
    }
    return Response.json({ success: true, status: 'cancelled' });
  }

  // Reserve not met
  if (auction.reservePriceEGP && !auction.reserveMet) {
    await base44.asServiceRole.entities.PropertyAuction.update(auctionId, {
      status: 'reserve_not_met',
      finalEndAt: nowIso,
      winnerBidEGP: auction.currentHighestBidEGP,
    });

    await base44.asServiceRole.entities.AuctionEvent.create({
      auctionId,
      eventType: 'auction_ended',
      actorType: 'system',
      description: `Auction ${auction.auctionCode} ended — reserve not met. Highest bid: ${auction.currentHighestBidEGP.toLocaleString()} EGP.`,
      metaData: { highestBid: auction.currentHighestBidEGP, reservePrice: auction.reservePriceEGP },
      recordedAt: nowIso,
    });

    // Refund all bidder deposits
    await base44.asServiceRole.functions.invoke('refundAllLosers', { auctionId, includeAll: true }).catch(() => {});

    const sellers = await base44.asServiceRole.entities.User.filter({ id: auction.sellerUserId });
    const seller = sellers[0];
    if (seller?.email) {
      base44.asServiceRole.integrations.Core.SendEmail({
        to: seller.email,
        subject: `Auction Ended — Reserve Not Met — ${auction.auctionCode}`,
        body: `Your auction has ended but the reserve price was not met.\n\nHighest Bid: ${auction.currentHighestBidEGP.toLocaleString()} EGP\nReserve Price: ${auction.reservePriceEGP.toLocaleString()} EGP\n\nAn admin will contact you regarding your options (accept highest bid or re-list).`,
      }).catch(() => {});
    }
    return Response.json({ success: true, status: 'reserve_not_met' });
  }

  // Auction has a winner
  const winnerUserId = auction.currentHighestBidderUserId;
  const winnerBidEGP = auction.currentHighestBidEGP;
  const paymentDeadline = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();

  await base44.asServiceRole.entities.PropertyAuction.update(auctionId, {
    status: 'awaiting_payment',
    winnerUserId,
    winnerBidEGP,
    winnerNotifiedAt: nowIso,
    winnerPaymentDeadlineAt: paymentDeadline,
    finalEndAt: nowIso,
  });

  // Mark winner registration
  const winnerRegs = await base44.asServiceRole.entities.AuctionRegistration.filter({ auctionId, bidderUserId: winnerUserId });
  if (winnerRegs[0]) {
    await base44.asServiceRole.entities.AuctionRegistration.update(winnerRegs[0].id, {
      registrationStatus: 'winner',
      winnerId: true,
    });
  }

  await base44.asServiceRole.entities.AuctionEvent.create({
    auctionId,
    eventType: 'winner_notified',
    actorUserId: winnerUserId,
    actorType: 'system',
    description: `Auction ${auction.auctionCode} ended. Winner: ${winnerUserId}. Winning bid: ${winnerBidEGP.toLocaleString()} EGP.`,
    metaData: { winnerUserId, winnerBidEGP, paymentDeadline },
    recordedAt: nowIso,
  });

  // Notify winner
  const winners = await base44.asServiceRole.entities.User.filter({ id: winnerUserId });
  const winner = winners[0];
  if (winner?.email) {
    base44.asServiceRole.integrations.Core.SendEmail({
      to: winner.email,
      subject: `🏆 CONGRATULATIONS — You Won Auction ${auction.auctionCode}!`,
      body: `You won the auction!\n\nProperty: ${auction.auctionTitle}\nYour Winning Bid: ${winnerBidEGP.toLocaleString()} EGP\n\nPlease complete your payment within 48 hours.\nPayment Deadline: ${new Date(paymentDeadline).toLocaleString()}\n\nYour buyer deposit of ${auction.buyerDepositEGP.toLocaleString()} EGP will be applied toward the total.\n\nBid Smart. Win Real. 🏆`,
    }).catch(() => {});
  }

  // Notify seller
  const sellers = await base44.asServiceRole.entities.User.filter({ id: auction.sellerUserId });
  const seller = sellers[0];
  if (seller?.email) {
    base44.asServiceRole.integrations.Core.SendEmail({
      to: seller.email,
      subject: `🎉 Your Auction is Complete — ${auction.auctionCode}`,
      body: `Your auction has ended with a winner!\n\nProperty: ${auction.auctionTitle}\nFinal Price: ${winnerBidEGP.toLocaleString()} EGP\nTotal Bids: ${auction.totalBids}\nRegistered Bidders: ${auction.totalRegisteredBidders}\n\nThe winner has 48 hours to complete payment. You'll be notified once payment is received.`,
    }).catch(() => {});
  }

  // Refund all losing bidders
  base44.asServiceRole.functions.invoke('refundAllLosers', { auctionId }).catch(() => {});

  return Response.json({ success: true, status: 'awaiting_payment', winnerUserId, winnerBidEGP, paymentDeadline });
});