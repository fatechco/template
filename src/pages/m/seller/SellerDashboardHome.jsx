import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Menu, Bell } from "lucide-react";

const SALES_DATA = [
  { date: "Day 1", sales: 120 }, { date: "Day 5", sales: 320 }, { date: "Day 10", sales: 280 },
  { date: "Day 15", sales: 450 }, { date: "Day 20", sales: 380 }, { date: "Day 25", sales: 520 }, { date: "Day 30", sales: 680 },
];

const TOP_PRODUCTS = [
  { name: "Cement 50kg", sales: 156, revenue: "$624" },
  { name: "Steel Rods 10mm", sales: 89, revenue: "$356" },
  { name: "Floor Tiles 60x60", sales: 72, revenue: "$288" },
  { name: "Paint 20L", sales: 45, revenue: "$180" },
  { name: "Electrical Sockets", sales: 38, revenue: "$152" },
];

const RECENT_ORDERS = [
  { id: "#ORD-2025-001", product: "Cement 50kg (×10)", buyer: "Ahmed Hassan", amount: "$120", status: "Pending", city: "Cairo", time: "5 mins ago" },
  { id: "#ORD-2025-002", product: "Steel Rods 10mm (×5)", buyer: "Fatima Mohamed", amount: "$225", status: "Confirmed", city: "Riyadh", time: "1h ago" },
  { id: "#ORD-2025-003", product: "Ceramic Tiles (×20)", buyer: "Omar Ahmed", amount: "$310", status: "Shipped", city: "Dubai", time: "2h ago" },
];

const ALERTS = [
  { emoji: "🔴", text: "3 new orders need confirmation", action: "View Orders", color: "red", path: "/m/dashboard/seller-orders" },
  { emoji: "🟡", text: "2 products low in stock", action: "Fix Now", color: "yellow", path: "/m/dashboard/seller-products" },
  { emoji: "🔵", text: "5 reviews need response", action: "Respond", color: "blue", path: "/m/dashboard/seller-reviews" },
];

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  Shipped: "bg-teal-100 text-teal-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

export default function SellerDashboardHome({ onOpenDrawer }) {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={onOpenDrawer} className="p-1 -ml-1"><Menu size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-bold text-base text-gray-900 text-center">Dashboard</span>
        <button className="p-1 relative">
          <Bell size={22} className="text-gray-700" />
          <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

      <div className="pb-24 space-y-4 pt-4 px-4">
        {/* Store Card */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center text-2xl">🏪</div>
            <div className="flex-1">
              <p className="font-black text-gray-900">HomeStyle Store</p>
              <span className="text-xs bg-teal-100 text-teal-700 font-bold px-2.5 py-0.5 rounded-full">Professional Plan</span>
            </div>
            <div>
              <p className="text-xs text-green-600 font-bold">✅ Verified</p>
              <button className="text-xs text-[#0077B6] font-bold mt-1">Manage →</button>
            </div>
          </div>
        </div>

        {/* Alerts */}
        <div className="space-y-2">
          {ALERTS.map((alert, idx) => (
            <div key={idx} className={`rounded-xl p-3 border-l-4 flex items-center gap-3 ${
              alert.color === "red" ? "bg-red-50 border-red-400" : alert.color === "yellow" ? "bg-yellow-50 border-yellow-400" : "bg-blue-50 border-blue-400"
            }`}>
              <span className="text-lg flex-shrink-0">{alert.emoji}</span>
              <p className="text-xs font-bold text-gray-900 flex-1">{alert.text}</p>
              <button onClick={() => navigate(alert.path)}
                className={`text-xs font-bold flex-shrink-0 ${alert.color === "red" ? "text-red-600" : alert.color === "yellow" ? "text-yellow-700" : "text-blue-600"}`}>
                {alert.action} →
              </button>
            </div>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "📦", label: "Total Products", value: "24", color: "text-[#0077B6]" },
            { icon: "🛍", label: "New Orders", value: "3", color: "text-orange-500", dot: true },
            { icon: "💰", label: "Revenue Today", value: "$280", color: "text-green-600" },
            { icon: "💰", label: "This Month", value: "$1,240", color: "text-green-600" },
            { icon: "⭐", label: "Store Rating", value: "4.8", color: "text-yellow-500" },
            { icon: "👁", label: "Store Views", value: "1,284", color: "text-purple-600" },
          ].map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-2">
                <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
                <div className="relative">
                  <span className="text-xl">{stat.icon}</span>
                  {stat.dot && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white" />}
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* New Orders */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-black text-gray-900 text-sm">🔴 New Orders ({RECENT_ORDERS.filter(o => o.status === "Pending").length})</p>
            <button onClick={() => navigate("/m/dashboard/seller-orders")} className="text-xs text-[#0077B6] font-bold">View All →</button>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT_ORDERS.filter(o => o.status === "Pending").map(order => (
              <div key={order.id} className="p-4 border-l-4 border-red-400">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="text-xs font-bold text-gray-500">{order.id}</p>
                    <p className="text-sm font-bold text-gray-900">{order.product}</p>
                    <p className="text-xs text-gray-500">📍 {order.city} · {order.time}</p>
                  </div>
                  <p className="font-black text-gray-900">{order.amount}</p>
                </div>
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-green-600 text-white text-xs font-bold py-2.5 rounded-xl">✅ Confirm</button>
                  <button className="flex-1 bg-red-50 text-red-600 text-xs font-bold py-2.5 rounded-xl border border-red-200">❌ Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <p className="font-black text-gray-900 text-sm">Revenue — Last 30 Days</p>
            <button onClick={() => navigate("/m/dashboard/seller-analytics")} className="text-xs text-[#0077B6] font-bold">Full Report →</button>
          </div>
          <ResponsiveContainer width="100%" height={160}>
            <LineChart data={SALES_DATA}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} width={30} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" stroke="#0077B6" strokeWidth={2} dot={{ fill: "#0077B6", r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <p className="font-black text-gray-900 text-sm">Top Performing Products</p>
            <button onClick={() => navigate("/m/dashboard/seller-products")} className="text-xs text-[#0077B6] font-bold">View All →</button>
          </div>
          <div className="px-4 py-3 space-y-3">
            {TOP_PRODUCTS.map((prod, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <span className="text-base font-black text-gray-400 w-5 flex-shrink-0">{idx === 0 ? "👑" : `${idx + 1}`}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                  <div className="mt-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#0077B6] rounded-full" style={{ width: `${(prod.sales / 156) * 100}%` }} />
                  </div>
                </div>
                <span className="text-xs font-black text-gray-900 flex-shrink-0">{prod.revenue}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "➕ Add Product", path: "/m/add/product", filled: true },
            { label: "📦 View Orders", path: "/m/dashboard/seller-orders", filled: false },
            { label: "📊 Analytics", path: "/m/dashboard/seller-analytics", filled: false },
            { label: "🎫 Create Coupon", path: "/m/dashboard/seller-coupons", filled: false },
          ].map((a, i) => (
            <button key={i} onClick={() => navigate(a.path)}
              className={`py-3.5 rounded-2xl font-bold text-sm ${a.filled ? "bg-[#0077B6] text-white" : "border-2 border-[#0077B6] text-[#0077B6]"}`}>
              {a.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}