import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, RefreshCw, X, ChevronRight, TrendingUp, TrendingDown } from "lucide-react";

const GRADE_CONFIG = {
  strong_buy: { label: "Strong Buy", color: "bg-emerald-700 text-white" },
  buy_now:    { label: "Buy Now",    color: "bg-green-500 text-white" },
  hold:       { label: "Hold",       color: "bg-orange-500 text-white" },
  wait:       { label: "Wait",       color: "bg-yellow-500 text-white" },
  avoid:      { label: "Avoid",      color: "bg-red-600 text-white" },
};

const TREND_CONFIG = {
  strong_rise:     { label: "↑↑ Strong Rise",     color: "text-green-700 bg-green-50" },
  moderate_rise:   { label: "↑ Moderate Rise",    color: "text-green-600 bg-green-50" },
  stable:          { label: "→ Stable",            color: "text-gray-600 bg-gray-50" },
  moderate_decline:{ label: "↓ Moderate Decline",  color: "text-red-600 bg-red-50" },
  strong_decline:  { label: "↓↓ Strong Decline",  color: "text-red-700 bg-red-50" },
};

function PredictionDetailModal({ pred, onClose, onRefresh }) {
  const [tab, setTab] = useState("forecast");
  const [langAr, setLangAr] = useState(false);

  if (!pred) return null;
  const gCfg = GRADE_CONFIG[pred.investmentGrade] || GRADE_CONFIG.hold;
  const tCfg = TREND_CONFIG[pred.overallTrend] || TREND_CONFIG.stable;

  const ForecCard = ({ label, data }) => {
    if (!data) return null;
    const up = (data.changePercent || 0) >= 0;
    return (
      <div className="bg-gray-50 rounded-2xl p-4 text-center">
        <p className="text-xs font-bold text-gray-500 mb-2">{label}</p>
        <p className={`text-3xl font-black ${up ? 'text-green-600' : 'text-red-600'}`}>
          {up ? '+' : ''}{data.changePercent?.toFixed(1)}%
        </p>
        <p className="text-sm text-gray-600 mt-1 font-bold">{data.pricePerSqm?.toLocaleString()} EGP/m²</p>
        <p className="text-xs text-gray-400 mt-1">Range: {data.range?.pessimistic?.toLocaleString()} – {data.range?.optimistic?.toLocaleString()}</p>
        <div className="mt-2">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full" style={{ width: `${data.confidence || 0}%` }} />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">{data.confidence || 0}% Confidence</p>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between p-6 border-b border-gray-100">
          <div>
            <h2 className="text-2xl font-black text-gray-900">{pred.locationLabel || 'Prediction'}</h2>
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold">{pred.propertyType}</span>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full font-bold">{pred.purpose}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${tCfg.color}`}>{tCfg.label}</span>
              <span className={`text-xs font-black px-3 py-1 rounded-full ${gCfg.color}`}>{gCfg.label}</span>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Generated: {pred.generatedAt ? new Date(pred.generatedAt).toLocaleDateString() : '—'} · 
              Confidence: {pred.overallConfidence}% · 
              Based on {pred.listingsAnalyzed} listings
            </p>
          </div>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-100 overflow-x-auto">
          {[['forecast','📈 Forecast'],['analysis','🧠 Analysis'],['drivers','⚡ Drivers & Risks'],['data','📊 Data Quality']].map(([id, label]) => (
            <button key={id} onClick={() => setTab(id)}
              className={`px-5 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-colors ${tab === id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'}`}>
              {label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {tab === 'forecast' && (
            <div className="space-y-5">
              {/* Current price */}
              <div className="bg-orange-500 rounded-2xl p-5 text-white text-center">
                <p className="text-lg font-black">Current Average: {pred.baselinePricePerSqm?.toLocaleString()} EGP/m²</p>
                <p className="text-orange-200 text-sm mt-1">Based on {pred.listingsAnalyzed} active listings</p>
              </div>

              {/* Forecast cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <ForecCard label="6 Months" data={pred.prediction6Months} />
                <ForecCard label="12 Months" data={pred.prediction12Months} />
                <ForecCard label="24 Months" data={pred.prediction24Months} />
                <ForecCard label="36 Months" data={pred.prediction36Months} />
              </div>
            </div>
          )}

          {tab === 'analysis' && (
            <div className="space-y-5">
              {/* Grade */}
              <div className="text-center py-4">
                <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full text-white font-black text-lg ${gCfg.color}`}>
                  {gCfg.label}
                </div>
                <p className="text-sm text-gray-500 mt-3 max-w-md mx-auto">{pred.investmentGradeReason}</p>
              </div>

              {/* AI Summary */}
              <div className="bg-gray-50 rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-black text-gray-900">🤖 AI Market Analysis</h3>
                  <div className="flex gap-1">
                    <button onClick={() => setLangAr(false)} className={`text-xs px-2 py-1 rounded font-bold ${!langAr ? 'bg-orange-500 text-white' : 'text-gray-500'}`}>EN</button>
                    <button onClick={() => setLangAr(true)} className={`text-xs px-2 py-1 rounded font-bold ${langAr ? 'bg-orange-500 text-white' : 'text-gray-500'}`}>AR</button>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed" dir={langAr ? 'rtl' : 'ltr'}>
                  {langAr ? pred.aiSummaryAr : pred.aiSummary}
                </p>
              </div>

              {/* Bull/Bear */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-4">
                  <h4 className="font-black text-green-700 mb-2">🐂 Bull Case — Best Scenario</h4>
                  <p className="text-sm text-green-700">{pred.aiBullCase}</p>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
                  <h4 className="font-black text-red-700 mb-2">🐻 Bear Case — Worst Scenario</h4>
                  <p className="text-sm text-red-700">{pred.aiBearCase}</p>
                </div>
              </div>
            </div>
          )}

          {tab === 'drivers' && (
            <div className="space-y-5">
              {/* Key Drivers */}
              <div>
                <h3 className="font-black text-gray-900 mb-3">📈 Key Price Drivers</h3>
                <div className="space-y-3">
                  {(pred.keyDrivers || []).map((d, i) => (
                    <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl p-4">
                      <span className={`font-black text-lg ${d.impactDirection === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                        {d.impactDirection === 'positive' ? '↑' : '↓'}
                      </span>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 text-sm">{d.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{d.description}</p>
                        <p className="text-xs text-gray-400 mt-1">Timeframe: {d.timeframe}</p>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(d.weight || 5) * 10}%` }} />
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Weight: {d.weight}/10</p>
                      </div>
                    </div>
                  ))}
                  {(!pred.keyDrivers || pred.keyDrivers.length === 0) && (
                    <p className="text-gray-400 text-sm py-4 text-center">No key drivers recorded</p>
                  )}
                </div>
              </div>

              {/* Risks */}
              <div>
                <h3 className="font-black text-gray-900 mb-3">⚠️ Potential Risks</h3>
                <div className="space-y-3">
                  {(pred.keyRisks || []).map((r, i) => (
                    <div key={i} className="flex items-start gap-3 bg-yellow-50 rounded-xl p-4">
                      <span className={`text-[10px] font-black px-2 py-1 rounded-full flex-shrink-0 ${r.probability === 'high' ? 'bg-red-100 text-red-600' : r.probability === 'medium' ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-600'}`}>
                        {r.probability?.toUpperCase()}
                      </span>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{r.riskTitle}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{r.riskDescription}</p>
                        <p className="text-xs text-orange-600 mt-1 font-semibold">If occurs: {r.impactIfOccurs}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {tab === 'data' && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-2xl p-5 space-y-3">
                <h3 className="font-black text-gray-900">📊 Data Sources</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-400 text-xs">Listings analyzed</p><p className="font-black text-gray-900">{pred.listingsAnalyzed || 0}</p></div>
                  <div><p className="text-gray-400 text-xs">Baseline date</p><p className="font-black text-gray-900">{pred.baselineDate || '—'}</p></div>
                  <div><p className="text-gray-400 text-xs">Model version</p><p className="font-black text-gray-900">{pred.modelVersion || '—'}</p></div>
                  <div><p className="text-gray-400 text-xs">Signals used</p><p className="font-black text-gray-900">{pred.signalsUsed?.length || 0}</p></div>
                </div>
                <div>
                  <p className="text-gray-400 text-xs mb-1">Overall Confidence</p>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${pred.overallConfidence || 0}%` }} />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{pred.overallConfidence}%</p>
                </div>
                {pred.lowDataConfidence && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-yellow-700">
                    ⚠️ Low data warning: Prediction expanded to district/city level due to insufficient local listings.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm">Close</button>
          <button onClick={async () => {
            await base44.entities.PricePrediction.update(pred.id, { isPublished: !pred.isPublished });
            onRefresh();
            onClose();
          }} className={`flex-1 font-bold py-2.5 rounded-xl text-sm ${pred.isPublished ? 'bg-gray-200 text-gray-700' : 'bg-orange-500 text-white hover:bg-orange-600'}`}>
            {pred.isPublished ? 'Unpublish' : '📤 Publish to Users'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PredictPredictions() {
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterGrade, setFilterGrade] = useState("");
  const [filterTrend, setFilterTrend] = useState("");
  const [filterPublished, setFilterPublished] = useState("");
  const [viewPred, setViewPred] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    const data = await base44.entities.PricePrediction.list('-created_date', 200);
    setPredictions(data);
    setLoading(false);
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = predictions.filter(p => {
    if (filterGrade && p.investmentGrade !== filterGrade) return false;
    if (filterTrend && p.overallTrend !== filterTrend) return false;
    if (filterPublished === 'published' && !p.isPublished) return false;
    if (filterPublished === 'unpublished' && p.isPublished) return false;
    if (search && !(p.locationLabel || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleDelete = async (id) => {
    if (!confirm('Delete this prediction?')) return;
    await base44.entities.PricePrediction.delete(id);
    fetchData();
  };

  const handleRegenerate = async (pred) => {
    await base44.functions.invoke('generatePricePrediction', {
      locationParams: { cityId: pred.cityId, districtId: pred.districtId, areaId: pred.areaId },
      propertyType: pred.propertyType,
      purpose: pred.purpose,
      locationLabel: pred.locationLabel
    });
    fetchData();
  };

  const ChangeCell = ({ data }) => {
    if (!data) return <span className="text-gray-300">—</span>;
    const up = (data.changePercent || 0) >= 0;
    return (
      <div>
        <span className={`font-bold ${up ? 'text-green-600' : 'text-red-600'}`}>
          {up ? '+' : ''}{data.changePercent?.toFixed(1)}%
        </span>
        <p className="text-gray-400 text-[10px]">{data.pricePerSqm?.toLocaleString()}</p>
      </div>
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-xs text-gray-400">
        <span>Admin</span><ChevronRight size={11} /><span>Kemedar Predict™</span><ChevronRight size={11} />
        <span className="text-gray-700 font-semibold">Predictions</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Price Predictions</h1>
          <p className="text-gray-500 text-sm">{filtered.length} AI-generated market price forecasts</p>
        </div>
        <button onClick={fetchData} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
          <RefreshCw size={12} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search location…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-400" />
        </div>
        <select value={filterGrade} onChange={e => setFilterGrade(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Grades</option>
          {Object.entries(GRADE_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterTrend} onChange={e => setFilterTrend(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Trends</option>
          {Object.entries(TREND_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterPublished} onChange={e => setFilterPublished(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Status</option>
          <option value="published">Published</option>
          <option value="unpublished">Unpublished</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center"><RefreshCw size={24} className="mx-auto animate-spin text-gray-300 mb-2" /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Area","Type","Purpose","Current/m²","6M","12M","24M","Trend","Grade","Conf.","Signals","Published","Actions"].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase text-[10px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr><td colSpan={13} className="py-16 text-center text-gray-400">
                    <p className="text-2xl mb-2">📈</p>
                    <p className="font-semibold">No predictions found</p>
                  </td></tr>
                )}
                {filtered.map(pred => {
                  const gCfg = GRADE_CONFIG[pred.investmentGrade] || GRADE_CONFIG.hold;
                  const tCfg = TREND_CONFIG[pred.overallTrend] || TREND_CONFIG.stable;
                  return (
                    <tr key={pred.id} className="hover:bg-gray-50">
                      <td className="px-3 py-3 font-semibold text-gray-900 max-w-[140px] truncate">{pred.locationLabel || '—'}</td>
                      <td className="px-3 py-3 capitalize text-gray-600">{pred.propertyType}</td>
                      <td className="px-3 py-3 capitalize text-gray-600">{pred.purpose}</td>
                      <td className="px-3 py-3 font-bold">{pred.baselinePricePerSqm?.toLocaleString()}</td>
                      <td className="px-3 py-3"><ChangeCell data={pred.prediction6Months} /></td>
                      <td className="px-3 py-3"><ChangeCell data={pred.prediction12Months} /></td>
                      <td className="px-3 py-3"><ChangeCell data={pred.prediction24Months} /></td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${tCfg.color}`}>{tCfg.label}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${gCfg.color}`}>{gCfg.label}</span>
                      </td>
                      <td className="px-3 py-3 font-bold text-gray-700">{pred.overallConfidence}%</td>
                      <td className="px-3 py-3 text-center">{pred.signalsUsed?.length || 0}</td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${pred.isPublished ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {pred.isPublished ? '✅ Yes' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-0.5">
                          <button onClick={() => setViewPred(pred)} className="p-1 hover:bg-blue-50 text-blue-400 rounded text-xs" title="View">👁</button>
                          <button onClick={() => handleRegenerate(pred)} className="p-1 hover:bg-orange-50 text-orange-400 rounded" title="Regenerate">
                            <RefreshCw size={12} />
                          </button>
                          <button onClick={() => handleDelete(pred.id)} className="p-1 hover:bg-red-50 text-red-400 rounded text-xs" title="Delete">🗑</button>
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

      {viewPred && (
        <PredictionDetailModal pred={viewPred} onClose={() => setViewPred(null)} onRefresh={fetchData} />
      )}
    </div>
  );
}