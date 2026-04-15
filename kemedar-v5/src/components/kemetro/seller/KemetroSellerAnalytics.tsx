"use client";
// @ts-nocheck
import { useState } from "react";
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { TrendingUp, TrendingDown, Eye, ShoppingCart, DollarSign, Star, Users, Package } from "lucide-react";

const PERIODS = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "Last Year"];

const REVENUE_DATA = [
  { date: "Mar 1", revenue: 1200, orders: 14 },
  { date: "Mar 3", revenue: 1850, orders: 21 },
  { date: "Mar 5", revenue: 980, orders: 11 },
  { date: "Mar 7", revenue: 2400, orders: 28 },
  { date: "Mar 9", revenue: 1700, orders: 19 },
  { date: "Mar 11", revenue: 3100, orders: 35 },
  { date: "Mar 13", revenue: 2750, orders: 31 },
  { date: "Mar 15", revenue: 3800, orders: 42 },
  { date: "Mar 17", revenue: 3200, orders: 36 },
  { date: "Mar 19", revenue: 4100, orders: 47 },
  { date: "Mar 21", revenue: 3600, orders: 40 },
  { date: "Mar 23", revenue: 4700, orders: 53 },
  { date: "Mar 25", revenue: 4200, orders: 48 },
  { date: "Mar 27", revenue: 5100, orders: 58 },
  { date: "Mar 29", revenue: 4800, orders: 54 },
];

const TOP_PRODUCTS = [
  { name: "Premium Cement 50kg", sales: 480, revenue: 3600, views: 2100 },
  { name: "Steel Rod 10mm", sales: 210, revenue: 88200, views: 980 },
  { name: "Wall Paint White 20L", sales: 175, revenue: 8749, views: 1450 },
  { name: "Ceramic Floor Tile 60x60", sales: 320, revenue: 9120, views: 1800 },
  { name: "Sand Bag Fine 25kg", sales: 640, revenue: 2240, views: 720 },
];

const TRAFFIC_SOURCES = [
  { name: "Search", value: 42, color: "#0077B6" },
  { name: "Direct", value: 28, color: "#FF6B00" },
  { name: "Category Browse", value: 18, color: "#10B981" },
  { name: "Promotions", value: 8, color: "#8B5CF6" },
  { name: "Referral", value: 4, color: "#F59E0B" },
];

const CATEGORY_PERF = [
  { category: "Cement", revenue: 12400, orders: 210 },
  { category: "Steel", revenue: 88200, orders: 65 },
  { category: "Tiles", revenue: 9120, orders: 180 },
  { category: "Paint", revenue: 8749, orders: 148 },
  { category: "Sand", revenue: 2240, orders: 530 },
];

const STATS = [
  { label: "Total Revenue", value: "$48,320", change: +18.4, icon: DollarSign, color: "text-teal-600", bg: "bg-teal-50" },
  { label: "Total Orders", value: "1,133", change: +12.1, icon: ShoppingCart, color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Product Views", value: "7,050", change: +24.7, icon: Eye, color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Avg. Rating", value: "4.8", change: +0.2, icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
  { label: "New Customers", value: "284", change: +9.3, icon: Users, color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Active Listings", value: "38", change: +3, icon: Package, color: "text-indigo-600", bg: "bg-indigo-50" },
];

function StatCard({ stat }) {
  const isPositive = stat.change >= 0;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500 font-medium">{stat.label}</p>
        <p className="text-2xl font-black text-gray-900 mt-1">{stat.value}</p>
        <div className={`flex items-center gap-1 mt-1 text-xs font-bold ${isPositive ? "text-green-600" : "text-red-500"}`}>
          {isPositive ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {isPositive ? "+" : ""}{stat.change}% vs last period
        </div>
      </div>
      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
        <stat.icon size={18} className={stat.color} />
      </div>
    </div>
  );
}

export default function KemetroSellerAnalytics() {
  const [period, setPeriod] = useState("Last 30 Days");

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Analytics</h1>
          <p className="text-gray-500 text-sm mt-1">Monitor your store performance and sales trends</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          {PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                period === p ? "bg-teal-600 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
        {STATS.map((s) => <StatCard key={s.label} stat={s} />)}
      </div>

      {/* Revenue & Orders Chart */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="font-black text-gray-900 mb-4">Revenue & Orders Over Time</h2>
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={REVENUE_DATA}>
            <defs>
              <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0077B6" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#0077B6" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="date" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="rev" tick={{ fontSize: 11 }} />
            <YAxis yAxisId="ord" orientation="right" tick={{ fontSize: 11 }} />
            <Tooltip />
            <Legend />
            <Area yAxisId="rev" type="monotone" dataKey="revenue" stroke="#0077B6" fill="url(#revGrad)" strokeWidth={2} name="Revenue ($)" />
            <Line yAxisId="ord" type="monotone" dataKey="orders" stroke="#FF6B00" strokeWidth={2} dot={false} name="Orders" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Performance */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-black text-gray-900 mb-4">Revenue by Category</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={CATEGORY_PERF} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="category" type="category" tick={{ fontSize: 11 }} width={60} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#0077B6" radius={[0, 6, 6, 0]} name="Revenue ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Traffic Sources */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-black text-gray-900 mb-4">Traffic Sources</h2>
          <div className="flex items-center gap-6">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={TRAFFIC_SOURCES} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                  {TRAFFIC_SOURCES.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 flex-1">
              {TRAFFIC_SOURCES.map((src) => (
                <div key={src.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: src.color }} />
                    <span className="text-gray-700 font-medium">{src.name}</span>
                  </div>
                  <span className="font-black text-gray-900">{src.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">Top Performing Products</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-bold text-gray-600">Product</th>
                <th className="px-6 py-3 text-right font-bold text-gray-600">Views</th>
                <th className="px-6 py-3 text-right font-bold text-gray-600">Units Sold</th>
                <th className="px-6 py-3 text-right font-bold text-gray-600">Revenue</th>
                <th className="px-6 py-3 text-right font-bold text-gray-600">Conversion</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.map((p, i) => (
                <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-semibold text-gray-900">{p.name}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{p.views.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right text-gray-600">{p.sales.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right font-bold text-gray-900">${p.revenue.toLocaleString()}</td>
                  <td className="px-6 py-4 text-right">
                    <span className="bg-green-100 text-green-700 font-bold text-xs px-2 py-1 rounded-full">
                      {((p.sales / p.views) * 100).toFixed(1)}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}