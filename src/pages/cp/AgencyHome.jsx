import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Home, Users, MessageCircle, DollarSign, BarChart3, ArrowRight, TrendingUp, Plus, Calendar } from "lucide-react";

const STATS = [
  { label: "Total Properties", value: "47", icon: Home, color: "bg-blue-50 text-blue-600" },
  { label: "Active Agents", value: "6", icon: Users, color: "bg-purple-50 text-purple-600" },
  { label: "Inquiries", value: "23", icon: MessageCircle, color: "bg-orange-50 text-orange-600" },
  { label: "Monthly Revenue", value: "$12,500", icon: DollarSign, color: "bg-green-50 text-green-600" },
];

const QUICK_ACTIONS = [
  { label: "Add Property", to: "/create/property", icon: Plus },
  { label: "Manage Agents", to: "/cp/agency/my-agents", icon: Users },
  { label: "Appointments", to: "/cp/agency/appointments", icon: Calendar },
  { label: "Performance Stats", to: "/cp/agency/performance", icon: BarChart3 },
];

const AGENTS = [
  { name: "Mohamed Salem", listings: 8, views: 342, rating: 4.9 },
  { name: "Nour Hassan", listings: 5, views: 214, rating: 4.7 },
  { name: "Omar Khaled", listings: 11, views: 521, rating: 4.8 },
  { name: "Fatima Ali", listings: 4, views: 163, rating: 4.6 },
];

export default function AgencyHome() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Welcome back, {user?.full_name?.split(" ")[0] || "there"}! 🏢
          </h1>
          <p className="text-gray-500 text-sm mt-1">Agency performance overview.</p>
        </div>
        <Link to="/create/property" className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 text-sm">
          <Plus size={16} /> Add Property
        </Link>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="space-y-2">
            {QUICK_ACTIONS.map(({ label, to, icon: Icon }) => (
              <Link key={label} to={to}
                className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition-all group">
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

        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">My Agents</h2>
            <Link to="/cp/agency/my-agents" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {AGENTS.map((agent, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {agent.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.listings} listings · {agent.views} views</p>
                </div>
                <span className="text-xs font-bold text-yellow-600">⭐ {agent.rating}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}