"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Package, Search, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  pending: "bg-amber-100 text-amber-700", processing: "bg-blue-100 text-blue-700",
  shipped: "bg-indigo-100 text-indigo-700", delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-700", refunded: "bg-slate-100 text-slate-600",
};

export default function AdminKemetroOrdersPage() {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-kemetro-order-stats"],
    queryFn: () => apiClient.get<{ total: number; pending: number; processing: number; delivered: number }>("/api/v1/admin/marketplace/orders/stats"),
  });

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-kemetro-orders", search, status, page],
    queryFn: () => apiClient.list<any>("/api/v1/admin/marketplace/orders", { search, status: status || undefined, page, pageSize: 20 }),
  });

  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Kemetro Orders</h1><p className="text-sm text-slate-500 mt-1">Manage marketplace orders and fulfillment</p></div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Orders", value: stats?.total ?? 0 },
          { label: "Pending", value: stats?.pending ?? 0 },
          { label: "Processing", value: stats?.processing ?? 0 },
          { label: "Delivered", value: stats?.delivered ?? 0 },
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
            <input type="text" placeholder="Search orders..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm" />
          </div>
          <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="border rounded-lg px-3 py-2 text-sm">
            <option value="">All Statuses</option>
            {Object.keys(STATUS_COLORS).map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b"><tr>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Order ID</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Customer</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Items</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Total (EGP)</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Date</th>
            </tr></thead>
            <tbody>
              {isLoading ? Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={6} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
              )) : orders?.data?.length ? orders.data.map((o: any) => (
                <tr key={o.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono text-xs">{o.id?.slice(0, 8)}</td>
                  <td className="px-4 py-3">{o.customerName ?? "N/A"}</td>
                  <td className="px-4 py-3">{o.itemCount ?? 0}</td>
                  <td className="px-4 py-3">{(o.total ?? 0).toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs capitalize ${STATUS_COLORS[o.status] ?? "bg-slate-100 text-slate-600"}`}>{o.status}</span></td>
                  <td className="px-4 py-3 text-slate-500">{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : "--"}</td>
                </tr>
              )) : (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400"><Package className="w-8 h-8 mx-auto mb-2 text-slate-300" />No orders found</td></tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
          <span className="text-sm text-slate-500">Page {page}{orders?.pagination ? ` of ${orders.pagination.totalPages}` : ""}</span>
          <div className="flex gap-1">
            <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronLeft className="w-4 h-4" /></button>
            <button onClick={() => setPage(page + 1)} disabled={!orders?.pagination || page >= orders.pagination.totalPages} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white"><ChevronRight className="w-4 h-4" /></button>
          </div>
        </div>
      </div>
    </div>
  );
}
