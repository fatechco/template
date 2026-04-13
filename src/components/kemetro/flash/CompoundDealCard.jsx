import { useState } from "react";
import { Link } from "react-router-dom";
import FlashCountdown from "./FlashCountdown";

const fmt = n => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function CompoundDealCard({ deal, onJoin }) {
  const [qty, setQty] = useState(deal.suggestedQtyPerUnit || 80);
  const currentTier = deal.priceTiers?.[deal.currentTierIndex] || deal.priceTiers?.[0] || {};
  const nextTier = deal.priceTiers?.[deal.currentTierIndex + 1];
  const maxParticipants = deal.priceTiers?.[deal.priceTiers.length - 1]?.minParticipants || 20;
  const progress = Math.min(100, (deal.currentParticipants / maxParticipants) * 100);
  const myCost = qty * (currentTier.pricePerUnit || deal.retailPricePerUnit);
  const myRetailCost = qty * deal.retailPricePerUnit;
  const mySavings = myRetailCost - myCost;

  return (
    <div className="bg-white rounded-2xl border-l-4 border-teal-500 shadow-sm hover:shadow-lg transition-all overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-xl overflow-hidden flex-shrink-0">
            <img src={deal.productImage || "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=100&q=80"} alt="" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 text-sm leading-tight truncate">{deal.productName}</p>
            <p className="text-teal-600 font-bold text-xs mt-0.5">🏘 {deal.compoundName}</p>
            <p className="text-gray-400 text-[11px]">📍 {deal.districtName}, {deal.cityName}</p>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xs text-gray-400">Closes in</p>
            <p className="text-xs font-bold text-orange-600">
              <FlashCountdown endsAt={deal.dealClosingAt} small />
            </p>
          </div>
        </div>
      </div>

      {/* Progress */}
      <div className="px-4 pt-3 pb-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span className="font-bold text-gray-700">{deal.currentParticipants} / {maxParticipants}+ units joined</span>
          <span className="text-teal-600 font-black">-{currentTier.discountPercent}% NOW</span>
        </div>
        <div className="h-3 bg-gray-100 rounded-full overflow-hidden relative">
          <div className="h-full bg-teal-500 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          {/* Tier markers */}
          {deal.priceTiers?.map((tier, i) => {
            const markerPct = (tier.minParticipants / maxParticipants) * 100;
            return (
              <div key={i} className="absolute top-0 bottom-0 w-0.5 bg-white/50" style={{ left: `${markerPct}%` }} />
            );
          })}
        </div>
        {/* Tier labels */}
        <div className="flex justify-between mt-1">
          {deal.priceTiers?.map((tier, i) => (
            <div key={i} className={`text-[10px] font-bold ${i <= deal.currentTierIndex ? "text-teal-600" : "text-gray-400"}`}>
              {tier.minParticipants}: -{tier.discountPercent}%
            </div>
          ))}
        </div>
        {nextTier && (
          <p className="text-xs text-teal-700 bg-teal-50 rounded-lg px-2 py-1 mt-2 font-semibold">
            🎉 Next tier at <strong>{nextTier.minParticipants - deal.currentParticipants} more units</strong>: -{nextTier.discountPercent}%
          </p>
        )}
      </div>

      {/* Pricing table */}
      <div className="px-4 pb-3">
        <table className="w-full text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="py-1 px-2 text-left text-gray-500 font-bold">Participants</th>
              <th className="py-1 px-2 text-right text-gray-500 font-bold">Price</th>
              <th className="py-1 px-2 text-right text-gray-500 font-bold">Savings</th>
            </tr>
          </thead>
          <tbody>
            {deal.priceTiers?.map((tier, i) => (
              <tr key={i} className={`border-t border-gray-50 ${i === deal.currentTierIndex ? "bg-teal-50" : ""}`}>
                <td className="py-1 px-2 font-semibold">{tier.minParticipants}+ units {i === deal.currentTierIndex && <span className="text-teal-600 text-[10px]">← NOW</span>}</td>
                <td className="py-1 px-2 text-right font-black text-gray-900">{fmt(tier.pricePerUnit)} EGP</td>
                <td className="py-1 px-2 text-right text-green-600 font-bold">-{tier.discountPercent}%</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Join section */}
      <div className="px-4 pb-4 border-t border-gray-100 pt-3">
        <p className="text-xs font-bold text-gray-700 mb-2">Your quantity needed:</p>
        <div className="flex items-center gap-3 mb-2">
          <div className="flex items-center border-2 border-teal-200 rounded-xl overflow-hidden">
            <button onClick={() => setQty(q => Math.max(10, q - 10))} className="px-3 py-2 text-teal-600 hover:bg-teal-50 font-black">−</button>
            <span className="px-4 py-2 font-black text-gray-900 text-lg">{qty}</span>
            <button onClick={() => setQty(q => q + 10)} className="px-3 py-2 text-teal-600 hover:bg-teal-50 font-black">+</button>
          </div>
          <span className="text-gray-500 text-sm">{deal.unit}</span>
          <div className="ml-auto text-right">
            <p className="text-lg font-black text-teal-700">{fmt(myCost)} EGP</p>
            <p className="text-xs text-green-600 font-bold">Save {fmt(mySavings)} EGP</p>
          </div>
        </div>
        <button onClick={onJoin} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black py-3 rounded-xl transition-colors text-sm">
          🏘 Join This Group Buy
        </button>
        <div className="flex gap-2 mt-2">
          <a href={deal.groupWhatsAppLink || "#"} className="flex-1 text-center text-xs bg-green-50 text-green-700 border border-green-200 font-bold py-2 rounded-xl hover:bg-green-100 transition-colors">💬 WhatsApp Group</a>
          <Link to={`/kemetro/flash/compound/${deal.id}`} className="flex-1 text-center text-xs border border-gray-200 text-gray-600 font-bold py-2 rounded-xl hover:bg-gray-50 transition-colors">👁 Details</Link>
        </div>
      </div>
    </div>
  );
}