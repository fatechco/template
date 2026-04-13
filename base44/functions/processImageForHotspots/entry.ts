import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

async function downloadImageAsBase64(imageUrl) {
  try {
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const buffer = await response.arrayBuffer();
    const base64 = btoa(String.fromCharCode(...new Uint8Array(buffer)));
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const mediaType = contentType.includes('png') ? 'image/png' : 'image/jpeg';
    return { base64, mediaType };
  } catch (e) {
    throw new Error(`Failed to download image: ${e.message}`);
  }
}

function sha256Hash(str) {
  const encoder = new TextEncoder();
  return crypto.subtle.digest('SHA-256', encoder.encode(str));
}

async function getImageHash(imageUrl) {
  const hash = await sha256Hash(imageUrl);
  return Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('');
}

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { propertyId, imageUrl } = await req.json();

    if (!propertyId || !imageUrl) {
      return Response.json({ error: 'Missing propertyId or imageUrl' }, { status: 400 });
    }

    console.log(`[processImageForHotspots] Starting analysis for property ${propertyId}, image: ${imageUrl.slice(0, 50)}...`);

    // STEP A: Check settings and property eligibility
    const settings = await base44.asServiceRole.entities.ShopTheLookSettings.list();
    if (!settings?.length || !settings[0].isActive) {
      console.log('[processImageForHotspots] Feature is inactive');
      return Response.json({ message: 'Feature inactive' }, { status: 200 });
    }
    const config = settings[0];

    const properties = await base44.asServiceRole.entities.Property.filter({ id: propertyId });
    if (!properties?.length) {
      return Response.json({ error: 'Property not found' }, { status: 404 });
    }
    const property = properties[0];

    if (config.triggerOnFurnishedOnly) {
      const furnishedOptions = await base44.asServiceRole.entities.PropertyFurnished.list();
      const furnishedMap = furnishedOptions.reduce((acc, f) => { acc[f.id] = f.name; return acc; }, {});
      const furnishedName = furnishedMap[property.furnished_id] || '';
      const goodFurnished = ['Good', 'Lux', 'New'].some(f => furnishedName.includes(f));
      if (!goodFurnished) {
        console.log('[processImageForHotspots] Property not furnished enough');
        return Response.json({ message: 'Property not furnished enough' }, { status: 200 });
      }

      const statusOptions = await base44.asServiceRole.entities.PropertyStatus.list();
      const statusMap = statusOptions.reduce((acc, s) => { acc[s.id] = s.name; return acc; }, {});
      const statusName = statusMap[property.status_id] || '';
      const minLevel = config.minFinishingLevelToAnalyze || 'Complete Finishing';
      if (!statusName.includes(minLevel)) {
        console.log('[processImageForHotspots] Finishing level too low');
        return Response.json({ message: 'Finishing level too low' }, { status: 200 });
      }
    }

    // STEP B: Check for existing analysis
    const imageHash = await getImageHash(imageUrl);
    const existingImages = await base44.asServiceRole.entities.AnalyzedPropertyImage.filter({
      imageHash,
      isAnalyzed: true,
      isShoppable: true
    });
    if (existingImages?.length) {
      console.log('[processImageForHotspots] Image already analyzed, reusing results');
      return Response.json({ message: 'Already analyzed', imageId: existingImages[0].id }, { status: 200 });
    }

    // STEP C: Fetch image as base64
    console.log('[processImageForHotspots] Downloading image...');
    const { base64, mediaType } = await downloadImageAsBase64(imageUrl);

    // STEP D: Call Claude Vision API
    console.log('[processImageForHotspots] Calling Claude Vision API...');
    const claudeResponse = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': Deno.env.get('ANTHROPIC_API_KEY'),
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        system: `You are an expert interior designer and e-commerce product specialist for Kemetro, an Egyptian building materials and furniture marketplace.

Analyze the provided real estate interior photo. Your goal is to identify purchasable items so users can shop similar products.

You must:
1. Identify the room type (Living Room, Bedroom, Kitchen, Dining Room, Bathroom, Outdoor)
2. Identify the overall design style (Modern Minimalist, Classic Luxury, Industrial, Bohemian, Scandinavian, Contemporary, Art Deco)
3. Identify the dominant color palette (describe in 3-5 colors by name)
4. Identify 3 to 6 prominent, purchasable items of furniture, lighting, or decor that are clearly visible in the photo.
   ONLY tag items that are clearly identifiable and purchasable — do not tag walls, floors, windows, or structural elements.
5. For each item, provide:
   - x_percent: horizontal center of the item as a percentage (0–100) from left edge
   - y_percent: vertical center of the item as a percentage (0–100) from top edge
   - label: specific descriptive name (include color, material, style) e.g. 'Tufted Velvet Navy Blue Sofa' NOT just 'Sofa'
   - category: one of: furniture | lighting | decor | rugs | curtains | wall-art | kitchen-accessories | outdoor-furniture
   - searchKeywords: a highly specific search query using color + material + style + type to find visually similar items on Kemetro e.g. 'navy velvet tufted sofa 3 seater'

Respond ONLY with valid JSON. No preamble, no markdown backticks.
If you cannot identify any purchasable items, return an empty hotspots array.`,
        messages: [{
          role: 'user',
          content: [
            {
              type: 'image',
              source: {
                type: 'base64',
                media_type: mediaType,
                data: base64
              }
            },
            {
              type: 'text',
              text: `Analyze this interior photo and return ONLY this exact JSON structure:
{
  "roomType": string,
  "roomStyle": string,
  "colorPalette": string,
  "dominantColors": [
    {"hex": string, "name": string, "percentage": number}
  ],
  "hotspots": [
    {
      "x_percent": number,
      "y_percent": number,
      "label": string,
      "category": string,
      "searchKeywords": string
    }
  ]
}`
            }
          ]
        }]
      })
    });

    if (!claudeResponse.ok) {
      const errorData = await claudeResponse.text();
      throw new Error(`Claude API error: ${claudeResponse.status} - ${errorData}`);
    }

    const claudeData = await claudeResponse.json();
    const responseText = claudeData.content[0]?.text || '';
    console.log('[processImageForHotspots] Claude response received');

    // STEP E: Parse and save
    let analysisData;
    try {
      const cleanedResponse = responseText.replace(/```json\n?|```\n?/g, '').trim();
      analysisData = JSON.parse(cleanedResponse);
    } catch (e) {
      console.error('[processImageForHotspots] JSON parse error:', e.message);
      const analyzed = await base44.asServiceRole.entities.AnalyzedPropertyImage.create({
        propertyId,
        imageUrl,
        imageHash,
        isAnalyzed: true,
        analyzedAt: new Date().toISOString(),
        claudeModel: 'claude-sonnet-4-20250514',
        isShoppable: false,
        analysisRawJson: responseText
      });
      return Response.json({ message: 'Analysis failed - invalid response', imageId: analyzed.id }, { status: 200 });
    }

    const hotspots = analysisData.hotspots || [];
    const isShoppable = hotspots.length >= config.minHotspotsPerImage;

    const analyzedImage = await base44.asServiceRole.entities.AnalyzedPropertyImage.create({
      propertyId,
      imageUrl,
      imageHash,
      isAnalyzed: true,
      analyzedAt: new Date().toISOString(),
      claudeModel: 'claude-sonnet-4-20250514',
      roomType: analysisData.roomType,
      roomStyle: analysisData.roomStyle,
      colorPalette: analysisData.colorPalette,
      dominantColors: analysisData.dominantColors || [],
      hotspotCount: hotspots.length,
      isShoppable,
      analysisRawJson: responseText
    });

    if (isShoppable) {
      const hotspotRecords = hotspots.map((h, idx) => ({
        imageId: analyzedImage.id,
        propertyId,
        xPercent: h.x_percent,
        yPercent: h.y_percent,
        itemLabel: h.label,
        kemetroCategorySlug: h.category,
        searchKeywords: h.searchKeywords,
        deepLinkUrl: `/kemetro/search?q=${encodeURIComponent(h.searchKeywords)}&category=${h.category}`,
        isSponsored: false,
        clickCount: 0,
        addToCartCount: 0,
        isManual: false,
        isActive: true,
        sortOrder: idx
      }));

      await base44.asServiceRole.entities.ImageHotspot.bulkCreate(hotspotRecords);
      console.log(`[processImageForHotspots] Created ${hotspotRecords.length} hotspots`);

      await base44.asServiceRole.entities.AnalyzedPropertyImage.update(analyzedImage.id, {
        hotspotCount: hotspotRecords.length
      });
    }

    return Response.json({ success: true, imageId: analyzedImage.id, hotspotCount: hotspots.length }, { status: 200 });

  } catch (error) {
    console.error('[processImageForHotspots] Error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});