"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Shield, Search, ChevronLeft, ChevronRight, FileCheck } from "lucide-react";

const LEVEL_NAMES = ["Identity", "Property", "Legal", "Inspection", "Deal"];
const LEVEL_COLORS = ["bg-slate-100", "bg-blue-50", "bg-indigo-50", "bg-purple-50", "bg-green-50"];

export default function AdminVerifyPage() {
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-verify-stats"],
    queryFn: () => apiClient.get<{ levels: number[]; pendingDocuments: number }>("/api/v1/admin/verification/stats"),
  });

  const { data: documents, isLoading } = useQuery({
    queryKey: ["admin-verify-pending", page],
    queryFn: () => apiClient.list<any>("/api/v1/admin/verification/pending", { page, pageSize: 20 }),
  });

  const levelCounts = stats?.levels ?? [0, 0, 0, 0, 0];

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Verify Pro</h1><p className="text-sm text-slate-500 mt-1">5-level property verification system</p></div>

      <div className="grid md:grid-cols-5 gap-3 mb-6">
        {[1, 2, 3, 4, 5].map((level) => (
          <div key={level} className={`border rounded-xl p-4 text-center ${LEVEL_COLORS[level - 1]}`}>
            <div className="text-lg font-bold text-blue-600">Level {level}</div>
            <div className="text-xs text-slate-500 mt-1">{LEVEL_NAMES[level - 1]}</div>
            <div className="text-2xl font-bold mt-2">{statsLoading ? <span className="inline-block w-6 h-6 bg-slate-200 rounded animate-pulse" /> : levelCounts[level - 1]}</div>
            <div className="text-xs text-slate-400">properties</div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold flex items-center gap-2"><FileCheck className="w-5 h-5 text-blue-500" /> Pending Documents</h2>
          <span className="text-sm text-slate-500">{stats?.pendingDocuments ?? 0} pending</span>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b"><tr>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Property</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Document Type</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Level</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Submitted</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
          </tr></thead>
          <tbody>
            {isLoading ? Array.from({ length: 4 }).map((_, i) => (
              <tr key={i} className="border-b"><td colSpan={5} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
            )) : documents?.data?.length ? documents.data.map((d: any) => (
              <tr key={d.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{d.propertyTitle ?? d.propertyId}</td>
                <td className="px-4 py-3">{d.documentType}</td>
                <td className="px-4 py-3">Level {d.level}</td>
                <td className="px-4 py-3 text-slate-500">{d.createdAt ? new Date(d.createdAt).toLocaleDateString() : "--"}</td>
                <td className="px-4 py-3"><span className="px-2 py-0.5 rounded-full text-xs bg-amber-100 text-amber-700">Pending</span></td>
              </tr>
            )) : (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400"><Shield className="w-8 h-8 mx-auto mb-2 text-slate-300" />No pending documents</td></tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
          <span className="text-sm text-slate-500">Page {page}{documents?.pagination ? ` of ${documents.pagination.totalPages}` : ""}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(page + 1)} disabled={!documents?.pagination || page >= documents.pagination.totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
