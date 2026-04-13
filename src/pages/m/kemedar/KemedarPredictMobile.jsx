import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, TrendingUp, TrendingDown, Minus, ChevronRight } from "lucide-react";

const GRADE_CONFIG = {
  strong_buy: { label: "Strong Buy", color: "bg-emerald-700 text-white" },
  buy_now:    { label: "Buy Now",    color: "bg-green-500 text-white" },
  hold:       { label: "Hold",       color: "bg-orange-500 text-white" },
  wait:       { label: "Wait",       color: "bg-yellow-500 text-white" },
  avoid:      { label: "Avoid",      color: "bg-red-600 text-white" },
};

const AREAS = ["New Cairo", "Maadi", "Sheikh Zayed", "6th October", "North Coast", "New Capital"];

export default function KemedarPredictMobile() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeArea, setActiveArea] = useState(null);

  useEffect(() => {
    base44.entities.PricePrediction.filter({ isPublished: true })
      .then(setPredictions)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const filtered = predictions.filter(p =>
    !search || (p.locationLabel || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top bar */}
      <div className="bg-gradient-to-r from-[#1a1a2e] to-[#16213e] px-4 pt-4 pb-6">
        <h1 className="text-white font-black text-xl mb-3">📈 Kemedar Predict™</h1>
        <p className="text-gray-400 text-xs mb-4">AI Price Forecasting</p>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search area..."
            className="w-full pl-9 pr-4 py-3 rounded-xl text-sm focus:outline-none bg-white/10 text-white placeholder-gray-400" />
        </div>
      </div>

      {/* Area chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 py-3">
        {AREAS.map(area => (
          <button key={area} onClick={() => setActiveArea(activeArea === area ? null : area)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap flex-shrink-0 transition-colors ${activeArea === area ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {area}
          </button>
        ))}
      </div>

      {/* Prediction cards */}
      <div className="px-4 space-y-3 mt-2">
        {loading ? (
          Array.from({length:3}).map((_,i) => (
            <div key={i} className="bg-white rounded-2xl h-24 animate-pulse border border-gray-100" />
          ))
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-100">
            <p className="text-3xl mb-2">📈</p>
            <p className="text-gray-500 font-semibold">No predictions yet</p>
          </div>
        ) : (
          filtered.map(pred => {
            const p12 = pred.prediction12Months;
            const up = (p12?.changePercent || 0) >= 0;
            const gCfg = GRADE_CONFIG[pred.investmentGrade] || GRADE_CONFIG.hold;

            return (
              <div key={pred.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex">
                <div className={`w-1.5 flex-shrink-0 ${up ? 'bg-green-500' : 'bg-red-500'}`} />
                <div className="flex-1 p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 text-base truncate">{pred.locationLabel}</p>
                      <p className="text-xs text-gray-400 capitalize">{pred.predictionScope}</p>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ml-2 ${gCfg.color}`}>
                      {gCfg.label}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div>
                      <span className={`text-2xl font-black ${up ? 'text-green-600' : 'text-red-600'}`}>
                        {up ? '+' : ''}{p12?.changePercent?.toFixed(1)}%
                      </span>
                      <span className="text-xs text-gray-400 ml-1">/ 12mo</span>
                    </div>
                    <div className="flex items-end gap-0.5 h-8">
                      {[4,5,6,7,8,9,10,11].map((h, i) => (
                        <div key={i} className={`w-1.5 rounded-sm ${i >= 6 ? (up ? 'bg-green-400' : 'bg-red-400') : 'bg-gray-200'}`}
                          style={{ height: `${h * 10}%` }} />
                      ))}
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-400">Confidence</p>
                      <p className="text-sm font-black text-gray-700">{pred.overallConfidence}%</p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center pr-3">
                  <ChevronRight size={16} className="text-gray-300" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Disclaimer */}
      <div className="mx-4 mt-6 bg-gray-100 rounded-xl p-3 text-xs text-gray-400 text-center">
        Kemedar Predict™ forecasts are AI estimates, not financial advice.
      </div>
    </div>
  );
}