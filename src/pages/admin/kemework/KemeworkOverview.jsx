import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { base44 } from "@/api/base44Client";

const PROS_DATA = Array.from({ length: 30 }, (_, i) => ({ day: `Mar ${i + 1}`, count: Math.floor(2 + Math.random() * 8) }));
const TASKS_DATA = [
  { week: "W1", count: 23 }, { week: "W2", count: 31 }, { week: "W3", count: 18 },
  { week: "W4", count: 45 }, { week: "W5", count: 38 }, { week: "W6", count: 52 },
  { week: "W7", count: 41 }, { week: "W8", count: 63 }, { week: "W9", count: 55 },
  { week: "W10", count: 47 }, { week: "W11", count: 70 }, { week: "W12", count: 58 },
];

const STATIC_KPIS = [
  { label: "Total Professionals", value: "1,284", icon: "👷", color: "text-blue-600", bg: "bg-blue-50" },
  { label: "Active Services", value: "3,847", icon: "🔧", color: "text-green-600", bg: "bg-green-50" },
  { label: "Open Tasks", value: "412", icon: "📋", color: "text-amber-600", bg: "bg-amber-50" },
  { label: "Total Orders", value: "9,621", icon: "📦", color: "text-purple-600", bg: "bg-purple-50" },
  { label: "Revenue This Month", value: "$48,320", icon: "💰", color: "text-teal-600", bg: "bg-teal-50" },
  { label: "Pending Approvals", value: "23", icon: "⏳", color: "text-orange-600", bg: "bg-orange-50" },
  { label: "Accreditation Apps", value: "14", icon: "🏅", color: "text-yellow-600", bg: "bg-yellow-50" },
  { label: "Disputes", value: "7", icon: "⚠️", color: "text-red-600", bg: "bg-red-50" },
];

const ALERTS = [
  { color: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-500", msg: "23 services pending approval", link: "/admin/kemework/services/pending" },
  { color: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500", msg: "14 accreditation applications awaiting review", link: "/admin/kemework/accreditation" },
  { color: "bg-red-50 border-red-200 text-red-700", dot: "bg-red-500", msg: "7 disputes need resolution", link: "/admin/kemework/orders?status=disputes" },
  { color: "bg-amber-50 border-amber-200 text-amber-700", dot: "bg-amber-500", msg: "31 professionals pending verification", link: "/admin/kemework/professionals?status=pending" },
];

const SNAP_EVENTS = [
  { icon: "✨", text: "Diagnosis — Leaking P-Trap, Cairo" },
  { icon: "🚨", text: "Emergency — Exposed electrical wiring, Giza" },
  { icon: "🚀", text: "Task posted — AC not cooling, Ahmed K." },
  { icon: "🛒", text: "Materials added to Kemetro — 4 items" },
  { icon: "✅", text: "Task completed — Wall crack repair, Pro: Kareem S." },
];

export default function KemeworkOverview() {
  const [snapSessions, setSnapSessions] = useState([]);

  useEffect(() => {
    base44.entities.SnapSession.list("-created_date", 100)
      .then(setSnapSessions)
      .catch(() => setSnapSessions([]));
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const snapToday = snapSessions.filter(s => new Date(s.created_date) >= today).length;
  const snapConverted = snapSessions.filter(s => s.status === "converted").length;
  const snapConvRate = snapSessions.length > 0 ? Math.round((snapConverted / snapSessions.length) * 100) : 0;
  const snapGMV = snapSessions.reduce((s, sess) => s + (sess.totalEstimatedMaterialsCostEGP || 0), 0);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-xl font-black text-gray-900">Kemework Overview</h1>
        <p className="text-sm text-gray-500">Platform-wide metrics and management</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[...STATIC_KPIS, {
          label: "Snap & Fix Photos",
          value: snapSessions.length.toLocaleString(),
          icon: "📸",
          color: "text-teal-600",
          bg: "bg-teal-50",
          sub: `${snapConvRate}% task conversion rate`,
          trend: `+${snapToday} today`,
        }].map(k => (
          <div key={k.label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg mb-2 ${k.bg}`}>{k.icon}</div>
            <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
            <p className="text-xs text-gray-500 mt-0.5">{k.label}</p>
            {k.sub && <p className="text-[10px] text-gray-400 mt-0.5">{k.sub}</p>}
            {k.trend && <p className="text-[10px] text-green-600 font-bold mt-0.5">↑ {k.trend}</p>}
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="font-black text-gray-900 text-sm mb-4">New Professionals (Last 30 Days)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={PROS_DATA}>
                <XAxis dataKey="day" tick={{ fontSize: 9 }} interval={4} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Line type="monotone" dataKey="count" stroke="#0D9488" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
          <p className="font-black text-gray-900 text-sm mb-4">Tasks Posted (Last 12 Weeks)</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={TASKS_DATA} barSize={16}>
                <XAxis dataKey="week" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis hide />
                <Tooltip contentStyle={{ borderRadius: 8, fontSize: 11 }} />
                <Bar dataKey="count" fill="#C41230" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Alerts */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {ALERTS.map((a, i) => (
          <Link key={i} to={a.link} className={`flex items-center gap-3 px-4 py-3 rounded-xl border ${a.color} hover:opacity-80 transition-opacity`}>
            <div className={`w-2 h-2 rounded-full flex-shrink-0 ${a.dot}`} />
            <p className="text-sm font-semibold flex-1">{a.msg}</p>
            <span className="text-xs font-bold">View →</span>
          </Link>
        ))}
      </div>

      {/* Snap & Fix Today */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-teal-100 rounded-xl flex items-center justify-center text-base">📸</div>
            <h2 className="text-base font-black text-gray-900">Snap & Fix Today</h2>
          </div>
          <Link to="/admin/kemework/snap-fix" className="text-xs text-teal-500 font-bold hover:underline">View Full Dashboard →</Link>
        </div>

        {/* 3 quick stats */}
        <div className="flex flex-wrap gap-4 mb-4">
          {[
            ["Photos analyzed", snapSessions.length, "text-teal-600"],
            ["Tasks posted", snapConverted, "text-blue-600"],
            ["Materials GMV", `${Math.round(snapGMV / 1000)}K EGP`, "text-yellow-600"],
          ].map(([label, val, color]) => (
            <div key={label} className="flex-1 min-w-[100px] bg-gray-50 rounded-xl p-3 text-center">
              <p className={`text-xl font-black ${color}`}>{val}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>

        {/* Last 5 events */}
        <div className="space-y-2 mb-4">
          {SNAP_EVENTS.map((ev, i) => (
            <div key={i} className="flex items-center gap-2 py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-sm flex-shrink-0">{ev.icon}</span>
              <span className="text-xs text-gray-700 flex-1">{ev.text}</span>
            </div>
          ))}
        </div>

        <Link to="/admin/kemework/snap-fix"
          className="block w-full text-center border-2 border-teal-400 text-teal-600 font-black py-2.5 rounded-xl text-sm hover:bg-teal-50 transition-all">
          📸 Go to Snap & Fix Dashboard →
        </Link>
      </div>
    </div>
  );
}