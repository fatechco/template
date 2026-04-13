import { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '@/lib/AuthContext';
import QRGeneratorWidget from '@/components/qr/QRGeneratorWidget';

const QUICK_ACTIONS = [
  { label: "Add Property", icon: "➕", bg: "bg-orange-600" },
  { label: "Hire Employee", icon: "👤", bg: "bg-blue-900" },
  { label: "Hire Marketer", icon: "📢", bg: "bg-teal-600" },
  { label: "Resources & Training", icon: "📚", bg: "bg-purple-600" },
  { label: "Add Task to Team", icon: "✅", bg: "bg-green-600" },
  { label: "Talk with Kemedar", icon: "💬", bg: "bg-red-600" },
];

const AREA_STATS = [
  {
    title: "Kemedar", icon: "🏠", borderColor: "border-t-orange-500", viewColor: "text-orange-600",
    stats: [{ label: "Properties", value: 1247 }, { label: "Projects", value: 34 }, { label: "Buy Requests", value: 89 }],
    trend: "↑ +45 new this week",
  },
  {
    title: "Kemework", icon: "🔧", borderColor: "border-t-teal-500", viewColor: "text-teal-600",
    stats: [{ label: "Active Tasks", value: 156 }, { label: "Professionals", value: 234 }, { label: "Finishing Cos", value: 45 }],
    trend: "↑ +12 new professionals",
  },
  {
    title: "Kemetro", icon: "🛒", borderColor: "border-t-blue-500", viewColor: "text-blue-600",
    stats: [{ label: "Sellers", value: 89 }, { label: "Products", value: 3456 }, { label: "Orders", value: 567 }],
    trend: "↑ +234 new products",
  },
  {
    title: "Users in My Area", icon: "👥", borderColor: "border-t-slate-800", viewColor: "text-slate-800",
    stats: [{ label: "Total", value: 4302 }, { label: "Active", value: 3891 }, { label: "Pending", value: 411 }],
    trend: "↑ +89 new this week",
  },
];

const NEW_USERS_DATA = [
  { type: "Owners & Buyers", count: 234 },
  { type: "Agents", count: 156 },
  { type: "Developers", count: 89 },
  { type: "Professionals", count: 67 },
  { type: "Finishing Cos", count: 34 },
  { type: "Kemetro Sellers", count: 45 },
];

const ALERTS_INIT = [
  { id: 1, type: "urgent", icon: "🔴", message: "3 properties pending verification", date: "Today", border: "border-l-red-500", bg: "bg-red-50" },
  { id: 2, type: "warning", icon: "🟡", message: "2 sellers need approval", date: "Yesterday", border: "border-l-orange-500", bg: "bg-orange-50" },
  { id: 3, type: "info", icon: "🔵", message: "5 new support tickets opened", date: "2 days ago", border: "border-l-blue-500", bg: "bg-blue-50" },
  { id: 4, type: "success", icon: "✅", message: "Weekly report generated", date: "3 days ago", border: "border-l-green-500", bg: "bg-green-50" },
];

const APPOINTMENTS = [
  { time: "10:00 AM", client: "Ahmed Hassan", type: "Property Tour", property: "Villa in Giza" },
  { time: "2:00 PM", client: "Sara Mohamed", type: "Consultation", property: "Apartment Downtown" },
  { time: "4:30 PM", client: "Karim Ali", type: "Meeting", property: "Commercial Space" },
];

const ORDERS = [
  { badge: "VERI", service: "Property Verification", customer: "Hassan Ibrahim", amount: "$150", status: "Completed", statusColor: "text-green-600" },
  { badge: "LIST", service: "Professional Listing", customer: "Fatima Khalil", amount: "$200", status: "In Progress", statusColor: "text-blue-600" },
  { badge: "UP", service: "Boost Listing", customer: "Leila Ahmed", amount: "$50", status: "Active", statusColor: "text-orange-600" },
];

const TEAM = [
  { name: "Hassan Ibrahim", role: "Sales Rep", task: "Follow up with clients", active: true },
  { name: "Noor Hamad", role: "Admin", task: "Process paperwork", active: true },
  { name: "Sara Karim", role: "Marketing", task: "Social media campaigns", active: false },
  { name: "Omar Khalid", role: "Support", task: "Handle tickets", active: true },
  { name: "Layla Noor", role: "Manager", task: "Review reports", active: true },
];

const MESSAGES = [
  { name: "Ahmed Hassan", preview: "Thanks for the property listing!", time: "2 hrs ago", unread: true },
  { name: "Fatima Khalil", preview: "When can we schedule the meeting?", time: "4 hrs ago", unread: true },
  { name: "Hassan Ibrahim", preview: "The reports are ready for review", time: "Yesterday", unread: false },
  { name: "Karim Ali", preview: "Please confirm the project details", time: "2 days ago", unread: false },
  { name: "Sara Mohamed", preview: "Great work on the area analysis!", time: "3 days ago", unread: false },
];

const SUPPORT = [
  { priority: "high", bg: "bg-red-100", text: "text-red-700", subject: "Property listing not showing", user: "Mohammed Noor", time: "1 hour ago" },
  { priority: "medium", bg: "bg-orange-100", text: "text-orange-700", subject: "How to add a new project", user: "Aya Hassan", time: "3 hours ago" },
  { priority: "low", bg: "bg-gray-100", text: "text-gray-700", subject: "Billing question about subscription", user: "Zainab Ahmed", time: "Yesterday" },
];

const REVENUE_BARS = [
  { label: "Kemedar", value: 7200, max: 12450, color: "bg-orange-600" },
  { label: "Kemetro", value: 3500, max: 12450, color: "bg-blue-600" },
  { label: "Kemework", value: 1750, max: 12450, color: "bg-teal-600" },
];

export default function FranchiseOwnerAreaDashboard() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState(ALERTS_INIT);
  const [salesPeriod, setSalesPeriod] = useState("Month");
  const currentDate = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="space-y-6">
      {/* Title Row */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Welcome back, Ahmed! 👋</h1>
          <p className="text-gray-500 text-sm mt-0.5">Here's what's happening in your area today.</p>
          <div className="flex items-center flex-wrap gap-3 mt-2 text-xs text-gray-500">
            <span>📍 Cairo</span>
            <span>📍 Giza Province</span>
            <span>🌍 Egypt</span>
            <span className="text-yellow-600 font-bold">⭐ Performance: 87/100</span>
          </div>
        </div>
        <p className="text-gray-400 text-xs mt-1 shrink-0">{currentDate}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-6 gap-2">
        {QUICK_ACTIONS.map((a, i) => (
          <button key={i} className={`${a.bg} text-white font-bold py-3 rounded-xl text-xs hover:opacity-90 transition-opacity`}>
            {a.label}
          </button>
        ))}
      </div>

      {/* Area Statistics */}
      <div>
        <h2 className="text-lg font-black text-gray-900 mb-3">Area Statistics</h2>
        <div className="grid grid-cols-4 gap-4">
          {AREA_STATS.map((s, i) => (
            <div key={i} className={`bg-white rounded-2xl shadow-sm border-t-4 ${s.borderColor} p-5`}>
              <p className="text-3xl mb-2">{s.icon}</p>
              <p className="font-black text-gray-900 mb-3">{s.title}</p>
              <div className="space-y-1.5 mb-3">
                {s.stats.map((st, j) => (
                  <div key={j} className="flex justify-between text-xs">
                    <span className="text-gray-500">{st.label}</span>
                    <span className={`font-black ${s.viewColor}`}>{st.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <p className="text-xs text-green-600 font-bold mb-2">{s.trend}</p>
              <button className={`text-xs font-bold ${s.viewColor}`}>View →</button>
            </div>
          ))}
        </div>
      </div>

      {/* New Users Bar Chart */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-black text-gray-900">New Users This Month</h2>
          <p className="text-sm font-black text-orange-600">625 new users in your area</p>
        </div>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={NEW_USERS_DATA} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
            <XAxis type="number" tick={{ fontSize: 11 }} />
            <YAxis dataKey="type" type="category" width={130} tick={{ fontSize: 11 }} />
            <Bar dataKey="count" fill="#FF6B00" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* 3-Column Section */}
      <div className="grid grid-cols-12 gap-5">
        {/* Left (5 cols) */}
        <div className="col-span-5 space-y-5">
          {/* Alerts */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-base font-black text-gray-900 mb-3">🔔 Alerts from Kemedar</h2>
            <div className="space-y-2 mb-3">
              {alerts.map((a) => (
                <div key={a.id} className={`${a.bg} border-l-4 ${a.border} px-3 py-2 rounded-lg flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span>{a.icon}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{a.message}</p>
                      <p className="text-xs text-gray-500">{a.date}</p>
                    </div>
                  </div>
                  <button onClick={() => setAlerts(prev => prev.filter(x => x.id !== a.id))} className="text-gray-400 hover:text-gray-600 text-base">×</button>
                </div>
              ))}
            </div>
            <button className="text-sm font-bold text-orange-600 hover:underline">View All Alerts →</button>
          </div>

          {/* Appointments */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-black text-gray-900">📅 Appointments</h2>
              <button className="text-sm font-bold text-orange-600">View All →</button>
            </div>
            <div className="space-y-2 mb-4">
              {APPOINTMENTS.map((a, i) => (
                <div key={i} className="py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-gray-900">{a.time} · {a.client}</p>
                  <p className="text-xs text-gray-500">{a.type} · {a.property}</p>
                </div>
              ))}
            </div>
            <button className="w-full bg-orange-600 text-white font-bold py-2 rounded-lg text-xs hover:bg-orange-700">
              ➕ Schedule Appointment
            </button>
          </div>
        </div>

        {/* Center (4 cols) */}
        <div className="col-span-4 space-y-5">
          {/* Sales Brief */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-black text-gray-900">💰 Sales Brief</h2>
              <div className="flex gap-1">
                {["Today", "Week", "Month"].map(p => (
                  <button key={p} onClick={() => setSalesPeriod(p)} className={`text-xs px-2 py-1 rounded ${salesPeriod === p ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-600"}`}>{p}</button>
                ))}
              </div>
            </div>
            <p className="text-3xl font-black text-green-600 mb-4">$12,450.50</p>
            <div className="space-y-3 mb-4">
              {REVENUE_BARS.map((r, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-500">{r.label}</span>
                    <span className="font-bold">${r.value.toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className={`${r.color} h-2 rounded-full`} style={{ width: `${Math.round((r.value / r.max) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-gray-600">
              <span className="font-bold">12 new</span> · <span className="font-bold">8 pending</span> · <span className="font-bold">23 completed</span>
            </p>
          </div>

          {/* New Orders */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-black text-gray-900">🛍 New Orders</h2>
              <button className="text-sm font-bold text-orange-600">View All →</button>
            </div>
            <div className="space-y-2">
              {ORDERS.map((o, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <div className="flex items-center gap-2">
                    <span className="bg-orange-100 text-orange-700 font-black text-[10px] px-2 py-0.5 rounded">{o.badge}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">{o.service}</p>
                      <p className="text-xs text-gray-500">{o.customer}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-gray-900">{o.amount}</p>
                    <p className={`text-xs font-bold ${o.statusColor}`}>{o.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right (3 cols) */}
        <div className="col-span-3 space-y-5">
          {/* Team Status */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-base font-black text-gray-900 mb-3">👥 Team Status</h2>
            <div className="space-y-3">
              {TEAM.map((m, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center text-xs font-black text-orange-700 flex-shrink-0">
                    {m.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 leading-tight">{m.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{m.task}</p>
                  </div>
                  <span className={`w-2 h-2 rounded-full flex-shrink-0 ${m.active ? "bg-green-500" : "bg-red-400"}`} />
                </div>
              ))}
            </div>
          </div>

          {/* Social Pages */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-base font-black text-gray-900 mb-3">📱 Social Pages</h2>
            <div className="space-y-3">
              {[
                { label: "📘 Facebook", followers: "12.4K followers", gain: "+234 this week ↑" },
                { label: "📷 Instagram", followers: "8.9K followers", gain: "+156 this week ↑" },
                { label: "🔗 LinkedIn", followers: "3.2K connections", gain: null },
              ].map((s, i) => (
                <div key={i}>
                  <p className="text-xs font-bold text-gray-900">{s.label}</p>
                  <p className="text-xs text-gray-500">{s.followers}{s.gain && <span className="text-green-600 ml-1">{s.gain}</span>}</p>
                </div>
              ))}
            </div>
            <button className="text-xs font-bold text-orange-600 hover:underline mt-3 block">Manage Pages →</button>
          </div>
        </div>
      </div>

      {/* My Area QR Code */}
      <div className="bg-white rounded-2xl shadow-sm p-6">
        <h2 className="text-base font-black text-gray-900 mb-1">📱 My Area QR Code</h2>
        <p className="text-sm text-gray-500 mb-4">Share your area profile QR with property owners and buyers in your territory.</p>
        {user && <QRGeneratorWidget targetType="franchise_profile" targetId={user.id} targetTitle={user.full_name} mode="full" />}
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-5">
        {/* Messages + Support */}
        <div className="space-y-5">
          {/* Messages */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-black text-gray-900">💬 New Messages</h2>
              <button className="text-sm font-bold text-orange-600">View All →</button>
            </div>
            <div className="space-y-2">
              {MESSAGES.map((m, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {m.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs ${m.unread ? "font-black" : "font-semibold"} text-gray-900`}>{m.name}</p>
                    <p className="text-xs text-gray-500 truncate">{m.preview}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <p className="text-[10px] text-gray-400">{m.time}</p>
                    {m.unread && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Support Requests */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-base font-black text-gray-900">🎫 New Support Requests</h2>
              <button className="text-sm font-bold text-orange-600">View All →</button>
            </div>
            <div className="space-y-2">
              {SUPPORT.map((t, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded ${t.bg} ${t.text} uppercase flex-shrink-0`}>{t.priority}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900 truncate">{t.subject}</p>
                    <p className="text-xs text-gray-500">{t.user} · {t.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Country FO Card */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center h-full flex flex-col items-center justify-center">
            <p className="text-xs text-gray-500 mb-4 font-semibold uppercase tracking-widest">🌍 Your Country Franchise Owner</p>
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-white font-black text-2xl mb-3">AH</div>
            <p className="text-xl font-black text-gray-900">Amr Hassan</p>
            <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mt-2 inline-block">Country Franchise Owner</span>
            <p className="text-sm text-gray-600 mt-3">🇪🇬 Egypt</p>
            <div className="flex gap-6 mt-3 text-sm text-gray-600">
              <span>📍 15 Cities</span>
              <span>👥 47 Area Owners</span>
            </div>
            <div className="flex gap-2 mt-5 w-full">
              <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs hover:bg-gray-50">📞 Call</button>
              <button className="flex-1 bg-orange-600 text-white font-bold py-2 rounded-xl text-xs hover:bg-orange-700">💬 Chat</button>
              <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2 rounded-xl text-xs hover:bg-gray-50">📧 Email</button>
            </div>
            <button className="mt-3 text-sm font-bold text-orange-600 hover:underline">View Full Profile →</button>
          </div>
        </div>
      </div>
    </div>
  );
}