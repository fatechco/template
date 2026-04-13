import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { lifeScoreId, districtName, cityName, scoreData, reviewSummary } = await req.json();

    if (!scoreData || !districtName) {
      return Response.json({ error: 'Missing required data' }, { status: 400 });
    }

    // Build prompt for Claude
    const systemPrompt = `You are Kemedar Life Score™, an expert neighborhood analyst for the Egyptian and MENA property market.

You create honest, vivid, helpful neighborhood descriptions that help people understand what it is actually like to LIVE in a specific area.

You know Egyptian neighborhoods well and their characteristics.

Write in warm, honest, specific tone. Never be overly promotional.
Mention real pros AND real challenges. Use specific details from the data.
Respond ONLY with valid JSON.`;

    const userMessage = `Generate Life Score narrative for:
${districtName}, ${cityName}

SCORE DATA:
${JSON.stringify({
  overallScore: scoreData.overallLifeScore,
  walkability: scoreData.walkabilityScore,
  noise: scoreData.noiseScore,
  green: scoreData.greenScore,
  safety: scoreData.safetyScore,
  connectivity: scoreData.connectivityScore,
  education: scoreData.educationScore,
  convenience: scoreData.convenienceScore,
  healthcare: scoreData.healthcareScore,
  grade: scoreData.overallGrade
})}

USER REVIEW SUMMARY:
${JSON.stringify(reviewSummary || {})}

Return:
{
  'aiSummary': string (3-4 sentences),
  'aiSummaryAr': string,
  'neighborhoodPersonality': string (8-12 words),
  'neighborhoodPersonalityAr': string,
  'bestFor': [string],
  'notIdealFor': [string],
  'topHighlights': [string],
  'topChallenges': [string],
  'hiddenGem': string or null,
  'localTip': string
}`;

    // Call Claude
    const response = await base44.integrations.Core.InvokeLLM({
      model: 'claude_sonnet_4_6',
      prompt: userMessage,
      response_json_schema: {
        type: 'object',
        properties: {
          aiSummary: { type: 'string' },
          aiSummaryAr: { type: 'string' },
          neighborhoodPersonality: { type: 'string' },
          neighborhoodPersonalityAr: { type: 'string' },
          bestFor: { type: 'array', items: { type: 'string' } },
          notIdealFor: { type: 'array', items: { type: 'string' } },
          topHighlights: { type: 'array', items: { type: 'string' } },
          topChallenges: { type: 'array', items: { type: 'string' } },
          hiddenGem: { type: ['string', 'null'] },
          localTip: { type: 'string' }
        },
        required: ['aiSummary', 'neighborhoodPersonality', 'bestFor', 'notIdealFor', 'topHighlights', 'topChallenges', 'localTip']
      }
    });

    // Update NeighborhoodLifeScore with narrative
    if (lifeScoreId && response && response.aiSummary) {
      await base44.entities.NeighborhoodLifeScore.update(lifeScoreId, {
        aiSummary: response.aiSummary,
        aiSummaryAr: response.aiSummaryAr || response.aiSummary,
        neighborhoodPersonality: response.neighborhoodPersonality,
        neighborhoodPersonalityAr: response.neighborhoodPersonalityAr || response.neighborhoodPersonality,
        bestFor: response.bestFor || [],
        notIdealFor: response.notIdealFor || [],
        topHighlights: response.topHighlights || [],
        topChallenges: response.topChallenges || []
      });
    }

    return Response.json({ success: true, narrative: response });
  } catch (error) {
    console.error('Generate Life Score Narrative error:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});