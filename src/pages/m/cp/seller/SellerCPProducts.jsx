import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Filter, Edit2, Trash2, Eye, TrendingUp, DollarSign } from "lucide-react";

const MOCK_PRODUCTS = [
  { id: 1, name: "Office Chair Ergonomic", sku: "OFC-001", price: 180, stock: 45, sales: 156, status: "active", image: "🪑" },
  { id: 2, name: "LED Desk Lamp", sku: "LED-002", price: 45, stock: 120, sales: 89, status: "active", image: "💡" },
  { id: 3, name: "Filing Cabinet 3-Drawer", sku: "FIL-003", price: 95, stock: 3, sales: 42, status: "low_stock", image: "🗄" },
  { id: 4, name: "Standing Desk", sku: "DSK-004", price: 350, stock: 0, sales: 28, status: "out_of_stock", image: "🖥" },
  { id: 5, name: "Monitor Stand", sku: "MON-005", price: 65, stock: 78, sales: 67, status: "active", image: "📺" },
  { id: 6, name: "Keyboard Wireless", sku: "KEY-006", price: 85, stock: 92, sales: 134, status: "active", image: "⌨" },
];

const STATUS_CONFIG = {
  active: { badge: "bg-green-100 text-green-700", label: "✅ Active" },
  low_stock: { badge: "bg-yellow-100 text-yellow-700", label: "⚠️ Low Stock" },
  out_of_stock: { badge: "bg-red-100 text-red-700", label: "❌ Out of Stock" },
  draft: { badge: "bg-gray-100 text-gray-600", label: "📝 Draft" },
};

export default function SellerCPProducts() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const filtered = MOCK_PRODUCTS.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesFilter = filter === "all" || 
      (filter === "active" && p.status === "active") ||
      (filter === "low_stock" && p.status === "low_stock") ||
      (filter === "out_of_stock" && p.status === "out_of_stock");
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">📦 My Products</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your product listings and inventory</p>
        </div>
        <button
          onClick={() => navigate("/m/cp/seller/add-product")}
          className="flex items-center gap-2 bg-gradient-to-r from-teal-500 to-teal-600 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:shadow-lg transition-all"
        >
          <Plus size={18} /> Add
        </button>
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3">
        <div className="flex-1 relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
          />
        </div>
        <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
          <Filter size={18} className="text-gray-600" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {["all", "active", "low_stock", "out_of_stock"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
              filter === tab
                ? "bg-white text-teal-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab === "all" ? "All Products" : tab.replace("_", " ").toUpperCase()}
          </button>
        ))}
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-white rounded-xl p-3 border border-gray-100 text-center">
          <p className="text-2xl font-black text-gray-900">{MOCK_PRODUCTS.length}</p>
          <p className="text-[10px] text-gray-500 font-medium">Total</p>
        </div>
        <div className="bg-green-50 rounded-xl p-3 border border-green-100 text-center">
          <p className="text-2xl font-black text-green-700">{MOCK_PRODUCTS.filter(p => p.status === "active").length}</p>
          <p className="text-[10px] text-green-600 font-medium">Active</p>
        </div>
        <div className="bg-red-50 rounded-xl p-3 border border-red-100 text-center">
          <p className="text-2xl font-black text-red-700">{MOCK_PRODUCTS.filter(p => p.status === "out_of_stock").length}</p>
          <p className="text-[10px] text-red-600 font-medium">Out of Stock</p>
        </div>
      </div>

      {/* Product List */}
      <div className="space-y-3">
        {filtered.map(product => {
          const sc = STATUS_CONFIG[product.status];
          return (
            <div key={product.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center text-3xl flex-shrink-0">
                  {product.image}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-bold text-gray-900 text-sm truncate flex-1">{product.name}</h3>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-[9px] font-bold flex-shrink-0 ${sc.badge}`}>
                      {sc.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-2">SKU: {product.sku}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="font-black text-teal-600">${product.price}</span>
                      <span className="text-xs text-gray-400">Stock: {product.stock}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400">
                      <TrendingUp size={12} />
                      <span className="text-xs font-bold text-gray-600">{product.sales} sold</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 mt-4 pt-3 border-t border-gray-50">
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-teal-50 text-teal-600 hover:bg-teal-100 text-xs font-bold py-2 rounded-lg transition-colors">
                  <Eye size={14} /> View
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 text-xs font-bold py-2 rounded-lg transition-colors">
                  <Edit2 size={14} /> Edit
                </button>
                <button className="flex items-center justify-center gap-1.5 bg-red-50 text-red-600 hover:bg-red-100 text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-6xl mb-4">🔍</div>
          <p className="font-bold text-gray-700 text-lg mb-1">No products found</p>
          <p className="text-gray-500 text-sm">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}