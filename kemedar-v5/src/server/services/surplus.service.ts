import { surplusRepository } from "@/server/repositories/surplus.repository";
import { invokeLLM } from "@/server/lib/ai-client";

export const surplusService = {
  async publishItem(sellerId: string, data: {
    title: string;
    titleAr?: string;
    description?: string;
    category?: string;
    condition?: string;
    priceEGP?: number;
    originalPriceEGP?: number;
    quantity?: number;
    unit?: string;
    imageUrls?: string[];
    location?: string;
    cityId?: string;
    source?: string;
  }) {
    return surplusRepository.createItem({
      seller: { connect: { id: sellerId } },
      ...data,
      imageUrls: data.imageUrls || [],
      isActive: true,
    } as any);
  },

  async reserveItem(itemId: string, buyerUserId: string) {
    const item = await surplusRepository.findItemById(itemId);
    if (!item) throw new Error("Item not found");
    if (!item.isActive) throw new Error("Item is no longer available");
    if (item.reservedByUserId) throw new Error("Item is already reserved");

    const settings = await surplusRepository.getSettings();
    const reservationHours = settings?.reservationHours || 24;

    return surplusRepository.updateItem(itemId, {
      reservedByUserId: buyerUserId,
      reservedAt: new Date(),
      reservationExpiresAt: new Date(Date.now() + reservationHours * 60 * 60 * 1000),
    });
  },

  async cancelReservation(itemId: string, reason?: string) {
    const item = await surplusRepository.findItemById(itemId);
    if (!item) throw new Error("Item not found");

    await surplusRepository.createTransaction({
      item: { connect: { id: itemId } },
      buyer: { connect: { id: item.reservedByUserId || "" } },
      seller: { connect: { id: item.sellerId } },
      amountEGP: 0,
      status: "cancelled",
    } as any);

    return surplusRepository.updateItem(itemId, {
      reservedByUserId: null,
      reservedAt: null,
      reservationExpiresAt: null,
    });
  },

  async autoExpireReservations() {
    // Direct prisma: complex query not in repository (findMany with complex where for expired reservations)
    const { data: expired } = await surplusRepository.findItems(
      { isActive: true },
      { pageSize: 1000 }
    );

    let processed = 0;
    const now = new Date();
    for (const item of expired) {
      if (item.reservedByUserId && item.reservationExpiresAt && item.reservationExpiresAt < now) {
        await surplusRepository.updateItem(item.id, {
          reservedByUserId: null,
          reservedAt: null,
          reservationExpiresAt: null,
        });
        processed++;
      }
    }

    return { processed };
  },

  async createShipmentRequest(itemId: string, buyerUserId: string, data: {
    deliveryAddress: string;
    weightKg?: number;
  }) {
    const item = await surplusRepository.findItemById(itemId);
    if (!item) throw new Error("Item not found");

    const settings = await surplusRepository.getSettings();
    const ratePerKg = settings?.shippingRatePerKg || 15;
    const estimatedCost = (data.weightKg || 1) * ratePerKg;

    return surplusRepository.createShipmentRequest({
      item: { connect: { id: itemId } },
      buyer: { connect: { id: buyerUserId } },
      seller: { connect: { id: item.sellerId } },
      deliveryAddress: data.deliveryAddress,
      weightKg: data.weightKg,
      estimatedCostEGP: estimatedCost,
      status: "pending",
    } as any);
  },

  async generateListing(itemId: string) {
    const item = await surplusRepository.findItemById(itemId);
    if (!item) throw new Error("Item not found");

    const result = await invokeLLM(
      `Generate an attractive marketplace listing for this surplus building material:\n` +
        `Title: ${item.title}\nCategory: ${item.category}\nCondition: ${item.condition}\n` +
        `Price: ${item.priceEGP} EGP\nOriginal Price: ${item.originalPriceEGP} EGP\n\n` +
        `Write a compelling description in both English and Arabic.`,
      { maxTokens: 500 }
    );

    return { description: result.content };
  },

  async queryForProfessional(category: string, cityId?: string) {
    const result = await surplusRepository.findItems(
      { isActive: true, category, cityId },
      { pageSize: 50 }
    );
    return result.data;
  },
};
