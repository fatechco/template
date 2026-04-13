import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user || user.role !== 'admin') return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });

  const { auctionId, adminUserId } = await req.json();

  const auctions = await base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId });
  const auction = auctions[0];
  if (!auction) return Response.json({ error: 'Auction not found' }, { status: 404 });
  if (auction.status !== 'pending_review') {
    return Response.json({ error: `Auction is not pending review (current status: ${auction.status})` }, { status: 400 });
  }

  // Update auction
  await base44.asServiceRole.entities.PropertyAuction.update(auctionId, {
    status: 'deposit_pending',
    reviewedByAdminId: adminUserId || user.id,
    reviewedAt: new Date().toISOString(),
  });

  // Log event
  await base44.asServiceRole.entities.AuctionEvent.create({
    auctionId,
    eventType: 'auction_approved',
    actorUserId: adminUserId || user.id,
    actorType: 'admin',
    description: `Auction ${auction.auctionCode} approved. Awaiting seller deposit of ${auction.sellerDepositEGP.toLocaleString()} EGP.`,
    metaData: { sellerDepositEGP: auction.sellerDepositEGP },
    recordedAt: new Date().toISOString(),
  });

  // Notify seller
  const sellers = await base44.asServiceRole.entities.User.filter({ id: auction.sellerUserId });
  const seller = sellers[0];
  if (seller?.email) {
    base44.asServiceRole.integrations.Core.SendEmail({
      to: seller.email,
      subject: `✅ Your KemedarBid™ Auction is Approved — ${auction.auctionCode}`,
      body: `Congratulations! Your auction listing has been approved.\n\nAuction Code: ${auction.auctionCode}\nProperty: ${auction.auctionTitle}\n\nTo confirm your listing, please pay your refundable seller deposit of ${auction.sellerDepositEGP.toLocaleString()} EGP.\n\nLog in to your dashboard to complete payment.`,
    }).catch(() => {});
  }

  const updated = await base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId });
  return Response.json({ success: true, auction: updated[0] });
});