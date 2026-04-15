import { auctionRepository } from "@/server/repositories/auction.repository";
import { propertyRepository } from "@/server/repositories/property.repository";
import prisma from "@/server/lib/prisma";
import { format } from "date-fns";

function generateAuctionCode(): string {
  const dateStr = format(new Date(), "yyyyMMdd");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `KAB-${dateStr}-${random}`;
}

export const auctionService = {
  async createAuction(userId: string, data: {
    propertyId: string;
    startingPriceEGP: number;
    reservePriceEGP?: number;
    buyNowPriceEGP?: number;
    auctionStartAt: Date;
    auctionEndAt: Date;
    minBidIncrementEGP?: number;
  }) {
    const property = await propertyRepository.findById(data.propertyId);
    if (!property) throw new Error("Property not found");
    if (property.userId !== userId) throw new Error("Only the property owner can create an auction");
    if (property.verificationLevel < 2) throw new Error("Property must have Verify Pro level >= 2");
    if (property.isAuction) throw new Error("Property already has an active auction");

    const settings = await auctionRepository.getSettings();
    const sellerDepositAmount = Math.max(
      data.startingPriceEGP * ((settings?.sellerDepositPercent || 0.5) / 100),
      settings?.sellerDepositMinEGP || 2000
    );

    const auction = await auctionRepository.create({
      property: { connect: { id: data.propertyId } },
      sellerUserId: userId,
      auctionCode: generateAuctionCode(),
      startingPriceEGP: data.startingPriceEGP,
      reservePriceEGP: data.reservePriceEGP,
      buyNowPriceEGP: data.buyNowPriceEGP,
      auctionStartAt: data.auctionStartAt,
      auctionEndAt: data.auctionEndAt,
      minBidIncrementEGP: data.minBidIncrementEGP || settings?.defaultMinBidIncrementEGP || 5000,
      sellerDepositAmountEGP: sellerDepositAmount,
      extensionMinutes: settings?.defaultExtensionMinutes || 5,
      maxExtensions: settings?.defaultMaxExtensions || 3,
      platformCommissionPercent: settings?.platformCommissionPercent || 2,
      status: "draft",
    } as any);

    // Mark property as auction
    await propertyRepository.update(data.propertyId, { isAuction: true, auctionId: auction.id });

    // Log event
    await auctionRepository.createEvent({
      auction: { connect: { id: auction.id } },
      eventType: "auction_created",
      actorUserId: userId,
      actorType: "seller",
      description: `Auction ${auction.auctionCode} created for property ${property.title}`,
      recordedAt: new Date(),
    } as any);

    return auction;
  },

  async approveAuction(auctionId: string, adminId: string) {
    const auction = await auctionRepository.findById(auctionId);
    if (!auction) throw new Error("Auction not found");
    if (auction.status !== "draft" && auction.status !== "pending_approval") {
      throw new Error("Auction cannot be approved in current status");
    }

    const updated = await auctionRepository.update(auctionId, { status: "approved" });

    await auctionRepository.createEvent({
      auction: { connect: { id: auctionId } },
      eventType: "auction_approved",
      actorUserId: adminId,
      actorType: "admin",
      description: "Auction approved by admin",
      recordedAt: new Date(),
    } as any);

    return updated;
  },

  async registerBidder(auctionId: string, userId: string) {
    const auction = await auctionRepository.findById(auctionId);
    if (!auction) throw new Error("Auction not found");

    const existing = await auctionRepository.findRegistration(auctionId, userId);
    if (existing) throw new Error("Already registered for this auction");

    const settings = await auctionRepository.getSettings();
    const depositAmount = Math.max(
      auction.startingPriceEGP * ((settings?.buyerDepositPercent || 1) / 100),
      settings?.buyerDepositMinEGP || 5000
    );

    const registration = await auctionRepository.createRegistration({
      auction: { connect: { id: auctionId } },
      bidder: { connect: { id: userId } },
      bidderUserId: userId,
      depositAmountEGP: depositAmount,
      registeredAt: new Date(),
    } as any);

    await auctionRepository.createEvent({
      auction: { connect: { id: auctionId } },
      eventType: "bidder_registered",
      actorUserId: userId,
      actorType: "bidder",
      description: `New bidder registered`,
      recordedAt: new Date(),
    } as any);

    return registration;
  },

  async placeBid(auctionId: string, userId: string, bidAmountEGP: number, bidType: "manual" | "auto_max" | "buy_now" = "manual") {
    const auction = await auctionRepository.findById(auctionId);
    if (!auction) throw new Error("Auction not found");
    if (auction.status !== "live") throw new Error("Auction is not live");
    if (auction.auctionEndAt && new Date() > auction.auctionEndAt) throw new Error("Auction has ended");

    // Verify registration
    const registration = await auctionRepository.findRegistration(auctionId, userId);
    if (!registration || registration.registrationStatus !== "active") {
      throw new Error("Must be a registered and active bidder");
    }

    // Validate bid amount
    const currentHighest = auction.currentHighestBidEGP || auction.startingPriceEGP;
    if (bidType !== "buy_now" && bidAmountEGP < currentHighest + auction.minBidIncrementEGP) {
      throw new Error(`Bid must be at least ${currentHighest + auction.minBidIncrementEGP} EGP`);
    }

    // Handle buy now
    if (bidType === "buy_now" && auction.buyNowPriceEGP) {
      bidAmountEGP = auction.buyNowPriceEGP;
    }

    // Mark previous winning bid as non-winning
    const previousHighest = await auctionRepository.findHighestBid(auctionId);
    if (previousHighest) {
      await prisma.auctionBid.update({ where: { id: previousHighest.id }, data: { isWinning: false } });
    }

    const bidCount = await auctionRepository.countBids(auctionId);

    // Check for anti-snipe extension
    let wasExtended = false;
    let extensionMinutesAdded = 0;
    if (auction.auctionEndAt && auction.extensionsUsed < auction.maxExtensions) {
      const timeRemaining = auction.auctionEndAt.getTime() - Date.now();
      const extensionThresholdMs = auction.extensionMinutes * 60 * 1000;
      if (timeRemaining < extensionThresholdMs) {
        wasExtended = true;
        extensionMinutesAdded = auction.extensionMinutes;
        const newEndAt = new Date(auction.auctionEndAt.getTime() + extensionMinutesAdded * 60 * 1000);
        await auctionRepository.update(auctionId, {
          auctionEndAt: newEndAt,
          extensionsUsed: { increment: 1 },
        });
      }
    }

    // Create bid
    const bid = await auctionRepository.createBid({
      auction: { connect: { id: auctionId } },
      bidder: { connect: { id: userId } },
      bidAmountEGP,
      bidType,
      isWinning: true,
      bidSequenceNumber: bidCount + 1,
      wasExtended,
      extensionMinutesAdded: wasExtended ? extensionMinutesAdded : undefined,
      bidPlacedAt: new Date(),
    } as any);

    // Update auction
    const uniqueBidders = await auctionRepository.countUniqueBidders(auctionId);
    await auctionRepository.update(auctionId, {
      currentHighestBidEGP: bidAmountEGP,
      currentHighestBidderId: userId,
      totalBidsCount: { increment: 1 },
      uniqueBiddersCount: uniqueBidders,
    });

    // Update registration
    await auctionRepository.updateRegistration(registration.id, {
      totalBidsPlaced: { increment: 1 },
      highestBidPlaced: Math.max(registration.highestBidPlaced, bidAmountEGP),
      lastBidAt: new Date(),
    });

    // Log event
    await auctionRepository.createEvent({
      auction: { connect: { id: auctionId } },
      eventType: bidType === "buy_now" ? "buy_now_triggered" : "bid_placed",
      actorUserId: userId,
      actorType: "bidder",
      description: `Bid of ${bidAmountEGP} EGP placed`,
      metaData: { bidAmount: bidAmountEGP, bidType, wasExtended },
      recordedAt: new Date(),
    } as any);

    // Handle buy now - end auction immediately
    if (bidType === "buy_now") {
      await this.endAuction(auctionId);
    }

    return bid;
  },

  async endAuction(auctionId: string) {
    const auction = await auctionRepository.findById(auctionId);
    if (!auction) throw new Error("Auction not found");

    const highestBid = await auctionRepository.findHighestBid(auctionId);

    let newStatus: string;
    if (!highestBid) {
      newStatus = "ended_no_bids";
    } else if (auction.reservePriceEGP && highestBid.bidAmountEGP < auction.reservePriceEGP) {
      newStatus = "ended_reserve_not_met";
    } else {
      newStatus = "ended_winner";
    }

    const updated = await auctionRepository.update(auctionId, {
      status: newStatus as any,
      winnerId: newStatus === "ended_winner" ? highestBid!.bidderUserId : null,
      winnerPaymentDeadline: newStatus === "ended_winner" ? new Date(Date.now() + 48 * 60 * 60 * 1000) : null,
    });

    // Mark winner registration
    if (newStatus === "ended_winner" && highestBid) {
      const reg = await auctionRepository.findRegistration(auctionId, highestBid.bidderUserId);
      if (reg) {
        await auctionRepository.updateRegistration(reg.id, { registrationStatus: "winner", isWinner: true });
      }
    }

    await auctionRepository.createEvent({
      auction: { connect: { id: auctionId } },
      eventType: "auction_ended",
      actorType: "system",
      description: `Auction ended with status: ${newStatus}`,
      metaData: { finalPrice: highestBid?.bidAmountEGP, winnerId: highestBid?.bidderUserId, totalBids: auction.totalBidsCount },
      recordedAt: new Date(),
    } as any);

    return updated;
  },

  async forfeitWinner(auctionId: string) {
    const auction = await auctionRepository.findById(auctionId);
    if (!auction || auction.status !== "ended_winner") throw new Error("Invalid auction state");

    // Forfeit deposit: 50% to seller, 50% to platform
    if (auction.winnerId) {
      const reg = await auctionRepository.findRegistration(auctionId, auction.winnerId);
      if (reg) {
        await auctionRepository.updateRegistration(reg.id, {
          registrationStatus: "forfeited",
          depositStatus: "forfeited",
        });
      }
    }

    await auctionRepository.update(auctionId, { status: "failed" as any });

    await auctionRepository.createEvent({
      auction: { connect: { id: auctionId } },
      eventType: "deposit_forfeited",
      actorType: "system",
      description: "Winner failed to pay. Deposit forfeited.",
      recordedAt: new Date(),
    } as any);
  },

  async refundAllLosers(auctionId: string) {
    const registrations = await auctionRepository.findActiveRegistrations(auctionId);
    const auction = await auctionRepository.findById(auctionId);

    for (const reg of registrations) {
      if (reg.bidderUserId !== auction?.winnerId && reg.depositStatus === "held") {
        await auctionRepository.updateRegistration(reg.id, {
          registrationStatus: "refunded",
          depositStatus: "refunded",
          depositRefundedAt: new Date(),
        });

        await auctionRepository.createEvent({
          auction: { connect: { id: auctionId } },
          eventType: "deposit_refunded",
          actorUserId: reg.bidderUserId,
          actorType: "system",
          description: `Deposit refunded to bidder`,
          recordedAt: new Date(),
        } as any);
      }
    }
  },

  async setAutoBid(auctionId: string, userId: string, maxAmountEGP: number, increment: number) {
    const reg = await auctionRepository.findRegistration(auctionId, userId);
    if (!reg || reg.registrationStatus !== "active") throw new Error("Not a registered bidder");

    await auctionRepository.updateRegistration(reg.id, {
      hasAutoBid: true,
      autoBidMaxEGP: maxAmountEGP,
      autoBidIncrement: increment,
    });

    return { success: true, maxAmountEGP, increment };
  },
};
