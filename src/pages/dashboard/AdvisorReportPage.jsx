import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Download, Share2, Edit3, Bell } from "lucide-react";

function ScoreRing({ score, size = 72 }) {
  const r = 28, c = 2 * Math.PI * r;
  const fill = (score / 100) * c;
  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="4" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="#FF6B00" strokeWidth="4"
          strokeDasharray={c} strokeDashoffset={c - fill} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }} />
      </svg>
      <div className="absolute text-center">
        <p className="text-orange-600 font-black text-lg leading-none">{score}</p>
        <p className="text-gray-400 text-[9px]">score</p>
      </div>
    </div>
  );
}

const TABS = ["📋 Profile", "🏗️ Specs", "📍 Locations", "💰 Budget", "🏘️ Matches", "🔔 Alerts", "📊 Market"];

export default function AdvisorReportPage() {
  const { shareToken } = useParams();
  const [report, setReport] = useState(null);
  const [profile, setProfile] = useState(null);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [notifySettings, setNotifySettings] = useState({ app: true, email: true, sms: false, whatsapp: false });

  useEffect(() => {
    (async () => {
      try {
        if (shareToken) {
          const reports = await base44.entities.AdvisorReport.filter({ shareToken });
          if (reports[0]) setReport(reports[0]);
        } else {
          const profileId = localStorage.getItem("kemedar_advisor_profile_id");
          if (profileId) {
            const [profileArr, reportData, matchData] = await Promise.all([
              base44.entities.AdvisorProfile.filter({ id: profileId }),
              base44.entities.AdvisorReport.filter({ profileId }),
              base44.entities.AdvisorMatch.filter({ profileId })
            ]);
            const profileData = profileArr[0] || null;
            setProfile(profileData);
            if (reportData[0]) setReport(reportData[0]);
            setMatches(matchData.sort((a, b) => b.matchScore - a.matchScore));
          }
        }
      } catch (_) {}
      setLoading(false);
    })();
  }, [shareToken]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-10 h-10 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin" />
    </div>
  );

  if (!report) return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center">
      <div className="text-6xl mb-4">🤖</div>
      <h2 className="text-2xl font-black text-gray-900 mb-2">No Advisor Report Yet</h2>
      <p className="text-gray-500 mb-6">Complete the Kemedar Advisor survey to get your personalized property report.</p>
      <Link to="/kemedar/advisor" className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3 rounded-2xl text-sm">
        🤖 Start My Property Match →
      </Link>
    </div>
  );

  const rc = report.reportContent || {};
  const specs = rc.recommendedSpecs || {};
  const locs = rc.recommendedLocations || [];
  const fin = rc.financialAnalysis || {};
  const market = rc.marketInsights || {};
  const snap = report.propertyMatchesSnapshot || [];

  const completionPct = profile?.completionPercent || 92;

  const copyShareLink = () => {
    const url = `${window.location.origin}/kemedar/advisor/report/${report.shareToken}`;
    navigator.clipboard?.writeText(url);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Banner Header */}
      <div className="bg-gradient-to-r from-orange-600 to-orange-400 px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-start justify-between gap-6 flex-wrap">
          <div>
            <p className="text-orange-200 text-xs font-bold mb-1">🏠 Kemedar Advisor</p>
            <h1 className="text-white font-black text-2xl md:text-3xl leading-tight">Your Personalized Property Report</h1>
            <p className="text-orange-100 text-xs mt-1">Generated: {new Date(report.generatedAt || report.created_date).toLocaleDateString()}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center">
              <ScoreRing score={completionPct} />
              <p className="text-orange-100 text-[10px] mt-1">Profile Complete</p>
            </div>
            <div className="flex gap-2">
              {[
                { icon: Share2, label: "Share", onClick: copyShareLink },
                { icon: Edit3, label: "Update", onClick: () => window.location.href = "/kemedar/advisor/survey" },
              ].map(b => (
                <button key={b.label} onClick={b.onClick}
                  className="flex flex-col items-center gap-1 border border-white/40 text-white font-bold px-3 py-2 rounded-xl text-xs hover:bg-white/10 transition-all">
                  <b.icon size={16} />
                  {b.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto flex overflow-x-auto no-scrollbar">
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 px-4 py-3 text-xs font-bold border-b-2 transition-all whitespace-nowrap ${activeTab === i ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">

        {/* TAB 0: Profile Summary */}
        {activeTab === 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900 border-l-4 border-orange-500 pl-3">📋 Your Profile Summary</h2>
              <Link to="/kemedar/advisor/survey" className="text-xs text-orange-500 font-bold">✏️ Update Preferences</Link>
            </div>
            {rc.profileSummary && (
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mb-4">
                <p className="font-bold text-gray-900">{rc.profileSummary.headline}</p>
                <p className="text-sm text-gray-600 mt-1">{rc.profileSummary.description}</p>
              </div>
            )}
            {profile && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {[
                  ["🎯 Purpose", profile.purpose?.toUpperCase()],
                  ["⚡ Urgency", profile.urgency?.replace(/_/g, " ")],
                  ["🏠 Type", (profile.propertyTypes || []).join(", ")],
                  ["🏡 Usage", profile.usageCategory?.replace(/_/g, " ")],
                  ["👥 Household", `${profile.householdCount || "—"} people`],
                  ["💰 Budget", profile.budgetMax ? `${(profile.budgetMin / 1000000).toFixed(1)}M–${(profile.budgetMax / 1000000).toFixed(1)}M ${profile.currency || "EGP"}` : "—"],
                  ["💳 Payment", profile.paymentMethod?.replace(/_/g, " ")],
                  ["🔑 Work", profile.worksFromHome?.replace(/_/g, " ")],
                  ["🚗 Transport", profile.carOwnership?.replace(/_/g, " ")],
                ].map(([label, val]) => val && (
                  <div key={label} className="bg-gray-50 rounded-xl p-3">
                    <p className="text-[10px] text-gray-400 font-bold">{label}</p>
                    <p className="text-sm font-bold text-gray-800 mt-0.5 capitalize">{val}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 1: Specs */}
        {activeTab === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900 border-l-4 border-orange-500 pl-3">🏗️ Recommended Property Specs</h2>
              <span className="bg-purple-100 text-purple-700 text-xs font-black px-2 py-0.5 rounded-full">✨ AI Calculated</span>
            </div>
            <div className="border-2 border-orange-200 rounded-2xl p-5 mb-4 bg-orange-50">
              <div className="grid grid-cols-2 gap-3">
                {[
                  ["Minimum Bedrooms", `${specs.minBedrooms || "—"} (ideally ${specs.idealBedrooms || "—"})`],
                  ["Minimum Bathrooms", specs.minBathrooms || "—"],
                  ["Minimum Area", specs.minAreaSqm ? `${specs.minAreaSqm} m²` : "—"],
                  ["Recommended Floor", specs.recommendedFloor || "—"],
                  ["Furnishing", specs.furnishing?.replace(/_/g, " ") || "—"],
                  ["Parking", specs.parking || "—"],
                ].map(([k, v]) => (
                  <div key={k} className="flex items-center justify-between border-b border-orange-200 pb-2">
                    <span className="text-xs font-bold text-gray-600">{k}:</span>
                    <span className="text-sm font-black text-gray-900">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            {specs.reasoning && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
                <p className="font-bold text-sm text-gray-800 mb-2">🤖 Why these specs:</p>
                <ul className="space-y-1">
                  {specs.reasoning.map((r, i) => <li key={i} className="text-xs text-gray-600">• {r}</li>)}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* TAB 2: Locations */}
        {activeTab === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900 border-l-4 border-orange-500 pl-3">📍 Best Areas For You</h2>
            {locs.map((loc, i) => {
              const medals = ["🥇", "🥈", "🥉"];
              const accents = ["border-orange-400", "border-gray-400", "border-amber-700"];
              return (
                <div key={i} className={`bg-white rounded-2xl shadow-sm border-l-4 ${accents[i]} p-6`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{medals[i]}</span>
                      <div>
                        <h3 className="font-black text-xl text-gray-900">{loc.name}</h3>
                        <p className="text-xs text-gray-400">{loc.commute} commute · {loc.schools}</p>
                      </div>
                    </div>
                    <ScoreRing score={loc.score} size={64} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      {(loc.reasons || []).map((r, j) => <p key={j} className="text-xs text-green-700 flex items-start gap-1 mb-1">✅ {r}</p>)}
                    </div>
                    {loc.tradeoffs && (
                      <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                        <p className="text-xs text-amber-700">⚠️ {loc.tradeoffs}</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: Budget */}
        {activeTab === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900 border-l-4 border-orange-500 pl-3">💰 Financial Analysis</h2>
              <span className="bg-purple-100 text-purple-700 text-xs font-black px-2 py-0.5 rounded-full">✨ AI Calculated</span>
            </div>
            <div className="space-y-3 mb-4">
              {[
                { label: "✅ Comfortable Zone", val: `Up to ${(fin.comfortableZone || 0).toLocaleString()} ${fin.currency || "EGP"}/month`, pct: 80, color: "bg-green-500", bg: "bg-green-50 border-green-200" },
                { label: "⚠️ Stretch Zone", val: `${(fin.comfortableZone || 0).toLocaleString()} – ${(fin.stretchZone || 0).toLocaleString()} ${fin.currency || "EGP"}`, pct: 60, color: "bg-amber-500", bg: "bg-amber-50 border-amber-200" },
                { label: "❌ Risk Zone (not recommended)", val: `Above ${(fin.stretchZone || 0).toLocaleString()} ${fin.currency || "EGP"}`, pct: 30, color: "bg-red-400", bg: "bg-red-50 border-red-200" },
              ].map(z => (
                <div key={z.label} className={`border rounded-xl p-4 ${z.bg}`}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-gray-700">{z.label}</span>
                    <span className="text-sm font-bold text-gray-900">{z.val}</span>
                  </div>
                  <div className="h-2 bg-white/60 rounded-full overflow-hidden">
                    <div className={`h-full ${z.color} rounded-full`} style={{ width: `${z.pct}%` }} />
                  </div>
                </div>
              ))}
            </div>
            {fin.tip && (
              <div className="border border-orange-200 rounded-xl p-4 bg-orange-50">
                <p className="font-bold text-sm text-gray-800 mb-1">💡 Smart Money Tip:</p>
                <p className="text-sm text-gray-700">{fin.tip}</p>
              </div>
            )}
            {fin.installmentEstimate && (
              <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl p-3 text-xs text-blue-700">
                📋 Estimated monthly installment: <strong>{fin.installmentEstimate.toLocaleString()} {fin.currency}/month</strong>
              </div>
            )}
          </div>
        )}

        {/* TAB 4: Matches */}
        {activeTab === 4 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-black text-gray-900 border-l-4 border-orange-500 pl-3">🏘️ Properties Matched For You</h2>
              <span className="text-xs text-gray-400">{snap.length} matches</span>
            </div>
            {snap.length === 0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
                <p className="text-3xl mb-3">🏠</p>
                <p className="font-bold text-gray-700 mb-2">Matches will appear here</p>
                <p className="text-sm text-gray-400">Our system is scanning live listings for your profile</p>
              </div>
            ) : (
              <div className="space-y-4">
                {snap.map((match, i) => (
                  <div key={i} className={`bg-white rounded-2xl shadow-sm border p-5 ${i === 0 ? "border-orange-300 border-2" : "border-gray-100"}`}>
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        {i === 0 && <span className="bg-orange-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full mb-2 inline-block">⭐ Best Match</span>}
                        <h3 className="font-bold text-gray-900">{match.title || `Property #${match.propertyId?.slice(-6)}`}</h3>
                        <p className="text-sm text-orange-600 font-black mt-1">{match.price ? `${(match.price / 1000000).toFixed(1)}M EGP` : "—"}</p>
                        <div className="mt-3 space-y-1">
                          {Object.entries(match.matchBreakdown || {}).filter(([k]) => !["dealBreakerPassed", "noGoPassed"].includes(k)).map(([k, v]) => (
                            <div key={k} className="flex items-center gap-2">
                              <span className="text-[10px] text-gray-400 w-20 capitalize">{k.replace("Score", "")}:</span>
                              <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-orange-400 rounded-full" style={{ width: `${v}%` }} />
                              </div>
                              <span className="text-[10px] font-bold text-gray-600">{Math.round(v)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="text-center flex-shrink-0">
                        <ScoreRing score={Math.round(match.matchScore)} size={64} />
                        <p className="text-[10px] text-gray-400 mt-1">Match</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 5: Alerts */}
        {activeTab === 5 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 border-l-4 border-orange-500 pl-3 mb-4">🔔 Smart Notification Setup</h2>
            <div className="space-y-3 mb-6">
              {[
                { label: "90%+ match listed", freq: "Instant", active: true },
                { label: "80–89% match listed", freq: "Daily digest", active: true },
                { label: "70–79% match listed", freq: "Weekly", active: false },
                { label: "Price drop on saved properties", freq: "Instant", active: true },
                { label: "New development in your areas", freq: "Weekly", active: false },
                { label: "Monthly market report", freq: "Monthly", active: false },
              ].map((row, i) => (
                <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-gray-700">{row.label}</p>
                    <p className="text-xs text-gray-400">{row.freq}</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full transition-all cursor-pointer ${row.active ? "bg-green-500" : "bg-gray-200"}`} />
                </div>
              ))}
            </div>
            <p className="text-xs font-bold text-gray-600 mb-3">Receive via:</p>
            <div className="flex flex-wrap gap-2 mb-6">
              {[["app", "🔔 App"], ["email", "📧 Email"], ["sms", "📱 SMS"], ["whatsapp", "💬 WhatsApp"]].map(([key, label]) => (
                <button key={key} onClick={() => setNotifySettings(p => ({ ...p, [key]: !p[key] }))}
                  className={`px-3 py-2 rounded-full border-2 text-xs font-bold transition-all ${notifySettings[key] ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-500"}`}>
                  {label}
                </button>
              ))}
            </div>
            <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm">
              💾 Save Notification Settings
            </button>
          </div>
        )}

        {/* TAB 6: Market */}
        {activeTab === 6 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-lg font-black text-gray-900 border-l-4 border-orange-500 pl-3 mb-4">📊 Market Insights</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                { label: "Avg Price/m²", val: market.avgPricePerSqm ? `${market.avgPricePerSqm.toLocaleString()} EGP` : "—", sub: "in top location", trend: market.trend6Months },
                { label: "Price Trend", val: market.trend6Months || "—", sub: "last 6 months" },
                { label: "Best Time to Buy", val: "Now →", sub: market.bestTimeAdvice || "Consult market data" },
              ].map(card => (
                <div key={card.label} className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">{card.label}</p>
                  <p className="text-lg font-black text-orange-600 mt-1">{card.val}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">{card.sub}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 bg-white border-t border-gray-100 shadow-lg">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          <span className="text-xs text-gray-400">Last updated: {new Date(report.generatedAt || report.created_date).toLocaleDateString()}</span>
          <div className="flex gap-2">
            <Link to="/kemedar/advisor/survey" className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50">
              <Edit3 size={12} /> Update
            </Link>
            <button onClick={copyShareLink} className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-1.5 rounded-lg text-xs hover:bg-gray-50">
              <Share2 size={12} /> Share
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}