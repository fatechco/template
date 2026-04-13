import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Bell } from "lucide-react";
import FranchiseOwnerDrawer from "@/components/dashboard/FranchiseOwnerDrawer";

const STATS = [
  { icon: "🏠", label: "Properties", value: 145, color: "bg-orange-100" },
  { icon: "🏗", label: "Projects", value: 8, color: "bg-navy-100" },
  { icon: "👥", label: "Users", value: 324, color: "bg-blue-100" },
  { icon: "📋", label: "Tasks", value: 42, color: "bg-teal-100" },
  { icon: "🛒", label: "Sellers", value: 28, color: "bg-blue-100" },
  { icon: "📦", label: "Products", value: 1250, color: "bg-teal-100" },
];

const NEW_USERS = [
  { type: "Owners", count: 12, color: "bg-blue-600" },
  { type: "Buyers", count: 28, color: "bg-green-600" },
  { type: "Agents", count: 15, color: "bg-purple-600" },
  { type: "Developers", count: 5, color: "bg-orange-600" },
  { type: "Professionals", count: 9, color: "bg-pink-600" },
  { type: "Finishing", count: 3, color: "bg-yellow-600" },
  { type: "Sellers", count: 7, color: "bg-indigo-600" },
];

const ALERTS = [
  { id: 1, message: "12 properties pending verification", color: "bg-orange-50 border-orange-200" },
  { id: 2, message: "3 sellers need approval", color: "bg-yellow-50 border-yellow-200" },
  { id: 3, message: "5 new support tickets", color: "bg-blue-50 border-blue-200" },
];

export default function FranchiseOwnerDashboardHome() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [dismissedAlerts, setDismissedAlerts] = useState([]);

  const visibleAlerts = ALERTS.filter(a => !dismissedAlerts.includes(a.id));

  return (
    <div className="min-h-full bg-gray-50 pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between" style={{ height: 56 }}>
        <button onClick={() => setDrawerOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Menu size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">Dashboard</h1>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg relative">
          <Bell size={22} className="text-gray-900" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

      <FranchiseOwnerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      {/* Greeting Card */}
      <div className="px-4 pt-4 pb-4">
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
          <p className="text-base font-black">Good morning! 🌟</p>
          <p className="text-xs text-orange-100 mt-1">📍 Cairo, Egypt</p>
          <p className="text-xs text-orange-100 mt-2">Performance Score: ⭐ 94 / 100</p>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 gap-2 mt-4">
            <button className="bg-white text-orange-600 font-bold py-2.5 rounded-lg text-xs hover:bg-orange-50">
              ➕ Add Property
            </button>
            <button className="bg-white text-orange-600 font-bold py-2.5 rounded-lg text-xs hover:bg-orange-50">
              👥 View Users
            </button>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-2">
            <button className="bg-white text-orange-600 font-bold py-2.5 rounded-lg text-xs hover:bg-orange-50">
              📋 View Tasks
            </button>
            <button className="bg-white text-orange-600 font-bold py-2.5 rounded-lg text-xs hover:bg-orange-50">
              💬 Contact HQ
            </button>
          </div>
        </div>
      </div>

      {/* Area Stats */}
      <div className="px-4 pb-4">
        <p className="text-sm font-black text-gray-900 mb-2">My Area Today</p>
        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {STATS.map((stat, idx) => (
            <div key={idx} className={`flex-shrink-0 w-40 ${stat.color} rounded-2xl p-4 shadow-sm`}>
              <p className="text-2xl">{stat.icon}</p>
              <p className="text-2xl font-black text-gray-900 mt-2">{stat.value}</p>
              <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* New Users Today */}
      <div className="px-4 pb-4">
        <p className="text-sm font-black text-gray-900 mb-3">New Users Today</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
          {NEW_USERS.map((user, idx) => (
            <div key={idx} className="flex-shrink-0">
              <div className={`${user.color} rounded-full w-14 h-14 flex items-center justify-center`}>
                <div className="text-center">
                  <p className="text-xs font-black text-white">{user.count}</p>
                </div>
              </div>
              <p className="text-[10px] text-center text-gray-600 mt-1 whitespace-nowrap">{user.type}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Alerts */}
      {visibleAlerts.length > 0 && (
        <div className="px-4 pb-4 space-y-2">
          {visibleAlerts.map(alert => (
            <div key={alert.id} className={`${alert.color} border rounded-2xl p-3 flex items-center gap-2`}>
              <span className="text-lg">🔔</span>
              <p className="text-xs font-bold text-gray-700 flex-1">{alert.message}</p>
              <button
                onClick={() => setDismissedAlerts([...dismissedAlerts, alert.id])}
                className="text-gray-400 text-lg"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Module Quick Cards */}
      <div className="px-4 pb-4 space-y-3">
        <div
          onClick={() => navigate("/m/dashboard/area-overview")}
          className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 cursor-pointer"
        >
          <div>
            <p className="text-lg font-black">🏙</p>
            <p className="font-bold text-sm text-gray-900 mt-1">Kemedar Area</p>
            <p className="text-xs text-gray-500">145 properties</p>
          </div>
          <button className="bg-orange-100 text-orange-600 px-3 py-1.5 rounded-lg text-xs font-bold">
            Open →
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
          <div>
            <p className="text-lg font-black">🔧</p>
            <p className="font-bold text-sm text-gray-900 mt-1">Kemework</p>
            <p className="text-xs text-gray-500">42 active tasks</p>
          </div>
          <button className="bg-green-100 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold">
            Open →
          </button>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center justify-between hover:bg-gray-50 cursor-pointer">
          <div>
            <p className="text-lg font-black">🛒</p>
            <p className="font-bold text-sm text-gray-900 mt-1">Kemetro</p>
            <p className="text-xs text-gray-500">28 sellers</p>
          </div>
          <button className="bg-blue-100 text-blue-600 px-3 py-1.5 rounded-lg text-xs font-bold">
            Open →
          </button>
        </div>
      </div>

      {/* Revenue Summary */}
      <div className="px-4 pb-4">
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-5 text-white">
          <p className="text-xs text-green-100">This Month Revenue</p>
          <p className="text-3xl font-black mt-2">$12,450</p>
          <p className="text-xs text-green-100 mt-1">↑ 15% vs last month</p>
          <button className="text-xs font-bold text-green-100 mt-3 underline">View Details →</button>
        </div>
      </div>

      {/* Country Franchise Owner */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center text-xl flex-shrink-0">
            👤
          </div>
          <div className="flex-1">
            <p className="font-bold text-sm text-gray-900">Amr Hassan</p>
            <p className="text-xs text-gray-500">Your Country Owner</p>
          </div>
          <div className="flex gap-2">
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">📞</button>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">💬</button>
            <button className="p-2 hover:bg-gray-100 rounded-lg text-gray-600">📧</button>
          </div>
        </div>
      </div>
    </div>
  );
}