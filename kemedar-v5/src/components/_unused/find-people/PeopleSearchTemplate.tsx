"use client";
// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import { ArrowLeft, Search, ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import MobileSearchBar from "@/components/mobile-v2/MobileSearchBar";
import LocationFilterSheet from "@/components/find-property/LocationFilterSheet";
import RatingFilterSheet from "@/components/find-people/RatingFilterSheet";

export default function PeopleSearchTemplate({
  title,
  placeholder = "Search by name, city...",
  results = [],
  totalCount,
  renderCard,
  extraFilters = null,
  extraFilterSheet = null,
}) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeSheet, setActiveSheet] = useState(null);
  const [filters, setFilters] = useState({ location: null, rating: null, verified: false, sort: "default" });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          setTimeout(() => { setPage(p => p + 1); setLoading(false); }, 700);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const displayed = results.slice(0, page * 10);

  const CHIPS = [
    { key: "location", icon: "📍", label: "Location", hasValue: !!filters.location },
    { key: "rating", icon: "⭐", label: "Rating", hasValue: !!filters.rating },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Sticky top section */}
      <div className="sticky top-0 z-40 bg-white" style={{ boxShadow: "0 1px 0 #E5E7EB" }}>
        {/* Top bar */}
        <div className="flex items-center px-4 gap-3" style={{ height: 52 }}>
          <button onClick={() => router.push(-1)} className="p-1 -ml-1">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <span className="flex-1 text-center font-black text-gray-900 text-base">{title}</span>
          <button className="p-1">
            <Search size={20} className="text-gray-700" />
          </button>
        </div>

        {/* Search bar */}
        <div className="px-4 pb-2">
          <MobileSearchBar placeholder={placeholder} value={query} onChange={setQuery} />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
          {CHIPS.map(chip => (
            <button
              key={chip.key}
              onClick={() => setActiveSheet(chip.key)}
              className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                chip.hasValue ? "bg-orange-600 text-white border-orange-600" : "bg-white text-gray-700 border-gray-200"
              }`}
            >
              {chip.icon} {chip.label}
              {chip.hasValue ? (
                <span onClick={e => { e.stopPropagation(); setFilters(f => ({ ...f, [chip.key]: null })); }}>
                  <X size={11} />
                </span>
              ) : <ChevronDown size={11} />}
            </button>
          ))}

          <button
            onClick={() => setFilters(f => ({ ...f, verified: !f.verified }))}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              filters.verified ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            ✅ Verified only
          </button>

          <button
            onClick={() => setFilters(f => ({ ...f, sort: f.sort === "az" ? "default" : "az" }))}
            className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
              filters.sort === "az" ? "bg-gray-900 text-white border-gray-900" : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            🔤 A–Z
          </button>

          {extraFilters && (
            <button
              onClick={() => setActiveSheet("extra")}
              className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border bg-white text-gray-700 border-gray-200"
            >
              <SlidersHorizontal size={11} /> More
            </button>
          )}
        </div>

        {/* Results count */}
        <div className="px-4 pb-2">
          <span className="text-[13px] text-gray-500">{totalCount ?? results.length} found</span>
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 px-4 pt-3 space-y-3 pb-24">
        {displayed.map((person, i) => renderCard(person, i))}
        <div ref={loaderRef} className="py-2">
          {loading && (
            <div className="space-y-3">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 animate-pulse flex gap-3">
                  <div className="w-16 h-16 bg-gray-200 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/2" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                    <div className="h-3 bg-gray-200 rounded w-1/3" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Filter Sheets */}
      <LocationFilterSheet
        open={activeSheet === "location"}
        onClose={() => setActiveSheet(null)}
        value={filters.location}
        onApply={v => { setFilters(f => ({ ...f, location: v })); setActiveSheet(null); }}
      />
      <RatingFilterSheet
        open={activeSheet === "rating"}
        onClose={() => setActiveSheet(null)}
        value={filters.rating}
        onApply={v => { setFilters(f => ({ ...f, rating: v })); setActiveSheet(null); }}
      />
      {extraFilterSheet && extraFilterSheet(activeSheet === "extra", () => setActiveSheet(null), filters, setFilters)}
    </div>
  );
}