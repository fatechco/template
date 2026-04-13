import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { auctionId, bidderUserId, autoBidMaxEGP, increment } = await req.json();

  const [auctions, regs] = await Promise.all([
    base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId }),
    base44.asServiceRole.entities.AuctionRegistration.filter({ auctionId, bidderUserId }),
  ]);

  const auction = auctions[0];
  if (!auction) return Response.json({ error: 'Auction not found' }, { status: 404 });

  const registration = regs[0];
  if (!registration || registration.registrationStatus !== 'active') {
    return Response.json({ error: 'You must be an active registered bidder to set an auto-bid.' }, { status: 400 });
  }

  if (autoBidMaxEGP <= (auction.currentHighestBidEGP || 0)) {
    return Response.json({
      error: `Auto-bid maximum must be above current highest bid of ${(auction.currentHighestBidEGP || 0).toLocaleString()} EGP.`,
    }, { status: 400 });
  }

  const autoBidIncrement = increment || auction.minimumBidIncrementEGP;

  // Update registration with autobid config
  await base44.asServiceRole.entities.AuctionRegistration.update(registration.id, {
    hasAutoBid: true,
    autoBidMaxEGP,
    autoBidIncrement,
  });

  await base44.asServiceRole.entities.AuctionEvent.create({
    auctionId,
    eventType: 'autobid_triggered',
    actorUserId: bidderUserId,
    actorType: 'bidder',
    description: `Auto-bid configured by bidder ${bidderUserId} up to ${autoBidMaxEGP.toLocaleString()} EGP on auction ${auction.auctionCode}.`,
    metaData: { autoBidMaxEGP, autoBidIncrement },
    recordedAt: new Date().toISOString(),
  });

  // If bidder is not already winning, fire first autobid immediately
  if (auction.currentHighestBidderUserId !== bidderUserId) {
    const nextBid = (auction.currentHighestBidEGP || auction.startingPriceEGP) + auction.minimumBidIncrementEGP;
    if (nextBid <= autoBidMaxEGP && ['live', 'extended'].includes(auction.status)) {
      base44.asServiceRole.functions.invoke('placeBid', {
        auctionId,
        bidderUserId,
        bidAmountEGP: nextBid,
        isAutoBid: true,
        autoMaxAmountEGP: autoBidMaxEGP,
      }).catch(() => {});
    }
  }

  // Notify bidder
  const bidders = await base44.asServiceRole.entities.User.filter({ id: bidderUserId });
  const bidder = bidders[0];
  if (bidder?.email) {
    base44.asServiceRole.integrations.Core.SendEmail({
      to: bidder.email,
      subject: `✅ Auto-Bid Set — ${auction.auctionCode}`,
      body: `Your auto-bid has been configured.\n\nAuction: ${auction.auctionTitle}\nAuto-Bid Maximum: ${autoBidMaxEGP.toLocaleString()} EGP\nIncrement: ${autoBidIncrement.toLocaleString()} EGP\n\nThe system will automatically bid on your behalf up to your maximum. You'll be notified if outbid.`,
    }).catch(() => {});
  }

  return Response.json({ success: true, autoBidMaxEGP, autoBidIncrement });
});