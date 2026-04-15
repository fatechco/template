"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import FlashCountdown from "./FlashCountdown";

const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function FlashDealCard({ deal }) {
  const [qty, setQty] = useState(deal.minimumOrderQty || 10);
  const [saved, setSaved] = useState(false);
  const stockPct = deal.totalStockAvailable > 0 ? (deal.stockRemaining / deal.totalStockAvailable) * 100 : 50;
  const almostGone = stockPct < 20;
  const endsHrs = (new Date(deal.dealEndsAt) - Date.now()) / 3600000;
  const urgencyColor = endsHrs < 2 ? "bg-red-500" : endsHrs < 12 ? "bg-orange-500" : "bg-green-500";
  const savings = (deal.originalPrice - deal.dealPrice) * qty;

  return (
    <Link href={`/kemetro/flash/deal/${deal.id}`} className="block group" onClick={e => e.stopPropagation()}>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 group-hover:-translate-y-1">
        {/* Countdown strip */}
        <div className={`${urgencyColor} px-3 py-1.5 flex items-center justify-between`}>
          <FlashCountdown endsAt={deal.dealEndsAt} small />
          {deal.isBestSeller && <span className="text-white text-[10px] font-black bg-white/20 px-2 py-0.5 rounded-full">🔥 BEST SELLER</span>}
        </div>

        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <img src={deal.productImages?.[0] || "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&q=80"} alt={deal.productName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          {/* Badges */}
          <div className="absolute top-2 left-2 flex flex-col gap-1">
            <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">⚡ FLASH</span>
            {almostGone && <span className="bg-red-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">ALMOST GONE!</span>}
            {deal.isNewArrival && <span className="bg-teal-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full">NEW!</span>}
          </div>
          {/* Discount badge */}
          <div className="absolute top-2 right-2 w-12 h-12 bg-red-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-black text-xs leading-tight text-center">-{deal.discountPercent}%</span>
          </div>
          {/* Stock bar */}
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-2 py-1">
            <div className="flex items-center justify-between text-white text-[10px] mb-1">
              <span>{fmt(deal.stockRemaining)} {deal.unit} remaining</span>
              <span>{Math.round(stockPct)}%</span>
            </div>
            <div className="h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${stockPct}%` }} />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-3">
          <span className="text-[10px] font-bold text-teal-600 uppercase tracking-wider">{deal.category}</span>
          <h3 className="font-black text-gray-900 text-sm leading-tight mt-0.5 line-clamp-2">{deal.productName}</h3>
          {deal.specifications && (
            <p className="text-gray-400 text-[11px] mt-0.5 truncate">
              {Object.entries(deal.specifications).slice(0, 2).map(([k, v]) => `${v}`).join(" | ")}
            </p>
          )}

          {/* Price */}
          <div className="mt-2 flex items-end gap-2">
            <span className="text-2xl font-black text-red-600">{fmt(deal.dealPrice)}</span>
            <div>
              <p className="text-gray-400 text-xs line-through">{fmt(deal.originalPrice)} EGP</p>
              <p className="text-[10px] text-gray-500">per {deal.unit}</p>
            </div>
          </div>
          <p className="text-green-600 text-xs font-bold mt-0.5">Save {fmt(deal.originalPrice - deal.dealPrice)} EGP / {deal.unit}</p>

          {/* Seller */}
          <div className="flex items-center gap-1 mt-1.5">
            <div className="w-4 h-4 bg-orange-100 rounded-full flex items-center justify-center text-[8px] font-black text-orange-600">K</div>
            <span className="text-[11px] text-gray-500 truncate">{deal.sellerName}</span>
            <span className="text-[11px] text-yellow-500 ml-auto">⭐ {deal.sellerRating}</span>
          </div>

          {/* Min order */}
          <p className="text-[10px] text-gray-400 mt-1">Min: {deal.minimumOrderQty} {deal.unit}{deal.maximumOrderQtyPerBuyer ? ` | Max: ${deal.maximumOrderQtyPerBuyer}` : ""}</p>

          {/* Delivery */}
          <p className="text-[10px] text-gray-500 mt-0.5">
            {deal.deliveryLeadDays ? `🚚 ${deal.deliveryLeadDays}-${deal.deliveryLeadDays + 2} days delivery` : "🏪 Pickup available"}
          </p>
        </div>

        {/* Action row */}
        <div className="px-3 pb-3 space-y-2" onClick={e => e.preventDefault()}>
          <div className="flex items-center gap-2">
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
              <button onClick={() => setQty(q => Math.max(deal.minimumOrderQty || 1, q - 5))} className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold">−</button>
              <span className="px-3 py-1 text-sm font-black text-gray-900">{qty}</span>
              <button onClick={() => setQty(q => q + 5)} className="px-2 py-1 text-gray-600 hover:bg-gray-100 text-sm font-bold">+</button>
            </div>
            <span className="text-xs text-gray-400">{deal.unit}</span>
            <button onClick={() => setSaved(s => !s)} className="ml-auto p-1.5 rounded-full hover:bg-red-50 transition-colors">
              <Heart size={16} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
            </button>
          </div>
          <Link href={`/kemetro/flash/deal/${deal.id}`} className="block w-full bg-red-600 hover:bg-red-500 text-white font-black py-2.5 rounded-xl text-sm text-center transition-colors">
            ⚡ Order Now
          </Link>
        </div>

        {/* Social proof */}
        <div className="px-3 pb-2">
          {deal.totalOrders > 50
            ? <p className="text-[10px] text-gray-400 text-center">🔥 {deal.totalOrders} orders in last hour</p>
            : almostGone
            ? <p className="text-[10px] text-red-500 font-bold text-center animate-pulse">Only {deal.stockRemaining} left!</p>
            : <p className="text-[10px] text-gray-400 text-center">👀 {Math.round(deal.stockRemaining / 10)} people viewing now</p>}
        </div>
      </div>
    </Link>
  );
}