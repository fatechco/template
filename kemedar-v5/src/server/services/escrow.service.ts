import { escrowRepository } from "@/server/repositories/escrow.repository";
import { invokeLLMWithSchema } from "@/server/lib/ai-client";
import { format } from "date-fns";

const CANONICAL_MILESTONES = [
  { order: 1, title: "Earnest Money Deposit", titleAr: "عربون الجدية", defaultPercent: 10 },
  { order: 2, title: "Contract Signing", titleAr: "توقيع العقد", defaultPercent: 0 },
  { order: 3, title: "Legal Due Diligence", titleAr: "الفحص القانوني", defaultPercent: 0 },
  { order: 4, title: "Balance Payment", titleAr: "دفع المبلغ المتبقي", defaultPercent: 90 },
  { order: 5, title: "Keys Handover", titleAr: "تسليم المفاتيح", defaultPercent: 0 },
];

function generateDealNumber(): string {
  const dateStr = format(new Date(), "yyyyMMdd");
  const random = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `KED-${dateStr}-${random}`;
}

export const escrowService = {
  async createDeal(data: {
    buyerId: string;
    sellerId: string;
    propertyId: string;
    agreedPrice: number;
    paymentStructure?: string;
    earnestMoneyPercent?: number;
  }) {
    const earnestPercent = data.earnestMoneyPercent || 10;
    const earnestAmount = data.agreedPrice * (earnestPercent / 100);

    const deal = await escrowRepository.create({
      dealNumber: generateDealNumber(),
      buyer: { connect: { id: data.buyerId } },
      seller: { connect: { id: data.sellerId } },
      property: { connect: { id: data.propertyId } },
      agreedPrice: data.agreedPrice,
      paymentStructure: (data.paymentStructure || "full_cash") as any,
      earnestMoneyAmount: earnestAmount,
      earnestMoneyPercent: earnestPercent,
      totalEscrowAmount: data.agreedPrice,
      status: "draft",
    } as any);

    // Create canonical milestones
    for (const ms of CANONICAL_MILESTONES) {
      await escrowRepository.createMilestone({
        deal: { connect: { id: deal.id } },
        milestoneOrder: ms.order,
        title: ms.title,
        titleAr: ms.titleAr,
        amountPercent: ms.defaultPercent,
        amountDue: ms.defaultPercent > 0 ? data.agreedPrice * (ms.defaultPercent / 100) : 0,
        status: ms.order === 1 ? "active" : "pending",
      } as any);
    }

    return deal;
  },

  async progressMilestone(dealId: string, userId: string) {
    const deal = await escrowRepository.findById(dealId);
    if (!deal) throw new Error("Deal not found");

    const milestones = deal.milestones;
    const current = milestones.find((m) => m.status === "active");
    if (!current) throw new Error("No active milestone");

    // Complete current
    await escrowRepository.updateMilestone(current.id, {
      status: "completed",
      completedAt: new Date(),
      completedByUserId: userId,
    });

    // Activate next
    const next = milestones.find((m) => m.milestoneOrder === current.milestoneOrder + 1);
    if (next) {
      await escrowRepository.updateMilestone(next.id, { status: "active" });
      await escrowRepository.update(dealId, {
        currentMilestone: next.title,
        completionPercent: ((current.milestoneOrder) / milestones.length) * 100,
      });
    } else {
      // All milestones complete
      await escrowRepository.update(dealId, {
        status: "completed" as any,
        completionPercent: 100,
        dealCompletedAt: new Date(),
      });
    }

    return escrowRepository.findById(dealId);
  },

  async evaluateDispute(disputeId: string) {
    const dispute = await prisma.escrowDispute.findUnique({
      where: { id: disputeId },
      include: { deal: { include: { property: true, milestones: true } } },
    });
    if (!dispute) throw new Error("Dispute not found");

    const recommendation = await invokeLLMWithSchema<{
      recommendation: string;
      reasoning: string;
      suggestedResolution: string;
      refundPercent: number;
      confidence: number;
    }>(
      `You are an expert arbitrator for Egyptian real estate escrow disputes.\n\n` +
        `Deal: ${dispute.deal.dealNumber}\n` +
        `Property: ${dispute.deal.property.title}\n` +
        `Agreed Price: ${dispute.deal.agreedPrice} EGP\n` +
        `Current Status: ${dispute.deal.status}\n` +
        `Dispute Reason: ${dispute.reason}\n` +
        `Description: ${dispute.description}\n\n` +
        `Analyze this dispute under Egyptian real estate law and suggest a fair resolution.`,
      {
        type: "object",
        properties: {
          recommendation: { type: "string" },
          reasoning: { type: "string" },
          suggestedResolution: { type: "string" },
          refundPercent: { type: "number" },
          confidence: { type: "number" },
        },
      },
      { systemPrompt: "You are an AI arbitrator specializing in Egyptian real estate law." }
    );

    await escrowRepository.updateDispute(disputeId, {
      aiRecommendation: recommendation as any,
    });

    return recommendation;
  },

  async generateDealStructure(propertyId: string, agreedPrice: number) {
    const result = await invokeLLMWithSchema<{
      milestones: Array<{ title: string; percent: number; conditions: string[]; estimatedDays: number }>;
      paymentBreakdown: Record<string, number>;
      timeline: string;
      riskFlags: string[];
    }>(
      `Generate an escrow deal structure for an Egyptian real estate transaction:\n` +
        `Property ID: ${propertyId}\n` +
        `Agreed Price: ${agreedPrice} EGP\n\n` +
        `Create a milestone-based payment structure with conditions and timeline.`,
      {
        type: "object",
        properties: {
          milestones: { type: "array" },
          paymentBreakdown: { type: "object" },
          timeline: { type: "string" },
          riskFlags: { type: "array" },
        },
      }
    );

    return result;
  },
};

// Need prisma import for evaluateDispute
import prisma from "@/server/lib/prisma";
