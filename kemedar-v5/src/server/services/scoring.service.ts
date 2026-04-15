import prisma from "@/server/lib/prisma"; // Direct prisma: complex queries not in repository
import { scoringRepository } from "@/server/repositories/scoring.repository";
import { invokeLLM } from "@/server/lib/ai-client";

const SCORE_EVENTS: Record<string, { points: number; dimension: string; category: "positive" | "negative" }> = {
  property_listed: { points: 20, dimension: "platformBehavior", category: "positive" },
  property_verified: { points: 40, dimension: "verificationLevel", category: "positive" },
  profile_completed: { points: 15, dimension: "platformBehavior", category: "positive" },
  deal_completed: { points: 60, dimension: "financialReadiness", category: "positive" },
  payment_on_time: { points: 30, dimension: "financialReadiness", category: "positive" },
  positive_review: { points: 25, dimension: "reputation", category: "positive" },
  referral_made: { points: 15, dimension: "communityEngagement", category: "positive" },
  community_post: { points: 5, dimension: "communityEngagement", category: "positive" },
  dispute_raised: { points: -30, dimension: "reputation", category: "negative" },
  payment_late: { points: -40, dimension: "financialReadiness", category: "negative" },
  listing_removed: { points: -10, dimension: "platformBehavior", category: "negative" },
  fraud_flagged: { points: -150, dimension: "reputation", category: "negative" },
  deposit_forfeited: { points: -80, dimension: "financialReadiness", category: "negative" },
  content_flagged: { points: -20, dimension: "communityEngagement", category: "negative" },
};

const DIMENSION_CAPS: Record<string, number> = {
  financialReadiness: 200,
  platformBehavior: 150,
  verificationLevel: 100,
  reputation: 200,
  communityEngagement: 100,
  investmentActivity: 150,
  responseRate: 50,
  profileCompleteness: 50,
};

export const scoringService = {
  async addScoreEvent(userId: string, eventType: string, metaData?: Record<string, any>) {
    const eventConfig = SCORE_EVENTS[eventType];
    if (!eventConfig) throw new Error(`Unknown score event type: ${eventType}`);

    const event = await scoringRepository.createScoreEvent({
      user: { connect: { id: userId } },
      eventType,
      category: eventConfig.category,
      points: eventConfig.points,
      dimension: eventConfig.dimension,
      description: `${eventType.replace(/_/g, " ")}`,
      metaData: metaData as any,
    } as any);

    // Recalculate score
    await this.calculateKemedarScore(userId);

    return event;
  },

  async calculateKemedarScore(userId: string) {
    // Direct prisma: complex query not in repository (findMany all events without limit for calculation)
    const events = await prisma.scoreEvent.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    const now = Date.now();
    const dimensions: Record<string, number> = {};

    for (const event of events) {
      const ageMs = now - event.createdAt.getTime();
      const ageDays = ageMs / (1000 * 60 * 60 * 24);

      let effectivePoints = event.points;

      // Decay negative events
      if (event.category === "negative") {
        if (ageDays > 365) effectivePoints = 0; // Fully decayed
        else if (ageDays > 180) effectivePoints *= 0.5; // Half-decayed
      }

      const dim = event.dimension || "platformBehavior";
      dimensions[dim] = (dimensions[dim] || 0) + effectivePoints;
    }

    // Apply caps
    for (const [dim, cap] of Object.entries(DIMENSION_CAPS)) {
      if (dimensions[dim]) {
        dimensions[dim] = Math.min(Math.max(dimensions[dim], -cap), cap);
      }
    }

    // Calculate overall score (0-1000)
    const totalPossible = Object.values(DIMENSION_CAPS).reduce((a, b) => a + b, 0);
    const totalActual = Object.values(dimensions).reduce((a, b) => a + Math.max(0, b), 0);
    const overallScore = Math.round((totalActual / totalPossible) * 1000);

    // Determine grade
    let grade: string;
    if (overallScore >= 800) grade = "A+";
    else if (overallScore >= 700) grade = "A";
    else if (overallScore >= 600) grade = "B+";
    else if (overallScore >= 500) grade = "B";
    else if (overallScore >= 400) grade = "C+";
    else if (overallScore >= 300) grade = "C";
    else grade = "D";

    await scoringRepository.upsertScore(userId, {
      user: { connect: { id: userId } },
      overallScore,
      grade,
      dimensions: dimensions as any,
      lastCalculatedAt: new Date(),
    } as any);

    return { overallScore, grade, dimensions };
  },

  async getMyScore(userId: string) {
    let score = await scoringRepository.findScoreByUserId(userId);
    if (!score) {
      const calculated = await this.calculateKemedarScore(userId);
      score = await scoringRepository.findScoreByUserId(userId);
    }
    return score;
  },

  async calculateLifeScore(locationId: string) {
    const dataPoints = await scoringRepository.findLifeScoreDataPoints(locationId);
    const reviews = await scoringRepository.findLifeScoreReviews(locationId);

    const dimensions = ["walkability", "noise", "safety", "education", "healthcare", "connectivity", "greenSpace", "convenience"];
    const scores: Record<string, number> = {};

    for (const dim of dimensions) {
      const points = dataPoints.filter((p) => p.dimension === dim);
      const reviewScores = reviews.filter((r) => r.dimension === dim).map((r) => r.rating);

      const dataAvg = points.length > 0 ? points.reduce((s, p) => s + p.value, 0) / points.length : 5;
      const reviewAvg = reviewScores.length > 0 ? reviewScores.reduce((s, v) => s + v, 0) / reviewScores.length : 5;

      scores[dim] = (dataAvg * 0.7 + reviewAvg * 0.3);
    }

    const overall = Object.values(scores).reduce((s, v) => s + v, 0) / dimensions.length;

    return { overall, scores, dataPointCount: dataPoints.length, reviewCount: reviews.length };
  },

  async generateLifeScoreNarrative(locationId: string, scores: Record<string, number>) {
    const result = await invokeLLM(
      `Generate a short, engaging narrative about living in this neighborhood based on these life quality scores (1-10):\n` +
        JSON.stringify(scores, null, 2) + `\n\nWrite 2-3 paragraphs highlighting strengths and areas for improvement.`,
      { maxTokens: 500 }
    );
    return result.content;
  },
};
