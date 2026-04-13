import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { messageContent, eventId, senderType } = await req.json();

    if (senderType === 'host' || senderType === 'moderator') {
      return Response.json({ action: 'approve', isQuestion: false, urgency: 'low', reason: 'Host/moderator messages auto-approved' });
    }

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt: `You are a real estate event moderator for Kemedar Live™ in Egypt.
Moderate this viewer message during a live property event.

Message: "${messageContent}"
Event context: Real estate live event (property launches, market briefings, investment seminars)

Evaluate and return ONLY JSON:
{
  "action": "approve" | "flag" | "remove",
  "isQuestion": true/false,
  "isRelevant": true/false,
  "urgency": "low" | "medium" | "high",
  "reason": "brief reason",
  "suggestedCategory": "price" | "unit" | "payment" | "legal" | "timeline" | "general" | null
}

Approve if: relevant question, genuine interest, positive engagement
Flag if: off-topic but not harmful, needs review
Remove if: spam, inappropriate, competitor promotion, harassment`,
      response_json_schema: {
        type: 'object',
        properties: {
          action: { type: 'string' },
          isQuestion: { type: 'boolean' },
          isRelevant: { type: 'boolean' },
          urgency: { type: 'string' },
          reason: { type: 'string' },
          suggestedCategory: { type: 'string' }
        }
      }
    });

    return Response.json(result);
  } catch (error) {
    return Response.json({ action: 'approve', isQuestion: false, urgency: 'low', reason: 'Moderation error — defaulting to approve' });
  }
});