import { useState } from "react";
import { Menu } from "lucide-react";
import { AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";
import { TrendingUp, TrendingDown } from "lucide-react";

const PERIODS = ["7 Days", "30 Days", "3 Months", "6 Months", "1 Year"];

const REVENUE_DATA = [
  { date: "Mar 1", revenue: 1200, orders: 14 }, { date: "Mar 5", revenue: 1850, orders: 21 },
  { date: "Mar 9", revenue: 1700, orders: 19 }, { date: "Mar 13", revenue: 2750, orders: 31 },
  { date: "Mar 17", revenue: 3200, orders: 36 }, { date: "Mar 21", revenue: 3600, orders: 40 },
  { date: "Mar 25", revenue: 4200, orders: 48 }, { date: "Mar 29", revenue: 4800, orders: 54 },
];

const TOP_PRODUCTS = [
  { name: "Premium Cement 50kg", sales: 480, revenue: 3600, views: 2100 },
  { name: "Steel Rod 10mm", sales: 210, revenue: 88200, views: 980 },
  { name: "Wall Paint White 20L", sales: 175, revenue: 8749, views: 1450 },
  { name: "Ceramic Floor Tile 60×60", sales: 320, revenue: 9120, views: 1800 },
  { name: "Sand Bag Fine 25kg", sales: 640, revenue: 2240, views: 720 },
];

const TRAFFIC_SOURCES = [
  { name: "Search", value: 42, color: "#0077B6" },
  { name: "Direct", value: 28, color: "#FF6B00" },
  { name: "Browse", value: 18, color: "#10B981" },
  { name: "Promos", value: 8, color: "#8B5CF6" },
  { name: "Referral", value: 4, color: "#F59E0B" },
];

const STATS = [
  { label: "Total Revenue", value: "$48,320", change: +18.4, color: "text-teal-600", bg: "bg-teal-50" },
  { label: "Total Orders", value: "1,133", change: +12.1, color: "text-[#0077B6]", bg: "bg-blue-50" },
  { label: "Product Views", value: "7,050", change: +24.7, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Avg. Rating", value: "4.8 ⭐", change: +0.2, color: "text-yellow-600", bg: "bg-yellow-50" },
];

export default function SellerAnalyticsMobile({ onOpenDrawer }) {
  const [period, setPeriod] = useState("30 Days");

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={onOpenDrawer} className="p-1 -ml-1"><Menu size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-bold text-base text-gray-900 text-center">Analytics</span>
        <span className="w-8" />
      </div>

      <div className="pb-28 space-y-4 pt-4 px-4">
        {/* Period Filter */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {PERIODS.map(p => (
            <button key={p} onClick={() => setPeriod(p)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${
                period === p ? "bg-[#0077B6] text-white" : "bg-white border border-gray-200 text-gray-600"
              }`}>{p}</button>
          ))}
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((s, i) => (
            <div key={i} className={`${s.bg} rounded-2xl p-4 border border-gray-100`}>
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${s.change >= 0 ? "text-green-600" : "text-red-500"}`}>
                {s.change >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                {s.change >= 0 ? "+" : ""}{s.change}%
              </div>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="font-black text-gray-900 text-sm mb-4">Revenue & Orders Over Time</p>
          <ResponsiveContainer width="100%" height={180}>
            <AreaChart data={REVENUE_DATA}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0077B6" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#0077B6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" tick={{ fontSize: 9 }} />
              <YAxis tick={{ fontSize: 9 }} width={30} />
              <Tooltip />
              <Area type="monotone" dataKey="revenue" stroke="#0077B6" fill="url(#revGrad)" strokeWidth={2} name="Revenue ($)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-black text-gray-900 text-sm">Best Performing Products</p>
          </div>
          <div className="px-4 py-3 space-y-3">
            {TOP_PRODUCTS.map((p, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-black text-gray-400 w-4 flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0077B6] rounded-full" style={{ width: `${(p.sales / 640) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-bold text-gray-700 flex-shrink-0">{p.sales} sold</span>
              </div>
            ))}
          </div>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="font-black text-gray-900 text-sm mb-4">Traffic Sources</p>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="45%" height={140}>
              <PieChart>
                <Pie data={TRAFFIC_SOURCES} cx="50%" cy="50%" innerRadius={40} outerRadius={65} dataKey="value" paddingAngle={3}>
                  {TRAFFIC_SOURCES.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {TRAFFIC_SOURCES.map(src => (
                <div key={src.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: src.color }} />
                    <span className="text-gray-600">{src.name}</span>
                  </div>
                  <span className="font-black text-gray-900">{src.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top Products Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="font-black text-gray-900 text-sm">Product Performance</p>
          </div>
          {TOP_PRODUCTS.map((p, i) => (
            <div key={i} className="px-4 py-3 border-b border-gray-50 last:border-0 flex items-center justify-between">
              <div className="flex-1 min-w-0 pr-2">
                <p className="text-xs font-bold text-gray-900 truncate">{p.name}</p>
                <p className="text-[11px] text-gray-400">👁 {p.views.toLocaleString()} · 🛍 {p.sales}</p>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-black text-gray-900">${p.revenue.toLocaleString()}</p>
                <p className="text-[11px] text-green-600 font-bold">{((p.sales / p.views) * 100).toFixed(1)}% conv.</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}