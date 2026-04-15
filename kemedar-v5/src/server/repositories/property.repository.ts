import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams, type PaginatedResult } from "./base.repository";

export interface PropertyFilters {
  categoryId?: string;
  purposeId?: string;
  cityId?: string;
  districtId?: string;
  minPrice?: number;
  maxPrice?: number;
  isFeatured?: boolean;
  isVerified?: boolean;
  isActive?: boolean;
  isImported?: boolean;
  importStatus?: string;
  userId?: string;
  search?: string;
  tags?: string[];
  isAuction?: boolean;
  isFracOffering?: boolean;
  isOpenToSwap?: boolean;
}

export const propertyRepository = {
  async findMany(filters: PropertyFilters = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);

    const where: Prisma.PropertyWhereInput = {
      deletedAt: null,
      ...(filters.categoryId && { categoryId: filters.categoryId }),
      ...(filters.purposeId && { purposeId: filters.purposeId }),
      ...(filters.cityId && { cityId: filters.cityId }),
      ...(filters.districtId && { districtId: filters.districtId }),
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.isFeatured !== undefined && { isFeatured: filters.isFeatured }),
      ...(filters.isVerified !== undefined && { isVerified: filters.isVerified }),
      ...(filters.isImported !== undefined && { isImported: filters.isImported }),
      ...(filters.importStatus && { importStatus: filters.importStatus as any }),
      ...(filters.isAuction !== undefined && { isAuction: filters.isAuction }),
      ...(filters.isFracOffering !== undefined && { isFracOffering: filters.isFracOffering }),
      ...(filters.isOpenToSwap !== undefined && { isOpenToSwap: filters.isOpenToSwap }),
      ...(filters.minPrice || filters.maxPrice
        ? {
            priceAmount: {
              ...(filters.minPrice && { gte: filters.minPrice }),
              ...(filters.maxPrice && { lte: filters.maxPrice }),
            },
          }
        : {}),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: "insensitive" as const } },
          { titleAr: { contains: filters.search, mode: "insensitive" as const } },
          { description: { contains: filters.search, mode: "insensitive" as const } },
          { address: { contains: filters.search, mode: "insensitive" as const } },
        ],
      }),
      ...(filters.tags?.length && { tags: { hasSome: filters.tags } }),
    };

    const [data, total] = await Promise.all([
      prisma.property.findMany({
        where,
        skip,
        take,
        orderBy,
        include: {
          category: true,
          purpose: true,
          city: true,
          user: { select: { id: true, name: true, nameAr: true, avatarUrl: true, role: true } },
        },
      }),
      prisma.property.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) } as PaginatedResult<typeof data[0]>;
  },

  async findById(id: string) {
    return prisma.property.findUnique({
      where: { id },
      include: {
        category: true,
        purpose: true,
        status: true,
        furnished: true,
        city: true,
        user: { select: { id: true, name: true, nameAr: true, phone: true, avatarUrl: true, role: true } },
        distances: true,
        valuations: { orderBy: { createdAt: "desc" }, take: 1 },
        auction: true,
        fracProperty: true,
        swapIntent: true,
        analyzedImages: true,
      },
    });
  },

  async create(data: Prisma.PropertyCreateInput) {
    return prisma.property.create({ data });
  },

  async update(id: string, data: Prisma.PropertyUpdateInput) {
    return prisma.property.update({ where: { id }, data });
  },

  async softDelete(id: string) {
    return prisma.property.update({ where: { id }, data: { deletedAt: new Date(), isActive: false } });
  },

  async incrementViewCount(id: string) {
    return prisma.property.update({ where: { id }, data: { viewCount: { increment: 1 } } });
  },

  async countByStatus() {
    const results = await prisma.property.groupBy({
      by: ["importStatus"],
      _count: true,
      where: { deletedAt: null },
    });
    return results;
  },
};
