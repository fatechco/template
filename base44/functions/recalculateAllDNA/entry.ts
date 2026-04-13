import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

// Daily scheduled function - recalculates DNA for all users with signals in last 90 days
Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);

    // Get all users with DNA signals in the last 90 days
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const signals = await base44.asServiceRole.entities.DNASignal.filter({}, '-timestamp', 5000);
    const recentSignals = signals.filter(s => s.timestamp >= ninetyDaysAgo);

    // Get unique user IDs with recent activity
    const uniqueUserIds = [...new Set(recentSignals.map(s => s.userId))];

    let processed = 0;
    let failed = 0;

    // Process in batches of 10
    for (let i = 0; i < uniqueUserIds.length; i += 10) {
      const batch = uniqueUserIds.slice(i, i + 10);
      await Promise.all(batch.map(async (userId) => {
        const existing = await base44.asServiceRole.entities.UserDNA.filter({ userId });
        const dna = existing[0];

        // Skip if recalculated in last 6 hours
        if (dna?.lastRecalculated) {
          const hoursSince = (Date.now() - new Date(dna.lastRecalculated).getTime()) / 3600000;
          if (hoursSince < 6) return;
        }

        try {
          await base44.asServiceRole.functions.invoke('recalculateDNA', { userId });
          processed++;
        } catch {
          failed++;
        }
      }));
    }

    return Response.json({
      success: true,
      usersFound: uniqueUserIds.length,
      processed,
      failed,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});