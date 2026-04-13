import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, ArrowLeft } from "lucide-react";
import HamburgerMenu from "@/components/mobile/HamburgerMenu";

const CATEGORIES = [
  { icon: "🛋️", label: "Furniture" },
  { icon: "💡", label: "Lighting" },
  { icon: "🪴", label: "Decor" },
  { icon: "🛏️", label: "Bedroom" },
  { icon: "🍳", label: "Kitchen" },
  { icon: "🚿", label: "Bathroom" },
  { icon: "🖥️", label: "Electronics" },
  { icon: "🏠", label: "Outdoor" },
];

const FLASH_DEALS = [
  { name: "LED Desk Lamp Modern", price: 45, original: 65, image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=200&q=70", off: 31 },
  { name: "Ergonomic Office Chair", price: 120, original: 150, image: "https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?w=200&q=70", off: 20 },
  { name: "Ceramic Wall Mirror Gold", price: 75, original: 95, image: "https://images.unsplash.com/photo-1618220179428-22790b461013?w=200&q=70", off: 21 },
  { name: "Velvet Accent Chair", price: 200, original: 280, image: "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=200&q=70", off: 29 },
];

const FEATURED_STORES = [
  { name: "HomeStyle Store", logo: "🏠", products: 148, rating: 4.9 },
  { name: "DecorPlus", logo: "🪴", products: 92, rating: 4.8 },
  { name: "TechGear Hub", logo: "🖥️", products: 213, rating: 4.7 },
  { name: "Cozy Living", logo: "🛋️", products: 76, rating: 5.0 },
];

const NEW_ARRIVALS = [
  { name: "Marble Coffee Table", price: 320, image: "https://images.unsplash.com/photo-1565791380713-1756b9a05343?w=200&q=70" },
  { name: "Pendant Light Cluster", price: 89, image: "https://images.unsplash.com/photo-1524484485831-a92ffc0de03f?w=200&q=70" },
  { name: "Boho Wall Art Set", price: 55, image: "https://images.unsplash.com/photo-1513519245088-0e12902e35ca?w=200&q=70" },
];

export default function KemetroMobileHome() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {menuOpen && <HamburgerMenu onClose={() => setMenuOpen(false)} />}

      {/* Hero Banner */}
      <div className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #1a3a6e 0%, #0e2454 100%)", minHeight: 200 }}>
        {/* Back & Hamburger buttons */}
        <button onClick={() => navigate(-1)}
          className="absolute top-4 left-4 z-20 w-9 h-9 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex items-center justify-center">
          <ArrowLeft size={18} className="text-white" />
        </button>
        <button onClick={() => setMenuOpen(true)}
          className="absolute top-4 right-4 z-20 w-9 h-9 bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl flex flex-col items-center justify-center gap-1">
          <span className="w-4 h-0.5 bg-white rounded" />
          <span className="w-4 h-0.5 bg-white rounded" />
          <span className="w-4 h-0.5 bg-white rounded" />
        </button>

        <div className="p-5 pb-8">
          <p className="text-xs font-black text-blue-300 uppercase tracking-widest mb-2">Kemetro®</p>
          <h1 className="text-[22px] font-black text-white leading-tight mb-2">Shop Everything<br />For Your Home</h1>
          <p className="text-blue-200 text-sm mb-5">Furniture, Decor, Electronics & More</p>
          <div className="flex gap-3">
            <button onClick={() => navigate("/m/find/product")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm bg-white text-gray-900">
              🛍️ Browse Products
            </button>
            <button onClick={() => navigate("/m/find/rfq")}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm border-2 border-white text-white">
              📋 Request Quote
            </button>
          </div>
        </div>
      </div>

      <div className="px-4 space-y-5 pt-4">

        {/* Search */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
          <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5">
            <Search size={16} className="text-gray-400 flex-shrink-0" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products, stores..."
              className="flex-1 text-sm outline-none bg-transparent text-gray-800 placeholder-gray-400"
              onKeyDown={e => e.key === "Enter" && navigate(`/m/find/product?q=${search}`)} />
          </div>
        </div>

        {/* Categories */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900">Shop by Category</p>
            <button onClick={() => navigate("/m/find/product")} className="text-xs font-bold text-blue-700">See All →</button>
          </div>
          <div className="grid grid-cols-4 gap-2">
            {CATEGORIES.map(c => (
              <button key={c.label} onClick={() => navigate("/m/find/product")}
                className="bg-white rounded-2xl border border-gray-100 p-3 flex flex-col items-center gap-1 shadow-sm active:bg-blue-50">
                <span className="text-2xl">{c.icon}</span>
                <span className="text-[11px] font-bold text-gray-700">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Flash Deals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900">⚡ Flash Deals</p>
            <button onClick={() => navigate("/m/find/product")} className="text-xs font-bold text-orange-600">View All →</button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {FLASH_DEALS.map(p => (
              <div key={p.name} onClick={() => navigate("/m/find/product")}
                className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer"
                style={{ width: "44vw", maxWidth: 180 }}>
                <div className="relative">
                  <img src={p.image} alt={p.name} className="w-full h-28 object-cover" />
                  <span className="absolute top-2 left-2 text-[10px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full">-{p.off}%</span>
                </div>
                <div className="p-2.5">
                  <p className="text-[11px] font-bold text-gray-900 line-clamp-2 mb-1">{p.name}</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-sm font-black text-orange-600">${p.price}</span>
                    <span className="text-[11px] text-gray-400 line-through">${p.original}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Stores */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900">🏪 Featured Stores</p>
            <button className="text-xs font-bold text-blue-700">See All →</button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {FEATURED_STORES.map(s => (
              <div key={s.name}
                className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm p-4 flex flex-col items-center gap-2 cursor-pointer"
                style={{ width: 110 }}>
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-2xl">{s.logo}</div>
                <p className="text-[11px] font-bold text-gray-900 text-center leading-tight">{s.name}</p>
                <p className="text-[10px] text-gray-400">{s.products} items</p>
                <p className="text-[10px] text-amber-500 font-bold">⭐ {s.rating}</p>
              </div>
            ))}
          </div>
        </div>

        {/* New Arrivals */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="font-black text-gray-900">🆕 New Arrivals</p>
            <button onClick={() => navigate("/m/find/product")} className="text-xs font-bold text-blue-700">View All →</button>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar pb-1">
            {NEW_ARRIVALS.map(p => (
              <div key={p.name} onClick={() => navigate("/m/find/product")}
                className="flex-shrink-0 bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden cursor-pointer"
                style={{ width: "44vw", maxWidth: 180 }}>
                <img src={p.image} alt={p.name} className="w-full h-28 object-cover" />
                <div className="p-2.5">
                  <p className="text-[11px] font-bold text-gray-900 line-clamp-2 mb-1">{p.name}</p>
                  <span className="text-sm font-black text-blue-700">${p.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Become a Seller CTA */}
        <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, #1a3a6e 0%, #0e2454 100%)" }}>
          <div className="p-5">
            <div className="text-3xl mb-2">🏪</div>
            <p className="font-black text-white text-base mb-1">Sell on Kemetro</p>
            <p className="text-blue-300 text-xs mb-4">Join thousands of sellers and grow your business</p>
            <button onClick={() => navigate("/kemetro/seller/register")}
              className="px-5 py-2.5 rounded-xl font-bold text-xs bg-orange-500 text-white">
              Start Selling →
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}