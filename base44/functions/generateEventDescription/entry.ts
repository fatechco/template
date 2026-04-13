import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { briefDescription, eventType, hostName, organizationName, propertyDetails } = await req.json();

    const prompt = `You are a real estate marketing expert for Kemedar™, Egypt's leading proptech platform.
Generate compelling event content for a Kemedar Live™ event. Return ONLY valid JSON.

Event brief: ${briefDescription}
Event type: ${eventType?.replace(/_/g, ' ')}
Host: ${hostName} from ${organizationName || 'Kemedar'}
Properties: ${propertyDetails || 'Real estate properties in Egypt'}

Return JSON:
{
  "titleEn": "Compelling English event title (max 80 chars)",
  "titleAr": "Arabic title",
  "descriptionEn": "Engaging 3-4 paragraph English description with what attendees will learn/gain",
  "descriptionAr": "Arabic description",
  "agendaSuggestions": [
    {"time": "0:00-0:10", "topic": "Welcome and introductions", "durationMinutes": 10},
    {"time": "0:10-0:30", "topic": "Property showcase", "durationMinutes": 20},
    {"time": "0:30-0:50", "topic": "Pricing and payment plans", "durationMinutes": 20},
    {"time": "0:50-1:00", "topic": "Live Q&A", "durationMinutes": 10}
  ],
  "targetAudienceCopy": "One sentence describing ideal attendee",
  "registrationHook": "Compelling reason to register NOW (urgency/FOMO)",
  "tags": ["tag1", "tag2", "tag3"]
}`;

    const result = await base44.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          titleEn: { type: 'string' },
          titleAr: { type: 'string' },
          descriptionEn: { type: 'string' },
          descriptionAr: { type: 'string' },
          agendaSuggestions: { type: 'array', items: { type: 'object' } },
          targetAudienceCopy: { type: 'string' },
          registrationHook: { type: 'string' },
          tags: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    return Response.json({ success: true, ...result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});