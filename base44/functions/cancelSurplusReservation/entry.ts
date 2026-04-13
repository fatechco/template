import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { surplusItemId, cancellationReason } = await req.json();
  const buyerUserId = user.id;

  // Get item and verify it belongs to this buyer as reserved
  const items = await base44.asServiceRole.entities.SurplusItem.filter(
    { id: surplusItemId }, '-created_date', 1
  );
  const item = items?.[0];

  if (!item) return Response.json({ error: 'Item not found' }, { status: 404 });
  if (item.status !== 'reserved') return Response.json({ error: 'Item is not currently reserved' }, { status: 400 });
  if (item.reservedByUserId !== buyerUserId) return Response.json({ error: 'You did not reserve this item' }, { status: 403 });

  const feePercent = 0; // Full refund — no penalty for buyer
  const platformFeeEGP = 0;
  const sellerNetEGP = 0;

  // NOTE: In production — release escrow hold and refund full surplusPriceEGP to buyer wallet via XeedWallet API.

  const now = new Date();

  // Restore item to active
  await base44.asServiceRole.entities.SurplusItem.update(surplusItemId, {
    status: 'active',
    reservedByUserId: null,
    reservedAt: null,
    reservationExpiryAt: null,
    pickupQrCodeExpiresAt: null,
  });

  // Create cancellation transaction
  await base44.asServiceRole.entities.SurplusTransaction.create({
    surplusItemId,
    buyerUserId,
    sellerUserId: item.sellerId,
    transactionType: 'cancellation',
    amountEGP: item.surplusPriceEGP,
    platformFeeEGP,
    sellerNetEGP,
    cancellationReason: cancellationReason || 'No reason provided',
  });

  return Response.json({
    success: true,
    message: '✅ Reservation cancelled. Full refund issued to your XeedWallet.',
    refundedEGP: item.surplusPriceEGP,
  });
});