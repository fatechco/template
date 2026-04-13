import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Phone, Star, MessageCircle, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const CHART_DATA = [
  { day: "1", views: 12 },
  { day: "5", views: 19 },
  { day: "10", views: 25 },
  { day: "15", views: 31 },
  { day: "20", views: 28 },
  { day: "25", views: 35 },
  { day: "30", views: 42 },
];

const RECENT_CLIENTS = [
  { id: 1, name: "Ahmed Hassan", status: "new", property: "Apartment Cairo", lastContact: "Today" },
  { id: 2, name: "Sara Mohamed", status: "contacted", property: "Villa New Cairo", lastContact: "2d ago" },
  { id: 3, name: "Karim Ali", status: "interested", property: "Office Space", lastContact: "1d ago" },
];

const STATUS_COLORS = {
  new: { bg: "bg-yellow-100", text: "text-yellow-700", dot: "🟡" },
  contacted: { bg: "bg-blue-100", text: "text-blue-700", dot: "🔵" },
  interested: { bg: "bg-green-100", text: "text-green-700", dot: "🟢" },
  cold: { bg: "bg-red-100", text: "text-red-700", dot: "🔴" },
};

export default function AgentDashboardHome() {
  const navigate = useNavigate();
  const [isVerified] = useState(false);

  const userName = "John Doe";

  return (
    <div className="min-h-full bg-gray-50 pb-24">
      <MobileTopBar title="Dashboard" />

      {/* Greeting Card */}
      <div className="px-4 pt-4 pb-4">
        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 border border-orange-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-base font-black text-gray-900">Welcome back, {userName}! 🏆</p>
              <p className="text-xs text-gray-600 mt-1">Your performance this month</p>
            </div>
            <span className="text-2xl">📈</span>
          </div>
          {isVerified ? (
            <div className="inline-block bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold">
              ✅ Verified Agent
            </div>
          ) : (
            <button className="text-orange-600 font-bold text-xs hover:underline">Get Verified →</button>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 pb-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          {/* Active Listings */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">🏠 Active Listings</p>
            <p className="text-2xl font-black text-gray-900 mt-1">8</p>
          </div>

          {/* Total Clients */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">👥 Total Clients</p>
            <p className="text-2xl font-black text-gray-900 mt-1">24</p>
          </div>

          {/* Total Views */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">👁 Total Views</p>
            <p className="text-2xl font-black text-gray-900 mt-1">1.2K</p>
          </div>

          {/* Contacts Received */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">📞 Contacts</p>
            <p className="text-2xl font-black text-gray-900 mt-1">42</p>
          </div>

          {/* Rating */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">⭐ My Rating</p>
            <p className="text-2xl font-black text-gray-900 mt-1">4.8</p>
          </div>

          {/* WhatsApp Clicks */}
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">💬 WhatsApp Clicks</p>
            <p className="text-2xl font-black text-gray-900 mt-1">156</p>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-900 mb-3">Views This Month</p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={CHART_DATA}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis hide />
              <Line type="monotone" dataKey="views" stroke="#FF6B00" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => navigate("/m/add/property")}
            className="bg-orange-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:opacity-80"
          >
            <Plus size={18} /> Add Listing
          </button>
          <button className="bg-blue-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:opacity-80">
            👥 Add Client
          </button>
          <button
            onClick={() => navigate("/m/dashboard/appointments")}
            className="bg-purple-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:opacity-80"
          >
            📅 Schedule Visit
          </button>
          <button
            onClick={() => navigate("/m/dashboard/analytics")}
            className="bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:opacity-80"
          >
            📊 View Stats
          </button>
        </div>
      </div>

      {/* Recent Clients */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black text-gray-900">Recent Clients</p>
          <button onClick={() => navigate("/m/dashboard/clients")} className="text-orange-600 text-xs font-bold">
            View All →
          </button>
        </div>

        <div className="space-y-2">
          {RECENT_CLIENTS.map(client => {
            const status = STATUS_COLORS[client.status];
            return (
              <button
                key={client.id}
                onClick={() => navigate(`/m/dashboard/clients/${client.id}`)}
                className="w-full bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3 hover:bg-gray-50 active:bg-orange-50"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center text-lg flex-shrink-0 relative">
                  👤
                  <span className="absolute -top-1 -right-1 text-sm">{status.dot}</span>
                </div>
                <div className="flex-1 text-left min-w-0">
                  <p className="font-bold text-sm text-gray-900 truncate">{client.name}</p>
                  <p className="text-xs text-gray-500 truncate">{client.property}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Last contact: {client.lastContact}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}