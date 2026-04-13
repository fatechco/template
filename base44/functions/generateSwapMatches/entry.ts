import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);

  // Callable both by authenticated users and by cron (service role)
  let swapIntentId = null;
  try {
    const body = await req.json();
    swapIntentId = body?.swapIntentId ?? null;
  } catch (_e) { /* cron call may have no body */ }

  // Fetch settings
  const settingsList = await base44.asServiceRole.entities.SwapSettings.list();
  const settings = settingsList?.[0];
  const scoreThreshold = settings?.matchScoreThreshold ?? 75;
  const maxMatches = settings?.maxMatchesPerIntent ?? 20;
  const claudeModel = settings?.claudeModel ?? 'claude-sonnet-4-20250514';

  // Determine which intents to process
  let intentsToProcess = [];
  if (swapIntentId) {
    const result = await base44.asServiceRole.entities.SwapIntent.filter({ id: swapIntentId });
    if (result?.[0]) intentsToProcess = [result[0]];
  } else {
    // Weekly cron: process all active intents
    intentsToProcess = await base44.asServiceRole.entities.SwapIntent.filter({ status: 'active' }, '-publishedAt', 200);
  }

  const results = [];

  for (const intentA of intentsToProcess) {
    if (!intentA.offeredPropertyId) continue;

    // Get Party A's offered property
    const propsA = await base44.asServiceRole.entities.Property.filter({ id: intentA.offeredPropertyId });
    const propertyA = propsA?.[0];
    if (!propertyA) continue;

    const propertyAValue = intentA.offeredPropertyEstimatedValueEGP ?? propertyA.price_amount ?? 0;

    // ── STEP A: HARD FILTER ──
    // Get all other active intents
    const allIntents = await base44.asServiceRole.entities.SwapIntent.filter({ status: 'active' }, '-publishedAt', 500);
    const candidates = [];

    for (const intentB of allIntents) {
      if (intentB.id === intentA.id) continue;
      if (intentB.userId === intentA.userId) continue;
      if (!intentB.offeredPropertyId) continue;

      const propsB = await base44.asServiceRole.entities.Property.filter({ id: intentB.offeredPropertyId });
      const propertyB = propsB?.[0];
      if (!propertyB) continue;

      // Check B's property matches A's desired criteria
      const bCategoryName = propertyB.category_name ?? '';
      const bCityId = propertyB.city_id ?? '';
      const bProvinceId = propertyB.province_id ?? '';
      const bBeds = propertyB.beds ?? 0;
      const bArea = propertyB.area_size ?? 0;

      const aCategoriesOk = !intentA.desiredCategories?.length ||
        intentA.desiredCategories.some(c => bCategoryName.toLowerCase().includes(c.toLowerCase()));
      const aCitiesOk = !intentA.desiredCityIds?.length ||
        intentA.desiredCityIds.includes(bCityId) ||
        (intentA.desiredProvinceIds?.includes(bProvinceId));
      const aBedsOk = (!intentA.desiredMinBedrooms || bBeds >= intentA.desiredMinBedrooms) &&
        (!intentA.desiredMaxBedrooms || bBeds <= intentA.desiredMaxBedrooms);
      const aAreaOk = (!intentA.desiredMinAreaSqm || bArea >= intentA.desiredMinAreaSqm) &&
        (!intentA.desiredMaxAreaSqm || bArea <= intentA.desiredMaxAreaSqm);

      if (!aCategoriesOk || !aCitiesOk || !aBedsOk || !aAreaOk) continue;

      // Check A's property matches B's desired criteria
      const aCategoryName = propertyA.category_name ?? '';
      const aCityId = propertyA.city_id ?? '';
      const aProvinceId = propertyA.province_id ?? '';

      const bCategoriesOk = !intentB.desiredCategories?.length ||
        intentB.desiredCategories.some(c => aCategoryName.toLowerCase().includes(c.toLowerCase()));
      const bCitiesOk = !intentB.desiredCityIds?.length ||
        intentB.desiredCityIds.includes(aCityId) ||
        (intentB.desiredProvinceIds?.includes(aProvinceId));

      if (!bCategoriesOk || !bCitiesOk) continue;

      candidates.push({ intentB, propertyB });
    }

    // ── STEP B: FINANCIAL COMPATIBILITY ──
    const financiallyCompatible = [];

    for (const { intentB, propertyB } of candidates) {
      // Get B's estimated value
      let propertyBValue = intentB.offeredPropertyEstimatedValueEGP ?? propertyB.price_amount ?? 0;

      // If no valuation, do a quick AI estimate
      if (!intentB.offeredPropertyEstimatedValueEGP && propertyB.price_amount) {
        propertyBValue = propertyB.price_amount;
      }

      const gap = Math.abs(propertyAValue - propertyBValue);
      const equalThreshold = Math.max(propertyAValue, propertyBValue) * 0.05;
      const isEqual = gap <= equalThreshold;

      let gapPayerUserId = null;
      let gapReceiverUserId = null;
      let financiallyOk = false;

      if (isEqual) {
        if (intentA.swapDirection === 'equal' || intentB.swapDirection === 'equal') {
          financiallyOk = true;
        }
      } else if (propertyAValue > propertyBValue) {
        // B pays gap to A
        gapPayerUserId = intentB.userId;
        gapReceiverUserId = intentA.userId;
        const bCanPay = !intentB.cashGapAvailableEGP || intentB.cashGapAvailableEGP >= gap;
        const aExpectsEnough = !intentA.cashGapExpectedEGP || intentA.cashGapExpectedEGP <= gap;
        financiallyOk = bCanPay && aExpectsEnough;
      } else {
        // A pays gap to B
        gapPayerUserId = intentA.userId;
        gapReceiverUserId = intentB.userId;
        const aCanPay = !intentA.cashGapAvailableEGP || intentA.cashGapAvailableEGP >= gap;
        const bExpectsEnough = !intentB.cashGapExpectedEGP || intentB.cashGapExpectedEGP <= gap;
        financiallyOk = aCanPay && bExpectsEnough;
      }

      if (!financiallyOk) continue;

      financiallyCompatible.push({
        intentB, propertyB,
        propertyBValue, gap, isEqual,
        gapPayerUserId, gapReceiverUserId
      });
    }

    // ── STEP C: SKIP ALREADY-MATCHED PAIRS ──
    const newCandidates = [];
    for (const candidate of financiallyCompatible) {
      const existingMatches = await base44.asServiceRole.entities.SwapMatch.filter({ intentAId: intentA.id, intentBId: candidate.intentB.id });
      const existingMatchesReverse = await base44.asServiceRole.entities.SwapMatch.filter({ intentAId: candidate.intentB.id, intentBId: intentA.id });
      const allExisting = [...(existingMatches || []), ...(existingMatchesReverse || [])];
      const activeExisting = allExisting.find(m => !['rejected', 'expired'].includes(m.status));
      if (activeExisting) continue;

      newCandidates.push(candidate);
      if (newCandidates.length >= maxMatches) break;
    }

    if (newCandidates.length === 0) {
      results.push({ intentAId: intentA.id, matchesCreated: 0 });
      continue;
    }

    // ── STEP D: CALL CLAUDE AI ──
    let matchesCreated = 0;

    for (const { intentB, propertyB, propertyBValue, gap, gapPayerUserId, gapReceiverUserId } of newCandidates) {
      const gapWho = gapPayerUserId === intentA.userId
        ? 'Party A pays Party B'
        : gapPayerUserId === intentB.userId
          ? 'Party B pays Party A'
          : 'Equal swap (no cash gap)';

      let aiResult = null;
      try {
        aiResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
          model: claudeModel,
          prompt: `You are the Kemedar Swap™ AI Matchmaker. You specialize in Egyptian real estate and understand what makes a property swap compelling for both parties.

Analyze this property swap:

PARTY A:
Offered property: ${propertyA.title || 'Unnamed'}
Category: ${propertyA.category_name || 'Unknown'} | City: ${propertyA.city_name || 'Unknown'}
Area: ${propertyA.area_size || 'Unknown'} sqm | Bedrooms: ${propertyA.beds || 'Unknown'}
Floor: ${propertyA.floor_number || 'Unknown'}
Estimated Value: ${propertyAValue.toLocaleString('en-EG')} EGP
What A wants: ${(intentA.desiredCategories || []).join(', ') || 'Any'} in ${(intentA.desiredCityIds || []).join(', ') || 'Any city'}, min ${intentA.desiredMinBedrooms || 'any'} beds
Keywords: ${intentA.desiredKeywords || 'none'}
Direction: ${intentA.swapDirection}
Cash position: ${intentA.cashGapAvailableEGP ? `willing to pay up to ${intentA.cashGapAvailableEGP.toLocaleString('en-EG')} EGP` : intentA.cashGapExpectedEGP ? `expects at least ${intentA.cashGapExpectedEGP.toLocaleString('en-EG')} EGP` : 'equal swap'}

PARTY B:
Offered property: ${propertyB.title || 'Unnamed'}
Category: ${propertyB.category_name || 'Unknown'} | City: ${propertyB.city_name || 'Unknown'}
Area: ${propertyB.area_size || 'Unknown'} sqm | Bedrooms: ${propertyB.beds || 'Unknown'}
Floor: ${propertyB.floor_number || 'Unknown'}
Estimated Value: ${propertyBValue.toLocaleString('en-EG')} EGP
What B wants: ${(intentB.desiredCategories || []).join(', ') || 'Any'} in ${(intentB.desiredCityIds || []).join(', ') || 'Any city'}
Keywords: ${intentB.desiredKeywords || 'none'}
Direction: ${intentB.swapDirection}

FINANCIAL GAP: ${gap.toLocaleString('en-EG')} EGP — ${gapWho}

Generate a match score (0–100) and 3 compelling bullet points for each party. Be specific about location, features, and lifestyle benefits. Max 20 words per bullet.

Return ONLY this exact JSON (no markdown, no preamble):
{"matchScore":0,"criteriaMatchScore":0,"financialCompatibilityScore":0,"highlightsForA":["","",""],"highlightsForB":["","",""],"reasoningForA":"","reasoningForB":""}`,
          response_json_schema: {
            type: 'object',
            properties: {
              matchScore: { type: 'number' },
              criteriaMatchScore: { type: 'number' },
              financialCompatibilityScore: { type: 'number' },
              highlightsForA: { type: 'array', items: { type: 'string' } },
              highlightsForB: { type: 'array', items: { type: 'string' } },
              reasoningForA: { type: 'string' },
              reasoningForB: { type: 'string' }
            }
          }
        });
      } catch (_e) {
        continue; // Skip this candidate if AI fails
      }

      if (!aiResult || aiResult.matchScore < scoreThreshold) continue;

      // ── STEP E: SAVE MATCH ──
      await base44.asServiceRole.entities.SwapMatch.create({
        intentAId: intentA.id,
        intentBId: intentB.id,
        userAId: intentA.userId,
        userBId: intentB.userId,
        propertyAId: intentA.offeredPropertyId,
        propertyBId: intentB.offeredPropertyId,
        matchScore: aiResult.matchScore,
        criteriaMatchScore: aiResult.criteriaMatchScore,
        financialCompatibilityScore: aiResult.financialCompatibilityScore,
        aiHighlightsForA: aiResult.highlightsForA,
        aiHighlightsForB: aiResult.highlightsForB,
        aiReasoningForA: aiResult.reasoningForA,
        aiReasoningForB: aiResult.reasoningForB,
        claudeModel,
        generatedAt: new Date().toISOString(),
        propertyAValueEGP: propertyAValue,
        propertyBValueEGP: propertyBValue,
        valuationGapEGP: gap,
        gapPayerUserId: gapPayerUserId ?? null,
        gapReceiverUserId: gapReceiverUserId ?? null,
        status: 'suggested'
      });

      matchesCreated++;

      // Update both intents: matchCount + status
      const newCountA = (intentA.matchCount ?? 0) + 1;
      await base44.asServiceRole.entities.SwapIntent.update(intentA.id, {
        matchCount: newCountA,
        ...(intentA.status === 'active' ? { status: 'matched' } : {})
      });
      await base44.asServiceRole.entities.SwapIntent.update(intentB.id, {
        matchCount: (intentB.matchCount ?? 0) + 1,
        ...(intentB.status === 'active' ? { status: 'matched' } : {})
      });

      // Notify both users
      const userAList = await base44.asServiceRole.entities.User.filter({ id: intentA.userId });
      const userBList = await base44.asServiceRole.entities.User.filter({ id: intentB.userId });
      const userA = userAList?.[0];
      const userB = userBList?.[0];

      if (userA?.email) {
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: userA.email,
            subject: '🔄 You have a new Swap Match!',
            body: `Hi ${userA.full_name},\n\nGreat news! We found a new Swap Match for your property "${propertyA.title}".\n\nMatch score: ${aiResult.matchScore}/100\n\nLog in to Kemedar to view and respond to your match.\n\nKemedar Swap™ Team`
          });
        } catch (_e) { /* non-blocking */ }
      }
      if (userB?.email) {
        try {
          await base44.asServiceRole.integrations.Core.SendEmail({
            to: userB.email,
            subject: '🔄 You have a new Swap Match!',
            body: `Hi ${userB.full_name},\n\nGreat news! We found a new Swap Match for your property "${propertyB.title}".\n\nMatch score: ${aiResult.matchScore}/100\n\nLog in to Kemedar to view and respond to your match.\n\nKemedar Swap™ Team`
          });
        } catch (_e) { /* non-blocking */ }
      }
    }

    results.push({ intentAId: intentA.id, matchesCreated });
  }

  return Response.json({ success: true, results });
});