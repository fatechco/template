import { useState } from 'react';
import { Menu, Bell } from 'lucide-react';
import FranchiseOwnerDrawer from '@/components/dashboard/FranchiseOwnerDrawer';



const AREA_STATS = [
  {
    title: "Kemedar", icon: "🏠", bg: "bg-orange-600",
    stats: [{ label: "Properties", value: 1247 }, { label: "Projects", value: 34 }, { label: "Buy Requests", value: 89 }],
  },
  {
    title: "Kemework", icon: "🔧", bg: "bg-teal-600",
    stats: [{ label: "Active Tasks", value: 156 }, { label: "Professionals", value: 234 }, { label: "Finishing Cos", value: 45 }],
  },
  {
    title: "Kemetro", icon: "🛒", bg: "bg-blue-600",
    stats: [{ label: "Sellers", value: 89 }, { label: "Products", value: 3456 }, { label: "Orders", value: 567 }],
  },
  {
    title: "Users", icon: "👥", bg: "bg-slate-800",
    stats: [{ label: "Total", value: 4302 }, { label: "Active", value: 3891 }, { label: "Pending", value: 411 }],
  },
];

const NEW_USERS_DATA = [
  { type: "Owners & Buyers", count: 234, color: "bg-orange-600", max: 234 },
  { type: "Agents", count: 156, color: "bg-teal-600", max: 234 },
  { type: "Developers", count: 89, color: "bg-slate-800", max: 234 },
  { type: "Professionals", count: 67, color: "bg-green-600", max: 234 },
  { type: "Finishing Cos", count: 34, color: "bg-amber-700", max: 234 },
  { type: "Kemetro Sellers", count: 45, color: "bg-blue-600", max: 234 },
];

const ALERTS_INIT = [
  { id: 1, icon: "🔴", message: "3 properties pending verification", border: "border-l-red-500", bg: "bg-red-50" },
  { id: 2, icon: "🟡", message: "2 sellers need approval", border: "border-l-orange-500", bg: "bg-orange-50" },
  { id: 3, icon: "🔵", message: "5 new support tickets", border: "border-l-blue-500", bg: "bg-blue-50" },
];

const APPOINTMENTS = [
  { time: "10:00 AM", client: "Ahmed Hassan", type: "Property Tour" },
  { time: "2:00 PM", client: "Sara Mohamed", type: "Consultation" },
  { time: "4:30 PM", client: "Karim Ali", type: "Meeting" },
];

const ORDERS = [
  { badge: "VERI", service: "Property Verification", customer: "Hassan Ibrahim", amount: "$150" },
  { badge: "LIST", service: "Professional Listing", customer: "Fatima Khalil", amount: "$200" },
  { badge: "UP", service: "Boost Listing", customer: "Leila Ahmed", amount: "$50" },
];

const TEAM = [
  { name: "Hassan Ibrahim", role: "Sales Rep", active: true },
  { name: "Noor Hamad", role: "Admin", active: true },
  { name: "Sara Karim", role: "Marketing", active: false },
  { name: "Omar Khalid", role: "Support", active: true },
  { name: "Layla Noor", role: "Manager", active: true },
];

const MESSAGES = [
  { name: "Ahmed Hassan", preview: "Thanks for the property listing!", time: "2h", unread: true },
  { name: "Fatima Khalil", preview: "When can we schedule the meeting?", time: "4h", unread: true },
  { name: "Hassan Ibrahim", preview: "The reports are ready for review", time: "1d", unread: false },
  { name: "Karim Ali", preview: "Please confirm the project details", time: "2d", unread: false },
  { name: "Sara Mohamed", preview: "Great work on the area analysis!", time: "3d", unread: false },
];

const SUPPORT = [
  { priority: "High", bg: "bg-red-100", text: "text-red-700", subject: "Property listing not showing", time: "1h ago" },
  { priority: "Med", bg: "bg-orange-100", text: "text-orange-700", subject: "How to add a new project", time: "3h ago" },
  { priority: "Low", bg: "bg-gray-100", text: "text-gray-700", subject: "Billing subscription question", time: "Yesterday" },
];

export default function FranchiseDashboardMobile() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  const [alerts, setAlerts] = useState(ALERTS_INIT);

  return (
    <div className="min-h-full bg-gray-50 pb-28 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => setDrawerOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Menu size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Dashboard</h1>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg relative">
          <Bell size={22} className="text-gray-900" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
        </button>
      </div>

      <FranchiseOwnerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} />

      <div className="px-4 py-4 space-y-4">

        {/* Greeting Card */}
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-5 text-white">
          <p className="text-base font-black">Welcome back, Ahmed! 🌟</p>
          <p className="text-xs text-orange-100 mt-1">📍 Cairo, Giza Province, Egypt</p>
          <p className="text-xs text-orange-100 mt-1">⭐ Performance: 87/100</p>
          <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
            {["➕ Property", "👤 Employee", "✅ Task", "💬 Kemedar"].map((btn, i) => (
              <button key={i} className="flex-shrink-0 bg-white text-orange-600 font-bold px-3 py-2 rounded-xl text-xs">
                {btn}
              </button>
            ))}
          </div>
        </div>

        {/* Area Stats - horizontal scroll */}
        <div>
          <p className="text-sm font-black text-gray-900 mb-2">Area Statistics</p>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {AREA_STATS.map((s, i) => (
              <div key={i} className={`flex-shrink-0 w-44 ${s.bg} rounded-2xl p-4 text-white`}>
                <p className="text-2xl mb-1">{s.icon}</p>
                <p className="font-black text-sm mb-2">{s.title}</p>
                {s.stats.map((st, j) => (
                  <div key={j} className="flex justify-between text-xs mb-1">
                    <span className="text-white/80">{st.label}</span>
                    <span className="font-black">{st.value.toLocaleString()}</span>
                  </div>
                ))}
                <button className="text-xs font-bold text-white/80 mt-2">View →</button>
              </div>
            ))}
          </div>
        </div>

        {/* New Users Bar Chart */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-sm font-black text-gray-900 mb-3">New Users This Month</p>
          <div className="space-y-2">
            {NEW_USERS_DATA.map((d, i) => (
              <div key={i} className="flex items-center gap-2">
                <p className="text-xs text-gray-600 w-24 flex-shrink-0 truncate">{d.type}</p>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div className={`${d.color} h-2 rounded-full`} style={{ width: `${Math.round((d.count / d.max) * 100)}%` }} />
                </div>
                <p className="text-xs font-black text-gray-900 w-8 text-right">{d.count}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Alerts */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-sm font-black text-gray-900 mb-3">🔔 Alerts from Kemedar</p>
          {alerts.length === 0 ? (
            <p className="text-xs text-gray-400 text-center py-2">No active alerts</p>
          ) : (
            <div className="space-y-2">
              {alerts.map((a) => (
                <div key={a.id} className={`${a.bg} border-l-4 ${a.border} px-3 py-2 rounded-lg flex items-center justify-between`}>
                  <div className="flex items-center gap-2">
                    <span>{a.icon}</span>
                    <p className="text-xs font-bold text-gray-900">{a.message}</p>
                  </div>
                  <button onClick={() => setAlerts(p => p.filter(x => x.id !== a.id))} className="text-gray-400 text-base">×</button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Appointments */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-black text-gray-900">📅 Appointments</p>
            <button className="text-xs font-bold text-orange-600">View All →</button>
          </div>
          <div className="space-y-2">
            {APPOINTMENTS.map((a, i) => (
              <div key={i} className="py-2 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-gray-900">{a.client}</p>
                  <p className="text-xs text-gray-500">{a.type}</p>
                </div>
                <p className="text-xs font-bold text-orange-600">{a.time}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sales Brief */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-sm font-black text-gray-900 mb-3">💰 Sales Brief — This Month</p>
          <p className="text-3xl font-black text-green-600 mb-4">$12,450.50</p>
          {[
            { label: "Kemedar", val: 7200, max: 12450, color: "bg-orange-600" },
            { label: "Kemetro", val: 3500, max: 12450, color: "bg-blue-600" },
            { label: "Kemework", val: 1750, max: 12450, color: "bg-teal-600" },
          ].map((r, i) => (
            <div key={i} className="mb-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-gray-500">{r.label}</span>
                <span className="font-bold">${r.val.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-1.5">
                <div className={`${r.color} h-1.5 rounded-full`} style={{ width: `${Math.round((r.val / r.max) * 100)}%` }} />
              </div>
            </div>
          ))}
        </div>

        {/* New Orders - horizontal scroll */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <p className="text-sm font-black text-gray-900">🛍 New Orders</p>
            <button className="text-xs font-bold text-orange-600">View All →</button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
            {ORDERS.map((o, i) => (
              <div key={i} className="flex-shrink-0 w-44 bg-white rounded-2xl p-4 border border-gray-100">
                <span className="bg-orange-100 text-orange-700 font-black text-[10px] px-2 py-0.5 rounded">{o.badge}</span>
                <p className="text-xs font-bold text-gray-900 mt-2 line-clamp-1">{o.service}</p>
                <p className="text-xs text-gray-500 mt-1">{o.customer}</p>
                <p className="text-sm font-black text-orange-600 mt-1">{o.amount}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Status */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <p className="text-sm font-black text-gray-900 mb-3">👥 Team Status</p>
          <div className="space-y-3">
            {TEAM.map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center text-xs font-black text-orange-700">
                  {m.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1">
                  <p className="text-xs font-bold text-gray-900">{m.name}</p>
                  <p className="text-xs text-gray-500">{m.role}</p>
                </div>
                <span className={`w-2.5 h-2.5 rounded-full ${m.active ? "bg-green-500" : "bg-red-400"}`} />
              </div>
            ))}
          </div>
        </div>

        {/* Messages */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-black text-gray-900">💬 New Messages</p>
            <button className="text-xs font-bold text-orange-600">View All →</button>
          </div>
          <div className="space-y-2">
            {MESSAGES.map((m, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100">
                <div className="w-9 h-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-bold flex-shrink-0">
                  {m.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs ${m.unread ? "font-black" : "font-semibold"} text-gray-900`}>{m.name}</p>
                  <p className="text-xs text-gray-500 truncate">{m.preview}</p>
                </div>
                <div className="flex items-center gap-1">
                  <p className="text-[10px] text-gray-400">{m.time}</p>
                  {m.unread && <span className="w-2 h-2 bg-blue-500 rounded-full" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Support Requests */}
        <div className="bg-white rounded-2xl p-4 border border-gray-100">
          <div className="flex justify-between items-center mb-3">
            <p className="text-sm font-black text-gray-900">🎫 Support Requests</p>
            <button className="text-xs font-bold text-orange-600">View All →</button>
          </div>
          <div className="space-y-2">
            {SUPPORT.map((t, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-100">
                <span className={`text-[10px] font-black px-2 py-0.5 rounded ${t.bg} ${t.text} flex-shrink-0`}>{t.priority}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{t.subject}</p>
                  <p className="text-xs text-gray-500">{t.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Country FO Card */}
        <div className="bg-white rounded-2xl p-5 border border-gray-100 text-center">
          <p className="text-xs text-gray-500 font-semibold uppercase tracking-widest mb-3">🌍 Your Country Franchise Owner</p>
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-200 to-orange-400 flex items-center justify-center text-white font-black text-xl mx-auto mb-3">AH</div>
          <p className="font-black text-gray-900">Amr Hassan</p>
          <span className="bg-orange-100 text-orange-700 text-xs font-bold px-3 py-1 rounded-full mt-2 inline-block">Country Franchise Owner</span>
          <p className="text-sm text-gray-600 mt-2">🇪🇬 Egypt</p>
          <div className="flex justify-center gap-4 mt-2 text-xs text-gray-600">
            <span>📍 15 Cities</span>
            <span>👥 47 Area Owners</span>
          </div>
          <div className="flex gap-2 mt-4">
            <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs">📞 Call</button>
            <button className="flex-1 bg-orange-600 text-white font-bold py-2.5 rounded-xl text-xs">💬 Chat</button>
            <button className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-xs">📧 Email</button>
          </div>
          <button className="text-xs font-bold text-orange-600 mt-3">View Full Profile →</button>
        </div>
      </div>
    </div>
  );
}