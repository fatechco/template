import { useState } from "react";
import { Plus, Search, Edit, Trash2, Eye, ToggleLeft, ToggleRight, Package } from "lucide-react";
import { Link } from "react-router-dom";

const MOCK_PRODUCTS = [
  { id: "p1", name: "Premium Portland Cement 50kg", sku: "CEM-50KG", category: "Masonry Materials", price: 7.50, stock: 4500, status: "Active", sales: 156, image: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=80&q=80" },
  { id: "p2", name: "Steel Rods 10mm (per ton)", sku: "STL-10MM", category: "Masonry Materials", price: 420, stock: 120, status: "Active", sales: 89, image: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=80&q=80" },
  { id: "p3", name: "Wall Paint Matte White 20L", sku: "PNT-WHT-20L", category: "Finishing", price: 49.99, stock: 3, status: "Low Stock", sales: 45, image: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=80&q=80" },
  { id: "p4", name: "Ceramic Floor Tiles 60×60", sku: "TIL-CER-60", category: "Architectural", price: 28.50, stock: 800, status: "Active", sales: 72, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=80&q=80" },
  { id: "p5", name: "Electrical Cable 2.5mm 100m", sku: "ELC-2.5-100", category: "Electrical", price: 38.00, stock: 0, status: "Out of Stock", sales: 34, image: "https://images.unsplash.com/photo-1621905251271-48416bd8575a?w=80&q=80" },
];

const STATUS_COLORS = {
  "Active": "bg-green-100 text-green-700",
  "Low Stock": "bg-yellow-100 text-yellow-700",
  "Out of Stock": "bg-red-100 text-red-700",
  "Draft": "bg-gray-100 text-gray-600",
};

export default function KemetroSellerProducts({ onAddProduct }) {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState(MOCK_PRODUCTS);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setProducts(products.map((p) =>
      p.id === id ? { ...p, status: p.status === "Active" ? "Draft" : "Active" } : p
    ));
  };

  const deleteProduct = (id) => {
    if (confirm("Delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Products</h1>
          <p className="text-gray-500 text-sm mt-1">{products.length} products in your store</p>
        </div>
        <button
          onClick={onAddProduct}
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-5 py-2.5 rounded-xl transition-colors"
        >
          <Plus size={18} /> Add Product
        </button>
      </div>

      {/* Stats strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Total", value: products.length, color: "text-gray-900" },
          { label: "Active", value: products.filter(p => p.status === "Active").length, color: "text-green-600" },
          { label: "Low Stock", value: products.filter(p => p.status === "Low Stock").length, color: "text-yellow-600" },
          { label: "Out of Stock", value: products.filter(p => p.status === "Out of Stock").length, color: "text-red-600" },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Search & Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="relative max-w-sm">
            <Search size={16} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Product</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">SKU</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Category</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Price</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Stock</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Sales</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-gray-400">
                    <Package size={40} className="mx-auto mb-3 opacity-30" />
                    <p>No products found</p>
                  </td>
                </tr>
              ) : filtered.map((p, i) => (
                <tr key={p.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img src={p.image} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="font-semibold text-gray-900 line-clamp-1 max-w-[200px]">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">{p.sku}</td>
                  <td className="px-4 py-3 text-gray-600">{p.category}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">${p.price}</td>
                  <td className="px-4 py-3">
                    <span className={p.stock === 0 ? "text-red-600 font-bold" : p.stock < 10 ? "text-yellow-600 font-bold" : "text-gray-700"}>
                      {p.stock.toLocaleString()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{p.sales}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[p.status]}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button title="View" className="text-gray-400 hover:text-blue-600 transition-colors">
                        <Eye size={15} />
                      </button>
                      <button title="Edit" className="text-gray-400 hover:text-teal-600 transition-colors">
                        <Edit size={15} />
                      </button>
                      <button title={p.status === "Active" ? "Deactivate" : "Activate"} onClick={() => toggleStatus(p.id)} className="text-gray-400 hover:text-teal-600 transition-colors">
                        {p.status === "Active" ? <ToggleRight size={17} className="text-teal-500" /> : <ToggleLeft size={17} />}
                      </button>
                      <button title="Delete" onClick={() => deleteProduct(p.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}