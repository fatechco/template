"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import type { User } from "@/types";
import {
  Search, Filter, Download, Plus, MoreVertical, Check, X, Eye,
  Shield, UserCheck, ChevronLeft, ChevronRight
} from "lucide-react";

const ROLE_COLORS: Record<string, string> = {
  super_user: "bg-red-100 text-red-700",
  admin: "bg-purple-100 text-purple-700",
  user: "bg-slate-100 text-slate-700",
  agent: "bg-blue-100 text-blue-700",
  agency: "bg-indigo-100 text-indigo-700",
  developer: "bg-emerald-100 text-emerald-700",
  franchise_owner: "bg-amber-100 text-amber-700",
  product_seller: "bg-green-100 text-green-700",
  kemetro_seller: "bg-teal-100 text-teal-700",
  shipper: "bg-orange-100 text-orange-700",
  kemework_professional: "bg-cyan-100 text-cyan-700",
};

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", search, roleFilter, page],
    queryFn: async () => {
      const params: Record<string, any> = { page, pageSize: 20 };
      if (search) params.search = search;
      if (roleFilter) params.role = roleFilter;
      return apiClient.list<User>("/api/v1/properties", params); // TODO: /api/v1/admin/users
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Users</h1>
          <p className="text-sm text-slate-500 mt-1">Manage all platform users</p>
        </div>
        <div className="flex gap-2">
          <button className="border bg-white px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 hover:bg-slate-50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl p-4 mb-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, email, or phone..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
            />
          </div>
          <select
            value={roleFilter}
            onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
            className="border rounded-lg px-3 py-2 text-sm min-w-[160px]"
          >
            <option value="">All Roles</option>
            {Object.keys(ROLE_COLORS).map((role) => (
              <option key={role} value={role}>{role.replace(/_/g, " ")}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-500">User</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Email</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Role</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Joined</th>
                <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={6} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : (
                <tr className="border-b">
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                    User management API endpoint needed. Create /api/v1/admin/users route.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
          <div className="text-sm text-slate-500">
            Showing page {page}
          </div>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded text-sm bg-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
