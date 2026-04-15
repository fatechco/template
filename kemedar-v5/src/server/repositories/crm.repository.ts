import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const crmRepository = {
  async findContacts(filters: { search?: string; leadStatus?: string; assignedTo?: string } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.CrmContactWhereInput = {
      deletedAt: null,
      ...(filters.leadStatus && { leadStatus: filters.leadStatus as any }),
      ...(filters.assignedTo && { assignedTo: filters.assignedTo }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" as const } },
          { email: { contains: filters.search, mode: "insensitive" as const } },
          { phone: { contains: filters.search, mode: "insensitive" as const } },
        ],
      }),
    };
    const [data, total] = await Promise.all([
      prisma.crmContact.findMany({ where, skip, take, orderBy }),
      prisma.crmContact.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findContactById(id: string) {
    return prisma.crmContact.findUnique({ where: { id }, include: { opportunities: true, tasks: { orderBy: { dueDate: "asc" } }, notes: { orderBy: { createdAt: "desc" } } } });
  },

  async createContact(data: Prisma.CrmContactCreateInput) {
    return prisma.crmContact.create({ data });
  },

  async updateContact(id: string, data: Prisma.CrmContactUpdateInput) {
    return prisma.crmContact.update({ where: { id }, data });
  },

  async deleteContact(id: string) {
    return prisma.crmContact.update({ where: { id }, data: { deletedAt: new Date() } });
  },

  // Opportunities
  async findOpportunities(filters: { contactId?: string; stage?: string } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.CrmOpportunityWhereInput = {
      ...(filters.contactId && { contactId: filters.contactId }),
      ...(filters.stage && { stage: filters.stage as any }),
    };
    const [data, total] = await Promise.all([
      prisma.crmOpportunity.findMany({ where, skip, take, orderBy, include: { contact: { select: { id: true, name: true } } } }),
      prisma.crmOpportunity.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async createOpportunity(data: Prisma.CrmOpportunityCreateInput) {
    return prisma.crmOpportunity.create({ data });
  },

  async updateOpportunity(id: string, data: Prisma.CrmOpportunityUpdateInput) {
    return prisma.crmOpportunity.update({ where: { id }, data });
  },

  async createOpportunityHistory(data: Prisma.CrmOpportunityHistoryCreateInput) {
    return prisma.crmOpportunityHistory.create({ data });
  },

  // Pipelines
  async findPipelines() {
    return prisma.crmPipeline.findMany({ orderBy: { order: "asc" } });
  },

  // Tasks
  async createTask(data: Prisma.CrmTaskCreateInput) {
    return prisma.crmTask.create({ data });
  },

  async updateTask(id: string, data: Prisma.CrmTaskUpdateInput) {
    return prisma.crmTask.update({ where: { id }, data });
  },

  // Notes
  async createNote(data: Prisma.CrmNoteCreateInput) {
    return prisma.crmNote.create({ data });
  },

  // Calls
  async createCall(data: Prisma.CrmCallCreateInput) {
    return prisma.crmCall.create({ data });
  },

  // Activity Log
  async createActivityLog(data: Prisma.CrmActivityLogCreateInput) {
    return prisma.crmActivityLog.create({ data });
  },
};
