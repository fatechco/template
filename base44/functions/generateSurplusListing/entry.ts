import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Anthropic from 'npm:@anthropic-ai/sdk';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { imageBase64, mediaType, barcodeString } = await req.json();

  // Load settings
  const settingsList = await base44.asServiceRole.entities.SurplusSettings.list('-created_date', 1);
  const settings = settingsList[0];
  if (!settings?.isActive) {
    return Response.json({ error: 'Feature unavailable' }, { status: 403 });
  }

  // PATH A — BARCODE SCAN (fast path)
  if (barcodeString) {
    const products = await base44.asServiceRole.entities.KemetroProduct.filter(
      { barcode: barcodeString, isActive: true },
      '-created_date',
      1
    );
    if (products?.length > 0) {
      const product = products[0];
      return Response.json({
        aiMatchedProductId: product.id,
        aiMatchedProductName: product.name,
        aiSuggestedTitle: product.name,
        aiSuggestedCategory: product.categorySlug,
        aiMatchedProductRetailPriceEGP: product.priceEGP,
        pathUsed: 'barcode_match',
        dataConfidence: 'high',
      });
    }
    // No barcode match — fall through to Vision AI if image provided
  }

  // PATH B — CLAUDE VISION AI
  if (!imageBase64) {
    return Response.json({ error: 'No image or barcode provided' }, { status: 400 });
  }

  const anthropic = new Anthropic({ apiKey: Deno.env.get('ANTHROPIC_API_KEY') });

  const response = await anthropic.messages.create({
    model: settings.claudeModel || 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    system: `You are Kemetro's AI Surplus Appraiser — an expert in Egyptian building materials, construction supplies, tiles, paint, wood, electrical components, plumbing, and finishing materials.

A user has uploaded a photo of leftover or surplus construction/finishing materials they want to sell on the Kemetro Surplus Market.

Your job is to:
1. Identify the product as specifically as possible (brand, type, size, color, material)
2. Estimate the condition:
   'brand_new_excess' = clearly unused, sealed
   'open_box' = opened packaging, unused inside
   'lightly_used' = used but still good quality
   'salvaged' = reclaimed, clearly used
3. Estimate the visible quantity
4. Suggest the correct measurement unit
5. Assign to the correct Kemetro category
6. Suggest a fair surplus discount percent (typically 40-70% below retail for good condition, 70-85% for salvaged items)
7. Write a clear, honest listing description in both English and Arabic
8. Estimate the total weight of the lot in kg
9. Estimate CO2 saved by reusing vs landfilling:
   For tiles: 0.3 kg CO2 per kg weight
   For paint: 0.5 kg CO2 per liter
   For wood: 0.2 kg CO2 per kg
   For metal: 0.6 kg CO2 per kg
   For plastic/PVC: 0.4 kg CO2 per kg
   For general materials: 0.25 kg CO2 per kg
10. Write a 1-sentence eco-impact note for display

Be specific and practical. If the image is unclear, use your best estimate and flag it in the description.
Respond ONLY with valid JSON. No preamble. No markdown backticks.`,
    messages: [
      {
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: mediaType || 'image/jpeg',
              data: imageBase64,
            },
          },
          {
            type: 'text',
            text: `Analyze these surplus building materials and return ONLY this exact JSON:
{
  "aiSuggestedTitle": string,
  "aiSuggestedTitleAr": string,
  "kemetroCategorySlug": string,
  "conditionEstimate": string,
  "estimatedQuantity": number,
  "suggestedUnit": string,
  "suggestedDiscountPercent": number,
  "estimatedWeightKg": number,
  "estimatedCo2SavedKg": number,
  "aiDescription": string,
  "aiDescriptionAr": string,
  "ecoImpactNote": string,
  "dataConfidence": "high"|"medium"|"low"
}`,
          },
        ],
      },
    ],
  });

  const raw = response.content[0].text.replace(/```json|```/g, '').trim();
  const result = JSON.parse(raw);

  result.pathUsed = 'vision_ai';
  result.claudeModel = settings.claudeModel || 'claude-sonnet-4-20250514';
  result.aiAnalyzedAt = new Date().toISOString();

  return Response.json(result);
});