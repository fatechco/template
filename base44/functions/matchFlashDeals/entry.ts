import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { userId } = await req.json().catch(() => ({}));
  const targetUserId = userId || user.id;

  // Collect user's needed categories from BOQ + Finish projects
  const [buildProjects, finishProjects] = await Promise.all([
    base44.asServiceRole.entities.BuildProject.filter({ created_by: targetUserId }),
    base44.asServiceRole.entities.FinishProject.filter({ created_by: targetUserId }),
  ]);

  const neededCategories = new Set();
  const userDistrictIds = new Set();
  const userCityIds = new Set();

  for (const p of buildProjects) {
    if (p.districtId) userDistrictIds.add(p.districtId);
    if (p.cityId) userCityIds.add(p.cityId);
    if (p.boqData?.boqSections) {
      for (const sec of p.boqData.boqSections) {
        for (const item of (sec.items || [])) {
          if (item.category) neededCategories.add(item.category);
        }
      }
    }
    if (p.finishingPreferences?.flooringMaterial) neededCategories.add('flooring');
    if (p.finishingPreferences?.kitchenStyle) neededCategories.add('kitchen');
    if (p.projectType?.includes('bathroom')) neededCategories.add('bathroom_fixtures');
  }

  for (const p of finishProjects) {
    if (p.cityId) userCityIds.add(p.cityId);
    neededCategories.add('flooring');
    neededCategories.add('tiles');
    neededCategories.add('paint');
  }

  // Default categories if no projects
  if (neededCategories.size === 0) {
    ['flooring', 'paint', 'tiles', 'electrical', 'plumbing', 'wall_tiles'].forEach(c => neededCategories.add(c));
  }

  // Get active flash deals + forming compound deals
  const [allFlashDeals, compoundDeals] = await Promise.all([
    base44.asServiceRole.entities.FlashDeal.filter({ status: 'active' }),
    base44.asServiceRole.entities.CompoundDeal.filter({ status: 'forming' }),
  ]);

  // Score flash deals
  const scoredFlash = allFlashDeals.map(deal => {
    let score = 0;
    const catMatch = neededCategories.has(deal.category);
    const partialCatMatch = !catMatch && [...neededCategories].some(c => deal.category?.includes(c) || c.includes(deal.category));

    if (catMatch) score += 40;
    else if (partialCatMatch) score += 20;

    // Location relevance
    if (deal.availableNationwide) score += 10;
    else if (deal.availableInCityIds?.some(c => userCityIds.has(c))) score += 20;

    // Urgency — prefer deals ending soon
    const hoursLeft = (new Date(deal.dealEndsAt).getTime() - Date.now()) / 3600000;
    if (hoursLeft < 6) score += 30;
    else if (hoursLeft < 24) score += 20;
    else if (hoursLeft < 72) score += 10;
    else score += 5;

    // Discount quality
    if (deal.discountPercent >= 40) score += 20;
    else if (deal.discountPercent >= 25) score += 15;
    else if (deal.discountPercent >= 15) score += 10;

    // Stock scarcity boost
    if (deal.stockRemaining > 0 && deal.totalStockAvailable > 0 &&
        deal.stockRemaining < deal.totalStockAvailable * 0.2) score += 8;

    const reason = catMatch
      ? `Matches your ${deal.category} project needs`
      : deal.availableNationwide ? 'Nationwide deal — great savings'
      : 'Recommended for your project type';

    return { ...deal, matchScore: score, matchReason: reason, dealKind: 'flash' };
  });

  // Score compound deals
  const scoredCompound = compoundDeals.map(deal => {
    let score = 0;
    const catMatch = neededCategories.has(deal.productCategory) || neededCategories.has('tiles') || neededCategories.has('flooring');
    if (catMatch) score += 40;

    if (userDistrictIds.has(deal.districtId)) score += 35;
    else if (userCityIds.has(deal.cityId)) score += 20;

    // Tier proximity — more participants = better price
    const progress = (deal.currentParticipants || 0) / (deal.minParticipants || 10);
    if (progress >= 0.8) score += 20; // almost at threshold
    else if (progress >= 0.5) score += 10;

    return { ...deal, matchScore: score, matchReason: `Group buy near you — ${deal.currentParticipants || 0}/${deal.minParticipants} joined`, dealKind: 'compound' };
  });

  const sortedFlash = scoredFlash.sort((a, b) => b.matchScore - a.matchScore).slice(0, 8);
  const sortedCompound = scoredCompound.sort((a, b) => b.matchScore - a.matchScore).slice(0, 4);

  return Response.json({
    success: true,
    flashDeals: sortedFlash,
    compoundDeals: sortedCompound,
    totalActiveFlash: allFlashDeals.length,
    totalCompound: compoundDeals.length,
    userCategories: [...neededCategories],
  });
});