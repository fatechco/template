import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const surplusRepository = {
  async findItems(filters: { category?: string; cityId?: string; sellerId?: string; isActive?: boolean } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.SurplusItemWhereInput = {
      deletedAt: null,
      ...(filters.category && { category: filters.category }),
      ...(filters.cityId && { cityId: filters.cityId }),
      ...(filters.sellerId && { sellerId: filters.sellerId }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
    };
    const [data, total] = await Promise.all([
      prisma.surplusItem.findMany({ where, skip, take, orderBy, include: { seller: { select: { id: true, name: true, avatarUrl: true } } } }),
      prisma.surplusItem.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findItemById(id: string) {
    return prisma.surplusItem.findUnique({ where: { id }, include: { seller: { select: { id: true, name: true, avatarUrl: true, phone: true } } } });
  },

  async createItem(data: Prisma.SurplusItemCreateInput) {
    return prisma.surplusItem.create({ data });
  },

  async updateItem(id: string, data: Prisma.SurplusItemUpdateInput) {
    return prisma.surplusItem.update({ where: { id }, data });
  },

  async findSavedItems(userId: string) {
    return prisma.surplusSavedItem.findMany({ where: { userId }, include: { item: true }, orderBy: { createdAt: "desc" } });
  },

  async createSavedItem(data: Prisma.SurplusSavedItemCreateInput) {
    return prisma.surplusSavedItem.create({ data });
  },

  async createTransaction(data: Prisma.SurplusTransactionCreateInput) {
    return prisma.surplusTransaction.create({ data });
  },

  async createShipmentRequest(data: Prisma.SurplusShipmentRequestCreateInput) {
    return prisma.surplusShipmentRequest.create({ data });
  },

  async getSettings() {
    return prisma.surplusSettings.findFirst();
  },
};
