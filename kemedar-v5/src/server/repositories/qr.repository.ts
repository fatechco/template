import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";

export const qrRepository = {
  async findByUserId(userId: string) {
    return prisma.qrCode.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  },

  async findById(id: string) {
    return prisma.qrCode.findUnique({ where: { id } });
  },

  async findByShortCode(shortCode: string) {
    return prisma.qrCode.findUnique({ where: { shortCode } });
  },

  async create(data: Prisma.QrCodeCreateInput) {
    return prisma.qrCode.create({ data });
  },

  async update(id: string, data: Prisma.QrCodeUpdateInput) {
    return prisma.qrCode.update({ where: { id }, data });
  },

  async createScan(data: Prisma.QrScanCreateInput) {
    return prisma.qrScan.create({ data });
  },

  async findScans(qrCodeId: string, limit = 50) {
    return prisma.qrScan.findMany({ where: { qrCodeId }, orderBy: { scannedAt: "desc" }, take: limit });
  },

  async getSettings() {
    return prisma.qrSettings.findFirst();
  },
};
