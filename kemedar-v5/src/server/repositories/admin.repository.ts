import prisma from "@/server/lib/prisma";
import { Prisma } from "@prisma/client";
import { buildPagination, type PaginationParams } from "./base.repository";

export const adminRepository = {
  // Users (admin version with all fields)
  async findUsers(filters: { search?: string; role?: string; isActive?: boolean } = {}, pagination: PaginationParams = {}) {
    const { skip, take, orderBy, page, pageSize } = buildPagination(pagination);
    const where: Prisma.UserWhereInput = {
      deletedAt: null,
      ...(filters.role && { role: filters.role as any }),
      ...(filters.isActive !== undefined && { isActive: filters.isActive }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: "insensitive" as const } },
          { email: { contains: filters.search, mode: "insensitive" as const } },
          { phone: { contains: filters.search, mode: "insensitive" as const } },
        ],
      }),
    };
    const [data, total] = await Promise.all([
      prisma.user.findMany({ where, skip, take, orderBy }),
      prisma.user.count({ where }),
    ]);
    return { data, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  },

  async findUserById(id: string) {
    return prisma.user.findUnique({ where: { id } });
  },

  async updateUser(id: string, data: Prisma.UserUpdateInput) {
    return prisma.user.update({ where: { id }, data });
  },

  async countUsersByRole() {
    return prisma.user.groupBy({ by: ["role"], _count: true, where: { deletedAt: null } });
  },

  // Roles & Permissions
  async findSystemRoles() {
    return prisma.systemRole.findMany({ orderBy: { name: "asc" }, include: { permissions: true } });
  },

  async createRole(data: Prisma.SystemRoleCreateInput) {
    return prisma.systemRole.create({ data });
  },

  async findPermissions(roleId?: string) {
    const where: Prisma.RolePermissionWhereInput = {
      ...(roleId && { roleId }),
    };
    return prisma.rolePermission.findMany({ where });
  },

  async createPermission(data: Prisma.RolePermissionCreateInput) {
    return prisma.rolePermission.create({ data });
  },

  async deletePermission(id: string) {
    return prisma.rolePermission.delete({ where: { id } });
  },

  // Modules
  async findModules() {
    return prisma.systemModule.findMany({ orderBy: { name: "asc" } });
  },

  async updateModule(id: string, data: Prisma.SystemModuleUpdateInput) {
    return prisma.systemModule.update({ where: { id }, data });
  },

  // Features
  async findFeatures() {
    return prisma.featureRegistry.findMany({ orderBy: { featureKey: "asc" } });
  },

  async updateFeature(id: string, data: Prisma.FeatureRegistryUpdateInput) {
    return prisma.featureRegistry.update({ where: { id }, data });
  },

  // Translations
  async findTranslations(module?: string, locale?: string) {
    const where: Prisma.TranslationWhereInput = {
      ...(module && { module }),
      ...(locale && { locale }),
    };
    return prisma.translation.findMany({ where, orderBy: { key: "asc" } });
  },

  async upsertTranslation(data: Prisma.TranslationCreateInput) {
    return prisma.translation.upsert({
      where: { module_key_locale: { module: data.module as string, key: data.key as string, locale: data.locale as string } },
      create: data,
      update: data,
    });
  },
};
