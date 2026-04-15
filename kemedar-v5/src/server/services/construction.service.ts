import prisma from "@/server/lib/prisma";
import { invokeLLMWithSchema } from "@/server/lib/ai-client";

export const constructionService = {
  async listProjects(filters: { userId?: string; status?: string } = {}, pagination: { page?: number; pageSize?: number } = {}) {
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 20;
    const where: any = {
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.status && { status: filters.status }),
    };
    const [data, total] = await Promise.all([
      prisma.finishProject.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: "desc" } }),
      prisma.finishProject.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async generateBOQ(data: { projectId?: string; rooms?: any; finishingLevel?: string; floorPlanUrl?: string }) {
    const result = await invokeLLMWithSchema<{
      sections: Array<{ name: string; items: Array<{ name: string; quantity: number; unit: string; priceEGP: number }> }>;
      totalMaterialCost: number;
      totalLaborCost: number;
      grandTotal: number;
    }>(
      `Generate a detailed Bill of Quantities for a home finishing project:\n${JSON.stringify(data)}`,
      { type: "object", properties: { sections: { type: "array" }, totalMaterialCost: { type: "number" }, totalLaborCost: { type: "number" }, grandTotal: { type: "number" } } },
      { systemPrompt: "You are an expert Egyptian construction estimator." }
    );
    return result;
  },
};
