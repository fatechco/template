import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";

export const verificationRepository = {
  async findDocuments(userId: string) {
    return prisma.verificationDocument.findMany({ where: { userId }, orderBy: { createdAt: "desc" } });
  },

  async createDocument(data: Prisma.VerificationDocumentCreateInput) {
    return prisma.verificationDocument.create({ data });
  },

  async updateDocument(id: string, data: Prisma.VerificationDocumentUpdateInput) {
    return prisma.verificationDocument.update({ where: { id }, data });
  },

  async findRecords(propertyId: string) {
    return prisma.verificationRecord.findMany({ where: { propertyId }, orderBy: { createdAt: "desc" } });
  },

  async createRecord(data: Prisma.VerificationRecordCreateInput) {
    return prisma.verificationRecord.create({ data });
  },

  async findLatestRecord(propertyId: string) {
    return prisma.verificationRecord.findFirst({ where: { propertyId }, orderBy: { createdAt: "desc" } });
  },
};
