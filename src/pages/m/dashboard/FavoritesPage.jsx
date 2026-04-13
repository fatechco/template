import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SlidersHorizontal, Eye, Share2, X, ChevronDown } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const TABS = ["All", "Properties", "Projects", "Agents"];

const MOCK_PROPERTIES = [
  { id: 1, title: "Modern Apartment in New Cairo", price: "$280,000", city: "New Cairo", district: "5th Settlement", beds: 3, baths: 2, area: 145, purpose: "For Sale", purposeColor: "bg-blue-100 text-blue-700", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=70" },
  { id: 2, title: "Luxury Villa in Sheikh Zayed", price: "$850,000", city: "Sheikh Zayed", district: "Beverly Hills", beds: 5, baths: 4, area: 420, purpose: "For Sale", purposeColor: "bg-blue-100 text-blue-700", image: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=200&q=70" },
  { id: 3, title: "Studio for Rent in Maadi", price: "$600/mo", city: "Maadi", district: "Maadi Degla", beds: 1, baths: 1, area: 55, purpose: "For Rent", purposeColor: "bg-green-100 text-green-700", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=70" },
];

const MOCK_PROJECTS = [
  { id: 1, name: "Lumia New Cairo", developer: "SODIC", units: 1200, delivery: "2027", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=70", price: "From $3.2M" },
  { id: 2, name: "IL Bosco Admin Capital", developer: "Misr Italia", units: 1500, delivery: "2026", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=200&q=70", price: "From $7M" },
];

const MOCK_AGENTS = [
  { id: 1, name: "Ahmed Tarek", category: "Real Estate Agent", rating: 4.8, city: "New Cairo", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70" },
  { id: 2, name: "Sara Mohamed", category: "Agency", rating: 4.9, city: "Dubai", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=70" },
];

const SORT_OPTIONS = ["Newest First", "Oldest First", "Price: Low-High", "Price: High-Low"];

function SortSheet({ onClose, selected, onSelect }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-[480px] mx-auto p-5">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <p className="font-black text-gray-900 mb-3">Sort By</p>
        {SORT_OPTIONS.map(opt => (
          <button key={opt} onClick={() => { onSelect(opt); onClose(); }}
            className={`w-full text-left py-3 px-2 text-sm font-semibold border-b border-gray-100 flex items-center justify-between ${selected === opt ? "text-orange-600" : "text-gray-700"}`}>
            {opt}
            {selected === opt && <span className="text-orange-600 font-black">✓</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

function PropertyCard({ item, onRemove }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex gap-3 p-3">
        <div className="relative flex-shrink-0">
          <img src={item.image} alt={item.title} className="w-24 h-20 rounded-xl object-cover" />
          <span className={`absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full ${item.purposeColor}`}>{item.purpose}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{item.title}</p>
          <p className="text-[15px] font-black text-orange-600 mt-1">{item.price}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">📍 {item.city}, {item.district}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">🛏{item.beds} 🚿{item.baths} 📐{item.area}sqm</p>
        </div>
      </div>
      <div className="flex border-t border-gray-100">
        {[{ icon: <Eye size={13} />, label: "View" }, { icon: <Share2 size={13} />, label: "Share" }, { icon: <X size={13} />, label: "Remove", onClick: onRemove, red: true }].map((btn, i) => (
          <button key={i} onClick={btn.onClick}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-bold ${btn.red ? "text-red-500" : "text-gray-600"} ${i < 2 ? "border-r border-gray-100" : ""}`}>
            {btn.icon} {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function ProjectCard({ item, onRemove }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="flex gap-3 p-3">
        <img src={item.image} alt={item.name} className="w-24 h-20 rounded-xl object-cover flex-shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-bold text-gray-900 line-clamp-2">{item.name}</p>
          <p className="text-[15px] font-black text-orange-600 mt-1">{item.price}</p>
          <p className="text-[11px] text-gray-500 mt-0.5">🏗 {item.developer}</p>
          <p className="text-[11px] text-gray-400 mt-0.5">🏠 {item.units} units · 📅 {item.delivery}</p>
        </div>
      </div>
      <div className="flex border-t border-gray-100">
        {[{ icon: <Eye size={13} />, label: "View" }, { icon: <Share2 size={13} />, label: "Share" }, { icon: <X size={13} />, label: "Remove", onClick: onRemove, red: true }].map((btn, i) => (
          <button key={i} onClick={btn.onClick}
            className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-bold ${btn.red ? "text-red-500" : "text-gray-600"} ${i < 2 ? "border-r border-gray-100" : ""}`}>
            {btn.icon} {btn.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function AgentCard({ item, onRemove }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3">
      <img src={item.avatar} alt={item.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900">{item.name}</p>
        <p className="text-xs text-gray-500">{item.category}</p>
        <p className="text-[11px] text-gray-400">⭐ {item.rating} · 📍 {item.city}</p>
      </div>
      <div className="flex flex-col gap-1.5">
        <button className="text-xs font-bold text-orange-600 border border-orange-600 px-3 py-1.5 rounded-lg">View</button>
        <button onClick={onRemove} className="text-xs font-bold text-red-500 border border-red-200 px-3 py-1.5 rounded-lg">Remove</button>
      </div>
    </div>
  );
}

function EmptyState({ navigate }) {
  return (
    <div className="text-center py-16 px-6">
      <p className="text-5xl mb-3">❤️</p>
      <p className="font-bold text-gray-700 text-base">No saved items yet</p>
      <p className="text-sm text-gray-500 mt-1">Start browsing and save properties you like</p>
      <button onClick={() => navigate("/m/find/property")}
        className="mt-5 bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm">
        Browse Properties
      </button>
    </div>
  );
}

export default function FavoritesPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("Newest First");
  const [showSort, setShowSort] = useState(false);
  const [properties, setProperties] = useState(MOCK_PROPERTIES);
  const [projects, setProjects] = useState(MOCK_PROJECTS);
  const [agents, setAgents] = useState(MOCK_AGENTS);

  const totalCount = properties.length + projects.length + agents.length;

  const showProperties = activeTab === "All" || activeTab === "Properties";
  const showProjects = activeTab === "All" || activeTab === "Projects";
  const showAgents = activeTab === "All" || activeTab === "Agents";

  const isEmpty = (showProperties && properties.length === 0) &&
                  (showProjects && projects.length === 0) &&
                  (showAgents && agents.length === 0);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title="My Favorites" showBack
        rightAction={<button onClick={() => setShowSort(true)}><SlidersHorizontal size={20} className="text-gray-700" /></button>} />

      {/* Filter Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-100">
        <div className="flex overflow-x-auto no-scrollbar px-4">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-4 py-3 text-sm font-bold border-b-2 transition-colors ${
                activeTab === tab ? "border-orange-600 text-orange-600" : "border-transparent text-gray-500"
              }`}>
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-3 space-y-3">
        {/* Search */}
        <div className="flex items-center gap-2 bg-[#F3F4F6] rounded-xl px-3 py-2.5">
          <span className="text-gray-400">🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search saved items..."
            className="flex-1 text-sm bg-transparent outline-none text-gray-800 placeholder-gray-400" />
        </div>

        {/* Sort bar */}
        <div className="flex items-center justify-between">
          <p className="text-[13px] text-gray-500">{totalCount} saved items</p>
          <button onClick={() => setShowSort(true)} className="flex items-center gap-1 text-[13px] font-bold text-gray-700">
            Sort <ChevronDown size={14} />
          </button>
        </div>

        {isEmpty ? <EmptyState navigate={navigate} /> : (
          <>
            {showProperties && properties.map(p => (
              <PropertyCard key={p.id} item={p} onRemove={() => setProperties(prev => prev.filter(x => x.id !== p.id))} />
            ))}
            {showProjects && projects.map(p => (
              <ProjectCard key={p.id} item={p} onRemove={() => setProjects(prev => prev.filter(x => x.id !== p.id))} />
            ))}
            {showAgents && agents.map(a => (
              <AgentCard key={a.id} item={a} onRemove={() => setAgents(prev => prev.filter(x => x.id !== a.id))} />
            ))}
          </>
        )}
      </div>

      {showSort && <SortSheet onClose={() => setShowSort(false)} selected={sort} onSelect={setSort} />}
    </div>
  );
}