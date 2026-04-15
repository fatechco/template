"use client";

import { useState } from "react";
import { useProperties, type PropertyFilters } from "@/hooks/use-properties";
import { useCurrency } from "@/lib/currency-context";
import Link from "next/link";
import type { Property } from "@/types";
import {
  Search, Filter, Eye, Edit, Trash2, Check, X, ExternalLink,
  ChevronLeft, ChevronRight, Download, MoreVertical, Building2, MapPin
} from "lucide-react";

export default function AdminPropertiesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [page, setPage] = useState(1);
  const { formatPrice } = useCurrency();

  const filters: PropertyFilters = {
    page,
    pageSize: 20,
    search: search || undefined,
    isActive: statusFilter === "active" ? true : statusFilter === "inactive" ? false : undefined,
    isImported: statusFilter === "imported" ? true : undefined,
    sortBy: "createdAt",
    sortOrder: "desc",
  };

  const { data, isLoading } = useProperties(filters);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Properties</h1>
          <p className="text-sm text-slate-500 mt-1">
            {data?.pagination?.total || 0} total properties
          </p>
        </div>
        <div className="flex gap-2">
          <button className="border bg-white px-3 py-2 rounded-lg text-sm flex items-center gap-1.5 hover:bg-slate-50">
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-1 mb-4 bg-white border rounded-lg p-1 w-fit">
        {[
          { value: "", label: "All" },
          { value: "active", label: "Active" },
          { value: "inactive", label: "Inactive" },
          { value: "imported", label: "Imported" },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={`px-4 py-1.5 rounded-md text-sm font-medium transition ${
              statusFilter === tab.value ? "bg-blue-600 text-white" : "text-slate-600 hover:bg-slate-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="bg-white border rounded-xl p-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, code, or address..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full pl-10 pr-4 py-2 border rounded-lg text-sm"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Property</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Location</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden lg:table-cell">Price</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden lg:table-cell">Views</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden xl:table-cell">Verify</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden xl:table-cell">Features</th>
                <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b">
                    <td colSpan={8} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td>
                  </tr>
                ))
              ) : data?.data?.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-400">
                    <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    No properties found
                  </td>
                </tr>
              ) : (
                data?.data?.map((p: any) => (
                  <tr key={p.id} className="border-b hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-9 rounded bg-slate-100 overflow-hidden flex-shrink-0">
                          {p.featuredImage ? (
                            <img src={p.featuredImage} alt="" className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-300 text-xs">🏠</div>
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="font-medium truncate max-w-[200px]">{p.title}</div>
                          <div className="text-xs text-slate-400">{p.propertyCode || p.id.slice(0, 8)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-slate-600 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {p.city?.name || "—"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="font-medium">{p.priceAmount ? formatPrice(p.priceAmount) : "—"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                        p.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"
                      }`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell text-slate-600">{p.viewCount || 0}</td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span className="text-xs bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded">L{p.verificationLevel || 1}</span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <div className="flex gap-1">
                        {p.isVerified && <span className="text-xs bg-green-50 text-green-600 px-1.5 py-0.5 rounded">✓ Verified</span>}
                        {p.isAuction && <span className="text-xs bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded">Auction</span>}
                        {p.isFracOffering && <span className="text-xs bg-purple-50 text-purple-600 px-1.5 py-0.5 rounded">Frac</span>}
                        {p.isOpenToSwap && <span className="text-xs bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded">Swap</span>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Link href={`/property/${p.id}`} target="_blank" className="p-1.5 text-slate-400 hover:text-blue-600">
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link href={`/admin/properties/${p.id}`} className="p-1.5 text-slate-400 hover:text-blue-600">
                          <Edit className="w-4 h-4" />
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data?.pagination && (
          <div className="flex items-center justify-between px-4 py-3 border-t bg-slate-50">
            <div className="text-sm text-slate-500">
              Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} total)
            </div>
            <div className="flex gap-1">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white hover:bg-slate-50">
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: Math.min(5, data.pagination.totalPages) }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setPage(i + 1)}
                  className={`w-8 h-8 rounded text-sm ${page === i + 1 ? "bg-blue-600 text-white" : "border bg-white hover:bg-slate-50"}`}
                >
                  {i + 1}
                </button>
              ))}
              <button onClick={() => setPage(page + 1)} disabled={page >= (data.pagination.totalPages || 1)} className="px-3 py-1 border rounded text-sm disabled:opacity-50 bg-white hover:bg-slate-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
