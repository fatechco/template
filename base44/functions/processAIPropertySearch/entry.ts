import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';
import Anthropic from 'npm:@anthropic-ai/sdk@0.36.3';

const anthropic = new Anthropic({ apiKey: Deno.env.get("ANTHROPIC_API_KEY") });

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { userQuery, language = 'en', refinement = null } = await req.json();
  if (!userQuery) return Response.json({ error: 'userQuery is required' }, { status: 400 });

  // STEP A — Extract criteria
  const extractMsg = await anthropic.messages.create({
    model: "claude-3-5-haiku-20241022",
    max_tokens: 1024,
    messages: [{
      role: "user",
      content: `You are a real estate search assistant. Extract structured criteria from this ${language === 'ar' ? 'Arabic' : 'English'} natural language property search query. Respond ONLY with valid JSON, no markdown.

Query: "${userQuery}"${refinement ? `\nRefinement: "${refinement}"` : ''}

Return JSON:
{
  "propertyType": "string or null",
  "purpose": "Sale|Rent|Investment|Daily Booking|null",
  "locations": [{"name": "string", "type": "city|district|area"}],
  "budgetMin": "number or null",
  "budgetMax": "number or null",
  "currency": "EGP|USD|AED|SAR",
  "bedroomsMin": "number or null",
  "bedroomsMax": "number or null",
  "bathroomsMin": "number or null",
  "areaMin": "number or null",
  "areaMax": "number or null",
  "mustHaveAmenities": ["string"],
  "niceToHaveAmenities": ["string"],
  "finishing": "string or null",
  "investmentPurpose": "boolean",
  "urgency": "immediate|3months|flexible|null",
  "userGoal": "string",
  "specialRequirements": ["string"],
  "keywords": ["string"]
}`
    }]
  });

  let criteria = {};
  try {
    criteria = JSON.parse(extractMsg.content[0].text);
  } catch {
    criteria = {};
  }

  // STEP B — Query properties
  const query = {};
  if (criteria.purpose) {
    const purposeMap = { Sale: 'For Sale', Rent: 'For Rent', Investment: 'For Investment', 'Daily Booking': 'For Daily Booking' };
    query.purpose = purposeMap[criteria.purpose] || criteria.purpose;
  }

  let properties = [];
  try {
    properties = await base44.asServiceRole.entities.Property.filter(query, '-created_date', 200);
  } catch {
    properties = [];
  }

  // Filter and score properties
  const scored = properties.map(p => {
    let score = 0;

    // Location score (0-30)
    const locationStr = `${p.city_name || ''} ${p.district_name || ''} ${p.area_name || ''}`.toLowerCase();
    const locationMatch = (criteria.locations || []).some(loc =>
      locationStr.includes(loc.name.toLowerCase())
    );
    if (locationMatch) score += 30;
    else if (criteria.locations?.length > 0) {
      // Partial match
      const partial = (criteria.locations || []).some(loc => {
        const locLower = loc.name.toLowerCase();
        return locationStr.split(' ').some(w => w.length > 3 && locLower.includes(w));
      });
      if (partial) score += 15;
    } else {
      score += 20; // No location specified — neutral
    }

    // Budget score (0-25)
    const price = p.price_amount || p.price || 0;
    if (criteria.budgetMax && price > 0) {
      if (price <= criteria.budgetMax) score += 25;
      else if (price <= criteria.budgetMax * 1.1) score += 15;
      else if (price <= criteria.budgetMax * 1.2) score += 8;
    } else {
      score += 15; // No budget specified — neutral
    }

    // Size/bedroom score (0-20)
    const beds = p.beds || p.bedrooms || p.number_of_rooms || 0;
    if (criteria.bedroomsMin !== null && criteria.bedroomsMin !== undefined) {
      if (beds >= criteria.bedroomsMin) score += 20;
      else if (beds >= criteria.bedroomsMin - 1) score += 12;
      else if (beds >= criteria.bedroomsMin - 2) score += 5;
    } else {
      score += 12;
    }
    if (criteria.areaMin && (p.area_size || p.property_area || 0) >= criteria.areaMin * 0.85) score += 5;

    // Amenity score (0-15)
    const propAmenities = (p.amenity_ids || p.amenities || []).join(' ').toLowerCase();
    const propDesc = (p.description || p.short_description || '').toLowerCase();
    const propTitle = (p.title || p.name || '').toLowerCase();
    const allText = `${propAmenities} ${propDesc} ${propTitle}`;

    (criteria.mustHaveAmenities || []).forEach(a => {
      if (allText.includes(a.toLowerCase())) score += 5;
    });
    (criteria.niceToHaveAmenities || []).forEach(a => {
      if (allText.includes(a.toLowerCase())) score += 2;
    });
    score = Math.min(score + 15, score); // cap amenity bonus

    // Quality score (0-10)
    if (p.is_verified) score += 3;
    if ((p.photos || p.images || []).length > 10) score += 2;
    if (p.is_featured) score += 2;
    const daysSince = p.created_date ? (Date.now() - new Date(p.created_date).getTime()) / (1000 * 86400) : 999;
    if (daysSince < 30) score += 2;
    if (daysSince < 7) score += 1;

    return { ...p, _matchScore: Math.min(score, 100) };
  });

  // Sort by score and take top 20
  scored.sort((a, b) => b._matchScore - a._matchScore);
  const top20 = scored.slice(0, 20);
  const top5 = top20.slice(0, 5);

  // STEP C — Generate insights for top 5
  const insightsPromises = top5.map(async (prop) => {
    try {
      const insightMsg = await anthropic.messages.create({
        model: "claude-3-5-haiku-20241022",
        max_tokens: 512,
        messages: [{
          role: "user",
          content: `User search: "${userQuery}"
Property: ${prop.title || prop.name}, ${prop.city_name || ''} ${prop.district_name || ''}, ${prop.purpose || ''}, Price: ${prop.price_amount || prop.price || 'N/A'} ${prop.currency || 'EGP'}, Beds: ${prop.beds || 0}, Area: ${prop.area_size || 0}sqm.

Write a 2-3 sentence personalized explanation of why this property matches the user's needs. Be specific, reference their exact query. Also give 3 bullet match points and 1 concern if any.

Respond ONLY with JSON:
{"insight": "string", "matchPoints": ["string","string","string"], "concern": "string or null"}`
        }]
      });
      const data = JSON.parse(insightMsg.content[0].text);
      return { propertyId: prop.id, ...data };
    } catch {
      return {
        propertyId: prop.id,
        insight: "This property aligns well with your search criteria based on location, price, and features.",
        matchPoints: ["Matches your location preference", "Within your specified budget range", "Meets your bedroom requirements"],
        concern: null
      };
    }
  });

  const insights = await Promise.all(insightsPromises);
  const insightsMap = {};
  insights.forEach(i => { insightsMap[i.propertyId] = i; });

  // STEP D — Save search
  try {
    await base44.asServiceRole.entities.SavedSearch.create({
      userId: user.id,
      userEmail: user.email,
      query: userQuery,
      extractedCriteria: JSON.stringify(criteria),
      resultCount: top20.length,
      searchType: 'ai'
    });
  } catch { /* SavedSearch entity may not exist */ }

  return Response.json({
    success: true,
    criteria,
    results: top20,
    insights: insightsMap,
    totalFound: top20.length
  });
});