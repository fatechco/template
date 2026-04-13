import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from "recharts";
import { Bell, TrendingUp, DollarSign, ShoppingBag, Package, Star, Users } from "lucide-react";

const REVENUE_DATA = [
  { day: "Mon", revenue: 240, orders: 3 },
  { day: "Tue", revenue: 320, orders: 5 },
  { day: "Wed", revenue: 180, orders: 2 },
  { day: "Thu", revenue: 420, orders: 6 },
  { day: "Fri", revenue: 550, orders: 8 },
  { day: "Sat", revenue: 380, orders: 5 },
  { day: "Sun", revenue: 290, orders: 4 },
];

const STATS = [
  { icon: DollarSign, label: "Revenue Today", value: "$280", trend: "+12%", color: "text-green-600", bg: "bg-green-50" },
  { icon: ShoppingBag, label: "Orders Today", value: "5", trend: "+2", color: "text-blue-600", bg: "bg-blue-50" },
  { icon: Package, label: "Total Products", value: "24", trend: "Active", color: "text-teal-600", bg: "bg-teal-50" },
  { icon: Star, label: "Avg Rating", value: "4.8", trend: "⭐⭐⭐⭐⭐", color: "text-amber-600", bg: "bg-amber-50" },
];

const ALERTS = [
  { emoji: "🔴", text: "3 new orders need confirmation", action: "View Orders", color: "red", path: "/m/cp/seller/orders" },
  { emoji: "🟡", text: "2 products low in stock (< 5 units)", action: "Manage Stock", color: "yellow", path: "/m/cp/seller/products" },
  { emoji: "🔵", text: "5 reviews need response", action: "Respond", color: "blue", path: "/m/cp/seller/reviews" },
];

const RECENT_ORDERS = [
  { id: 1, orderNum: "#KM12346", product: "Office Chair Ergonomic", buyer: "Cairo", amount: 180, time: "5 mins ago", status: "pending" },
  { id: 2, orderNum: "#KM12345", product: "LED Desk Lamp", buyer: "Giza", amount: 45, time: "12 mins ago", status: "pending" },
  { id: 3, orderNum: "#KM12344", product: "Filing Cabinet", buyer: "Alexandria", amount: 95, time: "1h ago", status: "confirmed" },
];

const TOP_PRODUCTS = [
  { name: "Cement 50kg", sales: 156, revenue: 624 },
  { name: "Steel Rods 10mm", sales: 89, revenue: 356 },
  { name: "Floor Tiles 60x60", sales: 72, revenue: 288 },
  { name: "Paint 20L", sales: 45, revenue: 180 },
];

export default function SellerCPDashboard() {
  const navigate = useNavigate();
  const [storeInfo] = useState({
    name: "HomeStyle Store",
    plan: "Professional",
    verified: true,
  });

  return (
    <div className="space-y-6 pb-4">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Welcome back! 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your store today.</p>
        </div>
      </div>

      {/* Store Status Card */}
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-5 text-white shadow-lg">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Package size={24} className="text-white" />
            </div>
            <div>
              <h2 className="text-xl font-black">{storeInfo.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className="bg-white/20 text-white text-xs font-bold px-2.5 py-1 rounded-full">{storeInfo.plan}</span>
                {storeInfo.verified && (
                  <span className="flex items-center gap-1 bg-green-500/30 text-green-100 text-xs font-bold px-2.5 py-1 rounded-full">
                    ✅ Verified
                  </span>
                )}
              </div>
            </div>
          </div>
          <button onClick={() => navigate("/m/cp/seller/store-settings")} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <Bell size={20} className="text-white" />
          </button>
        </div>
        <button onClick={() => navigate("/m/cp/seller/store-profile")} className="text-sm font-bold text-white hover:underline">
          Manage Store →
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {STATS.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className={`${stat.bg} rounded-2xl p-4 border border-gray-100`}>
              <div className="flex items-center justify-between mb-2">
                <Icon size={20} className={stat.color} />
                <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">{stat.trend}</span>
              </div>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Alerts */}
      <div className="space-y-2">
        {ALERTS.map((alert, idx) => (
          <div
            key={idx}
            className={`rounded-xl p-3 border-l-4 flex items-start gap-3 ${
              alert.color === "red" ? "bg-red-50 border-red-400" :
              alert.color === "yellow" ? "bg-yellow-50 border-yellow-400" :
              "bg-blue-50 border-blue-400"
            }`}
          >
            <span className="text-lg mt-0.5">{alert.emoji}</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900">{alert.text}</p>
              <button
                onClick={() => navigate(alert.path)}
                className={`text-xs font-bold mt-1.5 ${
                  alert.color === "red" ? "text-red-600 hover:underline" :
                  alert.color === "yellow" ? "text-yellow-700 hover:underline" :
                  "text-blue-600 hover:underline"
                }`}
              >
                {alert.action} →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-black text-gray-900 text-sm">Revenue - Last 7 Days</h3>
          <button onClick={() => navigate("/m/cp/seller/analytics")} className="text-xs text-teal-600 font-bold hover:underline">
            View Full Report →
          </button>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={REVENUE_DATA}>
            <XAxis dataKey="day" tick={{ fontSize: 11 }} stroke="#9CA3AF" />
            <YAxis tick={{ fontSize: 11 }} stroke="#9CA3AF" width={35} tickFormatter={(v) => `$${v}`} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
              formatter={(value) => [`$${value}`, 'Revenue']}
            />
            <Bar dataKey="revenue" fill="#0D9488" radius={[8, 8, 0, 0]} barSize={30} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900 text-sm">Recent Orders</h3>
          <button onClick={() => navigate("/m/cp/seller/orders")} className="text-xs text-teal-600 font-bold hover:underline">
            View All →
          </button>
        </div>
        <div className="divide-y divide-gray-50">
          {RECENT_ORDERS.map(order => (
            <div key={order.id} className="px-5 py-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-500">{order.orderNum}</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{order.product}</p>
                  <p className="text-xs text-gray-400 mt-1">📍 {order.buyer} · {order.time}</p>
                </div>
                <div className="text-right">
                  <p className="font-black text-gray-900">${order.amount}</p>
                  <span className={`inline-block mt-1 px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    order.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    order.status === "confirmed" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {order.status === "pending" ? "⏳ Pending" : "✅ Confirmed"}
                  </span>
                </div>
              </div>
              {order.status === "pending" && (
                <div className="flex gap-2 mt-3">
                  <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 rounded-xl transition-colors">
                    ✅ Confirm
                  </button>
                  <button className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold py-2.5 rounded-xl border border-red-200 transition-colors">
                    ❌ Reject
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="font-black text-gray-900 text-sm">Top Performing Products</h3>
          <button onClick={() => navigate("/m/cp/seller/products")} className="text-xs text-teal-600 font-bold hover:underline">
            View All →
          </button>
        </div>
        <div className="px-5 py-4 space-y-4">
          {TOP_PRODUCTS.map((prod, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <span className="text-base font-black text-gray-400 w-6 flex-shrink-0">
                {idx === 0 ? "👑" : `${idx + 1}.`}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 truncate">{prod.name}</p>
                <div className="mt-1.5 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-teal-500 to-teal-600 rounded-full"
                    style={{ width: `${(prod.sales / 156) * 100}%` }}
                  />
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-xs font-black text-gray-900">${prod.revenue}</p>
                <p className="text-[9px] text-gray-400">{prod.sales} sales</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "➕ Add Product", path: "/m/cp/seller/add-product", filled: true },
          { label: "📦 View Orders", path: "/m/cp/seller/orders", filled: false },
          { label: "📊 Analytics", path: "/m/cp/seller/analytics", filled: false },
          { label: "🎫 Create Coupon", path: "/m/cp/seller/coupons", filled: false },
        ].map((action, idx) => (
          <button
            key={idx}
            onClick={() => navigate(action.path)}
            className={`py-3.5 rounded-2xl font-bold text-sm transition-all ${
              action.filled
                ? "bg-gradient-to-r from-teal-500 to-teal-600 text-white hover:shadow-lg"
                : "border-2 border-teal-200 text-teal-600 hover:bg-teal-50"
            }`}
          >
            {action.label}
          </button>
        ))}
      </div>
    </div>
  );
}