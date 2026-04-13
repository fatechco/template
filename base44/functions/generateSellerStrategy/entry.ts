import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

const CLAUDE_API_KEY = Deno.env.get("ANTHROPIC_API_KEY");

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { sessionId, offerId } = await req.json();

  const sessions = await base44.asServiceRole.entities.NegotiationSession.filter({ id: sessionId });
  const session = sessions[0];
  if (!session) return Response.json({ error: 'Session not found' }, { status: 404 });

  const offers = await base44.asServiceRole.entities.NegotiationOffer.filter({ id: offerId });
  const offer = offers[0];
  if (!offer) return Response.json({ error: 'Offer not found' }, { status: 404 });

  const listedPrice = session.listedPrice || 0;
  const offerAmount = offer.offerAmount || 0;
  const discountPct = listedPrice ? Math.round(((listedPrice - offerAmount) / listedPrice) * 100) : 0;
  const marketAvg = session.marketAvgPricePerSqm || 0;
  const property = session.propertySnapshot || {};

  const systemPrompt = `You are Kemedar Negotiate™, an expert AI real estate negotiation advisor for sellers in the Egyptian and MENA property market.
Help the seller evaluate incoming offers and craft the best response strategy.
Be specific with EGP amounts. Respond ONLY with valid JSON.`;

  const userMessage = `Analyze this incoming offer and generate seller counter-offer strategy.

PROPERTY: ${JSON.stringify(property)}
LISTED PRICE: ${listedPrice.toLocaleString()} EGP
INCOMING OFFER: ${offerAmount.toLocaleString()} EGP (${discountPct}% below asking)
PAYMENT METHOD: ${offer.paymentMethod}
PAYMENT TIMELINE: ${offer.paymentTimeline || 'not specified'}
CONDITIONS: ${offer.conditions || 'none'}
MARKET AVG PRICE/SQM: ${marketAvg.toLocaleString()} EGP
NEGOTIATION ROUND: ${session.currentRound}
DAYS LISTED: ${session.propertyDaysListed || 0}

Return this exact JSON:
{
  "offerAssessment": "strong" | "fair" | "low" | "very_low",
  "assessmentRationale": string,
  "recommendedCounterOffer": number,
  "counterOfferPercent": number,
  "minimumAcceptable": number,
  "strongCounterArguments": [string],
  "buyerMotivationSignals": [string],
  "holdFirmAdvice": boolean,
  "holdFirmReason": string,
  "counterOfferRationale": string,
  "acceptanceAdvice": string,
  "strategyRationale": string,
  "urgencyAssessment": "high" | "medium" | "low"
}`;

  let strategy;
  if (!CLAUDE_API_KEY) {
    const counter = Math.round(listedPrice * (discountPct > 15 ? 0.96 : discountPct > 8 ? 0.94 : 0.98));
    strategy = {
      offerAssessment: discountPct > 20 ? "very_low" : discountPct > 12 ? "low" : discountPct > 5 ? "fair" : "strong",
      assessmentRationale: `Offer is ${discountPct}% below asking price. ${discountPct > 15 ? "This is significantly below market rate." : discountPct > 8 ? "This is negotiable with a firm counter." : "This is a reasonable offer worth considering."}`,
      recommendedCounterOffer: counter,
      counterOfferPercent: Math.round((counter / listedPrice) * 100),
      minimumAcceptable: Math.round(listedPrice * 0.90),
      strongCounterArguments: [
        "Property is priced at or below market average for this area",
        offer.paymentMethod === 'cash' ? "Cash payment accepted but price needs adjustment" : "Financing terms affect our flexibility",
        "Recent similar properties in this area sold closer to asking price"
      ],
      buyerMotivationSignals: [offer.paymentMethod === 'cash' ? "Buyer has cash — serious buyer" : "Buyer has financing — committed buyer"],
      holdFirmAdvice: discountPct > 15,
      holdFirmReason: discountPct > 15 ? "Offer is significantly below market value. Counter firmly to establish your price anchor." : "Room for negotiation exists but don't go below 90% of asking.",
      counterOfferRationale: `Countering at ${counter.toLocaleString()} EGP positions you close to market fair value while leaving room for final negotiation.`,
      acceptanceAdvice: discountPct < 5 ? "This is a strong offer — consider accepting to secure the deal." : `Consider accepting if buyer will not move above ${Math.round(listedPrice * 0.92).toLocaleString()} EGP.`,
      strategyRationale: "Counter firmly and let buyer close the gap. Most deals in this market close within 2-3 rounds.",
      urgencyAssessment: offer.paymentMethod === 'cash' ? "high" : "medium"
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
        max_tokens: 1500,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }]
      })
    });
    const data = await response.json();
    const text = data.content?.[0]?.text || '{}';
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    strategy = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
  }

  // Update session with seller strategy
  await base44.asServiceRole.entities.NegotiationSession.update(sessionId, {
    sellerStrategy: strategy
  });

  return Response.json({ strategy });
});