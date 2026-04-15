import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const auctionRepository = {
  async findById(id: string) {
    return prisma.propertyAuction.findUnique({
      where: { id },
      include: {
        property: { include: { category: true, city: true } },
        bids: { orderBy: { bidAmountEGP: "desc" }, take: 10, include: { bidder: { select: { id: true, name: true } } } },
        registrations: true,
      },
    });
  },

  async findByPropertyId(propertyId: string) {
    return prisma.propertyAuction.findUnique({ where: { propertyId } });
  },

  async findMany(filters: { status?: string } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.PropertyAuctionWhereInput = {
      ...(filters.status && { status: filters.status as any }),
    };
    const [data, total] = await Promise.all([
      prisma.propertyAuction.findMany({ where, skip, take, orderBy, include: { property: { include: { category: true, city: true } } } }),
      prisma.propertyAuction.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async create(data: Prisma.PropertyAuctionCreateInput) {
    return prisma.propertyAuction.create({ data });
  },

  async update(id: string, data: Prisma.PropertyAuctionUpdateInput) {
    return prisma.propertyAuction.update({ where: { id }, data });
  },

  // Bids
  async createBid(data: Prisma.AuctionBidCreateInput) {
    return prisma.auctionBid.create({ data });
  },

  async findHighestBid(auctionId: string) {
    return prisma.auctionBid.findFirst({ where: { auctionId }, orderBy: { bidAmountEGP: "desc" } });
  },

  async countBids(auctionId: string) {
    return prisma.auctionBid.count({ where: { auctionId } });
  },

  async countUniqueBidders(auctionId: string) {
    const result = await prisma.auctionBid.groupBy({ by: ["bidderUserId"], where: { auctionId } });
    return result.length;
  },

  // Events
  async createEvent(data: Prisma.AuctionEventCreateInput) {
    return prisma.auctionEvent.create({ data });
  },

  async findEvents(auctionId: string) {
    return prisma.auctionEvent.findMany({ where: { auctionId }, orderBy: { recordedAt: "desc" } });
  },

  // Registrations
  async createRegistration(data: Prisma.AuctionRegistrationCreateInput) {
    return prisma.auctionRegistration.create({ data });
  },

  async findRegistration(auctionId: string, bidderUserId: string) {
    return prisma.auctionRegistration.findUnique({ where: { auctionId_bidderUserId: { auctionId, bidderUserId } } });
  },

  async updateRegistration(id: string, data: Prisma.AuctionRegistrationUpdateInput) {
    return prisma.auctionRegistration.update({ where: { id }, data });
  },

  async findActiveRegistrations(auctionId: string) {
    return prisma.auctionRegistration.findMany({ where: { auctionId, registrationStatus: "active" } });
  },

  // Settings
  async getSettings() {
    return prisma.auctionSettings.findFirst();
  },

  async updateSettings(id: string, data: Prisma.AuctionSettingsUpdateInput) {
    return prisma.auctionSettings.update({ where: { id }, data });
  },

  // Watchlist
  async addToWatchlist(data: Prisma.AuctionWatchlistCreateInput) {
    return prisma.auctionWatchlist.create({ data });
  },

  async removeFromWatchlist(auctionId: string, userId: string) {
    return prisma.auctionWatchlist.delete({ where: { auctionId_userId: { auctionId, userId } } });
  },
};
