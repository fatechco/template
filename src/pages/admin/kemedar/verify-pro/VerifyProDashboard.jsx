import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const LEVEL_CONFIG = [
  { level: 1, label: "Listed", color: "#94a3b8", bg: "bg-slate-100", text: "text-slate-600" },
  { level: 2, label: "Seller Verified", color: "#f97316", bg: "bg-orange-100", text: "text-orange-600" },
  { level: 3, label: "Doc Verified", color: "#f59e0b", bg: "bg-amber-100", text: "text-amber-600" },
  { level: 4, label: "FO Inspected", color: "#10b981", bg: "bg-emerald-100", text: "text-emerald-600" },
  { level: 5, label: "Fully Verified", color: "#eab308", bg: "bg-yellow-100", text: "text-yellow-700" },
];

const RECORD_ICONS = {
  certificate_issued: "🏅", fo_inspection_completed: "🔍", fraud_flag_raised: "🚨",
  document_ai_analyzed: "🤖", document_fo_verified: "✅", seller_identity_verified: "👤",
  level_upgraded: "⬆️", fo_inspection_scheduled: "📅", document_uploaded: "📄",
};

function timeAgo(dateStr) {
  if (!dateStr) return "";
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 60) return `${Math.round(diff)}s ago`;
  if (diff < 3600) return `${Math.round(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.round(diff / 3600)}h ago`;
  return `${Math.round(diff / 86400)}d ago`;
}

export default function VerifyProDashboard() {
  const [tokens, setTokens] = useState([]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    const [t, r] = await Promise.all([
      base44.entities.PropertyToken.list("-created_date", 200).catch(() => []),
      base44.entities.VerificationRecord.list("-recordedAt", 20).catch(() => []),
    ]);
    setTokens(t);
    setRecords(r);
    setLoading(false);
  };

  const today = new Date().toDateString();
  const totalTokens = tokens.length;
  const level5 = tokens.filter(t => t.verificationLevel >= 5).length;
  const awaitingReview = tokens.filter(t => t.verificationStatus === "in_review").length;
  const fraudAlerts = tokens.filter(t => t.verificationStatus === "fraud_flagged").length;
  const todayCerts = tokens.filter(t => t.certificateIssued && new Date(t.certificateIssuedAt).toDateString() === today).length;

  const levelCounts = LEVEL_CONFIG.map(cfg => ({
    ...cfg,
    count: tokens.filter(t => (t.verificationLevel || 1) === cfg.level).length,
    pct: totalTokens > 0 ? Math.round((tokens.filter(t => (t.verificationLevel || 1) === cfg.level).length / totalTokens) * 100) : 0,
  }));
  const maxCount = Math.max(...levelCounts.map(l => l.count), 1);

  const KPIS = [
    { icon: "🔐", label: "Total Tokens", value: totalTokens, sub: `↑ +${tokens.filter(t => new Date(t.created_date).toDateString() === today).length} minted today`, color: "text-gray-900" },
    { icon: "✅", label: "Level 5 Certified", value: level5, sub: `${totalTokens > 0 ? Math.round(level5 / totalTokens * 100) : 0}% of all tokens`, color: "text-yellow-600" },
    { icon: "⏳", label: "Awaiting Review", value: awaitingReview, sub: "Docs + inspections pending", color: awaitingReview > 0 ? "text-orange-600" : "text-gray-900", alert: awaitingReview > 0 },
    { icon: "🚨", label: "Open Fraud Alerts", value: fraudAlerts, sub: `${fraudAlerts} critical unresolved`, color: fraudAlerts > 0 ? "text-red-600" : "text-gray-900", alert: fraudAlerts > 0 },
    { icon: "💰", label: "Revenue Today", value: `${todayCerts * 299} EGP`, sub: "Certificates today", color: "text-green-600" },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">🔐 Verify Pro Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time verification ecosystem overview</p>
        </div>
        <span className="text-xs text-gray-400">Auto-refreshes every 30s</span>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {KPIS.map((kpi, i) => (
          <div key={i} className={`bg-white rounded-2xl p-5 shadow-sm border ${kpi.alert ? "border-orange-200" : "border-gray-100"}`}>
            <div className="text-2xl mb-2">{kpi.icon}</div>
            <p className={`text-3xl font-black ${kpi.color}`}>{kpi.value}</p>
            <p className="text-xs font-bold text-gray-700 mt-1">{kpi.label}</p>
            <p className="text-[10px] text-gray-400 mt-1">{kpi.sub}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Level Distribution */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-gray-900">Tokens by Verification Level</h2>
            <Link to="/admin/kemedar/verify-pro/tokens" className="text-xs text-orange-500 font-bold hover:underline">View All →</Link>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-8 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : (
            <div className="space-y-3">
              {levelCounts.map(lv => (
                <div key={lv.level} className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.href = `/admin/kemedar/verify-pro/tokens?level=${lv.level}`}>
                  <span className="text-xs font-bold text-gray-500 w-4">{lv.level}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-700 font-semibold">Level {lv.level} — {lv.label}</span>
                      <span className="text-gray-500">{lv.count} ({lv.pct}%)</span>
                    </div>
                    <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all group-hover:opacity-80"
                        style={{ width: `${(lv.count / maxCount) * 100}%`, background: lv.color }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Live Activity Feed */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-black text-gray-900">Live Activity</h2>
            <span className="text-[10px] text-green-600 font-bold flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />LIVE</span>
          </div>
          {loading ? (
            <div className="space-y-3">{[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-gray-100 rounded animate-pulse" />)}</div>
          ) : records.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              <p className="text-3xl mb-2">📡</p>
              <p className="text-sm">No recent activity</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
              {records.map((rec, i) => (
                <div key={i} className="flex items-start gap-3 pb-3 border-b border-gray-50 last:border-0">
                  <span className="text-xl flex-shrink-0">{RECORD_ICONS[rec.recordType] || "📝"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 line-clamp-1">{rec.title || rec.recordType?.replace(/_/g, " ")}</p>
                    <p className="text-[10px] text-gray-400">{rec.actorLabel || "System"} · {timeAgo(rec.recordedAt)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "All Tokens", to: "/admin/kemedar/verify-pro/tokens", icon: "🔐" },
          { label: "Review Documents", to: "/admin/kemedar/verify-pro/documents", icon: "📄", badge: awaitingReview },
          { label: "Inspections", to: "/admin/kemedar/verify-pro/inspections", icon: "🔍" },
          { label: "Fraud Alerts", to: "/admin/kemedar/verify-pro/fraud", icon: "🚨", badge: fraudAlerts, danger: fraudAlerts > 0 },
        ].map(q => (
          <Link key={q.to} to={q.to} className={`flex items-center gap-3 bg-white rounded-xl p-4 shadow-sm border hover:shadow-md transition-all ${q.danger ? "border-red-200" : "border-gray-100"}`}>
            <span className="text-2xl">{q.icon}</span>
            <span className="flex-1 text-sm font-bold text-gray-800">{q.label}</span>
            {q.badge > 0 && <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${q.danger ? "bg-red-100 text-red-600" : "bg-orange-100 text-orange-600"}`}>{q.badge}</span>}
          </Link>
        ))}
      </div>
    </div>
  );
}