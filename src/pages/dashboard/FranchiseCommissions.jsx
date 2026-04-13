import { useState, useEffect, useMemo } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";

const STATUS_CONFIG = {
  pending:  { label: "Pending",  color: "bg-yellow-100 text-yellow-700" },
  approved: { label: "Approved", color: "bg-blue-100 text-blue-700" },
  paid:     { label: "Paid",     color: "bg-green-100 text-green-700" },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-600" },
};

const SOURCE_CONFIG = {
  subscription:  { label: "Subscription",  color: "bg-purple-100 text-purple-700", icon: "💎" },
  service_order: { label: "Service Order", color: "bg-orange-100 text-orange-700", icon: "🛍" },
};

const MONTH_COLORS = ["#f97316","#fb923c","#fdba74","#fed7aa","#ffedd5","#ea580c","#c2410c","#9a3412","#7c2d12","#f59e0b","#fbbf24","#fde68a"];

function buildMonthlyData(commissions) {
  const now = new Date();
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - 5 + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = d.toLocaleString("default", { month: "short" });
    const earned = commissions.filter(c => c.status === "paid" && c.created_date?.startsWith(key))
      .reduce((s, c) => s + (c.commissionAmount || 0), 0);
    return { name: label, Earned: earned };
  });
}

export default function FranchiseCommissions() {
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [me, setMe] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSource, setFilterSource] = useState("");

  useEffect(() => {
    base44.auth.me().then(setMe).catch(() => {});
  }, []);

  useEffect(() => {
    if (!me) return;
    setLoading(true);
    base44.entities.FranchiseCommission.filter({ franchiseOwnerId: me.id })
      .then(data => { setCommissions(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [me]);

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const stats = useMemo(() => {
    const total = commissions.reduce((s, c) => s + (c.commissionAmount || 0), 0);
    const pending = commissions.filter(c => c.status === "pending").reduce((s, c) => s + (c.commissionAmount || 0), 0);
    const thisMonth = commissions.filter(c => c.created_date && new Date(c.created_date) >= monthStart).reduce((s, c) => s + (c.commissionAmount || 0), 0);
    const available = commissions.filter(c => c.status === "approved").reduce((s, c) => s + (c.commissionAmount || 0), 0);
    return { total, pending, thisMonth, available };
  }, [commissions]);

  const monthlyData = useMemo(() => buildMonthlyData(commissions), [commissions]);

  const filtered = commissions.filter(c => {
    if (filterStatus && c.status !== filterStatus) return false;
    if (filterSource && c.sourceType !== filterSource) return false;
    return true;
  }).sort((a, b) => new Date(b.created_date) - new Date(a.created_date));

  const kpis = [
    { icon: "💸", label: "Total Earned",           value: `$${stats.total.toFixed(2)}`,     color: "text-gray-900",   bg: "bg-gray-50" },
    { icon: "⏳", label: "Pending Payout",          value: `$${stats.pending.toFixed(2)}`,    color: "text-yellow-700", bg: "bg-yellow-50" },
    { icon: "📅", label: "This Month",              value: `$${stats.thisMonth.toFixed(2)}`,  color: "text-green-600",  bg: "bg-green-50" },
    { icon: "✅", label: "Available for Withdrawal",value: `$${stats.available.toFixed(2)}`,  color: "text-blue-600",   bg: "bg-blue-50" },
  ];

  return (
    <div className="p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Commissions</h1>
        <p className="text-gray-500 text-sm">{filtered.length} commission records</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map(k => (
          <div key={k.label} className={`${k.bg} rounded-xl p-4 border border-white shadow-sm`}>
            <div className="text-2xl mb-1">{k.icon}</div>
            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-500 font-semibold mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Monthly Chart */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <h3 className="text-sm font-black text-gray-700 mb-4">📊 Monthly Earnings (last 6 months)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={monthlyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${v}`} />
            <Tooltip formatter={v => `$${v.toFixed(2)}`} />
            <Bar dataKey="Earned" radius={[4, 4, 0, 0]}>
              {monthlyData.map((_, i) => <Cell key={i} fill={MONTH_COLORS[i % MONTH_COLORS.length]} />)}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Statuses</option>
          {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
        <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
          <option value="">All Sources</option>
          <option value="subscription">Subscription</option>
          <option value="service_order">Service Order</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="py-16 text-center text-gray-400">
            <div className="w-6 h-6 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-3" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Date","Source","Related","Gross Amount","Commission %","My Earning","Status","Payout Date"].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px] whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-16 text-center text-gray-400">
                    <p className="text-2xl mb-2">💸</p>
                    <p>No commission records yet</p>
                  </td></tr>
                )}
                {filtered.map(c => {
                  const statusCfg = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
                  const srcCfg = SOURCE_CONFIG[c.sourceType] || { label: c.sourceType, color: "bg-gray-100 text-gray-600", icon: "📦" };
                  return (
                    <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-3 py-3 text-gray-500 whitespace-nowrap">
                        {c.created_date ? new Date(c.created_date).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${srcCfg.color}`}>
                          {srcCfg.icon} {srcCfg.label}
                        </span>
                      </td>
                      <td className="px-3 py-3 font-mono text-[10px] text-gray-500">
                        {c.subscriptionId?.slice(-6) || c.serviceOrderId?.slice(-6) || "—"}
                      </td>
                      <td className="px-3 py-3 font-bold text-gray-800">${(c.grossAmount || 0).toFixed(2)}</td>
                      <td className="px-3 py-3 font-bold text-purple-600">{c.commissionPercent}%</td>
                      <td className="px-3 py-3 font-black text-green-700">${(c.commissionAmount || 0).toFixed(2)}</td>
                      <td className="px-3 py-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
                      </td>
                      <td className="px-3 py-3 text-gray-500 whitespace-nowrap">{c.paidDate || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}