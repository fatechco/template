import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Settings, Plus, Bookmark, BookmarkCheck } from "lucide-react";
import { KEMEWORK_CATEGORIES } from "@/lib/kemeworkCategories";
import LocationAutocomplete from "@/components/kemework/LocationAutocomplete";

const MOCK_TASKS = [
  { id: 1, title: "Full Kitchen Renovation & Cabinet Installation", description: "Complete kitchen renovation including demolition, new cabinets, granite countertop and backsplash tiling.", category: "Interior", budgetMin: 2000, budgetMax: 5000, skills: ["Carpentry", "Tiling", "Plumbing"], city: "New Cairo", hoursAgo: 2, bids: 7, views: 45, client: { initials: "AH", rating: 4.7 } },
  { id: 2, title: "Apartment Electrical Rewiring - 3 Bedrooms", description: "Complete rewiring of 3-bedroom apartment including panel upgrade and new outlets throughout.", category: "Electrical", budgetMin: 800, budgetMax: 1500, skills: ["Electrical Wiring", "Panel Installation"], city: "Dubai", hoursAgo: 5, bids: 12, views: 88, client: { initials: "SM", rating: 4.5 } },
  { id: 3, title: "Garden Landscaping & Drip Irrigation System", description: "Design and install a complete landscaping layout with drip irrigation for a 400 sqm garden.", category: "Landscaping", budgetMin: 3000, budgetMax: 8000, skills: ["Landscaping", "Irrigation", "Planting"], city: "Riyadh", hoursAgo: 8, bids: 4, views: 33, client: { initials: "OK", rating: 4.9 } },
  { id: 4, title: "Bathroom Tiles Installation - 2 Bathrooms", description: "Remove old tiles and install new porcelain tiles in 2 bathrooms. Supply of tiles by client.", category: "Plumbing", budgetMin: 300, budgetMax: 600, skills: ["Tiling", "Waterproofing"], city: "Amman", hoursAgo: 12, bids: 9, views: 67, client: { initials: "LN", rating: 4.3 } },
  { id: 5, title: "AC Installation & Maintenance - 4 Split Units", description: "Install 4 split AC units, including copper pipe work, electrical connections and commissioning.", category: "AC", budgetMin: 400, budgetMax: 900, skills: ["AC Installation", "Electrical"], city: "Cairo", hoursAgo: 24, bids: 15, views: 102, client: { initials: "KS", rating: 4.6 } },
  { id: 6, title: "Interior Painting - Villa 5 Bedrooms", description: "Paint all interior walls and ceilings of 5-bedroom villa. Client to supply paint materials.", category: "Painting", budgetMin: 1200, budgetMax: 2500, skills: ["Painting", "Plastering"], city: "Alexandria", hoursAgo: 36, bids: 11, views: 79, client: { initials: "NA", rating: 4.8 } },
];

const SORT_OPTIONS = ["Newest", "Budget ↑", "Budget ↓", "Most Bids"];

function FilterSheet({ onClose, filters, setFilters }) {
  const [local, setLocal] = useState(filters);
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-[480px] mx-auto" style={{ maxHeight: "85vh" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-3" />
        <div className="flex items-center justify-between px-5 mb-4">
          <p className="font-black text-gray-900 text-base">All Filters</p>
          <button onClick={() => setLocal({ category: "All", location: "", posted: "any", biddableOnly: false })} className="text-xs text-red-500 font-bold">Reset</button>
        </div>
        <div className="overflow-y-auto px-5 pb-6 space-y-5" style={{ maxHeight: "65vh" }}>
          <div>
            <p className="text-xs font-black text-gray-700 uppercase tracking-wide mb-2">Category</p>
            <div className="flex flex-wrap gap-2">
              <button onClick={() => setLocal(l => ({ ...l, category: "All" }))}
                className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${local.category === "All" ? "border-red-600 bg-red-50 text-red-700" : "border-gray-200 text-gray-600"}`}>
                All
              </button>
              {KEMEWORK_CATEGORIES.map(c => (
                <button key={c.label} onClick={() => setLocal(l => ({ ...l, category: c.label }))}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${local.category === c.label ? "border-red-600 bg-red-50 text-red-700" : "border-gray-200 text-gray-600"}`}>
                  {c.icon} {c.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-xs font-black text-gray-700 uppercase tracking-wide mb-2">Location</p>
            <LocationAutocomplete value={local.location || ""} onChange={v => setLocal(l => ({ ...l, location: v }))} placeholder="Search city or area..." />
          </div>
          <div>
            <p className="text-xs font-black text-gray-700 uppercase tracking-wide mb-2">Posted</p>
            <div className="flex gap-2">
              {[["any", "All Time"], ["today", "Today"], ["week", "This Week"], ["month", "This Month"]].map(([v, l]) => (
                <button key={v} onClick={() => setLocal(f => ({ ...f, posted: v }))}
                  className={`flex-1 py-2 rounded-xl text-xs font-bold border ${local.posted === v ? "border-red-600 bg-red-50 text-red-700" : "border-gray-200 text-gray-600"}`}>
                  {l}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-black text-gray-700">Biddable Only</p>
              <p className="text-xs text-gray-400">Show tasks open for bids</p>
            </div>
            <button onClick={() => setLocal(l => ({ ...l, biddableOnly: !l.biddableOnly }))}
              className={`w-12 h-6 rounded-full transition-colors relative ${local.biddableOnly ? "bg-red-600" : "bg-gray-200"}`}>
              <div className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${local.biddableOnly ? "translate-x-6" : "translate-x-0.5"}`} />
            </button>
          </div>
        </div>
        <div className="px-5 py-4 border-t border-gray-100">
          <button onClick={() => { setFilters(local); onClose(); }}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-sm" style={{ background: "#C41230" }}>
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}

function SortSheet({ onClose, sort, setSort }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-[480px] mx-auto p-5">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <p className="font-black text-gray-900 mb-3">Sort By</p>
        {SORT_OPTIONS.map(opt => (
          <button key={opt} onClick={() => { setSort(opt); onClose(); }}
            className={`w-full text-left py-3 px-2 text-sm font-semibold border-b border-gray-100 flex justify-between ${sort === opt ? "text-red-600" : "text-gray-700"}`}>
            {opt} {sort === opt && <span className="font-black text-red-600">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, bookmarked, onToggleBookmark }) {
  const navigate = useNavigate();
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        {/* Top row */}
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex gap-2 flex-wrap flex-1">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#C41230" }}>{task.category}</span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-700">
              {task.budgetMin > 0 ? `$${task.budgetMin.toLocaleString()} – $${task.budgetMax.toLocaleString()}` : "Open to offers"}
            </span>
          </div>
          <button onClick={() => onToggleBookmark(task.id)} className="flex-shrink-0 p-1">
            {bookmarked ? <BookmarkCheck size={18} style={{ color: "#C41230" }} /> : <Bookmark size={18} className="text-gray-400" />}
          </button>
        </div>

        {/* Content */}
        <p className="text-[15px] font-black text-gray-900 line-clamp-2 mb-1">{task.title}</p>
        <p className="text-[13px] text-gray-500 line-clamp-3 mb-3">{task.description}</p>

        {/* Skills */}
        <div className="flex gap-1.5 overflow-x-auto no-scrollbar mb-3">
          {task.skills.slice(0, 3).map(s => (
            <span key={s} className="flex-shrink-0 text-[10px] font-semibold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">{s}</span>
          ))}
          {task.skills.length > 3 && (
            <span className="flex-shrink-0 text-[10px] font-semibold bg-gray-100 text-gray-500 px-2 py-1 rounded-full">+{task.skills.length - 3}</span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-gray-400">
          <span>📍 {task.city}</span>
          <span>⏰ {task.hoursAgo}h ago</span>
          <span>📬 {task.bids} bids</span>
          <span>👁 {task.views} views</span>
        </div>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-[10px] font-bold text-gray-600">{task.client.initials}</div>
          <span className="text-[11px] text-gray-500">⭐ {task.client.rating}</span>
        </div>
        <button onClick={() => navigate(`/m/kemework/task/${task.id}`)}
          className="text-[11px] font-bold border border-red-600 text-red-600 px-3 py-1.5 rounded-lg">
          👁 View Task
        </button>
      </div>
    </div>
  );
}

export default function KemeworkBrowseTasksMobile() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [showFilter, setShowFilter] = useState(false);
  const [showSort, setShowSort] = useState(false);
  const [sort, setSort] = useState("Newest");
  const [bookmarks, setBookmarks] = useState([]);
  const [filters, setFilters] = useState({ category: "All", posted: "any", biddableOnly: false });

  const toggleBookmark = (id) => setBookmarks(prev => prev.includes(id) ? prev.filter(b => b !== id) : [...prev, id]);

  const filtered = MOCK_TASKS.filter(t => {
    const cat = activeCategory === "All" || t.category === activeCategory;
    const q = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.city.toLowerCase().includes(search.toLowerCase());
    const loc = !filters.location || t.city.toLowerCase().includes(filters.location.toLowerCase());
    return cat && q && loc;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-100">
        <div className="flex items-center gap-3 px-4 py-3" style={{ height: 56 }}>
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <span className="text-gray-900 text-xl">←</span>
          </button>
          <span className="flex-1 font-bold text-gray-900 text-base">Browse Tasks</span>
          <button onClick={() => setShowFilter(true)} className="p-1">
            <Settings size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Search */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2.5">
            <Search size={15} className="text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search tasks by title, skill, location..."
              className="flex-1 text-sm bg-transparent outline-none placeholder-gray-400" />
          </div>
        </div>

        {/* Category chips */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 px-4 pb-3">
          <button onClick={() => setActiveCategory("All")}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
            style={activeCategory === "All" ? { background: "#C41230", color: "#fff" } : { background: "#F3F4F6", color: "#374151" }}>
            All
          </button>
          {KEMEWORK_CATEGORIES.map(c => (
            <button key={c.label} onClick={() => setActiveCategory(c.label)}
              className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
              style={activeCategory === c.label ? { background: "#C41230", color: "#fff" } : { background: "#F3F4F6", color: "#374151" }}>
              {c.icon} {c.label}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Count + Sort */}
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-gray-500">{filtered.length} tasks found</p>
          <button onClick={() => setShowSort(true)} className="text-[13px] font-bold text-gray-700">Sort ▼</button>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-4xl mb-3">📋</p>
            <p className="font-bold text-gray-700">No tasks found</p>
          </div>
        ) : (
          filtered.map(task => (
            <TaskCard key={task.id} task={task}
              bookmarked={bookmarks.includes(task.id)}
              onToggleBookmark={toggleBookmark} />
          ))
        )}
      </div>

      {/* FAB */}
      <button onClick={() => navigate("/m/kemework/post-task")}
        className="fixed bottom-24 right-4 w-14 h-14 rounded-full shadow-lg flex items-center justify-center z-30"
        style={{ background: "#C41230" }}>
        <Plus size={24} className="text-white" />
      </button>

      {showFilter && <FilterSheet onClose={() => setShowFilter(false)} filters={filters} setFilters={setFilters} />}
      {showSort && <SortSheet onClose={() => setShowSort(false)} sort={sort} setSort={setSort} />}
    </div>
  );
}