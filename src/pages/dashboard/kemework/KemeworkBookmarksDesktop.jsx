import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2, Bookmark, ExternalLink, MessageCircle, User } from "lucide-react";

const TABS = ["All", "Tasks", "Services", "Professionals"];

const MOCK_TASKS = [
  { id: 1, title: "Full Kitchen Renovation & Cabinet Installation", category: "Interior", budgetMin: 2000, budgetMax: 5000, city: "New Cairo", bids: 7, hoursAgo: 2 },
  { id: 2, title: "Apartment Electrical Rewiring - 3 Bedrooms", category: "Electrical", budgetMin: 800, budgetMax: 1500, city: "Dubai", bids: 12, hoursAgo: 5 },
];

const MOCK_SERVICES = [
  { id: 1, title: "Full Home Interior Design & Furnishing Package", pro: "Ahmed Hassan", rating: 4.9, reviews: 64, from: 500, image: "https://images.unsplash.com/photo-1618219908412-a29a1bb7b86e?w=300&q=70" },
  { id: 2, title: "Garden Landscaping & Outdoor Lighting", pro: "Layla Nour", rating: 4.9, reviews: 41, from: 200, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&q=70" },
];

const MOCK_PROS = [
  { id: 1, name: "Ahmed Hassan", category: "Interior Design", rating: 4.9, reviews: 127, city: "Cairo", available: true, avatar: "AH" },
  { id: 2, name: "Sara Mohamed", category: "Electrical", rating: 4.8, reviews: 89, city: "Dubai", available: true, avatar: "SM" },
  { id: 3, name: "Omar Khalid", category: "Plumbing", rating: 4.7, reviews: 203, city: "Riyadh", available: false, avatar: "OK" },
];

function TaskCard({ task, onRemove }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex gap-2 flex-wrap">
          <span className="text-xs font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#C41230" }}>{task.category}</span>
          <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
            ${task.budgetMin.toLocaleString()} – ${task.budgetMax.toLocaleString()}
          </span>
        </div>
        <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors p-1">
          <Trash2 size={16} />
        </button>
      </div>
      <p className="font-bold text-gray-900 mb-2 line-clamp-2">{task.title}</p>
      <p className="text-xs text-gray-400 mb-4">📍 {task.city} · ⏰ {task.hoursAgo}h ago · 📬 {task.bids} bids</p>
      <div className="flex gap-2 pt-3 border-t border-gray-100">
        <button onClick={() => navigate(`/kemework/task/${task.id}`)}
          className="flex-1 text-sm font-bold text-gray-700 border border-gray-200 py-2 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1.5">
          <ExternalLink size={14} /> View Task
        </button>
        <button className="flex-1 text-sm font-bold py-2 rounded-lg text-white hover:opacity-90 transition-opacity" style={{ background: "#C41230" }}>
          📬 Bid Now
        </button>
      </div>
    </div>
  );
}

function ServiceCard({ svc, onRemove }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img src={svc.image} alt={svc.title} className="w-full h-40 object-cover" />
        <button onClick={onRemove} className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow text-gray-400 hover:text-red-500 transition-colors">
          <Trash2 size={14} />
        </button>
      </div>
      <div className="p-4">
        <p className="font-bold text-gray-900 line-clamp-2 mb-1">{svc.title}</p>
        <p className="text-xs text-gray-500 mb-1">By {svc.pro}</p>
        <p className="text-xs text-gray-400 mb-2">⭐ {svc.rating} ({svc.reviews} reviews)</p>
        <p className="text-base font-black mb-3" style={{ color: "#C41230" }}>From ${svc.from}</p>
        <div className="flex gap-2">
          <button className="flex-1 text-sm font-bold border border-gray-200 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5">
            <ExternalLink size={14} /> View
          </button>
          <button className="flex-1 text-sm font-bold py-2 rounded-lg text-white hover:opacity-90" style={{ background: "#C41230" }}>
            🛒 Order
          </button>
        </div>
      </div>
    </div>
  );
}

function ProCard({ pro, onRemove }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-4">
        <div className="relative flex-shrink-0">
          <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-base font-black text-orange-600">
            {pro.avatar}
          </div>
          <div className={`absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white ${pro.available ? "bg-green-500" : "bg-red-400"}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-gray-900">{pro.name}</p>
              <p className="text-sm text-gray-500">{pro.category}</p>
              <p className="text-xs text-gray-400 mt-0.5">⭐ {pro.rating} ({pro.reviews} reviews) · 📍 {pro.city}</p>
            </div>
            <button onClick={onRemove} className="text-gray-400 hover:text-red-500 transition-colors p-1">
              <Trash2 size={16} />
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <button onClick={() => navigate(`/kemework/freelancer/${pro.name.toLowerCase().replace(" ", ".")}`)}
              className="flex-1 text-sm font-bold border border-gray-200 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5">
              <User size={14} /> Profile
            </button>
            <button className="flex-1 text-sm font-bold border border-gray-200 py-2 rounded-lg text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-1.5">
              <MessageCircle size={14} /> Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KemeworkBookmarksDesktop() {
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

  const filteredTasks = tasks.filter(t => t.title.toLowerCase().includes(search.toLowerCase()));
  const filteredServices = services.filter(s => s.title.toLowerCase().includes(search.toLowerCase()));
  const filteredPros = pros.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center">
            <Bookmark size={20} className="text-orange-600" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-gray-900">My Bookmarks</h1>
            <p className="text-sm text-gray-500">{totalCount} saved items</p>
          </div>
        </div>
        {totalCount > 0 && (
          <button
            onClick={() => { setTasks([]); setServices([]); setPros([]); }}
            className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
          >
            <Trash2 size={16} /> Clear All
          </button>
        )}
      </div>

      {/* Search + Tabs */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search saved items..."
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <div className="flex gap-1">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                activeTab === tab
                  ? "bg-orange-600 text-white"
                  : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {isEmpty ? (
        <div className="text-center py-24">
          <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">🔖</span>
          </div>
          <p className="font-bold text-gray-700 text-lg mb-2">Nothing bookmarked yet</p>
          <p className="text-gray-500 mb-6">Save tasks, services and professionals for quick access later</p>
          <button
            onClick={() => navigate("/kemework/tasks")}
            className="text-white font-bold px-8 py-3 rounded-xl" style={{ background: "#C41230" }}>
            Browse Tasks
          </button>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Tasks Section */}
          {showTasks && filteredTasks.length > 0 && (
            <div>
              <h2 className="text-base font-black text-gray-700 mb-3">📋 Tasks ({filteredTasks.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTasks.map(t => (
                  <TaskCard key={t.id} task={t} onRemove={() => setTasks(prev => prev.filter(x => x.id !== t.id))} />
                ))}
              </div>
            </div>
          )}

          {/* Services Section */}
          {showServices && filteredServices.length > 0 && (
            <div>
              <h2 className="text-base font-black text-gray-700 mb-3">🛠 Services ({filteredServices.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredServices.map(s => (
                  <ServiceCard key={s.id} svc={s} onRemove={() => setServices(prev => prev.filter(x => x.id !== s.id))} />
                ))}
              </div>
            </div>
          )}

          {/* Professionals Section */}
          {showPros && filteredPros.length > 0 && (
            <div>
              <h2 className="text-base font-black text-gray-700 mb-3">👤 Professionals ({filteredPros.length})</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredPros.map(p => (
                  <ProCard key={p.id} pro={p} onRemove={() => setPros(prev => prev.filter(x => x.id !== p.id))} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}