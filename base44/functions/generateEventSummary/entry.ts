import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const { eventId } = await req.json();
    if (!eventId) return Response.json({ error: 'eventId required' }, { status: 400 });

    const events = await base44.asServiceRole.entities.LiveEvent.filter({ id: eventId });
    const event = events[0];
    if (!event) return Response.json({ error: 'Event not found' }, { status: 404 });

    await base44.asServiceRole.entities.LiveEvent.update(eventId, { aiSummaryStatus: 'processing' });

    const messages = await base44.asServiceRole.entities.LiveEventMessage.filter({ eventId }, '-created_date', 200);
    const polls = await base44.asServiceRole.entities.LiveEventPoll.filter({ eventId });
    const reservations = await base44.asServiceRole.entities.LiveEventReservation.filter({ eventId });

    const questions = messages.filter(m => m.isQuestion);
    const answered = questions.filter(m => m.isAnswered);
    const sampleMessages = messages.filter(m => m.messageType === 'chat').slice(0, 50);

    const prompt = `Summarize this Kemedar Live™ real estate event and return ONLY valid JSON.

Event: ${event.title} (${event.eventType?.replace(/_/g, ' ')})
Host: ${event.organizationName || 'Host'}
Duration: ${event.actualDurationMinutes || event.estimatedDurationMinutes} minutes
Peak viewers: ${event.peakViewers}
Total registered: ${event.totalRegistered}
Reservations made: ${reservations.length}
Total reactions: ${event.totalReactions}

Sample chat messages: ${JSON.stringify(sampleMessages.slice(0, 20).map(m => m.content))}
Questions asked: ${JSON.stringify(questions.slice(0, 30).map(m => ({ q: m.content, upvotes: m.upvotes, answered: m.isAnswered, answer: m.answerContent })))}
Poll results: ${JSON.stringify(polls.map(p => ({ q: p.question, options: p.options, total: p.totalResponses })))}

Return JSON:
{
  "eventSummary": "4-5 paragraph comprehensive summary in English",
  "eventSummaryAr": "4-5 paragraph summary in Arabic",
  "keyAnnouncements": ["announcement1", "announcement2"],
  "pricingRevealed": [{"unitType": "2BR", "priceFrom": 0, "currency": "EGP", "paymentPlan": ""}],
  "topQuestions": [{"question": "", "answer": "", "askedCount": 1}],
  "marketInsights": ["insight1"],
  "keyMoments": [{"timestamp": 0, "description": "", "importance": "high"}],
  "audienceSentiment": "positive",
  "sentimentScore": 85,
  "missedKeyPoints": ["topic not covered"],
  "recommendedNextSteps": ["step for viewers"]
}`;

    const result = await base44.asServiceRole.integrations.Core.InvokeLLM({
      prompt,
      response_json_schema: {
        type: 'object',
        properties: {
          eventSummary: { type: 'string' },
          eventSummaryAr: { type: 'string' },
          keyAnnouncements: { type: 'array', items: { type: 'string' } },
          pricingRevealed: { type: 'array', items: { type: 'object' } },
          topQuestions: { type: 'array', items: { type: 'object' } },
          marketInsights: { type: 'array', items: { type: 'string' } },
          keyMoments: { type: 'array', items: { type: 'object' } },
          audienceSentiment: { type: 'string' },
          sentimentScore: { type: 'number' },
          missedKeyPoints: { type: 'array', items: { type: 'string' } },
          recommendedNextSteps: { type: 'array', items: { type: 'string' } }
        }
      }
    });

    await base44.asServiceRole.entities.LiveEvent.update(eventId, {
      aiSummaryStatus: 'complete',
      aiEventSummary: result.eventSummary,
      aiEventSummaryAr: result.eventSummaryAr,
      aiKeyMoments: result.keyMoments,
      aiTopQuestions: result.topQuestions,
      aiSentimentScore: result.sentimentScore
    });

    return Response.json({ success: true, summary: result });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});