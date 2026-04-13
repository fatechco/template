import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Lock, AlertTriangle, TrendingUp, CheckCircle, Search, Loader2, Eye, DollarSign } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

function fmt(n) { return n ? Number(n).toLocaleString() : "0"; }

const STATUS_CONFIG = {
  awaiting_deposit: { label: "Awaiting Deposit", color: "bg-blue-100 text-blue-700" },
  deposit_received: { label: "Deposit Received", color: "bg-teal-100 text-teal-700" },
  in_progress: { label: "In Progress", color: "bg-orange-100 text-orange-700" },
  completed: { label: "Completed", color: "bg-green-100 text-green-700" },
  disputed: { label: "Disputed", color: "bg-red-100 text-red-700" },
  cancelled: { label: "Cancelled", color: "bg-gray-100 text-gray-500" },
};

const MOCK_CHART = [
  { day: "Mon", deposits: 1200000, releases: 800000, refunds: 0 },
  { day: "Tue", deposits: 2100000, releases: 1500000, refunds: 100000 },
  { day: "Wed", deposits: 900000, releases: 2200000, refunds: 0 },
  { day: "Thu", deposits: 3400000, releases: 1200000, refunds: 250000 },
  { day: "Fri", deposits: 1800000, releases: 1900000, refunds: 0 },
  { day: "Sat", deposits: 2600000, releases: 700000, refunds: 150000 },
  { day: "Sun", deposits: 1100000, releases: 3100000, refunds: 0 },
];

export default function AdminEscrowOverview() {
  const [deals, setDeals] = useState([]);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("deals");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    Promise.all([
      base44.entities.EscrowDeal.list('-created_date', 200),
      base44.entities.EscrowDispute.list('-created_date', 100)
    ]).then(([d, dis]) => {
      setDeals(d);
      setDisputes(dis);
    }).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const totalValue = deals.reduce((s, d) => s + (d.agreedPrice || 0), 0);
  const activeCount = deals.filter(d => d.status === "in_progress").length;
  const completedThisMonth = deals.filter(d => d.status === "completed" && new Date(d.created_date) > new Date(Date.now() - 30 * 86400000)).length;
  const openDisputes = disputes.filter(d => !["closed", "resolved_buyer_wins", "resolved_seller_wins", "resolved_split"].includes(d.status)).length;
  const platformRevenue = deals.filter(d => d.status === "completed").reduce((s, d) => s + (d.platformFeeAmount || 0), 0);

  const filteredDeals = deals.filter(d => {
    if (statusFilter !== "all" && d.status !== statusFilter) return false;
    if (search && !(d.dealNumber || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const filteredDisputes = disputes.filter(d => {
    if (search && !(d.disputeNumber || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Lock className="w-6 h-6 text-orange-500" /> Escrow™ Admin</h1>
          <p className="text-gray-500 text-sm">{deals.length} total deals</p>
        </div>
        <Link to="/kemedar/escrow/new" className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm">
          + New Deal
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {[
          { label: "Total Escrow Value", value: `${fmt(totalValue)} EGP`, icon: DollarSign, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Active Deals", value: activeCount, icon: Lock, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Completed (30d)", value: completedThisMonth, icon: CheckCircle, color: "text-green-600", bg: "bg-green-50" },
          { label: "Active Disputes", value: openDisputes, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Platform Revenue", value: `${fmt(platformRevenue)} EGP`, icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((kpi, i) => {
          const Icon = kpi.icon;
          return (
            <div key={i} className={`${kpi.bg} rounded-2xl p-4`}>
              <Icon className={`w-5 h-5 ${kpi.color} mb-2`} />
              <p className={`text-2xl font-black ${kpi.color}`}>{kpi.value}</p>
              <p className="text-xs text-gray-500">{kpi.label}</p>
            </div>
          );
        })}
      </div>

      {/* Chart */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <h2 className="font-black text-gray-900 mb-4">Transaction Volume (7 days)</h2>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={MOCK_CHART}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="day" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={v => `${(v / 1000000).toFixed(1)}M`} />
            <Tooltip formatter={v => `${(v).toLocaleString()} EGP`} />
            <Bar dataKey="deposits" fill="#f97316" radius={[4, 4, 0, 0]} name="Deposits" />
            <Bar dataKey="releases" fill="#22c55e" radius={[4, 4, 0, 0]} name="Releases" />
            <Bar dataKey="refunds" fill="#ef4444" radius={[4, 4, 0, 0]} name="Refunds" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Urgent disputes */}
      {disputes.filter(d => d.status === "open" && new Date(d.created_date) < new Date(Date.now() - 10 * 86400000)).length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0" />
          <p className="font-bold text-red-700 text-sm">
            {disputes.filter(d => d.status === "open").length} disputes older than 10 days require urgent attention
          </p>
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-gray-200">
        {[
          { id: "deals", label: `📋 All Deals (${deals.length})` },
          { id: "disputes", label: `⚠️ Disputes (${openDisputes})` },
        ].map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)}
            className={`px-4 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-3 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search deal # or dispute #..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400" />
        </div>
        {activeTab === "deals" && (
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none">
            <option value="all">All Statuses</option>
            {Object.entries(STATUS_CONFIG).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12"><Loader2 className="w-8 h-8 animate-spin text-orange-500 mx-auto" /></div>
      ) : activeTab === "deals" ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Deal #", "Amount", "Status", "Progress", "Disputed?", "Created", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDeals.slice(0, 50).map(deal => {
                const sCfg = STATUS_CONFIG[deal.status] || STATUS_CONFIG.in_progress;
                return (
                  <tr key={deal.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{deal.dealNumber}</td>
                    <td className="px-4 py-3 font-black text-orange-600">{fmt(deal.agreedPrice)} EGP</td>
                    <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${sCfg.color}`}>{sCfg.label}</span></td>
                    <td className="px-4 py-3">
                      <div className="w-20 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500 rounded-full" style={{ width: `${deal.completionPercent || 0}%` }} />
                      </div>
                    </td>
                    <td className="px-4 py-3">{deal.isDisputed ? <span className="text-red-500 font-bold text-xs">⚠️ Yes</span> : <span className="text-gray-300 text-xs">—</span>}</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{new Date(deal.created_date).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <Link to={`/kemedar/escrow/${deal.id}`} className="text-orange-600 hover:text-orange-700 font-bold text-xs flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredDeals.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No deals found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Dispute #", "Type", "Amount", "Raised by", "Days Open", "AI Status", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-[10px] font-black text-gray-400 uppercase">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDisputes.map(d => {
                const daysOpen = Math.floor((Date.now() - new Date(d.created_date)) / 86400000);
                return (
                  <tr key={d.id} className={`hover:bg-gray-50 ${daysOpen > 10 ? "bg-red-50/30" : ""}`}>
                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{d.disputeNumber}</td>
                    <td className="px-4 py-3 text-xs text-gray-700">{(d.disputeType || "").replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 font-bold text-red-600 text-xs">{fmt(d.amountDisputed)} EGP</td>
                    <td className="px-4 py-3 text-xs capitalize">{d.raisedBy}</td>
                    <td className={`px-4 py-3 font-bold text-xs ${daysOpen > 10 ? "text-red-600" : "text-gray-600"}`}>{daysOpen}d</td>
                    <td className="px-4 py-3 text-xs">
                      <span className={`font-bold ${d.aiEvaluationStatus === "evaluated" ? "text-green-600" : d.aiEvaluationStatus === "analyzing" ? "text-orange-600" : "text-gray-400"}`}>
                        {d.aiEvaluationStatus || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs capitalize text-gray-600">{(d.status || "").replace(/_/g, " ")}</td>
                    <td className="px-4 py-3">
                      <Link to={`/kemedar/escrow/${d.dealId}/dispute/${d.id}`} className="text-orange-600 hover:text-orange-700 font-bold text-xs flex items-center gap-1">
                        <Eye className="w-3 h-3" /> View
                      </Link>
                    </td>
                  </tr>
                );
              })}
              {filteredDisputes.length === 0 && (
                <tr><td colSpan={8} className="px-4 py-12 text-center text-gray-400">No disputes found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}