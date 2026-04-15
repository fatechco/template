import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";

export const scoringRepository = {
  async findScoreByUserId(userId: string) {
    return prisma.kemedarScore.findUnique({ where: { userId } });
  },

  async upsertScore(userId: string, data: Prisma.KemedarScoreCreateInput) {
    return prisma.kemedarScore.upsert({ where: { userId }, create: data, update: data });
  },

  async createScoreEvent(data: Prisma.ScoreEventCreateInput) {
    return prisma.scoreEvent.create({ data });
  },

  async findScoreEvents(userId: string, limit = 20) {
    return prisma.scoreEvent.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: limit });
  },

  async findBadges(userId: string) {
    return prisma.scoreBadge.findMany({ where: { userId }, orderBy: { awardedAt: "desc" } });
  },

  async createBadge(data: Prisma.ScoreBadgeCreateInput) {
    return prisma.scoreBadge.create({ data });
  },

  async createShareRequest(data: Prisma.ScoreShareRequestCreateInput) {
    return prisma.scoreShareRequest.create({ data });
  },

  async findShareRequest(token: string) {
    return prisma.scoreShareRequest.findUnique({ where: { token } });
  },

  // Life Score
  async findLifeScoreDataPoints(locationId: string) {
    return prisma.lifeScoreDataPoint.findMany({ where: { locationId }, orderBy: { createdAt: "desc" } });
  },

  async findLifeScoreReviews(locationId: string) {
    return prisma.lifeScoreReview.findMany({ where: { locationId }, orderBy: { createdAt: "desc" } });
  },

  async upsertNeighborhoodScore(data: Prisma.NeighborhoodScoreCreateInput) {
    return prisma.neighborhoodScore.upsert({
      where: { locationId: data.locationId as string },
      create: data,
      update: data,
    });
  },
};
