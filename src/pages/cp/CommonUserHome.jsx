import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  Home, FileText, Star, Eye, MessageCircle,
  ArrowRight, TrendingUp, Bell, Heart, GitCompare
} from "lucide-react";

const STATS = [
  { label: "Saved Properties", value: "5", icon: Heart, color: "bg-rose-50 text-rose-500" },
  { label: "Buy Requests", value: "2", icon: FileText, color: "bg-blue-50 text-blue-500" },
  { label: "Messages", value: "3", icon: MessageCircle, color: "bg-orange-50 text-orange-500" },
  { label: "Properties Viewed", value: "28", icon: Eye, color: "bg-green-50 text-green-500" },
];

const QUICK_ACTIONS = [
  { label: "Browse Properties", to: "/search-properties", icon: Home },
  { label: "Post Buy Request", to: "/create/buy-request", icon: FileText },
  { label: "My Favorites", to: "/cp/user/favorites", icon: Heart },
  { label: "Compare Properties", to: "/cp/user/compare", icon: GitCompare },
];

const RECENT_ACTIVITY = [
  { icon: "🏠", text: "New property matching your criteria", time: "2 min ago", color: "bg-blue-50" },
  { icon: "💬", text: "Agent replied to your inquiry", time: "1 hour ago", color: "bg-green-50" },
  { icon: "⭐", text: "Property you saved dropped in price", time: "3 hours ago", color: "bg-yellow-50" },
  { icon: "📋", text: "Your buy request received 3 matches", time: "Yesterday", color: "bg-purple-50" },
  { icon: "🔔", text: "New properties in your saved search", time: "2 days ago", color: "bg-orange-50" },
];

export default function CommonUserHome() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Welcome back, {user?.full_name?.split(" ")[0] || "there"}! 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Here's what's happening with your account today.
          </p>
        </div>
        <span className="text-xs text-gray-400">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </span>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm text-gray-500 font-medium">{label}</p>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
                <Icon size={18} />
              </div>
            </div>
            <p className="text-2xl font-black text-gray-900">{value}</p>
            <p className="text-xs text-green-600 font-medium mt-1 flex items-center gap-1">
              <TrendingUp size={11} /> +5% from last month
            </p>
          </div>
        ))}
      </div>

      {/* Quick Actions + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map(({ label, to, icon: Icon }) => (
              <Link
                key={label}
                to={to}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 group-hover:bg-orange-100 rounded-lg flex items-center justify-center transition-colors">
                    <Icon size={15} className="text-gray-600 group-hover:text-orange-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700 group-hover:text-orange-700">{label}</span>
                </div>
                <ArrowRight size={14} className="text-gray-400 group-hover:text-orange-500" />
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Activity</h2>
            <Link to="/cp/user/notifications" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {RECENT_ACTIVITY.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className={`w-9 h-9 rounded-full ${item.color} flex items-center justify-center text-lg flex-shrink-0`}>
                  {item.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-gray-700">{item.text}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}