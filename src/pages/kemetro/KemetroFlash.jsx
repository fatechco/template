import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import FlashDealCard from "@/components/kemetro/flash/FlashDealCard";
import CompoundDealCard from "@/components/kemetro/flash/CompoundDealCard";
import ClearanceDealCard from "@/components/kemetro/flash/ClearanceDealCard";
import BundleDealCard from "@/components/kemetro/flash/BundleDealCard";
import FlashLiveCounter from "@/components/kemetro/flash/FlashLiveCounter";

const CATEGORY_FILTERS = [
  { id: "all", label: "All Categories" },
  { id: "my_area", label: "📍 My Area" },
  { id: "flooring", label: "🪨 Tiles" },
  { id: "paint", label: "🎨 Paint" },
  { id: "kitchen", label: "🍳 Kitchen" },
  { id: "electrical", label: "⚡ Electrical" },
  { id: "plumbing", label: "🔧 Plumbing" },
];

const MOCK_FLASH_DEALS = [
  {
    id: "fd1", dealType: "flash_sale", productName: "60×60 Porcelain Floor Tiles — Matte Grey",
    category: "flooring", originalPrice: 285, dealPrice: 185, discountPercent: 35,
    unit: "m²", stockRemaining: 320, totalStockAvailable: 1000, minimumOrderQty: 10,
    dealEndsAt: new Date(Date.now() + 11 * 3600000).toISOString(),
    dealStartsAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    productImages: ["https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&q=80"],
    specifications: { brand: "Cleopatra", grade: "Grade A", dimensions: "60×60cm" },
    sellerName: "Cairo Tiles Direct", sellerRating: 4.8,
    totalOrders: 47, status: "active", availableNationwide: true, deliveryLeadDays: 3,
    isBestSeller: true
  },
  {
    id: "fd2", dealType: "flash_sale", productName: "Premium Interior Paint — White Matte 18L",
    category: "paint", originalPrice: 650, dealPrice: 420, discountPercent: 35,
    unit: "can", stockRemaining: 180, totalStockAvailable: 500, minimumOrderQty: 2,
    dealEndsAt: new Date(Date.now() + 1.5 * 3600000).toISOString(),
    dealStartsAt: new Date(Date.now() - 22 * 3600000).toISOString(),
    productImages: ["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"],
    specifications: { brand: "Sayerlack", coverage: "10-12 m²/L" },
    sellerName: "Paints Egypt", sellerRating: 4.6,
    totalOrders: 89, status: "active", availableNationwide: false, deliveryLeadDays: 2
  },
  {
    id: "fd3", dealType: "bulk_clearance", productName: "Bathroom Wall Tiles 30×60 — Marble Effect",
    category: "tiles", originalPrice: 195, dealPrice: 110, discountPercent: 44,
    unit: "m²", stockRemaining: 1200, totalStockAvailable: 1200, minimumOrderQty: 30,
    dealEndsAt: new Date(Date.now() + 58 * 3600000).toISOString(),
    dealStartsAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    productImages: ["https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=400&q=80"],
    specifications: { brand: "Portobello", grade: "Grade A", dimensions: "30×60cm" },
    sellerName: "Marble House Egypt", sellerRating: 4.5,
    totalOrders: 12, status: "active", availableNationwide: true, deliveryLeadDays: 5
  },
  {
    id: "fd4", dealType: "flash_sale", productName: "Tile Adhesive 25kg — C2 Grade",
    category: "adhesives", originalPrice: 165, dealPrice: 95, discountPercent: 42,
    unit: "bag", stockRemaining: 450, totalStockAvailable: 600, minimumOrderQty: 5,
    dealEndsAt: new Date(Date.now() + 36 * 3600000).toISOString(),
    dealStartsAt: new Date(Date.now() - 1 * 3600000).toISOString(),
    productImages: ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80"],
    specifications: { brand: "Mapei", grade: "C2", coverage: "4.5kg/m²" },
    sellerName: "Mapei Egypt", sellerRating: 4.9,
    totalOrders: 134, status: "active", availableNationwide: true, deliveryLeadDays: 1,
    isNewArrival: false, isBestSeller: true
  },
];

const MOCK_COMPOUND_DEALS = [
  {
    id: "cd1", productName: "60×60 Porcelain Floor Tiles — Matte Grey", productNameAr: "بلاط أرضي بورسلان 60×60",
    compoundName: "Silver Compound", cityName: "New Cairo", districtName: "5th Settlement",
    retailPricePerUnit: 285, unit: "m²",
    priceTiers: [
      { minParticipants: 3, pricePerUnit: 240, discountPercent: 16, label: "Starter" },
      { minParticipants: 8, pricePerUnit: 218, discountPercent: 23, label: "Better" },
      { minParticipants: 15, pricePerUnit: 198, discountPercent: 31, label: "Best" },
    ],
    currentTierIndex: 1, currentParticipants: 11, minParticipants: 5, suggestedQtyPerUnit: 80,
    currentTotalQty: 920, dealClosingAt: new Date(Date.now() + 4 * 24 * 3600000).toISOString(),
    status: "forming", productImage: "https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&q=80"
  },
  {
    id: "cd2", productName: "Premium Interior Paint 18L Buckets", productNameAr: "دهانات داخلية ممتازة",
    compoundName: "Green Valley", cityName: "Sheikh Zayed", districtName: "Beverly Hills",
    retailPricePerUnit: 650, unit: "can",
    priceTiers: [
      { minParticipants: 4, pricePerUnit: 560, discountPercent: 14, label: "Starter" },
      { minParticipants: 10, pricePerUnit: 510, discountPercent: 22, label: "Better" },
      { minParticipants: 20, pricePerUnit: 468, discountPercent: 28, label: "Best" },
    ],
    currentTierIndex: 0, currentParticipants: 6, minParticipants: 4, suggestedQtyPerUnit: 12,
    currentTotalQty: 72, dealClosingAt: new Date(Date.now() + 6 * 24 * 3600000).toISOString(),
    status: "forming", productImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80"
  },
];

const MOCK_BUNDLE_DEALS = [
  {
    id: "bd1", productName: "Complete Living Room Flooring Kit",
    bundleItems: [
      { name: "60×60 Porcelain Tiles", qty: 50, unit: "m²", price: 9250 },
      { name: "C2 Tile Adhesive 25kg", qty: 12, unit: "bags", price: 1140 },
      { name: "Tile Grout 5kg", qty: 8, unit: "bags", price: 440 },
      { name: "Edge Trim Aluminum", qty: 40, unit: "m", price: 800 },
    ],
    originalPrice: 11630, dealPrice: 8900, discountPercent: 23,
    productImages: ["https://images.unsplash.com/photo-1567767292278-a4f21aa2d36e?w=400&q=80"],
    sellerName: "TileWorld Egypt", sellerRating: 4.7,
    status: "active", dealEndsAt: new Date(Date.now() + 72 * 3600000).toISOString()
  },
];

export default function KemetroFlash() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("flash");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [flashDeals, setFlashDeals] = useState([]);
  const [compoundDeals, setCompoundDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeals();
    const interval = setInterval(loadDeals, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadDeals = async () => {
    try {
      const [fd, cd] = await Promise.all([
        base44.entities.FlashDeal.filter({ status: "active" }),
        base44.entities.CompoundDeal.filter({ status: "forming" }),
      ]);
      setFlashDeals(fd.length > 0 ? fd : MOCK_FLASH_DEALS);
      setCompoundDeals(cd.length > 0 ? cd : MOCK_COMPOUND_DEALS);
    } catch {
      setFlashDeals(MOCK_FLASH_DEALS);
      setCompoundDeals(MOCK_COMPOUND_DEALS);
    } finally {
      setLoading(false);
    }
  };

  const flashOnly = flashDeals.filter(d => d.dealType === "flash_sale" || d.dealType === "new_arrival" || d.dealType === "seasonal_offer");
  const clearance = flashDeals.filter(d => d.dealType === "bulk_clearance");
  const bundles = [...MOCK_BUNDLE_DEALS];

  const filteredFlash = categoryFilter === "all"
    ? flashOnly
    : flashOnly.filter(d => d.category === categoryFilter || d.category?.includes(categoryFilter));

  const liveCount = flashDeals.filter(d => d.status === "active").length;
  const groupCount = compoundDeals.filter(d => d.status === "forming").length;
  const endingSoon = flashDeals.filter(d => {
    const hrs = (new Date(d.dealEndsAt) - Date.now()) / 3600000;
    return hrs > 0 && hrs < 12;
  }).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a0a00 0%, #7c1c00 40%, #c0392b 100%)", minHeight: 340 }}>
        {/* Animated particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="absolute text-orange-400 opacity-20 animate-bounce" style={{ left: `${(i * 8.3) % 100}%`, top: `${20 + (i * 13) % 60}%`, fontSize: `${16 + (i % 3) * 8}px`, animationDelay: `${i * 0.3}s`, animationDuration: `${2 + i * 0.2}s` }}>⚡</div>
          ))}
        </div>
        <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-orange-300 font-bold text-sm px-4 py-1.5 rounded-full mb-4 tracking-widest uppercase backdrop-blur-sm">
            ⚡ KEMETRO FLASH™
          </div>
          <h1 className="text-5xl font-black text-white mb-3 leading-tight">
            Wholesale Prices.<br />
            <span className="text-orange-400">Limited Time. Your Area.</span>
          </h1>
          <p className="text-xl text-orange-100 mb-6">Flash deals, group buys & bulk clearance — disrupting material pricing</p>

          <FlashLiveCounter liveDeals={liveCount} groupBuys={groupCount} endingSoon={endingSoon} />

          {/* Category filter chips */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {CATEGORY_FILTERS.map(f => (
              <button key={f.id} onClick={() => { setCategoryFilter(f.id); setActiveTab("flash"); }}
                className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${categoryFilter === f.id ? "bg-orange-500 text-white" : "bg-white/15 text-white border border-white/30 hover:bg-white/25"}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex gap-0 overflow-x-auto no-scrollbar">
          {[
            { id: "flash", label: `⚡ Flash Deals`, count: flashOnly.length },
            { id: "compound", label: `🏘 Group Buys`, count: compoundDeals.length },
            { id: "clearance", label: `📦 Clearance`, count: clearance.length },
            { id: "bundles", label: `🎁 Bundles`, count: bundles.length },
          ].map(t => (
            <button key={t.id} onClick={() => setActiveTab(t.id)}
              className={`flex items-center gap-2 px-5 py-3.5 text-sm font-bold whitespace-nowrap border-b-2 transition-all ${activeTab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-800"}`}>
              {t.label}
              <span className={`text-xs px-1.5 py-0.5 rounded-full font-black ${activeTab === t.id ? "bg-orange-100 text-orange-600" : "bg-gray-100 text-gray-500"}`}>{t.count}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">

        {/* FLASH DEALS TAB */}
        {activeTab === "flash" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900">⚡ Flash Deals</h2>
                <p className="text-sm text-gray-500">Limited time — ends when stock runs out</p>
              </div>
              <div className="flex gap-2 flex-wrap justify-end">
                {["Ending Soon", "Best Discount", "Near Me"].map(s => (
                  <button key={s} className="text-xs border border-gray-200 text-gray-600 px-3 py-1 rounded-full hover:border-orange-400 hover:text-orange-600 transition-colors">{s}</button>
                ))}
              </div>
            </div>
            {filteredFlash.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-3">⚡</p>
                <p className="font-bold text-lg">No flash deals in this category right now</p>
                <p className="text-sm">Check back soon — new deals launch daily</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredFlash.map(deal => <FlashDealCard key={deal.id} deal={deal} />)}
              </div>
            )}
          </div>
        )}

        {/* COMPOUND DEALS TAB */}
        {activeTab === "compound" && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-2xl font-black text-gray-900">🏘 Compound Group Buys</h2>
                <p className="text-sm text-gray-500">Join neighbors — buy wholesale</p>
              </div>
              <button className="flex items-center gap-1 text-sm text-teal-600 border border-teal-200 px-3 py-1.5 rounded-full hover:bg-teal-50 transition-colors">
                📍 Set My Location
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {compoundDeals.map(deal => <CompoundDealCard key={deal.id} deal={deal} onJoin={() => navigate(`/kemetro/flash/compound/${deal.id}`)} />)}
            </div>
            {compoundDeals.length === 0 && (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-3">🏘</p>
                <p className="font-bold text-lg">No group buys in your area yet</p>
                <Link to="/kemetro/flash/compound/new" className="mt-4 inline-block bg-teal-500 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-teal-600 transition-colors">+ Start a Group Buy</Link>
              </div>
            )}
          </div>
        )}

        {/* CLEARANCE TAB */}
        {activeTab === "clearance" && (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-black text-gray-900">📦 Bulk Clearance</h2>
              <p className="text-sm text-gray-500">Excess stock — massive savings</p>
            </div>
            {clearance.length === 0 ? (
              <div className="text-center py-16 text-gray-400">
                <p className="text-5xl mb-3">📦</p>
                <p className="font-bold">No clearance deals right now</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {clearance.map(deal => <ClearanceDealCard key={deal.id} deal={deal} />)}
              </div>
            )}
          </div>
        )}

        {/* BUNDLES TAB */}
        {activeTab === "bundles" && (
          <div>
            <div className="mb-4">
              <h2 className="text-2xl font-black text-gray-900">🎁 Smart Bundles</h2>
              <p className="text-sm text-gray-500">Everything for one room — bundled</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {bundles.map(deal => <BundleDealCard key={deal.id} deal={deal} />)}
            </div>
          </div>
        )}

        {/* SELLER CTA */}
        <div className="mt-12 bg-gradient-to-r from-gray-900 to-gray-800 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-black text-white mb-2">📦 Are you a seller?</h3>
          <p className="text-gray-400 mb-6">Clear excess stock instantly or run time-limited flash deals to boost sales</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to="/kemetro/seller/flash/create" className="bg-orange-500 hover:bg-orange-400 text-white font-black px-6 py-3 rounded-xl transition-colors">⚡ Create Flash Deal</Link>
            <Link to="/kemetro/seller/flash" className="border-2 border-white/20 text-white font-bold px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">📊 My Flash Dashboard</Link>
          </div>
        </div>
      </div>
    </div>
  );
}