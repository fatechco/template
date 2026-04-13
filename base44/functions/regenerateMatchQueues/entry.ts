import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Called daily by automation — regenerates expired queues for active users
Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Use service role since this is a background job
  const now = new Date().toISOString();

  // Find all active match profiles that were active in the last 7 days
  const allProfiles = await base44.asServiceRole.entities.MatchProfile.filter({ isActive: true });

  const recentProfiles = allProfiles.filter(p =>
    p.lastActiveAt && new Date(p.lastActiveAt) > new Date(Date.now() - 7 * 86400000)
  );

  let regenerated = 0;
  let errors = 0;

  for (const profile of recentProfiles) {
    try {
      // Check if they have a fresh queue
      const queues = await base44.asServiceRole.entities.MatchQueue.filter({
        userId: profile.userId,
        isActive: true
      });

      const hasValidQueue = queues.some(q =>
        q.expiresAt && new Date(q.expiresAt) > new Date()
      );

      if (!hasValidQueue) {
        // Expire old queues
        for (const q of queues) {
          await base44.asServiceRole.entities.MatchQueue.update(q.id, { isActive: false });
        }

        // Get already-swiped IDs
        const swipes = await base44.asServiceRole.entities.PropertySwipe.filter({ userId: profile.userId });
        const swipedIds = new Set(swipes.map(s => s.propertyId));

        // Get active properties matching profile
        let filteredProps = await base44.asServiceRole.entities.Property.filter({ status: 'active' }, '-created_date', 200);

        // Apply basic filters
        filteredProps = filteredProps.filter(p => {
          if (swipedIds.has(p.id)) return false;
          if (p.created_by === profile.userId) return false;
          if (profile.budgetMin && p.price_amount < profile.budgetMin * 0.8) return false;
          if (profile.budgetMax && p.price_amount > profile.budgetMax * 1.2) return false;
          return true;
        });

        // AI scoring based on learned preferences
        const ai = profile.aiLearnedPreferences || {};
        const scored = filteredProps.map(p => {
          let score = 50;
          if (ai.preferredNeighborhoods?.includes(p.district_id)) score += 20;
          if (ai.pricePreference === 'below_market' && profile.budgetMax && p.price_amount < profile.budgetMax * 0.9) score += 10;
          if (p.is_verified) score += 8;
          const daysSinceListed = (Date.now() - new Date(p.created_date)) / 86400000;
          if (daysSinceListed < 7) score += 7;
          if (daysSinceListed < 1) score += 5; // extra boost for brand new
          // Apply learned weights
          if (ai.detectedWeights && p.amenity_ids) {
            for (const amenity of p.amenity_ids) {
              const w = ai.detectedWeights[`amenity_${amenity}`] || 0;
              score += w * 15;
            }
          }
          return { id: p.id, score };
        });

        scored.sort((a, b) => b.score - a.score);

        // Variety mix: 60% top, 15% wildcards, 15% popular, 10% newest
        const total = Math.min(50, scored.length);
        const topCount = Math.floor(total * 0.6);
        const wildcardCount = Math.floor(total * 0.15);
        const newCount = total - topCount - wildcardCount;

        const top = scored.slice(0, topCount);
        const wildcards = scored.slice(topCount).sort(() => Math.random() - 0.5).slice(0, wildcardCount);
        const newest = filteredProps
          .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
          .slice(0, newCount)
          .map(p => ({ id: p.id }));

        const combined = [...top, ...wildcards, ...newest];
        // Shuffle each group mildly
        const propertyIds = combined.map(p => p.id);

        await base44.asServiceRole.entities.MatchQueue.create({
          userId: profile.userId,
          matchProfileId: profile.id,
          propertyIds,
          currentIndex: 0,
          generatedAt: now,
          expiresAt: new Date(Date.now() + 86400000).toISOString(),
          totalInQueue: propertyIds.length,
          isActive: true,
          aiFiltersApplied: {
            purpose: profile.purpose,
            budgetMin: profile.budgetMin,
            budgetMax: profile.budgetMax,
            aiConfidence: profile.aiConfidenceScore
          },
          aiSortingWeights: ai.detectedWeights || {}
        });

        regenerated++;
      }
    } catch (err) {
      errors++;
      console.error(`Failed to regenerate queue for profile ${profile.id}:`, err.message);
    }
  }

  return Response.json({
    success: true,
    processed: recentProfiles.length,
    regenerated,
    errors,
    timestamp: now
  });
});