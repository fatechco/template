import { useState } from "react";
import { ChevronRight, AlertCircle, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import ModuleSwitcher from "@/components/mobile-v2/ModuleSwitcher";
import KemetroSellerDrawer from "@/components/dashboard/KemetroSellerDrawer";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const REVENUE_DATA = [
  { day: "Mon", revenue: 240 },
  { day: "Tue", revenue: 320 },
  { day: "Wed", revenue: 180 },
  { day: "Thu", revenue: 420 },
  { day: "Fri", revenue: 550 },
  { day: "Sat", revenue: 380 },
  { day: "Sun", revenue: 290 },
];

const STATS = [
  { icon: "📦", label: "Total Products", value: "24" },
  { icon: "📋", label: "Active Listings", value: "22" },
  { icon: "🛍", label: "Orders Today", value: "5" },
  { icon: "💰", label: "Revenue Today", value: "$280" },
  { icon: "⭐", label: "Avg Rating", value: "4.6" },
  { icon: "💬", label: "Pending Reviews", value: "8" },
];

const PENDING_ORDERS = [
  { id: 1, orderNum: "#KM12346", product: "Office Chair", buyer: "Cairo", amount: "$180", time: "5 mins ago" },
  { id: 2, orderNum: "#KM12345", product: "LED Lamp", buyer: "Giza", amount: "$45", time: "12 mins ago" },
];

const ALERTS = [
  { emoji: "🔴", text: "3 new orders need confirmation", action: "View Orders", color: "red" },
  { emoji: "🟡", text: "2 products low in stock (< 5 units)", action: "Manage Stock", color: "yellow" },
  { emoji: "🔵", text: "5 reviews need response", action: "Respond", color: "blue" },
];

export default function KemetroSellerDashboard() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showModuleSwitcher, setShowModuleSwitcher] = useState(false);

  const storeInfo = {
    name: "HomeStyle Store",
    plan: "Professional",
    verified: true,
    logo: "🏪",
  };

  return (
    <div className="min-h-full bg-gray-50 pb-24">
      <MobileTopBar
        title="Store Dashboard"
        rightAction={
          <button onClick={() => setShowModuleSwitcher(true)} className="p-1">
            <Menu size={22} className="text-gray-700" />
          </button>
        }
      />
      <KemetroSellerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />
      <ModuleSwitcher isOpen={showModuleSwitcher} onClose={() => setShowModuleSwitcher(false)} />

      {/* Profile Header */}
      <div className="bg-white px-4 py-4 border-b border-gray-100">
        <h2 className="text-base font-black text-gray-900">Welcome back! 👋</h2>
      </div>

      {/* Store Status Card */}
      <div className="px-4 pt-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">{storeInfo.logo}</span>
            <div className="flex-1">
              <p className="font-black text-gray-900">{storeInfo.name}</p>
              {storeInfo.verified && <p className="text-xs text-green-600 font-bold mt-1">✅ Verified Seller</p>}
            </div>
          </div>
          <div className="flex items-center gap-2 mb-3">
            <span className="bg-teal-100 text-teal-700 text-xs font-bold px-2.5 py-1 rounded-full">{storeInfo.plan}</span>
          </div>
          <button className="text-xs text-teal-600 font-bold hover:underline">Manage Store →</button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          {STATS.map((stat, idx) => (
            <div key={idx} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
              <p className="text-2xl mb-1">{stat.icon}</p>
              <p className="text-xs text-gray-500 font-medium">{stat.label}</p>
              <p className="font-black text-gray-900 text-lg mt-1">{stat.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Pending Actions */}
      <div className="px-4 pb-4 space-y-2">
        {ALERTS.map((alert, idx) => (
          <div
            key={idx}
            className={`rounded-2xl p-3 border-l-4 flex items-start gap-3 ${
              alert.color === "red"
                ? "bg-red-50 border-red-400"
                : alert.color === "yellow"
                  ? "bg-yellow-50 border-yellow-400"
                  : "bg-blue-50 border-blue-400"
            }`}
          >
            <span className="text-lg mt-0.5">{alert.emoji}</span>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-900">{alert.text}</p>
              <button
                onClick={() => navigate("/m/dashboard/seller-orders")}
                className={`text-xs font-bold mt-1.5 ${
                  alert.color === "red"
                    ? "text-red-600 hover:underline"
                    : alert.color === "yellow"
                      ? "text-yellow-600 hover:underline"
                      : "text-blue-600 hover:underline"
                }`}
              >
                {alert.action} →
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* New Orders Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black text-gray-900">New Orders 🔴 ({PENDING_ORDERS.length})</p>
          <button onClick={() => navigate("/m/dashboard/seller-orders")} className="text-xs text-teal-600 font-bold">
            View All →
          </button>
        </div>
        <div className="space-y-2">
          {PENDING_ORDERS.map(order => (
            <div key={order.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-xs font-bold text-gray-600">{order.orderNum}</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{order.product}</p>
                </div>
                <p className="font-black text-gray-900">{order.amount}</p>
              </div>
              <p className="text-xs text-gray-500 mb-3">{order.buyer} • {order.time}</p>
              <div className="flex gap-2">
                <button className="flex-1 bg-green-600 text-white text-xs font-bold py-2 rounded hover:bg-green-700">
                  ✅ Confirm
                </button>
                <button className="flex-1 bg-red-100 text-red-600 text-xs font-bold py-2 rounded hover:bg-red-200">
                  ❌ Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="px-4 pb-8">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-black text-gray-900 mb-4">Revenue - Last 7 Days</p>
          <ResponsiveContainer width="100%" height={150}>
            <BarChart data={REVENUE_DATA}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} width={30} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#14B8A6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          <button onClick={() => navigate("/m/dashboard/seller-analytics")} className="text-xs text-teal-600 font-bold mt-4 hover:underline">
            View Full Report →
          </button>
        </div>
      </div>
    </div>
  );
}