import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  const base44 = createClientFromRequest(req);
  const user = await base44.auth.me();
  if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const { coachProfileId, nudgeType } = await req.json();

  const profiles = await base44.entities.CoachProfile.filter({ id: coachProfileId });
  if (!profiles.length) return Response.json({ error: 'Not found' }, { status: 404 });
  const profile = profiles[0];

  const daysSinceActive = profile.lastActiveDate
    ? Math.floor((Date.now() - new Date(profile.lastActiveDate).getTime()) / 86400000)
    : 0;

  const prompt = `Create a personalized nudge message for Kemedar Coach™.

User:
- Journey: ${profile.journeyType}
- Progress: ${profile.overallProgress}%
- Current step: ${profile.currentStepId}
- Days inactive: ${daysSinceActive}
- Streak: ${profile.streakDays} days
- Language: ${profile.preferredLanguage}

Nudge type: ${nudgeType}

Return JSON:
{
  "title": "Short title (max 50 chars)",
  "titleAr": "Arabic title",
  "message": "Personalized message (2-3 sentences max)",
  "messageAr": "Arabic version",
  "actionText": "Button text",
  "scheduledFor": "ISO datetime (now + appropriate delay)"
}`;

  const result = await base44.integrations.Core.InvokeLLM({
    prompt,
    response_json_schema: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        titleAr: { type: 'string' },
        message: { type: 'string' },
        messageAr: { type: 'string' },
        actionText: { type: 'string' },
        scheduledFor: { type: 'string' }
      }
    }
  });

  // Save nudge record
  const nudge = await base44.entities.CoachNudge.create({
    coachProfileId,
    userId: profile.userId,
    nudgeType,
    ...result,
    actionUrl: '/kemedar/coach',
    scheduledFor: result.scheduledFor || new Date().toISOString()
  });

  return Response.json(nudge);
});