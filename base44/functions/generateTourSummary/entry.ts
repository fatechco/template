import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const { sessionId } = await req.json();

    if (!sessionId) {
      return Response.json({ error: 'sessionId required' }, { status: 400 });
    }

    // Fetch session data
    const sessions = await base44.entities.LiveTourSession.filter({ id: sessionId });
    if (!sessions.length) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }
    
    const session = sessions[0];

    // Fetch all messages for this session
    const messages = await base44.entities.TourChatMessage.filter({ sessionId });

    // Fetch registrations for this session
    const registrations = await base44.entities.LiveTourRegistration.filter({ sessionId });

    // Count interested participants
    const interestedCount = registrations.filter(r => r.interestedInProperty).length;

    // Parse questions and reactions
    const questions = messages.filter(m => m.isQuestion);
    const reactions = messages.filter(m => m.reactionType);
    const topQuestions = {};

    questions.forEach(q => {
      const key = q.content;
      topQuestions[key] = (topQuestions[key] || 0) + 1;
    });

    const topQuestionsArray = Object.entries(topQuestions)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([question, frequency]) => ({
        question,
        frequency,
        answered: questions.find(q => q.content === question)?.isAnswered || false
      }));

    // Prepare context for Claude
    const sessionContext = {
      title: session.title,
      type: session.sessionType,
      duration: session.actualDuration || 0,
      participants: registrations.length,
      attended: registrations.filter(r => r.attended).length,
      interested: interestedCount,
      totalMessages: messages.length,
      totalQuestions: questions.length,
      totalReactions: reactions.length,
      topQuestions: topQuestionsArray
    };

    const messageContext = messages.slice(-50).map(m => ({
      role: m.senderRole,
      type: m.messageType,
      content: m.content
    }));

    // Call Claude API
    const summary = await base44.integrations.Core.InvokeLLM({
      prompt: `You are summarizing a live property tour for the host (seller/agent). Be helpful and highlight actionable insights. Return ONLY valid JSON with these fields exactly:
{
  "sessionSummary": "2-3 sentence overall summary",
  "keyHighlights": ["highlight1", "highlight2", "highlight3"],
  "topQuestions": [{"question": "...", "frequency": 1, "answered": true}],
  "buyerInterestLevel": "high|medium|low",
  "interestedParticipants": 0,
  "suggestedFollowUpActions": ["action1", "action2"],
  "commonConcerns": ["concern1", "concern2"],
  "pricingSignals": "any price comments or null",
  "recommendedImprovements": ["improvement1", "improvement2"]
}

Tour Data:
${JSON.stringify(sessionContext)}

Recent Messages:
${JSON.stringify(messageContext)}`,
      model: 'gpt_5_mini'
    });

    const parsedSummary = typeof summary === 'string' ? JSON.parse(summary) : summary;

    return Response.json({
      ...parsedSummary,
      generatedAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating tour summary:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});