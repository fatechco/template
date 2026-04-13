import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Home, Users, Eye, DollarSign, MessageCircle, BarChart3, ArrowRight, TrendingUp, Plus, Calendar } from "lucide-react";

const STATS = [
  { label: "Active Listings", value: "12", icon: Home, color: "bg-blue-50 text-blue-600" },
  { label: "Total Views", value: "1,840", icon: Eye, color: "bg-purple-50 text-purple-600" },
  { label: "New Inquiries", value: "8", icon: MessageCircle, color: "bg-orange-50 text-orange-600" },
  { label: "This Month Revenue", value: "$3,200", icon: DollarSign, color: "bg-green-50 text-green-600" },
];

const QUICK_ACTIONS = [
  { label: "Add New Listing", to: "/create/property", icon: Plus },
  { label: "View Clients", to: "/cp/agent/clients", icon: Users },
  { label: "Appointments", to: "/cp/agent/appointments", icon: Calendar },
  { label: "Performance Stats", to: "/cp/agent/performance", icon: BarChart3 },
];

const RECENT_CLIENTS = [
  { name: "Ahmed Hassan", property: "Apartment Cairo", status: "New", time: "Today", color: "bg-yellow-100 text-yellow-700" },
  { name: "Sara Mohamed", property: "Villa New Cairo", status: "Contacted", time: "2d ago", color: "bg-blue-100 text-blue-700" },
  { name: "Karim Ali", property: "Office Space", status: "Interested", time: "1d ago", color: "bg-green-100 text-green-700" },
  { name: "Layla Ibrahim", property: "Studio Maadi", status: "New", time: "3h ago", color: "bg-yellow-100 text-yellow-700" },
];

export default function AgentHome() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Welcome back, {user?.full_name?.split(" ")[0] || "there"}! 🏆
          </h1>
          <p className="text-gray-500 text-sm mt-1">Your performance overview for today.</p>
        </div>
        <Link to="/create/property" className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 text-sm">
          <Plus size={16} /> Add Listing
        </Link>
      </div>

      {/* Stats */}
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
        {/* Quick Actions */}
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

        {/* Recent Clients */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900">Recent Clients</h2>
            <Link to="/cp/agent/clients" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {RECENT_CLIENTS.map((client, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-200 to-blue-400 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                  {client.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{client.name}</p>
                  <p className="text-xs text-gray-500">{client.property}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${client.color}`}>{client.status}</span>
                  <span className="text-xs text-gray-400">{client.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}