import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { taskId, newStatus, userId } = await req.json();

    if (!taskId || !newStatus) {
      return Response.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const validStatuses = ['Actioned', 'Completed', 'Skipped'];
    if (!validStatuses.includes(newStatus)) {
      return Response.json({ error: 'Invalid status' }, { status: 400 });
    }

    // Get the task
    const tasks = await base44.asServiceRole.entities.ConciergeTask.filter({ id: taskId });
    if (!tasks || tasks.length === 0) {
      return Response.json({ error: 'Task not found' }, { status: 404 });
    }

    const task = tasks[0];
    const now = new Date().toISOString();

    // Update task with new status
    const updateData = { status: newStatus };
    
    if (newStatus === 'Actioned') {
      updateData.ctaClickedAt = now;
      updateData.ctaClickCount = (task.ctaClickCount || 0) + 1;
    } else if (newStatus === 'Completed') {
      updateData.completedAt = now;
    } else if (newStatus === 'Skipped') {
      updateData.skippedAt = now;
    }

    await base44.asServiceRole.entities.ConciergeTask.update(taskId, updateData);

    // Get journey and recalculate progress
    const journeys = await base44.asServiceRole.entities.ConciergeJourney.filter({ id: task.journeyId });
    if (!journeys || journeys.length === 0) {
      return Response.json({ error: 'Journey not found' }, { status: 404 });
    }

    const journey = journeys[0];

    // Get all tasks in this journey
    const allTasks = await base44.asServiceRole.entities.ConciergeTask.filter({ journeyId: journey.id });

    // Recalculate counts
    let completedTasks = 0;
    let actionedTasks = 0;
    let skippedTasks = 0;

    if (allTasks && allTasks.length > 0) {
      for (const t of allTasks) {
        if (t.status === 'Completed') completedTasks++;
        else if (t.status === 'Actioned') actionedTasks++;
        else if (t.status === 'Skipped') skippedTasks++;
      }
    }

    const completionPercentage = journey.totalTasks > 0 
      ? Math.round((completedTasks + actionedTasks) / journey.totalTasks * 100)
      : 0;

    let journeyStatus = journey.status;
    if (completionPercentage >= 100) {
      journeyStatus = 'Completed';
    }

    // Update journey
    const updatedJourney = await base44.asServiceRole.entities.ConciergeJourney.update(journey.id, {
      completedTasks,
      actionedTasks,
      skippedTasks,
      completionPercentage,
      status: journeyStatus,
      lastActivityAt: now
    });

    return Response.json({
      task: { id: taskId, status: newStatus },
      journey: {
        completionPercentage,
        status: journeyStatus,
        completedTasks,
        actionedTasks,
        skippedTasks
      }
    }, { status: 200 });
  } catch (error) {
    console.error('updateTaskStatus error:', error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
});