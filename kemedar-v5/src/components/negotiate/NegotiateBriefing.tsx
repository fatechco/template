// @ts-nocheck
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Info } from "lucide-react";

const STRENGTH_COLORS = {
  high: "bg-green-100 text-green-700",
  medium: "bg-orange-100 text-orange-700",
  low: "bg-gray-100 text-gray-500",
};

function MotivationMeter({ score }) {
  const pct = Math.max(0, Math.min(100, score));
  const color = pct >= 70 ? "#22c55e" : pct >= 40 ? "#f97316" : "#3b82f6";
  const label = pct >= 80 ? "Highly motivated — great time!" : pct >= 60 ? "Motivated seller" : pct >= 30 ? "Somewhat flexible" : "Not motivated — firm on price";

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-4">
      <p className="text-xs font-black text-gray-600 mb-3 uppercase tracking-wide">Seller Motivation Score</p>
      <div className="relative h-4 bg-gradient-to-r from-blue-200 via-yellow-200 to-red-300 rounded-full overflow-visible mb-2">
        <div
          className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-white shadow-md transition-all"
          style={{ left: `calc(${pct}% - 10px)`, backgroundColor: color }}
        />
      </div>
      <div className="flex justify-between text-[9px] text-gray-400 mb-2">
        <span>Not Motivated</span>
        <span>Highly Motivated</span>
      </div>
      <p className="text-sm font-black" style={{ color }}>{pct}/100 — {label}</p>
    </div>
  );
}

export default function NegotiateBriefing({ strategy, property, session }) {
  const leverageColor = strategy.negotiationLeverage === "buyer" ? "bg-green-50 border-green-200 text-green-800" :
    strategy.negotiationLeverage === "seller" ? "bg-orange-50 border-orange-200 text-orange-800" :
    "bg-blue-50 border-blue-200 text-blue-800";
  const leverageIcon = strategy.negotiationLeverage === "buyer" ? "⚖️ You Have Negotiating Leverage" :
    strategy.negotiationLeverage === "seller" ? "⚖️ Seller Has Some Leverage" : "⚖️ Balanced Market";

  const listedPrice = session?.listedPrice || property?.price_amount || 0;
  const opening = strategy.recommendedOpeningOffer || 0;
  const counterMid = Math.round(((strategy.expectedCounterMin || 0) + (strategy.expectedCounterMax || 0)) / 2);
  const walkAway = strategy.walkAwayPrice || 0;

  const fmt = (n) => n ? Number(n).toLocaleString() : "—";

  return (
    <div className="space-y-5">
      {/* Leverage Banner */}
      <div className={`border rounded-xl p-4 ${leverageColor}`}>
        <p className="font-black text-base mb-1">{leverageIcon}</p>
        <p className="text-sm leading-relaxed">{strategy.leverageExplanation}</p>
      </div>

      {/* Motivation Meter */}
      <MotivationMeter score={strategy.sellerMotivationScore || 50} />

      {/* Urgency Signals */}
      {strategy.urgencySignals?.length > 0 && (
        <div>
          <p className="text-xs font-black text-gray-500 uppercase mb-2 tracking-wide">📌 Signals We Detected</p>
          <div className="flex flex-wrap gap-2">
            {strategy.urgencySignals.map((s, i) => (
              <span key={i} className="bg-orange-100 text-orange-700 text-xs font-semibold px-3 py-1.5 rounded-full">{s}</span>
            ))}
          </div>
        </div>
      )}

      {/* 3 Price Cards */}
      <div>
        <p className="text-sm font-black text-gray-800 mb-3 flex items-center gap-2">
          <span className="w-1 h-4 bg-orange-500 rounded-full" /> 🎯 Your Recommended Strategy
        </p>
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-orange-50 border-2 border-orange-300 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-500 font-bold mb-1">Opening Offer</p>
            <p className="font-black text-orange-600 text-base leading-tight">{fmt(opening)}</p>
            <p className="text-[10px] text-gray-400">EGP</p>
            <p className="text-[9px] text-gray-500 mt-1">{strategy.openingOfferPercent || 88}% of asking</p>
            <span className="inline-block bg-green-100 text-green-700 text-[9px] font-black px-2 py-0.5 rounded-full mt-1">Start here</span>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-3 text-center">
            <p className="text-[10px] text-gray-500 font-bold mb-1">Expected Counter</p>
            <p className="font-black text-gray-700 text-sm leading-tight">{fmt(strategy.expectedCounterMin)}</p>
            <p className="text-[10px] text-gray-400">— {fmt(strategy.expectedCounterMax)} EGP</p>
            <span className="inline-block bg-gray-100 text-gray-500 text-[9px] font-black px-2 py-0.5 rounded-full mt-2">Expected range</span>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
            <p className="text-[10px] text-red-500 font-bold mb-1">Walk-Away Price</p>
            <p className="font-black text-red-600 text-base leading-tight">{fmt(walkAway)}</p>
            <p className="text-[10px] text-gray-400">EGP</p>
            <p className="text-[9px] text-red-400 mt-1 leading-tight">Don't pay more</p>
          </div>
        </div>

        {/* Visual price line */}
        {listedPrice > 0 && (
          <div className="mt-3 bg-gray-50 rounded-xl p-3">
            <div className="flex items-center justify-between text-[9px] text-gray-400 mb-1.5">
              <span>Listed: {fmt(listedPrice)}</span>
              <span className="text-orange-500 font-bold">Opening: {fmt(opening)}</span>
              <span>Walk-away: {fmt(walkAway)}</span>
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full">
              <div className="absolute h-full bg-orange-200 rounded-full" style={{ width: `${(walkAway / listedPrice) * 100}%` }} />
              <div className="absolute top-1/2 -translate-y-1/2 w-3 h-3 bg-orange-500 rounded-full border-2 border-white shadow"
                style={{ left: `${(opening / listedPrice) * 100}%`, transform: "translateX(-50%) translateY(-50%)" }} />
            </div>
          </div>
        )}
      </div>

      {/* Best Arguments */}
      {strategy.bestArguments?.length > 0 && (
        <div>
          <p className="text-sm font-black text-gray-800 mb-3">💬 Use These Arguments in Your Offer</p>
          <div className="space-y-2">
            {strategy.bestArguments.map((arg, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
                <div className="flex items-start gap-2">
                  <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 mt-0.5 ${STRENGTH_COLORS[arg.strength]}`}>
                    {(arg.strength || "").toUpperCase()}
                  </span>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-snug">{arg.argument}</p>
                    <p className="text-xs text-gray-500 italic mt-1">{arg.howToUseIt}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Payment Tip */}
      {strategy.paymentMethodTip && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-black text-blue-700 mb-1">💳 Payment Method Advantage</p>
          <p className="text-sm text-blue-800 leading-relaxed">{strategy.paymentMethodTip}</p>
        </div>
      )}

      {/* Market Context */}
      {strategy.marketContext && (
        <div className="bg-gray-50 border border-gray-100 rounded-xl p-4">
          <p className="text-xs font-black text-gray-500 mb-1">📊 Market Context</p>
          <p className="text-sm text-gray-700 leading-relaxed">{strategy.marketContext}</p>
        </div>
      )}

      {/* Red Flags */}
      {strategy.redFlags?.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4">
          <p className="text-xs font-black text-red-600 mb-2 flex items-center gap-1">
            <AlertTriangle size={12} /> Things to Watch Out For
          </p>
          {strategy.redFlags.map((f, i) => (
            <p key={i} className="text-sm text-red-700 flex items-start gap-2">⚠️ {f}</p>
          ))}
        </div>
      )}

      {/* Summary */}
      {strategy.briefingSummary && (
        <div className="border-t border-gray-100 pt-4">
          <p className="text-xs font-black text-gray-400 uppercase mb-2">Executive Summary</p>
          <p className="text-sm text-gray-700 leading-relaxed italic">{strategy.briefingSummary}</p>
        </div>
      )}
    </div>
  );
}