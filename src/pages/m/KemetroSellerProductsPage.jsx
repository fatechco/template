import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
import { Plus, MoreVertical } from "lucide-react";

const SELLER_PRODUCTS = [
  { id: 1, image: "🪑", name: "Ergonomic Office Chair", category: "Furniture", price: "$180", stock: 12, status: "active" },
  { id: 2, image: "💡", name: "Smart LED Desk Lamp", category: "Lighting", price: "$65", stock: 45, status: "active" },
  { id: 3, image: "🖥️", name: "Monitor Arm Stand", category: "Accessories", price: "$45", stock: 0, status: "out_of_stock" },
  { id: 4, image: "⌨️", name: "Mechanical Keyboard", category: "Electronics", price: "$95", stock: 8, status: "active" },
  { id: 5, image: "🖱️", name: "Wireless Mouse", category: "Electronics", price: "$35", stock: 22, status: "active" },
  { id: 6, image: "📦", name: "Desk Organizer Box", category: "Storage", price: "$25", stock: 3, status: "active" },
];

const FILTERS = ["All", "Active", "Draft", "Pending", "Out of Stock"];

export default function KemetroSellerProductsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeFilter, setActiveFilter] = useState(searchParams.get("status") || "active");
  const [showMenu, setShowMenu] = useState(null);

  const filtered = activeFilter === "all" ? SELLER_PRODUCTS : SELLER_PRODUCTS.filter(p => p.status === activeFilter);

  return (
    <div className="min-h-full bg-gray-50 pb-32">
      <MobileTopBar title="My Products" showBack />

      {/* Filter Tabs */}
      <div className="sticky top-14 z-30 bg-white border-b border-gray-200 px-4 py-3">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map(filter => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter.toLowerCase())}
              className={`flex-shrink-0 text-xs font-bold px-3 py-1.5 rounded-full transition-colors ${
                activeFilter === filter.toLowerCase()
                  ? "bg-teal-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Products List */}
      <div className="px-4 py-4 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500">No products found</p>
          </div>
        ) : (
          filtered.map(product => (
            <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex items-center gap-3">
              {/* Image */}
              <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-2xl flex-shrink-0">{product.image}</div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-500">{product.category}</p>

                {/* Price & Stock */}
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-black text-gray-900">{product.price}</span>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded ${
                      product.status === "out_of_stock"
                        ? "bg-red-100 text-red-700"
                        : product.stock <= 5
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-green-100 text-green-700"
                    }`}
                  >
                    {product.status === "out_of_stock" ? "Out of Stock" : `${product.stock} in stock`}
                  </span>
                </div>
              </div>

              {/* Menu Button */}
              <div className="relative">
                <button
                  onClick={() => setShowMenu(showMenu === product.id ? null : product.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <MoreVertical size={18} className="text-gray-600" />
                </button>

                {/* Dropdown Menu */}
                {showMenu === product.id && (
                  <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 z-20 w-40">
                    <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                      ✏️ Edit
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                      👁️ View
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100">
                      📋 Duplicate
                    </button>
                    <button className="w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Product FAB */}
      <button
        onClick={() => navigate("/m/add/product")}
        className="fixed bottom-8 right-4 w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-orange-700 transition-colors"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}