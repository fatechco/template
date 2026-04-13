import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Fallback cost indexes per tier (EGP/sqm) when no DB data exists
const FALLBACK_INDEX = {
  Economy:  { material: 1200, labor: 800 },
  Standard: { material: 2200, labor: 1400 },
  Premium:  { material: 3800, labor: 2200 },
  Luxury:   { material: 7000, labor: 4000 },
};

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { propertyId, userInputs } = body;

    if (!propertyId || !userInputs) {
      return Response.json({ error: 'propertyId and userInputs are required' }, { status: 400 });
    }

    const { currentState, desiredStyle, desiredTier, smartHomeEnabled, centralAcEnabled } = userInputs;

    // Fetch property details
    let property = null;
    try {
      const props = await base44.asServiceRole.entities.Property.filter({ id: propertyId });
      property = props[0] || null;
    } catch (_) {}

    const area = property?.area_size || 100;
    const bedrooms = property?.beds || 2;
    const bathrooms = property?.baths || 1;
    const cityId = property?.city_id || null;

    // Fetch FinishingCostIndex for city + tier
    let costIndex = null;
    if (cityId) {
      try {
        const indexes = await base44.asServiceRole.entities.FinishingCostIndex.filter({
          cityId,
          qualityTier: desiredTier,
        });
        costIndex = indexes[0] || null;
      } catch (_) {}
    }

    // Fallback to country level or hardcoded defaults
    const laborPerSqm = costIndex?.baseLaborCostPerSqm || FALLBACK_INDEX[desiredTier]?.labor || 1400;
    const materialPerSqm = costIndex?.baseMaterialCostPerSqm || FALLBACK_INDEX[desiredTier]?.material || 2200;
    const currency = 'EGP';

    const prompt = `Property: ${area} sqm, ${bedrooms} beds, ${bathrooms} baths.
Current State: ${currentState}
Desired Style: ${desiredStyle}
Quality Tier: ${desiredTier}
Smart Home: ${smartHomeEnabled ? 'Yes' : 'No'}, Central AC: ${centralAcEnabled ? 'Yes' : 'No'}
Local Index: Labor avg ${laborPerSqm}/sqm, Material avg ${materialPerSqm}/sqm. Currency: ${currency}.

Return EXACTLY this JSON structure (no markdown, no explanation):
{
  "totalMin": number,
  "totalMax": number,
  "materialsTotal": number,
  "laborTotal": number,
  "weeksMin": number,
  "weeksMax": number,
  "breakdown": [
    {
      "category": "Flooring & Tiling",
      "description": "string",
      "materialCost": number,
      "laborCost": number,
      "kemeworkCategory": "string",
      "kemetroCategory": "string"
    }
  ],
  "shoppingList": [
    { "item": "string", "quantity": number, "unit": "string" }
  ],
  "designAdvice": "3-4 sentences of personalized AI interior design advice."
}

Include all 6 categories: Flooring & Tiling, Electrical & Lighting, Plumbing & Sanitation, Painting & Walls, Doors & Windows, Smart Home & HVAC.
Apply 10% waste margin to materials. Be realistic with Egyptian market pricing.`;

    const aiResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      model: 'claude_sonnet_4_6',
      response_json_schema: {
        type: 'object',
        properties: {
          totalMin: { type: 'number' },
          totalMax: { type: 'number' },
          materialsTotal: { type: 'number' },
          laborTotal: { type: 'number' },
          weeksMin: { type: 'number' },
          weeksMax: { type: 'number' },
          breakdown: { type: 'array', items: { type: 'object' } },
          shoppingList: { type: 'array', items: { type: 'object' } },
          designAdvice: { type: 'string' },
        },
      },
    });

    // Save to FinishingSimulation
    const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString();
    const simulation = await base44.asServiceRole.entities.FinishingSimulation.create({
      propertyId,
      currentState,
      desiredStyle,
      desiredTier,
      smartHomeEnabled: !!smartHomeEnabled,
      centralAcEnabled: !!centralAcEnabled,
      estimatedTotalMin: aiResult.totalMin,
      estimatedTotalMax: aiResult.totalMax,
      estimatedMaterialsCost: aiResult.materialsTotal,
      estimatedLaborCost: aiResult.laborTotal,
      currencyId: currency,
      estimatedWeeksMin: aiResult.weeksMin,
      estimatedWeeksMax: aiResult.weeksMax,
      aiGeneratedBoQ: aiResult.breakdown,
      aiShoppingList: aiResult.shoppingList,
      aiDesignAdvice: aiResult.designAdvice,
      expiresAt,
    });

    return Response.json({ simulation, estimate: aiResult, currency });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});