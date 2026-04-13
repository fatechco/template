import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const targetUserId = body.userId || user.id;

    // Admin can recalculate any user, others only self
    if (targetUserId !== user.id && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Get all signals from last 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const allSignals = await base44.asServiceRole.entities.DNASignal.filter({ userId: targetUserId });
    const signals = allSignals.filter(s => s.timestamp >= ninetyDaysAgo);

    const now = Date.now();
    const sevenDays = 7 * 24 * 60 * 60 * 1000;
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;

    // Time-decay weight
    const weightedSignal = (signal) => {
      const age = now - new Date(signal.timestamp).getTime();
      if (age <= sevenDays) return 3;
      if (age <= thirtyDays) return 2;
      return 1;
    };

    // --- PROPERTY DNA ---
    const propSignals = signals.filter(s => s.signalType.startsWith('property_') || s.signalType.startsWith('match_'));
    const propertyTypeMap = {};
    const sizeData = [];
    const featureMap = {};

    propSignals.forEach(s => {
      const w = weightedSignal(s);
      if (s.metadata?.propertyType) {
        propertyTypeMap[s.metadata.propertyType] = (propertyTypeMap[s.metadata.propertyType] || 0) + w;
      }
      if (s.metadata?.area && ['property_saved', 'property_offer_made'].includes(s.signalType)) {
        const mult = s.signalType === 'property_offer_made' ? 5 : 3;
        for (let i = 0; i < mult; i++) sizeData.push(s.metadata.area);
      }
      if (s.metadata?.features && Array.isArray(s.metadata.features)) {
        s.metadata.features.forEach(f => {
          featureMap[f] = (featureMap[f] || 0) + w;
        });
      }
    });

    const preferredTypes = Object.entries(propertyTypeMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([type, score]) => ({ type, score, confidence: Math.min(100, score * 10) }));

    const avgSize = sizeData.length > 0 ? Math.round(sizeData.reduce((a, b) => a + b, 0) / sizeData.length) : null;
    const preferredSizes = avgSize ? { min: Math.round(avgSize * 0.8), max: Math.round(avgSize * 1.2), sweet_spot: avgSize } : null;

    const preferredFeatures = Object.entries(featureMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([feature, count]) => ({ feature, weight: Math.min(1, count / 10) }));

    const propertyDNA = {
      preferredTypes,
      preferredSizes,
      preferredFeatures,
      viewedPropertyTypes: preferredTypes.slice(0, 3)
    };

    // --- FINANCIAL DNA ---
    const priceData = signals.filter(s => s.metadata?.price).map(s => ({
      price: s.metadata.price,
      weight: weightedSignal(s),
      type: s.signalType
    }));

    let budgetMin = null, budgetMax = null;
    if (priceData.length > 0) {
      const prices = priceData.map(p => p.price).sort((a, b) => a - b);
      budgetMin = prices[Math.floor(prices.length * 0.1)];
      budgetMax = prices[Math.floor(prices.length * 0.9)];
    }

    const financialDNA = {
      budgetRange: budgetMin ? { min: budgetMin, max: budgetMax, currency: 'EGP' } : null,
      budgetFlexibility: 'unknown',
      paymentMethodPreference: 'cash',
      escrowUsed: signals.some(s => s.signalType === 'escrow_created')
    };

    // --- TIMING DNA ---
    const sessionSignals = signals.filter(s => s.signalType === 'session_started');
    const hourCounts = {};
    const dayCounts = {};

    sessionSignals.forEach(s => {
      const d = new Date(s.timestamp);
      const hour = d.getHours();
      const day = d.getDay();
      hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      dayCounts[day] = (dayCounts[day] || 0) + 1;
    });

    const mostActiveHour = Object.keys(hourCounts).length > 0
      ? parseInt(Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0][0])
      : 20;

    const mostActiveDayOfWeek = Object.keys(dayCounts).length > 0
      ? parseInt(Object.entries(dayCounts).sort((a, b) => b[1] - a[1])[0][0])
      : 5;

    const deviceCounts = {};
    signals.forEach(s => { if (s.deviceType) deviceCounts[s.deviceType] = (deviceCounts[s.deviceType] || 0) + 1; });
    const mostActiveDevice = Object.keys(deviceCounts).length > 0
      ? Object.entries(deviceCounts).sort((a, b) => b[1] - a[1])[0][0]
      : 'mobile';

    const timingDNA = {
      mostActiveHour,
      mostActiveDayOfWeek,
      mostActiveDevice,
      avgSessionsPerWeek: Math.round(sessionSignals.length / 12),
      preferredNotificationTime: { hour: mostActiveHour, timezone: 'Africa/Cairo' }
    };

    // --- GEOGRAPHIC DNA ---
    const geoSignals = signals.filter(s => s.metadata?.cityId || s.metadata?.districtId);
    const cityMap = {};
    const districtMap = {};

    geoSignals.forEach(s => {
      const w = weightedSignal(s);
      if (s.metadata?.cityId) cityMap[s.metadata.cityId] = (cityMap[s.metadata.cityId] || 0) + w;
      if (s.metadata?.districtId) districtMap[s.metadata.districtId] = (districtMap[s.metadata.districtId] || 0) + w;
    });

    const targetCities = Object.entries(cityMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([cityId, score]) => ({ cityId, score: Math.min(100, score * 5), searchCount: score }));

    const targetDistricts = Object.entries(districtMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([districtId, score]) => ({ districtId, score: Math.min(100, score * 5) }));

    const geographicDNA = { targetCities, targetDistricts, geoExpansionTrend: 'stable' };

    // --- INTENT DNA ---
    const savedCount = signals.filter(s => s.signalType === 'property_saved').length;
    const offerMade = signals.some(s => s.signalType === 'property_offer_made');
    const escrowCreated = signals.some(s => s.signalType === 'escrow_created');

    let buyerStage = 'awareness';
    if (escrowCreated) buyerStage = 'purchase';
    else if (offerMade) buyerStage = 'decision';
    else if (savedCount >= 5) buyerStage = 'consideration';

    const recentSessions = signals.filter(s => s.signalType === 'session_started' && new Date(s.timestamp) > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000));
    const isActiveRecently = recentSessions.length > 3;

    const intentDNA = {
      primaryIntent: 'buy',
      urgencyLevel: offerMade ? 'immediate' : savedCount > 10 ? '3months' : 'exploring',
      urgencyTrend: isActiveRecently ? 'increasing' : 'stable',
      buyerStage,
      intentConfidence: Math.min(100, signals.length * 2),
      isExpat: false,
      isInvestor: false
    };

    // --- PLATFORM DNA ---
    const featureVisits = signals.filter(s => s.signalType === 'feature_visited');
    const featuresUsed = Object.entries(
      featureVisits.reduce((acc, s) => {
        if (s.metadata?.feature) acc[s.metadata.feature] = (acc[s.metadata.feature] || 0) + 1;
        return acc;
      }, {})
    ).map(([feature, usageCount]) => ({ feature, usageCount, lastUsed: new Date().toISOString() }));

    const moduleSignals = signals.filter(s => s.metadata?.module);
    const moduleCounts = moduleSignals.reduce((acc, s) => {
      acc[s.metadata.module] = (acc[s.metadata.module] || 0) + 1;
      return acc;
    }, {});

    const platformDNA = {
      featuresUsed,
      moduleUsage: {
        kemedar: moduleCounts.kemedar || 0,
        kemework: moduleCounts.kemework || 0,
        kemetro: moduleCounts.kemetro || 0,
        lastActiveModule: Object.keys(moduleCounts).sort((a, b) => moduleCounts[b] - moduleCounts[a])[0] || 'kemedar'
      }
    };

    // --- PREDICTIONS ---
    let likelyToPurchaseIn = null;
    if (buyerStage === 'decision') likelyToPurchaseIn = 30;
    else if (buyerStage === 'consideration') likelyToPurchaseIn = 90;

    const lastSession = sessions => {
      const sorted = sessions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      return sorted[0]?.timestamp;
    };
    const lastActive = lastSession(sessionSignals);
    const daysSinceActive = lastActive ? Math.round((now - new Date(lastActive).getTime()) / (1000 * 60 * 60 * 24)) : 999;

    const churnRisk = daysSinceActive > 30 ? 'high' : daysSinceActive > 14 ? 'medium' : 'low';

    const predictions = {
      likelyToPurchaseIn,
      likelyBudget: budgetMax,
      likelyArea: targetCities[0]?.cityId || null,
      likelyPropertyType: preferredTypes[0]?.type || null,
      churnRisk,
      upsellReadiness: savedCount > 15 ? 'ready' : savedCount > 5 ? 'considering' : 'not_ready',
      nextLikelyAction: buyerStage === 'decision' ? 'make_offer' : buyerStage === 'consideration' ? 'save_property' : 'browse',
      nextLikelyActionConfidence: Math.min(90, signals.length)
    };

    // Calculate completeness
    const dimensions = { propertyDNA, financialDNA, timingDNA, geographicDNA, intentDNA, platformDNA };
    const filledCount = Object.values(dimensions).filter(d => d && Object.keys(d).length > 0).length;
    const dnaCompleteness = Math.round((filledCount / 8) * 100) + Math.min(20, signals.length);

    const updateData = {
      propertyDNA,
      financialDNA,
      timingDNA,
      geographicDNA,
      intentDNA,
      platformDNA,
      predictions,
      dnaCompleteness: Math.min(100, dnaCompleteness),
      lastRecalculated: new Date().toISOString(),
      totalSignalsProcessed: signals.length
    };

    // Get existing DNA
    const existing = await base44.asServiceRole.entities.UserDNA.filter({ userId: targetUserId });
    let dna = existing[0];

    if (dna) {
      await base44.asServiceRole.entities.UserDNA.update(dna.id, updateData);
    } else {
      dna = await base44.asServiceRole.entities.UserDNA.create({ userId: targetUserId, dnaVersion: '1.0', ...updateData });
    }

    // Generate AI insights
    const insightPrompt = `Analyze this real estate platform user's behavioral DNA profile and generate 3 actionable insights.

DNA Profile:
- Buyer Stage: ${buyerStage}
- Intent: ${intentDNA.primaryIntent} (${intentDNA.urgencyLevel} urgency)
- Properties saved: ${savedCount}
- Offer made: ${offerMade}
- Churn risk: ${churnRisk}
- Days since active: ${daysSinceActive}
- Preferred areas: ${targetCities.map(c => c.cityId).join(', ')}
- Total signals: ${signals.length}

Return JSON: {"insights": [{"type": "behavior_pattern|opportunity|intent_shift|churn_risk", "title": string, "body": string, "confidence": 0-100, "impact": "high|medium|low", "actionRecommended": string, "actionUrl": string}]}`;

    const insightResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: insightPrompt,
      response_json_schema: {
        type: "object",
        properties: {
          insights: {
            type: "array",
            items: {
              type: "object",
              properties: {
                type: { type: "string" },
                title: { type: "string" },
                body: { type: "string" },
                confidence: { type: "number" },
                impact: { type: "string" },
                actionRecommended: { type: "string" },
                actionUrl: { type: "string" }
              }
            }
          }
        }
      }
    });

    if (insightResult?.insights) {
      const validUntil = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      for (const insight of insightResult.insights.slice(0, 5)) {
        await base44.asServiceRole.entities.DNAInsight.create({
          userId: targetUserId,
          insightType: insight.type || 'behavior_pattern',
          insightTitle: insight.title,
          insightBody: insight.body,
          confidence: insight.confidence || 70,
          impact: insight.impact || 'medium',
          actionRecommended: insight.actionRecommended,
          actionUrl: insight.actionUrl,
          isShownToUser: true,
          isShownToAdmin: true,
          validUntil
        });
      }
    }

    return Response.json({
      success: true,
      dnaCompleteness: Math.min(100, dnaCompleteness),
      buyerStage,
      churnRisk,
      signalsProcessed: signals.length,
      insightsGenerated: insightResult?.insights?.length || 0
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});