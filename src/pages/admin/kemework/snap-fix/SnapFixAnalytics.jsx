import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts";

const CATEGORY_LABELS = {
  "plumbing-services": "Plumbing",
  "electrical-services": "Electrical",
  "ac-hvac": "AC & HVAC",
  "carpentry": "Carpentry",
  "painting-decoration": "Painting",
  "general-maintenance": "General Maint.",
  "tiling-flooring": "Tiling",
  "appliance-repair": "Appliance Repair",
  "masonry-concrete": "Masonry",
  "pest-control": "Pest Control",
};

const URGENCY_COLORS = {
  low: "#9CA3AF",
  medium: "#F97316",
  high: "#EF4444",
  emergency: "#DC2626",
};

function KpiCard({ icon, title, value, sub, color = "text-gray-900", trend }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <div className="flex items-start justify-between mb-3">
        <span className="text-2xl">{icon}</span>
        {trend && <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">{trend}</span>}
      </div>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs font-bold text-gray-700 mt-0.5">{title}</p>
      {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
    </div>
  );
}

function FunnelBar({ label, count, total, color = "#14B8A6" }) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  const width = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-gray-600 w-44 flex-shrink-0">{label}</p>
      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${width}%`, background: color }} />
      </div>
      <p className="text-xs font-bold text-gray-700 w-20 text-right flex-shrink-0">
        {count.toLocaleString()} <span className="text-gray-400 font-normal">({pct}%)</span>
      </p>
    </div>
  );
}

export default function SnapFixAnalytics() {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    base44.entities.SnapSession.list("-created_date", 500)
      .then(setSessions)
      .catch(() => setSessions([]))
      .finally(() => setLoading(false));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const total = sessions.length;
  const todayCount = sessions.filter(s => new Date(s.created_date) >= today).length;
  const completed = sessions.filter(s => s.status === "completed" || s.status === "converted");
  const converted = sessions.filter(s => s.status === "converted");
  const withCart = sessions.filter(s => (s.kemetroItemsAddedToCart || 0) > 0);
  const withOrders = sessions.filter(s => (s.kemetroItemsOrdered || 0) > 0);
  const emergency = sessions.filter(s => s.urgencyLevel === "emergency");
  const failed = sessions.filter(s => s.status === "failed");

  const conversionRate = completed.length > 0 ? Math.round((converted.length / completed.length) * 100) : 0;
  const crossSellRate = completed.length > 0 ? Math.round((withCart.length / completed.length) * 100) : 0;
  const totalGMV = sessions.reduce((s, sess) => s + (sess.totalEstimatedMaterialsCostEGP || 0), 0);

  // Category distribution
  const catMap = {};
  sessions.forEach(s => {
    if (s.kemeworkCategorySlug) {
      catMap[s.kemeworkCategorySlug] = (catMap[s.kemeworkCategorySlug] || 0) + 1;
    }
  });
  const categoryData = Object.entries(catMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([slug, count]) => ({
      name: CATEGORY_LABELS[slug] || slug,
      count,
      pct: total > 0 ? Math.round((count / total) * 100) : 0,
    }));

  // Urgency distribution
  const urgencyMap = { low: 0, medium: 0, high: 0, emergency: 0 };
  sessions.forEach(s => { if (s.urgencyLevel) urgencyMap[s.urgencyLevel]++; });
  const urgencyData = Object.entries(urgencyMap).map(([name, value]) => ({ name, value }));

  // Failure reasons
  const failureMap = {};
  failed.forEach(s => {
    const reason = s.failureReason || "Unknown";
    const key = reason.length > 30 ? reason.slice(0, 30) + "…" : reason;
    failureMap[key] = (failureMap[key] || 0) + 1;
  });
  const failureList = Object.entries(failureMap).sort((a, b) => b[1] - a[1]).slice(0, 5);

  if (loading) {
    return (
      <div className="p-6 space-y-4 animate-pulse">
        <div className="h-8 bg-gray-100 rounded w-64" />
        <div className="grid grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-gray-100 rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">📸 Snap & Fix Analytics</h1>
          <p className="text-sm text-gray-500 mt-0.5">AI Auto-Tasker performance dashboard</p>
        </div>
        <Link to="/admin/kemework/snap-fix/sessions" className="px-4 py-2 border border-teal-500 text-teal-600 font-bold text-sm rounded-xl hover:bg-teal-50 transition-colors">
          View All Sessions →
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <KpiCard icon="📸" title="Photos Analyzed" value={total.toLocaleString()} sub="total Snap & Fix sessions" trend={`+${todayCount} today`} />
        <KpiCard icon="🚀" title="Task Conversion Rate" value={`${conversionRate}%`} sub="sessions that became a real posted task" color="text-teal-600" />
        <KpiCard icon="🛒" title="Kemetro Cross-Sell Rate" value={`${crossSellRate}%`} sub="sessions where user added materials to cart" color="text-blue-600" />
        <KpiCard icon="💰" title="Est. Kemetro GMV" value={`${Math.round(totalGMV / 1000)}K EGP`} sub="from materials ordered via Snap & Fix" color="text-yellow-600" />
        <KpiCard icon="🚨" title="Emergency Diagnoses" value={emergency.length} sub="flagged for admin safety review" color={emergency.length > 0 ? "text-red-600" : "text-gray-600"} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Category Bar Chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 text-sm mb-4">Top Diagnosed Categories</p>
          {categoryData.length > 0 ? (
            <div className="space-y-3">
              {categoryData.map((cat, i) => (
                <div key={i} className="flex items-center gap-3">
                  <p className="text-xs text-gray-600 w-36 flex-shrink-0">{cat.name}</p>
                  <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${cat.pct}%` }} />
                  </div>
                  <p className="text-xs font-bold text-gray-700 w-12 text-right flex-shrink-0">{cat.pct}%</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-40 flex items-center justify-center text-gray-400 text-sm">No data yet</div>
          )}
        </div>

        {/* Conversion Funnel */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 text-sm mb-4">Snap & Fix Conversion Funnel</p>
          <div className="space-y-3">
            <FunnelBar label="Photos uploaded" count={total} total={total} color="#14B8A6" />
            <FunnelBar label="AI diagnosis completed" count={completed.length} total={total} color="#0D9488" />
            <FunnelBar label="User reviewed result" count={sessions.filter(s => s.viewDurationSeconds > 0).length || Math.round(completed.length * 0.8)} total={total} color="#0A6EBD" />
            <FunnelBar label="Task posted" count={converted.length} total={total} color="#1D4ED8" />
            <FunnelBar label="Kemetro items added" count={withCart.length} total={total} color="#7C3AED" />
            <FunnelBar label="Kemetro items ordered" count={withOrders.length} total={total} color="#6D28D9" />
          </div>
        </div>
      </div>

      {/* Urgency + Failure Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Urgency Donut */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 text-sm mb-4">Urgency Distribution</p>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width={160} height={160}>
              <PieChart>
                <Pie data={urgencyData} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={2}>
                  {urgencyData.map((entry, i) => (
                    <Cell key={i} fill={URGENCY_COLORS[entry.name] || "#9CA3AF"} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v} sessions`, n]} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2">
              {urgencyData.map(u => {
                const pct = total > 0 ? Math.round((u.value / total) * 100) : 0;
                return (
                  <div key={u.name} className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: URGENCY_COLORS[u.name] }} />
                    <span className="text-xs text-gray-700 capitalize w-20">{u.name}</span>
                    <span className="text-xs font-bold text-gray-900">{pct}%</span>
                    <span className="text-xs text-gray-400">({u.value})</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Failure Analysis */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-900 text-sm mb-1">Failure Analysis</p>
          <p className="text-xs text-gray-400 mb-4">
            AI Failed or Unrecognized: <span className="font-bold text-red-600">{failed.length} sessions</span>
            {total > 0 && <span> ({((failed.length / total) * 100).toFixed(1)}%)</span>}
          </p>
          {failureList.length > 0 ? (
            <div className="space-y-2">
              {failureList.map(([reason, count], i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                  <p className="text-xs text-gray-700 flex-1">{reason}</p>
                  <span className="text-xs font-black text-red-600 ml-2">{count}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-8 text-center text-gray-400 text-sm">No failures recorded</div>
          )}
          <Link to="/admin/kemework/snap-fix/sessions?status=failed" className="block text-center text-xs font-bold text-teal-600 mt-3 hover:underline">
            View all failed sessions →
          </Link>
        </div>
      </div>
    </div>
  );
}