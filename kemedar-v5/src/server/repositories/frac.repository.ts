import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const fracRepository = {
  async findById(id: string) {
    return prisma.fracProperty.findUnique({
      where: { id },
      include: { property: { include: { category: true, city: true } }, tokens: true, transactions: { orderBy: { createdAt: "desc" }, take: 20 }, yieldDistributions: { orderBy: { createdAt: "desc" } } },
    });
  },

  async findByPropertyId(propertyId: string) {
    return prisma.fracProperty.findUnique({ where: { propertyId } });
  },

  async findMany(filters: { status?: string; isFeatured?: boolean } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.FracPropertyWhereInput = {
      ...(filters.status && { status: filters.status as any }),
      ...(filters.isFeatured !== undefined && { isFeatured: filters.isFeatured }),
    };
    const [data, total] = await Promise.all([
      prisma.fracProperty.findMany({ where, skip, take, orderBy, include: { property: { include: { category: true, city: true } } } }),
      prisma.fracProperty.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async create(data: Prisma.FracPropertyCreateInput) {
    return prisma.fracProperty.create({ data });
  },

  async update(id: string, data: Prisma.FracPropertyUpdateInput) {
    return prisma.fracProperty.update({ where: { id }, data });
  },

  // Tokens
  async findTokensByHolder(holderUserId: string) {
    return prisma.fracToken.findMany({ where: { holderUserId, isActive: true }, include: { fracProperty: { include: { property: { select: { id: true, title: true, featuredImage: true } } } } } });
  },

  async findToken(fracPropertyId: string, holderUserId: string) {
    return prisma.fracToken.findUnique({ where: { fracPropertyId_holderUserId: { fracPropertyId, holderUserId } } });
  },

  async upsertToken(fracPropertyId: string, holderUserId: string, data: Partial<Prisma.FracTokenCreateInput>) {
    return prisma.fracToken.upsert({
      where: { fracPropertyId_holderUserId: { fracPropertyId, holderUserId } },
      update: data as Prisma.FracTokenUpdateInput,
      create: { fracPropertyId, holderUserId, propertyId: (data as any).propertyId, tokensHeld: (data as any).tokensHeld || 0, ...data } as any,
    });
  },

  // Transactions
  async createTransaction(data: Prisma.FracTransactionCreateInput) {
    return prisma.fracTransaction.create({ data });
  },

  async findTransactions(fracPropertyId: string) {
    return prisma.fracTransaction.findMany({ where: { fracPropertyId }, orderBy: { createdAt: "desc" } });
  },

  // Yield
  async createYieldDistribution(data: Prisma.FracYieldDistributionCreateInput) {
    return prisma.fracYieldDistribution.create({ data });
  },

  // KYC
  async findKYC(userId: string) {
    return prisma.fracKYC.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } });
  },

  async createKYC(data: Prisma.FracKYCCreateInput) {
    return prisma.fracKYC.create({ data });
  },

  async updateKYC(id: string, data: Prisma.FracKYCUpdateInput) {
    return prisma.fracKYC.update({ where: { id }, data });
  },

  // Settings
  async getSettings() {
    return prisma.fracSettings.findFirst();
  },
};
