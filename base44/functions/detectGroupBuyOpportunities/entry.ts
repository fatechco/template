import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const now = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const signals = [];

  // --- 1. BOQ Projects: group by districtId + category ---
  const buildProjects = await base44.asServiceRole.entities.BuildProject.filter({}, '-created_date', 300);
  const boqGroups = {};
  for (const p of buildProjects) {
    if (!p.boqData?.boqSections || !p.districtId) continue;
    const categories = new Set();
    for (const sec of p.boqData.boqSections) {
      for (const item of (sec.items || [])) {
        if (item.category) categories.add(item.category);
      }
    }
    for (const cat of categories) {
      const key = `${p.districtId}:${cat}`;
      if (!boqGroups[key]) boqGroups[key] = { userIds: [], totalQty: 0 };
      boqGroups[key].userIds.push(p.created_by || p.userId || p.id);
      boqGroups[key].totalQty += 80; // avg sqm per project per category
    }
  }
  for (const [key, data] of Object.entries(boqGroups)) {
    if (data.userIds.length < 3) continue;
    const [districtId, category] = key.split(':');
    const existing = await base44.asServiceRole.entities.DemandSignal.filter({
      signalType: 'boq_multiple_users', locationDistrictId: districtId, productCategory: category, status: 'detected'
    });
    if (existing.length > 0) continue;
    const unitPrice = 220;
    signals.push({
      signalType: 'boq_multiple_users',
      productCategory: category,
      locationDistrictId: districtId,
      estimatedBuyerCount: data.userIds.length,
      estimatedDemandQty: data.totalQty,
      signalStrength: Math.min(100, data.userIds.length * 15),
      confidenceScore: 75 + Math.min(20, data.userIds.length * 2),
      potentialGroupBuyValue: data.totalQty * unitPrice,
      estimatedSavingsIfGrouped: Math.round(data.totalQty * unitPrice * 0.22),
      targetUserIds: [...new Set(data.userIds)].slice(0, 30),
      status: 'detected',
      detectedAt: now,
      expiresAt,
    });
  }

  // --- 2. Finish Projects: cluster by cityId entering tiling/flooring phase ---
  const finishProjects = await base44.asServiceRole.entities.FinishProject.filter({}, '-created_date', 300);
  const finishGroups = {};
  for (const p of finishProjects) {
    if (!p.cityId || p.status === 'completed' || p.status === 'cancelled') continue;
    const key = `${p.cityId}:tiles`;
    if (!finishGroups[key]) finishGroups[key] = { userIds: [], compoundName: null };
    finishGroups[key].userIds.push(p.created_by || p.id);
    if (!finishGroups[key].compoundName && p.compoundName) finishGroups[key].compoundName = p.compoundName;
  }
  for (const [key, data] of Object.entries(finishGroups)) {
    if (data.userIds.length < 4) continue;
    const [cityId, category] = key.split(':');
    const existing = await base44.asServiceRole.entities.DemandSignal.filter({
      signalType: 'finish_projects_cluster', locationCityId: cityId, productCategory: category, status: 'detected'
    });
    if (existing.length > 0) continue;
    const qty = data.userIds.length * 90;
    signals.push({
      signalType: 'finish_projects_cluster',
      productCategory: category,
      locationCityId: cityId,
      compoundName: data.compoundName || null,
      estimatedBuyerCount: data.userIds.length,
      estimatedDemandQty: qty,
      signalStrength: Math.min(100, data.userIds.length * 12),
      confidenceScore: 80,
      potentialGroupBuyValue: qty * 220,
      estimatedSavingsIfGrouped: Math.round(qty * 220 * 0.25),
      targetUserIds: [...new Set(data.userIds)].slice(0, 30),
      status: 'detected',
      detectedAt: now,
      expiresAt,
    });
  }

  // --- 3. Wishlist concentration: group by category + districtId ---
  const wishlists = await base44.asServiceRole.entities.KemetroWishlist.filter({}, '-created_date', 500);
  const wishlistGroups = {};
  for (const w of wishlists) {
    if (!w.districtId) continue;
    const key = `${w.districtId}:${w.category || 'flooring'}`;
    if (!wishlistGroups[key]) wishlistGroups[key] = [];
    wishlistGroups[key].push(w.created_by || w.userId);
  }
  for (const [key, userIds] of Object.entries(wishlistGroups)) {
    const unique = [...new Set(userIds)];
    if (unique.length < 5) continue;
    const [districtId, category] = key.split(':');
    const existing = await base44.asServiceRole.entities.DemandSignal.filter({
      signalType: 'wishlist_concentration', locationDistrictId: districtId, productCategory: category, status: 'detected'
    });
    if (existing.length > 0) continue;
    signals.push({
      signalType: 'wishlist_concentration',
      productCategory: category,
      locationDistrictId: districtId,
      estimatedBuyerCount: unique.length,
      estimatedDemandQty: unique.length * 60,
      signalStrength: Math.min(100, unique.length * 10),
      confidenceScore: 65,
      potentialGroupBuyValue: unique.length * 60 * 220,
      estimatedSavingsIfGrouped: Math.round(unique.length * 60 * 220 * 0.2),
      targetUserIds: unique.slice(0, 30),
      status: 'detected',
      detectedAt: now,
      expiresAt,
    });
  }

  // --- Save all new signals ---
  const created = [];
  for (const signal of signals) {
    const s = await base44.asServiceRole.entities.DemandSignal.create(signal);
    created.push(s.id);
  }

  // --- Auto-trigger offer generation for high-confidence signals ---
  const highConfidence = signals.filter(s => s.confidenceScore >= 80 && s.estimatedBuyerCount >= 8);
  for (const signal of highConfidence) {
    const signalRecord = created[signals.indexOf(signal)];
    if (signalRecord) {
      base44.asServiceRole.functions.invoke('generateGroupBuyOffer', { signalId: signalRecord }).catch(() => {});
    }
  }

  return Response.json({
    success: true,
    signalsCreated: created.length,
    breakdown: {
      boqClusters: signals.filter(s => s.signalType === 'boq_multiple_users').length,
      finishClusters: signals.filter(s => s.signalType === 'finish_projects_cluster').length,
      wishlistClusters: signals.filter(s => s.signalType === 'wishlist_concentration').length,
    },
    autoTriggered: highConfidence.length,
  });
});