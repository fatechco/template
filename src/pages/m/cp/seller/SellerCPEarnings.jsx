import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DollarSign, TrendingUp, TrendingDown, Calendar, Download, Clock } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";

const REVENUE_DATA = [
  { month: "Jan", revenue: 2400, orders: 32 },
  { month: "Feb", revenue: 3200, orders: 45 },
  { month: "Mar", revenue: 4100, orders: 58 },
  { month: "Apr", revenue: 3800, orders: 52 },
  { month: "May", revenue: 5200, orders: 71 },
  { month: "Jun", revenue: 4800, orders: 65 },
];

const EARNINGS_SUMMARY = {
  total: 23500,
  thisMonth: 4800,
  pending: 850,
  paid: 22650,
};

const TRANSACTIONS = [
  { id: 1, date: "Jun 25, 2026", type: "payout", amount: 2400, status: "completed", method: "Bank Transfer" },
  { id: 2, date: "Jun 18, 2026", type: "payout", amount: 1850, status: "completed", method: "Bank Transfer" },
  { id: 3, date: "Jun 11, 2026", type: "payout", amount: 2100, status: "completed", method: "Bank Transfer" },
  { id: 4, date: "Jun 4, 2026", type: "payout", amount: 1950, status: "pending", method: "Bank Transfer" },
];

export default function SellerCPEarnings() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black">💰 Earnings</h1>
            <p className="text-teal-100 text-sm mt-1">Track your revenue and payouts</p>
          </div>
          <DollarSign size={32} className="opacity-80" />
        </div>
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-5">
          <p className="text-teal-100 text-xs font-medium mb-1">Total Earnings</p>
          <p className="text-4xl font-black">${EARNINGS_SUMMARY.total.toLocaleString()}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="flex items-center gap-1 text-xs font-bold bg-green-500/30 text-green-100 px-2 py-1 rounded-full">
              <TrendingUp size={12} /> +18.5% vs last month
            </span>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={18} className="text-blue-600" />
            <p className="text-xs text-gray-500 font-medium">This Month</p>
          </div>
          <p className="text-2xl font-black text-gray-900">${EARNINGS_SUMMARY.thisMonth.toLocaleString()}</p>
          <p className="text-xs text-green-600 font-bold mt-1 flex items-center gap-1">
            <TrendingUp size={12} /> +12% from last
          </p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={18} className="text-orange-600" />
            <p className="text-xs text-gray-500 font-medium">Pending</p>
          </div>
          <p className="text-2xl font-black text-gray-900">${EARNINGS_SUMMARY.pending.toLocaleString()}</p>
          <p className="text-xs text-gray-400 font-medium mt-1">Next payout in 3 days</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900 text-sm">Revenue - Last 6 Months</h3>
          <button className="text-xs text-teal-600 font-bold hover:underline">View Report →</button>
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={REVENUE_DATA}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" width={40} tickFormatter={(v) => `$${v/1000}k`} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`$${value.toLocaleString()}`, 'Revenue']}
            />
            <Line type="monotone" dataKey="revenue" stroke="#0D9488" strokeWidth={3} dot={{ fill: '#0D9488', strokeWidth: 2, r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Payout History */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900 text-sm">Payout History</h3>
          <button className="flex items-center gap-1.5 text-xs text-teal-600 font-bold hover:underline">
            <Download size={14} /> Export
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {TRANSACTIONS.map(tx => (
            <div key={tx.id} className="px-5 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  tx.status === "completed" ? "bg-green-100" : "bg-yellow-100"
                }`}>
                  {tx.status === "completed" ? "✅" : "⏳"}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900">{tx.method}</p>
                  <p className="text-xs text-gray-400">{tx.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-black text-gray-900">${tx.amount.toLocaleString()}</p>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                  tx.status === "completed" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                }`}>
                  {tx.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900 text-sm">Payout Methods</h3>
          <button 
            onClick={() => navigate("/m/cp/seller/payout-settings")}
            className="text-xs text-teal-600 font-bold hover:underline"
          >
            Manage →
          </button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-xl">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-xl">🏦</div>
              <div>
                <p className="text-sm font-bold text-gray-900">Bank Account</p>
                <p className="text-xs text-gray-400">•••• 4242</p>
              </div>
            </div>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full">Default</span>
          </div>
          <button className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-sm font-bold text-gray-500 hover:border-teal-300 hover:text-teal-600 transition-colors">
            + Add Payment Method
          </button>
        </div>
      </div>
    </div>
  );
}