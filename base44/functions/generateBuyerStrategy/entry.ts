import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const CLAUDE_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { propertyId, buyerProfile } = await req.json();

  // Fetch property
  const properties = await base44.asServiceRole.entities.Property.filter({ id: propertyId });
  const property = properties[0];
  if (!property) return Response.json({ error: 'Property not found' }, { status: 404 });

  // Calculate days listed
  const daysListed = property.created_date
    ? Math.floor((Date.now() - new Date(property.created_date)) / 86400000)
    : 0;

  // Fetch negotiation analytics for this area
  let analytics = null;
  if (property.district_name || property.city_name) {
    const analyticsData = await base44.asServiceRole.entities.NegotiationAnalytics
      .filter({ propertyType: property.category_name || 'all' })
      .catch(() => []);
    analytics = analyticsData[0] || null;
  }

  // Gather market context
  const listedPrice = property.price_amount || 0;
  const pricePerSqm = property.area_size ? Math.round(listedPrice / property.area_size) : 0;
  const marketAvgPerSqm = analytics?.avgNegotiationDiscount
    ? Math.round(pricePerSqm * (1 - analytics.avgNegotiationDiscount / 100))
    : pricePerSqm;

  const propertyData = {
    title: property.title,
    category: property.category_name,
    purpose: property.purpose,
    listedPrice,
    currency: property.currency || 'EGP',
    area: property.area_size,
    pricePerSqm,
    beds: property.beds,
    city: property.city_name,
    district: property.district_name,
    publisherType: property.publisher_type || 'Individual',
    daysListed,
    finishing: property.finishing_type || 'Standard',
    floor: property.floor_number,
    yearBuilt: property.year_built,
    description: (property.description || '').slice(0, 300),
  };

  const marketData = {
    marketAvgPricePerSqm: marketAvgPerSqm,
    avgNegotiationDiscount: analytics?.avgNegotiationDiscount || 8,
    avgRoundsToClose: analytics?.avgRoundsToClose || 3,
    avgDaysOnMarket: analytics?.avgDaysToClose || 45,
    comparableCount: analytics?.totalSessions || 12,
  };

  const buyerData = {
    paymentMethod: buyerProfile?.paymentMethod || 'cash',
    urgency: buyerProfile?.urgency || 'moderate',
    budgetMax: buyerProfile?.budgetMax || listedPrice * 1.05,
    purpose: buyerProfile?.purpose || 'own_use',
  };

  const systemPrompt = `You are Kemedar Negotiate™, an expert AI real estate negotiation coach specializing in Egyptian and MENA property markets.

You have deep knowledge of:
- Egyptian real estate negotiation customs (direct offers are common, oral agreements before written, family involvement in decisions)
- Typical negotiation discounts: Cairo residential 5-15% below asking, high-end 3-8%, motivated sellers up to 20%, land 10-25%
- Payment leverage: Cash = 5-8% extra discount, Mortgage = moderate, Installment = weakest
- Urgency signals: Listed >90 days = highly motivated, multiple price reductions = desperate, individual owner = more flexible
- Seasonal patterns and market dynamics in Egypt

Be data-driven, specific and honest. Give exact EGP price recommendations. Respond ONLY with valid JSON.`;

  const userMessage = `Generate buyer negotiation strategy.

PROPERTY DATA:
${JSON.stringify(propertyData)}

MARKET DATA:
${JSON.stringify(marketData)}

BUYER PROFILE:
${JSON.stringify(buyerData)}

Return this exact JSON:
{
  "sellerMotivationScore": number 0-100,
  "negotiationLeverage": "buyer" | "seller" | "balanced",
  "leverageExplanation": string,
  "recommendedOpeningOffer": number,
  "openingOfferPercent": number,
  "openingOfferRationale": string,
  "expectedCounterMin": number,
  "expectedCounterMax": number,
  "expectedCounterRationale": string,
  "walkAwayPrice": number,
  "walkAwayRationale": string,
  "bestArguments": [{"argument": string, "howToUseIt": string, "strength": "low"|"medium"|"high"}],
  "paymentMethodTip": string,
  "timingAdvice": string,
  "urgencySignals": [string],
  "redFlags": [string],
  "marketContext": string,
  "negotiationScript": string,
  "confidenceScore": number 0-100,
  "briefingSummary": string
}`;

  let strategy;
  if (!CLAUDE_API_KEY) {
    // Fallback mock strategy
    const openingOffer = Math.round(listedPrice * 0.88);
    const walkAway = Math.round(listedPrice * 0.95);
    strategy = {
      sellerMotivationScore: daysListed > 90 ? 75 : daysListed > 45 ? 55 : 35,
      negotiationLeverage: daysListed > 60 ? "buyer" : "balanced",
      leverageExplanation: daysListed > 60
        ? `This property has been listed for ${daysListed} days — longer than average, suggesting seller flexibility.`
        : "Market conditions are balanced in this area.",
      recommendedOpeningOffer: openingOffer,
      openingOfferPercent: 88,
      openingOfferRationale: "An 88% offer is strategic — low enough to leave negotiation room but serious enough to be considered.",
      expectedCounterMin: Math.round(listedPrice * 0.93),
      expectedCounterMax: Math.round(listedPrice * 0.97),
      expectedCounterRationale: "Sellers in this area typically counter between 93-97% of asking price.",
      walkAwayPrice: walkAway,
      walkAwayRationale: "Based on market comps, paying above 95% of asking would be above fair market value.",
      bestArguments: [
        { argument: "Property has been listed longer than market average", howToUseIt: "Mention you've been tracking this property and are ready to move quickly if price is right", strength: "high" },
        { argument: buyerData.paymentMethod === 'cash' ? "You're offering immediate full cash payment" : "You have pre-approved financing ready", howToUseIt: "Lead with payment certainty in your offer message — sellers value certainty", strength: "high" },
        { argument: "You've compared similar properties in the area", howToUseIt: "Reference market data to justify your offer amount professionally", strength: "medium" }
      ],
      paymentMethodTip: buyerData.paymentMethod === 'cash'
        ? "Cash payment is your strongest tool. Mention 'immediate full cash payment' early — sellers value certainty over waiting for mortgage approval."
        : "Mortgage financing is common but sellers prefer certainty. If possible, get pre-approval and share the letter with your offer.",
      timingAdvice: "Submit your offer mid-week (Tuesday-Thursday) — sellers are more responsive and agents are fully available.",
      urgencySignals: daysListed > 60 ? [`Listed ${daysListed} days ago (above average)`, "Individual owner listing (more flexible than agency)"] : ["No strong urgency signals detected"],
      redFlags: [],
      marketContext: `Properties in ${property.district_name || property.city_name || 'this area'} average ${marketAvgPerSqm.toLocaleString()} EGP/m². This property is priced at ${pricePerSqm.toLocaleString()} EGP/m². The typical negotiation discount in this area is ${marketData.avgNegotiationDiscount}%.`,
      negotiationScript: `"I've been following this property and I'm genuinely interested. Based on current market conditions, I'd like to make a formal offer of [X] EGP..."`,
      confidenceScore: 72,
      briefingSummary: `This ${property.category_name || 'property'} has been listed for ${daysListed} days, giving you moderate negotiation leverage. Our recommended opening offer of ${openingOffer.toLocaleString()} EGP (88% of asking) is strategically positioned to start negotiations. Your walk-away price of ${walkAway.toLocaleString()} EGP represents fair market value for this area.`
    };
  } else {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    strategy = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  }

  // Save session
  const now = new Date();
  const expiresAt = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000).toISOString();
  const session = await base44.asServiceRole.entities.NegotiationSession.create({
    propertyId,
    buyerId: user.id,
    sellerId: property.created_by || 'unknown',
    status: 'draft',
    currentRound: 0,
    propertySnapshot: propertyData,
    listedPrice,
    listedCurrency: property.currency || 'EGP',
    listedPricePerSqm: pricePerSqm,
    marketSnapshotAt: now.toISOString(),
    marketAvgPricePerSqm: marketAvgPerSqm,
    marketDaysOnMarket: marketData.avgDaysOnMarket,
    propertyDaysListed: daysListed,
    comparableCount: marketData.comparableCount,
    buyerStrategy: strategy,
    expiresAt
  });

  return Response.json({ session, strategy });
});