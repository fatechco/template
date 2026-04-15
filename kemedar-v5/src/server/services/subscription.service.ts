import prisma from "@/server/lib/prisma";

export const subscriptionService = {
  async listPlans() {
    return prisma.subscriptionPlan.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } });
  },

  async getMyPlan(userId: string) {
    const sub = await prisma.subscription.findFirst({
      where: { userId, status: "active" },
      include: { plan: true },
      orderBy: { createdAt: "desc" },
    });
    return sub?.plan || null;
  },
};
