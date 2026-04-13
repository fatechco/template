import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Eye, Users } from "lucide-react";

const REVENUE_DATA = [
  { month: "Jan", revenue: 2400, orders: 32 },
  { month: "Feb", revenue: 3200, orders: 45 },
  { month: "Mar", revenue: 4100, orders: 58 },
  { month: "Apr", revenue: 3800, orders: 52 },
  { month: "May", revenue: 5200, orders: 71 },
  { month: "Jun", revenue: 4800, orders: 65 },
];

const CATEGORY_DATA = [
  { name: "Furniture", value: 45, color: "#0D9488" },
  { name: "Lighting", value: 28, color: "#06B6D4" },
  { name: "Storage", value: 18, color: "#14B8A6" },
  { name: "Accessories", value: 9, color: "#5EEAD4" },
];

const TRAFFIC_DATA = [
  { day: "Mon", views: 240, visitors: 180 },
  { day: "Tue", views: 320, visitors: 240 },
  { day: "Wed", views: 280, visitors: 210 },
  { day: "Thu", views: 420, visitors: 310 },
  { day: "Fri", views: 380, visitors: 290 },
  { day: "Sat", views: 350, visitors: 260 },
  { day: "Sun", views: 290, visitors: 220 },
];

const KPIS = [
  { icon: DollarSign, label: "Total Revenue", value: "$23,500", trend: "+18.5%", color: "text-green-600", bg: "bg-green-50" },
  { icon: ShoppingBag, label: "Total Orders", value: "323", trend: "+12.3%", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Eye, label: "Store Views", value: "12,847", trend: "+24.1%", color: "text-purple-600", bg: "bg-purple-50" },
  { icon: Users, label: "Customers", value: "284", trend: "+8.7%", color: "text-orange-600", bg: "bg-orange-50" },
];

export default function SellerCPAnalytics() {
  const navigate = useNavigate();

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black">📊 Analytics</h1>
            <p className="text-teal-100 text-sm mt-1">Comprehensive insights into your store performance</p>
          </div>
          <TrendingUp size={32} className="opacity-80" />
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 gap-3">
        {KPIS.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div key={idx} className={`${kpi.bg} rounded-2xl p-4 border border-gray-100`}>
              <div className="flex items-center gap-2 mb-2">
                <Icon size={18} className={kpi.color} />
              </div>
              <p className="text-xl font-black text-gray-900">{kpi.value}</p>
              <p className="text-[10px] text-gray-500 font-medium">{kpi.label}</p>
              <p className="text-[9px] text-green-600 font-bold mt-1">{kpi.trend}</p>
            </div>
          );
        })}
      </div>

      {/* Revenue Trend */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900 text-sm">Revenue & Orders - Last 6 Months</h3>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={REVENUE_DATA}>
            <XAxis dataKey="month" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
            <YAxis yAxisId="left" tick={{ fontSize: 11 }} stroke="#9CA3AF" width={40} tickFormatter={(v) => `$${v/1000}k`} />
            <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 11 }} stroke="#9CA3AF" width={30} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Area yAxisId="left" type="monotone" dataKey="revenue" stroke="#0D9488" fill="#0D9488" fillOpacity={0.1} strokeWidth={2} />
            <Area yAxisId="right" type="monotone" dataKey="orders" stroke="#06B6D4" fill="#06B6D4" fillOpacity={0.1} strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Category Performance */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-black text-gray-900 text-sm mb-4">Sales by Category</h3>
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={CATEGORY_DATA}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              dataKey="value"
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              labelLine={false}
            >
              {CATEGORY_DATA.map((entry, index) => (
                <Cell key={index} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {CATEGORY_DATA.map((cat, idx) => (
            <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
              <div className="w-3 h-3 rounded-full" style={{ background: cat.color }} />
              <span className="text-xs font-bold text-gray-700">{cat.name}</span>
              <span className="text-xs font-black text-gray-900 ml-auto">{cat.value}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Traffic Analytics */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-black text-gray-900 text-sm mb-4">Store Traffic - Last 7 Days</h3>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={TRAFFIC_DATA}>
            <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" width={35} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
            />
            <Bar dataKey="views" fill="#0D9488" radius={[6, 6, 0, 0]} barSize={20} />
            <Bar dataKey="visitors" fill="#06B6D4" radius={[6, 6, 0, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
        <div className="flex items-center justify-center gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-teal-600" />
            <span className="text-xs text-gray-500">Views</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-cyan-600" />
            <span className="text-xs text-gray-500">Visitors</span>
          </div>
        </div>
      </div>

      {/* Performance Summary */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-5 text-white shadow-lg">
        <h3 className="font-black text-sm mb-4">🎯 Performance Summary</h3>
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[10px] text-gray-300 mb-1">Conversion Rate</p>
            <p className="text-xl font-black">3.8%</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[10px] text-gray-300 mb-1">Avg Order Value</p>
            <p className="text-xl font-black">$72.80</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[10px] text-gray-300 mb-1">Return Rate</p>
            <p className="text-xl font-black">2.1%</p>
          </div>
          <div className="bg-white/10 rounded-xl p-3">
            <p className="text-[10px] text-gray-300 mb-1">Customer Satisfaction</p>
            <p className="text-xl font-black">94%</p>
          </div>
        </div>
        <div className="pt-3 border-t border-white/20">
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-gray-300">Overall Performance</span>
            <span className="text-sm font-black text-green-400">Excellent ⭐⭐⭐⭐⭐</span>
          </div>
        </div>
      </div>
    </div>
  );
}