import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import QRGeneratorWidget from "@/components/qr/QRGeneratorWidget";
import { base44 } from "@/api/base44Client";
import { Menu } from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import KemeworkProfessionalDrawer from "@/components/kemework/KemeworkProfessionalDrawer";

const REVENUE_DATA = [
  { day: "Mar 1", amount: 0 }, { day: "Mar 5", amount: 320 }, { day: "Mar 8", amount: 180 },
  { day: "Mar 12", amount: 650 }, { day: "Mar 15", amount: 420 }, { day: "Mar 18", amount: 890 },
  { day: "Mar 20", amount: 760 },
];

const MOCK_TASKS = [
  { id: 1, title: "Full Kitchen Renovation", category: "Remodeling", budgetMin: 3000, budgetMax: 6000, currency: "USD", bids: 7, hoursAgo: 2, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=70" },
  { id: 2, title: "Electrical Rewiring — Apartment", category: "Electrical", budgetMin: 800, budgetMax: 1500, currency: "USD", bids: 3, hoursAgo: 5, image: null },
  { id: 3, title: "Bathroom Tile Installation", category: "Tiling", budgetMin: 300, budgetMax: 600, currency: "USD", bids: 9, hoursAgo: 8, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&q=70" },
];

const MOCK_ORDERS = [
  { id: "KW-00421", client: "Fatima Al-Zahra", task: "Kitchen Cabinet Installation", deadline: "Mar 31", status: "In Progress" },
  { id: "KW-00355", client: "Karim Mansour", task: "Electrical Panel Upgrade", deadline: "Mar 25", status: "Pending" },
  { id: "KW-00310", client: "Nour Salem", task: "Interior Painting — Living Room", deadline: "Apr 3", status: "Delivered" },
];

const MOCK_BIDS = [
  { id: 1, task: "Garden Landscaping & Irrigation", amount: 3500, currency: "USD", status: "Pending", date: "Mar 18" },
  { id: 2, task: "AC Units Installation — Villa", amount: 750, currency: "USD", status: "Accepted", date: "Mar 15" },
  { id: 3, task: "Interior Painting — 4 Bedrooms", amount: 1400, currency: "USD", status: "Rejected", date: "Mar 10" },
];

const STATUS_COLORS = {
  "Open": "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Pending": "bg-gray-100 text-gray-600",
  "Delivered": "bg-purple-100 text-purple-700",
  "Completed": "bg-green-100 text-green-700",
  "Accepted": "bg-green-100 text-green-700",
  "Rejected": "bg-red-100 text-red-700",
};

export default function ProDashboardHome() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [available, setAvailable] = useState(true);
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const firstName = user?.full_name?.split(" ")[0] || "there";

  return (
    <div className="min-h-screen" style={{ background: "#F0FDF4" }}>
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 flex items-center justify-between" style={{ height: 56 }}>
        <button onClick={() => setDrawerOpen(true)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Menu size={22} className="text-gray-900" />
        </button>
        <div className="flex items-center gap-2">
          <span className="text-lg">🔧</span>
          <span className="font-black text-gray-900">Pro Dashboard</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-teal-600 flex items-center justify-center text-sm font-black text-white">
          {(user?.full_name || "P")[0]}
        </div>
      </div>

      <div className="px-4 py-5 pb-28 space-y-5 max-w-2xl mx-auto">

        {/* Greeting Card */}
        <div className="rounded-2xl p-5" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xl font-black text-white mb-1">Welcome back, {firstName}! 🔧</p>
              <span className="inline-block text-xs font-black px-3 py-1 rounded-full bg-teal-500/20 text-teal-300">Professional</span>
            </div>
            <span className="text-xs font-bold px-2 py-1 rounded-full bg-amber-500/20 text-amber-300">🏅 Accredited</span>
          </div>

          {/* Availability Toggle */}
          <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between mt-3">
            <div>
              <p className="text-white font-bold text-sm">{available ? "🟢 Available for new tasks" : "🔴 Not accepting new tasks"}</p>
              <p className="text-gray-400 text-xs mt-0.5">Clients can {available ? "contact" : "not contact"} you for new work</p>
            </div>
            <button onClick={() => setAvailable(a => !a)} className={`w-14 h-7 rounded-full transition-colors relative flex-shrink-0 ${available ? "bg-teal-500" : "bg-gray-600"}`}>
              <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${available ? "left-7" : "left-0.5"}`} />
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { icon: "📋", label: "Active Jobs", value: 3, color: "text-amber-600" },
            { icon: "📬", label: "Pending Bids", value: 5, color: "text-blue-600" },
            { icon: "✅", label: "Completed", value: 47, color: "text-green-600" },
            { icon: "💰", label: "This Month", value: "$2,340", color: "text-teal-600" },
            { icon: "⭐", label: "Rating", value: "4.9", color: "text-amber-500" },
            { icon: "👁", label: "Profile Views", value: 124, color: "text-purple-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100">
              <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
              <p className="text-[10px] text-gray-500 font-semibold mt-0.5 leading-tight">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Revenue Chart */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900 text-sm">Revenue — Last 30 Days</p>
            <Link to="/dashboard/pro/earnings" className="text-xs font-bold text-teal-600">View Report →</Link>
          </div>
          <div className="h-20">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={REVENUE_DATA}>
                <Line type="monotone" dataKey="amount" stroke="#0D9488" strokeWidth={2.5} dot={false} />
                <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 12 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* New Available Tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900">New Tasks in Your Categories 🔥</p>
            <Link to="/kemework/tasks" className="text-xs font-bold text-teal-600">View All →</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {MOCK_TASKS.map(task => (
              <div key={task.id} className="flex-shrink-0 w-52 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-20 bg-gray-100">
                  {task.image ? <img src={task.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>}
                </div>
                <div className="p-3">
                  <p className="text-xs font-black text-gray-900 line-clamp-1 mb-1">{task.title}</p>
                  <p className="text-[10px] text-gray-400 mb-1">{task.category} · {task.hoursAgo}h ago · {task.bids} bids</p>
                  <p className="text-xs font-black mb-2" style={{ color: "#C41230" }}>${task.budgetMin}–${task.budgetMax}</p>
                  <Link to={`/kemework/task/${task.id}`} className="block text-center text-xs font-bold py-1.5 rounded-lg text-white" style={{ background: "#C41230" }}>Bid Now</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Active Orders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900">Active Orders</p>
            <Link to="/dashboard/pro/orders" className="text-xs font-bold text-teal-600">View All →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {MOCK_ORDERS.map(o => (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-black text-gray-600 flex-shrink-0">{o.client[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 truncate">{o.task}</p>
                  <p className="text-[10px] text-gray-400">{o.client} · Due {o.deadline}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                  <Link to="/dashboard/pro/orders" className="text-xs font-bold text-teal-600">→</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Bids */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900">My Recent Bids</p>
            <Link to="/dashboard/pro/my-bids" className="text-xs font-bold text-teal-600">View All →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {MOCK_BIDS.map(b => (
              <div key={b.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 truncate">{b.task}</p>
                  <p className="text-[10px] text-gray-400">Submitted {b.date} · ${b.amount}</p>
                </div>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[b.status]}`}>{b.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Professional Profile QR */}
        {user && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className="font-black text-gray-900 text-sm mb-1">📱 My Profile QR Code</p>
            <p className="text-xs text-gray-400 mb-3">Print your QR on business cards. Clients scan it to see your portfolio, rating, and book your services.</p>
            <QRGeneratorWidget targetType="professional_profile" targetId={user.id} targetTitle={user.full_name} mode="compact" />
          </div>
        )}
      </div>

      <KemeworkProfessionalDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={user} />
    </div>
  );
}