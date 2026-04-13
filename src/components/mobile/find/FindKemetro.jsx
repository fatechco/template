import { useState } from "react";
import { Search, Mic, X } from "lucide-react";

const CHIPS = ["All", "Construction", "Furniture", "Appliances", "Electrical", "Tiles", "More"];

const CATEGORIES = [
  { emoji: "🧱", label: "Construction Materials", bg: "from-[#78350F] to-[#92400E]" },
  { emoji: "🛋", label: "Furniture", bg: "from-[#7C3AED] to-[#6D28D9]" },
  { emoji: "📺", label: "Appliances", bg: "from-[#1a1a2e] to-[#16213e]" },
  { emoji: "⚡", label: "Electrical", bg: "from-[#CA8A04] to-[#A16207]" },
  { emoji: "🔧", label: "Plumbing", bg: "from-[#2563EB] to-[#1D4ED8]" },
  { emoji: "🪟", label: "Architectural", bg: "from-[#0D9488] to-[#0F766E]" },
  { emoji: "🪨", label: "Natural Stone", bg: "from-[#4B5563] to-[#374151]" },
  { emoji: "🔐", label: "Security & Smart Home", bg: "from-[#16A34A] to-[#15803D]" },
];

export default function FindKemetro({ navigate }) {
  const [query, setQuery] = useState("");
  const [activeChip, setActiveChip] = useState("All");

  return (
    <div className="px-4 pt-4 space-y-5">
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm px-4 border border-[#E5E7EB]" style={{ minHeight: 52 }}>
        <Search size={18} className="text-[#9CA3AF] flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products, brands, stores..."
          className="flex-1 bg-transparent text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none"
        />
        {query ? (
          <button onClick={() => setQuery("")}><X size={16} className="text-[#9CA3AF]" /></button>
        ) : (
          <button><Mic size={18} className="text-[#9CA3AF]" /></button>
        )}
      </div>

      {/* Category Filter Chips */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-4 px-4">
        {CHIPS.map((chip) => (
          <button
            key={chip}
            onClick={() => setActiveChip(chip)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-colors ${
              activeChip === chip
                ? "bg-[#FF6B00] text-white"
                : "bg-white border border-[#E5E7EB] text-[#6B7280]"
            }`}
          >
            {chip}
          </button>
        ))}
      </div>

      {/* Category Grid */}
      <div>
        <p className="text-base font-black text-[#1F2937] mb-3">Browse Categories</p>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate("/kemetro/search")}
              className={`bg-gradient-to-br ${cat.bg} rounded-2xl p-4 flex flex-col justify-between text-left active:opacity-90 transition-opacity`}
              style={{ minHeight: 120 }}
            >
              <span className="text-3xl">{cat.emoji}</span>
              <div className="mt-2">
                <p className="text-white font-black text-sm leading-tight">{cat.label}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}