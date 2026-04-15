"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Truck, Search, ChevronLeft, ChevronRight, Package } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  active: "bg-green-100 text-green-700", pending: "bg-amber-100 text-amber-700",
  suspended: "bg-red-100 text-red-700", inactive: "bg-slate-100 text-slate-600",
};

export default function AdminKemetroShippersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-shippers-stats"],
    queryFn: () => apiClient.get<{ total: number; active: number; deliveriesToday: number }>("/api/v1/admin/marketplace/shippers/stats"),
  });

  const { data: shippers, isLoading } = useQuery({
    queryKey: ["admin-shippers", search, status, page],
    queryFn: () => apiClient.list<any>("/api/v1/admin/marketplace/shippers", { search, status: status || undefined, page, pageSize: 20 }),
  });

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Shippers</h1><p className="text-sm text-slate-500 mt-1">Manage delivery service providers</p></div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: Truck, label: "Total Shippers", value: stats?.total ?? 0 },
          { icon: Truck, label: "Active Now", value: stats?.active ?? 0 },
          { icon: Package, label: "Deliveries Today", value: stats?.deliveriesToday ?? 0 },
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
            <input type="text" placeholder="Search shippers..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All Statuses</option>
            {Object.keys(STATUS_COLORS).map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Shipper</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Total Deliveries</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Rating</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Earnings (EGP)</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
            </tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
              )) : shippers?.data?.length ? shippers.data.map((s: any) => (
                <tr key={s.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{s.name ?? s.email}</td>
                  <td className="px-4 py-3">{s.totalDeliveries ?? 0}</td>
                  <td className="px-4 py-3">{s.rating ? `${s.rating}/5` : "N/A"}</td>
                  <td className="px-4 py-3">{(s.earnings ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[s.status] ?? "bg-slate-100 text-slate-600"}`}>{s.status ?? "pending"}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400"><Truck className="w-8 h-8 mx-auto mb-2 text-slate-300" />No shippers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
          <span className="text-sm text-slate-500">Page {page}{shippers?.pagination ? ` of ${shippers.pagination.totalPages}` : ""}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(page + 1)} disabled={!shippers?.pagination || page >= shippers.pagination.totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
