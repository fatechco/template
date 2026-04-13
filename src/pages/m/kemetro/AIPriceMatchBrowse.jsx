import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Search, ChevronRight } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const PRODUCTS = [
  {
    id: 1,
    name: "Modern Sofa Set",
    category: "Furniture",
    bestPrice: 4200,
    originalPrice: 5500,
    savingsPercent: 24,
    sellers: 12,
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&q=70",
  },
  {
    id: 2,
    name: "Ceramic Tiles (Box)",
    category: "Tiles",
    bestPrice: 280,
    originalPrice: 450,
    savingsPercent: 38,
    sellers: 8,
    image: "https://images.unsplash.com/photo-1576786381648-d0aecbe74340?w=300&q=70",
  },
  {
    id: 3,
    name: "Interior Paint (5L)",
    category: "Paint",
    bestPrice: 180,
    originalPrice: 280,
    savingsPercent: 36,
    sellers: 15,
    image: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=300&q=70",
  },
  {
    id: 4,
    name: "LED Ceiling Light",
    category: "Lighting",
    bestPrice: 620,
    originalPrice: 950,
    savingsPercent: 35,
    sellers: 10,
    image: "https://images.unsplash.com/photo-1524634126288-917f3f61b719?w=300&q=70",
  },
  {
    id: 5,
    name: "Wooden Floor Panels",
    category: "Flooring",
    bestPrice: 520,
    originalPrice: 800,
    savingsPercent: 35,
    sellers: 6,
    image: "https://images.unsplash.com/photo-1581092164392-8c6fa0650fbb?w=300&q=70",
  },
  {
    id: 6,
    name: "Bathroom Fixtures Set",
    category: "Bathroom",
    bestPrice: 1850,
    originalPrice: 2800,
    savingsPercent: 34,
    sellers: 9,
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=300&q=70",
  },
];

export default function AIPriceMatchBrowse() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);

  const categories = [...new Set(PRODUCTS.map(p => p.category))];
  
  const filtered = PRODUCTS.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !selectedCategory || p.category === selectedCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <p className="font-black text-gray-900 text-sm">Price Compare</p>
        <div className="w-6" />
      </div>

      {/* Search */}
      <div className="sticky top-[56px] z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="bg-gray-100 rounded-xl flex items-center gap-2 px-3 py-2.5">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="flex-1 bg-transparent text-sm outline-none text-gray-800 placeholder-gray-400"
          />
        </div>
      </div>

      {/* Category Filter */}
      <div className="sticky top-[120px] z-10 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button onClick={() => setSelectedCategory(null)}
            className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
              !selectedCategory ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-700"
            }`}>
            All ({PRODUCTS.length})
          </button>
          {categories.map(cat => (
            <button key={cat} onClick={() => setSelectedCategory(cat)}
              className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-bold transition-colors ${
                selectedCategory === cat ? "bg-cyan-600 text-white" : "bg-gray-100 text-gray-700"
              }`}>
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-4 py-6">
        <div className="grid grid-cols-1 gap-3">
          {filtered.map(product => (
            <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => navigate(`/m/kemetro/search?q=${product.name}`)}>
              <div className="flex gap-3 p-3">
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <p className="text-xs font-semibold text-cyan-600 mb-1">{product.category}</p>
                    <p className="text-sm font-black text-gray-900 line-clamp-2">{product.name}</p>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-base font-black text-cyan-700">EGP {product.bestPrice.toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 line-through">EGP {product.originalPrice.toLocaleString()}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-base font-black text-green-600">Save {product.savingsPercent}%</p>
                      <p className="text-[10px] text-gray-500">{product.sellers} sellers</p>
                    </div>
                  </div>
                </div>
                <ChevronRight size={18} className="text-gray-300 self-center flex-shrink-0" />
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="text-4xl mb-3">🔍</div>
            <p className="font-black text-gray-700 mb-1">No products found</p>
            <p className="text-gray-500 text-xs">Try a different search or category</p>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}