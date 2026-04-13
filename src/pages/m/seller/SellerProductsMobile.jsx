import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu, Search, Plus, Edit, Eye, Trash2 } from "lucide-react";

const MOCK_PRODUCTS = [
  { id: "p1", name: "Premium Portland Cement 50kg", sku: "CEM-50KG", category: "Masonry Materials", price: 7.50, stock: 4500, status: "Active", sales: 156, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=80&q=80" },
  { id: "p2", name: "Steel Rods 10mm (per ton)", sku: "STL-10MM", category: "Masonry Materials", price: 420, stock: 120, status: "Active", sales: 89, image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=80&q=80" },
  { id: "p3", name: "Wall Paint Matte White 20L", sku: "PNT-WHT-20L", category: "Finishing", price: 49.99, stock: 3, status: "Active", sales: 45, image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=80&q=80" },
  { id: "p4", name: "Ceramic Floor Tiles 60×60", sku: "TIL-CER-60", category: "Architectural", price: 28.50, stock: 800, status: "Active", sales: 72, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80" },
  { id: "p5", name: "Electrical Cable 2.5mm 100m", sku: "ELC-2.5-100", category: "Electrical", price: 38.00, stock: 0, status: "Active", sales: 34, image: "https://images.unsplash.com/photo-1621905251271-48416bd8575a?w=80&q=80" },
];

const TABS = ["All", "Active", "Pending", "Out of Stock", "Draft", "Paused"];

export default function SellerProductsMobile({ onOpenDrawer }) {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("All");
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchTab = activeTab === "All" ||
      (activeTab === "Out of Stock" && p.stock === 0) ||
      (activeTab === "Active" && p.stock > 0) ||
      activeTab === p.status;
    return matchSearch && matchTab;
  });

  const tabCounts = {
    All: products.length,
    Active: products.filter(p => p.stock > 0).length,
    Pending: 0,
    "Out of Stock": products.filter(p => p.stock === 0).length,
    Draft: 0,
    Paused: 0,
  };

  const stockColor = (stock) => stock === 0 ? "text-red-600" : stock < 10 ? "text-orange-500" : "text-green-600";

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={onOpenDrawer} className="p-1 -ml-1"><Menu size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-bold text-base text-gray-900 text-center">My Products</span>
        <button onClick={() => navigate("/m/add/product")} className="p-1"><Plus size={22} className="text-[#0077B6]" /></button>
      </div>

      {/* Search */}
      <div className="bg-white px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl px-3 py-2">
          <Search size={16} className="text-gray-400 flex-shrink-0" />
          <input type="text" placeholder="Search products by name, SKU..."
            value={search} onChange={e => setSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm focus:outline-none" />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white border-b border-gray-100 px-3 py-2">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
                activeTab === tab ? "bg-[#0077B6] text-white" : "bg-white border border-[#0077B6] text-[#0077B6]"
              }`}>
              {tab} ({tabCounts[tab] ?? 0})
            </button>
          ))}
        </div>
      </div>

      {/* Count row */}
      <div className="px-4 py-2">
        <p className="text-xs text-gray-500">{filtered.length} products</p>
      </div>

      {/* Product Cards */}
      <div className="px-4 pb-28 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">📦</p>
            <p className="font-bold text-gray-700">No products found</p>
            <button onClick={() => navigate("/m/add/product")}
              className="mt-4 px-6 py-3 bg-[#0077B6] text-white font-bold rounded-2xl text-sm">
              ➕ Add Your First Product
            </button>
          </div>
        ) : filtered.map(p => (
          <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex gap-3 p-3">
              <div className="relative flex-shrink-0">
                <img src={p.image} alt={p.name} className="w-[90px] h-[90px] rounded-xl object-cover" />
                {p.stock === 0 && (
                  <span className="absolute top-1 left-1 bg-red-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">OUT OF STOCK</span>
                )}
                {p.stock > 0 && p.stock < 10 && (
                  <span className="absolute top-1 left-1 bg-orange-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">LOW STOCK</span>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">{p.name}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{p.category}</p>
                <p className="font-black text-[#0077B6] text-base mt-1">${p.price}</p>
                <div className="flex items-center justify-between mt-1">
                  <p className={`text-xs font-bold ${stockColor(p.stock)}`}>📦 {p.stock.toLocaleString()} in stock</p>
                  <p className="text-[10px] text-gray-400 font-mono">{p.sku}</p>
                </div>
                <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400">
                  <span>👁 {(p.sales * 12).toLocaleString()}</span>
                  <span>🛍 {p.sales}</span>
                  <span>⭐ 4.6</span>
                </div>
              </div>
            </div>
            {/* Actions */}
            <div className="border-t border-gray-100 flex divide-x divide-gray-100">
              {[
                ["✏️ Edit", () => navigate(`/m/dashboard/seller-products/${p.id}/edit`)],
                ["👁 Preview", () => navigate(`/m/dashboard/seller-products/${p.id}/preview`)],
                ["⏸ Pause", null],
                ["🗑 Delete", null]
              ].map(([label, onClick]) => (
                <button
                  key={label}
                  onClick={onClick}
                  className="flex-1 py-2.5 text-[11px] font-bold text-gray-500 hover:bg-gray-50 transition-colors"
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* FAB */}
      <button onClick={() => navigate("/m/add/product")}
        className="fixed bottom-20 right-4 w-14 h-14 rounded-full text-white font-black text-2xl shadow-lg z-30 flex items-center justify-center"
        style={{ background: "#0077B6" }}>
        +
      </button>
    </div>
  );
}