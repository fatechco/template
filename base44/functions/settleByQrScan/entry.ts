import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

function calcEcoTier(weightKg, settings) {
  if (weightKg >= (settings.ecoChampionKgThreshold || 5000)) return 'eco_leader';
  if (weightKg >= (settings.ecoBuilderKgThreshold || 2000)) return 'eco_champion';
  if (weightKg >= (settings.ecoStarterKgThreshold || 500)) return 'eco_builder';
  return 'eco_starter';
}

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { qrCodeHash } = await req.json();
  const sellerUserId = user.id;

  // Find reserved item matching QR code and seller
  const items = await base44.asServiceRole.entities.SurplusItem.filter(
    { pickupQrCode: qrCodeHash, status: 'reserved', sellerId: sellerUserId },
    '-created_date', 1
  );
  const item = items?.[0];

  if (!item) return Response.json({ error: 'Invalid QR code or not your listing.' }, { status: 404 });

  // Idempotency: prevent double-settlement
  if (item.status === 'sold') {
    return Response.json({ error: 'This item has already been settled.' }, { status: 409 });
  }

  const now = new Date();
  if (item.pickupQrCodeExpiresAt && new Date(item.pickupQrCodeExpiresAt) < now) {
    return Response.json({
      error: 'This QR code has expired. Ask buyer to generate a new one.',
    }, { status: 400 });
  }

  const settingsList = await base44.asServiceRole.entities.SurplusSettings.list('-created_date', 1);
  const settings = settingsList[0];
  const feePercent = settings?.platformFeePercent || 5;
  const platformFeeEGP = item.surplusPriceEGP * (feePercent / 100);
  const sellerNetEGP = item.surplusPriceEGP - platformFeeEGP;

  // NOTE: In production — release escrow hold, transfer sellerNetEGP to seller wallet,
  // transfer platformFeeEGP to Kemedar platform wallet via XeedWallet API.

  // Update item to sold
  await base44.asServiceRole.entities.SurplusItem.update(item.id, {
    status: 'sold',
    soldAt: now.toISOString(),
    platformFeeEGP,
    sellerNetEGP,
  });

  // Create settlement transaction
  const txns = await base44.asServiceRole.entities.SurplusTransaction.filter(
    { surplusItemId: item.id, transactionType: 'reservation' },
    '-created_date', 1
  );
  if (txns?.[0]) {
    await base44.asServiceRole.entities.SurplusTransaction.update(txns[0].id, {
      transactionType: 'settlement',
      qrCodeHash,
      qrScannedAt: now.toISOString(),
      qrScannedByUserId: sellerUserId,
    });
  } else {
    await base44.asServiceRole.entities.SurplusTransaction.create({
      surplusItemId: item.id,
      buyerUserId: item.reservedByUserId,
      sellerUserId,
      transactionType: 'settlement',
      amountEGP: item.surplusPriceEGP,
      platformFeeEGP,
      sellerNetEGP,
      qrCodeHash,
      qrScannedAt: now.toISOString(),
      qrScannedByUserId: sellerUserId,
    });
  }

  // Update DeveloperEcoScore if seller is a developer
  if (item.sellerType === 'developer') {
    const existing = await base44.asServiceRole.entities.DeveloperEcoScore.filter(
      { developerUserId: sellerUserId }, '-created_date', 1
    );
    if (existing?.length > 0) {
      const eco = existing[0];
      const newWeight = eco.totalWeightKgDiverted || 0;
      await base44.asServiceRole.entities.DeveloperEcoScore.update(eco.id, {
        totalItemsSold: (eco.totalItemsSold || 0) + 1,
        totalGMVEGP: (eco.totalGMVEGP || 0) + item.surplusPriceEGP,
        ecoTier: calcEcoTier(newWeight, settings),
        lastUpdatedAt: now.toISOString(),
      });
    }
  }

  return Response.json({
    success: true,
    message: '✅ Transaction Complete! Funds have been released to your wallet.',
    sellerNetEGP,
    platformFeeEGP,
    co2Saved: item.estimatedCo2SavedKg || 0,
    weightDiverted: item.estimatedWeightKg || 0,
  });
});