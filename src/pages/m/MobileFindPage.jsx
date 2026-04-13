import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Mic, X, Clock } from "lucide-react";
import { useModule } from "@/lib/ModuleContext";

const KEMEDAR_CATEGORIES = [
  { emoji: "🏠", label: "Property",        subtitle: "Buy, rent or invest",     path: "/m/find/property",        bg: "from-[#FF6B00] to-[#FF9500]" },
  { emoji: "🏗",  label: "Project",         subtitle: "New developments",        path: "/m/find/project",         bg: "from-[#1a1a2e] to-[#16213e]" },
  { emoji: "👤", label: "Agent",           subtitle: "Find professionals",      path: "/m/find/agent",           bg: "from-[#0D9488] to-[#0F766E]" },
  { emoji: "🏢", label: "Agency",          subtitle: "Real estate agencies",    path: "/m/find/agency",          bg: "from-[#0369A1] to-[#0284C7]" },
  { emoji: "🏗",  label: "Developer",       subtitle: "Real estate developers",  path: "/m/find/developer",       bg: "from-[#7C3AED] to-[#6D28D9]" },
  { emoji: "🗺",  label: "Franchise Owner", subtitle: "Local Kemedar rep",       path: "/m/find/franchise-owner", bg: "from-[#16A34A] to-[#15803D]" },
  { emoji: "📦", label: "Product",         subtitle: "Building materials",      path: "/m/find/product",         bg: "from-[#2563EB] to-[#1D4ED8]" },
  { emoji: "🔧", label: "Services",        subtitle: "Home services",           path: "/m/find/service",         bg: "from-[#0F766E] to-[#115E59]" },
  { emoji: "👷", label: "Professional",    subtitle: "Handymen & experts",      path: "/m/find/professional",    bg: "from-[#92400E] to-[#78350F]" },
];

const KEMEWORK_CATEGORIES = [
  { emoji: "🔧", label: "Handyman",      subtitle: "Fix & repair",        path: "/m/find/professional", bg: "from-[#065F46] to-[#047857]" },
  { emoji: "⚡", label: "Electrician",   subtitle: "Wiring & installs",   path: "/m/find/professional", bg: "from-[#D97706] to-[#B45309]" },
  { emoji: "🚿", label: "Plumber",       subtitle: "Pipes & fixtures",    path: "/m/find/professional", bg: "from-[#2563EB] to-[#1D4ED8]" },
  { emoji: "🎨", label: "Painter",       subtitle: "Interior & exterior", path: "/m/find/professional", bg: "from-[#7C3AED] to-[#6D28D9]" },
  { emoji: "🪟", label: "AC Technician", subtitle: "Service & install",   path: "/m/find/professional", bg: "from-[#0D9488] to-[#0F766E]" },
  { emoji: "🧹", label: "Cleaning",      subtitle: "Home & office",       path: "/m/find/service",      bg: "from-[#16A34A] to-[#15803D]" },
];

const KEMETRO_CATEGORIES = [
  { emoji: "🪑", label: "Furniture", subtitle: "Home & office",          path: "/m/find/product", bg: "from-[#92400E] to-[#78350F]" },
  { emoji: "💡", label: "Lighting",  subtitle: "Indoor & outdoor",       path: "/m/find/product", bg: "from-[#D97706] to-[#B45309]" },
  { emoji: "🔩", label: "Hardware",  subtitle: "Tools & fasteners",      path: "/m/find/product", bg: "from-[#1a1a2e] to-[#16213e]" },
  { emoji: "🪞", label: "Decor",     subtitle: "Wall art & accessories", path: "/m/find/product", bg: "from-[#7C3AED] to-[#6D28D9]" },
  { emoji: "🛁", label: "Bathroom",  subtitle: "Fixtures & fittings",    path: "/m/find/product", bg: "from-[#2563EB] to-[#1D4ED8]" },
  { emoji: "🌿", label: "Garden",    subtitle: "Outdoor & landscaping",  path: "/m/find/product", bg: "from-[#16A34A] to-[#15803D]" },
];

const INITIAL_SEARCHES = ["Apartment Cairo", "Villa 5th Settlement", "Office New Cairo"];

const MODULE_DATA = {
  kemedar:  { categories: KEMEDAR_CATEGORIES,  placeholder: "Search properties, agents, areas...", label: "Kemedar®" },
  kemework: { categories: KEMEWORK_CATEGORIES, placeholder: "Search services, professionals...",   label: "Kemework®" },
  kemetro:  { categories: KEMETRO_CATEGORIES,  placeholder: "Search products, materials...",       label: "Kemetro®" },
};

export default function MobileFindPage() {
  const navigate = useNavigate();
  const { activeModule } = useModule();
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState(INITIAL_SEARCHES);

  const mod = MODULE_DATA[activeModule] || MODULE_DATA.kemedar;

  const handleSearch = (term) => {
    const q = term || query;
    if (q && !recentSearches.includes(q)) {
      setRecentSearches(prev => [q, ...prev].slice(0, 5));
    }
    // Navigate to relevant search page based on module
    if (activeModule === "kemetro") navigate(`/m/find/product?q=${encodeURIComponent(q)}`);
    else if (activeModule === "kemework") navigate(`/m/find/service?q=${encodeURIComponent(q)}`);
    else navigate(`/m/find/property?q=${encodeURIComponent(q)}`);
  };

  return (
    <div className="min-h-full bg-gray-50">

      {/* Top bar with X close */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 flex items-center justify-between" style={{ minHeight: 56 }}>
        <h1 className="font-black text-gray-900 text-base">Find</h1>
        <button onClick={() => navigate("/m")} className="p-1.5 rounded-full hover:bg-gray-100 active:bg-gray-200 transition-colors">
          <X size={22} className="text-gray-600" />
        </button>
      </div>

      {/* Search Bar */}
      <div className="px-4 pt-4 pb-3">
        <div
          className="flex items-center gap-2 bg-white rounded-2xl shadow-sm px-4 border border-gray-200"
          style={{ minHeight: 52 }}
        >
          <Search size={18} className="text-gray-400 flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch(query)}
            placeholder={mod.placeholder}
            className="flex-1 bg-transparent text-sm text-gray-800 placeholder-gray-400 outline-none"
          />
          {query ? (
            <button onClick={() => setQuery("")}>
              <X size={16} className="text-gray-400" />
            </button>
          ) : (
            <button>
              <Mic size={18} className="text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Recent Searches */}
      {recentSearches.length > 0 && (
        <div className="px-4 pb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">Recent Searches</span>
            <button onClick={() => setRecentSearches([])} className="text-xs font-semibold text-orange-600">Clear all</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map(s => (
              <button
                key={s}
                onClick={() => handleSearch(s)}
                className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs text-gray-600 font-medium shadow-sm"
              >
                <Clock size={12} className="text-gray-400" />
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* What are you looking for */}
      <div className="px-4 pb-4">
        <p className="text-base font-black text-gray-900 mb-3">What are you looking for?</p>
        <div className="grid grid-cols-2 gap-3">
          {mod.categories.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate(cat.path)}
              className={`bg-gradient-to-br ${cat.bg} rounded-2xl p-4 flex flex-col justify-between text-left active:opacity-90 transition-opacity`}
              style={{ minHeight: 120 }}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <div className="mt-2">
                <p className="font-black text-white text-sm leading-tight">{cat.label}</p>
                <p className="text-white/70 text-[11px] mt-0.5 leading-tight">{cat.subtitle}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Post a Request — kemedar only */}
      {activeModule === "kemedar" && (
        <div className="px-4 pb-8">
          <div className="bg-[#FFF7ED] rounded-2xl p-4">
            <p className="text-base font-black text-gray-900 mb-3">Post a Request</p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => navigate("/m/find/buy-request")}
                className="bg-white border-2 border-orange-500 rounded-2xl p-4 flex flex-col gap-2 active:bg-orange-50 transition-colors text-left"
              >
                <span className="text-2xl">🏠📋</span>
                <p className="font-black text-gray-900 text-sm leading-tight">Property Buy Request</p>
                <p className="text-[11px] text-gray-500 leading-tight">Tell sellers what you need</p>
              </button>
              <button
                onClick={() => navigate("/m/find/rfq")}
                className="bg-white border-2 border-blue-500 rounded-2xl p-4 flex flex-col gap-2 active:bg-blue-50 transition-colors text-left"
              >
                <span className="text-2xl">📦📋</span>
                <p className="font-black text-gray-900 text-sm leading-tight">RFQ for Product</p>
                <p className="text-[11px] text-gray-500 leading-tight">Request product quotes</p>
              </button>
            </div>
            <p className="text-center text-[11px] text-gray-400 mt-3 leading-relaxed">
              Property Buy Request and RFQ are special features for Kemedar users and Franchise Owners
            </p>
          </div>
        </div>
      )}
    </div>
  );
}