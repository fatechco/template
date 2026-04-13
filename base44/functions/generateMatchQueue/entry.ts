import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { matchProfileId, count = 50 } = await req.json();

  const [profiles, allProperties, swipes, matches] = await Promise.all([
    base44.entities.MatchProfile.filter({ id: matchProfileId, userId: user.id }),
    base44.entities.Property.filter({ status: 'active' }, '-created_date', 500),
    base44.entities.PropertySwipe.filter({ userId: user.id }),
    base44.entities.PropertyMatch.filter({ buyerId: user.id })
  ]);

  if (!profiles.length) return Response.json({ error: 'Match profile not found' }, { status: 404 });

  const profile = profiles[0];
  const swipedIds = new Set(swipes.map(s => s.propertyId));
  const matchedIds = new Set(matches.map(m => m.propertyId));

  // Step A: Filter
  let filtered = allProperties.filter(p => {
    if (swipedIds.has(p.id) || matchedIds.has(p.id)) return false;
    if (p.created_by === user.id) return false;
    if (profile.purpose === 'buy' && p.purpose && !p.purpose.toLowerCase().includes('sale')) return false;
    if (profile.purpose === 'rent' && p.purpose && !p.purpose.toLowerCase().includes('rent')) return false;
    if (profile.budgetMin && p.price_amount < profile.budgetMin * 0.8) return false;
    if (profile.budgetMax && p.price_amount > profile.budgetMax * 1.2) return false;
    if (profile.preferredCityIds?.length && p.city_id && !profile.preferredCityIds.includes(p.city_id)) return false;
    if (profile.bedroomsMin && p.beds && p.beds < profile.bedroomsMin) return false;
    if (profile.propertyTypes?.length && p.category_name && !profile.propertyTypes.some(t => p.category_name.toLowerCase().includes(t.toLowerCase()))) return false;
    return true;
  });

  // Step B: Score with AI learned weights
  const ai = profile.aiLearnedPreferences || {};
  const scored = filtered.map(p => {
    let score = 50;
    if (ai.preferredNeighborhoods?.includes(p.district_id)) score += 20;
    if (ai.pricePreference === 'below_market' && profile.budgetMax && p.price_amount < profile.budgetMax * 0.9) score += 10;
    if (p.tourScenes?.length > 0 || p.virtual_tour) score += 10;
    if (p.is_verified) score += 8;
    const daysSinceListed = (Date.now() - new Date(p.created_date)) / 86400000;
    if (daysSinceListed < 7) score += 7;
    if (ai.detectedWeights) {
      if (ai.detectedWeights.pool && p.amenity_ids?.includes('Pool')) score += ai.detectedWeights.pool * 15;
      if (ai.detectedWeights.parking && p.amenity_ids?.includes('Parking')) score += ai.detectedWeights.parking * 10;
    }
    return { ...p, _score: score };
  });

  scored.sort((a, b) => b._score - a._score);

  // Step C: Variety mix
  const topCount = Math.floor(count * 0.6);
  const wildCount = Math.floor(count * 0.15);
  const popularCount = Math.floor(count * 0.15);
  const newCount = count - topCount - wildCount - popularCount;

  const top = scored.slice(0, topCount);
  const wildcards = filtered.filter(p => !top.find(t => t.id === p.id)).sort(() => Math.random() - 0.5).slice(0, wildCount);
  const newListings = allProperties.filter(p => {
    const days = (Date.now() - new Date(p.created_date)) / 86400000;
    return days < 1 && !swipedIds.has(p.id);
  }).slice(0, newCount);
  const popular = scored.filter(p => !top.find(t => t.id === p.id) && !wildcards.find(w => w.id === p.id)).slice(0, popularCount);

  const combined = [...top, ...wildcards, ...popular, ...newListings];
  const propertyIds = combined.map(p => p.id);

  // Save queue
  const existingQueues = await base44.entities.MatchQueue.filter({ userId: user.id, isActive: true });
  for (const q of existingQueues) {
    await base44.entities.MatchQueue.update(q.id, { isActive: false });
  }

  const queue = await base44.entities.MatchQueue.create({
    userId: user.id,
    matchProfileId,
    propertyIds,
    currentIndex: 0,
    generatedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 86400000).toISOString(),
    totalInQueue: propertyIds.length,
    isActive: true,
    aiFiltersApplied: { purpose: profile.purpose, budgetMin: profile.budgetMin, budgetMax: profile.budgetMax },
    aiSortingWeights: ai.detectedWeights || {}
  });

  return Response.json({ queue, properties: combined.slice(0, 10) });
});