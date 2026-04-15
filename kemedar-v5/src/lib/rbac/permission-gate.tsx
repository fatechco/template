"use client";

import { type ReactNode } from "react";
import { useAuth } from "@/lib/auth-context";

interface PermissionGateProps {
  resource: string;
  action?: string;
  roles?: string[];
  fallback?: ReactNode;
  children: ReactNode;
}

export function PermissionGate({ resource, action = "view", roles, fallback = null, children }: PermissionGateProps) {
  const { user } = useAuth();

  if (!user) return <>{fallback}</>;

  // Admin/super_user always has access
  if (user.role === "super_user" || user.role === "admin") return <>{children}</>;

  // Role-based check
  if (roles && !roles.includes(user.role)) return <>{fallback}</>;

  return <>{children}</>;
}
