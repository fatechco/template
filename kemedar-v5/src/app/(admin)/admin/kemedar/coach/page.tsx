"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { BookOpen, Users, Trophy, ChevronLeft, ChevronRight, Search } from "lucide-react";

const JOURNEY_TYPES = ["First-Time Buyer", "Property Upgrader", "Investor", "Renter", "Seller", "Expat", "Kemework Pro", "Kemetro Seller"];

export default function AdminCoachPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-coach-stats"],
    queryFn: () => apiClient.get<{ journeyTypes: number; achievements: number; activeUsers: number }>("/api/v1/admin/coaching/stats"),
  });

  const { data: journeys, isLoading } = useQuery({
    queryKey: ["admin-coach-journeys", search, page],
    queryFn: () => apiClient.list<any>("/api/v1/admin/coaching/journeys", { search, page, pageSize: 20 }),
  });

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Coach Journeys</h1><p className="text-sm text-slate-500 mt-1">Manage coaching journeys, content, and achievements</p></div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: BookOpen, label: "Journey Types", value: stats?.journeyTypes ?? JOURNEY_TYPES.length },
          { icon: Trophy, label: "Achievement Types", value: stats?.achievements ?? 0 },
          { icon: Users, label: "Active Users", value: stats?.activeUsers ?? 0 },
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

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search journeys..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b"><tr>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Journey</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Users</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Completion Rate</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b"><td colSpan={4} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
            )) : journeys?.data?.length ? journeys.data.map((j: any) => (
              <tr key={j.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{j.name}</td>
                <td className="px-4 py-3">{j.userCount ?? 0}</td>
                <td className="px-4 py-3">{j.completionRate ?? 0}%</td>
                <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${j.active ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{j.active ? "Active" : "Draft"}</span></td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400"><BookOpen className="w-8 h-8 mx-auto mb-2 text-slate-300" />No journeys found</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
          <span className="text-sm text-slate-500">Page {page}{journeys?.pagination ? ` of ${journeys.pagination.totalPages}` : ""}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(page + 1)} disabled={!journeys?.pagination || page >= journeys.pagination.totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
