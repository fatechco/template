import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const liveEventRepository = {
  async findEvents(filters: { status?: string; hostUserId?: string } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.LiveEventWhereInput = {
      ...(filters.status && { status: filters.status as any }),
      ...(filters.hostUserId && { hostUserId: filters.hostUserId }),
    };
    const [data, total] = await Promise.all([
      prisma.liveEvent.findMany({ where, skip, take, orderBy, include: { host: { select: { id: true, name: true, avatarUrl: true } } } }),
      prisma.liveEvent.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findEventById(id: string) {
    return prisma.liveEvent.findUnique({
      where: { id },
      include: { host: { select: { id: true, name: true, avatarUrl: true } }, registrations: true, messages: { orderBy: { createdAt: "asc" } }, polls: true },
    });
  },

  async createEvent(data: Prisma.LiveEventCreateInput) {
    return prisma.liveEvent.create({ data });
  },

  async updateEvent(id: string, data: Prisma.LiveEventUpdateInput) {
    return prisma.liveEvent.update({ where: { id }, data });
  },

  async createRegistration(data: Prisma.LiveEventRegistrationCreateInput) {
    return prisma.liveEventRegistration.create({ data });
  },

  async findRegistration(eventId: string, userId: string) {
    return prisma.liveEventRegistration.findUnique({ where: { eventId_userId: { eventId, userId } } });
  },

  async createMessage(data: Prisma.LiveEventMessageCreateInput) {
    return prisma.liveEventMessage.create({ data });
  },

  async createPoll(data: Prisma.LiveEventPollCreateInput) {
    return prisma.liveEventPoll.create({ data });
  },

  // Tour Sessions
  async findTourSessions(propertyId: string) {
    return prisma.liveTourSession.findMany({ where: { propertyId }, orderBy: { scheduledAt: "desc" } });
  },

  async createTourSession(data: Prisma.LiveTourSessionCreateInput) {
    return prisma.liveTourSession.create({ data });
  },
};
