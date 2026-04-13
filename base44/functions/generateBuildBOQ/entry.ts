import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const body = await req.json();
  const { projectId, rooms, finishingLevel, preferences, projectType, totalAreaSqm, floorPlanUrl } = body;

  // --- STEP 1: Claude Vision floor plan extraction (if image provided and no rooms yet) ---
  let resolvedRooms = rooms;
  let extractionConfidence = 0;

  if (floorPlanUrl && (!rooms || rooms.length === 0)) {
    try {
      const visionResult = await base44.asServiceRole.integrations.Core.InvokeLLM({
        prompt: `You are an expert architectural drawing analyst specializing in Egyptian residential floor plans.

Analyze this floor plan image and extract ALL room dimensions precisely.

For each room:
- Identify room type: living_room, master_bedroom, bedroom, kitchen, bathroom, dining_room, balcony, hallway, storage, office, or other
- Measure width and length in meters (use scale bar if visible, otherwise estimate from standard Egyptian apartment proportions)
- Assume ceiling height of 3.0m unless shown
- Count windows and doors per room

Egyptian standard room sizes for reference:
- Living room: 20–40 m²
- Master bedroom: 16–25 m²  
- Standard bedroom: 12–18 m²
- Kitchen: 8–15 m²
- Bathroom: 4–8 m²
- Balcony: 4–12 m²

Return JSON:
{
  "rooms": [
    {
      "roomId": "living_room",
      "roomType": "living_room",
      "roomTypeAr": "غرفة المعيشة",
      "widthM": 5.2,
      "lengthM": 6.8,
      "heightM": 3.0,
      "areaSqm": 35.4,
      "windowCount": 2,
      "doorCount": 1
    }
  ],
  "totalExtractedAreaSqm": 150,
  "confidence": 85,
  "notes": "Detected from scale bar"
}`,
        file_urls: [floorPlanUrl],
        response_json_schema: {
          type: "object",
          properties: {
            rooms: { type: "array", items: { type: "object" } },
            totalExtractedAreaSqm: { type: "number" },
            confidence: { type: "number" },
            notes: { type: "string" }
          }
        }
      });

      if (visionResult.rooms?.length > 0) {
        resolvedRooms = visionResult.rooms.map(r => ({
          ...r,
          areaSqm: r.areaSqm || (r.widthM * r.lengthM),
          perimeterM: 2 * (r.widthM + r.lengthM),
          floorAreaSqm: r.areaSqm || (r.widthM * r.lengthM),
          wallAreaSqm: 2 * (r.widthM + r.lengthM) * (r.heightM || 3),
          ceilingAreaSqm: r.areaSqm || (r.widthM * r.lengthM),
          windowTotalAreaSqm: (r.windowCount || 1) * 1.8,
          doorTotalAreaSqm: (r.doorCount || 1) * 1.9,
          netWallAreaSqm: (2 * (r.widthM + r.lengthM) * (r.heightM || 3)) - ((r.windowCount || 1) * 1.8) - ((r.doorCount || 1) * 1.9),
        }));
        extractionConfidence = visionResult.confidence || 80;
      }
    } catch (err) {
      console.error("Vision extraction failed:", err.message);
    }
  }

  // --- STEP 2: Generate BOQ with Claude ---
  const roomSummary = resolvedRooms.map(r =>
    `${r.roomType}: ${r.widthM}x${r.lengthM}m (floor:${r.areaSqm||Math.round(r.widthM*r.lengthM)}m², walls:${r.netWallAreaSqm||Math.round(2*(r.widthM+r.lengthM)*3)}m²)`
  ).join(', ');

  const prompt = `Egyptian construction quantity surveyor. Generate a complete BOQ for: ${projectType}, ${totalAreaSqm}m², finishing: ${finishingLevel}, preferences: ${JSON.stringify(preferences)}.

Rooms: ${roomSummary}

Waste factors: tiles+10%, wall tiles+12%, paint+15%, adhesive+20%. Coverage: paint 7L/m²/coat(2 coats), adhesive 4.5kg/m², grout 0.7kg/m².

Egyptian 2026 prices (EGP) Economy/Standard/Premium:
- 60x60 porcelain floor: 160/220/420 per m²
- Wall tiles 30x60: 130/190/380 per m²
- Interior paint/liter: 40/75/140
- Tile adhesive 20kg bag: 85/95/110
- Tile grout 5kg: 55/70/95
- Gypsum board sheet: 95/115/145
- Electrical outlet point: 180/280/450
- Plumbing water point: 350/500/750
- Interior door complete: 1800/3200/6500
- Aluminum window/m²: 900/1600/3200
- Kitchen base cabinet/m: 1200/2800/5500
- Bathroom sanitary set: 3500/6500/15000
- Waterproofing/kg: 85/120/180

Include Arabic searchKeyword for each item for Kemetro product catalog.

Respond ONLY with this exact JSON:
{
  "boqSections": [
    {
      "sectionId": "living_room",
      "sectionName": "Living Room",
      "sectionNameAr": "غرفة المعيشة",
      "items": [
        {
          "itemName": "60x60 Porcelain Floor Tiles (Matte Grey)",
          "itemNameAr": "بلاط أرضي بورسلان 60×60 رمادي مط",
          "itemDescription": "Grade A rectified, 8.5mm thickness, suitable for residential floors",
          "specification": "EN ISO 10545 Grade A, water absorption <0.5%, PEI Class 4, rectified edges",
          "category": "flooring",
          "unit": "m²",
          "netQuantity": 28,
          "wastePercent": 10,
          "orderQuantity": 31,
          "unitCost": { "economy": 160, "standard": 220, "premium": 420 },
          "totalCost": { "economy": 4960, "standard": 6820, "premium": 13020 },
          "searchKeyword": "بلاط بورسلان 60x60 رمادي",
          "isMandatory": true,
          "installationNote": "Install on level screed, use C2 adhesive, leave 3mm grout joint, allow 24h cure",
          "qualityTip": "Rectified tiles allow 1.5mm joints vs 3mm for non-rectified — much cleaner look"
        }
      ]
    }
  ],
  "laborItems": [
    {
      "trade": "Tiler",
      "description": "Floor and wall tiling — all areas including adhesive and grouting",
      "unit": "m²",
      "quantity": 95,
      "rateEconomy": 65,
      "rateStandard": 85,
      "ratePremium": 120,
      "totalEconomy": 6175,
      "totalStandard": 8075,
      "totalPremium": 11400,
      "estimatedDays": 8,
      "sequenceNote": "After plumbing rough-in, before ceiling gypsum and paint"
    }
  ],
  "totals": {
    "economy": { "materials": 180000, "labor": 45000, "contingency": 22500, "grandTotal": 247500 },
    "standard": { "materials": 280000, "labor": 62000, "contingency": 34200, "grandTotal": 376200 },
    "premium": { "materials": 520000, "labor": 95000, "contingency": 61500, "grandTotal": 676500 }
  },
  "projectNotes": "Detailed notes about this specific project's key considerations...",
  "criticalItems": ["Critical item 1", "Critical item 2"],
  "savingTips": ["Tip 1", "Tip 2", "Tip 3"],
  "commonMistakes": ["Mistake 1", "Mistake 2"]
}`;

  const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
    prompt,
    model: "claude-sonnet-4-20250514",
    response_json_schema: {
      type: "object",
      properties: {
        boqSections: { type: "array", items: { type: "object" } },
        laborItems: { type: "array", items: { type: "object" } },
        totals: { type: "object" },
        projectNotes: { type: "string" },
        criticalItems: { type: "array", items: { type: "string" } },
        savingTips: { type: "array", items: { type: "string" } },
        commonMistakes: { type: "array", items: { type: "string" } }
      }
    }
  });

  // --- STEP 3: Kemetro product matching ---
  let matchedSections = result.boqSections || [];
  try {
    const allKeywords = matchedSections.flatMap(sec =>
      (sec.items || []).filter(i => i.searchKeyword).map(i => i.searchKeyword)
    );

    if (allKeywords.length > 0) {
      // Try to match keywords to existing Kemetro products
      const products = await base44.asServiceRole.entities.KemetroProduct.list("-created_date", 200);

      matchedSections = matchedSections.map(sec => ({
        ...sec,
        items: (sec.items || []).map(item => {
          if (!item.searchKeyword) return item;
          // Simple keyword matching against product names
          const keyword = item.searchKeyword.toLowerCase();
          const itemName = item.itemName.toLowerCase();
          const match = products.find(p => {
            const pName = (p.name || "").toLowerCase();
            const pNameAr = (p.name_ar || "").toLowerCase();
            return pName.includes(itemName.split(" ")[0]) ||
              pNameAr.includes(item.searchKeyword.split(" ")[0]) ||
              keyword.split(" ").some(w => w.length > 3 && pNameAr.includes(w));
          });
          if (match) {
            return {
              ...item,
              matchedProductId: match.id,
              matchedProductName: match.name,
              matchedProductPrice: match.price,
              matchedProductImage: match.featured_image,
              matchConfidence: 85,
            };
          }
          return item;
        })
      }));
    }
  } catch (err) {
    console.log("Product matching skipped:", err.message);
  }

  result.boqSections = matchedSections;

  // --- STEP 4: Save to database ---
  if (projectId) {
    const totals = result.totals || {};
    const scenarioKey = finishingLevel === 'economy' ? 'economy' : (finishingLevel === 'premium' || finishingLevel === 'luxury') ? 'premium' : 'standard';

    const updateData = {
      boqStatus: 'ready',
      boqData: result,
      totalMaterialsCost: totals[scenarioKey]?.materials || 0,
      totalLaborCost: totals[scenarioKey]?.labor || 0,
      grandTotal: totals[scenarioKey]?.grandTotal || 0,
      scenarioEconomy: totals.economy,
      scenarioStandard: totals.standard,
      scenarioPremium: totals.premium,
    };

    if (extractionConfidence > 0) {
      updateData.aiExtractionConfidence = extractionConfidence;
      updateData.extractedRooms = resolvedRooms;
    }

    await base44.asServiceRole.entities.BuildProject.update(projectId, updateData);
  }

  return Response.json({ success: true, boq: result, extractionConfidence });
});