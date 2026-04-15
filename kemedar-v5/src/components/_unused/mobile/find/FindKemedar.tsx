"use client";
// @ts-nocheck
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Mic, X, Clock } from "lucide-react";

const INITIAL_RECENTS = ["Apartment Cairo", "Villa 5th Settlement", "Office New Cairo"];

const CATEGORIES = [
  { emoji: "🏠", label: "Property", sub: "Buy, rent or invest", bg: "from-[#FF6B00] to-[#FF9500]", path: "/search-properties" },
  { emoji: "🏗", label: "Project", sub: "New developments", bg: "from-[#1a1a2e] to-[#16213e]", path: "/search-projects" },
  { emoji: "👤", label: "Agent", sub: "Find professionals", bg: "from-[#0D9488] to-[#0F766E]", path: "/find-profile/real-estate-agents" },
  { emoji: "🏢", label: "Developer", sub: "Real estate developers", bg: "from-[#7C3AED] to-[#6D28D9]", path: "/find-profile/developer" },
  { emoji: "🗺", label: "Franchise Owner", sub: "Local Kemedar rep", bg: "from-[#16A34A] to-[#15803D]", path: "/find-profile/franchise-owner" },
  { emoji: "📦", label: "Product", sub: "Building materials", bg: "from-[#2563EB] to-[#1D4ED8]", path: "/kemetro/search" },
  { emoji: "🔧", label: "Services", sub: "Home services", bg: "from-[#0F766E] to-[#115E59]", path: "/dashboard/kemework" },
  { emoji: "👷", label: "Professional", sub: "Handymen & experts", bg: "from-[#92400E] to-[#78350F]", path: "/dashboard/find-handyman" },
];

export default function FindKemedar() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [recents, setRecents] = useState(INITIAL_RECENTS);

  const clearRecents = () => setRecents([]);

  const handleSearch = (term) => {
    if (term && !recents.includes(term)) {
      setRecents((p) => [term, ...p].slice(0, 5));
    }
    router.push(`/search-properties?q=${encodeURIComponent(term || query)}`);
  };

  return (
    <div className="px-4 pt-4 space-y-5">
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm px-4 border border-[#E5E7EB]" style={{ minHeight: 52 }}>
        <Search size={18} className="text-[#9CA3AF] flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch(query)}
          placeholder="Search properties, agents, areas..."
          className="flex-1 bg-transparent text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none"
        />
        {query ? (
          <button onClick={() => setQuery("")}>
            <X size={16} className="text-[#9CA3AF]" />
          </button>
        ) : (
          <button>
            <Mic size={18} className="text-[#9CA3AF]" />
          </button>
        )}
      </div>

      {/* Recent Searches */}
      {recents.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-bold text-[#6B7280] uppercase tracking-wide">Recent Searches</p>
            <button onClick={clearRecents} className="text-xs text-[#FF6B00] font-semibold">Clear all</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {recents.map((r) => (
              <button
                key={r}
                onClick={() => handleSearch(r)}
                className="flex items-center gap-1.5 bg-white border border-[#E5E7EB] rounded-xl px-3 py-1.5 text-xs text-[#4B5563] font-medium shadow-sm"
              >
                <Clock size={12} className="text-[#9CA3AF]" />
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Category Grid */}
      <div>
        <p className="text-base font-black text-[#1F2937] mb-3">What are you looking for?</p>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => router.push(cat.path)}
              className={`bg-gradient-to-br ${cat.bg} rounded-2xl p-4 flex flex-col justify-between text-left active:opacity-90 transition-opacity`}
              style={{ minHeight: 120 }}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <div className="mt-2">
                <p className="text-white font-black text-sm leading-tight">{cat.label}</p>
                <p className="text-white/70 text-[11px] mt-0.5 leading-tight">{cat.sub}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Post a Request */}
      <div className="bg-[#FFF7ED] rounded-2xl p-4">
        <p className="text-base font-black text-[#1F2937] mb-3">Post a Request</p>
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => router.push("/create/buy-request")}
            className="bg-white border-2 border-[#FF6B00] rounded-2xl p-4 flex flex-col gap-2 active:bg-orange-50 transition-colors"
          >
            <span className="text-2xl">🏠📋</span>
            <p className="font-black text-[#1F2937] text-sm leading-tight">Property Buy Request</p>
            <p className="text-[11px] text-[#6B7280] leading-tight">Tell sellers what you need</p>
          </button>
          <button
            onClick={() => router.push("/kemetro/search")}
            className="bg-white border-2 border-[#2563EB] rounded-2xl p-4 flex flex-col gap-2 active:bg-blue-50 transition-colors"
          >
            <span className="text-2xl">📦📋</span>
            <p className="font-black text-[#1F2937] text-sm leading-tight">RFQ for Product</p>
            <p className="text-[11px] text-[#6B7280] leading-tight">Request product quotes</p>
          </button>
        </div>
        <p className="text-[11px] text-[#9CA3AF] mt-3 leading-relaxed text-center">
          Property Buy Request and RFQ are special features for Kemedar users and Franchise Owners
        </p>
      </div>
    </div>
  );
}