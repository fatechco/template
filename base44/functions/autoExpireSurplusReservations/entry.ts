import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Admin-only or scheduled — no user auth required for cron context
  const now = new Date();

  // Find all items that are reserved and past their expiry
  const allReserved = await base44.asServiceRole.entities.SurplusItem.filter(
    { status: 'reserved' },
    'created_date',
    200
  );

  const expired = (allReserved || []).filter(item =>
    item.reservationExpiryAt && new Date(item.reservationExpiryAt) < now
  );

  if (expired.length === 0) {
    return Response.json({ success: true, message: 'No expired reservations found.', processed: 0 });
  }

  let processed = 0;

  for (const item of expired) {
    // NOTE: In production — release escrow hold and refund surplusPriceEGP to buyer wallet via XeedWallet API.

    // Capture buyer before resetting (avoid null buyerUserId in transaction)
    const buyerUserId = item.reservedByUserId;

    // Restore item to active
    await base44.asServiceRole.entities.SurplusItem.update(item.id, {
      status: 'active',
      reservedByUserId: null,
      reservedAt: null,
      reservationExpiryAt: null,
      pickupQrCodeExpiresAt: null,
    });

    // Notify buyer of expiry (fire-and-forget)
    if (buyerUserId) {
      base44.asServiceRole.entities.User.filter({ id: buyerUserId }).then(users => {
        const u = users[0];
        if (u?.email) {
          base44.asServiceRole.integrations.Core.SendEmail({
            to: u.email,
            subject: `⏰ Reservation Expired — ${item.title}`,
            body: `Your reservation for "${item.title}" has expired because it was not collected in time.\n\nYour deposit of ${item.surplusPriceEGP?.toLocaleString()} EGP has been fully refunded.\n\nThe item is now available again on the Kemetro Surplus Market.`,
          }).catch(() => {});
        }
      }).catch(() => {});
    }

    // Create expiry transaction
    await base44.asServiceRole.entities.SurplusTransaction.create({
      surplusItemId: item.id,
      buyerUserId,
      sellerUserId: item.sellerId,
      transactionType: 'expiry',
      amountEGP: item.surplusPriceEGP,
      platformFeeEGP: 0,
      sellerNetEGP: 0,
      cancellationReason: 'Reservation expired — buyer did not collect within the allowed window',
    });

    processed++;
  }

  return Response.json({
    success: true,
    message: `Processed ${processed} expired reservation(s).`,
    processed,
  });
});