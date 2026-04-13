import { createClientFromRequest } from 'npm:@base44/sdk@0.8.23';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const body = await req.json();
    const { shareToken } = body;

    if (!shareToken) return Response.json({ error: 'shareToken required' }, { status: 400 });

    // Find share request
    const shareRequests = await base44.asServiceRole.entities.ScoreShareRequest.filter({ shareToken });
    const shareRequest = shareRequests[0];

    if (!shareRequest) return Response.json({ error: 'Share link not found' }, { status: 404 });
    if (shareRequest.isRevoked) return Response.json({ error: 'This share link has been revoked' }, { status: 410 });

    const now = new Date();
    if (new Date(shareRequest.expiresAt) < now) {
      return Response.json({ error: 'This share link has expired' }, { status: 410 });
    }

    // Get the score
    const scores = await base44.asServiceRole.entities.KemedarScore.filter({ userId: shareRequest.userId });
    const score = scores[0];

    if (!score) return Response.json({ error: 'Score not found' }, { status: 404 });

    // Get user info (only safe public fields)
    const users = await base44.asServiceRole.entities.User.filter({ id: shareRequest.userId });
    const user = users[0];

    // Increment view count
    await base44.asServiceRole.entities.ScoreShareRequest.update(shareRequest.id, {
      viewCount: (shareRequest.viewCount || 0) + 1,
      lastViewedAt: now.toISOString(),
    });

    // Return only dimensions the user chose to share
    const sharedDimensions = shareRequest.dimensionsShared || ["overallScore", "overallGrade"];
    const filteredScore = { overallScore: score.overallScore, overallGrade: score.overallGrade };
    sharedDimensions.forEach(dim => { filteredScore[dim] = score[dim]; });

    return Response.json({
      success: true,
      score: filteredScore,
      shareRequest: {
        gradeAtTimeOfShare: shareRequest.gradeAtTimeOfShare,
        scoreAtTimeOfShare: shareRequest.scoreAtTimeOfShare,
        dimensionsShared: sharedDimensions,
        expiresAt: shareRequest.expiresAt,
      },
      user: {
        firstName: user?.full_name?.split(' ')[0] || 'User',
        memberSince: user?.created_date ? new Date(user.created_date).getFullYear() : 2024,
      },
      earnedBadges: score.earnedBadges || [],
    });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
});