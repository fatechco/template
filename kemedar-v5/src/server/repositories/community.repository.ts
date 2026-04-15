import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const communityRepository = {
  async findById(id: string) {
    return prisma.community.findUnique({ where: { id }, include: { members: { take: 10, include: { user: { select: { id: true, name: true, avatarUrl: true } } } } } });
  },

  async findMany(filters: { cityId?: string; type?: string; isPublic?: boolean } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.CommunityWhereInput = {
      isActive: true,
      ...(filters.cityId && { cityId: filters.cityId }),
      ...(filters.type && { type: filters.type as any }),
      ...(filters.isPublic !== undefined && { isPublic: filters.isPublic }),
    };
    const [data, total] = await Promise.all([
      prisma.community.findMany({ where, skip, take, orderBy }),
      prisma.community.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async create(data: Prisma.CommunityCreateInput) {
    return prisma.community.create({ data });
  },

  async update(id: string, data: Prisma.CommunityUpdateInput) {
    return prisma.community.update({ where: { id }, data });
  },

  // Members
  async addMember(data: Prisma.CommunityMemberCreateInput) {
    return prisma.communityMember.create({ data });
  },

  async findMembership(communityId: string, userId: string) {
    return prisma.communityMember.findUnique({ where: { communityId_userId: { communityId, userId } } });
  },

  async removeMember(communityId: string, userId: string) {
    return prisma.communityMember.update({ where: { communityId_userId: { communityId, userId } }, data: { leftAt: new Date() } });
  },

  // Posts
  async createPost(data: Prisma.CommunityPostCreateInput) {
    return prisma.communityPost.create({ data });
  },

  async findPosts(communityId: string, pagination: PaginationParams = {}) {
    const { skip, take, page, pageSize } = buildPagination(pagination);
    const where: Prisma.CommunityPostWhereInput = { communityId, deletedAt: null };
    const [data, total] = await Promise.all([
      prisma.communityPost.findMany({ where, skip, take, orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }], include: { author: { select: { id: true, name: true, avatarUrl: true } }, comments: { take: 3, orderBy: { createdAt: "desc" } } } }),
      prisma.communityPost.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async updatePost(id: string, data: Prisma.CommunityPostUpdateInput) {
    return prisma.communityPost.update({ where: { id }, data });
  },

  // Comments
  async createComment(data: Prisma.CommunityCommentCreateInput) {
    return prisma.communityComment.create({ data });
  },

  // Events
  async createEvent(data: Prisma.CommunityEventCreateInput) {
    return prisma.communityEvent.create({ data });
  },

  async findEvents(communityId: string) {
    return prisma.communityEvent.findMany({ where: { communityId }, orderBy: { startAt: "asc" } });
  },

  // Alerts
  async createAlert(data: Prisma.CommunityAlertCreateInput) {
    return prisma.communityAlert.create({ data });
  },

  async findActiveAlerts(communityId: string) {
    return prisma.communityAlert.findMany({ where: { communityId, isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }] } });
  },
};
