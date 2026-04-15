import { fracRepository } from "@/server/repositories/frac.repository";
import { propertyRepository } from "@/server/repositories/property.repository";
import prisma from "@/server/lib/prisma";

export const fracService = {
  async submitOffering(userId: string, data: {
    propertyId: string;
    offeringTitle: string;
    offeringTitleAr?: string;
    offeringDescription?: string;
    offeringDescriptionAr?: string;
    totalTokenSupply: number;
    tokenPriceEGP: number;
    tokensForSale: number;
    offeringType: string;
    expectedAnnualYieldPercent?: number;
    yieldFrequency?: string;
  }) {
    const property = await propertyRepository.findById(data.propertyId);
    if (!property) throw new Error("Property not found");
    if (property.userId !== userId) throw new Error("Only property owner can submit offering");
    if (property.verificationLevel < 3) throw new Error("Property must have Verify Pro level >= 3");

    const existing = await fracRepository.findByPropertyId(data.propertyId);
    if (existing) throw new Error("Property already has a fractional offering");

    const slug = data.offeringTitle.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const tokenSymbol = `KMF-${slug.substring(0, 6).toUpperCase()}`;

    const offering = await fracRepository.create({
      property: { connect: { id: data.propertyId } },
      submittedByUserId: userId,
      offeringTitle: data.offeringTitle,
      offeringTitleAr: data.offeringTitleAr,
      offeringDescription: data.offeringDescription,
      offeringDescriptionAr: data.offeringDescriptionAr,
      offeringSlug: slug,
      totalTokenSupply: data.totalTokenSupply,
      tokenPriceEGP: data.tokenPriceEGP,
      tokensForSale: data.tokensForSale,
      tokensRetainedBySeller: data.totalTokenSupply - data.tokensForSale,
      tokensAvailable: data.tokensForSale,
      tokenSymbol,
      tokenName: `KemeFrac ${data.offeringTitle}`,
      offeringType: data.offeringType as any,
      expectedAnnualYieldPercent: data.expectedAnnualYieldPercent,
      yieldFrequency: data.yieldFrequency as any,
      status: "under_review",
    } as any);

    // Update property
    await propertyRepository.update(data.propertyId, { isFracOffering: true, fracPropertyId: offering.id });

    return offering;
  },

  async approveOffering(fracPropertyId: string, adminId: string, valuationEGP: number) {
    const offering = await fracRepository.findById(fracPropertyId);
    if (!offering) throw new Error("Offering not found");
    if (offering.status !== "under_review") throw new Error("Offering not in review state");

    return fracRepository.update(fracPropertyId, {
      status: "approved",
      approvedByAdminId: adminId,
      propertyValuationEGP: valuationEGP,
      valuationApprovedByAdminId: adminId,
      valuationDate: new Date(),
    });
  },

  async purchaseTokens(fracPropertyId: string, buyerUserId: string, tokensAmount: number, paymentMethod: string) {
    const offering = await fracRepository.findById(fracPropertyId);
    if (!offering) throw new Error("Offering not found");
    if (offering.status !== "live") throw new Error("Offering is not live");
    if (offering.tokensAvailable !== null && tokensAmount > offering.tokensAvailable) {
      throw new Error("Not enough tokens available");
    }
    if (tokensAmount < offering.minTokensPerBuyer) {
      throw new Error(`Minimum purchase is ${offering.minTokensPerBuyer} tokens`);
    }
    if (offering.maxTokensPerBuyer) {
      const existing = await fracRepository.findToken(fracPropertyId, buyerUserId);
      const currentHeld = existing?.tokensHeld || 0;
      if (currentHeld + tokensAmount > offering.maxTokensPerBuyer) {
        throw new Error(`Maximum holding is ${offering.maxTokensPerBuyer} tokens`);
      }
    }

    const totalAmountEGP = tokensAmount * offering.tokenPriceEGP;
    const platformFeeEGP = totalAmountEGP * 0.025; // 2.5% platform fee

    // Create transaction
    const transaction = await fracRepository.createTransaction({
      fracProperty: { connect: { id: fracPropertyId } },
      transactionType: "purchase",
      toUserId: buyerUserId,
      tokensAmount,
      pricePerTokenEGP: offering.tokenPriceEGP,
      totalAmountEGP,
      platformFeeEGP,
      paymentMethod: paymentMethod as any,
      status: "confirmed",
    } as any);

    // Update or create token holding
    const existingToken = await fracRepository.findToken(fracPropertyId, buyerUserId);
    if (existingToken) {
      const newTotal = existingToken.tokensHeld + tokensAmount;
      await prisma.fracToken.update({
        where: { id: existingToken.id },
        data: {
          tokensHeld: newTotal,
          tokensHeldPercent: (newTotal / offering.totalTokenSupply) * 100,
          totalInvestedEGP: (existingToken.totalInvestedEGP || 0) + totalAmountEGP,
          averagePurchasePriceEGP: ((existingToken.totalInvestedEGP || 0) + totalAmountEGP) / newTotal,
          lastTransactionAt: new Date(),
        },
      });
    } else {
      await prisma.fracToken.create({
        data: {
          fracPropertyId,
          propertyId: offering.propertyId,
          holderUserId: buyerUserId,
          tokensHeld: tokensAmount,
          tokensHeldPercent: (tokensAmount / offering.totalTokenSupply) * 100,
          totalInvestedEGP: totalAmountEGP,
          averagePurchasePriceEGP: offering.tokenPriceEGP,
          firstPurchasedAt: new Date(),
          lastTransactionAt: new Date(),
        },
      });
    }

    // Update offering counters
    await fracRepository.update(fracPropertyId, {
      tokensSold: { increment: tokensAmount },
      tokensAvailable: { decrement: tokensAmount },
    });

    // Check if sold out
    const updated = await fracRepository.findById(fracPropertyId);
    if (updated && updated.tokensAvailable !== null && updated.tokensAvailable <= 0) {
      await fracRepository.update(fracPropertyId, { status: "sold_out" });
    }

    return transaction;
  },

  async distributeYield(fracPropertyId: string, totalYieldEGP: number, periodStart: Date, periodEnd: Date) {
    const offering = await fracRepository.findById(fracPropertyId);
    if (!offering) throw new Error("Offering not found");

    const tokens = await prisma.fracToken.findMany({
      where: { fracPropertyId, isActive: true, tokensHeld: { gt: 0 } },
    });

    if (tokens.length === 0) throw new Error("No token holders found");

    const totalTokensHeld = tokens.reduce((sum, t) => sum + t.tokensHeld, 0);
    const perTokenYield = totalYieldEGP / totalTokensHeld;

    // Create distribution record
    const distribution = await fracRepository.createYieldDistribution({
      fracProperty: { connect: { id: fracPropertyId } },
      periodStart,
      periodEnd,
      totalYieldEGP,
      perTokenYieldEGP: perTokenYield,
      totalTokensEligible: totalTokensHeld,
      holdersCount: tokens.length,
      status: "distributed",
      distributedAt: new Date(),
    } as any);

    // Create individual yield transactions
    for (const token of tokens) {
      const holderYield = perTokenYield * token.tokensHeld;
      await fracRepository.createTransaction({
        fracProperty: { connect: { id: fracPropertyId } },
        transactionType: "yield_paid",
        toUserId: token.holderUserId,
        tokensAmount: token.tokensHeld,
        totalAmountEGP: holderYield,
        pricePerTokenEGP: perTokenYield,
        status: "confirmed",
      } as any);
    }

    return distribution;
  },

  async getPortfolio(userId: string) {
    return fracRepository.findTokensByHolder(userId);
  },
};
