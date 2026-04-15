export interface SystemModule {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  isEnabled: boolean;
  config: Record<string, any> | null;
}

export interface ModuleConfig {
  id: string;
  moduleId: string;
  key: string;
  value: any;
}

export interface FeatureRegistry {
  id: string;
  featureKey: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  isEnabled: boolean;
  rolloutPercent: number | null;
  conditions: Record<string, any> | null;
}

export interface SystemRole {
  id: string;
  name: string;
  nameAr: string | null;
  description: string | null;
  isSystem: boolean;
  permissions?: RolePermission[];
}

export interface RolePermission {
  id: string;
  roleId: string;
  resource: string;
  action: string;
  conditions: Record<string, any> | null;
}

export interface PermissionAuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId: string | null;
  result: string;
  createdAt: string;
}

export interface Translation {
  id: string;
  key: string;
  module: string;
  locale: string;
  value: string;
  isVerified: boolean;
}

export interface QRCode {
  id: string;
  userId: string;
  codeType: string;
  targetId: string | null;
  targetUrl: string | null;
  frameText: string | null;
  qrImageUrl: string | null;
  shortCode: string | null;
  scanCount: number;
  isActive: boolean;
  createdAt: string;
}
