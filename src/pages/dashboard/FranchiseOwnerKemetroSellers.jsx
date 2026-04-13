import { useState } from 'react';
import { Search, Filter, RotateCcw, Eye, Check, MessageCircle, AlertCircle, LayoutGrid, List, Star } from 'lucide-react';

const SELLERS_DATA = [
  { id: 1, storeName: "Ahmed's Electronics", owner: "Ahmed Hassan", products: 45, orders: 234, revenue: "$12,500", plan: "Pro", status: "active", verified: true, joined: "2024-12-01", logo: "https://images.unsplash.com/photo-1549887534-50b2903a0e11?w=100&q=70" },
  { id: 2, storeName: "Furniture Plus", owner: "Sara Mohamed", products: 23, orders: 156, revenue: "$8,200", plan: "Basic", status: "active", verified: false, joined: "2025-01-15", logo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=70" },
  { id: 3, storeName: "Fashion Hub", owner: "Layla Ahmed", products: 67, orders: 432, revenue: "$18,900", plan: "Enterprise", status: "active", verified: true, joined: "2024-11-20", logo: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=100&q=70" },
  { id: 4, storeName: "Home Decor Co", owner: "Karim Ali", products: 12, orders: 45, revenue: "$3,200", plan: "Free", status: "pending", verified: false, joined: "2025-02-10", logo: "https://images.unsplash.com/photo-1578500494198-246f612d03b3?w=100&q=70" },
];

const PRODUCTS_DATA = [
  { id: 1, name: "Wireless Headphones", store: "Ahmed's Electronics", category: "Electronics", price: "$45.99", stock: 120, status: "in-stock", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=70" },
  { id: 2, name: "Wooden Chair", store: "Furniture Plus", category: "Furniture", price: "$89.99", stock: 34, status: "in-stock", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=70" },
  { id: 3, name: "Summer Dress", store: "Fashion Hub", category: "Clothing", price: "$29.99", stock: 0, status: "out-of-stock", image: "https://images.unsplash.com/photo-1595777707802-221556fce228?w=200&q=70" },
  { id: 4, name: "Table Lamp", store: "Home Decor Co", category: "Home", price: "$34.99", stock: 15, status: "in-stock", image: "https://images.unsplash.com/photo-1565636192335-14c46fa1120d?w=200&q=70" },
];

export default function FranchiseOwnerKemetroSellers() {
  const [activeTab, setActiveTab] = useState("Sellers");
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedPlan, setSelectedPlan] = useState("All");
  const [viewMode, setViewMode] = useState("table");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingSeller, setVerifyingSeller] = useState(null);
  const [verifyChecklist, setVerifyChecklist] = useState({
    business: false, id: false, address: false, quality: false, pricing: false, contact: false, photos: false,
  });

  const filteredSellers = SELLERS_DATA.filter(s => {
    const searchMatch = searchQuery === "" || s.storeName.toLowerCase().includes(searchQuery.toLowerCase());
    const statusMatch = selectedStatus === "All" || s.status === selectedStatus;
    const planMatch = selectedPlan === "All" || s.plan === selectedPlan;
    return searchMatch && statusMatch && planMatch;
  });

  const statCards = [
    { label: "Sellers", value: SELLERS_DATA.length, color: "text-blue-600" },
    { label: "Products", value: PRODUCTS_DATA.length, color: "text-blue-600" },
    { label: "Orders", value: 867, color: "text-blue-600" },
    { label: "Revenue", value: "$43.8K", color: "text-blue-600" },
  ];

  const startVerify = (seller) => {
    setVerifyingSeller(seller);
    setShowVerifyModal(true);
    setVerifyChecklist({ business: false, id: false, address: false, quality: false, pricing: false, contact: false, photos: false });
  };

  const completeVerify = () => {
    console.log("Seller verified:", verifyingSeller);
    setShowVerifyModal(false);
    setVerifyingSeller(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-l-4 border-blue-600 pl-4">
        <p className="text-xs text-gray-500 mb-1">Dashboard {">"} My Area {">"} Kemetro</p>
        <h1 className="text-3xl font-black text-gray-900">Kemetro — My Area</h1>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-white rounded-2xl shadow-sm p-4 border border-gray-100">
            <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
            <p className="text-xs text-gray-600 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        {["Sellers", "Products", "Verify Seller"].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 font-bold text-sm transition-all border-b-2 ${
              activeTab === tab
                ? "bg-blue-50 text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* TAB 1: SELLERS */}
      {activeTab === "Sellers" && (
        <div className="space-y-6">
          {/* Filter Bar */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search sellers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
                />
              </div>
              <select value={selectedStatus} onChange={e => setSelectedStatus(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 cursor-pointer font-bold"
              >
                <option>All Status</option>
                <option>Active</option>
                <option>Pending</option>
              </select>
              <select value={selectedPlan} onChange={e => setSelectedPlan(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-blue-400 cursor-pointer font-bold"
              >
                <option>All Plans</option>
                <option>Free</option>
                <option>Basic</option>
                <option>Pro</option>
                <option>Enterprise</option>
              </select>
              <button onClick={() => { setSearchQuery(""); setSelectedStatus("All"); setSelectedPlan("All"); }}
                className="px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold">
                <RotateCcw size={14} className="inline mr-1" /> Reset
              </button>
            </div>
          </div>

          {/* Sellers Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-4 py-3 text-left"><input type="checkbox" className="rounded w-4 h-4" /></th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Store</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Owner</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Products</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Orders</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Revenue</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Plan</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Status</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Verified</th>
                    <th className="px-4 py-3 text-left font-bold text-gray-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredSellers.map(seller => (
                    <tr key={seller.id} className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setSelectedSeller(seller)}>
                      <td className="px-4 py-3"><input type="checkbox" className="rounded w-4 h-4" /></td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <img src={seller.logo} alt={seller.storeName} className="w-8 h-8 rounded object-cover" />
                          <span className="font-bold text-gray-900">{seller.storeName}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{seller.owner}</td>
                      <td className="px-4 py-3 font-bold">{seller.products}</td>
                      <td className="px-4 py-3 font-bold">{seller.orders}</td>
                      <td className="px-4 py-3 font-bold text-blue-600">{seller.revenue}</td>
                      <td className="px-4 py-3"><span className="text-xs font-bold px-2 py-1 rounded bg-blue-100 text-blue-700">{seller.plan}</span></td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-bold px-2 py-1 rounded ${seller.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                          {seller.status === "active" ? "Active" : "Pending"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        {seller.verified ? <Check size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-yellow-500" />}
                      </td>
                      <td className="px-4 py-3" onClick={e => e.stopPropagation()}>
                        <div className="flex gap-2">
                          <button onClick={() => setSelectedSeller(seller)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Eye size={16} /></button>
                          {!seller.verified && <button onClick={() => startVerify(seller)} className="p-1.5 hover:bg-gray-100 rounded text-blue-600"><Check size={16} /></button>}
                          <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><MessageCircle size={16} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCTS */}
      {activeTab === "Products" && (
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <button onClick={() => setViewMode("table")} className={`p-2 rounded-lg ${viewMode === "table" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}><List size={18} /></button>
            <button onClick={() => setViewMode("grid")} className={`p-2 rounded-lg ${viewMode === "grid" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}><LayoutGrid size={18} /></button>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-4 gap-4">
              {PRODUCTS_DATA.map(product => (
                <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow">
                  <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                  <div className="p-3">
                    <p className="font-bold text-gray-900 text-sm line-clamp-2">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{product.store}</p>
                    <div className="flex justify-between items-end mt-3">
                      <div>
                        <p className="text-xs text-gray-600">{product.category}</p>
                        <p className="font-black text-blue-600">{product.price}</p>
                      </div>
                      <span className={`text-xs font-bold px-2 py-1 rounded ${product.status === "in-stock" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                        {product.status === "in-stock" ? "In Stock" : "Out"}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="px-4 py-3 text-left font-bold">Product</th>
                      <th className="px-4 py-3 text-left font-bold">Store</th>
                      <th className="px-4 py-3 text-left font-bold">Category</th>
                      <th className="px-4 py-3 text-left font-bold">Price</th>
                      <th className="px-4 py-3 text-left font-bold">Stock</th>
                      <th className="px-4 py-3 text-left font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {PRODUCTS_DATA.map(product => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 font-bold">{product.name}</td>
                        <td className="px-4 py-3 text-gray-600">{product.store}</td>
                        <td className="px-4 py-3 text-gray-600">{product.category}</td>
                        <td className="px-4 py-3 font-bold text-blue-600">{product.price}</td>
                        <td className="px-4 py-3">{product.stock}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-bold px-2 py-1 rounded ${product.status === "in-stock" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                            {product.status === "in-stock" ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: VERIFY SELLER */}
      {activeTab === "Verify Seller" && (
        <div className="space-y-6">
          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Find seller to verify..." className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-400" />
          </div>

          <div className="space-y-3">
            {SELLERS_DATA.filter(s => !s.verified).map(seller => (
              <div key={seller.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={seller.logo} alt={seller.storeName} className="w-12 h-12 rounded-lg object-cover" />
                  <div>
                    <p className="font-bold text-gray-900">{seller.storeName}</p>
                    <p className="text-xs text-gray-500">{seller.owner}</p>
                  </div>
                </div>
                <button onClick={() => startVerify(seller)} className="px-4 py-2 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700">
                  Verify →
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Seller Detail Panel */}
      {selectedSeller && (
        <div className="fixed right-0 top-0 bottom-0 w-[480px] bg-white shadow-2xl border-l border-gray-200 z-40 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Seller Details</h2>
            <button onClick={() => setSelectedSeller(null)} className="text-gray-400 text-2xl">×</button>
          </div>

          <div className="p-5 space-y-4">
            <img src={selectedSeller.logo} alt={selectedSeller.storeName} className="w-full h-40 rounded-lg object-cover" />
            <h3 className="text-2xl font-black text-gray-900">{selectedSeller.storeName}</h3>
            <p className="text-sm text-gray-600">Owner: {selectedSeller.owner}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-gray-600 mb-1">Products</p>
                <p className="font-black text-blue-600">{selectedSeller.products}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-gray-600 mb-1">Orders</p>
                <p className="font-black text-blue-600">{selectedSeller.orders}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-gray-600 mb-1">Revenue</p>
                <p className="font-black text-blue-600">{selectedSeller.revenue}</p>
              </div>
              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-gray-600 mb-1">Plan</p>
                <p className="font-black text-blue-600">{selectedSeller.plan}</p>
              </div>
            </div>

            {!selectedSeller.verified && (
              <button onClick={() => startVerify(selectedSeller)} className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg hover:bg-blue-700 mt-4">
                ✅ Verify Seller
              </button>
            )}
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && verifyingSeller && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Verify Seller</h2>
            <p className="text-sm text-gray-600 mb-6">{verifyingSeller.storeName} • {verifyingSeller.owner}</p>

            <div className="space-y-2 mb-6">
              {[
                { key: "business", label: "Business registration document" },
                { key: "id", label: "Owner ID verified" },
                { key: "address", label: "Store address confirmed (on-site visit)" },
                { key: "quality", label: "Products quality checked" },
                { key: "pricing", label: "Pricing is reasonable" },
                { key: "contact", label: "Contact verified" },
                { key: "photos", label: "VERIFIED badge photos uploaded" },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" checked={verifyChecklist[item.key]} onChange={e => setVerifyChecklist({...verifyChecklist, [item.key]: e.target.checked})} className="w-4 h-4" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowVerifyModal(false)} className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-lg hover:bg-red-50">
                ❌ Reject
              </button>
              <button onClick={completeVerify} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700">
                ✅ Verify Seller
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}