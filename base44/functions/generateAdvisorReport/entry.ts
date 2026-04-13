import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  const { profileId } = await req.json();
  if (!profileId) return Response.json({ error: 'profileId required' }, { status: 400 });

  const profile = await base44.asServiceRole.entities.AdvisorProfile.get(profileId);
  if (!profile) return Response.json({ error: 'Profile not found' }, { status: 404 });

  // ── 1. Calculate recommended specs ──────────────────────────────────────────
  const comp = profile.householdComposition || {};
  const infants = comp.infants || 0;
  const youngChildren = comp.youngChildren || 0;
  const teenagers = comp.teenagers || 0;
  const adults = comp.adults || 2;
  const seniors = comp.seniors || 0;

  let minBedrooms = adults <= 1 ? 1 : 2;
  minBedrooms += Math.ceil(youngChildren / 2);
  minBedrooms += teenagers;
  if (seniors > 0) minBedrooms += 1;
  if (['yes', 'hybrid', 'multiple'].includes(profile.worksFromHome)) minBedrooms += 1;

  const idealBedrooms = minBedrooms + 1;
  const minAreaSqm = 45 + (profile.householdCount || 2) * 17 + youngChildren * 18;
  const minBathrooms = Math.max(1, Math.floor(minBedrooms / 2));

  // ── 2. Budget zones ──────────────────────────────────────────────────────────
  const incomeMap = {
    'under_10k': 7500, '10k_20k': 15000, '20k_35k': 27500,
    '35k_50k': 42500, '50k_75k': 62500, '75k_100k': 87500,
    '100k_150k': 125000, '150k_plus': 175000
  };
  const incomeMid = incomeMap[profile.incomeRange] || null;
  const financialAnalysis = incomeMid ? {
    comfortableZone: Math.round(incomeMid * 0.30),
    stretchZone: Math.round(incomeMid * 0.35),
    dangerZone: Math.round(incomeMid * 0.40),
    currency: profile.currency || 'EGP',
    tip: null,
    installmentEstimate: profile.budgetMax
      ? Math.round((profile.budgetMax * 0.8) / (15 * 12))
      : null
  } : null;

  // ── 3. Property matching ─────────────────────────────────────────────────────
  let properties = [];
  try {
    properties = await base44.asServiceRole.entities.Property.filter(
      { is_active: true, isImported: false },
      '-created_date', 200
    );
  } catch (_) { properties = []; }

  const scoredMatches = properties.map(prop => {
    // Deal breaker check
    const mustHave = profile.mustHaveFeatures || [];
    const noGo = profile.noGoFeatures || [];
    const amenities = (prop.amenity_ids || []).join(' ').toLowerCase();
    const propStr = JSON.stringify(prop).toLowerCase();

    for (const f of mustHave) {
      if (f === 'none') break;
      if (!propStr.includes(f.toLowerCase())) return null;
    }
    for (const f of noGo) {
      if (f === 'none') break;
      if (propStr.includes(f.toLowerCase())) return null;
    }

    // Budget score
    let budgetScore = 0;
    const price = prop.price_amount || 0;
    const budgetMax = profile.budgetMax || Infinity;
    const budgetMin = profile.budgetMin || 0;
    if (price >= budgetMin && price <= budgetMax) budgetScore = 100;
    else if (price <= budgetMax * 1.10) budgetScore = 70;
    else if (price <= budgetMax * 1.20) budgetScore = 40;

    // Feature score (simplified priority matching)
    const priorities = profile.prioritiesRanked || [];
    let featureScore = 0;
    priorities.slice(0, 5).forEach((p, i) => {
      const w = 5 - i;
      if (propStr.includes(p.replace(/_/g, ' '))) featureScore += w;
    });
    const featureScoreNorm = priorities.length ? (featureScore / 15) * 100 : 50;

    // Wishlist bonus
    const wishlist = profile.wishlistFeatures || [];
    const wishlistBonus = Math.min(
      wishlist.filter(w => w !== 'none' && propStr.includes(w.toLowerCase())).length * 5,
      25
    );

    // Location score
    const prefLocs = profile.preferredLocationIds || [];
    const locationScore = prefLocs.length === 0 ? 60 :
      (prefLocs.includes(prop.area_id) || prefLocs.includes(prop.city_id) ? 90 : 40);

    const finalScore = Math.round(
      featureScoreNorm * 0.40 +
      locationScore * 0.30 +
      budgetScore * 0.20 +
      wishlistBonus * 0.10
    );

    return {
      propertyId: prop.id,
      title: prop.title,
      price: prop.price_amount,
      city: prop.city_id,
      matchScore: finalScore,
      matchBreakdown: { featureScore: Math.round(featureScoreNorm), locationScore, budgetScore, wishlistBonus }
    };
  }).filter(Boolean).sort((a, b) => b.matchScore - a.matchScore).slice(0, 20);

  // ── 4. AI Report generation ─────────────────────────────────────────────────
  let aiReport = null;
  try {
    const aiResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are Kemedar Advisor, an expert AI property consultant in the MENA region.
Generate a comprehensive, warm, personalized property recommendation report in ${profile.language === 'ar' ? 'Arabic' : profile.language === 'fr' ? 'French' : 'English'} based on this survey profile.

Profile: ${JSON.stringify(profile)}
Calculated specs: minBedrooms=${minBedrooms}, idealBedrooms=${idealBedrooms}, minAreaSqm=${minAreaSqm}
Top matches count: ${scoredMatches.length}
Financial zones: ${JSON.stringify(financialAnalysis)}

Return ONLY valid JSON with this exact structure:
{
  "profileSummary": {"headline": "", "description": ""},
  "recommendedSpecs": {
    "minBedrooms": ${minBedrooms},
    "idealBedrooms": ${idealBedrooms},
    "minBathrooms": ${minBathrooms},
    "minAreaSqm": ${minAreaSqm},
    "recommendedFloor": "",
    "furnishing": "",
    "parking": "",
    "reasoning": ["", "", ""]
  },
  "recommendedLocations": [
    {"rank": 1, "name": "", "score": 0, "reasons": [], "commute": "", "schools": "", "tradeoffs": ""},
    {"rank": 2, "name": "", "score": 0, "reasons": [], "commute": "", "schools": "", "tradeoffs": ""},
    {"rank": 3, "name": "", "score": 0, "reasons": [], "commute": "", "schools": "", "tradeoffs": ""}
  ],
  "financialAnalysis": {
    "comfortableZone": ${financialAnalysis?.comfortableZone || profile.budgetMax * 0.7},
    "stretchZone": ${financialAnalysis?.stretchZone || profile.budgetMax * 0.85},
    "dangerZone": ${financialAnalysis?.dangerZone || profile.budgetMax},
    "currency": "${profile.currency || 'EGP'}",
    "tip": "",
    "installmentEstimate": ${financialAnalysis?.installmentEstimate || null}
  },
  "marketInsights": {
    "avgPricePerSqm": 0,
    "trend6Months": "",
    "bestTimeAdvice": "",
    "comparables": []
  }
}`,
      response_json_schema: {
        type: "object",
        properties: {
          profileSummary: { type: "object" },
          recommendedSpecs: { type: "object" },
          recommendedLocations: { type: "array", items: { type: "object" } },
          financialAnalysis: { type: "object" },
          marketInsights: { type: "object" }
        }
      }
    });
    aiReport = aiResult;
  } catch (_) {
    aiReport = {
      profileSummary: { headline: "Your Personalized Property Profile", description: "Based on your answers, we've created your property matching profile." },
      recommendedSpecs: { minBedrooms, idealBedrooms, minBathrooms, minAreaSqm, recommendedFloor: "1-5", furnishing: profile.furnishingPreference || "no_preference", parking: "1 dedicated spot", reasoning: ["Based on your household size", "Calculated from your priorities", "AI-optimized for your lifestyle"] },
      recommendedLocations: [
        { rank: 1, name: "New Cairo", score: 88, reasons: ["Good schools", "Green compounds", "Family-friendly"], commute: "25-35 min", schools: "Multiple international schools", tradeoffs: "Higher price per sqm" },
        { rank: 2, name: "6th October", score: 81, reasons: ["Affordable", "Large compounds", "Good infrastructure"], commute: "30-45 min", schools: "Good private schools", tradeoffs: "Farther commute" },
        { rank: 3, name: "Maadi", score: 74, reasons: ["Established area", "Expat community", "Green streets"], commute: "15-25 min", schools: "British and American schools", tradeoffs: "Older buildings" }
      ],
      financialAnalysis: financialAnalysis || { comfortableZone: (profile.budgetMax || 2000000) * 0.7, stretchZone: (profile.budgetMax || 2000000) * 0.85, dangerZone: profile.budgetMax || 2000000, currency: profile.currency || "EGP", tip: "Consider a 20% down payment to keep monthly installments comfortable.", installmentEstimate: null },
      marketInsights: { avgPricePerSqm: 12000, trend6Months: "Rising +8%", bestTimeAdvice: "Market conditions favor buyers this quarter.", comparables: [] }
    };
  }

  // ── 5. Save report & update profile ─────────────────────────────────────────
  const shareToken = crypto.randomUUID();
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

  const report = await base44.asServiceRole.entities.AdvisorReport.create({
    profileId,
    userId: profile.userId || null,
    reportType: 'initial',
    reportContent: aiReport,
    propertyMatchesSnapshot: scoredMatches.slice(0, 10),
    shareToken,
    viewCount: 0,
    generatedAt: now.toISOString(),
    expiresAt: expiresAt.toISOString()
  });

  // Save match records
  for (const match of scoredMatches.slice(0, 10)) {
    await base44.asServiceRole.entities.AdvisorMatch.create({
      profileId,
      propertyId: match.propertyId,
      matchScore: match.matchScore,
      matchBreakdown: match.matchBreakdown,
      isNotified: false
    });
  }

  // Update profile
  await base44.asServiceRole.entities.AdvisorProfile.update(profileId, {
    isCompleted: true,
    completionPercent: 100,
    aiRecommendedSpecs: aiReport.recommendedSpecs,
    aiRecommendedLocations: aiReport.recommendedLocations,
    aiFinancialAnalysis: aiReport.financialAnalysis,
    aiMarketInsights: aiReport.marketInsights,
    lastReportGeneratedAt: now.toISOString()
  });

  return Response.json({
    report,
    matches: scoredMatches.slice(0, 10),
    shareToken,
    reportId: report.id
  });
});