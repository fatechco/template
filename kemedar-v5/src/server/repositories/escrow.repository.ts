import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const escrowRepository = {
  async findById(id: string) {
    return prisma.escrowDeal.findUnique({
      where: { id },
      include: { buyer: { select: { id: true, name: true, email: true } }, seller: { select: { id: true, name: true, email: true } }, property: true, milestones: { orderBy: { milestoneOrder: "asc" } }, transactions: { orderBy: { createdAt: "desc" } }, disputes: true, documents: true },
    });
  },

  async findByDealNumber(dealNumber: string) {
    return prisma.escrowDeal.findUnique({ where: { dealNumber } });
  },

  async findMany(filters: { buyerId?: string; sellerId?: string; status?: string; propertyId?: string } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.EscrowDealWhereInput = {
      ...(filters.buyerId && { buyerId: filters.buyerId }),
      ...(filters.sellerId && { sellerId: filters.sellerId }),
      ...(filters.status && { status: filters.status as any }),
      ...(filters.propertyId && { propertyId: filters.propertyId }),
    };
    const [data, total] = await Promise.all([
      prisma.escrowDeal.findMany({ where, skip, take, orderBy, include: { property: { select: { id: true, title: true, titleAr: true, featuredImage: true } }, buyer: { select: { id: true, name: true } }, seller: { select: { id: true, name: true } } } }),
      prisma.escrowDeal.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async create(data: Prisma.EscrowDealCreateInput) {
    return prisma.escrowDeal.create({ data });
  },

  async update(id: string, data: Prisma.EscrowDealUpdateInput) {
    return prisma.escrowDeal.update({ where: { id }, data });
  },

  // Milestones
  async createMilestone(data: Prisma.EscrowMilestoneCreateInput) {
    return prisma.escrowMilestone.create({ data });
  },

  async updateMilestone(id: string, data: Prisma.EscrowMilestoneUpdateInput) {
    return prisma.escrowMilestone.update({ where: { id }, data });
  },

  async findMilestones(dealId: string) {
    return prisma.escrowMilestone.findMany({ where: { dealId }, orderBy: { milestoneOrder: "asc" } });
  },

  // Transactions
  async createTransaction(data: Prisma.EscrowTransactionCreateInput) {
    return prisma.escrowTransaction.create({ data });
  },

  async findTransactions(dealId: string) {
    return prisma.escrowTransaction.findMany({ where: { dealId }, orderBy: { createdAt: "desc" } });
  },

  // Disputes
  async createDispute(data: Prisma.EscrowDisputeCreateInput) {
    return prisma.escrowDispute.create({ data });
  },

  async updateDispute(id: string, data: Prisma.EscrowDisputeUpdateInput) {
    return prisma.escrowDispute.update({ where: { id }, data });
  },

  // Documents
  async createDocument(data: Prisma.EscrowDocumentCreateInput) {
    return prisma.escrowDocument.create({ data });
  },
};
