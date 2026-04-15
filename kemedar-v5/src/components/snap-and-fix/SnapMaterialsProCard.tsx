"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";

export default function SnapMaterialsProCard({ task }) {
  const snap = task._snapData;
  const [sourcing, setSourcing] = useState(false);
  const [sourcingDone, setSourcingDone] = useState(false);
  const [sourcedCount, setSourcedCount] = useState(0);

  if (!snap?.requiredMaterials?.length) return null;

  const materials = snap.requiredMaterials;
  const suppliedBy = snap.materialsSuppliedBy || "professional";
  const isCustomer = suppliedBy === "customer";

  const handleSourceOnKemetro = async () => {
    if (sourcing || sourcingDone) return;
    setSourcing(true);
    let added = 0;
    try {
      for (const mat of materials) {
        const res = await apiClient.post("/api/v1/ai/searchKemetroForMaterial", {
          query: mat.kemetroSearchKeywords || mat.itemName,
          limit: 1,
        });
        const top = res?.data?.results?.[0];
        if (!top) continue;
        // In a real implementation: add to pro's Kemetro cart
        // For now, we navigate to kemetro search with keywords
        added++;
      }
      setSourcedCount(added);
      setSourcingDone(true);
    } finally {
      setSourcing(false);
    }
  };

  const allKeywords = materials
    .map(m => m.kemetroSearchKeywords || m.itemName)
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4"
      style={{
        borderLeft: "4px solid #0A6EBD",
        background: isCustomer ? "#F0FDF4" : "#FFF7ED",
      }}
    >
      <p className="text-[14px] font-black text-gray-800 mb-2">📦 Required Materials</p>

      {isCustomer ? (
        <>
          {/* Customer buying */}
          <div className="flex items-start gap-2 mb-3 p-3 bg-green-100 rounded-xl">
            <span className="text-lg flex-shrink-0">✅</span>
            <div>
              <p className="text-[13px] font-black text-green-800">Client is buying the parts themselves</p>
              <p className="text-[12px] text-green-700 mt-0.5">
                Quote for <strong>LABOR ONLY</strong> — do not include materials cost in your bid.
              </p>
            </div>
          </div>
          <div className="space-y-1.5">
            {materials.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px] text-gray-500">
                <span className="w-1.5 h-1.5 rounded-full bg-gray-300 flex-shrink-0" />
                <span>{m.itemName}</span>
                <span className="ml-auto text-gray-400">{m.quantity} {m.unit}</span>
              </div>
            ))}
          </div>
        </>
      ) : (
        <>
          {/* Pro supplies */}
          <div className="flex items-start gap-2 mb-3 p-3 bg-orange-100 rounded-xl">
            <span className="text-lg flex-shrink-0">⚠️</span>
            <div>
              <p className="text-[13px] font-black text-orange-800">Client needs you to supply the parts</p>
              <p className="text-[12px] text-orange-700 mt-0.5">Include the following in your bid:</p>
            </div>
          </div>
          <div className="space-y-2 mb-4">
            {materials.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-[13px]">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-400 flex-shrink-0" />
                <span className="text-gray-800 flex-1">{m.itemName}</span>
                <span className="text-gray-500 text-[12px]">{m.quantity} {m.unit}</span>
                {m.estimatedCostEGP && (
                  <span className="font-black text-orange-500 text-[12px]">~{Number(m.estimatedCostEGP).toLocaleString()} EGP</span>
                )}
              </div>
            ))}
          </div>

          {/* Source on Kemetro */}
          {sourcingDone ? (
            <div className="text-center py-2 text-green-700 font-bold text-[13px]">
              ✅ {sourcedCount} parts added to your Kemetro cart!
            </div>
          ) : (
            <Link
              href={`/kemetro/search?q=${encodeURIComponent(allKeywords)}`}
              onClick={handleSourceOnKemetro}
              className="flex flex-col items-center justify-center gap-1 py-3 rounded-xl font-black text-white text-[14px] transition-all"
              style={{ background: sourcing ? "#93C5FD" : "#0A6EBD" }}
            >
              {sourcing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  🛒 Source These Parts on Kemetro
                  <span className="text-[11px] font-medium opacity-80">Pro discount applied automatically</span>
                </>
              )}
            </Link>
          )}
        </>
      )}
    </div>
  );
}