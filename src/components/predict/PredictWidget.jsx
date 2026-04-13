import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, TrendingDown, Minus, Info, Bell, ChevronDown, ChevronUp } from "lucide-react";

const GRADE_CONFIG = {
  strong_buy: { label: "Strong Buy", color: "bg-emerald-700 text-white" },
  buy_now:    { label: "Buy Now",    color: "bg-green-500 text-white" },
  hold:       { label: "Hold",       color: "bg-orange-500 text-white" },
  wait:       { label: "Wait",       color: "bg-yellow-500 text-white" },
  avoid:      { label: "Avoid",      color: "bg-red-600 text-white" },
};

const TREND_BANNER = {
  strong_rise:     { msg: "RISING MARKET — Predicted", color: "bg-green-600 text-white", icon: <TrendingUp size={14} /> },
  moderate_rise:   { msg: "RISING MARKET — Predicted", color: "bg-green-500 text-white", icon: <TrendingUp size={14} /> },
  stable:          { msg: "STABLE MARKET — Prices expected to hold steady", color: "bg-blue-500 text-white", icon: <Minus size={14} /> },
  moderate_decline:{ msg: "COOLING MARKET — Some downward pressure expected", color: "bg-red-500 text-white", icon: <TrendingDown size={14} /> },
  strong_decline:  { msg: "COOLING MARKET — Some downward pressure expected", color: "bg-red-700 text-white", icon: <TrendingDown size={14} /> },
};

export default function PredictWidget({ cityId, districtId, areaId, locationLabel, compact = false }) {
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(!compact);
  const [showInfo, setShowInfo] = useState(false);
  const [langAr, setLangAr] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const all = await base44.entities.PricePrediction.filter({ isPublished: true });
        const match = all.find(p =>
          (areaId && p.areaId === areaId) ||
          (districtId && p.districtId === districtId) ||
          (cityId && p.cityId === cityId) ||
          (locationLabel && p.locationLabel === locationLabel)
        );
        if (!match && all.length > 0) {
          // fallback: use any published prediction for demo
          setPrediction(all[0]);
        } else {
          setPrediction(match || null);
        }
      } catch(e) {}
      setLoading(false);
    };
    fetch();
  }, [cityId, districtId, areaId, locationLabel]);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
        <div className="h-4 bg-gray-100 rounded w-1/2 mb-3" />
        <div className="h-20 bg-gray-100 rounded mb-3" />
        <div className="h-4 bg-gray-100 rounded w-3/4" />
      </div>
    );
  }

  if (!prediction) return null;

  const p12 = prediction.prediction12Months;
  const p6 = prediction.prediction6Months;
  const p24 = prediction.prediction24Months;
  const p36 = prediction.prediction36Months;
  const gCfg = GRADE_CONFIG[prediction.investmentGrade] || GRADE_CONFIG.hold;
  const tBanner = TREND_BANNER[prediction.overallTrend] || TREND_BANNER.stable;
  const up = (p12?.changePercent || 0) >= 0;

  if (compact && !expanded) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📈</span>
            <div>
              <p className="font-black text-gray-900 text-sm">Kemedar Predict™</p>
              <p className="text-xs text-gray-400">{prediction.locationLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${gCfg.color}`}>{gCfg.label}</span>
            <span className={`text-base font-black ${up ? 'text-green-600' : 'text-red-600'}`}>
              {up ? '+' : ''}{p12?.changePercent?.toFixed(1)}%
            </span>
            <button onClick={() => setExpanded(true)} className="text-gray-400 hover:text-orange-500">
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">📈</span>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-gray-900 text-lg">Kemedar Predict™</h3>
                <span className="text-[10px] bg-purple-100 text-purple-700 font-black px-2 py-0.5 rounded-full">✨ AI-Powered</span>
              </div>
              <p className="text-xs text-gray-400">AI price forecast for {prediction.locationLabel || locationLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <button onClick={() => setShowInfo(!showInfo)} className="w-6 h-6 rounded-full bg-gray-100 text-gray-400 hover:text-gray-700 flex items-center justify-center text-xs font-bold">
                i
              </button>
              {showInfo && (
                <div className="absolute right-0 top-8 w-72 bg-white border border-gray-200 rounded-xl shadow-lg p-3 z-10 text-xs text-gray-500 leading-relaxed">
                  Kemedar Predict™ forecasts are AI estimates based on historical data and market signals. Not financial advice. Consult a qualified advisor before investing.
                </div>
              )}
            </div>
            {compact && (
              <button onClick={() => setExpanded(false)} className="text-gray-400 hover:text-orange-500">
                <ChevronUp size={16} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Trend banner */}
      <div className={`px-5 py-2.5 flex items-center gap-2 text-sm font-bold ${tBanner.color}`}>
        {tBanner.icon}
        <span>{tBanner.msg}{['strong_rise','moderate_rise'].includes(prediction.overallTrend) && p12 ? ` +${p12.changePercent?.toFixed(1)}% over next 12 months` : ''}</span>
      </div>

      {/* Sparkline (simplified) */}
      <div className="px-5 py-3 border-b border-gray-50">
        <div className="flex items-end gap-0.5 h-12">
          {/* Historical (gray) */}
          {[6,5,6,7,6,8,7,8,9].map((h, i) => (
            <div key={i} className="flex-1 bg-gray-200 rounded-sm" style={{ height: `${h*11}%` }} />
          ))}
          {/* Divider */}
          <div className="w-0.5 h-full bg-orange-400 mx-0.5" />
          {/* Predictions (orange) */}
          {[
            { v: p6?.changePercent || 0 },
            { v: p12?.changePercent || 0 },
            { v: p24?.changePercent || 0 },
            { v: p36?.changePercent || 0 },
          ].map((p, i) => (
            <div key={i} className="flex-1 rounded-sm" style={{
              height: `${Math.min(100, Math.max(20, 65 + p.v * 1.5))}%`,
              backgroundColor: p.v >= 0 ? '#f97316' : '#ef4444',
              opacity: 1 - i * 0.1
            }} />
          ))}
        </div>
        <div className="flex justify-between text-[9px] text-gray-400 mt-1 px-1">
          <span>12 months ago</span>
          <span className="text-orange-500 font-bold">Today</span>
          <span>6M</span><span>12M</span><span>24M</span><span>36M</span>
        </div>
      </div>

      {/* Forecast numbers */}
      <div className="grid grid-cols-4 divide-x divide-gray-100 border-b border-gray-100">
        {[
          { label: "6 Months", data: p6 },
          { label: "12 Months", data: p12 },
          { label: "24 Months", data: p24 },
          { label: "36 Months", data: p36 },
        ].map(({ label, data }) => {
          const isUp = (data?.changePercent || 0) >= 0;
          return (
            <div key={label} className="p-3 text-center">
              <p className="text-[10px] text-gray-400 font-semibold">{label}</p>
              <p className={`text-lg font-black ${isUp ? 'text-green-600' : 'text-red-600'}`}>
                {data ? `${isUp ? '+' : ''}${data.changePercent?.toFixed(1)}%` : '—'}
              </p>
              <p className="text-[10px] text-gray-500">{data ? `${data.pricePerSqm?.toLocaleString()} EGP/m²` : ''}</p>
            </div>
          );
        })}
      </div>

      {/* Grade + insight */}
      <div className="px-5 py-3 border-b border-gray-100 flex items-center justify-between gap-3 flex-wrap">
        <span className={`font-black px-4 py-1.5 rounded-xl text-sm ${gCfg.color}`}>{gCfg.label}</span>
        <p className="text-xs text-gray-500 flex-1 min-w-[140px]">
          💡 {prediction.aiSummary?.slice(0, 80)}…
        </p>
      </div>

      {/* Key drivers */}
      {prediction.keyDrivers?.length > 0 && (
        <div className="px-5 py-3 border-b border-gray-100 flex flex-wrap gap-1.5">
          {prediction.keyDrivers.slice(0, 3).map((d, i) => (
            <span key={i} className="text-[10px] bg-orange-50 text-orange-700 px-2 py-0.5 rounded-full font-semibold">
              {d.title}
            </span>
          ))}
        </div>
      )}

      {/* Footer */}
      <div className="px-5 py-3 flex items-center justify-between">
        <p className="text-[10px] text-gray-400">
          Confidence: {prediction.overallConfidence}% · Updated today · Based on {prediction.listingsAnalyzed} listings
        </p>
        <button className="flex items-center gap-1 text-xs text-orange-500 font-bold hover:underline">
          <Bell size={11} /> Alert
        </button>
      </div>
    </div>
  );
}