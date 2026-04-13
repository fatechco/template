import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { propertyId, action, matchProfileId, viewDuration, photosViewed, cardPositionInStack } = await req.json();
  if (!propertyId || !action) return Response.json({ error: 'Missing required fields' }, { status: 400 });

  // 1. Record the swipe
  const swipe = await base44.entities.PropertySwipe.create({
    userId: user.id,
    propertyId,
    matchProfileId: matchProfileId || null,
    action,
    viewDuration: viewDuration || 0,
    photosViewed: photosViewed || 1,
    cardPositionInStack: cardPositionInStack || 1,
    swipedAt: new Date().toISOString()
  });

  // 2. Update MatchProfile stats + AI learning
  if (matchProfileId) {
    const profiles = await base44.entities.MatchProfile.filter({ id: matchProfileId });
    if (profiles.length) {
      const p = profiles[0];
      const updates = {
        totalSwipes: (p.totalSwipes || 0) + 1,
        swipeCount: (p.swipeCount || 0) + 1,
        lastActiveAt: new Date().toISOString()
      };
      if (action === 'like') updates.totalLikes = (p.totalLikes || 0) + 1;
      if (action === 'pass') updates.totalPasses = (p.totalPasses || 0) + 1;
      if (action === 'super_like') updates.totalSuperLikes = (p.totalSuperLikes || 0) + 1;

      // AI learning: update weights based on swipe
      const ai = p.aiLearnedPreferences || { detectedWeights: {}, preferredNeighborhoods: [], preferredCities: [] };
      if (!ai.detectedWeights) ai.detectedWeights = {};
      if (!ai.preferredNeighborhoods) ai.preferredNeighborhoods = [];

      if (action === 'like' || action === 'super_like') {
        const multiplier = action === 'super_like' ? 3 : 1;
        // Long engagement = strong signal
        const engagementMultiplier = viewDuration > 30 ? 2 : viewDuration < 5 ? 0.3 : 1;

        const props = await base44.entities.Property.filter({ id: propertyId });
        if (props.length) {
          const prop = props[0];
          // Learn district preference
          if (prop.district_id && !ai.preferredNeighborhoods.includes(prop.district_id)) {
            ai.preferredNeighborhoods.push(prop.district_id);
          }
          if (prop.city_id && !ai.preferredCities?.includes(prop.city_id)) {
            ai.preferredCities = [...(ai.preferredCities || []), prop.city_id];
          }
          // Learn amenity weights
          if (prop.amenity_ids?.length) {
            for (const amenity of prop.amenity_ids) {
              const key = `amenity_${amenity}`;
              ai.detectedWeights[key] = Math.min(1, (ai.detectedWeights[key] || 0) + 0.1 * multiplier * engagementMultiplier);
            }
          }
          // Learn floor preference
          if (prop.floor_number) {
            ai.detectedWeights[`floor_${prop.floor_number}`] = Math.min(1, (ai.detectedWeights[`floor_${prop.floor_number}`] || 0) + 0.05 * multiplier);
          }
          // Learn price preference relative to budget
          if (p.budgetMax && prop.price_amount) {
            const ratio = prop.price_amount / p.budgetMax;
            if (ratio < 0.85) ai.pricePreference = 'below_market';
            else if (ratio > 1.0) ai.pricePreference = 'at_market';
          }
        }
      } else if (action === 'pass') {
        // Negative signal — reduce weights
        const props = await base44.entities.Property.filter({ id: propertyId });
        if (props.length) {
          const prop = props[0];
          if (prop.amenity_ids?.length) {
            for (const amenity of prop.amenity_ids) {
              const key = `amenity_${amenity}`;
              if (ai.detectedWeights[key]) {
                ai.detectedWeights[key] = Math.max(0, ai.detectedWeights[key] - 0.05);
              }
            }
          }
        }
      }

      updates.aiLearnedPreferences = ai;
      updates.aiConfidenceScore = Math.min(100, Math.floor((updates.swipeCount / 50) * 100));
      await base44.entities.MatchProfile.update(matchProfileId, updates);
    }
  }

  // 3. Check for match on like/super_like
  let match = null;
  let isMatch = false;

  if (action === 'like' || action === 'super_like') {
    // Check if a PropertyMatch record already exists where seller initiated
    const existingMatches = await base44.entities.PropertyMatch.filter({ propertyId, buyerId: user.id });

    const pendingSellerInitiated = existingMatches.find(m =>
      m.sellerAction && !m.buyerAction && m.status === 'matched'
    );

    if (pendingSellerInitiated) {
      // Seller already liked back — it's now a MUTUAL match
      match = await base44.entities.PropertyMatch.update(pendingSellerInitiated.id, {
        buyerAction: action,
        buyerActionAt: new Date().toISOString(),
        status: 'matched',
        matchScore: Math.floor(70 + Math.random() * 30)
      });
      isMatch = true;
    } else if (!existingMatches.length) {
      // First time — create a pending record (buyer liked, waiting for seller)
      const props = await base44.entities.Property.filter({ id: propertyId });
      if (props.length) {
        await base44.entities.PropertyMatch.create({
          buyerId: user.id,
          sellerId: props[0].created_by || null,
          propertyId,
          buyerAction: action,
          buyerActionAt: new Date().toISOString(),
          // No sellerAction yet — pending
          matchScore: Math.floor(60 + Math.random() * 40),
          status: 'matched', // pre-marked, completes when seller likes back
          expiresAt: new Date(Date.now() + 7 * 86400000).toISOString()
        });
      }
    }
    // else: already swiped this property — no-op
  }

  return Response.json({ swipe, match, isMatch });
});