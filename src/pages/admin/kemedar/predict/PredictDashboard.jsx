import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { RefreshCw, Plus, TrendingUp, TrendingDown, Minus, Zap, Target, CheckCircle, Bell, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

const TREND_CONFIG = {
  strong_rise:     { icon: <TrendingUp size={14} />, label: "↑↑ Strong Rise",     color: "text-green-700 bg-green-50",   badge: "bg-green-600 text-white" },
  moderate_rise:   { icon: <TrendingUp size={14} />, label: "↑ Moderate Rise",    color: "text-green-600 bg-green-50",   badge: "bg-green-500 text-white" },
  stable:          { icon: <Minus size={14} />,      label: "→ Stable",           color: "text-gray-600 bg-gray-50",     badge: "bg-gray-400 text-white" },
  moderate_decline:{ icon: <TrendingDown size={14}/>, label: "↓ Moderate Decline", color: "text-red-600 bg-red-50",      badge: "bg-red-500 text-white" },
  strong_decline:  { icon: <TrendingDown size={14}/>, label: "↓↓ Strong Decline", color: "text-red-700 bg-red-50",       badge: "bg-red-700 text-white" },
};

const GRADE_CONFIG = {
  strong_buy: { label: "Strong Buy", color: "bg-emerald-700 text-white" },
  buy_now:    { label: "Buy Now",    color: "bg-green-500 text-white" },
  hold:       { label: "Hold",       color: "bg-orange-500 text-white" },
  wait:       { label: "Wait",       color: "bg-yellow-500 text-white" },
  avoid:      { label: "Avoid",      color: "bg-red-600 text-white" },
};

function KPICard({ icon, value, label, sub, color }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl mb-3 ${color}`}>{icon}</div>
      <p className="text-3xl font-black text-gray-900">{value}</p>
      <p className="text-sm font-bold text-gray-700 mt-0.5">{label}</p>
      <p className="text-xs text-gray-400 mt-1">{sub}</p>
    </div>
  );
}

function GeneratePanel({ onGenerated }) {
  const [generating, setGenerating] = useState(false);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [locationLabel, setLocationLabel] = useState("New Cairo, Cairo");
  const [propertyType, setPropertyType] = useState("all");
  const [purpose, setPurpose] = useState("sale");
  const [recent, setRecent] = useState([]);

  const steps = ["Collecting market data...", "Gathering signals...", "AI analyzing...", "Saving prediction..."];

  const handleGenerate = async () => {
    setGenerating(true);
    setDone(false);
    setStep(0);

    for (let i = 0; i < steps.length; i++) {
      setStep(i);
      await new Promise(r => setTimeout(r, 800));
    }

    try {
      const res = await base44.functions.invoke('generatePricePrediction', {
        locationParams: { cityId: null, districtId: null, areaId: null },
        propertyType,
        purpose,
        locationLabel
      });

      if (res.data?.success) {
        setRecent(prev => [{
          label: locationLabel,
          confidence: res.data.prediction?.overallConfidence || 70,
          grade: res.data.prediction?.investmentGrade || 'hold',
          ago: 'just now'
        }, ...prev.slice(0, 4)]);
        setDone(true);
        onGenerated?.();
      }
    } catch(e) {
      console.error(e);
    }

    setGenerating(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
      <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
        <span className="text-xl">🤖</span> Generate Prediction
      </h3>

      <div className="space-y-3 mb-4">
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Location</label>
          <input value={locationLabel} onChange={e => setLocationLabel(e.target.value)}
            placeholder="e.g. New Cairo, Cairo"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <label className="block text-xs font-bold text-gray-500 mb-1">Property Type</label>
          <select value={propertyType} onChange={e => setPropertyType(e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
            {["all","apartment","villa","commercial","land","studio"].map(t => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          {["sale","rent","all"].map(p => (
            <button key={p} onClick={() => setPurpose(p)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${purpose === p ? 'bg-orange-500 text-white border-orange-500' : 'border-gray-200 text-gray-600 hover:border-orange-300'}`}>
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {generating ? (
        <div className="space-y-2 py-2">
          {steps.map((s, i) => (
            <div key={i} className={`flex items-center gap-2 text-xs transition-all ${i < step ? 'text-green-600' : i === step ? 'text-orange-600 font-bold' : 'text-gray-300'}`}>
              {i < step ? <CheckCircle size={12} /> : i === step ? <RefreshCw size={12} className="animate-spin" /> : <div className="w-3 h-3 rounded-full border border-gray-200" />}
              {s}
            </div>
          ))}
          {done && (
            <div className="flex items-center gap-2 text-xs text-green-600 font-bold mt-2">
              <CheckCircle size={12} /> Prediction ready!
            </div>
          )}
        </div>
      ) : (
        <button onClick={handleGenerate}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
          <Zap size={14} /> Generate AI Prediction
        </button>
      )}

      {recent.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <p className="text-xs font-bold text-gray-400 mb-2">Recent Generations</p>
          <div className="space-y-2">
            {recent.map((r, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <span className="text-gray-700 font-semibold truncate max-w-[120px]">{r.label}</span>
                <div className="flex items-center gap-1.5">
                  <span className="text-gray-400">{r.confidence}%</span>
                  <span className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${GRADE_CONFIG[r.grade]?.color || 'bg-gray-100 text-gray-600'}`}>
                    {GRADE_CONFIG[r.grade]?.label || r.grade}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function PredictDashboard() {
  const [predictions, setPredictions] = useState([]);
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [preds, sigs] = await Promise.all([
        base44.entities.PricePrediction.list('-created_date', 50),
        base44.entities.MarketSignal.filter({ isActive: true }),
      ]);
      setPredictions(preds);
      setSignals(sigs);
    } catch(e) {}
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, [refreshKey]);

  const positive = signals.filter(s => s.impactDirection === 'positive').length;
  const negative = signals.filter(s => s.impactDirection === 'negative').length;
  const published = predictions.filter(p => p.isPublished).length;
  const avgConf = predictions.length ? Math.round(predictions.reduce((a, p) => a + (p.overallConfidence || 0), 0) / predictions.length) : 0;

  const topPredictions = [...predictions]
    .filter(p => p.prediction12Months?.changePercent)
    .sort((a, b) => Math.abs(b.prediction12Months.changePercent) - Math.abs(a.prediction12Months.changePercent))
    .slice(0, 10);

  const handlePublishToggle = async (pred) => {
    await base44.entities.PricePrediction.update(pred.id, {
      isPublished: !pred.isPublished,
      publishedAt: !pred.isPublished ? new Date().toISOString() : null
    });
    fetchData();
  };

  const handleRegenerate = async (pred) => {
    try {
      await base44.functions.invoke('generatePricePrediction', {
        locationParams: { cityId: pred.cityId, districtId: pred.districtId, areaId: pred.areaId },
        propertyType: pred.propertyType,
        purpose: pred.purpose,
        locationLabel: pred.locationLabel
      });
      fetchData();
    } catch(e) {}
  };

  return (
    <div className="space-y-6">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <span>Admin</span><ChevronRight size={11} /><span>Kemedar Predict™</span><ChevronRight size={11} />
        <span className="text-gray-700 font-semibold">Dashboard</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-black text-gray-900">Kemedar Predict™ Dashboard</h1>
            <span className="text-[10px] font-black bg-purple-600 text-white px-2 py-0.5 rounded-full">✨ Powered by Claude AI</span>
          </div>
          <p className="text-gray-500 text-sm">AI Market Price Forecasting Control Center</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
          </button>
          <Link to="/admin/kemedar/predict/signals"
            className="flex items-center gap-1.5 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-lg text-sm">
            <Plus size={14} /> Add Signal
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard icon="📈" value={published} label="Active Predictions" sub={`Updated ${loading ? '…' : 'recently'}`} color="bg-orange-100" />
        <KPICard icon="🔔" value={signals.length} label="Active Market Signals" sub={`${positive} positive | ${negative} negative`} color="bg-blue-100" />
        <KPICard icon="🎯" value={`${avgConf}%`} label="Avg Prediction Confidence" sub="Based on current data quality" color={avgConf > 70 ? "bg-green-100" : "bg-yellow-100"} />
        <KPICard icon="✅" value="—" label="Historical Accuracy Rate" sub="6-month predictions vs actual" color="bg-teal-100" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Hottest areas table */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-gray-900">🔥 Areas With Strongest Predictions</h2>
            <Link to="/admin/kemedar/predict/predictions" className="text-xs text-orange-500 font-bold hover:underline">
              View All →
            </Link>
          </div>
          {loading ? (
            <div className="py-16 text-center">
              <RefreshCw size={24} className="mx-auto animate-spin text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">Loading predictions…</p>
            </div>
          ) : topPredictions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-3xl mb-2">📈</p>
              <p className="text-gray-500 font-semibold">No predictions yet</p>
              <p className="text-gray-400 text-sm">Generate your first prediction →</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    {["#","Area","Current/m²","6M","12M","Trend","Grade","Conf.","Actions"].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase text-[10px] whitespace-nowrap">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topPredictions.map((pred, idx) => {
                    const tCfg = TREND_CONFIG[pred.overallTrend] || TREND_CONFIG.stable;
                    const gCfg = GRADE_CONFIG[pred.investmentGrade] || GRADE_CONFIG.hold;
                    const p12 = pred.prediction12Months;
                    const p6 = pred.prediction6Months;
                    return (
                      <tr key={pred.id} className="hover:bg-gray-50">
                        <td className="px-3 py-3 font-bold text-gray-400">{idx + 1}</td>
                        <td className="px-3 py-3 font-semibold text-gray-900 max-w-[140px] truncate">{pred.locationLabel || '—'}</td>
                        <td className="px-3 py-3 font-bold text-gray-700">{pred.baselinePricePerSqm?.toLocaleString()}</td>
                        <td className="px-3 py-3">
                          {p6 ? (
                            <span className={`font-bold ${p6.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {p6.changePercent >= 0 ? '+' : ''}{p6.changePercent?.toFixed(1)}%
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-3 py-3">
                          {p12 ? (
                            <span className={`font-bold ${p12.changePercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                              {p12.changePercent >= 0 ? '+' : ''}{p12.changePercent?.toFixed(1)}%
                            </span>
                          ) : '—'}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${tCfg.color}`}>
                            {tCfg.label}
                          </span>
                        </td>
                        <td className="px-3 py-3">
                          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${gCfg.color}`}>
                            {gCfg.label}
                          </span>
                        </td>
                        <td className="px-3 py-3 font-bold text-gray-700">{pred.overallConfidence || 0}%</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1">
                            <button onClick={() => handleRegenerate(pred)} title="Regenerate"
                              className="p-1 hover:bg-orange-50 text-orange-400 rounded">
                              <RefreshCw size={12} />
                            </button>
                            <button onClick={() => handlePublishToggle(pred)} title={pred.isPublished ? 'Unpublish' : 'Publish'}
                              className={`p-1 rounded text-xs font-bold ${pred.isPublished ? 'text-green-500 hover:bg-green-50' : 'text-gray-400 hover:bg-gray-50'}`}>
                              📤
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Generate Panel */}
        <GeneratePanel onGenerated={() => setRefreshKey(k => k + 1)} />
      </div>

      {/* Recent Signals */}
      {signals.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-black text-gray-900">🔔 Recent Market Signals</h2>
            <Link to="/admin/kemedar/predict/signals" className="text-xs text-orange-500 font-bold hover:underline">View All →</Link>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {signals.slice(0, 3).map(sig => (
              <div key={sig.id} className={`border-l-4 pl-3 py-1 ${sig.impactDirection === 'positive' ? 'border-green-400' : sig.impactDirection === 'negative' ? 'border-red-400' : 'border-gray-300'}`}>
                <p className="font-bold text-sm text-gray-900 truncate">{sig.title}</p>
                <p className="text-xs text-gray-500 mt-0.5 capitalize">{sig.signalType?.replace(/_/g, ' ')}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-xs font-bold ${sig.impactScore > 0 ? 'text-green-600' : sig.impactScore < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                    {sig.impactScore > 0 ? '+' : ''}{sig.impactScore}
                  </span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${sig.confidence === 'confirmed' ? 'bg-green-100 text-green-700' : sig.confidence === 'likely' ? 'bg-orange-100 text-orange-700' : 'bg-gray-100 text-gray-600'}`}>
                    {sig.confidence}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}