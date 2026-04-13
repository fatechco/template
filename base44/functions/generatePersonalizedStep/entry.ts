import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { coachProfileId, stepData } = await req.json();

  const profiles = await base44.entities.CoachProfile.filter({ id: coachProfileId, userId: user.id });
  if (!profiles.length) return Response.json({ error: 'Profile not found' }, { status: 404 });
  const profile = profiles[0];

  const prompt = `You are Kemedar Coach™. Personalize this step content for a specific user.

User Profile:
- Journey: ${profile.journeyType}
- Experience: ${profile.experienceLevel}
- Language: ${profile.preferredLanguage}
- Budget: ${profile.targetBudget ? profile.targetBudget + ' EGP' : 'not set'}
- Target Area: ${profile.targetArea || 'not specified'}
- Goal: ${profile.userGoal || 'not stated'}
- Memory: ${JSON.stringify(profile.coachMemory || {})}

Step to personalize:
${JSON.stringify(stepData)}

Return a JSON object with:
{
  "personalizedIntro": "1-2 sentence personalized intro referencing their specific situation",
  "whyThisMatters": "Brief explanation of why this step matters FOR THEM specifically",
  "coachTip": "A specific, actionable tip based on their profile",
  "estimatedMinutes": number,
  "difficulty": "easy|medium|hard"
}`;

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    model: 'claude_sonnet_4_6',
    response_json_schema: {
      type: 'object',
      properties: {
        personalizedIntro: { type: 'string' },
        whyThisMatters: { type: 'string' },
        coachTip: { type: 'string' },
        estimatedMinutes: { type: 'number' },
        difficulty: { type: 'string' }
      }
    }
  });

  return Response.json(result);
});