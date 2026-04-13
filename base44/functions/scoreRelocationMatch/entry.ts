import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) {
      return Response.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { relocationProfileId } = await req.json();
    const profile = (await base44.asServiceRole.entities.RelocationProfile.filter({ id: relocationProfileId }))[0];
    
    if (!profile) {
      return Response.json({ error: 'Profile not found' }, { status: 404 });
    }

    // Get all markets to match against
    const markets = await base44.asServiceRole.entities.MarketProfile.filter({ isPublic: true });
    
    const prompt = `User profile: 
    Priorities: ${JSON.stringify(profile.priorities)}
    Budget: ${profile.budget?.forProperty}
    Timeline: ${profile.timeline}
    Family size: ${profile.familySize}
    
Available markets with readiness scores:
${markets.map(m => `${m.cityName}, ${m.countryName}: Score ${m.overallReadinessScore}, Revenue $${m.platformRevenueMonthly}, FOs: ${m.activeFOs}`).join('\n')}

Rate each market 0-100 for this user's relocation fit.
Return JSON: {"matches": [{"marketId": string, "score": number, "reasons": [string]}]}`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          matches: {
            type: "array",
            items: {
              type: "object",
              properties: {
                marketId: { type: "string" },
                score: { type: "number" },
                reasons: { type: "array", items: { type: "string" } }
              }
            }
          }
        }
      }
    });

    // Update profile with match scores
    await base44.asServiceRole.entities.RelocationProfile.update(relocationProfileId, {
      aiMatchScore: result.matches.sort((a, b) => b.score - a.score).slice(0, 5)
    });

    return Response.json({
      success: true,
      matches: result.matches.sort((a, b) => b.score - a.score).slice(0, 5)
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});