"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/lib/auth-context";
import { useCurrency } from "@/lib/currency-context";
import { apiClient } from "@/lib/api-client";
import { GitCompare, X, Plus, Bed, Bath, Maximize, MapPin } from "lucide-react";
import Link from "next/link";

export default function ComparePage() {
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const { data: favorites } = useQuery({
    queryKey: ["favorites-for-compare"],
    queryFn: () => apiClient.list<any>("/api/v1/favorites", { pageSize: 50 }),
  });

  const { data: properties, isLoading } = useQuery({
    queryKey: ["compare-properties", selectedIds],
    queryFn: async () => {
      if (selectedIds.length === 0) return [];
      const results = await Promise.all(selectedIds.map((id) => apiClient.get<any>(`/api/v1/properties/${id}`)));
      return results;
    },
    enabled: selectedIds.length > 0,
  });

  const addProperty = (id: string) => {
    if (selectedIds.length < 4 && !selectedIds.includes(id)) {
      setSelectedIds((prev) => [...prev, id]);
    }
  };

  const removeProperty = (id: string) => {
    setSelectedIds((prev) => prev.filter((i) => i !== id));
  };

  const compareProps = (properties as any[]) || [];
  const availableFavorites = (favorites?.data || []).filter((f: any) => !selectedIds.includes(f.propertyId || f.id));

  const rows = [
    { label: "Price", key: (p: any) => formatPrice(p.priceAmount) },
    { label: "Type", key: (p: any) => p.categoryName || "—" },
    { label: "Purpose", key: (p: any) => p.purposeName || "—" },
    { label: "Bedrooms", key: (p: any) => p.bedrooms ?? "—" },
    { label: "Bathrooms", key: (p: any) => p.bathrooms ?? "—" },
    { label: "Area (m2)", key: (p: any) => p.areaSize ?? "—" },
    { label: "Location", key: (p: any) => p.cityName || "—" },
    { label: "Year Built", key: (p: any) => p.yearBuilt || "—" },
    { label: "Verification", key: (p: any) => p.verificationLevel ? `Level ${p.verificationLevel}` : "—" },
  ];

  if (selectedIds.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold mb-6">Compare Properties</h1>
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <GitCompare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No properties to compare</h3>
          <p className="text-sm mt-1 mb-4">Add properties from your favorites to compare side-by-side</p>
          {availableFavorites.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center mt-4">
              {availableFavorites.slice(0, 6).map((f: any) => (
                <button key={f.id} onClick={() => addProperty(f.propertyId || f.id)} className="text-sm px-3 py-1.5 border rounded-lg hover:bg-blue-50 hover:border-blue-300 flex items-center gap-1">
                  <Plus className="w-3 h-3" /> {f.title || "Property"}
                </button>
              ))}
            </div>
          ) : (
            <Link href="/search/properties" className="text-blue-600 font-medium hover:underline">Browse Properties</Link>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Compare Properties</h1>
        {selectedIds.length < 4 && availableFavorites.length > 0 && (
          <select onChange={(e) => { if (e.target.value) addProperty(e.target.value); e.target.value = ""; }} className="border rounded-lg px-3 py-2 text-sm" defaultValue="">
            <option value="">+ Add property</option>
            {availableFavorites.map((f: any) => (
              <option key={f.id} value={f.propertyId || f.id}>{f.title || "Property"}</option>
            ))}
          </select>
        )}
      </div>

      <div className="bg-white border rounded-xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left px-4 py-3 font-medium text-slate-500 w-32">Feature</th>
              {compareProps.map((p: any) => (
                <th key={p.id} className="text-left px-4 py-3 min-w-[180px]">
                  <div className="flex items-center justify-between">
                    <Link href={`/property/${p.id}`} className="font-semibold text-blue-600 hover:underline truncate">{p.title || "Property"}</Link>
                    <button onClick={() => removeProperty(p.id)} className="p-1 hover:bg-slate-100 rounded"><X className="w-3.5 h-3.5 text-slate-400" /></button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.label} className="border-b last:border-0 hover:bg-slate-50">
                <td className="px-4 py-3 font-medium text-slate-500">{row.label}</td>
                {compareProps.map((p: any) => (
                  <td key={p.id} className="px-4 py-3">{row.key(p)}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
