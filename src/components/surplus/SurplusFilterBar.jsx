import { useState } from "react";
import { Map } from "lucide-react";

const CONDITION_OPTIONS = [
  { value: "", label: "Any Condition" },
  { value: "brand_new_excess", label: "✨ Brand New" },
  { value: "open_box", label: "📦 Open Box" },
  { value: "lightly_used", label: "👍 Lightly Used" },
  { value: "salvaged", label: "♻️ Salvaged" },
];

const PRICE_OPTIONS = [
  { value: "", label: "Any Price" },
  { value: "under500", label: "Under 500 EGP" },
  { value: "500-2000", label: "500 – 2,000 EGP" },
  { value: "2000-5000", label: "2,000 – 5,000 EGP" },
];

const CATEGORY_OPTIONS = [
  "", "Flooring", "Tiles", "Paint", "Wood & Timber", "Plumbing",
  "Electrical", "Doors & Windows", "Sanitaryware", "Kitchen", "Hardware",
];

export default function SurplusFilterBar({ filters, setFilters, mapView, setMapView, resultCount, sortOptions }) {
  const [showCityInput, setShowCityInput] = useState(false);
  const set = (key, val) => setFilters(prev => ({ ...prev, [key]: val }));

  return (
    <div className="px-4 sm:px-6 py-3">
      <div className="flex flex-wrap items-center gap-3 justify-between">

        {/* Left: geo */}
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span>📍</span>
            <span>Within <span className="font-bold text-green-700">{filters.radiusKm} km</span> of Cairo</span>
          </div>
          <input
            type="range"
            min={5} max={100} step={5}
            value={filters.radiusKm}
            onChange={e => set("radiusKm", Number(e.target.value))}
            className="w-24 accent-green-600"
          />
          <button onClick={() => setShowCityInput(v => !v)} className="text-xs text-green-600 font-semibold hover:underline">
            Change City
          </button>
        </div>

        {/* Right: filter dropdowns */}
        <div className="flex items-center gap-2 flex-wrap">
          <select value={filters.category} onChange={e => set("category", e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-400 bg-white">
            <option value="">Category ▼</option>
            {CATEGORY_OPTIONS.filter(Boolean).map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <select value={filters.condition} onChange={e => set("condition", e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-400 bg-white">
            {CONDITION_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select value={filters.price} onChange={e => set("price", e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-400 bg-white">
            {PRICE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <button
            onClick={() => setMapView(v => !v)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-bold border transition-all ${
              mapView ? "bg-green-600 text-white border-green-600" : "border-gray-200 text-gray-600 hover:border-green-400"
            }`}>
            <Map size={14} /> Map View
          </button>

          <select value={filters.sort} onChange={e => set("sort", e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-green-400 bg-white">
            {sortOptions.map(o => <option key={o.value} value={o.value}>Sort: {o.label} ▼</option>)}
          </select>

          <span className="text-xs text-gray-400 font-semibold whitespace-nowrap">{resultCount} items near you</span>
        </div>
      </div>
    </div>
  );
}