"use client";
// @ts-nocheck
import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "All Categories", "Home Design & Remodeling", "Electrical Services",
  "Plumbing Services", "Painting & Decorating", "Interior Design",
  "Landscaping & Gardening", "AC & HVAC", "Carpentry & Woodwork",
  "Flooring & Tiling", "Cleaning Services", "Pest Control",
];

const QUICK_CATS = [
  { icon: "⚡", label: "Electrical" },
  { icon: "🪟", label: "Plumbing" },
  { icon: "🎨", label: "Painting" },
  { icon: "🏠", label: "Interior Design" },
  { icon: "🌿", label: "Landscaping" },
  { icon: "❄️", label: "AC Repair" },
  { icon: "🪚", label: "Carpentry" },
  { icon: "🧹", label: "Cleaning" },
];

export default function KWSearchBar() {
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (category) params.set("category", category);
    if (location) params.set("location", location);
    if (keyword) params.set("q", keyword);
    router.push(`/kemework/search?${params.toString()}`);
  };

  return (
    <div className="bg-white py-8 px-4">
      <div className="max-w-[900px] mx-auto bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-center text-lg font-black text-gray-900 mb-5">What do you need done?</h2>
        <div className="flex flex-col md:flex-row gap-3">
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-red-400 bg-white"
          >
            {CATEGORIES.map(c => <option key={c} value={c === "All Categories" ? "" : c}>{c}</option>)}
          </select>
          <input
            type="text"
            placeholder="City / Location"
            value={location}
            onChange={e => setLocation(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400"
          />
          <input
            type="text"
            placeholder='e.g. plumber, painter'
            value={keyword}
            onChange={e => setKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-red-400"
          />
          <button
            onClick={handleSearch}
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-white text-sm transition-colors hover:opacity-90 whitespace-nowrap"
            style={{ background: "#C41230", minHeight: 56 }}
          >
            🔍 Search
          </button>
        </div>

        {/* Quick pills */}
        <div className="flex flex-wrap gap-2 mt-4 overflow-x-auto no-scrollbar">
          {QUICK_CATS.map(cat => (
            <button
              key={cat.label}
              onClick={() => { setCategory(cat.label); }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:border-red-400 hover:text-red-700 transition-colors whitespace-nowrap"
            >
              <span>{cat.icon}</span> {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}