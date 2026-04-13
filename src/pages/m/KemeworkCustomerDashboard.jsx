import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Menu } from "lucide-react";
import KemeworkCustomerDrawer from "@/components/kemework/KemeworkCustomerDrawer";

const MOCK_TASKS = [
  { id: 1, title: "Kitchen Renovation — Full Remodel", category: "Remodeling", status: "Open", budgetMin: 3000, budgetMax: 6000, currency: "USD", bids: 7, image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=200&q=70" },
  { id: 2, title: "Apartment Electrical Rewiring", category: "Electrical", status: "In Progress", budgetMin: 800, budgetMax: 1500, currency: "USD", bids: 3, image: null },
  { id: 3, title: "Bathroom Tile Installation", category: "Tiling", status: "Open", budgetMin: 300, budgetMax: 600, currency: "USD", bids: 9, image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=200&q=70" },
];

const MOCK_ORDERS = [
  { id: "KW-00421", pro: "Ahmed Hassan", service: "Kitchen Cabinet Installation", status: "In Progress", amount: 1800, currency: "USD" },
  { id: "KW-00398", pro: "Omar Khalid", service: "Plumbing Repair — 2 bathrooms", status: "Completed", amount: 350, currency: "USD" },
  { id: "KW-00355", pro: "Sara Mohamed", service: "Electrical Panel Upgrade", status: "Under Review", amount: 900, currency: "USD" },
];

const MOCK_PROS = [
  { name: "Nadia Ali", cat: "Interior Designer", rating: 5.0, from: 120, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=60&q=70" },
  { name: "Kareem Saad", cat: "Carpenter", rating: 4.6, from: 30, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=70" },
  { name: "Youssef Reda", cat: "HVAC Technician", rating: 4.5, from: 40, avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=60&q=70" },
];

const STATUS_COLORS = {
  "Open": "bg-blue-100 text-blue-700",
  "In Progress": "bg-amber-100 text-amber-700",
  "Completed": "bg-green-100 text-green-700",
  "Cancelled": "bg-gray-100 text-gray-500",
  "Under Review": "bg-purple-100 text-purple-700",
  "Disputed": "bg-red-100 text-red-700",
};

export default function KemeworkCustomerDashboard() {
  const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);

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
          <span className="font-black text-gray-900">Kemework</span>
        </div>
        <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm font-black text-teal-700">
          {(user?.full_name || "?")[0]}
        </div>
      </div>

      <div className="px-4 py-5 pb-28 space-y-5 max-w-2xl mx-auto">

        {/* Greeting Card */}
        <div className="rounded-2xl p-5 text-white" style={{ background: "linear-gradient(135deg, #0D9488 0%, #0F766E 100%)" }}>
          <p className="text-xl font-black mb-0.5">Welcome back, {firstName}! 🏠</p>
          <p className="text-teal-100 text-sm mb-4">Kemework — Your Home Services Hub</p>
          <div className="grid grid-cols-4 gap-2">
            {[
              { icon: "📋", label: "Post Task", path: "/kemework/post-task" },
              { icon: "🔍", label: "Find Pro", path: "/kemework/find-professionals" },
              { icon: "📦", label: "My Orders", path: "/dashboard/kemework/orders" },
              { icon: "💬", label: "Messages", path: "/dashboard/messages" },
            ].map(a => (
              <button key={a.label} onClick={() => navigate(a.path)}
                className="flex flex-col items-center gap-1 bg-white/20 hover:bg-white/30 rounded-xl py-2.5 transition-colors active:scale-95">
                <span className="text-xl">{a.icon}</span>
                <span className="text-[10px] font-bold">{a.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { icon: "📋", label: "Tasks Posted", value: 8, color: "text-blue-600" },
            { icon: "✅", label: "Tasks Completed", value: 5, color: "text-green-600" },
            { icon: "💬", label: "Active Chats", value: 3, color: "text-purple-600" },
            { icon: "⭐", label: "Reviews Given", value: 4, color: "text-amber-600" },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">{s.icon}</span>
                <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
              </div>
              <p className="text-xs text-gray-500 font-semibold">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Active Tasks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900">My Active Tasks <span className="text-gray-400 font-semibold">({MOCK_TASKS.length})</span></p>
            <Link to="/dashboard/kemework/my-tasks" className="text-xs font-bold text-teal-600">View All →</Link>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {MOCK_TASKS.map(task => (
              <div key={task.id} className="flex-shrink-0 w-52 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="h-24 bg-gray-100">
                  {task.image
                    ? <img src={task.image} alt="" className="w-full h-full object-cover" />
                    : <div className="w-full h-full flex items-center justify-center text-3xl">🔧</div>
                  }
                </div>
                <div className="p-3">
                  <p className="text-xs font-black text-gray-900 line-clamp-2 mb-1.5">{task.title}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-600">{task.category}</span>
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${STATUS_COLORS[task.status]}`}>{task.status}</span>
                  </div>
                  <p className="text-[10px] text-gray-500 mb-1">{task.bids} bids · ${task.budgetMin}–${task.budgetMax}</p>
                  <Link to={`/dashboard/kemework/my-tasks`} className="block text-center text-xs font-bold py-1 rounded-lg text-teal-700 bg-teal-50 hover:bg-teal-100 transition-colors">View →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900">Recent Orders</p>
            <Link to="/dashboard/kemework/orders" className="text-xs font-bold text-teal-600">View All →</Link>
          </div>
          <div className="flex flex-col gap-2">
            {MOCK_ORDERS.map(o => (
              <div key={o.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-sm font-black text-teal-700 flex-shrink-0">
                  {o.pro[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-black text-gray-900 truncate">{o.service}</p>
                  <p className="text-[10px] text-gray-400">{o.id} · {o.pro}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                  <p className="text-xs font-black text-gray-900">${o.amount}</p>
                </div>
                <Link to="/dashboard/kemework/orders" className="text-xs font-bold text-teal-600 ml-1">Track →</Link>
              </div>
            ))}
          </div>
        </div>

        {/* Recommended Pros */}
        <div>
          <p className="font-black text-gray-900 mb-3">Professionals You Might Like</p>
          <div className="flex flex-col gap-2">
            {MOCK_PROS.map(p => (
              <div key={p.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm px-4 py-3 flex items-center gap-3">
                <img src={p.avatar} alt={p.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-black text-gray-900">{p.name}</p>
                  <p className="text-xs text-gray-400">{p.cat} · ⭐ {p.rating}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black" style={{ color: "#C41230" }}>From ${p.from}</p>
                  <Link to="/kemework/find-professionals" className="text-xs font-bold text-teal-600">View →</Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <KemeworkCustomerDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={user} />
    </div>
  );
}