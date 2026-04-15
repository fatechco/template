import { apiClient } from "@/lib/api-client";

interface Permission {
  resource: string;
  action: string;
  conditions?: Record<string, any>;
}

let permissionCache: { data: Permission[]; expiresAt: number } | null = null;

export async function loadPermissions(roleKey: string): Promise<Permission[]> {
  if (permissionCache && Date.now() < permissionCache.expiresAt) return permissionCache.data;
  try {
    const permissions = await apiClient.get<Permission[]>(`/api/v1/admin/rbac/permissions?role=${roleKey}`);
    permissionCache = { data: permissions, expiresAt: Date.now() + 300000 }; // 5 min
    return permissions;
  } catch {
    return [];
  }
}

export function checkPermissionSync(
  resourceKey: string,
  actionKey: string,
  permissions: Permission[]
): boolean {
  return permissions.some(
    (p) =>
      (p.resource === resourceKey || p.resource === "*") &&
      (p.action === actionKey || p.action === "*")
  );
}

export async function checkPermission(
  resourceKey: string,
  actionKey: string,
  roleKey: string
): Promise<boolean> {
  const permissions = await loadPermissions(roleKey);
  return checkPermissionSync(resourceKey, actionKey, permissions);
}

export function clearPermissionCache() {
  permissionCache = null;
}
