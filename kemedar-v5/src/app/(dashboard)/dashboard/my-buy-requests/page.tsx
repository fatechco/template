"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { apiClient } from "@/lib/api-client";
import { FileText, Plus, MapPin, ChevronLeft, ChevronRight } from "lucide-react";

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-amber-100 text-amber-700",
  matched: "bg-blue-100 text-blue-700",
  closed: "bg-slate-100 text-slate-500",
};

export default function MyBuyRequestsPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ["buy-requests", page],
    queryFn: () => apiClient.list<any>("/api/v1/buy-requests", { page, pageSize: 10 }),
  });

  if (isLoading) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">My Buy Requests</h1>
        <div className="space-y-3 animate-pulse">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white border rounded-xl p-4 h-24" />
          ))}
        </div>
      </div>
    );
  }

  const requests = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Buy Requests</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No buy requests</h3>
          <p className="text-sm mt-1">Post a buy request to let agents know what you need</p>
        </div>
      ) : (
        <>
          <div className="space-y-3">
            {requests.map((req: any) => (
              <div key={req.id} className="bg-white border rounded-xl p-4 hover:shadow-sm transition">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-sm">{req.title || req.categoryName || "Buy Request"}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[req.status] || "bg-slate-100 text-slate-500"}`}>
                        {req.status}
                      </span>
                    </div>
                    {req.cityName && (
                      <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{req.cityName}</p>
                    )}
                    <div className="flex gap-4 mt-2 text-xs text-slate-500">
                      {req.minBudget != null && req.maxBudget != null && (
                        <span>Budget: {formatPrice(req.minBudget)} - {formatPrice(req.maxBudget)}</span>
                      )}
                      {req.minArea != null && <span>Min area: {req.minArea} m2</span>}
                      {req.matchCount != null && <span>{req.matchCount} matches</span>}
                    </div>
                  </div>
                  <span className="text-xs text-slate-400">{req.createdAt ? new Date(req.createdAt).toLocaleDateString() : ""}</span>
                </div>
              </div>
            ))}
          </div>
          {pagination && pagination.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page <= 1} className="p-2 border rounded-lg disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
              <span className="text-sm text-slate-500">Page {page} of {pagination.totalPages}</span>
              <button onClick={() => setPage((p) => p + 1)} disabled={page >= pagination.totalPages} className="p-2 border rounded-lg disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
