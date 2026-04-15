"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import MaterialProductCard from "./MaterialProductCard";

function SkeletonMini() {
  return (
    <div className="flex items-center gap-2 py-1.5 animate-pulse">
      <div className="w-10 h-10 rounded-lg bg-gray-200 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3 bg-gray-200 rounded w-2/3" />
        <div className="h-3 bg-gray-200 rounded w-1/3" />
      </div>
      <div className="w-14 h-7 bg-gray-200 rounded-xl flex-shrink-0" />
    </div>
  );
}

export default function MaterialRow({ material, index, session, onOpenSheet, onAdded }) {
  const [expanded, setExpanded] = useState(false);
  const [miniResults, setMiniResults] = useState([]);
  const [loadingMini, setLoadingMini] = useState(false);

  const handleFindOnKemetro = async () => {
    if (expanded) { setExpanded(false); return; }
    setExpanded(true);
    if (miniResults.length > 0) return;
    setLoadingMini(true);
    try {
      const res = await apiClient.post("/api/v1/ai/searchKemetroForMaterial", {
        query: material.kemetroSearchKeywords || material.itemName,
        limit: 3,
      });
      setMiniResults((res?.data?.results || []).map(p => ({
        ...p,
        _searchKeywords: material.kemetroSearchKeywords || material.itemName,
      })));
    } catch {
      setMiniResults([]);
    } finally {
      setLoadingMini(false);
    }
  };

  return (
    <div className="border-b border-gray-100 last:border-0">
      {/* Main row */}
      <div className="flex items-center gap-2 py-3">
        {/* Left: name + quantity */}
        <div className="flex-[3] min-w-0">
          <p className="text-[14px] font-bold text-gray-900 leading-snug">{material.itemName}</p>
          {material.itemNameAr && (
            <p className="text-[12px] text-gray-400 leading-snug" dir="rtl">{material.itemNameAr}</p>
          )}
          <p className="text-[12px] font-semibold text-teal-600 mt-0.5">
            {material.quantity} {material.unit}
          </p>
        </div>

        {/* Center: cost */}
        <div className="flex-[1.5] text-center">
          {material.estimatedCostEGP ? (
            <p className="text-[13px] font-black text-orange-500">
              ~{Number(material.estimatedCostEGP).toLocaleString()} EGP
            </p>
          ) : (
            <p className="text-[12px] text-gray-300">—</p>
          )}
        </div>

        {/* Right: find button */}
        <div className="flex-[1.5] flex justify-end">
          <button
            onClick={handleFindOnKemetro}
            className="text-[12px] font-bold text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg px-2.5 py-1.5 transition-colors whitespace-nowrap"
          >
            {expanded ? "▲ Hide" : "Find →"}
          </button>
        </div>
      </div>

      {/* Expanded accordion */}
      {expanded && (
        <div className="pb-3">
          <div className="bg-gray-50 rounded-xl px-3 py-2">
            {loadingMini ? (
              <div className="space-y-1">
                <SkeletonMini /><SkeletonMini /><SkeletonMini />
              </div>
            ) : miniResults.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-3">No results found</p>
            ) : (
              <div>
                {miniResults.map((p) => (
                  <div key={p.id} className="flex items-center gap-2 py-2 border-b border-gray-100 last:border-0">
                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-200 flex-shrink-0">
                      {p.featured_image || p.image ? (
                        <img src={p.featured_image || p.image} alt={p.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-lg">🔧</div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-800 line-clamp-2 leading-snug">{p.name || p.title}</p>
                      <p className="text-[12px] font-black text-orange-500">{Number(p.price || p.price_amount || 0).toLocaleString()} EGP</p>
                    </div>
                    <MaterialProductCard
                      product={p}
                      materialIndex={index}
                      session={session}
                      onAdded={(prod) => onAdded?.(index, prod)}
                    />
                  </div>
                ))}
              </div>
            )}

            <button
              onClick={() => onOpenSheet(material, index)}
              className="w-full text-center text-blue-600 font-bold text-[13px] mt-2 hover:text-blue-700"
            >
              Show all results →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}