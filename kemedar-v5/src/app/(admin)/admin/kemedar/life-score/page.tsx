"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { MapPin, Search, ChevronLeft, ChevronRight } from "lucide-react";

const DIMENSIONS = ["Walkability", "Noise", "Safety", "Education", "Healthcare", "Connectivity", "Green Space", "Convenience"];

export default function AdminLifeScorePage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-lifescore-stats"],
    queryFn: () => apiClient.get<{ scoredNeighborhoods: number; avgScore: number; pendingScoring: number }>("/api/v1/admin/life-score/stats"),
  });

  const { data: neighborhoods, isLoading } = useQuery({
    queryKey: ["admin-lifescore-neighborhoods", search, page],
    queryFn: () => apiClient.list<any>("/api/v1/admin/life-score/neighborhoods", { search, page, pageSize: 20 }),
  });

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Life Score</h1><p className="text-sm text-slate-500 mt-1">Neighborhood quality scoring -- 8 dimensions</p></div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { label: "Scored Neighborhoods", value: stats?.scoredNeighborhoods ?? 0 },
          { label: "Avg Life Score", value: stats?.avgScore ? `${stats.avgScore}/100` : "N/A" },
          { label: "Pending Scoring", value: stats?.pendingScoring ?? 0 },
        ].map((s) => (
          <div key={s.label} className="bg-white border rounded-xl p-5">
            <div className="text-2xl font-bold">{statsLoading ? <span className="inline-block w-12 h-6 bg-slate-100 rounded animate-pulse" /> : s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-4 lg:grid-cols-8 gap-2 mb-6">
        {DIMENSIONS.map((d) => (
          <div key={d} className="bg-white border rounded-lg p-3 text-center">
            <div className="text-xs font-medium text-slate-600">{d}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Search neighborhoods..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
          </div>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b"><tr>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Neighborhood</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">City</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Life Score</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Last Updated</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b"><td colSpan={4} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
            )) : neighborhoods?.data?.length ? neighborhoods.data.map((n: any) => (
              <tr key={n.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{n.name}</td>
                <td className="px-4 py-3">{n.city}</td>
                <td className="px-4 py-3"><span className={`font-semibold ${(n.score ?? 0) >= 70 ? "text-green-600" : (n.score ?? 0) >= 40 ? "text-amber-600" : "text-red-600"}`}>{n.score ?? "N/A"}</span></td>
                <td className="px-4 py-3 text-slate-500">{n.updatedAt ? new Date(n.updatedAt).toLocaleDateString() : "--"}</td>
              </tr>
            )) : (
              <tr><td colSpan={4} className="px-4 py-8 text-center text-slate-400"><MapPin className="w-8 h-8 mx-auto mb-2 text-slate-300" />No neighborhoods found</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
          <span className="text-sm text-slate-500">Page {page}{neighborhoods?.pagination ? ` of ${neighborhoods.pagination.totalPages}` : ""}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(page + 1)} disabled={!neighborhoods?.pagination || page >= neighborhoods.pagination.totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
