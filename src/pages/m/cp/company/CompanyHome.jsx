import { useState } from "react";
import { Link } from "react-router-dom";
import { BarChart3, ClipboardList, FileText, Users, DollarSign, Star, TrendingUp, Plus, Briefcase, Search } from "lucide-react";

const MOCK_STATS = {
  revenue: 12450,
  activeOrders: 8,
  pendingBids: 5,
  totalProjects: 47,
};

const RECENT_ACTIVITY = [
  { id: 1, type: "order", title: "Villa Interior Painting", client: "Ahmed Hassan", amount: 3200, status: "In Progress", date: "Mar 24" },
  { id: 2, type: "bid", title: "Office Renovation", client: "Cairo Tech Hub", amount: 8500, status: "Pending", date: "Mar 23" },
  { id: 3, type: "order", title: "Kitchen Tiling", client: "Sara Mohamed", amount: 1800, status: "Completed", date: "Mar 22" },
  { id: 4, type: "bid", title: "Bathroom Remodeling", client: "Karim Ali", amount: 2400, status: "Accepted", date: "Mar 21" },
];

const STATUS_COLORS = {
  "In Progress": "bg-blue-100 text-blue-700",
  "Pending": "bg-amber-100 text-amber-700",
  "Completed": "bg-green-100 text-green-700",
  "Accepted": "bg-purple-100 text-purple-700",
};

export default function CompanyHome() {
  const [availability, setAvailability] = useState(true);

  return (
    <div className="space-y-6 pb-20">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Welcome back! 👋</h1>
          <p className="text-sm text-gray-500 mt-1">Here's what's happening with your business today.</p>
        </div>
        <button
          onClick={() => setAvailability(!availability)}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
            availability ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
          }`}
        >
          {availability ? "● Available" : "○ Busy"}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl p-4 text-white">
          <DollarSign size={20} className="mb-2 opacity-80" />
          <p className="text-xs opacity-90 mb-1">Total Revenue</p>
          <p className="text-xl font-black">${MOCK_STATS.revenue.toLocaleString()}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <ClipboardList size={20} className="mb-2 text-amber-600" />
          <p className="text-xs text-gray-500 mb-1">Active Orders</p>
          <p className="text-xl font-black text-gray-900">{MOCK_STATS.activeOrders}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <FileText size={20} className="mb-2 text-orange-600" />
          <p className="text-xs text-gray-500 mb-1">Pending Bids</p>
          <p className="text-xl font-black text-gray-900">{MOCK_STATS.pendingBids}</p>
        </div>
        <div className="bg-white rounded-2xl p-4 border border-gray-200">
          <TrendingUp size={20} className="mb-2 text-green-600" />
          <p className="text-xs text-gray-500 mb-1">Total Projects</p>
          <p className="text-xl font-black text-gray-900">{MOCK_STATS.totalProjects}</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-black text-gray-900 mb-3">Quick Actions</h2>
        <div className="grid grid-cols-2 gap-3">
          <Link to="/m/cp/company/services" className="bg-white rounded-xl p-4 border border-gray-200 hover:border-amber-300 transition-colors">
            <Briefcase size={20} className="text-amber-600 mb-2" />
            <p className="text-xs font-bold text-gray-900">Manage Services</p>
          </Link>
          <Link to="/m/cp/company/search-tasks" className="bg-white rounded-xl p-4 border border-gray-200 hover:border-amber-300 transition-colors">
            <Search size={20} className="text-blue-600 mb-2" />
            <p className="text-xs font-bold text-gray-900">Find Tasks</p>
          </Link>
          <Link to="/m/cp/company/orders" className="bg-white rounded-xl p-4 border border-gray-200 hover:border-amber-300 transition-colors">
            <ClipboardList size={20} className="text-green-600 mb-2" />
            <p className="text-xs font-bold text-gray-900">View Orders</p>
          </Link>
          <Link to="/m/cp/company/bids" className="bg-white rounded-xl p-4 border border-gray-200 hover:border-amber-300 transition-colors">
            <FileText size={20} className="text-orange-600 mb-2" />
            <p className="text-xs font-bold text-gray-900">My Bids</p>
          </Link>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-black text-gray-900">Recent Activity</h2>
          <Link to="/m/cp/company/orders" className="text-xs font-bold text-amber-600">View All →</Link>
        </div>
        <div className="space-y-2">
          {RECENT_ACTIVITY.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 border border-gray-100">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <p className="text-sm font-bold text-gray-900">{item.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{item.client}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${STATUS_COLORS[item.status]}`}>
                  {item.status}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">{item.date}</p>
                <p className="text-sm font-black text-amber-600">${item.amount.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}