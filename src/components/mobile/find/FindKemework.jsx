import { useState } from "react";
import { Search, Mic, X } from "lucide-react";

const CATEGORIES = [
  { emoji: "🔧", label: "Handyman", sub: "General repairs", bg: "from-[#EA580C] to-[#C2410C]" },
  { emoji: "⚡", label: "Electrician", sub: "Electrical work", bg: "from-[#CA8A04] to-[#A16207]" },
  { emoji: "🔩", label: "Plumber", sub: "Plumbing services", bg: "from-[#2563EB] to-[#1D4ED8]" },
  { emoji: "🎨", label: "Painter", sub: "Painting & décor", bg: "from-[#DB2777] to-[#BE185D]" },
  { emoji: "🪟", label: "Carpenter", sub: "Wood & furniture", bg: "from-[#92400E] to-[#78350F]" },
  { emoji: "❄️", label: "AC Technician", sub: "HVAC services", bg: "from-[#0891B2] to-[#0E7490]" },
  { emoji: "🏗", label: "Contractor", sub: "Construction", bg: "from-[#1a1a2e] to-[#16213e]" },
  { emoji: "🏢", label: "Finishing Co", sub: "Full finishing", bg: "from-[#7C3AED] to-[#6D28D9]" },
];

export default function FindKemework({ navigate }) {
  const [query, setQuery] = useState("");

  return (
    <div className="px-4 pt-4 space-y-5">
      {/* Search Bar */}
      <div className="flex items-center gap-2 bg-white rounded-2xl shadow-sm px-4 border border-[#E5E7EB]" style={{ minHeight: 52 }}>
        <Search size={18} className="text-[#9CA3AF] flex-shrink-0" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search services, handymen..."
          className="flex-1 bg-transparent text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none"
        />
        {query ? (
          <button onClick={() => setQuery("")}><X size={16} className="text-[#9CA3AF]" /></button>
        ) : (
          <button><Mic size={18} className="text-[#9CA3AF]" /></button>
        )}
      </div>

      {/* Category Grid */}
      <div>
        <p className="text-base font-black text-[#1F2937] mb-3">What are you looking for?</p>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.label}
              onClick={() => navigate("/dashboard/find-handyman")}
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
    </div>
  );
}