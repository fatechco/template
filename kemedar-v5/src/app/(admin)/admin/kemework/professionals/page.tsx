"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Users, Search, ChevronLeft, ChevronRight, Wrench, Star } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700", pending: "bg-amber-100 text-amber-700",
  suspended: "bg-red-100 text-red-700", inactive: "bg-slate-100 text-slate-600",
};

export default function AdminKemeworkProfessionalsPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-professionals-stats"],
    queryFn: () => apiClient.get<{ total: number; active: number; pendingAccreditation: number }>("/api/v1/admin/kemework/professionals/stats"),
  });

  const { data: professionals, isLoading } = useQuery({
    queryKey: ["admin-professionals", search, status, page],
    queryFn: () => apiClient.list<any>("/api/v1/admin/kemework/professionals", { search, status: status || undefined, page, pageSize: 20 }),
  });

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Kemework Professionals</h1><p className="text-sm text-slate-500 mt-1">Manage service professionals and accreditation</p></div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Users, label: "Total Professionals", value: stats?.total ?? 0 },
          { icon: Wrench, label: "Active", value: stats?.active ?? 0 },
          { icon: Star, label: "Pending Accreditation", value: stats?.pendingAccreditation ?? 0 },
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
        <div className="p-4 border-b flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search professionals..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All Statuses</option>
            {Object.keys(STATUS_COLORS).map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Professional</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Service Type</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Rating</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Jobs Completed</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
            </tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
              )) : professionals?.data?.length ? professionals.data.map((p: any) => (
                <tr key={p.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{p.name ?? p.email}</td>
                  <td className="px-4 py-3 capitalize">{p.serviceType ?? "--"}</td>
                  <td className="px-4 py-3">{p.rating ? `${p.rating}/5` : "N/A"}</td>
                  <td className="px-4 py-3">{p.jobsCompleted ?? 0}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[p.status] ?? "bg-slate-100 text-slate-600"}`}>{p.status ?? "pending"}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400"><Users className="w-8 h-8 mx-auto mb-2 text-slate-300" />No professionals found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
          <span className="text-sm text-slate-500">Page {page}{professionals?.pagination ? ` of ${professionals.pagination.totalPages}` : ""}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(page + 1)} disabled={!professionals?.pagination || page >= professionals.pagination.totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
