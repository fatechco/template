import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Clock, Users, DollarSign, AlertCircle, TrendingUp, RefreshCw, Play, Pause, Trash2 } from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function AdminAuctionsOverview() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadData();
    const interval = setInterval(() => setRefreshing(true), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (refreshing) {
      loadData();
      setRefreshing(false);
    }
  }, [refreshing]);

  const loadData = async () => {
    const data = await base44.entities.PropertyAuction.list("-created_date", 500);
    setAuctions(data);
    setLoading(false);
  };

  const liveCount = auctions.filter(a => a.status === "live").length;
  const pendingCount = auctions.filter(a => a.status === "pending_review").length;
  const totalGMV = auctions.filter(a => a.status === "completed").reduce((s, a) => s + (a.winnerBidEGP || 0), 0);
  const thisMonthBids = auctions.filter(a => new Date(a.created_date) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).reduce((s, a) => s + (a.totalBids || 0), 0);
  const awaitingPayment = auctions.filter(a => a.status === "awaiting_payment").length;
  const commissionRevenue = totalGMV * 0.02;

  const oldest = auctions.filter(a => a.status === "pending_review").length > 0
    ? Math.floor((Date.now() - new Date(auctions.filter(a => a.status === "pending_review")[0].created_date).getTime()) / (24 * 60 * 60 * 1000))
    : 0;

  const gmvData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date();
    d.setMonth(d.getMonth() - (5 - i));
    const month = d.toLocaleDateString("en-US", { month: "short" });
    const startDate = new Date(d.getFullYear(), d.getMonth(), 1);
    const endDate = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    const value = auctions.filter(a => a.status === "completed" && new Date(a.winnerPaymentCompletedAt) >= startDate && new Date(a.winnerPaymentCompletedAt) <= endDate).reduce((s, a) => s + (a.winnerBidEGP || 0), 0);
    return { month, value };
  });

  const statusDist = {
    "Live": auctions.filter(a => a.status === "live").length,
    "Scheduled": auctions.filter(a => a.status === "scheduled").length,
    "Registration": auctions.filter(a => a.status === "registration").length,
    "Completed": auctions.filter(a => a.status === "completed").length,
    "Failed": auctions.filter(a => a.status === "failed").length,
    "Cancelled": auctions.filter(a => a.status === "cancelled").length,
  };

  const statusDistData = Object.entries(statusDist).map(([name, value]) => ({ name, value })).filter(d => d.value > 0);
  const colors = ["#ef4444", "#3b82f6", "#f59e0b", "#10b981", "#8b5cf6", "#6b7280"];

  const liveAuctions = auctions.filter(a => a.status === "live").sort((a, b) => new Date(b.auctionStartAt) - new Date(a.auctionStartAt));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">🔨 KemedarBid™ Overview</h1>
        <button onClick={() => setRefreshing(true)} disabled={refreshing} className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-red-600 text-white font-bold text-xs hover:bg-red-700 disabled:opacity-60">
          <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} /> Refresh
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-6 gap-3">
        {[
          { label: "Live Auctions", val: liveCount, sub: `${auctions.filter(a => a.status === "live").reduce((s, a) => s + a.totalUniqueBidders, 0)} bidders active`, icon: "🔴", color: "bg-red-50" },
          { label: "Pending Review", val: pendingCount, sub: `Oldest: ${oldest} days ago`, icon: "📋", color: pendingCount > 0 ? "bg-orange-50" : "bg-gray-50", textColor: pendingCount > 0 ? "text-orange-600" : "" },
          { label: "Total Auction GMV", val: fmt(totalGMV) + " EGP", sub: "all time completed", icon: "💰", color: "bg-yellow-50", textColor: "text-yellow-700" },
          { label: "Total Bids Placed", val: auctions.reduce((s, a) => s + a.totalBids, 0), sub: `this month: ${thisMonthBids}`, icon: "🔨", color: "bg-blue-50" },
          { label: "Awaiting Payment", val: awaitingPayment, sub: "Winners must pay in 48h", icon: "⏰", color: awaitingPayment > 0 ? "bg-red-50" : "bg-gray-50", textColor: awaitingPayment > 0 ? "text-red-600" : "" },
          { label: "Platform Commission", val: fmt(commissionRevenue) + " EGP", sub: "this month", icon: "💳", color: "bg-purple-50", textColor: "text-purple-700" },
        ].map(k => (
          <div key={k.label} className={`${k.color} rounded-xl p-4 border border-white shadow-sm`}>
            <p className="text-xs text-gray-500 font-bold mb-1">{k.icon} {k.label}</p>
            <p className={`text-2xl font-black text-gray-900 ${k.textColor}`}>{k.val}</p>
            <p className="text-[11px] text-gray-500 mt-1">{k.sub}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 text-sm mb-4">Auction GMV Over Time</p>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={gmvData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#ef4444" fill="#fee2e2" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <p className="font-bold text-gray-900 text-sm mb-4">Auction Status Distribution</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={statusDistData} cx="50%" cy="50%" outerRadius={80} dataKey="value" label>
                {statusDistData.map((_, i) => <Cell key={i} fill={colors[i % colors.length]} />)}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Auctions Monitor */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-bold text-gray-900 text-sm">🔴 Live Auctions — Live Feed</p>
          <span className="text-xs text-gray-400">Auto-refreshes every 30s</span>
        </div>
        {liveAuctions.length === 0 ? (
          <div className="p-8 text-center text-gray-400"><p>No live auctions at this moment</p></div>
        ) : (
          <div className="divide-y divide-gray-50">
            {liveAuctions.slice(0, 10).map(a => (
              <div key={a.id} className="p-4 flex items-center gap-4 hover:bg-gray-50 transition-colors">
                <img src={a.property?.featured_image || "https://via.placeholder.com/40"} alt="" className="w-10 h-10 rounded object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0 flex items-center gap-4 text-sm">
                  <span className="font-bold text-gray-900 min-w-20">{a.auctionCode}</span>
                  <span className="text-green-600 font-bold">{fmt(a.currentHighestBidEGP)} EGP</span>
                  <span className="text-blue-600">{a.totalUniqueBidders} bidders</span>
                  <span className="text-gray-500">{Math.max(0, Math.floor((new Date(a.auctionEndAt) - Date.now()) / 60000))} min left</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${a.reserveMet ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"}`}>
                    {a.reserveMet ? "✅ Reserve Met" : "⏳ Reserve Pending"}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">Monitor</button>
                  <button className="px-2 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-bold hover:bg-gray-200" title="Add time">⏰</button>
                  <button className="px-2 py-1.5 rounded-lg bg-orange-100 text-orange-700 font-bold hover:bg-orange-200" title="Pause">⏸</button>
                  <button className="px-2 py-1.5 rounded-lg bg-red-100 text-red-700 font-bold hover:bg-red-200" title="Cancel">❌</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}