import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const negotiationRepository = {
  async findSessions(filters: { buyerUserId?: string; sellerUserId?: string; status?: string } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.NegotiationSessionWhereInput = {
      ...(filters.buyerUserId && { buyerUserId: filters.buyerUserId }),
      ...(filters.sellerUserId && { sellerUserId: filters.sellerUserId }),
      ...(filters.status && { status: filters.status as any }),
    };
    const [data, total] = await Promise.all([
      prisma.negotiationSession.findMany({ where, skip, take, orderBy, include: { buyer: { select: { id: true, name: true, avatarUrl: true } }, seller: { select: { id: true, name: true, avatarUrl: true } }, property: { select: { id: true, title: true, featuredImage: true } } } }),
      prisma.negotiationSession.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findSessionById(id: string) {
    return prisma.negotiationSession.findUnique({
      where: { id },
      include: { buyer: { select: { id: true, name: true, avatarUrl: true } }, seller: { select: { id: true, name: true, avatarUrl: true } }, property: true, offers: { orderBy: { createdAt: "desc" } }, messages: { orderBy: { createdAt: "asc" } }, analytics: true },
    });
  },

  async createSession(data: Prisma.NegotiationSessionCreateInput) {
    return prisma.negotiationSession.create({ data });
  },

  async updateSession(id: string, data: Prisma.NegotiationSessionUpdateInput) {
    return prisma.negotiationSession.update({ where: { id }, data });
  },

  async createOffer(data: Prisma.NegotiationOfferCreateInput) {
    return prisma.negotiationOffer.create({ data });
  },

  async updateOffer(id: string, data: Prisma.NegotiationOfferUpdateInput) {
    return prisma.negotiationOffer.update({ where: { id }, data });
  },

  async findMessages(sessionId: string) {
    return prisma.negotiationMessage.findMany({ where: { sessionId }, orderBy: { createdAt: "asc" } });
  },

  async createMessage(data: Prisma.NegotiationMessageCreateInput) {
    return prisma.negotiationMessage.create({ data });
  },

  async createAnalytics(data: Prisma.NegotiationAnalyticsCreateInput) {
    return prisma.negotiationAnalytics.create({ data });
  },

  async updateAnalytics(sessionId: string, data: Prisma.NegotiationAnalyticsUpdateInput) {
    return prisma.negotiationAnalytics.update({ where: { sessionId }, data });
  },
};
