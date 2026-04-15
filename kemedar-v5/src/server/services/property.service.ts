import { propertyRepository, type PropertyFilters } from "@/server/repositories/property.repository";
import type { PaginationParams } from "@/server/repositories/base.repository";
import { invokeLLMWithSchema } from "@/server/lib/ai-client";
import prisma from "@/server/lib/prisma";

export const propertyService = {
  async search(filters: PropertyFilters, pagination: PaginationParams) {
    return propertyRepository.findMany(filters, pagination);
  },

  async getById(id: string) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new Error("Property not found");
    // Increment view count in background
    propertyRepository.incrementViewCount(id).catch(() => {});
    return property;
  },

  async create(userId: string, data: Record<string, any>) {
    const propertyCode = `KEM-${Date.now().toString(36).toUpperCase()}`;
    return propertyRepository.create({
      ...data,
      propertyCode,
      user: { connect: { id: userId } },
      category: { connect: { id: data.categoryId } },
      purpose: { connect: { id: data.purposeId } },
      ...(data.cityId && { city: { connect: { id: data.cityId } } }),
      ...(data.statusId && { status: { connect: { id: data.statusId } } }),
      ...(data.furnishedId && { furnished: { connect: { id: data.furnishedId } } }),
    } as any);
  },

  async update(id: string, userId: string, data: Record<string, any>) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new Error("Property not found");
    if (property.userId !== userId) throw new Error("Forbidden");
    return propertyRepository.update(id, data);
  },

  async delete(id: string, userId: string) {
    const property = await propertyRepository.findById(id);
    if (!property) throw new Error("Property not found");
    if (property.userId !== userId) throw new Error("Forbidden");
    return propertyRepository.softDelete(id);
  },

  async calculateValuation(propertyId: string) {
    const property = await propertyRepository.findById(propertyId);
    if (!property) throw new Error("Property not found");

    // Get market comps
    const comps = await prisma.property.findMany({
      where: {
        cityId: property.cityId,
        categoryId: property.categoryId,
        purposeId: property.purposeId,
        isActive: true,
        priceAmount: { not: null },
        id: { not: propertyId },
      },
      select: { priceAmount: true },
      take: 20,
    });

    const prices = comps.map((c) => c.priceAmount!).filter(Boolean);
    const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : null;
    const medianPrice = prices.length > 0 ? prices.sort((a, b) => a - b)[Math.floor(prices.length / 2)] : null;

    // AI-enhanced valuation
    let aiValuation = null;
    if (property.title && avgPrice) {
      try {
        aiValuation = await invokeLLMWithSchema<{
          estimatedValueEGP: number;
          confidence: number;
          investmentGrade: string;
          roiScore: number;
          reasoning: string;
        }>(
          `Estimate the market value of this property:\n` +
            `Title: ${property.title}\n` +
            `Category: ${property.category?.name}\n` +
            `City: ${property.city?.name}\n` +
            `Listed Price: ${property.priceAmount} EGP\n` +
            `Market Average: ${avgPrice} EGP\n` +
            `Market Median: ${medianPrice} EGP\n` +
            `Comparable count: ${prices.length}\n`,
          {
            type: "object",
            properties: {
              estimatedValueEGP: { type: "number" },
              confidence: { type: "number", minimum: 0, maximum: 1 },
              investmentGrade: { type: "string", enum: ["A+", "A", "B+", "B", "C+", "C", "D"] },
              roiScore: { type: "number", minimum: 0, maximum: 100 },
              reasoning: { type: "string" },
            },
          }
        );
      } catch {
        // AI valuation is optional
      }
    }

    const valuation = await prisma.propertyValuation.create({
      data: {
        property: { connect: { id: propertyId } },
        valuationAmountEGP: aiValuation?.estimatedValueEGP ?? avgPrice,
        aiConfidence: aiValuation?.confidence,
        investmentGrade: aiValuation?.investmentGrade,
        roiScore: aiValuation?.roiScore,
        marketComps: { averagePrice: avgPrice, medianPrice, compCount: prices.length } as any,
        valuationMethod: aiValuation ? "ai_enhanced" : "market_average",
      },
    });

    return valuation;
  },

  async adminSetValuation(propertyId: string, adminId: string, valuationEGP: number) {
    return prisma.propertyValuation.create({
      data: {
        property: { connect: { id: propertyId } },
        valuationAmountEGP: valuationEGP,
        setByAdminId: adminId,
        setByAdmin: true,
        valuationMethod: "admin_set",
      },
    });
  },

  async getAIPriceSuggestion(propertyId: string) {
    const property = await propertyRepository.findById(propertyId);
    if (!property) throw new Error("Property not found");

    const suggestion = await invokeLLMWithSchema<{
      suggestedPriceEGP: number;
      priceRangeLow: number;
      priceRangeHigh: number;
      marketPosition: string;
      factors: string[];
    }>(
      `Suggest a competitive listing price for this property in the Egyptian real estate market:\n` +
        `Title: ${property.title}\n` +
        `Category: ${property.category?.name}\n` +
        `Purpose: ${property.purpose?.name}\n` +
        `City: ${property.city?.name}\n` +
        `Current Price: ${property.priceAmount || "Not set"} EGP\n`,
      {
        type: "object",
        properties: {
          suggestedPriceEGP: { type: "number" },
          priceRangeLow: { type: "number" },
          priceRangeHigh: { type: "number" },
          marketPosition: { type: "string" },
          factors: { type: "array", items: { type: "string" } },
        },
      }
    );

    return suggestion;
  },

  async batchProcessImages(propertyId: string) {
    const property = await propertyRepository.findById(propertyId);
    if (!property) throw new Error("Property not found");

    const results = [];
    for (const imageUrl of property.imageGallery || []) {
      try {
        const analysis = await invokeLLMWithSchema<{
          roomType: string;
          style: string;
          condition: string;
          qualityScore: number;
          features: string[];
        }>(
          `Analyze this real estate property image: ${imageUrl}\nIdentify the room type, style, condition, quality (0-10), and notable features.`,
          {
            type: "object",
            properties: {
              roomType: { type: "string" },
              style: { type: "string" },
              condition: { type: "string" },
              qualityScore: { type: "number" },
              features: { type: "array", items: { type: "string" } },
            },
          }
        );

        const record = await prisma.analyzedPropertyImage.create({
          data: {
            property: { connect: { id: propertyId } },
            imageUrl,
            ...analysis,
            aiAnalysis: analysis as any,
            analyzedAt: new Date(),
          },
        });
        results.push(record);
      } catch {
        // Skip failed images
      }
    }

    return results;
  },
};
