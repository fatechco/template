import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { Shield, RefreshCw, Trash2, Edit3, ChevronDown, ChevronRight, Zap, TrendingUp, AlertTriangle, Lightbulb, Clock, MapPin, DollarSign, Monitor, MessageCircle, BookOpen, Home, Activity } from "lucide-react";

const DNA_DIMENSIONS = [
  {
    key: "propertyDNA",
    icon: "🏠",
    iconComponent: Home,
    label: "Property Preferences",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-200",
    completenessKey: ["preferredTypes", "preferredSizes", "preferredFeatures"],
    getItems: (dna) => [
      dna?.preferredTypes?.length > 0 ? `Types: ${dna.preferredTypes.slice(0,2).map(t => t.type).join(', ')}` : null,
      dna?.preferredSizes?.sweet_spot ? `Typical size: ${dna.preferredSizes.sweet_spot} m²` : null,
      dna?.preferredFeatures?.length > 0 ? `Likes: ${dna.preferredFeatures.slice(0,2).map(f => f.feature).join(', ')}` : null,
    ].filter(Boolean)
  },
  {
    key: "financialDNA",
    icon: "💰",
    iconComponent: DollarSign,
    label: "Financial Behavior",
    color: "text-green-600",
    bg: "bg-green-50",
    border: "border-green-200",
    completenessKey: ["budgetRange", "paymentMethodPreference"],
    getItems: (dna) => [
      dna?.budgetRange?.min ? `Budget: ${(dna.budgetRange.min / 1000000).toFixed(1)}M - ${(dna.budgetRange.max / 1000000).toFixed(1)}M EGP` : null,
      dna?.paymentMethodPreference ? `Payment: ${dna.paymentMethodPreference}` : null,
      dna?.negotiationTendency ? `Negotiation: ${dna.negotiationTendency}` : null,
    ].filter(Boolean)
  },
  {
    key: "timingDNA",
    icon: "🕐",
    iconComponent: Clock,
    label: "Activity Timing",
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    completenessKey: ["mostActiveHour", "mostActiveDayOfWeek", "mostActiveDevice"],
    getItems: (dna) => {
      const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      return [
        dna?.mostActiveHour !== undefined ? `Most active: ${dna.mostActiveHour}:00 - ${dna.mostActiveHour + 1}:00` : null,
        dna?.mostActiveDayOfWeek !== undefined ? `Best day: ${days[dna.mostActiveDayOfWeek] || 'Unknown'}` : null,
        dna?.mostActiveDevice ? `Device: Mostly ${dna.mostActiveDevice}` : null,
        dna?.avgSessionsPerWeek ? `Sessions: ~${dna.avgSessionsPerWeek}/week` : null,
      ].filter(Boolean);
    }
  },
  {
    key: "geographicDNA",
    icon: "🌍",
    iconComponent: MapPin,
    label: "Geographic Focus",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    completenessKey: ["targetCities", "targetDistricts"],
    getItems: (dna) => [
      dna?.targetCities?.length > 0 ? `Target cities: ${dna.targetCities.slice(0,2).map(c => c.cityId).join(', ')}` : null,
      dna?.geoExpansionTrend ? `Search trend: ${dna.geoExpansionTrend}` : null,
    ].filter(Boolean)
  },
  {
    key: "intentDNA",
    icon: "🎯",
    iconComponent: Activity,
    label: "Intent & Goals",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200",
    completenessKey: ["primaryIntent", "urgencyLevel", "buyerStage"],
    getItems: (dna) => [
      dna?.primaryIntent ? `Primary intent: ${dna.primaryIntent}` : null,
      dna?.urgencyLevel ? `Urgency: ${dna.urgencyLevel}` : null,
      dna?.buyerStage ? `Buyer stage: ${dna.buyerStage}` : null,
      dna?.lifeStage ? `Life stage: ${dna.lifeStage}` : null,
    ].filter(Boolean)
  },
  {
    key: "platformDNA",
    icon: "📱",
    iconComponent: Monitor,
    label: "Platform Usage",
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-200",
    completenessKey: ["featuresUsed", "moduleUsage"],
    getItems: (dna) => [
      dna?.featuresUsed?.length > 0 ? `Features used: ${dna.featuresUsed.slice(0,2).map(f => f.feature).join(', ')}` : null,
      dna?.moduleUsage?.lastActiveModule ? `Active in: ${dna.moduleUsage.lastActiveModule}` : null,
      dna?.uiComplexityPreference ? `UI preference: ${dna.uiComplexityPreference}` : null,
    ].filter(Boolean)
  },
  {
    key: "communicationDNA",
    icon: "🤝",
    iconComponent: MessageCircle,
    label: "Communication",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-200",
    completenessKey: ["preferredChannel", "messageFrequencyPreference"],
    getItems: (dna) => [
      dna?.preferredChannel ? `Channel: ${dna.preferredChannel}` : null,
      dna?.messageFrequencyPreference ? `Frequency: ${dna.messageFrequencyPreference}` : null,
      dna?.responsiveness ? `Responsiveness: ${dna.responsiveness}` : null,
    ].filter(Boolean)
  },
  {
    key: "learningDNA",
    icon: "🧠",
    iconComponent: BookOpen,
    label: "Learning Style",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    completenessKey: ["preferredContentType", "knowledgeLevel"],
    getItems: (dna) => [
      dna?.preferredContentType ? `Content type: ${dna.preferredContentType}` : null,
      dna?.knowledgeLevel ? `Knowledge level: ${dna.knowledgeLevel}` : null,
      dna?.coachInteractionStyle ? `Coach style: ${dna.coachInteractionStyle}` : null,
    ].filter(Boolean)
  }
];

const INSIGHT_TYPE_STYLES = {
  behavior_pattern: { border: "border-l-blue-500", badge: "bg-blue-100 text-blue-700", icon: "🕐", label: "Pattern Detected" },
  opportunity: { border: "border-l-green-500", badge: "bg-green-100 text-green-700", icon: "💡", label: "Opportunity" },
  intent_shift: { border: "border-l-purple-500", badge: "bg-purple-100 text-purple-700", icon: "🔄", label: "Intent Shift" },
  churn_risk: { border: "border-l-orange-500", badge: "bg-orange-100 text-orange-700", icon: "⏰", label: "Heads Up" },
  contradiction: { border: "border-l-red-500", badge: "bg-red-100 text-red-700", icon: "⚠️", label: "Contradiction" },
  preference_discovered: { border: "border-l-teal-500", badge: "bg-teal-100 text-teal-700", icon: "✨", label: "Discovery" },
};

function DimensionCard({ dim, dnaData }) {
  const [expanded, setExpanded] = useState(false);
  const data = dnaData?.[dim.key] || null;
  const items = dim.getItems(data);
  const completeness = data ? Math.min(100, Math.round((Object.keys(data).filter(k => data[k] !== null && data[k] !== undefined).length / Math.max(dim.completenessKey.length, 1)) * 100)) : 0;

  return (
    <div className={`bg-white rounded-2xl border ${expanded ? dim.border : 'border-gray-100'} shadow-sm p-5 transition-all`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center gap-3 text-left">
        <span className="text-3xl flex-shrink-0">{dim.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="font-black text-gray-900 text-sm">{dim.label}</p>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex-1 bg-gray-200 rounded-full h-1.5">
              <div className={`h-1.5 rounded-full transition-all bg-current ${dim.color}`} style={{ width: `${completeness}%` }} />
            </div>
            <span className="text-[10px] text-gray-400 font-bold">{completeness}%</span>
          </div>
        </div>
        {items.length > 0 ? (expanded ? <ChevronDown size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronRight size={16} className="text-gray-400 flex-shrink-0" />) : null}
      </button>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {items.length > 0 ? (
            <ul className="space-y-2">
              {items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-xs mt-0.5">•</span> {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-gray-400 italic">No data collected yet. Keep using Kemedar to build this dimension.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyDNA() {
  const [dna, setDna] = useState(null);
  const [insights, setInsights] = useState([]);
  const [totalSignals, setTotalSignals] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recalculating, setRecalculating] = useState(false);
  const [personalizationToggles, setPersonalizationToggles] = useState({
    homepage: true, search: true, notifications: true, coach: true, matching: true
  });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await base44.functions.invoke('getMyDNA', {});
    if (res.data) {
      setDna(res.data.dna);
      setInsights(res.data.insights || []);
      setTotalSignals(res.data.totalSignals || 0);
    }
    setLoading(false);
  };

  const handleRecalculate = async () => {
    setRecalculating(true);
    await base44.functions.invoke('recalculateDNA', {});
    await loadData();
    setRecalculating(false);
  };

  const completeness = dna?.dnaCompleteness || 0;

  const missingItems = [
    !dna?.intentDNA?.primaryIntent && { label: "Complete Advisor profile", impact: "+15%", link: "/kemedar/advisor/survey" },
    (dna?.propertyDNA?.preferredTypes?.length || 0) < 3 && { label: "Save 10+ properties", impact: "+10%", link: "/kemedar/search-properties" },
    !dna?.communicationDNA?.preferredChannel && { label: "Set communication preferences", impact: "+8%", link: "/dashboard/settings" },
    !dna?.learningDNA?.knowledgeLevel && { label: "Start your Coach journey", impact: "+7%", link: "/kemedar/coach" },
  ].filter(Boolean);

  if (loading) return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-gray-900 flex items-center gap-2">
            🧬 Your Kemedar DNA™
          </h1>
          <p className="text-gray-500 mt-1">How we personalize your experience across Kemedar, Kemework & Kemetro</p>
        </div>
        <button onClick={handleRecalculate} disabled={recalculating}
          className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl text-sm disabled:opacity-50 transition-colors">
          <RefreshCw size={16} className={recalculating ? "animate-spin" : ""} />
          {recalculating ? "Recalculating..." : "Refresh DNA"}
        </button>
      </div>

      {/* Philosophy Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5 flex gap-4">
        <Shield className="text-blue-600 flex-shrink-0 mt-0.5" size={22} />
        <div>
          <p className="font-black text-blue-900 mb-1">🔒 Your data, your control</p>
          <p className="text-blue-800 text-sm leading-relaxed">Kemedar DNA™ is built from your own activity on this platform. We never share it externally. You can see exactly what we know, edit anything incorrect, and delete it at any time.</p>
        </div>
      </div>

      {/* Completeness */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="font-black text-gray-900 text-lg">DNA Completeness</h2>
            <p className="text-gray-500 text-sm">More complete = better personalization</p>
          </div>
          <div className="text-right">
            <p className="text-4xl font-black text-orange-600">{completeness}%</p>
            <p className="text-xs text-gray-400">{totalSignals} signals collected</p>
          </div>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-4 mb-2">
          <div className="bg-gradient-to-r from-orange-400 to-orange-600 h-4 rounded-full transition-all duration-700"
            style={{ width: `${completeness}%` }} />
        </div>
        <div className="flex justify-between text-xs text-gray-400 mb-4">
          <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
        </div>

        {missingItems.length > 0 && (
          <div>
            <p className="text-sm font-bold text-gray-700 mb-2">What's missing:</p>
            <div className="space-y-2">
              {missingItems.map((item, i) => (
                <Link key={i} to={item.link}
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-orange-50 rounded-xl transition-colors group">
                  <p className="text-sm text-gray-700 group-hover:text-orange-700">📋 {item.label}</p>
                  <span className="text-xs font-black text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{item.impact} DNA</span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* DNA Dimensions Grid */}
      <div>
        <h2 className="font-black text-gray-900 text-xl mb-4">Your DNA Dimensions</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {DNA_DIMENSIONS.map(dim => (
            <DimensionCard key={dim.key} dim={dim} dnaData={dna} />
          ))}
        </div>
      </div>

      {/* Predictions */}
      {dna?.predictions && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-gray-900 text-xl mb-4">🔮 AI Predictions About You</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Likely to purchase in", value: dna.predictions.likelyToPurchaseIn ? `~${dna.predictions.likelyToPurchaseIn} days` : "Not yet", icon: "📅" },
              { label: "Buyer stage", value: dna.intentDNA?.buyerStage || "awareness", icon: "🎯" },
              { label: "Churn risk", value: dna.predictions.churnRisk || "low", icon: "⚠️" },
              { label: "Next likely action", value: dna.predictions.nextLikelyAction?.replace(/_/g, ' ') || "browse", icon: "👉" },
            ].map((p, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-2xl mb-1">{p.icon}</p>
                <p className="font-black text-gray-900 text-sm capitalize">{p.value}</p>
                <p className="text-[10px] text-gray-400 mt-0.5">{p.label}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      {insights.length > 0 && (
        <div>
          <h2 className="font-black text-gray-900 text-xl mb-4">🤖 AI Insights About You</h2>
          <div className="space-y-3">
            {insights.map((insight, i) => {
              const style = INSIGHT_TYPE_STYLES[insight.insightType] || INSIGHT_TYPE_STYLES.behavior_pattern;
              return (
                <div key={i} className={`bg-white rounded-2xl border border-gray-100 border-l-4 ${style.border} shadow-sm p-5`}>
                  <div className="flex items-start gap-3">
                    <span className="text-2xl flex-shrink-0">{style.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${style.badge}`}>{style.label}</span>
                        <span className="text-[10px] text-gray-400">{insight.confidence}% confidence</span>
                        <span className={`text-[10px] font-bold ${insight.impact === 'high' ? 'text-red-600' : insight.impact === 'medium' ? 'text-orange-600' : 'text-gray-500'}`}>{insight.impact} impact</span>
                      </div>
                      <p className="font-black text-gray-900 text-sm">{insight.insightTitle}</p>
                      <p className="text-gray-600 text-xs mt-1 leading-relaxed">{insight.insightBody}</p>
                      {insight.actionRecommended && (
                        <div className="mt-3">
                          {insight.actionUrl ? (
                            <Link to={insight.actionUrl} className="text-xs bg-orange-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-orange-600 inline-block">
                              {insight.actionRecommended} →
                            </Link>
                          ) : (
                            <p className="text-xs text-orange-600 font-semibold">💡 {insight.actionRecommended}</p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Privacy Controls */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-black text-gray-900 text-xl mb-1">🔒 Privacy Settings</h2>
        <p className="text-gray-500 text-sm mb-5">Control how your DNA is used across the platform</p>

        <p className="text-sm font-bold text-gray-900 mb-3">What we use your DNA for:</p>
        <div className="space-y-3 mb-6">
          {[
            { key: "homepage", label: "Homepage content personalization" },
            { key: "search", label: "Search result ranking & pre-filled filters" },
            { key: "notifications", label: "Notification timing optimization" },
            { key: "coach", label: "Coach™ content adaptation" },
            { key: "matching", label: "Property matching & ranking" },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
              <span className="text-sm text-gray-700">{item.label}</span>
              <button onClick={() => setPersonalizationToggles(t => ({ ...t, [item.key]: !t[item.key] }))}
                className={`w-12 h-6 rounded-full relative transition-colors ${personalizationToggles[item.key] ? 'bg-orange-500' : 'bg-gray-200'}`}>
                <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 shadow-sm transition-all ${personalizationToggles[item.key] ? 'right-0.5' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </div>

        <p className="text-sm font-bold text-gray-900 mb-3">Reset Options:</p>
        <div className="flex flex-wrap gap-2">
          <button className="flex items-center gap-2 text-xs border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} /> Reset Property DNA
          </button>
          <button className="flex items-center gap-2 text-xs border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-xl hover:bg-gray-50 transition-colors">
            <RefreshCw size={14} /> Reset Communication DNA
          </button>
          <button className="flex items-center gap-2 text-xs border border-red-200 text-red-600 font-bold px-3 py-2 rounded-xl hover:bg-red-50 transition-colors">
            <Trash2 size={14} /> Delete All My DNA
          </button>
        </div>
      </div>
    </div>
  );
}