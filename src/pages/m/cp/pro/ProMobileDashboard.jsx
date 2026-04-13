import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { ChevronRight, Star, TrendingUp, MessageSquare, Clock, DollarSign } from "lucide-react";

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

export default function ProMobileDashboard() {
  const [available, setAvailable] = useState(true);
  const { data: user } = useQuery({ queryKey: ["me"], queryFn: () => base44.auth.me() });
  const firstName = user?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-4 px-4 py-4 max-w-[480px] mx-auto">
      {/* Greeting Card */}
      <div className="rounded-2xl p-4" style={{ background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" }}>
        <div className="flex items-start justify-between mb-3">
          <div>
            <p className="text-xl font-black text-white mb-1">Welcome, {firstName}! 🔧</p>
            <span className="inline-block text-[10px] font-black px-2.5 py-1 rounded-full bg-teal-500/20 text-teal-300">Professional</span>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">🏅 Accredited</span>
        </div>

        {/* Availability Toggle */}
        <div className="bg-white/10 rounded-xl p-3 flex items-center justify-between">
          <div className="flex-1">
            <p className="text-white font-bold text-sm">{available ? "🟢 Available" : "🔴 Not Available"}</p>
            <p className="text-gray-400 text-[11px] mt-0.5">Clients can {available ? "reach" : "not reach"} you</p>
          </div>
          <button onClick={() => setAvailable(a => !a)} className={`w-14 h-7 rounded-full transition-colors relative flex-shrink-0 ${available ? "bg-teal-500" : "bg-gray-600"}`}>
            <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${available ? "left-7" : "left-0.5"}`} />
          </button>
        </div>
      </div>

      {/* Key Stats - Compact Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: "📋", label: "Active Jobs", value: 3, color: "text-amber-600" },
          { icon: "📬", label: "Pending Bids", value: 5, color: "text-blue-600" },
          { icon: "💰", label: "This Month", value: "$2,340", color: "text-teal-600" },
          { icon: "⭐", label: "Rating", value: "4.9", color: "text-amber-500" },
        ].map(s => (
          <div key={s.label} className="bg-white rounded-xl p-3 border border-gray-100 shadow-sm">
            <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-[10px] text-gray-500 font-semibold mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-2 gap-3">
        <Link to="/kemework/tasks" className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl p-4 text-white flex flex-col items-start justify-between min-h-[100px]">
          <div>
            <p className="text-2xl mb-2">🔥</p>
            <p className="font-bold text-sm">New Tasks</p>
          </div>
          <p className="text-xs opacity-90">12 available</p>
        </Link>
        <Link to="/cp/pro/orders" className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-4 text-white flex flex-col items-start justify-between min-h-[100px]">
          <div>
            <p className="text-2xl mb-2">📋</p>
            <p className="font-bold text-sm">Active Orders</p>
          </div>
          <p className="text-xs opacity-90">3 in progress</p>
        </Link>
      </div>

      {/* Revenue Chart - Compact */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-gray-900 text-sm">Revenue (Last 30 Days)</p>
          <Link to="/cp/pro/earnings" className="text-[10px] font-bold text-teal-600">View →</Link>
        </div>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={REVENUE_DATA}>
              <Line type="monotone" dataKey="amount" stroke="#0D9488" strokeWidth={2.5} dot={false} />
              <Tooltip formatter={(v) => [`$${v}`, "Revenue"]} contentStyle={{ borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.1)", fontSize: 10 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Status Summary */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <p className="font-black text-gray-900 text-sm mb-3">Your Status</p>
        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs">Profile Completion</span>
            <div className="flex items-center gap-2">
              <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="w-14 h-full bg-teal-500 rounded-full" />
              </div>
              <span className="font-bold text-gray-900 text-xs">95%</span>
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs">Response Rate</span>
            <span className="font-bold text-green-600 text-xs">100%</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600 text-xs">On-Time Delivery</span>
            <span className="font-bold text-teal-600 text-xs">98%</span>
          </div>
        </div>
      </div>

      {/* New Tasks - Horizontal Scroll */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-gray-900 text-sm">New Tasks 🔥</p>
          <Link to="/kemework/tasks" className="text-xs font-bold text-teal-600">See All</Link>
        </div>
        <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {MOCK_TASKS.map(task => (
            <div key={task.id} className="flex-shrink-0 w-32 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="h-20 bg-gray-100">
                {task.image ? <img src={task.image} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-2xl">🔧</div>}
              </div>
              <div className="p-2.5">
                <p className="text-[11px] font-black text-gray-900 line-clamp-2 mb-1">{task.title}</p>
                <p className="text-[9px] text-gray-400 mb-1.5">{task.category}</p>
                <p className="text-xs font-black mb-2" style={{ color: "#C41230" }}>${task.budgetMin}</p>
                <button className="w-full text-center text-xs font-bold py-1.5 rounded-lg text-white" style={{ background: "#C41230" }}>Bid</button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Orders */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-gray-900 text-sm">Active Orders</p>
          <Link to="/cp/pro/orders" className="text-xs font-bold text-teal-600">View All</Link>
        </div>
        <div className="space-y-2.5">
          {MOCK_ORDERS.map(o => (
            <Link key={o.id} to={`/cp/pro/orders`} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600 flex-shrink-0">{o.client[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-900 truncate">{o.task}</p>
                <p className="text-[10px] text-gray-400">{o.client}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status]}`}>{o.status}</span>
                <p className="text-[9px] text-gray-400">Due {o.deadline}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Bids */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="font-black text-gray-900 text-sm">Recent Bids</p>
          <Link to="/cp/pro/bids" className="text-xs font-bold text-teal-600">View All</Link>
        </div>
        <div className="space-y-2.5">
          {MOCK_BIDS.map(b => (
            <Link key={b.id} to={`/cp/pro/bids`} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-black text-gray-900 truncate">{b.task}</p>
                <p className="text-[10px] text-gray-400">{b.date} · ${b.amount}</p>
              </div>
              <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[b.status]}`}>{b.status}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}