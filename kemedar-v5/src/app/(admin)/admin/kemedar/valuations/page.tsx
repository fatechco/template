"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { TrendingUp, Search, ChevronLeft, ChevronRight } from "lucide-react";

const GRADE_COLORS: Record<string, string> = {
  A: "bg-green-100 text-green-700", B: "bg-blue-100 text-blue-700", C: "bg-amber-100 text-amber-700", D: "bg-red-100 text-red-700",
};

export default function AdminValuationsPage() {
  const [search, setSearch] = useState("");
  const [method, setMethod] = useState("");
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-valuation-stats"],
    queryFn: () => apiClient.get<{ totalValuations: number; aiEstimates: number; adminOverrides: number }>("/api/v1/admin/valuations/stats"),
  });

  const { data: valuations, isLoading } = useQuery({
    queryKey: ["admin-valuations", search, method, page],
    queryFn: () => apiClient.list<any>("/api/v1/admin/valuations", { search, method: method || undefined, page, pageSize: 20 }),
  });

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Property Valuations</h1><p className="text-sm text-slate-500 mt-1">AI-powered and admin-set valuations</p></div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Total Valuations", value: stats?.totalValuations ?? 0 },
          { label: "AI Estimates", value: stats?.aiEstimates ?? 0 },
          { label: "Admin Overrides", value: stats?.adminOverrides ?? 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white border rounded-xl p-5">
            <div className="text-2xl font-bold">{statsLoading ? <span className="inline-block w-8 h-6 bg-slate-100 rounded animate-pulse" /> : s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b flex flex-col md:flex-row gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search properties..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
          </div>
          <select value={method} onChange={(e) => { setMethod(e.target.value); setPage(1); }} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All Methods</option>
            <option value="ai">AI Estimate</option>
            <option value="admin">Admin Override</option>
            <option value="market">Market Comp</option>
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Property</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Amount (EGP)</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Method</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Grade</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Date</th>
            </tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
              )) : valuations?.data?.length ? valuations.data.map((v: any) => (
                <tr key={v.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">{v.propertyTitle ?? v.propertyId}</td>
                  <td className="px-4 py-3">{(v.amount ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3 capitalize">{v.method ?? "ai"}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${GRADE_COLORS[v.grade] ?? "bg-slate-100 text-slate-600"}`}>{v.grade ?? "--"}</span></td>
                  <td className="px-4 py-3 text-slate-500">{v.createdAt ? new Date(v.createdAt).toLocaleDateString() : "--"}</td>
                </tr>
              )) : (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400"><TrendingUp className="w-8 h-8 mx-auto mb-2 text-slate-300" />No valuations found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
          <span className="text-sm text-slate-500">Page {page}{valuations?.pagination ? ` of ${valuations.pagination.totalPages}` : ""}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(page + 1)} disabled={!valuations?.pagination || page >= valuations.pagination.totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
