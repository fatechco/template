import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { TrendingUp, TrendingDown, Minus, Bell, Search, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const GRADE_CONFIG = {
  strong_buy: { label: "Strong Buy", color: "bg-emerald-700 text-white" },
  buy_now:    { label: "Buy Now",    color: "bg-green-500 text-white" },
  hold:       { label: "Hold",       color: "bg-orange-500 text-white" },
  wait:       { label: "Wait",       color: "bg-yellow-500 text-white" },
  avoid:      { label: "Avoid",      color: "bg-red-600 text-white" },
};

const TREND_META = {
  strong_rise:     { label: "↑↑ Strong Rise",    bg: "bg-green-600",  text: "text-white", icon: <TrendingUp size={14} /> },
  moderate_rise:   { label: "↑ Moderate Rise",   bg: "bg-green-500",  text: "text-white", icon: <TrendingUp size={14} /> },
  stable:          { label: "→ Stable",           bg: "bg-blue-500",   text: "text-white", icon: <Minus size={14} /> },
  moderate_decline:{ label: "↓ Decline",          bg: "bg-red-500",    text: "text-white", icon: <TrendingDown size={14} /> },
  strong_decline:  { label: "↓↓ Strong Decline", bg: "bg-red-700",    text: "text-white", icon: <TrendingDown size={14} /> },
};

function PredictCard({ pred }) {
  const gCfg = GRADE_CONFIG[pred.investmentGrade] || GRADE_CONFIG.hold;
  const tMeta = TREND_META[pred.overallTrend] || TREND_META.stable;
  const p12 = pred.prediction12Months;
  const up = (p12?.changePercent || 0) >= 0;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg hover:shadow-orange-100 transition-all overflow-hidden group">
      <div className={`h-2 ${up ? 'bg-green-500' : 'bg-red-500'}`} />
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-black text-gray-900 text-base leading-tight">{pred.locationLabel}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{pred.predictionScope} level</p>
          </div>
          <span className={`text-[10px] font-black px-2.5 py-1 rounded-full flex-shrink-0 ${gCfg.color}`}>{gCfg.label}</span>
        </div>

        {/* Mini sparkline placeholder */}
        <div className="h-12 bg-gray-50 rounded-xl mb-3 flex items-center justify-center">
          <div className="flex items-end gap-0.5 h-8">
            {[4,5,4,6,5,7,8,7,9,10,11,12].map((h, i) => (
              <div key={i} className={`w-2 rounded-sm transition-all ${i >= 8 ? (up ? 'bg-green-400' : 'bg-red-400') : 'bg-gray-200'}`} style={{ height: `${h*8}%` }} />
            ))}
          </div>
        </div>

        <div className="text-center mb-3">
          <p className={`text-4xl font-black ${up ? 'text-green-600' : 'text-red-600'}`}>
            {up ? '+' : ''}{p12?.changePercent?.toFixed(1)}%
          </p>
          <p className="text-xs text-gray-400 mt-0.5">Expected in 12 months</p>
        </div>

        <div className="text-center text-sm text-gray-500 mb-3">
          <span className="font-bold text-gray-700">{pred.baselinePricePerSqm?.toLocaleString()}</span> → <span className={`font-black ${up ? 'text-green-600' : 'text-red-600'}`}>{p12?.pricePerSqm?.toLocaleString()}</span> EGP/m²
        </div>

        {/* Signals */}
        {pred.keyDrivers?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {pred.keyDrivers.slice(0, 2).map((d, i) => (
              <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-semibold truncate max-w-[100px]">
                {d.title}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between text-[10px] text-gray-400 pt-3 border-t border-gray-50">
          <span>Confidence: {pred.overallConfidence}%</span>
          <span>{pred.signalsUsed?.length || 0} signals</span>
          <span>Updated today</span>
        </div>
      </div>
      <div className="px-5 pb-4">
        <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
          📈 Full Forecast <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}

export default function KemedarPredict() {
  const [predictions, setPredictions] = useState([]);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("movers");
  const [subscribeEmail, setSubscribeEmail] = useState("");
  const [subscribedArea, setSubscribedArea] = useState("");
  const [showDisclaimer, setShowDisclaimer] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [preds, sigs] = await Promise.all([
          base44.entities.PricePrediction.filter({ isPublished: true }),
          base44.entities.MarketSignal.filter({ isActive: true, isVerified: true }),
        ]);
        setPredictions(preds);
        setSignals(sigs);
      } catch(e) {}
      setLoading(false);
    };
    load();
  }, []);

  const rising = predictions.filter(p => ['strong_rise','moderate_rise'].includes(p.overallTrend)).length;
  const stable = predictions.filter(p => p.overallTrend === 'stable').length;
  const cooling = predictions.filter(p => ['moderate_decline','strong_decline'].includes(p.overallTrend)).length;
  const topArea = [...predictions].sort((a, b) => (b.prediction12Months?.changePercent || 0) - (a.prediction12Months?.changePercent || 0))[0];

  const filtered = predictions.filter(p => {
    if (search && !(p.locationLabel || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const tabPredictions = activeTab === 'movers'
    ? [...filtered].sort((a, b) => Math.abs(b.prediction12Months?.changePercent || 0) - Math.abs(a.prediction12Months?.changePercent || 0))
    : activeTab === 'best'
    ? filtered.filter(p => ['strong_buy','buy_now'].includes(p.investmentGrade))
    : filtered;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Disclaimer toast */}
      {showDisclaimer && (
        <div className="fixed bottom-4 left-4 right-4 z-50 max-w-2xl mx-auto bg-slate-800 text-white rounded-2xl px-4 py-3 flex items-center justify-between gap-3 shadow-2xl">
          <p className="text-xs">ℹ️ <strong>Kemedar Predict™</strong> forecasts are AI estimates, not financial advice.</p>
          <button onClick={() => setShowDisclaimer(false)} className="text-xs font-bold bg-orange-500 px-3 py-1.5 rounded-lg hover:bg-orange-600 flex-shrink-0">
            Got it
          </button>
        </div>
      )}

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#1a1a2e] to-[#16213e] py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="text-6xl mb-4 animate-pulse">📈</div>
          <h1 className="text-4xl font-black text-white mb-3">Kemedar Predict™</h1>
          <p className="text-gray-300 text-lg mb-6 max-w-xl mx-auto">
            AI-powered property price forecasting for Egypt's real estate market
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap mb-8">
            {["✨ AI-Powered", "📊 Updated Daily", "🎯 Based on Real Data"].map(p => (
              <span key={p} className="text-white text-xs font-bold border border-white/30 bg-white/10 px-3 py-1.5 rounded-full">{p}</span>
            ))}
          </div>
          <div className="max-w-xl mx-auto relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search city, district, area..."
              className="w-full pl-11 pr-4 py-4 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white shadow-lg"
            />
          </div>
        </div>
      </div>

      {/* National overview */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-black text-gray-900">Egypt Market Overview</h2>
            <p className="text-gray-500 text-sm">As of {new Date().toLocaleDateString('en-GB', { day:'numeric', month:'long', year:'numeric' })}</p>
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-green-700">↑ {rising}</p>
            <p className="text-sm font-bold text-green-600 mt-1">Markets Rising</p>
            <p className="text-xs text-gray-400">Predicted price increase</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-blue-700">→ {stable}</p>
            <p className="text-sm font-bold text-blue-600 mt-1">Markets Stable</p>
            <p className="text-xs text-gray-400">Expected to hold</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-center">
            <p className="text-3xl font-black text-red-700">↓ {cooling}</p>
            <p className="text-sm font-bold text-red-600 mt-1">Markets Cooling</p>
            <p className="text-xs text-gray-400">Some downward pressure</p>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 text-center">
            <p className="text-2xl font-black text-amber-700">🏅</p>
            <p className="text-sm font-bold text-amber-700 mt-1 truncate">{topArea?.locationLabel || '—'}</p>
            <p className="text-xs text-gray-400">{topArea ? `+${topArea.prediction12Months?.changePercent?.toFixed(1)}% | Buy Now` : 'No data yet'}</p>
          </div>
        </div>

        {/* Trending areas */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
            {[
              ['movers','🔥 Biggest Movers'],
              ['best','🏆 Best Investment'],
              ['all','📋 All Areas'],
            ].map(([id, label]) => (
              <button key={id} onClick={() => setActiveTab(id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors ${activeTab === id ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                {label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="py-16 text-center">
              <div className="w-8 h-8 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
              <p className="text-gray-400">Loading predictions…</p>
            </div>
          ) : tabPredictions.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-2xl border border-gray-100">
              <p className="text-4xl mb-3">📈</p>
              <p className="text-gray-500 font-semibold">No predictions published yet</p>
              <p className="text-gray-400 text-sm mt-1">Admin will publish predictions soon</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {tabPredictions.slice(0, 9).map(pred => (
                <PredictCard key={pred.id} pred={pred} />
              ))}
            </div>
          )}
        </div>

        {/* Recent signals */}
        {signals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-black text-gray-900 mb-4">Latest Market Intelligence</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {signals.slice(0, 3).map(sig => (
                <div key={sig.id} className={`bg-white rounded-2xl border-l-4 p-4 shadow-sm ${sig.impactDirection === 'positive' ? 'border-green-400' : sig.impactDirection === 'negative' ? 'border-red-400' : 'border-gray-300'}`}>
                  <p className="font-black text-gray-900 text-sm">{sig.title}</p>
                  <p className="text-xs text-gray-400 capitalize mt-0.5">{sig.signalType?.replace(/_/g,' ')}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-sm font-black ${(sig.impactScore || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {(sig.impactScore || 0) > 0 ? `+${sig.impactScore}` : sig.impactScore} score
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sig.confidence === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                      {sig.confidence}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Subscribe section */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-3xl p-8 text-white text-center">
          <div className="text-4xl mb-3">🔔</div>
          <h2 className="text-2xl font-black mb-2">Get Price Alerts for Your Areas</h2>
          <p className="text-orange-100 mb-6 max-w-lg mx-auto">
            Subscribe to Kemedar Predict™ and get notified when forecasts change for areas you care about
          </p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input value={subscribedArea} onChange={e => setSubscribedArea(e.target.value)}
              placeholder="Area (e.g. New Cairo)"
              className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 focus:outline-none" />
            <input value={subscribeEmail} onChange={e => setSubscribeEmail(e.target.value)}
              placeholder="Your email"
              className="flex-1 px-4 py-3 rounded-xl text-sm text-gray-900 focus:outline-none" />
            <button className="bg-white text-orange-600 font-black px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap">
              Subscribe Free →
            </button>
          </div>
          <p className="text-xs text-orange-200 mt-4">Also available in: App | WhatsApp | SMS</p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 bg-gray-100 rounded-xl p-4 text-xs text-gray-500 text-center">
          ⚖️ <strong>Disclaimer:</strong> Kemedar Predict™ forecasts are generated by AI using historical listing data and market signals. 
          They are not financial advice. Past performance does not guarantee future results. 
          Always consult a qualified real estate advisor before making investment decisions.
        </div>
      </div>
    </div>
  );
}