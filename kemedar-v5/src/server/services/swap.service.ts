import prisma from "@/server/lib/prisma"; // Direct prisma: complex queries not in repository
import { swapRepository } from "@/server/repositories/swap.repository";
import { invokeLLMWithSchema } from "@/server/lib/ai-client";

export const swapService = {
  async publishSwapIntent(userId: string, data: {
    offeredPropertyId: string;
    desiredCategories?: string[];
    desiredCityIds?: string[];
    desiredProvinceIds?: string[];
    desiredDistrictIds?: string[];
    desiredMinArea?: number;
    desiredMaxArea?: number;
    desiredMinBedrooms?: number;
    acceptsCashGap?: boolean;
    maxCashGapPayEGP?: number;
    maxCashGapReceiveEGP?: number;
    notes?: string;
  }) {
    // Direct prisma: complex query not in repository
    const property = await prisma.property.findUnique({ where: { id: data.offeredPropertyId } });
    if (!property) throw new Error("Property not found");
    if (property.userId !== userId) throw new Error("Only property owner can create swap intent");
    if (property.verificationLevel < 2) throw new Error("Property must have Verify Pro level >= 2");

    // Direct prisma: complex query not in repository (findUnique with specific where clause)
    const existing = await prisma.swapIntent.findUnique({ where: { offeredPropertyId: data.offeredPropertyId } });
    if (existing) throw new Error("Property already has an active swap intent");

    const intent = await swapRepository.createIntent({
      user: { connect: { id: userId } },
      offeredProperty: { connect: { id: data.offeredPropertyId } },
      desiredCategories: data.desiredCategories || [],
      desiredCityIds: data.desiredCityIds || [],
      desiredProvinceIds: data.desiredProvinceIds || [],
      desiredDistrictIds: data.desiredDistrictIds || [],
      desiredMinArea: data.desiredMinArea,
      desiredMaxArea: data.desiredMaxArea,
      desiredMinBedrooms: data.desiredMinBedrooms,
      acceptsCashGap: data.acceptsCashGap ?? true,
      maxCashGapPayEGP: data.maxCashGapPayEGP,
      maxCashGapReceiveEGP: data.maxCashGapReceiveEGP,
      notes: data.notes,
      status: "published",
      publishedAt: new Date(),
    } as any);

    // Direct prisma: complex query not in repository
    await prisma.property.update({ where: { id: data.offeredPropertyId }, data: { isOpenToSwap: true, swapIntentId: intent.id } });

    // Generate initial matches in background
    this.generateSwapMatches(intent.id).catch(() => {});

    return intent;
  },

  async generateSwapMatches(intentId: string) {
    // Direct prisma: complex query not in repository (findUnique with nested includes)
    const intent = await prisma.swapIntent.findUnique({
      where: { id: intentId },
      include: { offeredProperty: { include: { category: true, city: true } } },
    });
    if (!intent) throw new Error("Intent not found");

    // Direct prisma: complex query not in repository (complex where with nested relation filters)
    const candidates = await prisma.swapIntent.findMany({
      where: {
        id: { not: intentId },
        userId: { not: intent.userId },
        status: "published",
        ...(intent.desiredCityIds.length > 0 && {
          offeredProperty: { cityId: { in: intent.desiredCityIds } },
        }),
      },
      include: { offeredProperty: { include: { category: true, city: true } } },
      take: 50,
    });

    const matches = [];
    for (const candidate of candidates) {
      // Calculate match score
      let score = 0;
      const reasons: string[] = [];

      // Category match
      if (intent.desiredCategories.length === 0 || intent.desiredCategories.includes(candidate.offeredProperty.category?.name || "")) {
        score += 25;
        reasons.push("Category matches");
      }

      // Location match
      if (intent.desiredCityIds.length === 0 || intent.desiredCityIds.includes(candidate.offeredProperty.cityId || "")) {
        score += 25;
        reasons.push("Location matches");
      }

      // Reverse match - does the candidate want what we offer?
      if (candidate.desiredCityIds.length === 0 || candidate.desiredCityIds.includes(intent.offeredProperty.cityId || "")) {
        score += 25;
        reasons.push("Reverse location match");
      }
      if (candidate.desiredCategories.length === 0 || candidate.desiredCategories.includes(intent.offeredProperty.category?.name || "")) {
        score += 25;
        reasons.push("Reverse category match");
      }

      if (score >= 50) {
        // Calculate cash gap
        const priceA = intent.offeredProperty.priceAmount || 0;
        const priceB = candidate.offeredProperty.priceAmount || 0;
        const cashGap = Math.abs(priceA - priceB);
        const gapDirection = priceA > priceB ? "A_pays_B" : "B_pays_A";

        // Direct prisma: complex query not in repository (compound unique where)
        const existing = await prisma.swapMatch.findUnique({
          where: { intentAId_intentBId: { intentAId: intentId, intentBId: candidate.id } },
        });

        if (!existing) {
          const match = await swapRepository.createMatch({
            intentA: { connect: { id: intentId } },
            intentB: { connect: { id: candidate.id } },
            matchScore: score,
            matchReasons: reasons,
            cashGapAmount: cashGap,
            cashGapDirection: gapDirection,
            status: "pending",
          } as any);
          matches.push(match);
        }
      }
    }

    await swapRepository.updateIntent(intentId, { totalMatches: matches.length });
    return matches;
  },

  async expressInterest(matchId: string, userId: string) {
    // Direct prisma: complex query not in repository (findUnique with includes)
    const match = await prisma.swapMatch.findUnique({
      where: { id: matchId },
      include: { intentA: true, intentB: true },
    });
    if (!match) throw new Error("Match not found");

    const isA = match.intentA.userId === userId;
    const isB = match.intentB.userId === userId;
    if (!isA && !isB) throw new Error("Not your match");

    const update = isA ? { aInterested: true } : { bInterested: true };
    const updated = await swapRepository.updateMatch(matchId, update);

    // Check if both interested
    const bothInterested = (isA ? true : updated.aInterested) && (isB ? true : updated.bInterested);
    if (bothInterested) {
      await swapRepository.updateMatch(matchId, { status: "interested" });
    }

    return { matchId, bothInterested, newStatus: bothInterested ? "interested" : "pending" };
  },

  async passOnMatch(matchId: string, userId: string) {
    // Direct prisma: complex query not in repository (findUnique with includes)
    const match = await prisma.swapMatch.findUnique({
      where: { id: matchId },
      include: { intentA: true, intentB: true },
    });
    if (!match) throw new Error("Match not found");
    if (match.intentA.userId !== userId && match.intentB.userId !== userId) throw new Error("Not your match");

    return swapRepository.updateMatch(matchId, { status: "rejected" });
  },

  async agreeToTerms(matchId: string, userId: string, agreedGapEGP?: number) {
    // Direct prisma: complex query not in repository (findUnique with includes)
    const match = await prisma.swapMatch.findUnique({
      where: { id: matchId },
      include: { intentA: true, intentB: true },
    });
    if (!match) throw new Error("Match not found");

    const isA = match.intentA.userId === userId;
    if (!isA && match.intentB.userId !== userId) throw new Error("Not your match");

    // Record agreement message
    // Direct prisma: complex query not in repository (swapNegotiationMessage not in repo)
    await prisma.swapNegotiationMessage.create({
      data: {
        matchId,
        senderUserId: userId,
        content: `Agreed to swap terms${agreedGapEGP ? ` with cash gap of ${agreedGapEGP} EGP` : ""}`,
        messageType: "agreement",
      },
    });

    // If gap offer exists, update it
    if (agreedGapEGP !== undefined) {
      await swapRepository.createGapOffer({
        match: { connect: { id: matchId } },
        offeredBy: { connect: { id: userId } },
        amountEGP: agreedGapEGP,
        direction: isA ? "A_to_B" : "B_to_A",
        status: "accepted",
      } as any);
    }

    await swapRepository.updateMatch(matchId, { status: "agreed" });
    return { matchId, status: "agreed" };
  },

  async recordSwipe(propertyId: string, userId: string, direction: string) {
    // Direct prisma: complex query not in repository (propertySwipe not in swap repo)
    return prisma.propertySwipe.create({
      data: { propertyId, userId, direction },
    });
  },

  async transferOwnership(propertyId: string, newOwnerId: string) {
    // Direct prisma: complex query not in repository (property model not in swap repo)
    const property = await prisma.property.findUnique({ where: { id: propertyId } });
    if (!property) throw new Error("Property not found");

    return prisma.property.update({
      where: { id: propertyId },
      data: { userId: newOwnerId },
    });
  },
};
