"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Shield, Users, Lock, Settings } from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  super_admin: "border-red-200 bg-red-50", admin: "border-purple-200 bg-purple-50",
  agent: "border-blue-200 bg-blue-50", agency: "border-indigo-200 bg-indigo-50",
  developer: "border-emerald-200 bg-emerald-50", franchise_owner: "border-amber-200 bg-amber-50",
};

export default function AdminRBACRolesPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-rbac-stats"],
    queryFn: () => apiClient.get<{ totalRoles: number; totalActions: number; totalResources: number }>("/api/v1/admin/rbac/stats"),
  });

  const { data: roles, isLoading } = useQuery({
    queryKey: ["admin-rbac-roles"],
    queryFn: () => apiClient.get<any[]>("/api/v1/admin/rbac/roles"),
  });

  const roleList = roles ?? [];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Roles & Permissions</h1>
        <p className="text-sm text-slate-500 mt-1">{statsLoading ? "Loading..." : `${stats?.totalRoles ?? 0} roles, ${stats?.totalActions ?? 0} actions, ${stats?.totalResources ?? 0} resources`}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Shield, label: "Roles", value: stats?.totalRoles ?? 0 },
          { icon: Lock, label: "Actions", value: stats?.totalActions ?? 0 },
          { icon: Settings, label: "Resources", value: stats?.totalResources ?? 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white border rounded-xl p-5 flex items-center gap-3">
            <s.icon className="w-8 h-8 text-blue-500" />
            <div>
              <div className="text-2xl font-bold">{statsLoading ? <span className="inline-block w-8 h-6 bg-slate-100 rounded animate-pulse" /> : s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
        {isLoading ? Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white border rounded-xl p-5"><div className="h-16 bg-slate-100 rounded animate-pulse" /></div>
        )) : roleList.length ? roleList.map((r: any) => (
          <div key={r.id ?? r.name} className={`border rounded-xl p-5 ${ROLE_COLORS[r.slug] ?? "bg-white"}`}>
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-blue-500" />
              <span className="font-medium">{r.name}</span>
            </div>
            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{r.userCount ?? 0} users</span>
              <span className="flex items-center gap-1"><Lock className="w-3.5 h-3.5" />{r.permissionCount ?? 0} perms</span>
            </div>
          </div>
        )) : (
          <div className="col-span-full bg-white border rounded-xl p-8 text-center text-slate-400">
            <Shield className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            <p>No roles configured</p>
          </div>
        )}
      </div>
    </div>
  );
}
