import prisma from "@/server/lib/prisma";

export const kemekitService = {
  async calculateBOQ(data: { templateId?: string; dimensions: Record<string, any> }) {
    const items = await prisma.kemeKitItem.findMany({ where: { isActive: true } });
    // Basic BOQ calculation
    const calculatedItems = items.map(item => ({
      ...item,
      calculatedQty: 1,
      totalPrice: item.priceEGP || 0,
    }));
    const totalMaterial = calculatedItems.reduce((sum, i) => sum + (i.totalPrice || 0), 0);

    const calculation = await prisma.kemeKitCalculation.create({
      data: {
        userId: "system",
        rooms: data.dimensions as any,
        items: calculatedItems as any,
        totalMaterialCost: totalMaterial,
        totalLaborCost: totalMaterial * 0.3,
        totalShippingCost: totalMaterial * 0.05,
        grandTotal: totalMaterial * 1.35,
      },
    });

    return calculation;
  },
};
