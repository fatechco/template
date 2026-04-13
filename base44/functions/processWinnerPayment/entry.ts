import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { auctionId, winnerUserId, paymentRef } = await req.json();

  const auctions = await base44.asServiceRole.entities.PropertyAuction.filter({ id: auctionId });
  const auction = auctions[0];
  if (!auction) return Response.json({ error: 'Auction not found' }, { status: 404 });
  if (auction.status !== 'awaiting_payment') {
    return Response.json({ error: `Auction is not awaiting payment (status: ${auction.status})` }, { status: 400 });
  }
  if (auction.winnerUserId !== winnerUserId) return Response.json({ error: 'Forbidden: not the auction winner' }, { status: 403 });

  // Check if deadline passed
  const now = new Date();
  if (auction.winnerPaymentDeadlineAt && now > new Date(auction.winnerPaymentDeadlineAt)) {
    // Forfeit winner
    await base44.asServiceRole.functions.invoke('forfeitWinner', { auctionId }).catch(() => {});
    return Response.json({ error: 'Payment deadline has passed. Your deposit has been forfeited.' }, { status: 400 });
  }

  const nowIso = now.toISOString();
  const settingsArr = await base44.asServiceRole.entities.AuctionSettings.list();
  const settings = settingsArr[0] || {};
  const commissionPct = (settings.platformCommissionPercent ?? 2) / 100;
  const platformCommissionEGP = Math.round(auction.winnerBidEGP * commissionPct);

  // Remaining due = winnerBid minus deposit already held
  const totalDue = auction.winnerBidEGP - auction.buyerDepositEGP;
  const escrowRef = `ESCROW-${auction.auctionCode}-${Date.now()}`;

  // Update auction to legal_transfer
  await base44.asServiceRole.entities.PropertyAuction.update(auctionId, {
    status: 'legal_transfer',
    winnerPaymentCompletedAt: nowIso,
    xeedWalletEscrowReference: escrowRef,
    escrowActivatedAt: nowIso,
  });

  // Create Kemework legal task
  const [winnerUsers, sellerUsers, properties] = await Promise.all([
    base44.asServiceRole.entities.User.filter({ id: winnerUserId }),
    base44.asServiceRole.entities.User.filter({ id: auction.sellerUserId }),
    base44.asServiceRole.entities.Property.filter({ id: auction.propertyId }),
  ]);
  const winner = winnerUsers[0];
  const seller = sellerUsers[0];
  const property = properties[0];

  const legalTask = await base44.asServiceRole.entities.KemeworkTask.create({
    title: `Property Transfer — Auction Winner — ${auction.auctionCode}`,
    description: `Prepare dual title transfer documents for auction ${auction.auctionCode}.\n\nSeller: ${seller?.full_name || auction.sellerUserId} → Winner: ${winner?.full_name || winnerUserId}\nProperty: ${property?.title || auction.auctionTitle}\nSale Price: ${auction.winnerBidEGP.toLocaleString()} EGP\nPlatform Commission: ${platformCommissionEGP.toLocaleString()} EGP\nEscrow Reference: ${escrowRef}\n\nPlease coordinate with both parties to complete legal transfer.`,
    status: 'open',
    budgetMin: 3000,
    budgetMax: 8000,
  }).catch(() => null);

  if (legalTask) {
    await base44.asServiceRole.entities.PropertyAuction.update(auctionId, {
      kemeworkLegalTaskId: legalTask.id,
    });
  }

  // Log event
  await base44.asServiceRole.entities.AuctionEvent.create({
    auctionId,
    eventType: 'payment_received',
    actorUserId: winnerUserId,
    actorType: 'bidder',
    description: `Payment received for auction ${auction.auctionCode}. Total: ${auction.winnerBidEGP.toLocaleString()} EGP. Escrow: ${escrowRef}. Legal transfer initiated.`,
    metaData: { winnerBidEGP: auction.winnerBidEGP, totalDue, platformCommissionEGP, escrowRef, paymentRef },
    recordedAt: nowIso,
  });

  // Notify both parties
  if (winner?.email) {
    base44.asServiceRole.integrations.Core.SendEmail({
      to: winner.email,
      subject: `✅ Payment Confirmed — Legal Transfer Started — ${auction.auctionCode}`,
      body: `Your payment has been confirmed and funds are held in escrow.\n\nAmount: ${auction.winnerBidEGP.toLocaleString()} EGP\nEscrow Reference: ${escrowRef}\n\nA legal professional will contact you to complete the property transfer. Congratulations!`,
    }).catch(() => {});
  }
  if (seller?.email) {
    base44.asServiceRole.integrations.Core.SendEmail({
      to: seller.email,
      subject: `✅ Payment Received — Legal Transfer Started — ${auction.auctionCode}`,
      body: `The buyer has completed payment. Funds are securely held in escrow.\n\nSale Price: ${auction.winnerBidEGP.toLocaleString()} EGP\nYour Net (after commission): ${(auction.winnerBidEGP - platformCommissionEGP).toLocaleString()} EGP\nEscrow Reference: ${escrowRef}\n\nA legal professional will contact you to complete the transfer.`,
    }).catch(() => {});
  }

  return Response.json({ success: true, status: 'legal_transfer', escrowRef, platformCommissionEGP, totalDue });
});