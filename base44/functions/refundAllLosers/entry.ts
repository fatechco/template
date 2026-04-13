import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { auctionId, includeAll } = await req.json();

  const auctions = await base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId });
  const auction = auctions[0];
  if (!auction) return Response.json({ error: 'Auction not found' }, { status: 404 });

  // Get all registrations
  const allRegs = await base44.asServiceRole.entities.AuctionRegistration.filter({ auctionId });

  // Filter to losers only (not winner, deposit still held)
  const losers = allRegs.filter(r => {
    const isWinner = r.registrationStatus === 'winner' && !includeAll;
    const depositHeld = r.depositStatus === 'held';
    return !isWinner && depositHeld;
  });

  if (losers.length === 0) {
    return Response.json({ success: true, refunded: 0, message: 'No deposits to refund.' });
  }

  const nowIso = new Date().toISOString();
  let refundedCount = 0;

  for (const reg of losers) {
    await base44.asServiceRole.entities.AuctionRegistration.update(reg.id, {
      depositStatus: 'refunded',
      depositRefundedAt: nowIso,
      registrationStatus: reg.registrationStatus === 'winner' ? 'refunded' : 'refunded',
    });

    await base44.asServiceRole.entities.AuctionEvent.create({
      auctionId,
      eventType: 'deposit_refunded',
      actorUserId: reg.bidderUserId,
      actorType: 'system',
      description: `Deposit of ${reg.depositAmountEGP.toLocaleString()} EGP refunded to bidder ${reg.bidderUserId} on auction ${auction.auctionCode}.`,
      metaData: { bidderUserId: reg.bidderUserId, depositAmountEGP: reg.depositAmountEGP },
      recordedAt: nowIso,
    });

    // Notify each loser
    base44.asServiceRole.entities.User.filter({ id: reg.bidderUserId }).then(users => {
      const u = users[0];
      if (u?.email) {
        base44.asServiceRole.integrations.Core.SendEmail({
          to: u.email,
          subject: `💰 Deposit Refunded — ${auction.auctionCode}`,
          body: `Your registration deposit has been refunded.\n\nAuction: ${auction.auctionTitle}\nRefunded Amount: ${reg.depositAmountEGP.toLocaleString()} EGP\n\nThank you for participating in KemedarBid™. Better luck next time!\n\nBid Smart. Win Real.`,
        }).catch(() => {});
      }
    }).catch(() => {});

    refundedCount++;
  }

  return Response.json({ success: true, refunded: refundedCount, totalRefundedEGP: losers.reduce((s, r) => s + r.depositAmountEGP, 0) });
});