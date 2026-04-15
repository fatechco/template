import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";

export const coachingRepository = {
  async findProfileByUserId(userId: string) {
    return prisma.coachingProfile.findUnique({ where: { userId } });
  },

  async upsertProfile(userId: string, data: Prisma.CoachingProfileCreateInput) {
    return prisma.coachingProfile.upsert({ where: { userId }, create: data, update: data });
  },

  async findJourneys(filters: { userId?: string; status?: string } = {}) {
    const where: Prisma.CoachingJourneyWhereInput = {
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.status && { status: filters.status as any }),
    };
    return prisma.coachingJourney.findMany({ where, orderBy: { createdAt: "desc" } });
  },

  async findJourneyById(id: string) {
    return prisma.coachingJourney.findUnique({ where: { id } });
  },

  async findContent(filters: { type?: string; journeyId?: string } = {}) {
    const where: Prisma.CoachingContentWhereInput = {
      ...(filters.type && { type: filters.type as any }),
      ...(filters.journeyId && { journeyId: filters.journeyId }),
    };
    return prisma.coachingContent.findMany({ where, orderBy: { order: "asc" } });
  },

  async createMessage(data: Prisma.CoachingMessageCreateInput) {
    return prisma.coachingMessage.create({ data });
  },

  async findMessages(userId: string, limit = 50) {
    return prisma.coachingMessage.findMany({ where: { userId }, orderBy: { createdAt: "asc" }, take: limit });
  },

  async createAchievement(data: Prisma.CoachingAchievementCreateInput) {
    return prisma.coachingAchievement.create({ data });
  },

  async findAchievements(userId: string) {
    return prisma.coachingAchievement.findMany({ where: { userId }, orderBy: { awardedAt: "desc" } });
  },

  async createNudge(data: Prisma.CoachingNudgeCreateInput) {
    return prisma.coachingNudge.create({ data });
  },
};
