import { useState } from "react";
import { Link } from "react-router-dom";
import AdminConciergeWidget from "@/components/concierge/AdminConciergeWidget";
import AdminAuctionWidget from "@/components/auctions/AdminAuctionWidget";
import AdminSTLWidget from "@/components/shop-the-look/AdminSTLWidget";
import AdminSwapWidget from "@/components/swap/AdminSwapWidget";
import {
  Users, Home, Building2, FileText, TrendingUp, TrendingDown,
  AlertCircle, Clock, Shield, DollarSign, Bell, CheckCircle, Sparkles
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";

const KPI_ROW1 = [
  { label: "Total Users", value: "2,841", trend: "+12%", up: true, icon: Users, color: "bg-blue-50 text-blue-600" },
  { label: "Active Properties", value: "5,920", trend: "+8%", up: true, icon: Home, color: "bg-orange-50 text-orange-600" },
  { label: "Active Projects", value: "143", trend: "+3%", up: true, icon: Building2, color: "bg-purple-50 text-purple-600" },
  { label: "Buy Requests", value: "387", trend: "-2%", up: false, icon: FileText, color: "bg-green-50 text-green-600" },
];

const KPI_ROW2 = [
  { label: "Agents", value: "412", icon: Users, color: "bg-sky-50 text-sky-600" },
  { label: "Agencies", value: "78", icon: Building2, color: "bg-indigo-50 text-indigo-600" },
  { label: "Developers", value: "34", icon: Home, color: "bg-violet-50 text-violet-600" },
  { label: "Franchise Owners", value: "21", icon: Shield, color: "bg-teal-50 text-teal-600" },
];

const KPI_ROW3 = [
  { label: "Total Subscriptions", value: "1,204", icon: CheckCircle, color: "bg-emerald-50 text-emerald-600" },
  { label: "Monthly Revenue", value: "$48,200", icon: DollarSign, color: "bg-yellow-50 text-yellow-600" },
  { label: "Pending Verifications", value: "67", icon: Clock, color: "bg-amber-50 text-amber-600" },
  { label: "Added Today", value: "23", icon: Home, color: "bg-rose-50 text-rose-600" },
];

const KPI_STL = {
  label: "✨ Shop the Look",
  value: "1,240 shoppable images",
  sub: "7.2% gallery click rate",
  trend: "↑ +43,750 EGP GMV this week",
};

const KPI_CONCIERGE = {
  label: "🗝️ Move-In Concierge",
  value: "142 active",
  sub: "34% Kemework conversion",
  trend: "↑ +7 journeys today",
};

const genDays = (count, base, variance) =>
  Array.from({ length: count }, (_, i) => ({
    day: `${i + 1}`,
    value: Math.max(0, base + Math.floor(Math.random() * variance) - variance / 2),
  }));

const usersData = genDays(30, 40, 30);
const propertiesData = genDays(30, 25, 20);

const purposeData = [
  { name: "Sale", value: 2840 }, { name: "Rent", value: 1920 },
  { name: "Investment", value: 640 }, { name: "Daily Booking", value: 320 },
];

const roleData = [
  { name: "Common Users", value: 2110 }, { name: "Agents", value: 412 },
  { name: "Agencies", value: 78 }, { name: "Developers", value: 34 },
  { name: "Franchise", value: 21 }, { name: "Admins", value: 9 },
];

const revenueByPlan = [
  { plan: "Free", revenue: 0 }, { plan: "Basic", revenue: 8400 },
  { plan: "Pro", revenue: 22800 }, { plan: "Business", revenue: 17000 },
];

const COLORS = ["#f97316", "#3b82f6", "#8b5cf6", "#22c55e", "#06b6d4", "#ef4444"];

const RECENT = [
  { type: "user", icon: "👤", text: "New agent registered: Ahmed Hassan", time: "2 min ago", color: "bg-blue-50" },
  { type: "property", icon: "🏠", text: "New property submitted for review: Villa in Sheikh Zayed", time: "8 min ago", color: "bg-orange-50" },
  { type: "verify", icon: "✅", text: "Verification request from Nour Agency", time: "15 min ago", color: "bg-green-50" },
  { type: "user", icon: "👤", text: "New developer registered: Palm Hills Dev", time: "32 min ago", color: "bg-blue-50" },
  { type: "property", icon: "🏠", text: "Property approved: Studio in Maadi", time: "1 hour ago", color: "bg-orange-50" },
  { type: "franchise", icon: "🏙", text: "Franchise application: Cairo West Territory", time: "2 hours ago", color: "bg-purple-50" },
  { type: "property", icon: "🏠", text: "New property: Duplex in New Cairo", time: "3 hours ago", color: "bg-orange-50" },
  { type: "user", icon: "👤", text: "Agent account suspended: Bad Actor", time: "4 hours ago", color: "bg-red-50" },
  { type: "verify", icon: "✅", text: "Verification approved: Mohamed Nasser", time: "5 hours ago", color: "bg-green-50" },
  { type: "user", icon: "👤", text: "New agency registered: Elite Realty", time: "6 hours ago", color: "bg-blue-50" },
];

const PENDING = [
  { icon: "🔴", label: "Users pending approval", count: 24, to: "/admin/users/pending", color: "text-red-600" },
  { icon: "🔴", label: "Properties pending review", count: 47, to: "/admin/properties", color: "text-red-600" },
  { icon: "🔴", label: "Verification requests", count: 18, to: "/admin/users/verified", color: "text-red-600" },
  { icon: "🔴", label: "Franchise applications", count: 6, to: "/admin/users/franchise-owners", color: "text-red-600" },
];

function KpiCard({ label, value, trend, up, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <p className="text-xs text-gray-500 font-medium">{label}</p>
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={17} />
        </div>
      </div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      {trend && (
        <p className={`text-xs font-semibold mt-1 flex items-center gap-1 ${up ? "text-green-600" : "text-red-500"}`}>
          {up ? <TrendingUp size={11} /> : <TrendingDown size={11} />} {trend} vs last month
        </p>
      )}
    </div>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-500 text-sm">Platform overview — {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
      </div>

      {/* KPI Rows */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_ROW1.map(k => <KpiCard key={k.label} {...k} />)}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_ROW2.map(k => <KpiCard key={k.label} {...k} />)}
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {KPI_ROW3.map(k => <KpiCard key={k.label} {...k} />)}
      </div>
      {/* Shop the Look KPI Banner */}
      <div className="bg-teal-50 border border-teal-100 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">✨</div>
        <div className="flex-1 min-w-[160px]">
          <p className="text-xs font-bold text-teal-500 uppercase tracking-wide mb-0.5">✨ Shop the Look</p>
          <p className="text-2xl font-black text-teal-700">{KPI_STL.value}</p>
          <p className="text-xs text-teal-500 mt-0.5">{KPI_STL.sub}</p>
        </div>
        <p className="text-sm font-bold text-teal-600">{KPI_STL.trend}</p>
        <Link to="/admin/kemetro/shop-the-look" className="ml-auto text-xs text-teal-700 border border-teal-300 font-bold px-4 py-2 rounded-xl hover:bg-teal-100 transition-colors whitespace-nowrap">
          View Dashboard →
        </Link>
      </div>

      {/* Concierge KPI Banner */}
      <div className="bg-orange-50 border border-orange-100 rounded-2xl px-5 py-4 flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[160px]">
          <p className="text-xs font-bold text-orange-400 uppercase tracking-wide mb-0.5">🗝️ Move-In Concierge</p>
          <p className="text-2xl font-black text-orange-600">{KPI_CONCIERGE.value}</p>
          <p className="text-xs text-orange-500 mt-0.5">{KPI_CONCIERGE.sub}</p>
        </div>
        <p className="text-sm font-bold text-orange-500">{KPI_CONCIERGE.trend}</p>
        <Link to="/admin/kemedar/concierge" className="ml-auto text-xs text-orange-600 border border-orange-300 font-bold px-4 py-2 rounded-xl hover:bg-orange-100 transition-colors whitespace-nowrap">
          View Analytics →
        </Link>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Users Line Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">New Users Per Day (30 days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={usersData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Properties Line Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">New Properties Per Day (30 days)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={propertiesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" tick={{ fontSize: 10 }} interval={4} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Purpose Bar Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">Properties by Purpose</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={purposeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="value" fill="#f97316" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Users Pie Chart */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">Users by Role</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={roleData} cx="40%" cy="50%" outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={9}>
                {roleData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Plan */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">Revenue by Subscription Plan ($)</h3>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={revenueByPlan}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="plan" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="revenue" fill="#8b5cf6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Map widget placeholder */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="font-bold text-gray-900 mb-4 text-sm">Properties Density by Country</h3>
          <div className="h-[180px] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="text-4xl mb-2">🗺️</div>
              <p className="text-sm font-bold text-gray-600">Interactive Map</p>
              <div className="mt-3 flex flex-wrap gap-2 justify-center">
                {[{ c: "Egypt", v: 4820 }, { c: "UAE", v: 890 }, { c: "KSA", v: 580 }, { c: "Kuwait", v: 210 }].map(r => (
                  <span key={r.c} className="text-xs bg-white text-gray-700 font-bold px-2 py-1 rounded-full shadow-sm">{r.c}: {r.v}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: Activity + Pending */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm">Recent Activity</h3>
          </div>
          <div className="divide-y divide-gray-50">
            {RECENT.map((item, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-gray-50 transition-colors">
                <div className={`w-8 h-8 rounded-full ${item.color} flex items-center justify-center text-sm flex-shrink-0`}>{item.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-700">{item.text}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Attention */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="px-5 py-4 border-b border-gray-100">
            <h3 className="font-bold text-gray-900 text-sm flex items-center gap-2">
              <AlertCircle size={15} className="text-red-500" /> Needs Attention
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {PENDING.map((p, i) => (
              <a key={i} href={p.to} className="flex items-center justify-between p-3 rounded-xl bg-red-50 hover:bg-red-100 transition-colors group">
                <div className="flex items-center gap-2">
                  <span>{p.icon}</span>
                  <p className="text-xs text-gray-700 font-medium">{p.label}</p>
                </div>
                <span className="bg-red-500 text-white text-xs font-black px-2 py-0.5 rounded-full">{p.count}</span>
              </a>
            ))}
          </div>
          <div className="px-5 pb-4">
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
              <p className="text-xs font-bold text-amber-800 mb-1">💡 Quick Summary</p>
              <p className="text-xs text-amber-700">Total pending actions: <span className="font-black">95</span></p>
              <p className="text-xs text-amber-700 mt-0.5">Platform health: <span className="font-black text-green-600">Good</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* KemedarBid™ Widget */}
      <AdminAuctionWidget />

      {/* Concierge Pipeline Widget */}
      <AdminConciergeWidget />

      {/* Kemedar Swap™ Widget */}
      <AdminSwapWidget />

      {/* Shop the Look Widget */}
      <AdminSTLWidget />

      {/* Advisor Today Widget */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center text-base">🤖</div>
            <h2 className="text-base font-black text-gray-900">Kemedar Advisor Today</h2>
          </div>
          <Link to="/admin/kemedar/advisor" className="text-xs text-orange-500 font-bold hover:underline">View Full Dashboard →</Link>
        </div>
        <div className="flex flex-wrap gap-4 mb-4">
          {[["Surveys Completed", "89", "text-green-600"], ["New Matches", "247", "text-orange-600"], ["Notifications Sent", "134", "text-blue-600"]].map(([label, val, color]) => (
            <div key={label} className="flex-1 min-w-[120px] bg-gray-50 rounded-xl p-3 text-center">
              <p className={`text-2xl font-black ${color}`}>{val}</p>
              <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-2 mb-4">
          {[
            ["✅", "User completed survey — 12 matches found", "2 min ago"],
            ["🔔", "Instant alert sent — New Cairo apartment, 94% match", "8 min ago"],
            ["🤖", "AI report generated for Ahmed Hassan", "15 min ago"],
            ["🏘️", "New property matched 24 profiles — Sheikh Zayed villa", "32 min ago"],
            ["❤️", "User saved a match — Modern Apartment New Cairo", "1 hr ago"],
          ].map(([icon, text, time], i) => (
            <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
              <span className="text-sm flex-shrink-0">{icon}</span>
              <span className="text-xs text-gray-700 flex-1">{text}</span>
              <span className="text-[11px] text-gray-400 flex-shrink-0">{time}</span>
            </div>
          ))}
        </div>
        <Link to="/admin/kemedar/advisor" className="block w-full text-center border-2 border-orange-400 text-orange-600 font-black py-2.5 rounded-xl text-sm hover:bg-orange-50 transition-all">
          🤖 Go to Advisor Dashboard →
        </Link>
      </div>
    </div>
  );
}