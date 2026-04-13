import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json().catch(() => ({}));
    const userId = body.userId || user.id;

    // Get or create score
    let scores = await base44.asServiceRole.entities.KemedarScore.filter({ userId });
    let score = scores[0];

    if (!score) {
      // Initialize new score
      const token = Math.random().toString(36).substring(2, 14).toUpperCase();
      score = await base44.asServiceRole.entities.KemedarScore.create({
        userId,
        overallScore: 0,
        overallGrade: "Starter",
        scoreTrend: "stable",
        shareableScoreToken: token,
        lastCalculated: new Date().toISOString(),
      });
    }

    // Get score events (last 50)
    const events = await base44.asServiceRole.entities.ScoreEvent.filter({ userId });
    const recentEvents = events
      .sort((a, b) => new Date(b.created_date) - new Date(a.created_date))
      .slice(0, 50);

    // Get earned badges
    const allBadges = await base44.asServiceRole.entities.ScoreBadge.filter({ isActive: true });

    // Compute percentile estimate
    const percentile = score.overallScore >= 850 ? 5 :
      score.overallScore >= 700 ? 20 :
      score.overallScore >= 550 ? 40 :
      score.overallScore >= 400 ? 65 :
      score.overallScore >= 200 ? 85 : 100;

    const pointsToNextGrade = score.overallGrade === "Platinum" ? 0 :
      score.overallGrade === "Gold" ? 850 - score.overallScore :
      score.overallGrade === "Silver" ? 700 - score.overallScore :
      score.overallGrade === "Bronze" ? 550 - score.overallScore :
      score.overallGrade === "Starter" ? 400 - score.overallScore :
      200 - score.overallScore;

    return Response.json({
      success: true,
      score,
      recentEvents,
      allBadges,
      percentile,
      pointsToNextGrade: Math.max(0, pointsToNextGrade),
      nextGrade: score.overallGrade === "Platinum" ? null :
        score.overallGrade === "Gold" ? "Platinum" :
        score.overallGrade === "Silver" ? "Gold" :
        score.overallGrade === "Bronze" ? "Silver" :
        score.overallGrade === "Starter" ? "Bronze" : "Starter",
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});