import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SurplusItemCard from "@/components/surplus/SurplusItemCard";
import SurplusFilterBar from "@/components/surplus/SurplusFilterBar";
import SurplusMapView from "@/components/surplus/SurplusMapView";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const SORT_OPTIONS = [
  { value: "newest",     label: "Newest" },
  { value: "price_asc",  label: "Price Low-High" },
  { value: "discount",   label: "% Discount" },
  { value: "nearest",    label: "Nearest" },
  { value: "eco",        label: "Most Eco Impact" },
];

export default function SurplusMarketHub() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ category: "", condition: "", price: "", sort: "newest", radiusKm: 15 });
  const [mapView, setMapView] = useState(false);
  const [esgStats, setEsgStats] = useState({ weightKg: 0, buyerSavingsEGP: 0, totalItems: 0 });
  const filterBarRef = useRef(null);

  useEffect(() => {
    loadItems();
    loadEsgStats();
  }, []);

  const loadItems = async () => {
    setLoading(true);
    const data = await base44.entities.SurplusItem.filter({ status: "active" }, "-created_date", 100);
    setItems(data || []);
    setLoading(false);
  };

  const loadEsgStats = async () => {
    const all = await base44.entities.SurplusItem.filter({ status: "sold" }, "-created_date", 500).catch(() => []);
    const weightKg = all.reduce((s, i) => s + (i.estimatedWeightKg || 0), 0);
    const buyerSavingsEGP = all.reduce((s, i) => {
      const retail = i.originalRetailPriceEGP || 0;
      const sold = i.surplusPriceEGP || 0;
      return s + Math.max(0, retail - sold);
    }, 0);
    const activeAll = await base44.entities.SurplusItem.filter({ status: "active" }, "-created_date", 500).catch(() => []);
    setEsgStats({ weightKg: Math.round(weightKg), buyerSavingsEGP: Math.round(buyerSavingsEGP), totalItems: activeAll.length });
  };

  const filtered = applyFilters(items, filters);
  const featured = filtered.filter(i => {
    const created = new Date(i.created_date);
    const age = (Date.now() - created) / 36e5;
    const disc = i.discountPercent || 0;
    return disc >= 50 && age <= 24;
  });

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <KemetroHeader />

      {/* Hero */}
      <div className="relative" style={{ background: "linear-gradient(135deg, #F0FDF4, #DCFCE7)", minHeight: 280 }}>
        {/* Sell CTA top-right */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-8">
          <Link to="/kemetro/surplus/add"
            className="inline-flex items-center gap-2 border-2 border-green-600 text-green-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-green-600 hover:text-white transition-all">
            ♻️ Sell Your Leftovers →
          </Link>
        </div>

        <div className="flex flex-col items-center justify-center text-center px-4 py-12 min-h-[280px]">
          <div className="text-5xl mb-3">🌿</div>
          <h1 className="text-3xl sm:text-4xl font-black mb-3" style={{ color: "#14532D" }}>Kemetro Surplus Market</h1>
          <p className="text-base text-gray-500 max-w-lg mb-8">
            Buy leftover finishing materials at up to 80% off. Reduce waste, save money, build sustainably.
          </p>

          {/* ESG Stats strip */}
          <div className="flex items-center gap-0 divide-x divide-green-300 bg-white/70 backdrop-blur-sm rounded-2xl px-6 py-3 border border-green-200 shadow-sm">
            {[
              { icon: "🌍", num: `${(esgStats.weightKg / 1000).toFixed(1)}t`, label: "waste saved this month" },
              { icon: "💰", num: `${Math.round(esgStats.buyerSavingsEGP / 1000)}K EGP`, label: "saved by buyers" },
              { icon: "♻️", num: esgStats.totalItems.toLocaleString(), label: "items listed" },
            ].map((s, i) => (
              <div key={i} className="px-5 text-center">
                <p className="text-lg font-black" style={{ color: "#14532D" }}>{s.icon} {s.num}</p>
                <p className="text-xs text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sticky filter bar */}
      <div ref={filterBarRef} className="sticky top-0 z-30 bg-white shadow-sm border-b border-gray-100">
        <SurplusFilterBar
          filters={filters}
          setFilters={setFilters}
          mapView={mapView}
          setMapView={setMapView}
          resultCount={filtered.length}
          sortOptions={SORT_OPTIONS}
        />
      </div>

      {mapView ? (
        <div className="flex-1">
          <SurplusMapView items={filtered} />
        </div>
      ) : (
        <div className="max-w-[1400px] mx-auto px-4 py-6 w-full flex-1">

          {/* Featured deals */}
          {featured.length > 0 && (
            <section className="mb-10">
              <div className="mb-4">
                <h2 className="text-xl font-black text-gray-900">🔥 Going Fast Near You</h2>
                <p className="text-sm text-gray-500">Items with 50%+ discount added in the last 24 hours</p>
              </div>
              <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
                {featured.slice(0, 8).map(item => (
                  <div key={item.id} className="flex-shrink-0 w-64 lg:w-auto">
                    <SurplusItemCard item={item} featured />
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Main grid */}
          <section>
            <p className="text-sm text-gray-400 mb-4 font-semibold">{filtered.length} items near you</p>
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[...Array(9)].map((_, i) => (
                  <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-72" />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 text-center">
                <div className="text-6xl mb-4">🌿</div>
                <p className="text-xl font-black text-gray-700 mb-2">No surplus items found</p>
                <p className="text-gray-400 mb-6">Be the first to list your leftover materials!</p>
                <Link to="/kemetro/surplus/add"
                  className="px-6 py-3 rounded-2xl font-bold text-white text-sm"
                  style={{ background: "#16A34A" }}>
                  ♻️ List Your First Item
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(item => (
                  <SurplusItemCard key={item.id} item={item} />
                ))}
              </div>
            )}
          </section>
        </div>
      )}

      <KemetroFooter />
    </div>
  );
}

function applyFilters(items, filters) {
  let out = [...items];
  if (filters.category) out = out.filter(i => i.categoryId === filters.category || (i.title || "").toLowerCase().includes(filters.category.toLowerCase()));
  if (filters.condition) out = out.filter(i => i.condition === filters.condition);
  if (filters.price === "under500") out = out.filter(i => i.surplusPriceEGP < 500);
  if (filters.price === "500-2000") out = out.filter(i => i.surplusPriceEGP >= 500 && i.surplusPriceEGP <= 2000);
  if (filters.price === "2000-5000") out = out.filter(i => i.surplusPriceEGP > 2000 && i.surplusPriceEGP <= 5000);
  if (filters.sort === "price_asc") out.sort((a, b) => a.surplusPriceEGP - b.surplusPriceEGP);
  else if (filters.sort === "discount") out.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  else if (filters.sort === "eco") out.sort((a, b) => (b.estimatedWeightKg || 0) - (a.estimatedWeightKg || 0));
  else out.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  return out;
}