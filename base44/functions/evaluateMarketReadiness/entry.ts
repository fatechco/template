import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user || user.role !== 'admin') {
      return Response.json({ error: 'Admin access required' }, { status: 403 });
    }

    const { marketId, marketData } = await req.json();
    if (!marketId || !marketData) {
      return Response.json({ error: 'marketId and marketData required' }, { status: 400 });
    }

    const prompt = `You are a strategic market analyst for Kemedar, a PropTech super-app. 
    
Evaluate this market for expansion across the MENA region:

Market: ${marketData.cityName}, ${marketData.countryName}
Population: ${marketData.population || 'N/A'}
GDP per capita: $${marketData.gdpPerCapitaUSD || 'N/A'}
Internet penetration: ${marketData.internetPenetrationPercent || 'N/A'}%
Competitors: ${marketData.competitorNames?.join(', ') || 'N/A'}
Foreign ownership: ${marketData.foreignOwnershipAllowed ? 'Allowed' : 'Restricted'}

Score each dimension (0-100) and provide recommendations:

Return valid JSON with:
{
  "marketSizeScore": number,
  "digitalAdoptionScore": number,
  "competitorLandscapeScore": number,
  "regulatoryScore": number,
  "foAvailabilityScore": number,
  "economicScore": number,
  "realEstateActivityScore": number,
  "overallReadinessScore": number,
  "readinessGrade": "A+"|"A"|"B+"|"B"|"C+"|"C"|"D",
  "expansionRecommendation": "proceed"|"delay"|"modify_approach"|"avoid",
  "keyOpportunities": [string, string, string],
  "keyRisks": [string, string, string],
  "launchTimeline": string,
  "executiveSummary": string,
  "confidenceScore": number
}`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: "object",
        properties: {
          marketSizeScore: { type: "number" },
          digitalAdoptionScore: { type: "number" },
          competitorLandscapeScore: { type: "number" },
          regulatoryScore: { type: "number" },
          foAvailabilityScore: { type: "number" },
          economicScore: { type: "number" },
          realEstateActivityScore: { type: "number" },
          overallReadinessScore: { type: "number" },
          readinessGrade: { type: "string" },
          expansionRecommendation: { type: "string" },
          keyOpportunities: { type: "array", items: { type: "string" } },
          keyRisks: { type: "array", items: { type: "string" } },
          launchTimeline: { type: "string" },
          executiveSummary: { type: "string" },
          confidenceScore: { type: "number" }
        }
      }
    });

    const readinessDimensions = {
      marketSize: { score: result.marketSizeScore, weight: 0.20 },
      digitalAdoption: { score: result.digitalAdoptionScore, weight: 0.15 },
      competitorLandscape: { score: result.competitorLandscapeScore, weight: 0.15 },
      regulatory: { score: result.regulatoryScore, weight: 0.15 },
      foAvailability: { score: result.foAvailabilityScore, weight: 0.10 },
      economic: { score: result.economicScore, weight: 0.10 },
      realEstateActivity: { score: result.realEstateActivityScore, weight: 0.15 }
    };

    const updateData = {
      overallReadinessScore: result.overallReadinessScore,
      readinessGrade: result.readinessGrade,
      readinessDimensions,
      aiMarketSummary: result.executiveSummary,
      aiExpansionRecommendation: result.expansionRecommendation,
      aiRiskFactors: result.keyRisks,
      aiOpportunities: result.keyOpportunities,
      lastAnalyzed: new Date().toISOString(),
      expansionStatus: 'under_evaluation'
    };

    await base44.asServiceRole.entities.MarketProfile.update(marketId, updateData);

    return Response.json({
      success: true,
      score: result.overallReadinessScore,
      grade: result.readinessGrade,
      recommendation: result.expansionRecommendation,
      confidenceScore: result.confidenceScore
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});