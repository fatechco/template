import { useState, useCallback, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Map, List, Grid, SlidersHorizontal, ChevronDown, X, ArrowUpDown } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileSearchBar from "@/components/mobile-v2/MobileSearchBar";
import MobilePropertyCard from "@/components/mobile-v2/MobilePropertyCard";
import LocationFilterSheet from "@/components/find-property/LocationFilterSheet";
import CategoryFilterSheet from "@/components/find-property/CategoryFilterSheet";
import BedsFilterSheet from "@/components/find-property/BedsFilterSheet";
import PriceFilterSheet from "@/components/find-property/PriceFilterSheet";
import MoreFiltersSheet from "@/components/find-property/MoreFiltersSheet";
import SortSheet from "@/components/find-property/SortSheet";
import PropertyMapView from "@/components/find-property/PropertyMapView";

const PURPOSE_OPTIONS = [
  { value: "For Sale", label: "🏠 For Sale" },
  { value: "For Rent", label: "🔑 For Rent" },
  { value: "For Investment", label: "💰 Investment" },
  { value: "For Daily Booking", label: "📅 Daily" },
  { value: "In Auction", label: "🔨 Auction" },
];

const SORT_OPTIONS = [
  { label: "Newest", value: "-created_date" },
  { label: "Price: Low → High", value: "price_amount" },
  { label: "Price: High → Low", value: "-price_amount" },
  { label: "Most Viewed", value: "-view_count" },
  { label: "Featured First", value: "-is_featured" },
];

const MOCK_PROPERTIES = Array.from({ length: 20 }, (_, i) => ({
  id: String(i + 1),
  title: ["Luxury Apartment in New Cairo", "Modern Villa in Sheikh Zayed", "Studio in Downtown", "Penthouse in Maadi", "Office Space in Smart Village"][i % 5],
  price: ["EGP 2,500,000", "EGP 12,000,000", "EGP 8,000/mo", "EGP 5,000,000", "EGP 25,000/mo"][i % 5],
  city: ["Cairo", "Giza", "Alexandria", "New Cairo"][i % 4],
  purpose: ["For Sale", "For Rent", "For Sale", "For Sale", "For Rent"][i % 5],
  beds: [3, 5, 1, 4, 0][i % 5],
  baths: [2, 4, 1, 3, 2][i % 5],
  area: [180, 450, 60, 300, 200][i % 5],
  image: `https://images.unsplash.com/photo-${["1560448204-e02f11c3d0e2", "1564013799919-ab600027ffc6", "1512917774080-9991f1c4c750", "1502672260266-1c1ef2d93688", "1493809842364-78817add7ffb"][i % 5]}?w=400&q=80`,
}));

export default function FindPropertyPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState("grid");
  const [activeSheet, setActiveSheet] = useState(null);
  const [sort, setSort] = useState("-created_date");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const loaderRef = useRef(null);

  const [filters, setFilters] = useState({
    purpose: "",
    categories: [],
    suitableFor: [],
    country: "",
    province: "",
    city: "",
    district: "",
    area: "",
    priceMin: "",
    priceMax: "",
    currency: "USD",
    sizeMin: "",
    sizeMax: "",
    sizeUnit: "SqM",
    beds: "",
    baths: "",
    amenities: [],
    finishing: [],
    yearFrom: "",
    yearTo: "",
  });

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
      // setProperties(data.length > 0 ? data : MOCK_PROPERTIES);
    } catch {
      // setProperties(MOCK_PROPERTIES);
    } finally {
      setLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          setLoading(true);
          setTimeout(() => { setPage(p => p + 1); setLoading(false); }, 800);
        }
      },
      { threshold: 0.1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => observer.disconnect();
  }, [loading]);

  const displayedProps = MOCK_PROPERTIES.slice(0, page * 10);

  const FILTER_CHIPS = [
    { key: "purpose", icon: "🏠", label: "Purpose" },
    { key: "location", icon: "📍", label: "Location" },
    { key: "category", icon: "🏘", label: "Category" },
    { key: "beds", icon: "🛏", label: "Beds" },
    { key: "price", icon: "💰", label: "Price" },
  ];

  const SORT_LABELS = { "-created_date": "Newest", "price_amount": "Price ↑", "-price_amount": "Price ↓", "-view_count": "Most Viewed", "-is_featured": "Featured" };

  const handleAISearch = () => navigate('/m/kemedar/ai-search');

  if (viewMode === "map") {
    return (
      <PropertyMapView
        properties={displayedProps}
        onBack={() => setViewMode("grid")}
        onPropertyClick={(id) => navigate(`/m/property/${id}`)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col relative">
      <div className="sticky top-0 z-40 bg-white" style={{ boxShadow: "0 1px 0 #E5E7EB" }}>
        <div className="flex items-center px-4 gap-3" style={{ height: 52 }}>
          <button onClick={() => navigate(-1)} className="p-1 -ml-1">
            <ArrowLeft size={22} className="text-gray-900" />
          </button>
          <span className="flex-1 text-center font-black text-gray-900 text-base">Find Property</span>
          <button onClick={handleAISearch} className="px-2 py-1 bg-purple-600 text-white text-[10px] font-black rounded-lg flex items-center gap-1">
            ✨ AI
          </button>
          <button
            onClick={() => navigate('/m/find/filters')}
            className="flex items-center gap-1 px-2.5 py-1 bg-gray-100 text-gray-700 text-[11px] font-bold rounded-lg border border-gray-200"
          >
            <SlidersHorizontal size={13} /> Filter
          </button>
          <button onClick={() => setViewMode("map")} className="p-1">
            <Map size={22} className="text-gray-700" />
          </button>
        </div>

        <div className="flex gap-2 px-4 pb-2 overflow-x-auto no-scrollbar">
          {FILTER_CHIPS.map((chip) => {
            const active = chip.key === "purpose" ? filters.purpose : filters[chip.key];
            return (
              <button
                key={chip.key}
                onClick={() => setActiveSheet(chip.key)}
                className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border transition-colors ${
                  active
                    ? "bg-orange-600 text-white border-orange-600"
                    : "bg-white text-gray-700 border-gray-200"
                }`}
              >
                <span>{chip.icon} {chip.label}</span>
                {active ? (
                  <span
                    onClick={(e) => { e.stopPropagation(); setFilters(f => ({ ...f, [chip.key]: chip.key === "purpose" ? "" : chip.key === "categories" ? [] : null })); }}
                    className="ml-1 flex items-center"
                  >
                    <X size={12} />
                  </span>
                ) : (
                  <ChevronDown size={12} />
                )}
              </button>
            );
          })}
          <button
            onClick={() => setActiveSheet("more")}
            className="flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold border bg-white text-gray-700 border-gray-200"
          >
            <SlidersHorizontal size={12} /> More
          </button>
        </div>

        <div className="flex items-center justify-between px-4 pb-2">
          <span className="text-[13px] text-gray-500">{MOCK_PROPERTIES.length.toLocaleString()} Properties</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveSheet("sort")}
              className="flex items-center gap-1 text-xs text-gray-600 font-semibold"
            >
              <ArrowUpDown size={14} />
              {SORT_LABELS[sort]}
            </button>
            <div className="flex gap-1 ml-2">
              <button
                onClick={() => setViewMode("grid")}
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${viewMode === "grid" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}
              >
                <Grid size={14} />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`w-7 h-7 flex items-center justify-center rounded-lg transition-colors ${viewMode === "list" ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-500"}`}
              >
                <List size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {viewMode === "grid" ? (
          <div className="px-4 pt-3 space-y-3">
            {displayedProps.map((p) => (
              <MobilePropertyCard key={p.id} property={p} variant="vertical" />
            ))}
          </div>
        ) : (
          <div className="pt-2">
            {displayedProps.map((p) => (
              <div key={p.id} className="px-4 py-2 border-b border-gray-100">
                <MobilePropertyCard property={p} variant="horizontal" />
              </div>
            ))}
          </div>
        )}

        <div ref={loaderRef} className="px-4 py-3">
          {loading && (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-xl overflow-hidden border border-gray-100 animate-pulse">
                  <div className="h-44 bg-gray-200" />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3" />
                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <PriceFilterSheet
        open={activeSheet === "price"}
        onClose={() => setActiveSheet(null)}
        value={filters.priceMin && filters.priceMax ? { min: filters.priceMin, max: filters.priceMax } : null}
        onApply={(v) => { setFilters(f => ({ ...f, priceMin: v?.min || "", priceMax: v?.max || "" })); setActiveSheet(null); }}
      />
      <BedsFilterSheet
        open={activeSheet === "beds"}
        onClose={() => setActiveSheet(null)}
        value={filters.beds}
        onApply={(v) => { setFilters(f => ({ ...f, beds: v })); setActiveSheet(null); }}
      />
      <LocationFilterSheet
        open={activeSheet === "location"}
        onClose={() => setActiveSheet(null)}
        value={filters.city ? { city: filters.city, district: filters.district } : null}
        onApply={(v) => { setFilters(f => ({ ...f, city: v?.city || "", district: v?.district || "" })); setActiveSheet(null); }}
      />
      <CategoryFilterSheet
        open={activeSheet === "category"}
        onClose={() => setActiveSheet(null)}
        value={filters.categories}
        onApply={(v) => { setFilters(f => ({ ...f, categories: v || [] })); setActiveSheet(null); }}
      />
      <MoreFiltersSheet
        open={activeSheet === "more"}
        onClose={() => setActiveSheet(null)}
        value={filters}
        onApply={(v) => { setFilters(v); setActiveSheet(null); }}
        onReset={() => { setFilters({ purpose: "", categories: [], suitableFor: [], country: "", province: "", city: "", district: "", area: "", priceMin: "", priceMax: "", currency: "USD", sizeMin: "", sizeMax: "", sizeUnit: "SqM", beds: "", baths: "", amenities: [], finishing: [], yearFrom: "", yearTo: "" }); }}
      />
      <SortSheet
        open={activeSheet === "sort"}
        onClose={() => setActiveSheet(null)}
        value={sort}
        onChange={(v) => { setSort(v); setActiveSheet(null); }}
        options={SORT_OPTIONS}
      />
    </div>
  );
}