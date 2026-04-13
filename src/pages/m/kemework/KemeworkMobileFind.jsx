import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus } from "lucide-react";

const TABS = ["👷 Professionals", "🔧 Services", "📋 Tasks"];

const PROS = [
  { name: "Ahmed Hassan", cat: "Interior Design", city: "Cairo", rating: 4.9, reviews: 127, tasks: 84, from: 50, verified: true, accredited: true, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70", available: true },
  { name: "Sara Mohamed", cat: "Electrical", city: "Dubai", rating: 4.8, reviews: 89, tasks: 62, from: 35, verified: true, accredited: false, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=70", available: true },
  { name: "Omar Khalid", cat: "Plumbing", city: "Riyadh", rating: 4.7, reviews: 203, tasks: 145, from: 25, verified: true, accredited: true, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=70", available: false },
  { name: "Layla Nour", cat: "Landscaping", city: "Amman", rating: 4.9, reviews: 64, tasks: 41, from: 80, verified: true, accredited: false, avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&q=70", available: true },
  { name: "Kareem Saad", cat: "Carpentry", city: "Alexandria", rating: 4.6, reviews: 156, tasks: 112, from: 30, verified: false, accredited: false, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=70", available: true },
];

const SERVICES = [
  { title: "Full Home Interior Design & Furnishing Package", pro: "Ahmed Hassan", rating: 4.9, reviews: 64, from: 500, delivery: 30, category: "Interior Design", image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=300&q=70" },
  { title: "Electrical Wiring & Panel Installation", pro: "Sara Mohamed", rating: 4.8, reviews: 89, from: 80, delivery: 3, category: "Electrical", image: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=70" },
  { title: "Garden Landscaping & Outdoor Lighting", pro: "Layla Nour", rating: 4.9, reviews: 41, from: 200, delivery: 14, category: "Landscaping", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70" },
  { title: "Deep Home Cleaning & Sanitization", pro: "Nadia Ali", rating: 5.0, reviews: 203, from: 40, delivery: 1, category: "Cleaning", image: "https://images.unsplash.com/photo-1527515637462-cff94aca208b?w=300&q=70" },
];

const TASKS = [
  { title: "Full Kitchen Renovation with New Cabinets", category: "Remodeling", budgetMin: 2000, budgetMax: 5000, bids: 7, city: "Cairo", hoursAgo: 2 },
  { title: "Apartment Electrical Rewiring - 3 Bedroom", category: "Electrical", budgetMin: 800, budgetMax: 1500, bids: 12, city: "Dubai", hoursAgo: 5 },
  { title: "Garden Landscaping & Irrigation System", category: "Landscaping", budgetMin: 3000, budgetMax: 8000, bids: 4, city: "Riyadh", hoursAgo: 8 },
  { title: "Bathroom Tiles Installation - 2 Bathrooms", category: "Tiling", budgetMin: 300, budgetMax: 600, bids: 9, city: "Amman", hoursAgo: 12 },
  { title: "Interior Painting - Full Villa 4 Bedrooms", category: "Painting", budgetMin: 1200, budgetMax: 2500, bids: 15, city: "Alexandria", hoursAgo: 24 },
];

function FilterChips({ chips }) {
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
      {chips.map(c => (
        <button key={c} className="flex-shrink-0 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-semibold text-gray-700 whitespace-nowrap shadow-sm active:bg-gray-100">
          {c}
        </button>
      ))}
    </div>
  );
}

function ProCard({ pro, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3 active:bg-gray-50">
      <div className="relative flex-shrink-0">
        <img src={pro.avatar} alt={pro.name} className="w-14 h-14 rounded-full object-cover border-2 border-gray-100" />
        {pro.available && <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="font-black text-gray-900 text-sm truncate">{pro.name}</p>
          {pro.accredited && <span className="text-xs">🏅</span>}
          {pro.verified && <span className="text-xs">✅</span>}
        </div>
        <p className="text-xs text-gray-500">{pro.cat} · 📍 {pro.city}</p>
        <p className="text-[10px] text-gray-400 mt-0.5">⭐ {pro.rating} ({pro.reviews}) · {pro.tasks} tasks</p>
      </div>
      <div className="text-right flex-shrink-0">
        <p className="text-sm font-black" style={{ color: "#C41230" }}>From ${pro.from}</p>
        <p className="text-[10px] text-gray-400">/hr</p>
      </div>
    </div>
  );
}

function ServiceCard({ svc, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex active:opacity-90">
      <div className="w-24 h-24 flex-shrink-0 bg-gray-100">
        <img src={svc.image} alt="" className="w-full h-full object-cover" />
      </div>
      <div className="p-3 flex-1 min-w-0">
        <p className="text-xs font-black text-gray-900 line-clamp-2 mb-1">{svc.title}</p>
        <p className="text-[10px] text-gray-400 mb-0.5">By {svc.pro} · ⭐ {svc.rating}</p>
        <p className="text-[10px] text-gray-400 mb-1.5">📦 {svc.delivery}d delivery</p>
        <p className="text-sm font-black" style={{ color: "#C41230" }}>From ${svc.from}</p>
      </div>
    </div>
  );
}

function TaskCard({ task, onClick }) {
  return (
    <div onClick={onClick} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 active:bg-gray-50">
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-sm font-black text-gray-900 flex-1 line-clamp-2">{task.title}</p>
        <div className="text-right flex-shrink-0">
          <p className="text-sm font-black" style={{ color: "#C41230" }}>${task.budgetMin.toLocaleString()}</p>
          <p className="text-[10px] text-gray-400">–${task.budgetMax.toLocaleString()}</p>
        </div>
      </div>
      <div className="flex items-center gap-3 text-[10px] text-gray-400">
        <span className="bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">{task.category}</span>
        <span>📍 {task.city}</span>
        <span>⏰ {task.hoursAgo}h ago</span>
        <span>📬 {task.bids} bids</span>
      </div>
    </div>
  );
}

export default function KemeworkMobileFind() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [search, setSearch] = useState("");

  const PRO_FILTERS = ["Category ▼", "📍 Location ▼", "⭐ Rating ▼", "🏅 Accredited", "✅ Verified"];
  const SVC_FILTERS = ["Category ▼", "💰 Price ▼", "⏰ Delivery ▼", "📍 Location ▼"];
  const TASK_FILTERS = ["Category ▼", "💰 Budget ▼", "📍 Location ▼", "📅 Posted ▼"];

  const filters = [PRO_FILTERS, SVC_FILTERS, TASK_FILTERS][tab];

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      {/* Search */}
      <div className="sticky top-0 z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 mb-2">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search professionals, services or tasks..."
            className="flex-1 text-sm outline-none bg-transparent placeholder-gray-400" />
        </div>
        {/* Tabs */}
        <div className="flex gap-2">
          {TABS.map((t, i) => (
            <button key={t} onClick={() => setTab(i)}
              className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-colors"
              style={{ background: tab === i ? "#C41230" : "#f3f4f6", color: tab === i ? "#fff" : "#374151" }}>
              {t}
            </button>
          ))}
        </div>
        <FilterChips chips={filters} />
      </div>

      <div className="px-4 py-3 flex flex-col gap-2">
        {tab === 0 && PROS.filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase())).map(pro => (
          <ProCard key={pro.name} pro={pro} onClick={() => navigate(`/m/kemework/freelancer/${pro.name.toLowerCase().replace(" ", ".")}`)} />
        ))}
        {tab === 1 && SERVICES.filter(s => !search || s.title.toLowerCase().includes(search.toLowerCase())).map(svc => (
          <ServiceCard key={svc.title} svc={svc} onClick={() => navigate(`/m/kemework/service/1`)} />
        ))}
        {tab === 2 && TASKS.filter(t => !search || t.title.toLowerCase().includes(search.toLowerCase())).map(task => (
          <TaskCard key={task.title} task={task} onClick={() => navigate(`/m/kemework/task/1`)} />
        ))}
      </div>

      {/* FAB for tasks tab */}
      {tab === 2 && (
        <button onClick={() => navigate("/m/kemework/post-task")}
          className="fixed bottom-24 right-5 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-30"
          style={{ background: "#C41230" }}>
          <Plus size={24} className="text-white" />
        </button>
      )}
    </div>
  );
}