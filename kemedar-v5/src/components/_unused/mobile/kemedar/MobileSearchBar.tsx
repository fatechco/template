"use client";
// @ts-nocheck
import { useState } from "react";
import { Search, Grid, MapPin, BedDouble, DollarSign, Home, SlidersHorizontal } from "lucide-react";

const PURPOSES = ["For Sale", "For Rent", "Investment", "Daily Booking"];

const FILTERS = [
  { icon: MapPin, label: "Location" },
  { icon: BedDouble, label: "Beds" },
  { icon: DollarSign, label: "Price" },
  { icon: Home, label: "Category" },
  { icon: SlidersHorizontal, label: "More filters" },
];

export default function MobileSearchBar() {
  const [purpose, setPurpose] = useState("For Sale");
  const [query, setQuery] = useState("");

  return (
    <div className="px-4 -mt-4 relative z-10 mb-4">
      <div className="bg-white rounded-2xl shadow-md border border-[#E5E7EB] p-4 space-y-3">
        {/* Purpose tabs */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {PURPOSES.map((p) => (
            <button
              key={p}
              onClick={() => setPurpose(p)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                purpose === p
                  ? "bg-[#FF6B00] text-white border-[#FF6B00]"
                  : "bg-white text-[#6B7280] border-[#E5E7EB]"
              }`}
              style={{ minHeight: 32 }}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Search input */}
        <div className="flex items-center gap-2 bg-[#F8FAFC] rounded-xl px-3 border border-[#E5E7EB]" style={{ minHeight: 44 }}>
          <Search size={16} className="text-[#6B7280] flex-shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search city, area, project..."
            className="flex-1 bg-transparent text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none"
          />
          <button className="p-1.5 text-[#6B7280]">
            <Grid size={16} />
          </button>
        </div>

        {/* Quick filter chips */}
        <div className="flex gap-2 overflow-x-auto pb-0.5 no-scrollbar">
          {FILTERS.map(({ icon: Icon, label }) => (
            <button
              key={label}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 bg-[#F8FAFC] border border-[#E5E7EB] rounded-full text-xs font-semibold text-[#6B7280]"
              style={{ minHeight: 32 }}
            >
              <Icon size={12} />
              {label}
            </button>
          ))}
        </div>

        {/* Search button */}
        <button
          className="w-full bg-[#FF6B00] text-white font-black rounded-xl text-sm flex items-center justify-center gap-2"
          style={{ minHeight: 48 }}
        >
          <Search size={16} />
          Search Properties
        </button>
      </div>
    </div>
  );
}