import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { surplusItemId } = await req.json();
  const buyerUserId = user.id;

  // Load settings
  const settingsList = await base44.asServiceRole.entities.SurplusSettings.list('-created_date', 1);
  const settings = settingsList[0];
  const reservationExpiryHours = settings?.reservationExpiryHours || 48;
  const feePercent = settings?.platformFeePercent || 5;

  // Get surplus item
  const items = await base44.asServiceRole.entities.SurplusItem.filter({ id: surplusItemId }, '-created_date', 1);
  const item = items?.[0];
  if (!item) return Response.json({ error: 'Item not found' }, { status: 404 });
  if (item.status !== 'active') return Response.json({ error: 'Item is no longer available' }, { status: 400 });
  if (item.sellerId === buyerUserId) return Response.json({ error: 'You cannot reserve your own listing.' }, { status: 400 });

  // NOTE: XeedWallet balance check and escrow deduction would integrate with
  // the XeedWallet service here. For now we record the transaction and update state.
  // In production: GET buyer wallet balance, validate funds, deduct and hold.

  const platformFeeEGP = item.surplusPriceEGP * (feePercent / 100);
  const sellerNetEGP = item.surplusPriceEGP - platformFeeEGP;

  const now = new Date();
  const reservationExpiryAt = new Date(
    now.getTime() + reservationExpiryHours * 60 * 60 * 1000
  ).toISOString();

  // Update item to reserved
  await base44.asServiceRole.entities.SurplusItem.update(surplusItemId, {
    status: 'reserved',
    reservedByUserId: buyerUserId,
    reservedAt: now.toISOString(),
    reservationExpiryAt,
    pickupQrCodeExpiresAt: reservationExpiryAt,
  });

  // Create reservation transaction
  await base44.asServiceRole.entities.SurplusTransaction.create({
    surplusItemId,
    buyerUserId,
    sellerUserId: item.sellerId,
    transactionType: 'reservation',
    amountEGP: item.surplusPriceEGP,
    platformFeeEGP,
    sellerNetEGP,
    qrCodeHash: item.pickupQrCode,
  });

  const updatedItems = await base44.asServiceRole.entities.SurplusItem.filter(
    { id: surplusItemId }, '-created_date', 1
  );

  return Response.json({
    success: true,
    surplusItem: updatedItems[0],
    pickupQrCode: item.pickupQrCode,
    reservationExpiryAt,
    message: '✅ Reservation confirmed! Show the seller your QR code to complete pickup.',
  });
});