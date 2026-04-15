import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const swapRepository = {
  async findIntents(filters: { userId?: string; status?: string } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.SwapIntentWhereInput = {
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.status && { status: filters.status as any }),
    };
    const [data, total] = await Promise.all([
      prisma.swapIntent.findMany({ where, skip, take, orderBy, include: { property: { select: { id: true, title: true, titleAr: true, featuredImage: true, cityId: true } }, user: { select: { id: true, name: true, avatarUrl: true } } } }),
      prisma.swapIntent.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findIntentById(id: string) {
    return prisma.swapIntent.findUnique({
      where: { id },
      include: { property: true, user: { select: { id: true, name: true, avatarUrl: true } }, matches: true },
    });
  },

  async createIntent(data: Prisma.SwapIntentCreateInput) {
    return prisma.swapIntent.create({ data });
  },

  async updateIntent(id: string, data: Prisma.SwapIntentUpdateInput) {
    return prisma.swapIntent.update({ where: { id }, data });
  },

  async findMatches(intentId: string) {
    return prisma.swapMatch.findMany({ where: { OR: [{ intentAId: intentId }, { intentBId: intentId }] }, orderBy: { createdAt: "desc" } });
  },

  async createMatch(data: Prisma.SwapMatchCreateInput) {
    return prisma.swapMatch.create({ data });
  },

  async updateMatch(id: string, data: Prisma.SwapMatchUpdateInput) {
    return prisma.swapMatch.update({ where: { id }, data });
  },

  async createGapOffer(data: Prisma.SwapGapOfferCreateInput) {
    return prisma.swapGapOffer.create({ data });
  },

  async createMessage(data: Prisma.SwapMessageCreateInput) {
    return prisma.swapMessage.create({ data });
  },

  async getSettings() {
    return prisma.swapSettings.findFirst();
  },
};
