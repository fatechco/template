"use client";

import { useState } from "react";
import { Layers, Plus, X, Home, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function TwinPage() {
  const [propertyIds, setPropertyIds] = useState<string[]>(["", ""]);
  const [comparison, setComparison] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleCompare = async () => {
    const ids = propertyIds.filter(Boolean);
    if (ids.length < 2) return;
    setLoading(true);
    try {
      const res = await apiClient.post<any>("/api/v1/properties/compare", { propertyIds: ids });
      setComparison(res);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const updateId = (index: number, value: string) => {
    const updated = [...propertyIds];
    updated[index] = value;
    setPropertyIds(updated);
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="text-center mb-8">
        <Layers className="w-12 h-12 text-indigo-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">Digital Twin</h1>
        <p className="text-slate-500 mt-2">Compare properties side by side with detailed analysis</p>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <h3 className="font-bold mb-4">Select Properties to Compare</h3>
        <div className="space-y-3">
          {propertyIds.map((id, i) => (
            <div key={i} className="flex gap-2">
              <input type="text" value={id} onChange={(e) => updateId(i, e.target.value)} placeholder={`Property ID ${i + 1}`} className="flex-1 px-3 py-2 border rounded-lg text-sm" />
              {i > 1 && (
                <button onClick={() => setPropertyIds(propertyIds.filter((_, j) => j !== i))} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-4">
          {propertyIds.length < 4 && (
            <button onClick={() => setPropertyIds([...propertyIds, ""])} className="text-sm text-indigo-600 flex items-center gap-1 hover:underline">
              <Plus className="w-3 h-3" />Add property
            </button>
          )}
          <button onClick={handleCompare} disabled={loading || propertyIds.filter(Boolean).length < 2} className="ml-auto bg-indigo-600 text-white px-6 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 disabled:opacity-50">
            {loading ? "Comparing..." : "Compare"}
          </button>
        </div>
      </div>

      {comparison ? (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-bold mb-4">Comparison Results</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {(comparison.properties || []).map((p: any, i: number) => (
              <div key={i} className="border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Home className="w-5 h-5 text-indigo-600" />
                  <h4 className="font-bold">{p.title || `Property ${i + 1}`}</h4>
                </div>
                <div className="space-y-2 text-sm text-slate-600">
                  <div className="flex justify-between"><span>Price</span><span className="font-medium">{p.priceEGP?.toLocaleString() || "—"} EGP</span></div>
                  <div className="flex justify-between"><span>Size</span><span className="font-medium">{p.sizeSqm || "—"} sqm</span></div>
                  <div className="flex justify-between"><span>Bedrooms</span><span className="font-medium">{p.bedrooms || "—"}</span></div>
                  <div className="flex justify-between"><span>Location</span><span className="font-medium">{p.location || "—"}</span></div>
                </div>
              </div>
            ))}
          </div>
          {comparison.recommendation && (
            <div className="mt-4 p-4 bg-indigo-50 rounded-lg text-sm text-indigo-800">
              <strong>AI Recommendation:</strong> {comparison.recommendation}
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center text-slate-400">
          <Layers className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm">Enter property IDs above to start comparing</p>
        </div>
      )}
    </div>
  );
}
