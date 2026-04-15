import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const kemeworkRepository = {
  async findServiceOrders(filters: { userId?: string; status?: string; serviceType?: string } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.ServiceOrderWhereInput = {
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.status && { status: filters.status as any }),
      ...(filters.serviceType && { serviceType: filters.serviceType as any }),
    };
    const [data, total] = await Promise.all([
      prisma.serviceOrder.findMany({ where, skip, take, orderBy, include: { user: { select: { id: true, name: true, avatarUrl: true } } } }),
      prisma.serviceOrder.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findServiceOrderById(id: string) {
    return prisma.serviceOrder.findUnique({ where: { id }, include: { user: { select: { id: true, name: true, avatarUrl: true, phone: true } }, activities: { orderBy: { createdAt: "desc" } } } });
  },

  async createServiceOrder(data: Prisma.ServiceOrderCreateInput) {
    return prisma.serviceOrder.create({ data });
  },

  async updateServiceOrder(id: string, data: Prisma.ServiceOrderUpdateInput) {
    return prisma.serviceOrder.update({ where: { id }, data });
  },

  async createServiceOrderActivity(data: Prisma.ServiceOrderActivityCreateInput) {
    return prisma.serviceOrderActivity.create({ data });
  },

  // Snap Sessions
  async findSnapSessions(userId: string) {
    return prisma.snapSession.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  },

  async createSnapSession(data: Prisma.SnapSessionCreateInput) {
    return prisma.snapSession.create({ data });
  },

  async updateSnapSession(id: string, data: Prisma.SnapSessionUpdateInput) {
    return prisma.snapSession.update({ where: { id }, data });
  },
};
