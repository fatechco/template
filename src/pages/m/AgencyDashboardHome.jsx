import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, ChevronRight, TrendingUp } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const CHART_DATA = [
  { day: "1", views: 150 },
  { day: "5", views: 220 },
  { day: "10", views: 280 },
  { day: "15", views: 350 },
  { day: "20", views: 420 },
  { day: "25", views: 510 },
  { day: "30", views: 640 },
];

const AGENTS = [
  { id: 1, name: "Ahmed Hassan", listings: 12, views: 1200, rating: 4.8, status: "active" },
  { id: 2, name: "Sara Mohamed", listings: 8, views: 950, rating: 4.6, status: "active" },
  { id: 3, name: "Karim Ali", listings: 15, views: 1450, rating: 4.9, status: "active" },
];

export default function AgencyDashboardHome() {
  const navigate = useNavigate();
  const agencyName = "Premium Realty";

  return (
    <div className="min-h-full bg-gray-50 pb-24">
      <MobileTopBar title="Agency Dashboard" />

      {/* Greeting Card */}
      <div className="px-4 pt-4 pb-4">
        <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-5 border border-purple-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-base font-black text-gray-900">Welcome back! 🏢</p>
              <p className="text-xs text-gray-600 mt-1">Your agency performance</p>
            </div>
            <span className="inline-block bg-purple-600 text-white px-3 py-1 rounded-full text-xs font-bold">Agency</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 pb-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">👥 Total Agents</p>
            <p className="text-2xl font-black text-gray-900 mt-1">12</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">🏠 Active Listings</p>
            <p className="text-2xl font-black text-gray-900 mt-1">45</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">👁 Total Views</p>
            <p className="text-2xl font-black text-gray-900 mt-1">8.5K</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">📞 Contacts</p>
            <p className="text-2xl font-black text-gray-900 mt-1">320</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">⭐ Rating</p>
            <p className="text-2xl font-black text-gray-900 mt-1">4.8</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">✅ Verified</p>
            <p className="text-2xl font-black text-green-600 mt-1">Yes</p>
          </div>
        </div>
      </div>

      {/* Performance Chart */}
      <div className="px-4 pb-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <p className="text-sm font-bold text-gray-900 mb-3">Agency Views — Last 30 Days</p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={CHART_DATA}>
              <XAxis dataKey="day" tick={{ fontSize: 12 }} />
              <YAxis hide />
              <Line type="monotone" dataKey="views" stroke="#9333EA" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* My Agents Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black text-gray-900">My Agents ({AGENTS.length})</p>
          <button onClick={() => navigate("/m/dashboard/my-agents")} className="text-orange-600 text-xs font-bold">
            View All →
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {AGENTS.map(agent => (
            <div
              key={agent.id}
              className="flex-shrink-0 w-48 bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3"
            >
              <div className="flex gap-2 items-start">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-200 to-purple-300 rounded-full flex items-center justify-center text-lg flex-shrink-0">
                  👤
                </div>
                <div className="flex-1">
                  <p className="font-bold text-sm text-gray-900">{agent.name}</p>
                  <p className="text-xs text-gray-500">{agent.listings} listings</p>
                </div>
              </div>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-600">Views</span>
                  <span className="font-bold text-gray-900">{agent.views}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Rating</span>
                  <span className="font-bold text-orange-600">⭐ {agent.rating}</span>
                </div>
              </div>
              <button className="w-full text-xs font-bold text-orange-600 hover:bg-orange-50 py-2 rounded-lg border border-orange-200">
                View Details →
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Top Performing Property */}
      <div className="px-4 pb-4">
        <p className="text-xs font-bold text-gray-600 uppercase mb-2">Best listing this month</p>
        <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100">
          <div className="w-full h-32 bg-gradient-to-br from-orange-200 to-orange-300" />
          <div className="p-4 space-y-2">
            <p className="font-bold text-sm text-gray-900">Luxury Apartment Cairo</p>
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <p className="text-gray-600">Views</p>
                <p className="font-black text-gray-900">524</p>
              </div>
              <div>
                <p className="text-gray-600">Contacts</p>
                <p className="font-black text-gray-900">28</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}