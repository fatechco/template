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

  const body = await req.json();
  const {
    sellerType, categoryId, title, titleAr, description, descriptionAr,
    condition, conditionLabel, quantityAvailable, unit, surplusPriceEGP,
    originalRetailPriceEGP, images, cityId, districtId, countryId, provinceId,
    addressText, latitude, longitude, deliveryOption, pickupInstructions,
    estimatedWeightKg, estimatedCo2SavedKg, ecoImpactNote,
    aiMatchedProductId, aiMatchedProductName, aiMatchedProductRetailPriceEGP,
    aiSuggestedTitle, aiSuggestedCategory, aiConditionEstimate, aiEstimatedQuantity,
    aiSuggestedUnit, aiSuggestedDiscountPercent, aiDescription, aiDescriptionAr,
    claudeModel, aiAnalyzedAt, scannedBarcode,
  } = body;

  // Validate required fields
  if (!title) return Response.json({ error: 'Title is required' }, { status: 400 });
  if (!surplusPriceEGP || surplusPriceEGP <= 0) return Response.json({ error: 'Valid price is required' }, { status: 400 });
  if (!cityId) return Response.json({ error: 'City is required' }, { status: 400 });
  if (!images || images.length < 1) return Response.json({ error: 'At least 1 image is required' }, { status: 400 });
  if (!quantityAvailable || quantityAvailable <= 0) return Response.json({ error: 'Quantity must be greater than 0' }, { status: 400 });

  // Load settings
  const settingsList = await base44.asServiceRole.entities.SurplusSettings.list('-created_date', 1);
  const settings = settingsList[0];
  if (!settings?.isActive) return Response.json({ error: 'Feature unavailable' }, { status: 403 });

  if (images.length > (settings.maxImagesPerListing || 8)) {
    return Response.json({ error: `Maximum ${settings.maxImagesPerListing} images allowed` }, { status: 400 });
  }

  // Calculate derived fields
  const discountPercent = originalRetailPriceEGP && originalRetailPriceEGP > 0
    ? Math.round((1 - surplusPriceEGP / originalRetailPriceEGP) * 100)
    : null;

  // Generate unique QR code hash
  const randomHex = Array.from(crypto.getRandomValues(new Uint8Array(8)))
    .map(b => b.toString(16).padStart(2, '0')).join('');
  const qrRaw = `${user.id}${Date.now()}${randomHex}`;
  const qrBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(qrRaw));
  const pickupQrCode = Array.from(new Uint8Array(qrBuffer))
    .map(b => b.toString(16).padStart(2, '0')).join('');

  const shippingCostEstimateEGP = deliveryOption === 'shipper_network' && estimatedWeightKg
    ? estimatedWeightKg * 15
    : null;

  const now = new Date();
  const listingExpiresAt = new Date(now.getTime() + (settings.listingExpiryDays || 90) * 24 * 60 * 60 * 1000).toISOString();

  const surplusItem = await base44.asServiceRole.entities.SurplusItem.create({
    sellerId: user.id,
    sellerType: sellerType || 'homeowner',
    categoryId, title, titleAr, description, descriptionAr,
    scannedBarcode, condition, conditionLabel,
    quantityAvailable, unit,
    originalRetailPriceEGP, surplusPriceEGP, discountPercent,
    images, primaryImageUrl: images[0],
    aiMatchedProductId, aiMatchedProductName, aiMatchedProductRetailPriceEGP,
    aiSuggestedTitle, aiSuggestedCategory, aiConditionEstimate,
    aiEstimatedQuantity, aiSuggestedUnit, aiSuggestedDiscountPercent,
    aiDescription, aiDescriptionAr, claudeModel, aiAnalyzedAt,
    estimatedWeightKg, estimatedCo2SavedKg, ecoImpactNote,
    countryId, provinceId, cityId, districtId,
    addressText, latitude, longitude,
    deliveryOption, pickupInstructions, shippingCostEstimateEGP,
    status: 'active',
    pickupQrCode,
    platformFeePercent: settings.platformFeePercent || 5,
    viewCount: 0, saveCount: 0, messageCount: 0,
    isFeatured: false, isEcoHighlighted: false,
    listingExpiresAt,
  });

  // Update DeveloperEcoScore if seller is a developer
  if (sellerType === 'developer' && estimatedWeightKg) {
    const existing = await base44.asServiceRole.entities.DeveloperEcoScore.filter(
      { developerUserId: user.id }, '-created_date', 1
    );

    if (existing?.length > 0) {
      const eco = existing[0];
      const newWeight = (eco.totalWeightKgDiverted || 0) + estimatedWeightKg;
      const newCo2 = (eco.totalCo2SavedKg || 0) + (estimatedCo2SavedKg || 0);
      await base44.asServiceRole.entities.DeveloperEcoScore.update(eco.id, {
        totalItemsListed: (eco.totalItemsListed || 0) + 1,
        totalWeightKgDiverted: newWeight,
        totalCo2SavedKg: newCo2,
        ecoTier: calcEcoTier(newWeight, settings),
        lastUpdatedAt: now.toISOString(),
      });
    } else {
      const newWeight = estimatedWeightKg || 0;
      await base44.asServiceRole.entities.DeveloperEcoScore.create({
        developerUserId: user.id,
        totalItemsListed: 1,
        totalItemsSold: 0,
        totalWeightKgDiverted: newWeight,
        totalCo2SavedKg: estimatedCo2SavedKg || 0,
        totalGMVEGP: 0,
        ecoTier: calcEcoTier(newWeight, settings),
        lastUpdatedAt: now.toISOString(),
      });
    }
  }

  return Response.json({
    success: true,
    surplusItem,
    message: `✅ Listed! You just saved ${estimatedWeightKg || 0}kg of materials from the landfill.`,
  });
});