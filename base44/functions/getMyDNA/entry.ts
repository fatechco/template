import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const targetUserId = body.userId || user.id;

    if (targetUserId !== user.id && user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 });
    }

    const [dnaList, insights, signals] = await Promise.all([
      base44.asServiceRole.entities.UserDNA.filter({ userId: targetUserId }),
      base44.asServiceRole.entities.DNAInsight.filter({ userId: targetUserId }),
      base44.asServiceRole.entities.DNASignal.filter({ userId: targetUserId })
    ]);

    const dna = dnaList[0] || null;
    const activeInsights = insights.filter(i => i.isShownToUser && (!i.validUntil || new Date(i.validUntil) > new Date()));

    // Recent signal counts for stats
    const recentSignals = signals.filter(s => {
      const age = Date.now() - new Date(s.timestamp).getTime();
      return age < 30 * 24 * 60 * 60 * 1000;
    });

    const signalBreakdown = recentSignals.reduce((acc, s) => {
      acc[s.signalType] = (acc[s.signalType] || 0) + 1;
      return acc;
    }, {});

    return Response.json({
      dna,
      insights: activeInsights.slice(0, 5),
      totalSignals: signals.length,
      recentSignals: recentSignals.length,
      signalBreakdown,
      hasProfile: !!dna
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});