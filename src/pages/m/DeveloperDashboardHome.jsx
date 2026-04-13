import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const PROJECTS = [
  { id: 1, name: "New Cairo Tower", location: "New Cairo", image: "bg-blue-300", totalUnits: 120, soldUnits: 45, inquiries: 28 },
  { id: 2, name: "Downtown Residences", location: "Downtown", image: "bg-green-300", totalUnits: 80, soldUnits: 62, inquiries: 15 },
];

const RECENT_INQUIRIES = [
  { id: 1, buyer: "Ahmed Hassan", unit: "Unit B-201", date: "Today", status: "new" },
  { id: 2, buyer: "Sara Mohamed", unit: "Unit A-105", date: "2d ago", status: "contacted" },
  { id: 3, buyer: "Karim Ali", unit: "Unit C-310", date: "3d ago", status: "visited" },
  { id: 4, buyer: "Fatima Khalil", unit: "Unit B-402", date: "4d ago", status: "interested" },
  { id: 5, buyer: "Hassan Ibrahim", unit: "Unit A-201", date: "5d ago", status: "sold" },
];

const STATUS_COLORS = {
  new: "bg-yellow-100 text-yellow-700",
  contacted: "bg-blue-100 text-blue-700",
  visited: "bg-purple-100 text-purple-700",
  interested: "bg-green-100 text-green-700",
  sold: "bg-emerald-100 text-emerald-700",
};

export default function DeveloperDashboardHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-gray-50 pb-24">
      <MobileTopBar title="Developer Dashboard" />

      {/* Greeting Card */}
      <div className="px-4 pt-4 pb-4">
        <div className="bg-gradient-to-br from-navy-50 to-navy-100 rounded-2xl p-5 border border-blue-200">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-base font-black text-gray-900">Welcome back! 🏗️</p>
              <p className="text-xs text-gray-600 mt-1">Your project performance</p>
            </div>
            <span className="inline-block bg-blue-900 text-white px-3 py-1 rounded-full text-xs font-bold">Developer</span>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="px-4 pb-4">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">🏗️ Projects</p>
            <p className="text-2xl font-black text-gray-900 mt-1">5</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">🏠 Total Units</p>
            <p className="text-2xl font-black text-gray-900 mt-1">485</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">👁 Views</p>
            <p className="text-2xl font-black text-gray-900 mt-1">12.5K</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">📋 Inquiries</p>
            <p className="text-2xl font-black text-gray-900 mt-1">185</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">✅ Sold</p>
            <p className="text-2xl font-black text-green-600 mt-1">128</p>
          </div>
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <p className="text-xs text-gray-500 font-semibold">📦 Available</p>
            <p className="text-2xl font-black text-blue-600 mt-1">312</p>
          </div>
        </div>
      </div>

      {/* Projects Section */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black text-gray-900">My Projects ({PROJECTS.length})</p>
          <button onClick={() => navigate("/m/dashboard/my-projects")} className="text-orange-600 text-xs font-bold">
            View All →
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
          {PROJECTS.map(project => (
            <div
              key={project.id}
              className="flex-shrink-0 w-56 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className={`w-full h-24 ${project.image}`} />
              <div className="p-4 space-y-3">
                <div>
                  <p className="font-bold text-sm text-gray-900">{project.name}</p>
                  <p className="text-xs text-gray-500 mt-0.5">📍 {project.location}</p>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex justify-between text-xs font-bold text-gray-600 mb-1">
                    <span>{project.soldUnits} / {project.totalUnits} sold</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-orange-600"
                      style={{ width: `${(project.soldUnits / project.totalUnits) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <span className="text-xs font-bold text-gray-600">Inquiries: {project.inquiries}</span>
                  <button className="text-orange-600 text-xs font-bold hover:underline">Manage →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Funnel */}
      <div className="px-4 pb-4">
        <p className="text-sm font-black text-gray-900 mb-3">Sales Funnel</p>
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-2">
          {[
            { stage: "Inquiries", count: 185, color: "bg-blue-100 text-blue-700" },
            { stage: "Contacted", count: 142, color: "bg-purple-100 text-purple-700" },
            { stage: "Visited", count: 98, color: "bg-yellow-100 text-yellow-700" },
            { stage: "Sold", count: 128, color: "bg-green-100 text-green-700" },
          ].map(item => (
            <div key={item.stage}>
              <div className="flex justify-between mb-1">
                <p className="text-xs font-bold text-gray-700">{item.stage}</p>
                <p className={`text-xs font-bold ${item.color} px-2 py-0.5 rounded`}>{item.count}</p>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${(item.count / 185) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Inquiries */}
      <div className="px-4 pb-4">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black text-gray-900">Recent Inquiries</p>
          <button className="text-orange-600 text-xs font-bold">View All →</button>
        </div>

        <div className="space-y-2">
          {RECENT_INQUIRIES.slice(0, 5).map(inquiry => (
            <div key={inquiry.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center text-sm flex-shrink-0">
                👤
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-gray-900 truncate">{inquiry.buyer}</p>
                <p className="text-xs text-gray-500 truncate">{inquiry.unit} • {inquiry.date}</p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap ${STATUS_COLORS[inquiry.status]}`}>
                {inquiry.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}