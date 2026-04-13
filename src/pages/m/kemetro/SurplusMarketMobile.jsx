import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Search, SlidersHorizontal, ChevronRight, MapPin } from "lucide-react";
import { base44 } from "@/api/base44Client";
import HamburgerMenu from "@/components/mobile/HamburgerMenu";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const CATEGORIES = [
  { icon: "🪵", label: "Wood" },
  { icon: "🧱", label: "Tiles" },
  { icon: "🎨", label: "Paint" },
  { icon: "🚪", label: "Doors" },
  { icon: "💡", label: "Fixtures" },
  { icon: "🔩", label: "Metal" },
  { icon: "🪟", label: "Glass" },
  { icon: "🛁", label: "Sanitary" },
];

const CONDITIONS = ["All", "brand_new_excess", "open_box", "lightly_used", "salvaged"];
const COND_LABELS = {
  All: "All",
  brand_new_excess: "✨ Brand New",
  open_box: "📦 Open Box",
  lightly_used: "👍 Lightly Used",
  salvaged: "♻️ Salvaged",
};

const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price ↑" },
  { value: "discount", label: "% Off" },
  { value: "eco", label: "Eco Impact" },
];

function applyFilters(items, filters) {
  let out = [...items];
  if (filters.condition && filters.condition !== "All") out = out.filter(i => i.condition === filters.condition);
  if (filters.search) out = out.filter(i => (i.title || "").toLowerCase().includes(filters.search.toLowerCase()));
  if (filters.sort === "price_asc") out.sort((a, b) => a.surplusPriceEGP - b.surplusPriceEGP);
  else if (filters.sort === "discount") out.sort((a, b) => (b.discountPercent || 0) - (a.discountPercent || 0));
  else if (filters.sort === "eco") out.sort((a, b) => (b.estimatedWeightKg || 0) - (a.estimatedWeightKg || 0));
  else out.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  return out;
}

function MobileSurplusCard({ item }) {
  const image = item.primaryImageUrl || (item.images && item.images[0]) || "https://images.unsplash.com/photo-1558618047-f4e90f6b3b44?w=400&q=80";
  const isReserved = item.status === "reserved";
  const isSold = item.status === "sold";
  const isActive = item.status === "active";
  const disc = item.discountPercent || 0;

  return (
    <Link to={`/m/kemetro/surplus/${item.id}`} className="block bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm" style={{ borderLeft: "4px solid #16A34A" }}>
      <div className="relative h-36 overflow-hidden">
        <img src={image} alt={item.title} className="w-full h-full object-cover" />
        {disc >= 40 && (
          <span className={`absolute top-2 left-2 text-white text-[10px] font-black px-2 py-0.5 rounded-full ${disc >= 60 ? "bg-red-600" : "bg-green-600"}`}>
            {disc >= 60 ? "🔥" : "💚"} {Math.round(disc)}% OFF
          </span>
        )}
        {isSold && (
          <div className="absolute inset-0 bg-gray-900/40 flex items-center justify-center">
            <span className="bg-white text-gray-700 font-black text-xs px-3 py-1 rounded-full">✅ Sold</span>
          </div>
        )}
        {isReserved && !isSold && (
          <div className="absolute inset-0 bg-yellow-900/30 flex items-center justify-center">
            <span className="bg-white text-yellow-700 font-black text-xs px-3 py-1 rounded-full">⏳ Reserved</span>
          </div>
        )}
      </div>
      <div className="p-3">
        <p className="font-black text-gray-900 text-sm line-clamp-1">{item.title}</p>
        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
          <MapPin size={9} className="text-green-600" />{item.addressText || item.cityId || "Cairo"} · 📦 {item.quantityAvailable} {item.unit}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="text-base font-black text-green-700">{Number(item.surplusPriceEGP || 0).toLocaleString()} EGP</p>
            {item.originalRetailPriceEGP && (
              <p className="text-[10px] text-gray-400 line-through">{Number(item.originalRetailPriceEGP).toLocaleString()} EGP</p>
            )}
          </div>
          {item.estimatedWeightKg > 0 && (
            <span className="text-[10px] bg-green-50 text-green-700 font-bold px-2 py-1 rounded-lg">🌍 {item.estimatedWeightKg} kg saved</span>
          )}
        </div>
      </div>
    </Link>
  );
}

export default function SurplusMarketMobile() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [esgStats, setEsgStats] = useState({ weightKg: 0, buyerSavingsEGP: 0, totalItems: 0 });
  const [filters, setFilters] = useState({ condition: "All", sort: "newest", search: "" });
  const [showFilters, setShowFilters] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  useEffect(() => {
    base44.entities.SurplusItem.filter({ status: "active" }, "-created_date", 100)
      .then(data => { setItems(data || []); setLoading(false); })
      .catch(() => setLoading(false));

    base44.entities.SurplusItem.filter({ status: "sold" }, "-created_date", 500)
      .then(all => {
        const weightKg = all.reduce((s, i) => s + (i.estimatedWeightKg || 0), 0);
        const savings = all.reduce((s, i) => s + Math.max(0, (i.originalRetailPriceEGP || 0) - (i.surplusPriceEGP || 0)), 0);
        return base44.entities.SurplusItem.filter({ status: "active" }, "-created_date", 500).then(active => {
          setEsgStats({ weightKg: Math.round(weightKg), buyerSavingsEGP: Math.round(savings), totalItems: active.length });
        });
      }).catch(() => {});
  }, []);

  const filtered = applyFilters(items, filters);
  const featured = filtered.filter(i => (i.discountPercent || 0) >= 50);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}

      {/* Hero */}
      <div className="relative overflow-hidden" style={{ minHeight: 220 }}>
        <div className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('https://images.unsplash.com/photo-1558618047-f4e90f6b3b44?w=1200&q=80')` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-[#052e16]/90 via-[#14532d]/80 to-[#052e16]/70" />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#16A34A] via-[#16A34A]/50 to-transparent" />

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 w-9 h-9 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>

        {/* Hamburger */}
        <button onClick={() => setMenuOpen(true)}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex flex-col items-center justify-center gap-1">
          <span className="w-4 h-0.5 bg-white rounded" />
          <span className="w-4 h-0.5 bg-white rounded" />
          <span className="w-4 h-0.5 bg-white rounded" />
        </button>

        <div className="relative z-10 px-4 pt-5 pb-6">
          <div className="inline-flex items-center gap-2 bg-green-500/20 border border-green-400/40 rounded-full px-3 py-1 mb-3">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
            <span className="text-green-300 text-[10px] font-bold tracking-wide">KEMETRO® SURPLUS MARKET</span>
          </div>
          <h1 className="text-2xl font-black text-white leading-tight mb-1">
            Buy Surplus Materials.<br />
            <span className="text-green-400">Save & Build Green.</span>
          </h1>
          <p className="text-gray-300 text-xs leading-relaxed mb-4">
            Up to 80% off leftover finishing materials. Reduce waste, save money, build sustainably.
          </p>

          {/* ESG stats */}
          <div className="flex items-center gap-4 mb-5">
            {[
              { v: `${(esgStats.weightKg / 1000).toFixed(1)}t`, l: "Waste Saved" },
              { v: `${Math.round(esgStats.buyerSavingsEGP / 1000)}K EGP`, l: "Buyer Savings" },
              { v: esgStats.totalItems || "0", l: "Items Listed" },
            ].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-base font-black text-green-400">{s.v}</p>
                <p className="text-[10px] text-gray-400">{s.l}</p>
              </div>
            ))}
          </div>

          {/* Search */}
          <div className="bg-white rounded-xl flex items-center gap-2 px-3 py-2.5">
            <Search size={15} className="text-gray-400 flex-shrink-0" />
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search surplus materials..."
              className="flex-1 text-sm outline-none text-gray-800 placeholder-gray-400"
              onKeyDown={e => e.key === "Enter" && setFilters(f => ({ ...f, search: searchInput }))}
            />
          </div>

          {/* CTAs */}
          <div className="flex gap-2 mt-3">
            <button onClick={() => navigate("/kemetro/surplus/add")}
              className="flex-1 flex items-center justify-center gap-1.5 text-white font-bold text-xs py-2.5 rounded-xl"
              style={{ background: "#16A34A" }}>
              ♻️ Sell My Leftovers
            </button>
            <button onClick={() => navigate("/m/kemetro/surplus/my-reservations")}
              className="flex-1 flex items-center justify-center gap-1.5 border-2 border-white/50 text-white font-bold text-xs py-2.5 rounded-xl">
              📋 My Reservations
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-5 pt-4">

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {CATEGORIES.map(c => (
            <button key={c.label}
              onClick={() => setFilters(f => ({ ...f, search: c.label }))}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-xs font-bold text-gray-700 shadow-sm">
              {c.icon} {c.label}
            </button>
          ))}
        </div>

        {/* Filter row */}
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5 flex-1 overflow-x-auto no-scrollbar">
            {CONDITIONS.map(c => (
              <button key={c}
                onClick={() => setFilters(f => ({ ...f, condition: c }))}
                className="flex-shrink-0 px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors"
                style={{ background: filters.condition === c ? "#16A34A" : "#f3f4f6", color: filters.condition === c ? "#fff" : "#374151" }}>
                {COND_LABELS[c]}
              </button>
            ))}
          </div>
          <button onClick={() => setShowFilters(!showFilters)}
            className="flex-shrink-0 w-9 h-9 bg-white border border-gray-200 rounded-xl flex items-center justify-center shadow-sm">
            <SlidersHorizontal size={16} className="text-gray-600" />
          </button>
        </div>

        {/* Sort row */}
        {showFilters && (
          <div className="bg-white rounded-2xl border border-gray-100 p-3 flex gap-2 flex-wrap">
            <p className="text-xs font-bold text-gray-500 w-full mb-1">Sort by:</p>
            {SORT_OPTIONS.map(opt => (
              <button key={opt.value}
                onClick={() => setFilters(f => ({ ...f, sort: opt.value }))}
                className="px-3 py-1.5 rounded-full text-[11px] font-bold transition-colors"
                style={{ background: filters.sort === opt.value ? "#16A34A" : "#f3f4f6", color: filters.sort === opt.value ? "#fff" : "#374151" }}>
                {opt.label}
              </button>
            ))}
          </div>
        )}

        {/* 🔥 Featured / Going Fast */}
        {featured.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-black text-gray-900 text-base">🔥 Going Fast</h2>
              <span className="text-xs text-gray-400">50%+ off</span>
            </div>
            <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
              {featured.slice(0, 6).map(item => (
                <div key={item.id} className="flex-shrink-0" style={{ width: "72vw", maxWidth: 260 }}>
                  <MobileSurplusCard item={item} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All listings */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-black text-gray-900 text-base">All Listings</h2>
            <span className="text-xs text-gray-400">{filtered.length} items</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 gap-3">
              {[...Array(6)].map((_, i) => <div key={i} className="rounded-2xl bg-gray-100 animate-pulse h-56" />)}
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-3">🌿</div>
              <p className="font-black text-gray-700 mb-1">No items found</p>
              <p className="text-sm text-gray-400 mb-5">Be the first to list your leftover materials!</p>
              <Link to="/kemetro/surplus/add"
                className="inline-block px-6 py-3 rounded-2xl font-bold text-white text-sm"
                style={{ background: "#16A34A" }}>
                ♻️ List Your First Item
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filtered.map(item => <MobileSurplusCard key={item.id} item={item} />)}
            </div>
          )}
        </div>

        {/* Eco Banner */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #052e16, #14532d)" }}>
          <div className="p-5 text-center">
            <div className="text-4xl mb-2">🌍</div>
            <h3 className="text-lg font-black text-white mb-1">Build Sustainably</h3>
            <p className="text-green-300 text-xs mb-4 leading-relaxed">
              Every purchase diverts waste from landfill and saves you money. Win-win for your wallet and the planet.
            </p>
            <Link to="/kemetro/surplus/add"
              className="inline-block font-black text-sm px-6 py-3 rounded-2xl"
              style={{ background: "#16A34A", color: "#fff" }}>
              ♻️ List My Leftovers
            </Link>
          </div>
        </div>

      </div>

      <MobileBottomNav />
    </div>
  );
}