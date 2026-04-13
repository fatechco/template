import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const ROOM_TABS = [
  { value: "", label: "All" },
  { value: "bathroom", label: "🛁 Bathrooms" },
  { value: "kitchen", label: "🍳 Kitchens" },
  { value: "living_room", label: "🛋️ Living Rooms" },
  { value: "bedroom", label: "🛏 Bedrooms" },
  { value: "outdoor", label: "🌿 Outdoor" },
  { value: "office", label: "🖥 Office" },
  { value: "kids_room", label: "🧒 Kids Room" },
];

const STYLES = [
  { value: "", label: "All Styles" },
  { value: "modern", label: "Modern" },
  { value: "classic", label: "Classic" },
  { value: "bohemian", label: "Boho" },
  { value: "industrial", label: "Industrial" },
  { value: "scandinavian", label: "Scandinavian" },
];

const BUDGETS = [
  { value: "", label: "All Budgets" },
  { value: "economy", label: "💚 Economy" },
  { value: "standard", label: "💛 Standard" },
  { value: "premium", label: "🔵 Premium" },
  { value: "luxury", label: "💎 Luxury" },
];

const SORTS = [
  { value: "popular", label: "Most Popular" },
  { value: "newest", label: "Newest" },
  { value: "price_asc", label: "Price Low–High" },
];

const BUDGET_BADGES = {
  economy: { label: "💚 Economy", bg: "bg-green-500" },
  standard: { label: "💛 Standard", bg: "bg-yellow-400" },
  premium: { label: "🔵 Premium", bg: "bg-blue-500" },
  luxury: { label: "💎 Luxury", bg: "bg-purple-700" },
};

const ROOM_LABELS = {
  bathroom: "🛁 Bathroom", kitchen: "🍳 Kitchen", living_room: "🛋️ Living Room",
  bedroom: "🛏 Bedroom", outdoor: "🌿 Outdoor", office: "🖥 Office", kids_room: "🧒 Kids Room",
};

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
  "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
  "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&q=80",
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
  "https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80",
];

function calcDemoPrice(items) {
  const floor = 3 * 2;
  const netWall = (2*3*2.8 + 2*2*2.8) - 1.6 - 1.4;
  let total = 0;
  for (const item of (items || [])) {
    if (item.isOptional) continue;
    const cov = item.coveragePerUnit || 1;
    let base = 0;
    switch (item.calculationRule) {
      case "floor_sqm": base = floor / cov; break;
      case "wall_sqm": base = netWall / cov; break;
      case "fixed_quantity": base = item.fixedQuantity || 1; break;
      case "linear_meter": base = (2*(3+2)) / cov; break;
      default: base = 1;
    }
    const qty = Math.ceil(base * (1 + (item.wasteMarginPercent || 10)/100));
    total += qty * (item.productPriceEGP || 0);
  }
  return total;
}

function KemeKitCard({ kit, items, index }) {
  const [hovered, setHovered] = useState(false);
  const badge = BUDGET_BADGES[kit.budgetTier];
  const demoPrice = calcDemoPrice(items);
  const imgSrc = kit.heroImageUrl || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];
  const productCount = (items || []).length;
  const imgHeight = index % 3 === 0 ? 280 : index % 3 === 1 ? 220 : 260;

  return (
    <div
      className="bg-white rounded-[20px] overflow-hidden mb-5 cursor-pointer group"
      style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: imgHeight }}>
        <img
          src={imgSrc}
          alt={kit.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Top badges */}
        <div className="absolute top-3 left-3 right-3 flex items-start justify-between gap-2">
          {kit.isEditorsPick && (
            <span className="bg-yellow-400 text-yellow-900 text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm">
              ⭐ Editor's Pick
            </span>
          )}
          {badge && (
            <span className={`${badge.bg} text-white text-[10px] font-black px-2.5 py-1 rounded-full shadow-sm ml-auto`}>
              {badge.label}
            </span>
          )}
        </div>
        {/* Hover overlay */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-300 ${hovered ? "opacity-100" : "opacity-0"}`}
          style={{ background: "rgba(10,22,40,0.55)" }}>
          <Link
            to={`/kemetro/kemekits/${kit.slug}`}
            className="bg-white text-gray-900 font-black text-sm px-5 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
          >
            📐 Calculate For My Room
          </Link>
        </div>
      </div>
      {/* Body */}
      <div className="px-4 pt-3 pb-1">
        {kit.roomType && (
          <span className="text-[10px] font-bold border border-blue-200 text-blue-600 px-2 py-0.5 rounded-full">
            {ROOM_LABELS[kit.roomType] || kit.roomType}
          </span>
        )}
        <h3 className="font-black text-gray-900 text-sm leading-tight mt-1.5 line-clamp-2">{kit.title}</h3>
        <div className="flex items-center gap-1.5 mt-1.5">
          <div className="w-5 h-5 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-black text-[8px] flex-shrink-0">
            {(kit.creatorName || "D")[0].toUpperCase()}
          </div>
          <span className="text-gray-400 text-xs">By {kit.creatorName || "Designer"}</span>
        </div>
        <div className="text-gray-400 text-[11px] mt-1">
          {productCount} products · {(kit.totalCalculationsRun || 0).toLocaleString()}+ calculations
        </div>
        {demoPrice > 0 && (
          <p className="text-blue-600 font-bold text-xs mt-1">
            Materials from ~{demoPrice.toLocaleString()} EGP
          </p>
        )}
      </div>
      {/* CTA */}
      <div className="px-4 pb-4 pt-2">
        <Link
          to={`/kemetro/kemekits/${kit.slug}`}
          className="block w-full text-center border-2 border-blue-500 text-blue-600 font-bold text-sm py-2.5 rounded-[10px] hover:bg-blue-50 transition-colors"
        >
          📐 Calculate For My Room
        </Link>
      </div>
    </div>
  );
}

export default function KemeKitsHub() {
  const [kits, setKits] = useState([]);
  const [kitItems, setKitItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [roomFilter, setRoomFilter] = useState("");
  const [styleFilter, setStyleFilter] = useState("");
  const [budgetFilter, setBudgetFilter] = useState("");
  const [sort, setSort] = useState("popular");
  const [page, setPage] = useState(1);
  const PER_PAGE = 12;

  useEffect(() => {
    base44.entities.KemeKitTemplate.filter({ status: "active" }, "-totalCalculationsRun", 100)
      .then(async (templates) => {
        setKits(templates);
        // Load items for each kit (for price calc)
        const itemMap = {};
        await Promise.all(templates.slice(0, 20).map(async t => {
          const items = await base44.entities.KemeKitItem.filter({ templateId: t.id }, "displayOrder", 30).catch(() => []);
          itemMap[t.id] = items;
        }));
        setKitItems(itemMap);
      })
      .finally(() => setLoading(false));
  }, []);

  let filtered = kits
    .filter(k => !roomFilter || k.roomType === roomFilter)
    .filter(k => !styleFilter || k.styleCategory === styleFilter)
    .filter(k => !budgetFilter || k.budgetTier === budgetFilter);

  if (sort === "newest") filtered = [...filtered].sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
  if (sort === "popular") filtered = [...filtered].sort((a, b) => (b.totalCalculationsRun || 0) - (a.totalCalculationsRun || 0));

  const editorsPicks = filtered.filter(k => k.isEditorsPick);
  const displayed = filtered.slice(0, page * PER_PAGE);

  const totalCalcs = kits.reduce((s, k) => s + (k.totalCalculationsRun || 0), 0);
  const totalCarts = kits.reduce((s, k) => s + (k.totalCartsGenerated || 0), 0);

  // Split into 3 masonry columns
  const cols = [[], [], []];
  displayed.forEach((kit, i) => cols[i % 3].push({ kit, idx: i }));

  return (
    <div className="min-h-screen bg-white">
      <KemetroHeader />

      {/* Hero */}
      <div className="w-full flex flex-col items-center justify-center text-center px-4 py-16"
        style={{ background: "#0A1628", minHeight: 320 }}>
        <div className="text-5xl mb-4" style={{ animation: "pulse 2s infinite" }}>✨</div>
        <h1 className="text-white font-black mb-3" style={{ fontSize: 36 }}>KemeKits™ — Room-in-a-Box</h1>
        <p className="mb-8 max-w-xl" style={{ color: "rgba(255,255,255,0.8)", fontSize: 15, lineHeight: 1.7 }}>
          Curated designs by top Egyptian interior designers.<br />
          Enter your dimensions — get your exact shopping list.
        </p>
        <div className="flex flex-wrap justify-center gap-6 text-center">
          {[
            { val: totalCalcs.toLocaleString(), label: "Calculations Run" },
            { val: totalCarts.toLocaleString(), label: "Rooms Built" },
            { val: kits.length, label: "Designers' Kits" },
          ].map(s => (
            <div key={s.label}>
              <p className="text-white font-black text-2xl">{s.val}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.5)" }}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b border-gray-100">
        {/* Room Tabs */}
        <div className="flex gap-0 overflow-x-auto no-scrollbar border-b border-gray-100 px-4">
          {ROOM_TABS.map(tab => (
            <button
              key={tab.value}
              onClick={() => { setRoomFilter(tab.value); setPage(1); }}
              className={`flex-shrink-0 px-4 py-3 text-sm font-bold border-b-2 transition-all ${
                roomFilter === tab.value ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-800"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        {/* Filter row */}
        <div className="flex items-center justify-between px-4 py-2 gap-3 flex-wrap">
          <p className="text-xs text-gray-400 font-bold">{filtered.length} KemeKits available</p>
          <div className="flex items-center gap-2">
            {[
              { val: styleFilter, set: setStyleFilter, opts: STYLES, label: "Style" },
              { val: budgetFilter, set: setBudgetFilter, opts: BUDGETS, label: "Budget" },
              { val: sort, set: setSort, opts: SORTS, label: "Sort" },
            ].map(f => (
              <select
                key={f.label}
                value={f.val}
                onChange={e => { f.set(e.target.value); setPage(1); }}
                className="text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-400 bg-white text-gray-700 font-bold"
              >
                {f.opts.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Editor's Picks */}
        {editorsPicks.length > 0 && (
          <div className="mb-10">
            <h2 className="font-black text-gray-900 text-xl mb-1">⭐ Editor's Picks</h2>
            <p className="text-sm text-gray-500 mb-4">Curated by Kemedar's design team</p>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
              {editorsPicks.map((kit, i) => (
                <div key={kit.id} className="flex-shrink-0 w-64">
                  <div className="bg-white rounded-[20px] overflow-hidden" style={{ boxShadow: "0 4px 20px rgba(0,0,0,0.1)" }}>
                    <div className="relative" style={{ height: 180 }}>
                      <img src={kit.heroImageUrl || FALLBACK_IMAGES[i % FALLBACK_IMAGES.length]} alt={kit.title} className="w-full h-full object-cover" />
                      <span className="absolute top-3 left-3 bg-yellow-400 text-yellow-900 text-[10px] font-black px-2.5 py-1 rounded-full">⭐ Editor's Pick</span>
                    </div>
                    <div className="p-3">
                      <p className="font-black text-gray-900 text-sm line-clamp-2">{kit.title}</p>
                      <Link to={`/kemetro/kemekits/${kit.slug}`} className="block mt-2 text-center text-xs font-bold border border-blue-500 text-blue-600 py-2 rounded-lg hover:bg-blue-50">
                        Calculate →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Masonry Grid */}
        {loading ? (
          <div className="grid grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[20px] bg-gray-100 animate-pulse" style={{ height: [280, 220, 260][i % 3] }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🎨</div>
            <p className="text-gray-500 font-bold text-lg">No KemeKits found</p>
            <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 items-start">
              {cols.map((col, ci) => (
                <div key={ci} className="flex flex-col">
                  {col.map(({ kit, idx }) => (
                    <KemeKitCard
                      key={kit.id}
                      kit={kit}
                      items={kitItems[kit.id] || []}
                      index={idx}
                    />
                  ))}
                </div>
              ))}
            </div>

            {displayed.length < filtered.length && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setPage(p => p + 1)}
                  className="border-2 border-blue-500 text-blue-600 font-bold px-8 py-3 rounded-xl hover:bg-blue-50 transition-colors"
                >
                  Load More KemeKits
                </button>
              </div>
            )}
          </>
        )}

        {/* Designer CTA */}
        <div className="mt-16 rounded-[20px] flex flex-col sm:flex-row items-center justify-between gap-6 px-8 py-10"
          style={{ background: "#0A1628" }}>
          <div>
            <h3 className="text-white font-black text-xl mb-2">🎨 Are you an interior designer?</h3>
            <p className="text-sm" style={{ color: "rgba(255,255,255,0.75)" }}>
              Create your own KemeKit and earn Kemecoins from every material sale — automatically.
            </p>
          </div>
          <Link
            to="/kemework/pro/kemekits/create"
            className="flex-shrink-0 bg-white text-gray-900 font-black px-6 py-3 rounded-xl hover:bg-gray-100 transition-colors"
          >
            Start Creating →
          </Link>
        </div>
      </div>

      <KemetroFooter />
    </div>
  );
}