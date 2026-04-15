import prisma from "@/server/lib/prisma"; // Direct prisma: complex queries not in repository
import { kemeworkRepository } from "@/server/repositories/kemework.repository";
import { invokeLLMWithSchema, invokeLLM } from "@/server/lib/ai-client";

export const kemeworkService = {
  async processSnapAndFix(userId: string, imageUrl: string) {
    const diagnosis = await invokeLLMWithSchema<{
      issueType: string;
      severity: string;
      description: string;
      requiredMaterials: Array<{ name: string; quantity: number; unit: string; estimatedPriceEGP: number }>;
      estimatedLaborCostEGP: number;
      safetyAlerts: string[];
      recommendedProfessionalType: string;
    }>(
      `Analyze this home issue photo and diagnose the problem: ${imageUrl}\n\nIdentify the type of issue, severity, required materials, and estimated costs in the Egyptian market.`,
      {
        type: "object",
        properties: {
          issueType: { type: "string" },
          severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
          description: { type: "string" },
          requiredMaterials: { type: "array" },
          estimatedLaborCostEGP: { type: "number" },
          safetyAlerts: { type: "array" },
          recommendedProfessionalType: { type: "string" },
        },
      },
      { systemPrompt: "You are a home repair diagnostic expert for the Egyptian market." }
    );

    const session = await kemeworkRepository.createSnapSession({
      user: { connect: { id: userId } },
      imageUrl,
      analysis: diagnosis as any,
      materialMatches: diagnosis.requiredMaterials as any,
      status: "diagnosed",
    } as any);

    return { session, diagnosis };
  },

  async convertSnapToTask(snapSessionId: string, data: {
    editedDescription?: string;
    userBudgetEGP?: number;
  }) {
    // Direct prisma: complex query not in repository (findUnique for snapSession by id)
    const session = await prisma.snapSession.findUnique({ where: { id: snapSessionId } });
    if (!session) throw new Error("Snap session not found");

    const analysis = session.analysis as any;
    const task = await kemeworkRepository.createServiceOrder({
      user: { connect: { id: session.userId } },
      serviceType: analysis?.recommendedProfessionalType || "general",
      title: data.editedDescription || analysis?.description || "Snap & Fix Task",
      description: JSON.stringify(analysis),
      status: "pending",
      estimatedCostEGP: data.userBudgetEGP || analysis?.estimatedLaborCostEGP,
      imageUrls: session.imageUrl ? [session.imageUrl] : [],
    } as any);

    await kemeworkRepository.updateSnapSession(snapSessionId, { status: "converted" });
    return task;
  },

  async updateTaskStatus(taskId: string, newStatus: string, userId?: string) {
    const order = await kemeworkRepository.findServiceOrderById(taskId);
    if (!order) throw new Error("Service order not found");

    const updated = await kemeworkRepository.updateServiceOrder(taskId, {
      status: newStatus as any,
      ...(newStatus === "completed" && { completedAt: new Date() }),
    });

    await kemeworkRepository.createServiceOrderActivity({
      order: { connect: { id: taskId } },
      activityType: `status_changed_to_${newStatus}`,
      description: `Status changed to ${newStatus}`,
      performedByUserId: userId,
    } as any);

    return updated;
  },

  async generateCaptureGuide(propertyId: string) {
    // Direct prisma: complex query not in repository (property model not in kemework repo)
    const property = await prisma.property.findUnique({ where: { id: propertyId }, include: { category: true } });
    if (!property) throw new Error("Property not found");

    const guide = await invokeLLMWithSchema<{
      rooms: Array<{
        roomType: string;
        tips: string[];
        angles: string[];
        lighting: string;
      }>;
      generalTips: string[];
    }>(
      `Generate a property photography capture guide for: ${property.title} (${property.category?.name})\nProvide room-by-room photography tips.`,
      {
        type: "object",
        properties: {
          rooms: { type: "array" },
          generalTips: { type: "array" },
        },
      }
    );

    return guide;
  },

  async requestInstallation(userId: string, data: {
    calculationId?: string;
    itemIds?: string[];
    address?: string;
    cityId?: string;
    preferredDate?: Date;
  }) {
    // Direct prisma: complex query not in repository (kemeKitInstallationRequest not in kemework repo)
    return prisma.kemeKitInstallationRequest.create({
      data: {
        userId,
        calculationId: data.calculationId,
        itemIds: data.itemIds || [],
        address: data.address,
        cityId: data.cityId,
        preferredDate: data.preferredDate,
        status: "pending",
      },
    });
  },
};
