"use client";
// @ts-nocheck
import { useState } from "react";
import Link from "next/link";
const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function BundleDealCard({ deal }) {
  const [expanded, setExpanded] = useState(false);
  const savings = deal.originalPrice - deal.dealPrice;
  return (
    <div className="bg-white rounded-2xl border-2 border-yellow-400 shadow-sm hover:shadow-lg transition-all overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-50 to-yellow-100 px-4 py-3 flex items-center gap-3">
        <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0">
          <img src={deal.productImages?.[0] || "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=100&q=80"} alt="" className="w-full h-full object-cover" />
        </div>
        <div>
          <span className="text-[10px] font-black text-yellow-700 bg-yellow-200 px-2 py-0.5 rounded-full">🎁 BUNDLE DEAL</span>
          <h3 className="font-black text-gray-900 text-sm mt-1">{deal.productName}</h3>
        </div>
      </div>
      <div className="p-4">
        <p className="text-xs font-bold text-gray-600 mb-2">Included items:</p>
        <div className="space-y-1 mb-3">
          {(expanded ? deal.bundleItems : deal.bundleItems?.slice(0, 3))?.map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-xs text-gray-700">
              <span className="text-green-500 font-black">✅</span>
              <span className="flex-1">{item.name}</span>
              <span className="text-gray-400 font-semibold">{item.qty} {item.unit}</span>
            </div>
          ))}
          {deal.bundleItems?.length > 3 && (
            <button onClick={() => setExpanded(e => !e)} className="text-xs text-teal-600 font-bold hover:underline">
              {expanded ? "Show less ▲" : `+${deal.bundleItems.length - 3} more items ▼`}
            </button>
          )}
        </div>
        <div className="border-t border-gray-100 pt-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm text-gray-500">Individual total:</span>
            <span className="text-sm text-gray-400 line-through">{fmt(deal.originalPrice)} EGP</span>
          </div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-bold text-gray-900">Bundle price:</span>
            <span className="text-2xl font-black text-yellow-700">{fmt(deal.dealPrice)} EGP</span>
          </div>
          <p className="text-green-600 text-sm font-bold text-right">Save {fmt(savings)} EGP ({deal.discountPercent}%)</p>
        </div>
        <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
          <span>{deal.sellerName} · ⭐ {deal.sellerRating}</span>
        </div>
        <button className="mt-3 w-full bg-yellow-500 hover:bg-yellow-400 text-white font-black py-3 rounded-xl text-sm transition-colors">
          🎁 Buy Complete Bundle
        </button>
      </div>
    </div>
  );
}