import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { journeyId, moveInDate } = await req.json();

    if (!journeyId || !moveInDate) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // Get the journey
    const journeys = await base44.asServiceRole.entities.ConciergeJourney.filter({ id: journeyId });
    if (!journeys || journeys.length === 0) {
      return Response.json({ error: 'Journey not found' }, { status: 404 });
    }

    const journey = journeys[0];

    // Update journey with new moveInDate
    await base44.asServiceRole.entities.ConciergeJourney.update(journeyId, {
      moveInDate
    });

    // Get all tasks in this journey
    const tasks = await base44.asServiceRole.entities.ConciergeTask.filter({ journeyId });

    const today = new Date().toISOString().split('T')[0];
    const tasksToNotify = [];

    if (tasks && tasks.length > 0) {
      for (const task of tasks) {
        // Only recalculate if triggerDayFromMoveIn is set
        if (task.triggerDayFromMoveIn !== null && task.triggerDayFromMoveIn !== undefined) {
          const moveInDateObj = new Date(moveInDate);
          const newDueDate = new Date(moveInDateObj.getTime() + task.triggerDayFromMoveIn * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

          await base44.asServiceRole.entities.ConciergeTask.update(task.id, {
            dueDate: newDueDate
          });

          // If new dueDate is in the past, mark as Due and queue for notification
          if (newDueDate <= today && task.status === 'Pending') {
            await base44.asServiceRole.entities.ConciergeTask.update(task.id, {
              status: 'Due'
            });
            tasksToNotify.push(task.id);
          }
        }
      }
    }

    return Response.json({
      message: 'Move-in date updated',
      tasksUpdated: tasks ? tasks.length : 0,
      tasksQueuedForNotification: tasksToNotify.length
    }, { status: 200 });
  } catch (error) {
    console.error('setMoveInDate error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});