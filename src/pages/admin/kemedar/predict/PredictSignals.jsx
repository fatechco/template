import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Plus, RefreshCw, X, ChevronRight, CheckCircle, TrendingUp, TrendingDown, Minus } from "lucide-react";

const SIGNAL_TYPE_ICONS = {
  infrastructure_project:      { icon: "🏗", color: "bg-orange-100 text-orange-700" },
  new_development_announced:   { icon: "🏘", color: "bg-blue-100 text-blue-700" },
  school_opening:              { icon: "🏫", color: "bg-teal-100 text-teal-700" },
  hospital_opening:            { icon: "🏥", color: "bg-red-100 text-red-700" },
  metro_line:                  { icon: "🚇", color: "bg-purple-100 text-purple-700" },
  highway_project:             { icon: "🛣", color: "bg-orange-100 text-orange-700" },
  government_zone_designation: { icon: "🏛", color: "bg-indigo-100 text-indigo-700" },
  new_compound_launch:         { icon: "🏡", color: "bg-blue-100 text-blue-700" },
  large_employer_moving_in:    { icon: "🏢", color: "bg-gray-100 text-gray-700" },
  economic_indicator:          { icon: "💰", color: "bg-green-100 text-green-700" },
  interest_rate_change:        { icon: "📊", color: "bg-gray-100 text-gray-600" },
  currency_fluctuation:        { icon: "💱", color: "bg-yellow-100 text-yellow-700" },
  demand_spike:                { icon: "📈", color: "bg-green-100 text-green-700" },
  supply_change:               { icon: "📦", color: "bg-gray-100 text-gray-600" },
  foreign_investment:          { icon: "🌍", color: "bg-blue-100 text-blue-700" },
  custom:                      { icon: "⭐", color: "bg-gray-100 text-gray-600" },
};

const MAGNITUDE_CONFIG = {
  low:       { label: "Low",       color: "bg-gray-100 text-gray-600" },
  medium:    { label: "Medium",    color: "bg-blue-100 text-blue-700" },
  high:      { label: "High",      color: "bg-orange-100 text-orange-700" },
  very_high: { label: "Very High", color: "bg-red-100 text-red-600" },
};

const CONFIDENCE_CONFIG = {
  confirmed: { label: "Confirmed ✅", color: "bg-green-100 text-green-700" },
  likely:    { label: "Likely ⚠️",    color: "bg-orange-100 text-orange-700" },
  rumored:   { label: "Rumored 🔮",   color: "bg-gray-100 text-gray-500" },
};

const DEFAULT_FORM = {
  signalType: "infrastructure_project",
  title: "", titleAr: "",
  description: "", descriptionAr: "",
  impactDirection: "positive",
  impactMagnitude: "medium",
  impactScore: 30,
  sourceType: "news_media",
  confidence: "likely",
  signalDate: new Date().toISOString().slice(0,10),
  expectedImpactStartDate: "",
  expectedImpactPeakDate: "",
  expectedImpactEndDate: "",
  sourceUrl: "",
  affectedPropertyTypes: ["all"],
  affectedPurposes: ["all"],
  isActive: true,
  isVerified: false,
};

function SignalModal({ signal, onClose, onSaved }) {
  const [form, setForm] = useState(signal ? { ...signal } : { ...DEFAULT_FORM });
  const [saving, setSaving] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState(null);

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleAISuggest = async () => {
    setAiLoading(true);
    try {
      const result = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this real estate market signal for the Egyptian/MENA market and suggest an impact score from -100 to +100.

Signal Type: ${form.signalType}
Impact Direction: ${form.impactDirection}
Magnitude: ${form.impactMagnitude}
Confidence: ${form.confidence}
Title: ${form.title}

Return JSON: { "impactScore": number, "reasoning": "1 sentence explanation", "historicalComparable": "brief comparable example" }`,
        response_json_schema: {
          type: "object",
          properties: {
            impactScore: { type: "number" },
            reasoning: { type: "string" },
            historicalComparable: { type: "string" }
          }
        }
      });
      setAiSuggestion(result);
    } catch(e) {}
    setAiLoading(false);
  };

  const handleSave = async (activate = false) => {
    setSaving(true);
    const data = { ...form, isActive: activate ? true : form.isActive };
    try {
      if (signal?.id) {
        await base44.entities.MarketSignal.update(signal.id, data);
      } else {
        await base44.entities.MarketSignal.create(data);
      }
      onSaved();
      onClose();
    } catch(e) {}
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white z-10">
          <h2 className="font-black text-gray-900 text-lg">{signal?.id ? 'Edit' : 'Add'} Market Signal</h2>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>

        <div className="p-6 space-y-6">
          {/* Section 1 */}
          <div className="space-y-4">
            <h3 className="font-black text-gray-700 text-sm uppercase tracking-wide">1. Signal Information</h3>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Signal Type *</label>
              <select value={form.signalType} onChange={e => set('signalType', e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400">
                {Object.keys(SIGNAL_TYPE_ICONS).map(t => (
                  <option key={t} value={t}>{SIGNAL_TYPE_ICONS[t].icon} {t.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Title (English) *</label>
                <input value={form.title} onChange={e => set('title', e.target.value)} placeholder="e.g. New Cairo Metro Line"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Title (Arabic)</label>
                <input value={form.titleAr} onChange={e => set('titleAr', e.target.value)} dir="rtl" placeholder="العنوان بالعربية"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-1">Description</label>
              <textarea value={form.description} onChange={e => set('description', e.target.value)} rows={2}
                placeholder="Describe the signal and its expected market effect..."
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Source Type *</label>
                <select value={form.sourceType} onChange={e => set('sourceType', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
                  {["government_official","news_media","kemedar_research","franchise_owner_report","ai_detected","user_report"].map(t => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ')}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Source URL</label>
                <input value={form.sourceUrl} onChange={e => set('sourceUrl', e.target.value)} placeholder="https://..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Confidence *</label>
              <div className="flex gap-2">
                {Object.entries(CONFIDENCE_CONFIG).map(([k, v]) => (
                  <button key={k} onClick={() => set('confidence', k)}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${form.confidence === k ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600'}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section 2 — Impact */}
          <div className="space-y-4">
            <h3 className="font-black text-gray-700 text-sm uppercase tracking-wide">2. Impact Assessment</h3>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Impact Direction *</label>
              <div className="grid grid-cols-3 gap-2">
                {[{k:'positive',l:'↑ Positive',c:'border-green-400 bg-green-50 text-green-700'},{k:'negative',l:'↓ Negative',c:'border-red-400 bg-red-50 text-red-700'},{k:'neutral',l:'→ Neutral',c:'border-gray-300 bg-gray-50 text-gray-700'}].map(opt => (
                  <button key={opt.k} onClick={() => set('impactDirection', opt.k)}
                    className={`py-3 rounded-xl font-bold text-sm border-2 transition-all ${form.impactDirection === opt.k ? opt.c : 'border-gray-200 text-gray-500 hover:border-gray-300'}`}>
                    {opt.l}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-500 mb-2">Impact Magnitude *</label>
              <div className="flex gap-2">
                {Object.entries(MAGNITUDE_CONFIG).map(([k, v]) => (
                  <button key={k} onClick={() => set('impactMagnitude', k)}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border-2 transition-all ${form.impactMagnitude === k ? 'border-orange-400 bg-orange-50 text-orange-700' : 'border-gray-200 text-gray-600'}`}>
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-gray-500">Impact Score * (-100 to +100)</label>
                <button onClick={handleAISuggest} disabled={aiLoading}
                  className="flex items-center gap-1 text-xs font-bold text-purple-600 hover:text-purple-800 disabled:opacity-50">
                  {aiLoading ? <RefreshCw size={11} className="animate-spin" /> : '🤖'} AI Suggest
                </button>
              </div>
              {aiSuggestion && (
                <div className="bg-purple-50 border border-purple-200 rounded-xl p-3 mb-2 text-xs">
                  <p className="font-bold text-purple-700">AI suggests: {aiSuggestion.impactScore > 0 ? '+' : ''}{aiSuggestion.impactScore}</p>
                  <p className="text-purple-600 mt-0.5">{aiSuggestion.reasoning}</p>
                  <button onClick={() => { set('impactScore', aiSuggestion.impactScore); setAiSuggestion(null); }}
                    className="mt-2 bg-purple-600 text-white px-3 py-1 rounded-lg font-bold hover:bg-purple-700">
                    Use This
                  </button>
                </div>
              )}
              <div className="flex items-center gap-3">
                <input type="range" min="-100" max="100" value={form.impactScore}
                  onChange={e => set('impactScore', parseInt(e.target.value))}
                  className="flex-1 accent-orange-500" />
                <span className={`w-14 text-center font-black text-sm ${form.impactScore > 0 ? 'text-green-600' : form.impactScore < 0 ? 'text-red-600' : 'text-gray-500'}`}>
                  {form.impactScore > 0 ? '+' : ''}{form.impactScore}
                </span>
              </div>
            </div>
          </div>

          {/* Section 3 — Timeline */}
          <div className="space-y-4">
            <h3 className="font-black text-gray-700 text-sm uppercase tracking-wide">3. Timeline</h3>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Signal Detection Date *</label>
                <input type="date" value={form.signalDate} onChange={e => set('signalDate', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Expected Impact Start *</label>
                <input type="date" value={form.expectedImpactStartDate} onChange={e => set('expectedImpactStartDate', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Expected Impact Peak</label>
                <input type="date" value={form.expectedImpactPeakDate} onChange={e => set('expectedImpactPeakDate', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 mb-1">Expected Impact End</label>
                <input type="date" value={form.expectedImpactEndDate} onChange={e => set('expectedImpactEndDate', e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 pb-6 flex gap-3 sticky bottom-0 bg-white border-t border-gray-100 pt-4">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50">
            Cancel
          </button>
          <button onClick={() => handleSave(false)} disabled={saving || !form.title}
            className="flex-1 border border-orange-400 text-orange-600 font-bold py-2.5 rounded-xl text-sm hover:bg-orange-50 disabled:opacity-40">
            Save as Draft
          </button>
          <button onClick={() => handleSave(true)} disabled={saving || !form.title}
            className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm disabled:opacity-40">
            {saving ? 'Saving…' : 'Save & Activate'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PredictSignals() {
  const [signals, setSignals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDir, setFilterDir] = useState("");
  const [filterConf, setFilterConf] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editSignal, setEditSignal] = useState(null);

  const fetchSignals = async () => {
    setLoading(true);
    const data = await base44.entities.MarketSignal.list('-created_date', 200);
    setSignals(data);
    setLoading(false);
  };

  useEffect(() => { fetchSignals(); }, []);

  const filtered = signals.filter(s => {
    if (filterType && s.signalType !== filterType) return false;
    if (filterDir && s.impactDirection !== filterDir) return false;
    if (filterConf && s.confidence !== filterConf) return false;
    if (search && !(s.title || '').toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleToggleActive = async (sig) => {
    await base44.entities.MarketSignal.update(sig.id, { isActive: !sig.isActive });
    fetchSignals();
  };

  const handleVerify = async (sig) => {
    await base44.entities.MarketSignal.update(sig.id, { isVerified: true });
    fetchSignals();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this signal?')) return;
    await base44.entities.MarketSignal.delete(id);
    fetchSignals();
  };

  const stats = {
    total: signals.filter(s => s.isActive).length,
    positive: signals.filter(s => s.impactDirection === 'positive' && s.isActive).length,
    negative: signals.filter(s => s.impactDirection === 'negative' && s.isActive).length,
    verified: signals.filter(s => s.isVerified).length,
    pending: signals.filter(s => !s.isVerified).length,
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-1.5 text-xs text-gray-400 mb-1">
        <span>Admin</span><ChevronRight size={11} /><span>Kemedar Predict™</span><ChevronRight size={11} />
        <span className="text-gray-700 font-semibold">Market Signals</span>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Market Signals</h1>
          <p className="text-gray-500 text-sm">Events and developments that influence property prices</p>
        </div>
        <button onClick={() => { setEditSignal(null); setShowModal(true); }}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm">
          <Plus size={14} /> Add New Market Signal
        </button>
      </div>

      {/* Stats */}
      <div className="flex flex-wrap gap-3">
        {[
          { label: "Total Active", val: stats.total, color: "bg-gray-100 text-gray-700" },
          { label: "Positive", val: stats.positive, color: "bg-green-100 text-green-700" },
          { label: "Negative", val: stats.negative, color: "bg-red-100 text-red-600" },
          { label: "Verified", val: stats.verified, color: "bg-blue-100 text-blue-700" },
          { label: "Pending Verification", val: stats.pending, color: "bg-yellow-100 text-yellow-700" },
        ].map(s => (
          <div key={s.label} className={`px-4 py-2 rounded-xl text-xs font-bold ${s.color}`}>
            {s.val} {s.label}
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search signals…"
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-400" />
        </div>
        <select value={filterType} onChange={e => setFilterType(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Types</option>
          {Object.keys(SIGNAL_TYPE_ICONS).map(t => <option key={t} value={t}>{t.replace(/_/g,' ')}</option>)}
        </select>
        <select value={filterDir} onChange={e => setFilterDir(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Directions</option>
          <option value="positive">Positive ↑</option>
          <option value="negative">Negative ↓</option>
          <option value="neutral">Neutral →</option>
        </select>
        <select value={filterConf} onChange={e => setFilterConf(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Confidence</option>
          <option value="confirmed">Confirmed</option>
          <option value="likely">Likely</option>
          <option value="rumored">Rumored</option>
        </select>
        <button onClick={() => { setSearch(''); setFilterType(''); setFilterDir(''); setFilterConf(''); }}
          className="border border-gray-200 text-gray-500 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
          Reset
        </button>
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
                  {["Type","Signal","Direction","Magnitude","Score","Confidence","Dates","Verified","Status","Actions"].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase text-[10px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr><td colSpan={10} className="py-16 text-center text-gray-400">
                    <p className="text-2xl mb-2">🔔</p>
                    <p className="font-semibold">No signals found</p>
                  </td></tr>
                )}
                {filtered.map(sig => {
                  const typeCfg = SIGNAL_TYPE_ICONS[sig.signalType] || { icon: '⭐', color: 'bg-gray-100 text-gray-600' };
                  const magCfg = MAGNITUDE_CONFIG[sig.impactMagnitude] || MAGNITUDE_CONFIG.medium;
                  const confCfg = CONFIDENCE_CONFIG[sig.confidence] || CONFIDENCE_CONFIG.likely;
                  return (
                    <tr key={sig.id} className={`hover:bg-gray-50 ${!sig.isActive ? 'opacity-50' : ''}`}>
                      <td className="px-3 py-3">
                        <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${typeCfg.color}`}>
                          {typeCfg.icon}
                        </span>
                      </td>
                      <td className="px-3 py-3 max-w-[180px]">
                        <p className="font-bold text-gray-900 truncate">{sig.title}</p>
                        <p className="text-gray-400 truncate">{sig.description?.slice(0, 50)}</p>
                      </td>
                      <td className="px-3 py-3">
                        {sig.impactDirection === 'positive' ? <span className="text-green-600 font-black">↑</span> :
                         sig.impactDirection === 'negative' ? <span className="text-red-600 font-black">↓</span> :
                         <span className="text-gray-400 font-black">→</span>}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${magCfg.color}`}>{magCfg.label}</span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`font-black text-sm ${(sig.impactScore || 0) > 0 ? 'text-green-600' : (sig.impactScore || 0) < 0 ? 'text-red-600' : 'text-gray-400'}`}>
                          {(sig.impactScore || 0) > 0 ? '+' : ''}{sig.impactScore || 0}
                        </span>
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${confCfg.color}`}>{confCfg.label}</span>
                      </td>
                      <td className="px-3 py-3 text-gray-400 whitespace-nowrap">
                        {sig.signalDate || '—'}
                      </td>
                      <td className="px-3 py-3">
                        {sig.isVerified
                          ? <CheckCircle size={14} className="text-green-500" />
                          : <button onClick={() => handleVerify(sig)} className="text-xs text-blue-500 font-bold hover:underline">Verify</button>
                        }
                      </td>
                      <td className="px-3 py-3">
                        <button onClick={() => handleToggleActive(sig)}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sig.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                          {sig.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <div className="flex gap-0.5">
                          <button onClick={() => { setEditSignal(sig); setShowModal(true); }}
                            className="p-1.5 hover:bg-orange-50 text-orange-400 rounded text-xs">✏️</button>
                          <button onClick={() => handleDelete(sig.id)}
                            className="p-1.5 hover:bg-red-50 text-red-400 rounded text-xs">🗑</button>
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

      {showModal && (
        <SignalModal
          signal={editSignal}
          onClose={() => { setShowModal(false); setEditSignal(null); }}
          onSaved={fetchSignals}
        />
      )}
    </div>
  );
}