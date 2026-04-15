import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";

export const dnaRepository = {
  async findByUserId(userId: string) {
    return prisma.userDna.findUnique({ where: { userId } });
  },

  async upsert(userId: string, data: Prisma.UserDnaCreateInput) {
    return prisma.userDna.upsert({ where: { userId }, create: data, update: data });
  },

  async findSignals(userId: string, limit = 20) {
    return prisma.dnaSignal.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: limit });
  },

  async createSignal(data: Prisma.DnaSignalCreateInput) {
    return prisma.dnaSignal.create({ data });
  },

  async findInsights(userId: string) {
    return prisma.dnaInsight.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  },

  async createInsight(data: Prisma.DnaInsightCreateInput) {
    return prisma.dnaInsight.create({ data });
  },
};
