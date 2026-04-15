import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const marketplaceRepository = {
  async findProducts(filters: { query?: string; category?: string; minPrice?: number; maxPrice?: number; cityId?: string } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.MarketplaceProductWhereInput = {
      isActive: true,
      deletedAt: null,
      ...(filters.category && { category: filters.category }),
      ...(filters.cityId && { cityId: filters.cityId }),
      ...(filters.minPrice || filters.maxPrice
        ? { price: { ...(filters.minPrice && { gte: filters.minPrice }), ...(filters.maxPrice && { lte: filters.maxPrice }) } }
        : {}),
      ...(filters.query && {
        OR: [
          { title: { contains: filters.query, mode: "insensitive" as const } },
          { description: { contains: filters.query, mode: "insensitive" as const } },
        ],
      }),
    };
    const [data, total] = await Promise.all([
      prisma.marketplaceProduct.findMany({ where, skip, take, orderBy, include: { seller: { select: { id: true, name: true, avatarUrl: true } } } }),
      prisma.marketplaceProduct.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findProductById(id: string) {
    return prisma.marketplaceProduct.findUnique({ where: { id }, include: { seller: { select: { id: true, name: true, avatarUrl: true, phone: true } } } });
  },

  async createProduct(data: Prisma.MarketplaceProductCreateInput) {
    return prisma.marketplaceProduct.create({ data });
  },

  async updateProduct(id: string, data: Prisma.MarketplaceProductUpdateInput) {
    return prisma.marketplaceProduct.update({ where: { id }, data });
  },

  // Flash Deals
  async findFlashDeals(filters: { isActive?: boolean } = {}) {
    const where: Prisma.FlashDealWhereInput = {
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
    };
    return prisma.flashDeal.findMany({ where, orderBy: { createdAt: "desc" } });
  },

  async findFlashDealById(id: string) {
    return prisma.flashDeal.findUnique({ where: { id }, include: { orders: true } });
  },

  async createFlashDeal(data: Prisma.FlashDealCreateInput) {
    return prisma.flashDeal.create({ data });
  },

  async updateFlashDeal(id: string, data: Prisma.FlashDealUpdateInput) {
    return prisma.flashDeal.update({ where: { id }, data });
  },

  async createFlashOrder(data: Prisma.FlashOrderCreateInput) {
    return prisma.flashOrder.create({ data });
  },

  // Group Buy
  async findGroupBuySessions(filters: { status?: string } = {}) {
    const where: Prisma.GroupBuySessionWhereInput = {
      ...(filters.status && { status: filters.status as any }),
    };
    return prisma.groupBuySession.findMany({ where, orderBy: { createdAt: "desc" } });
  },

  async createGroupBuySession(data: Prisma.GroupBuySessionCreateInput) {
    return prisma.groupBuySession.create({ data });
  },
};
