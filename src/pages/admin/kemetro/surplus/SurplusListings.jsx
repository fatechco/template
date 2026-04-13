import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Eye, Star, Trash2, Search } from "lucide-react";

export default function SurplusListings() {
  const [listings, setListings] = useState([]);
  const [filters, setFilters] = useState({ status: "all", category: "", sellerType: "", city: "" });
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.entities.SurplusItem.list("-created_date", 500)
      .then(data => setListings(data || []))
      .catch(() => {});
  }, []);

  const filtered = listings.filter(item => {
    const statusMatch = filters.status === "all" || item.status === filters.status;
    const categoryMatch = !filters.category || item.categoryId === filters.category;
    const sellerMatch = !filters.sellerType || item.sellerType === filters.sellerType;
    const searchMatch = !search || item.title.toLowerCase().includes(search.toLowerCase());
    return statusMatch && categoryMatch && sellerMatch && searchMatch;
  });

  const handleRemove = async (id) => {
    if (confirm("Remove this listing?")) {
      await base44.entities.SurplusItem.update(id, { status: "deleted" });
      setListings(l => l.map(x => x.id === id ? {...x, status: "deleted"} : x));
    }
  };

  const handleFeature = async (id) => {
    await base44.entities.SurplusItem.update(id, { isFeatured: true });
    setListings(l => l.map(x => x.id === id ? {...x, isFeatured: true} : x));
  };

  const handleEcoHighlight = async (id) => {
    await base44.entities.SurplusItem.update(id, { isEcoHighlighted: true });
    setListings(l => l.map(x => x.id === id ? {...x, isEcoHighlighted: true} : x));
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-black text-gray-900">All Listings</h1>

      {/* Filters */}
      <div className="bg-white rounded-lg border border-gray-200 p-4 space-y-3">
        <div className="flex gap-3 flex-wrap">
          <div className="flex-1 min-w-[200px]">
            <input
              type="text"
              placeholder="Search by title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
            />
          </div>
          <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="reserved">Reserved</option>
            <option value="sold">Sold</option>
            <option value="expired">Expired</option>
          </select>
          <select value={filters.sellerType} onChange={(e) => setFilters({...filters, sellerType: e.target.value})} className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
            <option value="">All Sellers</option>
            <option value="homeowner">Homeowner</option>
            <option value="professional">Professional</option>
            <option value="developer">Developer</option>
            <option value="store">Store</option>
          </select>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg font-bold text-sm hover:bg-gray-800">Export CSV</button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Image</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Title</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Seller</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Category</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Price</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Date</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item) => (
              <tr key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  {item.images?.[0] && (
                    <img src={item.images[0]} alt="" className="w-10 h-10 rounded object-cover" />
                  )}
                </td>
                <td className="px-4 py-3 font-semibold text-gray-900 truncate">{item.title}</td>
                <td className="px-4 py-3 text-gray-600">{item.sellerType}</td>
                <td className="px-4 py-3 text-gray-600">{item.categoryId}</td>
                <td className="px-4 py-3 font-bold text-gray-900">{item.surplusPriceEGP?.toLocaleString()} EGP</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    item.status === 'active' ? 'bg-green-100 text-green-700' :
                    item.status === 'sold' ? 'bg-blue-100 text-blue-700' :
                    item.status === 'reserved' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 text-xs">{new Date(item.created_date).toLocaleDateString()}</td>
                <td className="px-4 py-3 flex gap-1">
                  <button className="p-2 hover:bg-gray-100 rounded" title="View">
                    <Eye size={16} className="text-gray-600" />
                  </button>
                  <button onClick={() => handleFeature(item.id)} className="p-2 hover:bg-gray-100 rounded" title="Feature">
                    <Star size={16} className={item.isFeatured ? "text-yellow-500" : "text-gray-600"} />
                  </button>
                  <button onClick={() => handleEcoHighlight(item.id)} className="p-2 hover:bg-gray-100 rounded" title="Eco Highlight">
                    <span className="text-lg">🌿</span>
                  </button>
                  <button onClick={() => handleRemove(item.id)} className="p-2 hover:bg-red-100 rounded" title="Remove">
                    <Trash2 size={16} className="text-red-600" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}