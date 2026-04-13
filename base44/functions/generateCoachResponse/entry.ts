import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { coachProfileId, userMessage, sessionId } = await req.json();

  const profiles = await base44.entities.CoachProfile.filter({ id: coachProfileId, userId: user.id });
  if (!profiles.length) return Response.json({ error: 'Profile not found' }, { status: 404 });
  const profile = profiles[0];

  // Get recent messages
  const recentMessages = await base44.entities.CoachMessage.filter({ coachProfileId }, '-created_date', 10);
  const recentContext = recentMessages.reverse().map(m => `${m.direction === 'user' ? 'User' : 'Coach'}: ${m.content}`).join('\n');

  const systemPrompt = `You are Kemedar Coach™, a friendly, knowledgeable and empathetic real estate guide specializing in Egyptian and Arab markets.

Your role:
- Guide users through their property journey step by step
- Answer real estate questions clearly and simply  
- Celebrate progress and encourage
- Warn about risks without fear-mongering
- Connect guidance to relevant Kemedar platform features
- Remember what the user has told you
- Adapt language to their level

Egyptian real estate context:
- First-time buyers are often anxious about paperwork and process
- Family is central — many decisions involve parents and relatives
- Religious considerations matter (Shariah-compliant financing)
- Trust is earned slowly; price negotiation is expected
- Off-plan risk is a major concern; cash transactions are common

Platform features to reference:
- Kemedar Advisor™ → /kemedar/advisor (personalized property matching)
- Kemedar Match™ → /kemedar/match (swipe-based discovery)
- Kemedar Predict™ → /kemedar/predict (price forecasting)
- Kemedar Negotiate™ → /kemedar/negotiate (strategic offer making)
- Kemedar Escrow™ → /kemedar/escrow/new (deal protection)
- Kemedar Vision™ → property photos (AI photo quality analysis)
- Life Score → /kemedar/life-score (area quality rating)
- Kemedar Twin™ → virtual tours
- Kemedar Finish™ → /kemedar/finish (home finishing)

User context:
  Journey: ${profile.journeyType}
  Progress: ${profile.overallProgress}%
  Current Stage: ${profile.currentStageId || 'getting started'}
  Experience level: ${profile.experienceLevel || 'beginner'}
  Preferred Language: ${profile.preferredLanguage || 'en'}
  Coach Memory: ${JSON.stringify(profile.coachMemory || {})}

Communication style:
- Warm and encouraging like a knowledgeable friend
- Never condescending; use simple analogies
- Celebrate every small win
- Always end with a clear next step
- If user writes in Arabic, respond in Arabic

Respond ONLY with valid JSON. No markdown wrapper.`;

  const userPrompt = `Recent conversation:
${recentContext}

User's new message: "${userMessage}"

Return JSON:
{
  "responseText": "your response in English (or Arabic if user wrote Arabic)",
  "tone": "encouraging|informative|warning|celebratory|empathetic",
  "nextStepSuggestion": "string or null",
  "platformFeatureSuggested": "string or null",
  "platformFeatureUrl": "string or null",
  "updatedMemoryFacts": {} or null,
  "stepCompletionSignal": false,
  "urgencyLevel": "low|medium|high",
  "attachedContentKey": "string or null"
}`;

  const aiResult = await base44.integrations.Core.InvokeLLM({
    prompt: userPrompt,
    model: 'claude_sonnet_4_6',
    response_json_schema: {
      type: 'object',
      properties: {
        responseText: { type: 'string' },
        tone: { type: 'string' },
        nextStepSuggestion: { type: 'string' },
        platformFeatureSuggested: { type: 'string' },
        platformFeatureUrl: { type: 'string' },
        updatedMemoryFacts: { type: 'object' },
        stepCompletionSignal: { type: 'boolean' },
        urgencyLevel: { type: 'string' },
        attachedContentKey: { type: 'string' }
      }
    }
  });

  const sid = sessionId || `session_${Date.now()}`;

  // Save user message
  await base44.entities.CoachMessage.create({
    coachProfileId, userId: user.id, sessionId: sid,
    direction: 'user', messageType: 'chat', content: userMessage, isRead: true
  });

  // Save coach response
  await base44.entities.CoachMessage.create({
    coachProfileId, userId: user.id, sessionId: sid,
    direction: 'coach', messageType: 'answer',
    content: aiResult.responseText,
    attachedContent: aiResult.platformFeatureSuggested ? {
      featureName: aiResult.platformFeatureSuggested,
      featureUrl: aiResult.platformFeatureUrl,
      suggestion: aiResult.nextStepSuggestion
    } : null,
    isRead: false, aiModel: 'claude_sonnet_4_6'
  });

  // Update profile memory and stats
  const memoryUpdate = { ...(profile.coachMemory || {}) };
  if (aiResult.updatedMemoryFacts) Object.assign(memoryUpdate, aiResult.updatedMemoryFacts);

  await base44.entities.CoachProfile.update(coachProfileId, {
    lastCoachInteractionAt: new Date().toISOString(),
    totalCoachMessages: (profile.totalCoachMessages || 0) + 2,
    coachMemory: memoryUpdate
  });

  return Response.json({ ...aiResult, sessionId: sid });
});