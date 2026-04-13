import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import {
  Home, Building2, ClipboardList, Users, CheckCircle, Clock,
  Wrench, ShoppingCart, DollarSign, Star, Plus, MessageCircle,
  Phone, Mail, Bell, ChevronRight, TrendingUp, Package, AlertCircle
} from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

const BIG_BUTTON = ({ icon, label, sub, color, to }) => (
  <Link to={to} className={`flex flex-col items-center justify-center gap-2 p-5 rounded-2xl text-white font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105 ${color}`}>
    <span className="text-3xl">{icon}</span>
    <span className="text-sm font-black">{label}</span>
    {sub && <span className="text-xs opacity-75 font-normal text-center">{sub}</span>}
  </Link>
);

const StatCard = ({ icon, label, value, color = "bg-white" }) => (
  <div className={`${color} rounded-xl shadow-sm border border-gray-100 p-4 flex items-center gap-3`}>
    <div className="text-2xl">{icon}</div>
    <div>
      <p className="text-2xl font-black text-gray-900">{value}</p>
      <p className="text-xs text-gray-500">{label}</p>
    </div>
  </div>
);

const SectionHeader = ({ emoji, title, color }) => (
  <div className={`${color} rounded-xl px-5 py-3 flex items-center gap-3 mb-4`}>
    <span className="text-xl">{emoji}</span>
    <h2 className="font-black text-white text-base">{title}</h2>
  </div>
);

const MOCK_APPOINTMENTS = [
  { time: "10:00 AM", client: "Ahmed Hassan", type: "Property Viewing", property: "Modern Apt, New Cairo", status: "Confirmed" },
  { time: "02:30 PM", client: "Fatima Mohamed", type: "Client Meeting", property: "Villa, Sheikh Zayed", status: "Confirmed" },
  { time: "04:00 PM", client: "Omar Rashid", type: "Task Inspection", property: "Finishing Job #34", status: "Pending" },
];

const MOCK_ALERTS = [
  { id: 1, msg: "New policy update for franchise owners — Q1 2026", date: "Today", dismissed: false },
  { id: 2, msg: "Your area has 5 unverified properties pending review", date: "Yesterday", dismissed: false },
  { id: 3, msg: "Monthly performance report for February is available", date: "Mar 1", dismissed: false },
];

const MOCK_ORDERS = [
  { num: "ORD-001", type: "Kemedar", client: "Ahmed H.", amount: "$1,200", status: "New", time: "5 min ago" },
  { num: "ORD-002", type: "Kemetro", client: "Sara K.", amount: "$340", status: "In Progress", time: "1 hr ago" },
  { num: "ORD-003", type: "Kemework", client: "Omar R.", amount: "$850", status: "New", time: "2 hr ago" },
  { num: "ORD-004", type: "Kemedar", client: "Mona T.", amount: "$2,100", status: "Pending", time: "3 hr ago" },
  { num: "ORD-005", type: "Kemetro", client: "Khaled M.", amount: "$76", status: "New", time: "4 hr ago" },
];

const MOCK_MESSAGES = [
  { avatar: "AH", name: "Ahmed Hassan", preview: "Can you help me with the property documents?", time: "5m" },
  { avatar: "FM", name: "Fatima Mohamed", preview: "I'd like to schedule a viewing for next week", time: "1h" },
  { avatar: "KM", name: "Kemedar HQ", preview: "Your February report is ready for review", time: "2h" },
  { avatar: "OR", name: "Omar Rashid", preview: "The handyman completed the job — please verify", time: "3h" },
  { avatar: "SK", name: "Sara Khaled", preview: "Invoice #INV-045 has been paid ✅", time: "5h" },
];

const MOCK_TICKETS = [
  { num: "#T-201", subject: "Cannot upload property photos", user: "Ahmed H.", status: "Open", time: "Today" },
  { num: "#T-202", subject: "Kemetro order not delivered", user: "Fatima M.", status: "Open", time: "Yesterday" },
  { num: "#T-203", subject: "Subscription renewal issue", user: "Omar R.", status: "Pending", time: "Mar 16" },
  { num: "#T-204", subject: "Handyman didn't show up", user: "Sara K.", status: "Open", time: "Mar 15" },
  { num: "#T-205", subject: "Wrong price listed on property", user: "Khaled M.", status: "Resolved", time: "Mar 14" },
];

const MOCK_EMPLOYEES = [
  { initials: "MH", name: "Mohamed Hassan", role: "Property Manager", task: "Verify 3 listings", status: "Active" },
  { initials: "NK", name: "Nour Khaled", role: "Admin Assistant", task: "Process invoices", status: "Active" },
  { initials: "TO", name: "Tarek Omar", role: "Field Inspector", task: "Site visit - Sheikh Zayed", status: "Away" },
  { initials: "RA", name: "Rania Ali", role: "Customer Support", task: "No active task", status: "Idle" },
];

const WEEKLY_REVENUE = [
  { week: "Wk 1", revenue: 4200 },
  { week: "Wk 2", revenue: 6800 },
  { week: "Wk 3", revenue: 5100 },
  { week: "Wk 4", revenue: 7400 },
];

const STATUS_COLORS = {
  Active: "text-green-500", Idle: "text-yellow-500", Away: "text-red-500",
  New: "bg-blue-100 text-blue-700", "In Progress": "bg-yellow-100 text-yellow-700",
  Pending: "bg-gray-100 text-gray-600", Open: "bg-red-100 text-red-700",
  Resolved: "bg-green-100 text-green-700", Confirmed: "bg-green-100 text-green-700",
};

export default function FranchiseDashboard() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState(MOCK_ALERTS);
  const firstName = user?.full_name?.split(" ")[0] || "Friend";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  return (
    <div className="space-y-8">

      {/* SECTION 1 — Greeting Card */}
      <div className="bg-[#1a1a2e] rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">{greeting}, {firstName}! 🌟</h1>
          <p className="text-white/60 text-sm">Area Franchise Owner</p>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="flex items-center gap-1 bg-white/10 text-white/70 text-xs px-3 py-1 rounded-full">📍 Cairo, Egypt</span>
            <span className="flex items-center gap-1 bg-orange-500/20 text-orange-400 text-xs px-3 py-1 rounded-full">🏙 Area Franchise Owner</span>
          </div>
          <div className="flex items-center gap-2 mt-2">
            <Star size={14} className="text-yellow-400 fill-yellow-400" />
            <span className="text-sm text-white/70">Performance Score:</span>
            <div className="flex-1 max-w-[140px] h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full" style={{ width: "87%" }} />
            </div>
            <span className="text-sm font-black text-yellow-400">87/100</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2 w-full md:w-auto">
          {[
            { icon: "🏠", label: "Add Property", to: "/create/property" },
            { icon: "👥", label: "Hire Employee", to: "/dashboard/employees" },
            { icon: "📋", label: "Add Task", to: "/dashboard/biz-tasks" },
            { icon: "💬", label: "Talk to Kemedar", to: "/dashboard/contact-kemedar" },
          ].map(b => (
            <Link key={b.label} to={b.to} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-colors">
              <span>{b.icon}</span> {b.label}
            </Link>
          ))}
        </div>
      </div>

      {/* SECTION 2 — Area Statistics */}
      <div className="space-y-6">
        {/* Kemedar Stats */}
        <div>
          <SectionHeader emoji="🏙" title="Kemedar in My Area" color="bg-orange-500" />
          <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-3">
            {[
              { icon: "🏠", label: "Properties", value: "1,247" },
              { icon: "🏗", label: "Projects", value: "34" },
              { icon: "📝", label: "Buy Requests", value: "89" },
              { icon: "👥", label: "Total Users", value: "4,302" },
              { icon: "✅", label: "Verified Listings", value: "892" },
              { icon: "⏳", label: "Pending Review", value: "47" },
            ].map(s => <StatCard key={s.label} {...s} />)}
          </div>
        </div>

        {/* Kemework Stats */}
        <div>
          <SectionHeader emoji="🔧" title="Kemework in My Area" color="bg-teal-600" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "📋", label: "Total Tasks", value: "156" },
              { icon: "🔄", label: "In Progress", value: "28" },
              { icon: "✅", label: "Completed", value: "121" },
              { icon: "👷", label: "Registered Handymen", value: "43" },
            ].map(s => <StatCard key={s.label} {...s} />)}
          </div>
        </div>

        {/* Kemetro Stats */}
        <div>
          <SectionHeader emoji="🛒" title="Kemetro in My Area" color="bg-blue-600" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { icon: "🏪", label: "Sellers", value: "67" },
              { icon: "📦", label: "Products Listed", value: "2,140" },
              { icon: "🛍", label: "Orders This Month", value: "834" },
              { icon: "💰", label: "GMV This Month", value: "$42,800" },
            ].map(s => <StatCard key={s.label} {...s} />)}
          </div>
        </div>

        {/* New Users */}
        <div>
          <SectionHeader emoji="👥" title="New Users This Month" color="bg-purple-600" />
          <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-7 gap-3">
            {[
              { icon: "🏠", label: "Property Owners", value: "48" },
              { icon: "🔍", label: "Buyers", value: "132" },
              { icon: "🤝", label: "Agents", value: "7" },
              { icon: "🏗", label: "Developers", value: "3" },
              { icon: "👷", label: "Professionals", value: "12" },
              { icon: "🔧", label: "Finishing Cos.", value: "5" },
              { icon: "🛒", label: "Kemetro Sellers", value: "9" },
            ].map(s => <StatCard key={s.label} {...s} />)}
          </div>
        </div>
      </div>

      {/* SECTION 3 — Big Action Buttons Grid */}
      <div className="space-y-3">
        <h2 className="text-lg font-black text-gray-900">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <BIG_BUTTON icon="🏙" label="Kemedar" sub="Properties & Projects" color="bg-orange-500" to="/dashboard/area-properties" />
          <BIG_BUTTON icon="🔧" label="Kemework" sub="Tasks & Handymen" color="bg-teal-600" to="/dashboard/kemework" />
          <BIG_BUTTON icon="🛒" label="Kemetro" sub="Sellers & Products" color="bg-blue-600" to="/dashboard/kemetro-sellers" />
          <BIG_BUTTON icon="💎" label="Premium Services" sub="Subscriptions & Ads" color="bg-purple-600" to="/dashboard/area-subscriptions" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <BIG_BUTTON icon="💰" label="Money & Orders" sub="Wallet & Invoices" color="bg-green-600" to="/dashboard/wallet" />
          <BIG_BUTTON icon="🗂" label="Tools & Comms" sub="Files & Messages" color="bg-slate-600" to="/dashboard/files" />
          <BIG_BUTTON icon="💼" label="Business Manager" sub="CRM & Employees" color="bg-[#1a1a2e]" to="/dashboard/leads" />
          <BIG_BUTTON icon="❓" label="Help & Support" sub="Tickets & Contact" color="bg-red-500" to="/dashboard/tickets" />
        </div>
      </div>

      {/* SECTION 4 — Appointments */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="font-black text-gray-900">📅 Today's Appointments</h2>
          <div className="flex gap-2">
            <Link to="/dashboard/appointments" className="text-xs text-blue-600 hover:underline font-semibold">View All</Link>
            <button className="flex items-center gap-1 bg-orange-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg">
              <Plus size={12} /> Add
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-50">
          {MOCK_APPOINTMENTS.map((a, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3">
              <div className="text-sm font-black text-orange-500 w-20 flex-shrink-0">{a.time}</div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-900">{a.client}</p>
                <p className="text-xs text-gray-500">{a.type} · {a.property}</p>
              </div>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[a.status]}`}>{a.status}</span>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5 — Alerts from Kemedar */}
      <div className="space-y-3">
        <h2 className="font-black text-gray-900">🔔 Alerts from Kemedar</h2>
        {alerts.filter(a => !a.dismissed).map(alert => (
          <div key={alert.id} className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-4">
            <AlertCircle size={20} className="text-orange-500 flex-shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-gray-900">{alert.msg}</p>
              <p className="text-xs text-gray-400 mt-0.5">{alert.date}</p>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <button className="text-xs text-orange-600 font-bold hover:underline">View</button>
              <button onClick={() => setAlerts(prev => prev.map(a => a.id === alert.id ? { ...a, dismissed: true } : a))} className="text-xs text-gray-400 hover:text-gray-600">✕</button>
            </div>
          </div>
        ))}
      </div>

      {/* SECTION 6 — Sales Brief */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-black text-gray-900">💰 Sales Brief</h2>
          <Link to="/dashboard/biz-reports" className="text-xs text-blue-600 hover:underline font-semibold flex items-center gap-1">
            View Full Report <ChevronRight size={12} />
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-5">
          {[
            { label: "This Month Revenue", value: "$23,400", color: "text-green-600" },
            { label: "Last Month Revenue", value: "$19,800", color: "text-gray-700" },
            { label: "Monthly Target", value: "$30,000", color: "text-blue-600" },
            { label: "Achievement %", value: "78%", color: "text-orange-500" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>
        <ResponsiveContainer width="100%" height={100}>
          <BarChart data={WEEKLY_REVENUE}>
            <XAxis dataKey="week" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis hide />
            <Tooltip formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]} />
            <Bar dataKey="revenue" fill="#FF6B00" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* SECTION 7 — Two Column Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">
        {/* LEFT 60% */}
        <div className="xl:col-span-3 space-y-5">
          {/* New Orders */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-sm">🛍 New Orders in My Area</h3>
              <Link to="/dashboard/orders/new" className="text-xs text-blue-600 hover:underline font-semibold">View All →</Link>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Order#", "Type", "Client", "Amount", "Status", "Time"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-bold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_ORDERS.map((o, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-2.5 font-bold text-gray-900">{o.num}</td>
                    <td className="px-4 py-2.5"><span className="bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">{o.type}</span></td>
                    <td className="px-4 py-2.5 text-gray-700">{o.client}</td>
                    <td className="px-4 py-2.5 font-bold text-gray-900">{o.amount}</td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full font-bold ${STATUS_COLORS[o.status]}`}>{o.status}</span></td>
                    <td className="px-4 py-2.5 text-gray-400">{o.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* New Messages */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-sm">💬 New Messages</h3>
              <Link to="/dashboard/messages" className="text-xs text-blue-600 hover:underline font-semibold">View All →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_MESSAGES.map((m, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3 hover:bg-gray-50">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a2e] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{m.avatar}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900">{m.name}</p>
                    <p className="text-xs text-gray-500 truncate">{m.preview}</p>
                  </div>
                  <span className="text-xs text-gray-400 flex-shrink-0">{m.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Support Tickets */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-sm">🎫 New Support Requests</h3>
              <Link to="/dashboard/tickets" className="text-xs text-blue-600 hover:underline font-semibold">View All →</Link>
            </div>
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Ticket#", "Subject", "User", "Status", "Time"].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left font-bold text-gray-600">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_TICKETS.map((t, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-2.5 font-bold text-gray-600">{t.num}</td>
                    <td className="px-4 py-2.5 text-gray-800">{t.subject}</td>
                    <td className="px-4 py-2.5 text-gray-600">{t.user}</td>
                    <td className="px-4 py-2.5"><span className={`px-2 py-0.5 rounded-full font-bold ${STATUS_COLORS[t.status]}`}>{t.status}</span></td>
                    <td className="px-4 py-2.5 text-gray-400">{t.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RIGHT 40% */}
        <div className="xl:col-span-2 space-y-5">
          {/* Employees */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-sm">👨‍💼 Employment Status</h3>
              <Link to="/dashboard/employees" className="text-xs text-blue-600 hover:underline font-semibold">Manage →</Link>
            </div>
            <div className="divide-y divide-gray-50">
              {MOCK_EMPLOYEES.map((e, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0">{e.initials}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-gray-900">{e.name}</p>
                    <p className="text-[10px] text-gray-500 truncate">{e.task}</p>
                  </div>
                  <span className={`text-xs font-bold ${STATUS_COLORS[e.status]}`}>● {e.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Social Pages */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h3 className="font-black text-gray-900 text-sm">📱 My Social Pages Activity</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {[
                { platform: "Facebook", icon: "📘", page: "Kemedar Cairo", followers: "12,400", posts: 5, engagement: "4.2%" },
                { platform: "Instagram", icon: "📸", page: "@kemedar_cairo", followers: "8,900", posts: 12, engagement: "6.8%" },
                { platform: "LinkedIn", icon: "💼", page: "Kemedar Egypt", followers: "3,200", posts: 3, engagement: "3.1%" },
              ].map((s, i) => (
                <div key={i} className="flex items-center gap-3 px-5 py-3">
                  <span className="text-xl">{s.icon}</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">{s.page}</p>
                    <p className="text-[10px] text-gray-400">{s.followers} followers · {s.posts} posts/wk</p>
                  </div>
                  <span className="text-xs font-black text-green-600">{s.engagement}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Country Franchise Owner */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
            <div className="w-16 h-16 rounded-full bg-[#1a1a2e] text-white font-black text-xl flex items-center justify-center mx-auto mb-3">MA</div>
            <p className="font-black text-gray-900">Mohamed Adel</p>
            <p className="text-xs text-orange-500 font-bold mb-1">Your Country Franchise Owner</p>
            <p className="text-xs text-gray-400 mb-4">Coverage: Egypt 🇪🇬</p>
            <div className="flex gap-2 justify-center">
              <button className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-lg"><Phone size={11} /> Call</button>
              <button className="flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-3 py-2 rounded-lg"><MessageCircle size={11} /> Chat</button>
              <button className="flex items-center gap-1 bg-gray-700 text-white text-xs font-bold px-3 py-2 rounded-lg"><Mail size={11} /> Email</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}