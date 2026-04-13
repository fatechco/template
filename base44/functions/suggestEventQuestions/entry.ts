import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { eventId } = await req.json();
    const events = await base44.entities.LiveEvent.filter({ id: eventId });
    const event = events[0];
    if (!event) return Response.json({ error: 'Event not found' }, { status: 404 });

    const profiles = await base44.entities.CoachProfile.filter({ userId: user.id });
    const advisorProfiles = await base44.entities.AdvisorProfile.filter({ userId: user.id }).catch(() => []);
    const profile = profiles[0];
    const advisor = advisorProfiles[0];

    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate 5 personalized questions for a viewer to ask during a Kemedar Live™ real estate event.

Event: "${event.title}" (${event.eventType?.replace(/_/g, ' ')})
Event description: ${event.description?.slice(0, 500) || ''}

Viewer profile:
- Journey type: ${profile?.journeyType || 'general buyer'}
- Budget: ${advisor?.budget || profile?.targetBudget || 'not specified'}
- Target area: ${profile?.targetArea || 'Cairo'}
- Experience: ${profile?.experienceLevel || 'unknown'}

Return JSON:
{
  "questions": [
    {"question": "What is the...", "category": "price", "rationale": "Relevant because..."},
    {"question": "...", "category": "unit", "rationale": "..."},
    {"question": "...", "category": "payment", "rationale": "..."},
    {"question": "...", "category": "legal", "rationale": "..."},
    {"question": "...", "category": "timeline", "rationale": "..."}
  ]
}`,
      response_json_schema: {
        type: 'object',
        properties: {
          questions: { type: 'array', items: { type: 'object' } }
        }
      }
    });

    return Response.json({ success: true, questions: result.questions || [] });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});