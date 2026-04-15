import prisma from "@/server/lib/prisma"; // Direct prisma: complex queries not in repository
import { marketplaceRepository } from "@/server/repositories/marketplace.repository";
import { invokeLLMWithSchema } from "@/server/lib/ai-client";

export const marketplaceService = {
  async searchProducts(query: string, filters: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    cityId?: string;
    page?: number;
    pageSize?: number;
  } = {}) {
    const page = filters.page || 1;
    const pageSize = Math.min(filters.pageSize || 20, 100);
    // Direct prisma: complex query not in repository (marketplaceItem model with custom search logic differs from repo's marketplaceProduct)
    const where: any = {
      isActive: true,
      deletedAt: null,
      ...(filters.category && { category: filters.category }),
      ...(filters.cityId && { cityId: filters.cityId }),
      ...(filters.minPrice || filters.maxPrice ? {
        priceEGP: {
          ...(filters.minPrice && { gte: filters.minPrice }),
          ...(filters.maxPrice && { lte: filters.maxPrice }),
        },
      } : {}),
      ...(query && {
        OR: [
          { title: { contains: query, mode: "insensitive" } },
          { titleAr: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { tags: { hasSome: query.split(" ") } },
        ],
      }),
    };

    const [data, total] = await Promise.all([
      prisma.marketplaceItem.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: "desc" } }),
      prisma.marketplaceItem.count({ where }),
    ]);

    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async placeFlashOrder(dealId: string, buyerUserId: string, quantity: number = 1) {
    const deal = await marketplaceRepository.findFlashDealById(dealId);
    if (!deal) throw new Error("Flash deal not found");
    if (!deal.isActive) throw new Error("Flash deal is no longer active");
    if (new Date() > deal.endsAt) throw new Error("Flash deal has ended");
    if (deal.soldCount + quantity > deal.quantity) throw new Error("Not enough stock");

    const totalPrice = deal.flashPriceEGP * quantity;

    const order = await marketplaceRepository.createFlashOrder({
      deal: { connect: { id: dealId } },
      buyerUserId,
      quantity,
      totalPriceEGP: totalPrice,
      status: "confirmed",
    } as any);

    await marketplaceRepository.updateFlashDeal(dealId, {
      soldCount: { increment: quantity },
    });

    return order;
  },

  async confirmFlashDelivery(orderId: string, data: { rating?: number; review?: string }) {
    // Direct prisma: complex query not in repository (flashOrder findUnique + update not in repo)
    const order = await prisma.flashOrder.findUnique({ where: { id: orderId } });
    if (!order) throw new Error("Order not found");

    return prisma.flashOrder.update({
      where: { id: orderId },
      data: {
        status: "delivered",
        rating: data.rating,
        review: data.review,
      },
    });
  },

  async matchFlashDeals(userId: string) {
    const activeDeals = await marketplaceRepository.findFlashDeals({ isActive: true });
    // Filter to only active deals that haven't ended
    return activeDeals.filter(deal => new Date() < deal.endsAt).slice(0, 20);
  },

  async mergeGuestCart(sessionId: string, userId: string) {
    // Direct prisma: complex query not in repository (shopTheLookCart not in marketplace repo)
    const guestCart = await prisma.shopTheLookCart.findFirst({ where: { sessionId, userId: null } });
    if (!guestCart) return { merged: 0 };

    const userCart = await prisma.shopTheLookCart.findFirst({ where: { userId } });
    if (userCart) {
      // Merge items
      const mergedItems = { ...(userCart.items as any || {}), ...(guestCart.items as any || {}) };
      await prisma.shopTheLookCart.update({ where: { id: userCart.id }, data: { items: mergedItems } });
      await prisma.shopTheLookCart.delete({ where: { id: guestCart.id } });
    } else {
      await prisma.shopTheLookCart.update({ where: { id: guestCart.id }, data: { userId } });
    }

    return { merged: 1 };
  },

  async generateGroupBuyOffer(signalId: string) {
    // Direct prisma: complex query not in repository (demandSignal not in marketplace repo)
    const signal = await prisma.demandSignal.findUnique({ where: { id: signalId } });
    if (!signal) throw new Error("Signal not found");

    const offer = await invokeLLMWithSchema<{
      title: string;
      description: string;
      targetQty: number;
      discountPercent: number;
      expiryDays: number;
    }>(
      `Generate a group buying offer for this demand signal:\n${JSON.stringify(signal.data)}\nCategory: ${signal.category}`,
      {
        type: "object",
        properties: {
          title: { type: "string" },
          description: { type: "string" },
          targetQty: { type: "number" },
          discountPercent: { type: "number" },
          expiryDays: { type: "number" },
        },
      }
    );

    const session = await marketplaceRepository.createGroupBuySession({
      title: offer.title,
      category: signal.category,
      targetQty: offer.targetQty,
      discountPercent: offer.discountPercent,
      status: "open",
      expiresAt: new Date(Date.now() + offer.expiryDays * 24 * 60 * 60 * 1000),
    } as any);

    return session;
  },
};
