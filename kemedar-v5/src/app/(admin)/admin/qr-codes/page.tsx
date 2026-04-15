"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { QrCode, Search, ChevronLeft, ChevronRight, Eye, BarChart3 } from "lucide-react";

export default function AdminQRCodesPage() {
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-qr-stats"],
    queryFn: () => apiClient.get<{ totalCodes: number; totalScans: number; activeToday: number }>("/api/v1/admin/qr/stats"),
  });

  const { data: qrCodes, isLoading } = useQuery({
    queryKey: ["admin-qr-codes", search, page],
    queryFn: () => apiClient.list<any>("/api/v1/admin/qr", { search, page, pageSize: 20 }),
  });

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">QR Codes</h1><p className="text-sm text-slate-500 mt-1">Manage QR codes and scan analytics</p></div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { icon: QrCode, label: "Total Codes", value: stats?.totalCodes ?? 0 },
          { icon: Eye, label: "Total Scans", value: stats?.totalScans ?? 0 },
          { icon: BarChart3, label: "Active Today", value: stats?.activeToday ?? 0 },
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
            <input type="text" placeholder="Search QR codes..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Code</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Type</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Target</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Scans</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Created</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
            </tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
              )) : qrCodes?.data?.length ? qrCodes.data.map((q: any) => (
                <tr key={q.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{q.id?.slice(0, 8)}</td>
                  <td className="px-4 py-3 capitalize">{q.codeType ?? "--"}</td>
                  <td className="px-4 py-3 truncate max-w-[200px]">{q.targetUrl ?? q.targetId ?? "--"}</td>
                  <td className="px-4 py-3 font-medium">{q.scanCount ?? 0}</td>
                  <td className="px-4 py-3 text-slate-500">{q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "--"}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${q.active !== false ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>{q.active !== false ? "Active" : "Inactive"}</span></td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400"><QrCode className="w-8 h-8 mx-auto mb-2 text-slate-300" />No QR codes found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
          <span className="text-sm text-slate-500">Page {page}{qrCodes?.pagination ? ` of ${qrCodes.pagination.totalPages}` : ""}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(page + 1)} disabled={!qrCodes?.pagination || page >= qrCodes.pagination.totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
