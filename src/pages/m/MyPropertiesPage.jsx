import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Search, Eye, MapPin, MoreVertical, Edit2, Share2, Trash2, Copy, Zap } from "lucide-react";

const MOCK_PROPERTIES = [
  { id: 1, title: "Luxury Apartment in New Cairo", price: "$500,000", city: "Cairo", type: "Apartment", purpose: "Sale", views: 245, status: "active",  image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=300&q=80" },
  { id: 2, title: "Villa in 5th Settlement",       price: "$750,000", city: "Cairo", type: "Villa",     purpose: "Sale", views: 189, status: "active",  image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=80" },
  { id: 3, title: "Studio in Downtown",            price: "$150,000", city: "Cairo", type: "Studio",    purpose: "Rent", views: 87,  status: "pending", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&q=80" },
  { id: 4, title: "Office Space in Giza",          price: "$200,000", city: "Giza",  type: "Office",    purpose: "Sale", views: 45,  status: "draft",   image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80" },
];

const STATUS_CONFIG = {
  active:  { label: "Active",  bg: "bg-green-100",  text: "text-green-700",  dot: "bg-green-500" },
  pending: { label: "Pending", bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  draft:   { label: "Draft",   bg: "bg-gray-100",   text: "text-gray-600",   dot: "bg-gray-400" },
  expired: { label: "Expired", bg: "bg-red-100",    text: "text-red-600",    dot: "bg-red-500" },
};

const FILTERS = ["all", "active", "pending", "draft", "expired"];

const ACTIONS = [
  { icon: Edit2,  label: "Edit",      color: "text-gray-700" },
  { icon: Eye,    label: "View",      color: "text-blue-600" },
  { icon: Share2, label: "Share",     color: "text-teal-600" },
  { icon: Zap,    label: "Boost",     color: "text-orange-600" },
  { icon: Copy,   label: "Duplicate", color: "text-purple-600" },
  { icon: Trash2, label: "Delete",    color: "text-red-500" },
];

export default function MyPropertiesPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const filtered = MOCK_PROPERTIES.filter(p => {
    const matchFilter = activeFilter === "all" || p.status === activeFilter;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.city.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const paginatedItems = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const counts = FILTERS.reduce((acc, f) => {
    acc[f] = f === "all" ? MOCK_PROPERTIES.length : MOCK_PROPERTIES.filter(p => p.status === f).length;
    return acc;
  }, {});

  // Reset to page 1 when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeFilter, search]);

  return (
    <div className="min-h-full bg-[#F3F4F6]" onClick={() => setOpenMenu(null)}>

      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-100 px-4 flex items-center justify-between" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors">
          <ChevronLeft size={22} className="text-gray-800" />
        </button>
        <h1 className="text-base font-black text-gray-900">My Properties</h1>
        <button
          onClick={() => navigate("/m/add/property")}
          className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-sm active:opacity-80 transition-opacity"
        >
          <Plus size={18} color="white" strokeWidth={2.5} />
        </button>
      </div>

      {/* Search */}
      <div className="bg-white px-4 pt-3 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3" style={{ height: 42 }}>
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search your listings..."
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
        </div>
      </div>

      {/* Filter Pills */}
      <div className="bg-white border-b border-gray-100 px-4 pb-3 pt-2 flex gap-2 overflow-x-auto no-scrollbar">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
              activeFilter === f
                ? "bg-orange-500 text-white shadow-sm"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            <span className="capitalize">{f}</span>
            {counts[f] > 0 && (
              <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${
                activeFilter === f ? "bg-white/25 text-white" : "bg-gray-200 text-gray-600"
              }`}>
                {counts[f]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-4 pt-4 pb-28 space-y-3">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">🏠</span>
            <p className="font-black text-gray-700 text-base">No properties found</p>
            <p className="text-sm text-gray-400 mt-1">Try a different filter or add a new listing</p>
            <button
              onClick={() => navigate("/m/add/property")}
              className="mt-4 px-6 py-2.5 bg-orange-500 text-white text-sm font-bold rounded-xl"
            >
              + Add Property
            </button>
          </div>
        ) : (
          paginatedItems.map(prop => {
            const status = STATUS_CONFIG[prop.status] || STATUS_CONFIG.active;
            return (
              <div
                key={prop.id}
                className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 relative"
                onClick={e => e.stopPropagation()}
              >
                {/* Image */}
                <div className="relative w-full h-40 bg-gray-200 overflow-hidden">
                  <img
                    src={prop.image}
                    alt={prop.title}
                    className="w-full h-full object-cover"
                  />
                  {/* Status badge over image */}
                  <div className={`absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full ${status.bg}`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${status.dot}`} />
                    <span className={`text-[11px] font-black ${status.text}`}>{status.label}</span>
                  </div>
                  {/* Purpose badge */}
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2.5 py-1 rounded-full">
                    <span className="text-[11px] font-bold text-white">{prop.purpose}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="px-4 pt-3 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-gray-900 text-sm leading-snug line-clamp-2">{prop.title}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1">
                          <MapPin size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{prop.city}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye size={12} className="text-gray-400" />
                          <span className="text-xs text-gray-500">{prop.views} views</span>
                        </div>
                      </div>
                      <p className="font-black text-orange-500 text-base mt-2">{prop.price}</p>
                    </div>

                    {/* 3-dot menu */}
                    <div className="relative">
                      <button
                        onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === prop.id ? null : prop.id); }}
                        className="w-8 h-8 flex items-center justify-center rounded-xl hover:bg-gray-100 transition-colors"
                      >
                        <MoreVertical size={18} className="text-gray-500" />
                      </button>
                      {openMenu === prop.id && (
                        <div className="absolute right-0 top-9 bg-white rounded-2xl shadow-xl border border-gray-100 z-50 w-44 overflow-hidden">
                          {ACTIONS.map((action, i) => {
                            const Icon = action.icon;
                            return (
                              <button
                                key={i}
                                onClick={() => setOpenMenu(null)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                              >
                                <Icon size={15} className={action.color} />
                                <span className={action.color}>{action.label}</span>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Type tag */}
                  <div className="mt-2">
                    <span className="text-[11px] font-bold bg-orange-50 text-orange-600 px-2.5 py-1 rounded-full">{prop.type}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && totalPages > 1 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex items-center justify-between">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            ← Previous
          </button>
          <span className="text-xs font-bold text-gray-600">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-2 rounded-lg bg-gray-100 text-gray-600 text-sm font-bold disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-200 transition-colors"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}