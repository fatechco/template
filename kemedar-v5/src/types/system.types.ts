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
  value: Record<string, any> | null;
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
  oldValue: Record<string, any> | null;
  newValue: Record<string, any> | null;
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

export interface VerificationDocument {
  id: string;
  userId: string;
  documentType: string;
  fileUrl: string;
  status: string;
  reviewedById: string | null;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

export interface VerificationRecord {
  id: string;
  userId: string;
  propertyId: string | null;
  level: number;
  action: string;
  hashChain: string | null;
  previousHash: string | null;
  metaData: Record<string, any> | null;
  verifiedByUserId: string | null;
  createdAt: string;
}

export interface ServiceOrder {
  id: string;
  userId: string;
  serviceType: string;
  title: string;
  description: string | null;
  status: string;
  priorityLevel: string | null;
  assignedToId: string | null;
  estimatedCostEGP: number | null;
  actualCostEGP: number | null;
  scheduledAt: string | null;
  completedAt: string | null;
  rating: number | null;
  review: string | null;
  location: string | null;
  cityId: string | null;
  imageUrls: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PromoCode {
  id: string;
  code: string;
  discountType: string;
  discountValue: number;
  maxUses: number | null;
  usedCount: number;
  validFrom: string | null;
  validTo: string | null;
  isActive: boolean;
}

export interface FranchiseCommission {
  id: string;
  franchiseOwnerId: string;
  sourceType: string;
  sourceId: string | null;
  amountEGP: number;
  percent: number | null;
  status: string;
  paidAt: string | null;
}

export interface UsageEvent {
  id: string;
  userId: string | null;
  sessionId: string | null;
  eventType: string;
  eventData: Record<string, any> | null;
  page: string | null;
  referrer: string | null;
  createdAt: string;
}
