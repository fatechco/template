import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Anthropic from 'npm:@anthropic-ai/sdk@0.32.1';

const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { formType, category, purpose, cityId, districtId, bedrooms, area, finishing, amenities, floor, yearBuilt, cityName, districtName, currency } = body;

  // ── STEP A: Query comparable listings ──────────────────────────────────────
  let comparables = [];
  let marketData = null;
  let olderListings = [];

  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  const twelveMonthsAgo = new Date();
  twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

  if (formType === 'property') {
    // Query 1 — Exact match comparable active listings
    const allActive = await base44.asServiceRole.entities.Property.filter(
      { is_active: true, city_id: cityId },
      '-created_date',
      50
    );

    // Filter in JS for more nuanced matching
    comparables = allActive
      .filter(p => {
        const catMatch = !category || p.category_name === category || p.category_id === category;
        const purposeMatch = !purpose || p.purpose === purpose;
        const areaMatch = !area || (p.area_size && p.area_size >= area * 0.7 && p.area_size <= area * 1.3);
        const bedsMatch = !bedrooms || (p.beds && Math.abs(p.beds - bedrooms) <= 1);
        return catMatch && purposeMatch && areaMatch && bedsMatch;
      })
      .slice(0, 20)
      .map(p => ({
        price: p.price_amount,
        totalArea: p.area_size,
        pricePerSqm: p.area_size && p.price_amount ? Math.round(p.price_amount / p.area_size) : null,
        bedrooms: p.beds,
        bathrooms: p.baths,
        finishing: p.finishing,
        floor: p.floor_number,
        amenities: p.amenity_ids || [],
        daysListed: p.created_date ? Math.round((Date.now() - new Date(p.created_date).getTime()) / 86400000) : null,
      }))
      .filter(p => p.price && p.totalArea);

    // Query 2 — Market price index
    const mktData = await base44.asServiceRole.entities.MarketPriceIndex.filter({
      cityId,
      propertyType: category,
      purpose,
    }, '-lastUpdated', 1);
    marketData = mktData?.[0] || null;

    // Query 3 — Older listings for trend
    const olderAll = await base44.asServiceRole.entities.Property.filter(
      { city_id: cityId },
      '-created_date',
      30
    );
    olderListings = olderAll.filter(p => {
      const d = p.created_date ? new Date(p.created_date) : null;
      return d && d < sixMonthsAgo && d >= twelveMonthsAgo && p.price_amount && p.area_size;
    });

  } else if (formType === 'product') {
    // Kemetro product comparables
    const allProducts = await base44.asServiceRole.entities.KemetroProduct.filter(
      { is_active: true },
      '-created_date',
      50
    );
    comparables = allProducts
      .filter(p => !category || p.category_id === category || p.category_name === category)
      .slice(0, 20)
      .map(p => ({
        price: p.price,
        name: p.name,
        brand: p.brand,
        daysListed: p.created_date ? Math.round((Date.now() - new Date(p.created_date).getTime()) / 86400000) : null,
      }))
      .filter(p => p.price);

  } else if (formType === 'service') {
    // Kemework service comparables
    const allServices = await base44.asServiceRole.entities.KemeworkService.filter(
      { is_active: true },
      '-created_date',
      50
    );
    comparables = allServices
      .filter(s => !category || s.category_id === category || s.category_name === category)
      .slice(0, 20)
      .map(s => ({
        price: s.base_price || s.price,
        pricingType: s.pricing_type,
        city: s.city,
        rating: s.rating,
        daysListed: s.created_date ? Math.round((Date.now() - new Date(s.created_date).getTime()) / 86400000) : null,
      }))
      .filter(s => s.price);
  }

  // ── STEP B: Calculate market trend ────────────────────────────────────────
  let marketTrend = { directionLast6Months: 'Stable', percentChange: 0 };

  if (formType === 'property' && olderListings.length > 0 && comparables.length > 0) {
    const oldAvg = olderListings.reduce((sum, p) => sum + (p.price_amount / p.area_size), 0) / olderListings.length;
    const newAvg = comparables.reduce((sum, p) => sum + (p.pricePerSqm || 0), 0) / comparables.filter(p => p.pricePerSqm).length;
    const pct = oldAvg > 0 ? ((newAvg - oldAvg) / oldAvg) * 100 : 0;
    marketTrend = {
      directionLast6Months: pct > 2 ? 'Rising' : pct < -2 ? 'Declining' : 'Stable',
      percentChange: Math.round(pct * 10) / 10,
    };
  }

  // ── STEP B: Build context for Claude ──────────────────────────────────────
  const contextObject = {
    inputProperty: {
      formType,
      category,
      purpose,
      city: cityName || cityId,
      district: districtName || districtId,
      area: area ? Number(area) : undefined,
      bedrooms: bedrooms ? Number(bedrooms) : undefined,
      floor: floor ? Number(floor) : undefined,
      finishing,
      amenities,
      yearBuilt: yearBuilt ? Number(yearBuilt) : undefined,
      currency: currency || 'EGP',
    },
    marketData: marketData ? {
      avgPricePerSqm: marketData.avgPricePerSqm,
      medianPricePerSqm: marketData.medianPricePerSqm,
      minPricePerSqm: marketData.minPricePerSqm,
      maxPricePerSqm: marketData.maxPricePerSqm,
      avgSize: marketData.avgSize,
      demandScore: marketData.demandScore,
      totalActiveListings: marketData.activeListings,
      priceChange12Months: marketData.priceChange12Months,
      currency: currency || 'EGP',
    } : null,
    comparableListings: comparables.slice(0, 15),
    marketTrend,
    totalComparables: comparables.length,
  };

  // ── STEP C: Call Claude API ────────────────────────────────────────────────
  const systemPrompt = `You are an expert real estate and marketplace pricing analyst for Kemedar, a global property and services platform operating in Egypt and 30+ countries. You analyze real market data to provide accurate price recommendations.

You receive:
1. The property/product/service to be priced
2. Market statistics from our database
3. Real comparable listings from our system

Analyze this data and provide a recommended price range, optimal price, and key factors.
Be specific, data-driven and explain your reasoning clearly.
Respond ONLY with valid JSON matching the exact schema requested.`;

  const typeLabel = formType === 'product' ? 'product' : formType === 'service' ? 'service' : 'property';

  const userMessage = `Analyze this ${typeLabel} and suggest optimal pricing:

${JSON.stringify(contextObject, null, 2)}

Respond ONLY with this JSON structure:
{
  "suggestedPrice": <number - the optimal single price>,
  "priceRangeMin": <number>,
  "priceRangeMax": <number>,
  "pricePerSqm": <number or null if not applicable>,
  "confidenceScore": <number 0-100>,
  "currency": "${currency || 'EGP'}",
  "pricingFactors": [
    {
      "factor": <string - factor name>,
      "impact": <"positive"|"negative"|"neutral">,
      "description": <string - brief explanation>,
      "adjustment": <string - e.g. "+8%" or "-3%" or "0%">
    }
  ],
  "marketInsights": <string - 2-3 sentences about market context>,
  "bestTimeToList": <string - brief recommendation>,
  "comparablesSummary": <string - summary of comparable data used>,
  "recommendation": <string - one sentence overall recommendation>
}`;

  const message = await anthropic.messages.create({
    model: 'claude-opus-4-5',
    max_tokens: 1000,
    system: systemPrompt,
    messages: [{ role: 'user', content: userMessage }],
  });

  let aiResult = null;
  const rawText = message.content[0]?.text || '';
  const jsonMatch = rawText.match(/\{[\s\S]*\}/);
  if (jsonMatch) {
    aiResult = JSON.parse(jsonMatch[0]);
  } else {
    throw new Error('Claude returned invalid JSON');
  }

  // ── STEP D: Return result ──────────────────────────────────────────────────
  return Response.json({
    success: true,
    aiResult,
    comparables,
    totalComparables: comparables.length,
    marketData: contextObject.marketData,
    marketTrend,
  });
});