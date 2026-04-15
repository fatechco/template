import prisma from "@/server/lib/prisma";

export const crmService = {
  async listContacts(filters: { search?: string; leadStatus?: string; assignedTo?: string } = {}, pagination: { page?: number; pageSize?: number } = {}) {
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 20;
    const where: any = {
      deletedAt: null,
      ...(filters.leadStatus && { leadStatus: filters.leadStatus }),
      ...(filters.assignedTo && { assignedToUserId: filters.assignedTo }),
      ...(filters.search && { OR: [
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { phone: { contains: filters.search, mode: "insensitive" } },
      ] }),
    };
    const [data, total] = await Promise.all([
      prisma.cRMContact.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: "desc" } }),
      prisma.cRMContact.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async getContact(id: string) {
    return prisma.cRMContact.findUnique({ where: { id }, include: { opportunities: true, tasks: true, notes_: true, calls: true, activityLogs: true } });
  },

  async createContact(data: any) {
    return prisma.cRMContact.create({ data });
  },

  async updateContact(id: string, data: any) {
    return prisma.cRMContact.update({ where: { id }, data });
  },

  async deleteContact(id: string) {
    return prisma.cRMContact.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  async listOpportunities(filters: { contactId?: string; stage?: string } = {}, pagination: { page?: number; pageSize?: number } = {}) {
    const page = pagination.page || 1;
    const pageSize = pagination.pageSize || 20;
    const where: any = {
      ...(filters.contactId && { contactId: filters.contactId }),
      ...(filters.stage && { stage: filters.stage }),
    };
    const [data, total] = await Promise.all([
      prisma.cRMOpportunity.findMany({ where, skip: (page - 1) * pageSize, take: pageSize, orderBy: { createdAt: "desc" } }),
      prisma.cRMOpportunity.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async createOpportunity(data: any) {
    return prisma.cRMOpportunity.create({ data });
  },
};
