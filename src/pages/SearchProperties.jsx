import { useState, useEffect, useCallback } from "react";
import { LayoutGrid, List, ChevronLeft, ChevronRight, SlidersHorizontal, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";
import FilterSidebar from "@/components/search/FilterSidebar";
import PropertyCardGrid from "@/components/search/PropertyCardGrid";
import PropertyCardList from "@/components/search/PropertyCardList";

const PAGE_SIZE = 12;

const VERIFY_FILTER_OPTIONS = [
  { label: "All properties", value: "" },
  { label: "Any verified (Level 2+)", value: "2" },
  { label: "Document verified (Level 3+)", value: "3" },
  { label: "Physically inspected (Level 4+)", value: "4" },
  { label: "Fully verified only (Level 5)", value: "5" },
];

const BOOST = { 5: 1.5, 4: 1.3, 3: 1.15, 2: 1.05 };

function applyVerifyBoost(properties, sort) {
  if (!sort.includes("created_date") && !sort.includes("is_featured")) return properties;
  return [...properties].sort((a, b) => {
    const ba = BOOST[a.verification_level] || 1;
    const bb = BOOST[b.verification_level] || 1;
    return bb - ba;
  });
}

const SORT_OPTIONS = [
  { label: "Newest", value: "-created_date" },
  { label: "Price: Low → High", value: "price_amount" },
  { label: "Price: High → Low", value: "-price_amount" },
  { label: "Most Viewed", value: "-view_count" },
  { label: "Featured First", value: "-is_featured" },
];

const MOCK_PROPERTIES = Array.from({ length: 12 }, (_, i) => ({
  id: `mock-${i}`,
  title: ["Modern Apartment in New Cairo", "Luxury Villa in Sheikh Zayed", "Studio near Maadi Corniche", "Twin House 6th October", "Office Space Downtown", "Duplex in 5th Settlement", "Penthouse in Heliopolis", "Townhouse in Katameya", "Chalet North Coast", "Shop in Citystars", "Compound Villa New Capital", "Studio in Zamalek"][i % 12],
  purpose: ["For Sale", "For Rent", "For Investment", "For Daily Booking", "In Auction"][i % 5],
  price_amount: [1800000, 450000, 85000, 3200000, 250000, 920000, 4500000, 1100000, 750000, 320000, 2800000, 180000][i % 12],
  currency: "EGP",
  beds: [2, 4, 1, 3, 0, 4, 5, 3, 3, 0, 5, 1][i % 12],
  baths: [1, 3, 1, 2, 1, 3, 4, 2, 2, 1, 4, 1][i % 12],
  area_size: [120, 350, 55, 280, 90, 220, 380, 195, 160, 75, 400, 60][i % 12],
  city_name: ["New Cairo", "Sheikh Zayed", "Maadi", "6th October", "Downtown", "5th Settlement", "Heliopolis", "Katameya", "North Coast", "Nasr City", "New Capital", "Zamalek"][i % 12],
  district_name: ["El Rehab", "Beverly Hills", "Sarayat", "Hayy 11", "Garden City", "South Academy", "Korba", "Palm Hills", "Sidi Abdel Rahman", "Roxy", "R7", "El Gezira"][i % 12],
  description: "A beautiful property featuring modern design, high-quality finishes, and a prime location. Ideal for families and investors looking for long-term value.",
  is_featured: i % 3 === 0,
  is_verified: i % 4 === 0,
  view_count: Math.floor(Math.random() * 500),
  publisher_name: ["Ahmed Hassan", "Sara Mohamed", "Omar Khalil", "Nour Adel", "Karim Samir"][i % 5],
}));

function parseURLFilters() {
  const params = new URLSearchParams(window.location.search);
  return {
    purpose: params.get("purpose") || "",
    categories: params.getAll("category"),
    suitableFor: [],
    country: params.get("country") || "",
    province: params.get("province") || "",
    city: params.get("city") || "",
    district: params.get("district") || "",
    area: params.get("area") || "",
    priceMin: params.get("price_min") || "",
    priceMax: params.get("price_max") || "",
    currency: params.get("currency") || "USD",
    sizeMin: "",
    sizeMax: "",
    sizeUnit: "SqM",
    beds: params.get("beds") || "",
    baths: params.get("baths") || "",
    amenities: [],
    finishing: [],
    yearFrom: "",
    yearTo: "",
  };
}

function updateURL(filters) {
  const params = new URLSearchParams();
  if (filters.purpose) params.set("purpose", filters.purpose);
  (filters.categories || []).forEach((c) => params.append("category", c));
  if (filters.country) params.set("country", filters.country);
  if (filters.province) params.set("province", filters.province);
  if (filters.city) params.set("city", filters.city);
  if (filters.district) params.set("district", filters.district);
  if (filters.area) params.set("area", filters.area);
  if (filters.priceMin) params.set("price_min", filters.priceMin);
  if (filters.priceMax) params.set("price_max", filters.priceMax);
  if (filters.currency && filters.currency !== "USD") params.set("currency", filters.currency);
  if (filters.beds) params.set("beds", filters.beds);
  if (filters.baths) params.set("baths", filters.baths);
  const qs = params.toString();
  window.history.replaceState(null, "", qs ? `?${qs}` : window.location.pathname);
}

export default function SearchProperties() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState(parseURLFilters);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("grid");
  const [sort, setSort] = useState("-created_date");
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [verifyFilter, setVerifyFilter] = useState("");

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    try {
      const query = { is_active: true };
      if (filters.purpose) query.purpose = filters.purpose;
      if (filters.categories?.length === 1) query.category_id = filters.categories[0];
      if (filters.country) query.country_id = filters.country;
      if (filters.province) query.province_id = filters.province;
      if (filters.city) query.city_id = filters.city;
      if (filters.district) query.district_id = filters.district;
      if (filters.area) query.area_id = filters.area;

      const data = await base44.entities.Property.filter(query, sort, 100);
      setProperties(data.length > 0 ? data : MOCK_PROPERTIES);
      setTotal(data.length > 0 ? data.length : MOCK_PROPERTIES.length);
    } catch {
      setProperties(MOCK_PROPERTIES);
      setTotal(MOCK_PROPERTIES.length);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchProperties();
    updateURL(filters);
    setPage(1);
  }, [fetchProperties]);

  const filteredByVerify = verifyFilter
    ? properties.filter(p => (p.verification_level || 1) >= parseInt(verifyFilter))
    : properties;
  const boosted = applyVerifyBoost(filteredByVerify, sort);
  const totalPages = Math.ceil(boosted.length / PAGE_SIZE);
  const paginated = boosted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* AI / Standard Search Tab Switcher */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-2">
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-[#FF6B00] bg-[#FF6B00]/5 text-[#FF6B00] text-sm font-black"
          >
            🔍 Standard Search
          </button>
          <button
            onClick={() => navigate('/kemedar/ai-search')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-purple-400 text-purple-700 text-sm font-bold hover:bg-purple-50 transition-colors"
          >
            🤖 AI Search
            <span className="text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded-full font-black">NEW</span>
          </button>
          <button
            onClick={() => navigate('/kemedar/advisor')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-500 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors"
          >
            📋 Advisor
          </button>
          <button
            onClick={() => navigate('/kemedar/match/setup')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border-2 border-red-500 text-red-500 text-sm font-bold hover:bg-red-50 transition-colors"
          >
            💘 Kemedar Match
          </button>
        </div>
      </div>

      {/* Kemedar Match™ Banner */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 border-b border-orange-600">
        <div className="max-w-[1400px] mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💘</span>
            <div>
              <p className="font-black text-white text-sm">Kemedar Match™ — Find Your Perfect Property</p>
              <p className="text-orange-100 text-xs mt-0.5">Let AI match you with properties that fit your criteria. Swipe, like, and negotiate deals.</p>
            </div>
          </div>
          <button
            onClick={() => navigate('/kemedar/match/setup')}
            className="flex-shrink-0 bg-white hover:bg-orange-50 text-orange-600 font-black text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            Get Started →
          </button>
        </div>
      </div>

      {/* Page header bar */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-[1400px] mx-auto px-4 py-3 flex items-center gap-3">
          <span className="text-sm text-gray-500">
            <span className="font-black text-gray-900">{total.toLocaleString()}</span> Properties Found
          </span>
          {filters.purpose && (
            <span className="bg-[#FF6B00]/10 text-[#FF6B00] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              {filters.purpose}
              <button onClick={() => setFilters((f) => ({ ...f, purpose: "" }))}><X size={11} /></button>
            </span>
          )}
          <button
            onClick={() => {
              const searchName = prompt("Name this search:");
              if (searchName) {
                const saved = JSON.parse(localStorage.getItem("savedSearches") || "[]");
                saved.push({ name: searchName, filters, timestamp: Date.now() });
                localStorage.setItem("savedSearches", JSON.stringify(saved));
                alert("Search saved!");
              }
            }}
            className="ml-auto text-sm font-bold text-[#FF6B00] hover:text-[#e55f00] transition-colors flex items-center gap-2"
          >
            ❤️ Save Search
          </button>
          <button
            onClick={() => {
              const params = new URLSearchParams();
              if (filters.purpose) params.set("purpose", filters.purpose);
              (filters.categories || []).forEach((c) => params.append("category", c));
              if (filters.country) params.set("country", filters.country);
              if (filters.city) params.set("city", filters.city);
              if (filters.priceMin) params.set("price_min", filters.priceMin);
              if (filters.priceMax) params.set("price_max", filters.priceMax);
              if (filters.beds) params.set("beds", filters.beds);
              const shareUrl = `${window.location.origin}${window.location.pathname}?${params.toString()}`;
              navigator.clipboard.writeText(shareUrl);
              alert("Search link copied!");
            }}
            className="text-sm font-bold text-[#FF6B00] hover:text-[#e55f00] transition-colors flex items-center gap-2"
          >
            🔗 Share
          </button>
          <button
            className="lg:hidden flex items-center gap-2 text-sm font-bold text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5"
            onClick={() => setMobileSidebarOpen(true)}
          >
            <SlidersHorizontal size={15} /> Filters
          </button>
        </div>
      </div>

      <div className="flex-1 max-w-[1400px] mx-auto px-4 py-6 w-full">
        <div className="flex gap-6 items-start">

          {/* Desktop Sidebar - Location first */}
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          {/* Mobile Sidebar Drawer */}
          {mobileSidebarOpen && (
            <div className="fixed inset-0 z-[200] flex">
              <div className="absolute inset-0 bg-black/40" onClick={() => setMobileSidebarOpen(false)} />
              <div className="relative z-10 bg-gray-50 w-[300px] h-full overflow-y-auto p-4 shadow-2xl">
                <button onClick={() => setMobileSidebarOpen(false)} className="mb-4 flex items-center gap-2 text-gray-500 hover:text-gray-800">
                  <X size={18} /> Close Filters
                </button>
                <FilterSidebar filters={filters} onChange={(f) => { setFilters(f); }} />
              </div>
            </div>
          )}

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex items-center justify-between mb-4 bg-white rounded-xl border border-gray-100 px-4 py-3 shadow-sm">
              <p className="text-sm text-gray-500 hidden sm:block">
                Showing <span className="font-bold text-gray-800">{((page - 1) * PAGE_SIZE) + 1}–{Math.min(page * PAGE_SIZE, boosted.length)}</span> of <span className="font-bold text-gray-800">{boosted.length}</span>
              </p>
              <div className="flex items-center gap-3 ml-auto flex-wrap">
                <select
                  value={verifyFilter}
                  onChange={(e) => { setVerifyFilter(e.target.value); setPage(1); }}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 cursor-pointer"
                >
                  {VERIFY_FILTER_OPTIONS.map(o => (
                    <option key={o.value} value={o.value}>{o.value === "" ? "🔐 Verification" : `🔐 ${o.label}`}</option>
                  ))}
                </select>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 cursor-pointer"
                >
                  {SORT_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </select>
                <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={`p-2 transition-colors ${viewMode === "grid" ? "bg-[#FF6B00] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                  >
                    <LayoutGrid size={16} />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={`p-2 transition-colors ${viewMode === "list" ? "bg-[#FF6B00] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                  >
                    <List size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className={`${viewMode === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4" : "flex flex-col gap-4"}`}>
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className={`bg-white rounded-xl border border-gray-100 overflow-hidden animate-pulse ${viewMode === "list" ? "flex h-[180px]" : "h-[320px]"}`}>
                    <div className={`bg-gray-200 ${viewMode === "list" ? "w-[30%]" : "h-48 w-full"}`} />
                    <div className="flex-1 p-4 flex flex-col gap-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2" />
                      <div className="h-3 bg-gray-100 rounded w-3/4" />
                      <div className="h-3 bg-gray-100 rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginated.length === 0 ? (
              <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
                <p className="text-4xl mb-3">🏠</p>
                <p className="font-bold text-gray-700 text-lg">No properties found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {paginated.map((p, i) => <PropertyCardGrid key={p.id} property={p} index={i} />)}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {paginated.map((p, i) => <PropertyCardList key={p.id} property={p} index={i} />)}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  <ChevronLeft size={15} /> Previous
                </button>

                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let pg;
                  if (totalPages <= 7) pg = i + 1;
                  else if (page <= 4) pg = i + 1 === 7 ? "..." : i + 1;
                  else if (page >= totalPages - 3) pg = i === 0 ? 1 : i === 1 ? "..." : totalPages - (6 - i);
                  else pg = i === 0 ? 1 : i === 1 ? "..." : i === 5 ? "..." : i === 6 ? totalPages : page + (i - 3);
                  return pg === "..." ? (
                    <span key={i} className="px-2 text-gray-400">…</span>
                  ) : (
                    <button
                      key={pg}
                      onClick={() => setPage(pg)}
                      className={`w-9 h-9 rounded-lg text-sm font-bold transition-all ${page === pg ? "bg-[#FF6B00] text-white shadow-md" : "border border-gray-200 text-gray-600 hover:border-[#FF6B00] hover:text-[#FF6B00]"}`}
                    >
                      {pg}
                    </button>
                  );
                })}

                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-[#FF6B00] hover:text-[#FF6B00] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next <ChevronRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <SuperFooter />
    </div>
  );
}