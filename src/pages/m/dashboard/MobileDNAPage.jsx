import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { RefreshCw, ChevronDown, ChevronRight, Shield } from "lucide-react";

const DNA_DIMS = [
  { key: "propertyDNA", icon: "🏠", label: "Property Preferences", color: "#FF6B00" },
  { key: "financialDNA", icon: "💰", label: "Financial Behavior", color: "#10B981" },
  { key: "timingDNA", icon: "🕐", label: "Activity Timing", color: "#8B5CF6" },
  { key: "geographicDNA", icon: "🌍", label: "Geographic Focus", color: "#0077B6" },
  { key: "intentDNA", icon: "🎯", label: "Intent & Goals", color: "#EF4444" },
  { key: "platformDNA", icon: "📱", label: "Platform Usage", color: "#0D9488" },
  { key: "communicationDNA", icon: "🤝", label: "Communication", color: "#6366F1" },
  { key: "learningDNA", icon: "🧠", label: "Learning Style", color: "#D97706" },
];

const INSIGHT_ICONS = {
  behavior_pattern: "🕐", opportunity: "💡", intent_shift: "🔄",
  churn_risk: "⏰", contradiction: "⚠️", preference_discovered: "✨"
};

export default function MobileDNAPage() {
  const [dna, setDna] = useState(null);
  const [insights, setInsights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [expandedDim, setExpandedDim] = useState(null);

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await base44.functions.invoke('getMyDNA', {});
    if (res.data) { setDna(res.data.dna); setInsights(res.data.insights || []); }
    setLoading(false);
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    await base44.functions.invoke('recalculateDNA', {});
    await loadData();
    setRecalculating(false);
  };

  const completeness = dna?.dnaCompleteness || 0;
  const radius = 44;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - completeness / 100);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
        <h1 className="font-black text-gray-900 text-lg">🧬 My DNA™</h1>
        <button onClick={handleRecalculate} disabled={recalculating}
          className="text-orange-500 font-bold text-sm flex items-center gap-1">
          <RefreshCw size={14} className={recalculating ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* DNA Ring */}
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm border border-gray-100">
          <svg className="w-32 h-32 mx-auto" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#e5e7eb" strokeWidth="8" />
            <circle cx="50" cy="50" r={radius} fill="none" stroke="#FF6B00" strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={dashOffset}
              strokeLinecap="round" transform="rotate(-90 50 50)" />
            <text x="50" y="54" textAnchor="middle" className="text-xl font-black" fontSize="18" fontWeight="900" fill="#1f2937">{completeness}%</text>
          </svg>
          <p className="font-black text-gray-900 mt-2">DNA Completeness</p>
          <p className="text-xs text-gray-500 mt-0.5">More complete = better personalization</p>
        </div>

        {/* Privacy Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 flex gap-3">
          <Shield size={18} className="text-blue-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-blue-800">Your DNA is built from your own activity. We never share it externally. You can edit or delete it anytime.</p>
        </div>

        {/* Dimension Cards */}
        <div className="space-y-2">
          <h2 className="font-black text-gray-900">DNA Dimensions</h2>
          {DNA_DIMS.map(dim => {
            const data = dna?.[dim.key];
            const completenessVal = data ? Math.min(100, Object.keys(data).length * 12) : 0;
            const isExpanded = expandedDim === dim.key;
            return (
              <button key={dim.key} onClick={() => setExpandedDim(isExpanded ? null : dim.key)}
                className="w-full bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-left transition-all">
                <div className="flex items-center gap-3">
                  <span className="text-2xl flex-shrink-0">{dim.icon}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-900 text-sm">{dim.label}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 rounded-full transition-all" style={{ width: `${completenessVal}%`, backgroundColor: dim.color }} />
                      </div>
                      <span className="text-[10px] text-gray-400 font-bold">{completenessVal}%</span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />}
                </div>
                {isExpanded && data && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <pre className="text-xs text-gray-600 whitespace-pre-wrap overflow-auto max-h-40">
                      {JSON.stringify(data, null, 2)}
                    </pre>
                  </div>
                )}
                {isExpanded && !data && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <p className="text-xs text-gray-400 italic">No data collected yet for this dimension.</p>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Insights */}
        {insights.length > 0 && (
          <div className="space-y-3">
            <h2 className="font-black text-gray-900">🤖 AI Insights</h2>
            {insights.slice(0, 3).map((insight, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="text-xl mb-1">{INSIGHT_ICONS[insight.insightType] || "💡"}</p>
                <p className="font-black text-gray-900 text-sm">{insight.insightTitle}</p>
                <p className="text-xs text-gray-600 mt-1 leading-relaxed">{insight.insightBody}</p>
              </div>
            ))}
          </div>
        )}

        {/* Quick Privacy Toggles */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <h2 className="font-black text-gray-900 mb-3">🔒 Privacy Quick Settings</h2>
          {[
            { label: "Homepage personalization", active: true },
            { label: "Search ranking", active: true },
            { label: "Notification timing", active: true },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{item.label}</span>
              <div className={`w-10 h-5 rounded-full relative ${item.active ? 'bg-orange-500' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${item.active ? 'right-0.5' : 'left-0.5'}`} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}