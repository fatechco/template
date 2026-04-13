import { useState } from 'react';
import { ChevronLeft, Search, Settings, Eye, Check, MessageCircle, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SELLERS_DATA = [
  { id: 1, storeName: "Ahmed's Electronics", owner: "Ahmed Hassan", products: 45, orders: 234, revenue: "$12,500", plan: "Pro", status: "active", verified: true, logo: "https://images.unsplash.com/photo-1549887534-50b2903a0e11?w=100&q=70" },
  { id: 2, storeName: "Furniture Plus", owner: "Sara Mohamed", products: 23, orders: 156, revenue: "$8,200", plan: "Basic", status: "active", verified: false, logo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=70" },
  { id: 3, storeName: "Fashion Hub", owner: "Layla Ahmed", products: 67, orders: 432, revenue: "$18,900", plan: "Enterprise", status: "active", verified: true, logo: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?w=100&q=70" },
];

export default function FranchiseOwnerKemetroSellersMobile() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("Sellers");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingSeller, setVerifyingSeller] = useState(null);
  const [verifyChecklist, setVerifyChecklist] = useState({
    business: false, id: false, address: false, quality: false, pricing: false, contact: false, photos: false,
  });

  const filteredSellers = SELLERS_DATA.filter(s =>
    searchQuery === "" || s.storeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
    <div className="min-h-full bg-gray-50 pb-28 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Kemetro — My Area</h1>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Settings size={22} className="text-gray-900" />
        </button>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {["Sellers", "Products", "Verify"].map(tab => (
          <button key={tab} onClick={() => setSelectedTab(tab)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              selectedTab === tab
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Stats Strip */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { label: "Sellers", value: SELLERS_DATA.length },
          { label: "Products", value: 156 },
          { label: "Orders", value: 822 },
        ].map((stat, i) => (
          <div key={i} className="flex-shrink-0 bg-white rounded-full px-3 py-1.5 border border-gray-200 text-xs">
            <span className="font-black text-blue-600">{stat.value}</span>
            <span className="text-gray-500 ml-1">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Content */}
      {selectedTab === "Sellers" && (
        <div className="px-4 py-4 space-y-3">
          {/* Search */}
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search sellers..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>

          {/* Seller Cards */}
          {filteredSellers.map(seller => (
            <div key={seller.id} className="bg-white rounded-2xl border border-gray-100 p-3 flex items-center gap-3">
              <img src={seller.logo} alt={seller.storeName} className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-bold text-gray-900 text-sm">{seller.storeName}</p>
                <p className="text-xs text-gray-500">{seller.owner}</p>
                <div className="flex gap-2 text-xs text-gray-600 mt-1">
                  <span>🛒 {seller.products}</span>
                  <span>📦 {seller.orders}</span>
                </div>
                <span className="inline-block text-xs font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-700 mt-1">{seller.plan}</span>
              </div>
              <div className="flex-shrink-0 flex flex-col items-end gap-1">
                <span className={`text-xs font-bold px-2 py-0.5 rounded ${seller.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {seller.verified ? "✓ Verified" : "⚠ Pending"}
                </span>
                <div className="flex gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded text-gray-600"><Eye size={14} /></button>
                  {!seller.verified && <button onClick={() => startVerify(seller)} className="p-1 hover:bg-gray-100 rounded text-blue-600"><Check size={14} /></button>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Verify Tab */}
      {selectedTab === "Verify" && (
        <div className="px-4 py-4 space-y-3">
          {SELLERS_DATA.filter(s => !s.verified).map(seller => (
            <div key={seller.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={seller.logo} alt={seller.storeName} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="font-bold text-gray-900 text-sm">{seller.storeName}</p>
                  <p className="text-xs text-gray-500">{seller.owner}</p>
                </div>
              </div>
              <button onClick={() => startVerify(seller)} className="px-3 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700">
                Verify
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && verifyingSeller && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-lg font-black text-gray-900 mb-2">Verify Seller</h2>
            <p className="text-xs text-gray-600 mb-4">{verifyingSeller.storeName}</p>

            <div className="space-y-2 mb-6">
              {[
                { key: "business", label: "Business document" },
                { key: "id", label: "Owner ID verified" },
                { key: "address", label: "Store address confirmed" },
                { key: "quality", label: "Products quality checked" },
                { key: "pricing", label: "Pricing is reasonable" },
                { key: "contact", label: "Contact verified" },
                { key: "photos", label: "Photos uploaded" },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" checked={verifyChecklist[item.key]} onChange={e => setVerifyChecklist({...verifyChecklist, [item.key]: e.target.checked})} className="w-4 h-4" />
                  <span className="text-xs text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowVerifyModal(false)} className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-lg">❌ Reject</button>
              <button onClick={completeVerify} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg">✅ Verify</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}