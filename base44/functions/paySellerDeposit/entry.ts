import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { auctionId, sellerUserId, paymentRef } = await req.json();

  const auctions = await base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId });
  const auction = auctions[0];
  if (!auction) return Response.json({ error: 'Auction not found' }, { status: 404 });
  if (auction.sellerUserId !== sellerUserId) return Response.json({ error: 'Forbidden' }, { status: 403 });
  if (auction.status !== 'deposit_pending') {
    return Response.json({ error: `Auction is not awaiting deposit (current: ${auction.status})` }, { status: 400 });
  }
  if (auction.sellerDepositPaid) return Response.json({ error: 'Seller deposit already paid' }, { status: 400 });

  const now = new Date().toISOString();

  // Update auction to scheduled
  await base44.asServiceRole.entities.PropertyAuction.update(auctionId, {
    sellerDepositPaid: true,
    sellerDepositPaidAt: now,
    sellerDepositTransactionId: paymentRef || `DEP-${Date.now()}`,
    status: 'scheduled',
  });

  // Log event
  await base44.asServiceRole.entities.AuctionEvent.create({
    auctionId,
    eventType: 'seller_deposit_paid',
    actorUserId: sellerUserId,
    actorType: 'seller',
    description: `Seller deposit of ${auction.sellerDepositEGP.toLocaleString()} EGP paid. Auction ${auction.auctionCode} is now scheduled.`,
    metaData: { sellerDepositEGP: auction.sellerDepositEGP, paymentRef },
    recordedAt: now,
  });

  // Notify seller
  const sellers = await base44.asServiceRole.entities.User.filter({ id: sellerUserId });
  const seller = sellers[0];
  if (seller?.email) {
    base44.asServiceRole.integrations.Core.SendEmail({
      to: seller.email,
      subject: `🎉 Auction Confirmed & Scheduled — ${auction.auctionCode}`,
      body: `Your auction is confirmed!\n\nAuction Code: ${auction.auctionCode}\nProperty: ${auction.auctionTitle}\nRegistration Opens: ${new Date(auction.registrationOpenAt).toLocaleString()}\nAuction Starts: ${new Date(auction.auctionStartAt).toLocaleString()}\nAuction Ends: ${new Date(auction.auctionEndAt).toLocaleString()}\n\nBidders can now register. Good luck!`,
    }).catch(() => {});
  }

  // Notify watchlisted users about this property (fire and forget)
  base44.asServiceRole.entities.AuctionWatchlist.filter({ auctionId }).then(watchers => {
    watchers.forEach(w => {
      base44.asServiceRole.entities.User.filter({ id: w.userId }).then(users => {
        const u = users[0];
        if (u?.email) {
          base44.asServiceRole.integrations.Core.SendEmail({
            to: u.email,
            subject: `🔔 Auction Scheduled — ${auction.auctionCode}`,
            body: `An auction you are watching has been confirmed.\n\nProperty: ${auction.auctionTitle}\nAuction Code: ${auction.auctionCode}\nRegistration Opens: ${new Date(auction.registrationOpenAt).toLocaleString()}\nAuction Starts: ${new Date(auction.auctionStartAt).toLocaleString()}\n\nRegister to bid before registration closes!`,
          }).catch(() => {});
        }
      }).catch(() => {});
    });
  }).catch(() => {});

  const updated = await base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId });
  return Response.json({ success: true, auction: updated[0] });
});