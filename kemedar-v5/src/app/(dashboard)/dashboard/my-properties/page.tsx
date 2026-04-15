"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useProperties } from "@/hooks/use-properties";
import { useCurrency } from "@/lib/currency-context";
import Link from "next/link";
import { Plus, Search, Eye, Edit, Trash2, MoreVertical, Check, MapPin } from "lucide-react";

export default function MyPropertiesPage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [page, setPage] = useState(1);
  const { data, isLoading } = useProperties({ userId: user?.id, page, pageSize: 10 });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Link href="/create-property" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700">
          <Plus className="w-4 h-4" /> Add Property
        </Link>
      </div>

      {isLoading ? (
        <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />)}</div>
      ) : data && data.data.length > 0 ? (
        <div className="bg-white border rounded-xl overflow-hidden">
          {data.data.map((p: any) => (
            <div key={p.id} className="flex items-center gap-4 p-4 border-b last:border-0 hover:bg-slate-50">
              <div className="w-20 h-14 rounded-lg bg-slate-100 overflow-hidden flex-shrink-0">
                {p.featuredImage ? <img src={p.featuredImage} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🏠</div>}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/property/${p.id}`} className="font-semibold text-sm hover:text-blue-600 truncate block">{p.title}</Link>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5"><MapPin className="w-3 h-3" /> {p.city?.name || "Egypt"}</p>
              </div>
              <div className="text-right hidden md:block">
                <div className="font-bold text-sm">{formatPrice(p.priceAmount)}</div>
                <div className="text-xs text-slate-500 flex items-center gap-1 justify-end"><Eye className="w-3 h-3" /> {p.viewCount || 0} views</div>
              </div>
              <div className="flex items-center gap-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${p.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                  {p.isActive ? "Active" : "Inactive"}
                </span>
                {p.isVerified && <Check className="w-4 h-4 text-green-600" />}
              </div>
              <Link href={`/property/${p.id}/edit`} className="p-2 text-slate-400 hover:text-blue-600">
                <Edit className="w-4 h-4" />
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white border rounded-xl">
          <div className="text-4xl mb-4">🏠</div>
          <h3 className="text-lg font-semibold mb-2">No properties yet</h3>
          <p className="text-slate-500 mb-4">List your first property and start reaching buyers</p>
          <Link href="/create-property" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium inline-flex items-center gap-1.5 hover:bg-blue-700">
            <Plus className="w-4 h-4" /> List Property
          </Link>
        </div>
      )}

      {/* Pagination */}
      {data && data.pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 border rounded text-sm disabled:opacity-50">Prev</button>
          <span className="px-3 py-1.5 text-sm">Page {page} of {data.pagination.totalPages}</span>
          <button onClick={() => setPage((p) => p + 1)} disabled={page === data.pagination.totalPages} className="px-3 py-1.5 border rounded text-sm disabled:opacity-50">Next</button>
        </div>
      )}
    </div>
  );
}
