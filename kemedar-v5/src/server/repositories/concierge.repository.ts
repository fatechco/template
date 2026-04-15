import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const conciergeRepository = {
  async findJourneys(filters: { userId?: string } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.ConciergeJourneyWhereInput = {
      ...(filters.userId && { userId: filters.userId }),
    };
    const [data, total] = await Promise.all([
      prisma.conciergeJourney.findMany({ where, skip, take, orderBy, include: { user: { select: { id: true, name: true, avatarUrl: true } } } }),
      prisma.conciergeJourney.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findJourneyById(id: string) {
    return prisma.conciergeJourney.findUnique({ where: { id }, include: { user: { select: { id: true, name: true, avatarUrl: true } }, tasks: { orderBy: { order: "asc" } } } });
  },

  async createJourney(data: Prisma.ConciergeJourneyCreateInput) {
    return prisma.conciergeJourney.create({ data });
  },

  async updateJourney(id: string, data: Prisma.ConciergeJourneyUpdateInput) {
    return prisma.conciergeJourney.update({ where: { id }, data });
  },

  async findTasks(journeyId: string) {
    return prisma.conciergeTask.findMany({ where: { journeyId }, orderBy: { order: "asc" } });
  },

  async createTask(data: Prisma.ConciergeTaskCreateInput) {
    return prisma.conciergeTask.create({ data });
  },

  async updateTask(id: string, data: Prisma.ConciergeTaskUpdateInput) {
    return prisma.conciergeTask.update({ where: { id }, data });
  },

  async findTemplates() {
    return prisma.conciergeTemplate.findMany({ where: { isActive: true }, orderBy: { name: "asc" } });
  },

  async findTaskTemplates() {
    return prisma.conciergeTaskTemplate.findMany({ orderBy: { order: "asc" } });
  },
};
