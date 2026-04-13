import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { auctionId } = await req.json();

  const auctions = await base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId });
  const auction = auctions[0];
  if (!auction) return Response.json({ error: 'Auction not found' }, { status: 404 });

  if (!['awaiting_payment', 'legal_transfer'].includes(auction.status)) {
    return Response.json({ error: `Cannot forfeit from status: ${auction.status}` }, { status: 400 });
  }

  const nowIso = new Date().toISOString();

  // Mark winner registration as forfeited
  const winnerRegs = await base44.asServiceRole.entities.AuctionRegistration.filter({
    auctionId,
    bidderUserId: auction.winnerUserId,
  });
  if (winnerRegs[0]) {
    await base44.asServiceRole.entities.AuctionRegistration.update(winnerRegs[0].id, {
      depositStatus: 'forfeited',
      registrationStatus: 'forfeited',
    });
  }

  // Update auction to failed
  await base44.asServiceRole.entities.PropertyAuction.update(auctionId, {
    status: 'failed',
  });

  await base44.asServiceRole.entities.AuctionEvent.create({
    auctionId,
    eventType: 'deposit_forfeited',
    actorUserId: auction.winnerUserId,
    actorType: 'system',
    description: `Winner forfeited deposit on auction ${auction.auctionCode}. Deposit of ${auction.buyerDepositEGP.toLocaleString()} EGP split: 50% seller / 50% platform.`,
    metaData: {
      winnerUserId: auction.winnerUserId,
      forfeitedAmount: auction.buyerDepositEGP,
      sellerShare: Math.round(auction.buyerDepositEGP * 0.5),
      platformShare: Math.round(auction.buyerDepositEGP * 0.5),
    },
    recordedAt: nowIso,
  });

  // Notify winner
  const winners = await base44.asServiceRole.entities.User.filter({ id: auction.winnerUserId });
  const winner = winners[0];
  if (winner?.email) {
    base44.asServiceRole.integrations.Core.SendEmail({
      to: winner.email,
      subject: `⚠️ Payment Deadline Missed — Deposit Forfeited — ${auction.auctionCode}`,
      body: `You missed the payment deadline for auction ${auction.auctionCode}.\n\nForfeited Deposit: ${auction.buyerDepositEGP.toLocaleString()} EGP\n\nThis deposit cannot be recovered. If you believe this is an error, please contact support immediately.`,
    }).catch(() => {});
  }

  // Notify seller
  const sellers = await base44.asServiceRole.entities.User.filter({ id: auction.sellerUserId });
  const seller = sellers[0];
  if (seller?.email) {
    base44.asServiceRole.integrations.Core.SendEmail({
      to: seller.email,
      subject: `⚠️ Auction Winner Failed to Pay — ${auction.auctionCode}`,
      body: `Unfortunately, the winning bidder failed to complete payment within 48 hours.\n\nYou will receive 50% of their forfeited deposit: ${Math.round(auction.buyerDepositEGP * 0.5).toLocaleString()} EGP\n\nOptions:\n1. Accept the 2nd highest bid\n2. Re-list the property for a new auction\n\nAn admin will contact you to discuss next steps.`,
    }).catch(() => {});
  }

  // Notify admin
  base44.asServiceRole.integrations.Core.SendEmail({
    to: 'admin@kemedar.com',
    subject: `[KemedarBid™] Winner Forfeited — ${auction.auctionCode}`,
    body: `Auction winner has forfeited.\n\nAuction: ${auction.auctionCode}\nWinner: ${auction.winnerUserId}\nForfeited Deposit: ${auction.buyerDepositEGP.toLocaleString()} EGP\n\nAdmin decision required: accept 2nd highest bid or re-list.`,
  }).catch(() => {});

  return Response.json({ success: true, status: 'failed', forfeitedDepositEGP: auction.buyerDepositEGP });
});