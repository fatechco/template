import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Home, FileText, MessageCircle, DollarSign, BarChart3, ArrowRight, TrendingUp, Plus } from "lucide-react";
import QRGeneratorWidget from "@/components/qr/QRGeneratorWidget";

const STATS = [
  { label: "Active Projects", value: "5", icon: Home, color: "bg-blue-50 text-blue-600" },
  { label: "Total Units", value: "240", icon: FileText, color: "bg-purple-50 text-purple-600" },
  { label: "Inquiries", value: "34", icon: MessageCircle, color: "bg-orange-50 text-orange-600" },
  { label: "Revenue", value: "$48,000", icon: DollarSign, color: "bg-green-50 text-green-600" },
];

const QUICK_ACTIONS = [
  { label: "Add Project", to: "/create/project", icon: Plus },
  { label: "Add Property", to: "/create/property", icon: Home },
  { label: "Project Sales", to: "/cp/developer/project-sales", icon: FileText },
  { label: "Performance Stats", to: "/cp/developer/performance", icon: BarChart3 },
];

const PROJECTS = [
  { name: "Marassi North Coast", units: 3500, delivery: "2026", status: "Active" },
  { name: "Midtown Condo", units: 200, delivery: "2025", status: "Active" },
  { name: "Sodic West", units: 1200, delivery: "2027", status: "Pending" },
  { name: "Palm Hills October", units: 800, delivery: "2026", status: "Active" },
];

export default function DeveloperHome() {
  const { user } = useAuth();

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">
            Welcome back, {user?.full_name?.split(" ")[0] || "there"}! 🏗️
          </h1>
          <p className="text-gray-500 text-sm mt-1">Developer dashboard overview.</p>
        </div>
        <Link to="/create/project" className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white font-bold rounded-lg hover:bg-orange-700 text-sm">
          <Plus size={16} /> Add Project
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
            <h2 className="font-bold text-gray-900">My Projects</h2>
            <Link to="/cp/developer/my-projects" className="text-xs text-blue-600 hover:underline">View all</Link>
          </div>
          <div className="space-y-3">
            {PROJECTS.map((proj, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                  <Home size={16} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900">{proj.name}</p>
                  <p className="text-xs text-gray-500">{proj.units.toLocaleString()} units · Delivery {proj.delivery}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${proj.status === "Active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {proj.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Developer Profile QR */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
        <h3 className="font-black text-gray-900 mb-1">📱 Developer Profile QR Code</h3>
        <p className="text-gray-500 text-sm mb-4">Share your developer profile QR on marketing materials. Investors and buyers scan it to see your projects and profile.</p>
        {user && <QRGeneratorWidget targetType="developer_profile" targetId={user.id} targetTitle={user.full_name} mode="full" />}
      </div>
    </div>
  );
}