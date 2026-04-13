import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis } from "recharts";

const SCORE_TABS = [
  { label: "📊 Overview", to: "/admin/kemedar/score" },
  { label: "👥 All Scores", to: "/admin/kemedar/score/users" },
  { label: "📋 Events Log", to: "/admin/kemedar/score/events" },
  { label: "🏅 Badges", to: "/admin/kemedar/score/badges" },
  { label: "⚠️ Violations", to: "/admin/kemedar/score/violations" },
  { label: "⚙️ Settings", to: "/admin/kemedar/score/settings" },
  { label: "🗺️ Architecture", to: "/admin/kemedar/score/architecture" },
];

const GRADE_COLORS = {
  Platinum: "#B8860B", Gold: "#FFD700", Silver: "#C0C0C0",
  Bronze: "#CD7F32", Starter: "#808080", Restricted: "#FF0000"
};

const GRADE_ICONS = { Platinum: "💎", Gold: "🥇", Silver: "🥈", Bronze: "🥉", Starter: "⭐", Restricted: "⚠️" };

const SETTINGS_DEFAULT = {
  platinumThreshold: 850, goldThreshold: 700, silverThreshold: 550,
  bronzeThreshold: 400, starterThreshold: 200,
  decayDays: 180, fullDecayDays: 365, docExpireDays: 365,
  autoRestrict: true, autoNotifyGradeChange: true,
  recalcFrequency: "Daily", showScoreInSearch: true,
  minScoreForListing: 0, minScoreForFlashDeals: 400, minScoreForEscrow: 200
};

export default function AdminScoreOverview() {
  const { pathname } = useLocation();
  const [scores, setScores] = useState([]);
  const [events, setEvents] = useState([]);
  const [badges, setBadges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(SETTINGS_DEFAULT);
  const [search, setSearch] = useState("");

  useEffect(() => {
    Promise.all([
      base44.entities.KemedarScore.list("-updated_date", 200),
      base44.entities.ScoreEvent.list("-created_date", 200),
      base44.entities.ScoreBadge.list("sortOrder", 100),
    ]).then(([s, e, b]) => { setScores(s); setEvents(e); setBadges(b); setLoading(false); });
  }, []);

  const activeTab = SCORE_TABS.find(t => t.to === pathname)?.to || "/admin/kemedar/score";

  // KPIs
  const totalScored = scores.length;
  const platinumCount = scores.filter(s => s.overallGrade === "Platinum").length;
  const goldCount = scores.filter(s => s.overallGrade === "Gold").length;
  const restrictedCount = scores.filter(s => s.isRestricted || s.overallGrade === "Restricted").length;
  const avgScore = scores.length > 0 ? Math.round(scores.reduce((s, x) => s + (x.overallScore || 0), 0) / scores.length) : 0;

  const gradeDistribution = Object.entries(
    scores.reduce((acc, s) => { acc[s.overallGrade || "Starter"] = (acc[s.overallGrade || "Starter"] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name, value }));

  const filtered = scores.filter(s =>
    !search || s.userId?.toLowerCase().includes(search.toLowerCase()) ||
    (s.overallGrade || "").toLowerCase().includes(search.toLowerCase())
  );

  const recentRestricted = scores.filter(s => s.isRestricted).slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">🎯 Kemedar Score™ Admin</h1>

      <div className="flex gap-1 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {SCORE_TABS.map(t => (
          <Link key={t.to} to={t.to}
            className={`px-3 py-2.5 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${activeTab === t.to ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </Link>
        ))}
      </div>

      {/* OVERVIEW */}
      {activeTab === "/admin/kemedar/score" && (
        <>
          {/* KPIs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
            {[
              { label: "Total Scored", val: totalScored, bg: "bg-blue-50", color: "text-blue-600" },
              { label: "💎 Platinum", val: platinumCount, bg: "bg-yellow-50", color: "text-yellow-700" },
              { label: "🥇 Gold", val: goldCount, bg: "bg-amber-50", color: "text-amber-600" },
              { label: "⚠️ Restricted", val: restrictedCount, bg: "bg-red-50", color: "text-red-600" },
              { label: "Avg Score", val: avgScore, bg: "bg-orange-50", color: "text-orange-600" },
            ].map(k => (
              <div key={k.label} className={`${k.bg} rounded-2xl p-4 border border-white shadow-sm`}>
                <p className={`text-2xl font-black ${k.color}`}>{loading ? "—" : k.val}</p>
                <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.label}</p>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Grade distribution */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="font-black text-gray-900 mb-4">Grade Distribution</p>
              <div className="flex gap-4 items-center">
                <div className="w-48 h-48 flex-shrink-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={gradeDistribution} cx="50%" cy="50%" outerRadius={70} dataKey="value">
                        {gradeDistribution.map((entry) => (
                          <Cell key={entry.name} fill={GRADE_COLORS[entry.name] || "#ccc"} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex-1 space-y-2">
                  {gradeDistribution.map(g => (
                    <div key={g.name} className="flex items-center justify-between">
                      <span className="text-sm">{GRADE_ICONS[g.name]} {g.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${(g.value / Math.max(1, totalScored)) * 100}%`, background: GRADE_COLORS[g.name] }} />
                        </div>
                        <span className="text-xs font-bold text-gray-700 w-8 text-right">{g.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Recently Restricted */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-gray-100">
                <p className="font-black text-gray-900">⚠️ Restricted Accounts</p>
              </div>
              {recentRestricted.length === 0 ? (
                <div className="p-6 text-center text-gray-400 text-sm">No restricted accounts — great!</div>
              ) : recentRestricted.map(s => (
                <div key={s.id} className="flex items-center justify-between px-5 py-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-gray-900">{s.userId?.slice(0, 12)}...</p>
                    <p className="text-xs text-gray-400">{s.restrictionReason || "Policy violation"} · Score: {s.overallScore}</p>
                  </div>
                  <button className="text-xs bg-green-100 text-green-700 font-bold px-3 py-1.5 rounded-lg hover:bg-green-200">Review</button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ALL SCORES */}
      {activeTab === "/admin/kemedar/score/users" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by user ID or grade..." className="w-full sm:w-80 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  {["User ID", "Score", "Grade", "Trend", "Violations", "Badges", "Last Calc", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.slice(0, 50).map(s => (
                  <tr key={s.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{s.userId?.slice(0, 12)}...</td>
                    <td className="px-4 py-3 font-black text-gray-900">{s.overallScore}</td>
                    <td className="px-4 py-3">
                      <span className="text-sm">{GRADE_ICONS[s.overallGrade]} {s.overallGrade}</span>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold" style={{ color: s.scoreTrend === "rising" ? "#16a34a" : s.scoreTrend === "falling" ? "#dc2626" : "#6b7280" }}>
                      {s.scoreTrend === "rising" ? "↑ Rising" : s.scoreTrend === "falling" ? "↓ Falling" : "→ Stable"}
                    </td>
                    <td className="px-4 py-3 text-center">{s.activeWarnings || 0}</td>
                    <td className="px-4 py-3 text-center">{(s.earnedBadges || []).length}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{s.lastCalculated ? new Date(s.lastCalculated).toLocaleDateString() : "—"}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-lg">👁 View</button>
                        <button className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded-lg">+ Event</button>
                        {s.isRestricted && <button className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded-lg">✅ Lift</button>}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-400">No scores found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EVENTS LOG */}
      {activeTab === "/admin/kemedar/score/events" && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-gray-100">
            <p className="font-black text-gray-900">Score Events Log ({events.length} events)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  {["Date", "User", "Event Type", "Impact", "Score Before → After", "Entity"].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {events.slice(0, 100).map(e => (
                  <tr key={e.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(e.created_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{e.userId?.slice(0, 10)}...</td>
                    <td className="px-4 py-3 text-xs font-semibold text-gray-700">{e.eventType?.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-black ${(e.scoreImpact || 0) > 0 ? "text-green-600" : "text-red-500"}`}>
                        {e.scoreImpact > 0 ? "+" : ""}{e.scoreImpact} pts
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-500">{e.previousScore} → {e.newScore}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{e.relatedEntityType || "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* BADGES */}
      {activeTab === "/admin/kemedar/score/badges" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">{badges.length} badges defined</p>
            <button className="text-xs bg-orange-500 text-white font-bold px-4 py-2 rounded-xl hover:bg-orange-400">+ Add Badge</button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500 uppercase">
                <tr>
                  {["Badge", "Category", "Requirement", "Active", "Actions"].map(h => (
                    <th key={h} className="text-left px-4 py-3">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {badges.map(b => (
                  <tr key={b.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{b.badgeIcon}</span>
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{b.badgeName}</p>
                          <p className="text-xs text-gray-400 truncate max-w-xs">{b.badgeDescription}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3"><span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">{b.badgeCategory}</span></td>
                    <td className="px-4 py-3 text-xs text-gray-500 capitalize">{b.requirementType?.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold ${b.isActive ? "text-green-600" : "text-gray-400"}`}>{b.isActive ? "✅ Active" : "❌ Off"}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-1 rounded-lg">✏️ Edit</button>
                        <button className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-1 rounded-lg">🎖 Award</button>
                      </div>
                    </td>
                  </tr>
                ))}
                {badges.length === 0 && (
                  <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">No badges yet. Seed them via admin.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIOLATIONS */}
      {activeTab === "/admin/kemedar/score/violations" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="font-black text-gray-900">Active Violations & Restricted Accounts</p>
            </div>
            {recentRestricted.length === 0 ? (
              <div className="p-8 text-center text-gray-400">
                <p className="text-3xl mb-2">✅</p><p className="font-bold">No active restrictions</p>
              </div>
            ) : recentRestricted.map(s => (
              <div key={s.id} className="flex items-center justify-between px-5 py-4 border-b border-gray-50 last:border-0">
                <div>
                  <p className="font-bold text-gray-900">{s.userId?.slice(0, 16)}...</p>
                  <p className="text-xs text-gray-400">{s.restrictionReason || "Violation"} · Score: {s.overallScore} · Warnings: {s.totalWarnings || 0}</p>
                </div>
                <div className="flex gap-2">
                  <button className="text-xs bg-green-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-green-600">✅ Reinstate</button>
                  <button className="text-xs bg-red-100 text-red-700 font-bold px-3 py-1.5 rounded-lg hover:bg-red-200">⚠️ Extend</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETTINGS */}
      {activeTab === "/admin/kemedar/score/settings" && (
        <div className="space-y-5">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="font-black text-gray-900 mb-4">Grade Thresholds</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                ["Platinum threshold", "platinumThreshold"],
                ["Gold threshold", "goldThreshold"],
                ["Silver threshold", "silverThreshold"],
                ["Bronze threshold", "bronzeThreshold"],
                ["Starter threshold", "starterThreshold"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-600 mb-1">{label}</label>
                  <input type="number" value={settings[key]} onChange={e => setSettings(p => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="font-black text-gray-900 mb-4">Decay & Expiry Settings</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {[
                ["Decay negative events after (days)", "decayDays"],
                ["Full removal after (days)", "fullDecayDays"],
                ["Docs expire after (days)", "docExpireDays"],
              ].map(([label, key]) => (
                <div key={key}>
                  <label className="block text-xs font-bold text-gray-600 mb-1">{label}</label>
                  <input type="number" value={settings[key]} onChange={e => setSettings(p => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <p className="font-black text-gray-900 mb-4">Automation & Gating</p>
            <div className="space-y-4">
              {[
                ["Auto-restrict if score < 200", "autoRestrict"],
                ["Auto-notify on grade change", "autoNotifyGradeChange"],
                ["Show score in search results", "showScoreInSearch"],
              ].map(([label, key]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-800">{label}</span>
                  <button onClick={() => setSettings(p => ({ ...p, [key]: !p[key] }))}
                    className={`w-12 h-6 rounded-full relative transition-colors ${settings[key] ? "bg-orange-500" : "bg-gray-200"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow-sm ${settings[key] ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
              {[
                ["Min score for listing", "minScoreForListing"],
                ["Min score for flash deals", "minScoreForFlashDeals"],
                ["Min score for escrow", "minScoreForEscrow"],
              ].map(([label, key]) => (
                <div key={key} className="flex items-center justify-between py-2 border-b border-gray-50">
                  <span className="text-sm text-gray-800">{label}</span>
                  <input type="number" value={settings[key]} onChange={e => setSettings(p => ({ ...p, [key]: Number(e.target.value) }))}
                    className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm text-right focus:outline-none focus:border-orange-400" />
                </div>
              ))}
            </div>
          </div>

          <button className="w-full bg-orange-500 hover:bg-orange-400 text-white font-black py-3 rounded-xl transition-colors">
            💾 Save Settings
          </button>
        </div>
      )}
    </div>
  );
}