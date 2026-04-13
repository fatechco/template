import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { journeyId, userId } = await req.json();

    if (!journeyId) {
      return Response.json({ error: 'Missing journeyId parameter' }, { status: 400 });
    }

    // Get the journey
    const journeys = await base44.asServiceRole.entities.ConciergeJourney.filter({ id: journeyId });
    if (!journeys || journeys.length === 0) {
      return Response.json({ error: 'Journey not found' }, { status: 404 });
    }

    const journey = journeys[0];

    // Verify ownership
    if (journey.userId !== user.id && user.role !== 'admin') {
      return Response.json({ error: 'Unauthorized to dismiss this journey' }, { status: 403 });
    }

    // Update journey status to Dismissed
    const updatedJourney = await base44.asServiceRole.entities.ConciergeJourney.update(journeyId, {
      status: 'Dismissed'
    });

    // TODO: Remove "My Move-In Concierge" from dashboard sidebar
    // This would be handled by the frontend checking journey.status

    // Get all tasks and mark them as skipped so no more notifications are sent
    const tasks = await base44.asServiceRole.entities.ConciergeTask.filter({ journeyId });
    
    if (tasks && tasks.length > 0) {
      const now = new Date().toISOString();
      for (const task of tasks) {
        if (task.status !== 'Completed' && task.status !== 'Skipped') {
          await base44.asServiceRole.entities.ConciergeTask.update(task.id, {
            status: 'Skipped',
            skippedAt: now
          });
        }
      }
    }

    return Response.json({
      message: 'Journey dismissed',
      journey: updatedJourney
    }, { status: 200 });
  } catch (error) {
    console.error('dismissJourney error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});