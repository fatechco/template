import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const { signalId, signalData } = await req.json();

  let signal = signalData;
  if (signalId && !signal) {
    const results = await base44.asServiceRole.entities.DemandSignal.filter({ id: signalId });
    signal = results[0];
  }
  if (!signal) return Response.json({ error: 'Signal not found' }, { status: 404 });

  const buyers = signal.estimatedBuyerCount || 5;
  const qty = signal.estimatedDemandQty || 400;
  const retailPrice = 220;

  const prompt = `You are a bulk purchasing specialist for Kemetro, Egypt's building materials marketplace.

Analyze this demand signal and create a compelling compound group buy offer.

Signal:
  Product category: ${signal.productCategory}
  Location: ${signal.cityName || signal.locationCityId || 'Cairo'}, ${signal.districtName || signal.locationDistrictId || 'New Cairo'}
  Compound: ${signal.compoundName || 'Residential Compound'}
  Estimated buyers: ${buyers}
  Estimated total qty: ${qty} m²
  Signal type: ${signal.signalType}
  Confidence: ${signal.confidenceScore}%

Egyptian market rules:
- Compound residents trust each other, WhatsApp groups coordinate
- Savings of 20%+ motivate fast action
- Delivery to compound gate is strongly preferred
- Payment on delivery is the default
- Arabic messaging converts 2x better than English
- Franchise Owner (FO) oversight increases trust significantly

Return ONLY valid JSON with this exact structure:
{
  "dealTitle": "Group Buy: [Category] for [Location]",
  "dealTitleAr": "شراء جماعي: [المنتج] لـ[المنطقة]",
  "dealDescription": "2-3 sentences in English describing the deal opportunity",
  "priceTiers": [
    {"minParticipants": 3, "minTotalQty": 200, "pricePerUnit": 196, "discountPercent": 11, "label": "Starter 🌱", "incentiveMessage": "Save 11% — join now!"},
    {"minParticipants": 8, "minTotalQty": 500, "pricePerUnit": 176, "discountPercent": 20, "label": "Better 🔥", "incentiveMessage": "20% off — great savings!"},
    {"minParticipants": 15, "minTotalQty": 1000, "pricePerUnit": 158, "discountPercent": 28, "label": "Best 💎", "incentiveMessage": "28% off — maximum value!"}
  ],
  "suggestedMinParticipants": 5,
  "suggestedClosingDays": 7,
  "whatsappMessage": "Arabic WhatsApp message for neighbors, ~100 words, with emoji, mentioning savings and group progress",
  "marketingPoints": ["4 concise English marketing bullet points"],
  "estimatedTotalValue": ${Math.round(qty * retailPrice)},
  "estimatedSavingsPerUnit": 44,
  "estimatedSavingsTotal": ${Math.round(qty * 44)},
  "successProbability": 75,
  "confidenceNote": "Short note explaining why this deal is likely to succeed",
  "foRole": "Brief description of what the Franchise Owner does in this deal"
}`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    model: 'gpt_5_mini',
    response_json_schema: {
      type: 'object',
      properties: {
        dealTitle: { type: 'string' },
        dealTitleAr: { type: 'string' },
        dealDescription: { type: 'string' },
        priceTiers: { type: 'array', items: { type: 'object' } },
        suggestedMinParticipants: { type: 'number' },
        suggestedClosingDays: { type: 'number' },
        whatsappMessage: { type: 'string' },
        marketingPoints: { type: 'array', items: { type: 'string' } },
        estimatedTotalValue: { type: 'number' },
        estimatedSavingsPerUnit: { type: 'number' },
        estimatedSavingsTotal: { type: 'number' },
        successProbability: { type: 'number' },
        confidenceNote: { type: 'string' },
        foRole: { type: 'string' },
      }
    }
  });

  // Update signal with offer + create a draft CompoundDeal
  if (signalId) {
    await base44.asServiceRole.entities.DemandSignal.update(signalId, {
      aiGeneratedOffer: result,
      status: 'notified',
    });

    // Auto-create draft CompoundDeal
    const closingAt = new Date(Date.now() + (result.suggestedClosingDays || 7) * 24 * 60 * 60 * 1000).toISOString();
    const compound = await base44.asServiceRole.entities.CompoundDeal.create({
      dealTitle: result.dealTitle,
      dealTitleAr: result.dealTitleAr,
      dealDescription: result.dealDescription,
      dealType: 'compound_group_buy',
      productCategory: signal.productCategory,
      productName: signal.specificProduct || signal.productCategory,
      cityId: signal.locationCityId,
      districtId: signal.locationDistrictId,
      compoundName: signal.compoundName || '',
      retailPricePerUnit: retailPrice,
      targetPricePerUnit: result.priceTiers?.[1]?.pricePerUnit || 176,
      priceTiers: result.priceTiers || [],
      minParticipants: result.suggestedMinParticipants || 5,
      currentParticipants: 0,
      minTotalQty: signal.estimatedDemandQty || 400,
      currentTotalQty: 0,
      dealOpenedAt: new Date().toISOString(),
      dealClosingAt: closingAt,
      status: 'forming',
      aiGeneratedDeal: true,
      aiConfidenceScore: result.successProbability || 75,
      aiDetectedFromBOQ: signal.signalType === 'boq_multiple_users',
      totalGroupValue: 0,
      platformFeePercent: 3,
    });

    await base44.asServiceRole.entities.DemandSignal.update(signalId, {
      dealCreatedId: compound.id,
      status: 'deal_created',
    });
  }

  return Response.json({ success: true, offer: result });
});