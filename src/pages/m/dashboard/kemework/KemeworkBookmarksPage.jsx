import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2 } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const TABS = ["All", "Tasks", "Services", "Professionals"];

const MOCK_TASKS = [
  { id: 1, title: "Full Kitchen Renovation & Cabinet Installation", category: "Interior", budgetMin: 2000, budgetMax: 5000, city: "New Cairo", bids: 7, hoursAgo: 2 },
  { id: 2, title: "Apartment Electrical Rewiring - 3 Bedrooms", category: "Electrical", budgetMin: 800, budgetMax: 1500, city: "Dubai", bids: 12, hoursAgo: 5 },
];

const MOCK_SERVICES = [
  { id: 1, title: "Full Home Interior Design & Furnishing Package", pro: "Ahmed Hassan", rating: 4.9, reviews: 64, from: 500, image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=200&q=70" },
  { id: 2, title: "Garden Landscaping & Outdoor Lighting", pro: "Layla Nour", rating: 4.9, reviews: 41, from: 200, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=70" },
];

const MOCK_PROS = [
  { id: 1, name: "Ahmed Hassan", category: "Interior Design", rating: 4.9, reviews: 127, city: "Cairo", available: true, avatar: "AH" },
  { id: 2, name: "Sara Mohamed", category: "Electrical", rating: 4.8, reviews: 89, city: "Dubai", available: true, avatar: "SM" },
  { id: 3, name: "Omar Khalid", category: "Plumbing", rating: 4.7, reviews: 203, city: "Riyadh", available: false, avatar: "OK" },
];

function EmptyState({ navigate }) {
  return (
    <div className="text-center py-20 px-6">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
        <span className="text-3xl">🔖</span>
      </div>
      <p className="font-bold text-gray-700 text-base mb-1">Nothing bookmarked yet</p>
      <p className="text-sm text-gray-500">Save tasks, services and professionals for quick access later</p>
      <button onClick={() => navigate("/m/kemework/find")}
        className="mt-5 text-white font-bold px-6 py-3 rounded-xl text-sm" style={{ background: "#C41230" }}>
        Browse Tasks
      </button>
    </div>
  );
}

function TaskCard({ task, onRemove }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <div className="flex gap-2 flex-wrap mb-2">
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#C41230" }}>{task.category}</span>
        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
          ${task.budgetMin.toLocaleString()} – ${task.budgetMax.toLocaleString()}
        </span>
      </div>
      <p className="text-[14px] font-bold text-gray-900 line-clamp-2 mb-2">{task.title}</p>
      <p className="text-[11px] text-gray-400 mb-3">📍 {task.city} · ⏰ {task.hoursAgo}h ago · 📬 {task.bids} bids</p>
      <div className="flex gap-2 border-t border-gray-100 pt-3">
        <button onClick={() => navigate(`/m/kemework/task/${task.id}`)}
          className="flex-1 text-xs font-bold text-gray-700 border border-gray-200 py-2 rounded-lg">👁 View Task</button>
        <button className="flex-1 text-xs font-bold py-2 rounded-lg text-white" style={{ background: "#C41230" }}>📬 Bid Now</button>
        <button onClick={onRemove} className="px-3 text-xs font-bold text-red-500 border border-red-200 py-2 rounded-lg">❌</button>
      </div>
    </div>
  );
}

function ServiceCard({ svc, onRemove }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex">
      <img src={svc.image} alt={svc.title} className="w-24 h-24 object-cover flex-shrink-0" />
      <div className="p-3 flex-1 min-w-0">
        <p className="text-xs font-black text-gray-900 line-clamp-2 mb-1">{svc.title}</p>
        <p className="text-[10px] text-gray-400">By {svc.pro} · ⭐ {svc.rating} ({svc.reviews})</p>
        <p className="text-sm font-black mt-1 mb-2" style={{ color: "#C41230" }}>From ${svc.from}</p>
        <div className="flex gap-1.5">
          <button className="flex-1 text-[10px] font-bold border border-gray-200 py-1.5 rounded-lg text-gray-600">👁 View</button>
          <button className="flex-1 text-[10px] font-bold py-1.5 rounded-lg text-white" style={{ background: "#C41230" }}>🛒 Order</button>
          <button onClick={onRemove} className="px-2 text-[10px] font-bold text-red-500 border border-red-200 py-1.5 rounded-lg">❌</button>
        </div>
      </div>
    </div>
  );
}

function ProCard({ pro, onRemove }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex items-center gap-3">
      <div className="relative flex-shrink-0">
        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-sm font-black text-orange-600">
          {pro.avatar}
        </div>
        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${pro.available ? "bg-green-500" : "bg-red-400"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm text-gray-900">{pro.name}</p>
        <p className="text-xs text-gray-500">{pro.category}</p>
        <p className="text-[11px] text-gray-400">⭐ {pro.rating} ({pro.reviews}) · 📍 {pro.city}</p>
      </div>
      <div className="flex flex-col gap-1.5 flex-shrink-0">
        <button onClick={() => navigate(`/m/kemework/freelancer/${pro.name.toLowerCase().replace(" ", ".")}`)}
          className="text-[10px] font-bold border border-gray-200 px-2.5 py-1.5 rounded-lg text-gray-600">👤 Profile</button>
        <button className="text-[10px] font-bold border border-gray-200 px-2.5 py-1.5 rounded-lg text-gray-600">💬 Message</button>
        <button onClick={onRemove} className="text-[10px] font-bold border border-red-200 px-2.5 py-1.5 rounded-lg text-red-500">❌ Remove</button>
      </div>
    </div>
  );
}

export default function KemeworkBookmarksPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [tasks, setTasks] = useState(MOCK_TASKS);
  const [services, setServices] = useState(MOCK_SERVICES);
  const [pros, setPros] = useState(MOCK_PROS);

  const totalCount = tasks.length + services.length + pros.length;
  const isEmpty = totalCount === 0;

  const showTasks = activeTab === "All" || activeTab === "Tasks";
  const showServices = activeTab === "All" || activeTab === "Services";
  const showPros = activeTab === "All" || activeTab === "Professionals";

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title="Bookmarks" showBack
        rightAction={
          totalCount > 0 && (
            <button onClick={() => { setTasks([]); setServices([]); setPros([]); }}
              className="p-1">
              <Trash2 size={18} className="text-red-500" />
            </button>
          )
        } />

      {/* Filter Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto no-scrollbar px-4">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab ? "text-orange-600 border-orange-600" : "text-gray-500 border-transparent"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <EmptyState navigate={navigate} />
      ) : (
        <div className="px-4 py-3 space-y-3">
          {/* Search */}
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search size={15} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search saved items..."
              className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400" />
          </div>

          <p className="text-[13px] text-gray-500">{totalCount} saved items</p>

          {showTasks && tasks.map(t => (
            <TaskCard key={t.id} task={t} onRemove={() => setTasks(prev => prev.filter(x => x.id !== t.id))} />
          ))}
          {showServices && services.map(s => (
            <ServiceCard key={s.id} svc={s} onRemove={() => setServices(prev => prev.filter(x => x.id !== s.id))} />
          ))}
          {showPros && pros.map(p => (
            <ProCard key={p.id} pro={p} onRemove={() => setPros(prev => prev.filter(x => x.id !== p.id))} />
          ))}
        </div>
      )}
    </div>
  );
}