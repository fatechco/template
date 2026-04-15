import prisma from "@/server/lib/prisma"; // Direct prisma: complex queries not in repository
import { dnaRepository } from "@/server/repositories/dna.repository";

export const dnaService = {
  async getMyDNA(userId: string) {
    let dna = await dnaRepository.findByUserId(userId);
    if (!dna) {
      dna = await this.recalculateDNA(userId);
    }
    return dna;
  },

  async recalculateDNA(userId: string) {
    // Direct prisma: complex query not in repository (user model not in dna repo)
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error("User not found");

    // Gather signals
    const signals = await dnaRepository.findSignals(userId, 500);
    // Direct prisma: complex query not in repository (property model not in dna repo)
    const properties = await prisma.property.findMany({ where: { userId }, select: { categoryId: true, cityId: true, priceAmount: true } });

    // Calculate preferences
    const preferredTypes = properties.map((p) => p.categoryId).filter(Boolean);
    const preferredLocations = properties.map((p) => p.cityId).filter(Boolean) as string[];
    const prices = properties.map((p) => p.priceAmount).filter(Boolean) as number[];

    const dna = await dnaRepository.upsert(userId, {
      user: { connect: { id: userId } },
      preferredPropertyTypes: [...new Set(preferredTypes)],
      preferredLocations: [...new Set(preferredLocations)],
      budgetMin: prices.length > 0 ? Math.min(...prices) : null,
      budgetMax: prices.length > 0 ? Math.max(...prices) : null,
      searchBehavior: { signalCount: signals.length, lastActive: signals[0]?.createdAt } as any,
      calculatedAt: new Date(),
    } as any);

    return dna;
  },

  async recalculateAllDNA() {
    // Direct prisma: complex query not in repository (user findMany not in dna repo)
    const users = await prisma.user.findMany({ where: { isActive: true }, select: { id: true } });
    let updated = 0;
    for (const user of users) {
      try {
        await this.recalculateDNA(user.id);
        updated++;
      } catch {
        // Skip failed users
      }
    }
    return { updated, total: users.length };
  },

  async trackSignal(userId: string, signalType: string, value: any, source?: string) {
    return dnaRepository.createSignal({
      user: { connect: { id: userId } },
      signalType,
      value: value as any,
      source,
      strength: 1,
    } as any);
  },
};
