import { useState } from 'react';
import { ChevronLeft, Search, Settings, Plus, Eye, Check, Star, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PROPERTIES_DATA = [
  { id: 1, title: "Luxury Villa in Giza", category: "Villa", purpose: "Sale", owner: "Ahmed Hassan", city: "Giza", price: "4,500,000 EGP", verified: false, thumbnail: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=70" },
  { id: 2, title: "Modern Apartment Downtown", category: "Apartment", purpose: "Rent", owner: "Sara Mohamed", city: "Cairo", price: "8,500 EGP/month", verified: true, thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=70" },
  { id: 3, title: "Studio in Heliopolis", category: "Apartment", purpose: "Rent", owner: "Karim Ali", city: "Cairo", price: "3,500 EGP/month", verified: false, thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=70" },
  { id: 4, title: "Commercial Space", category: "Commercial", purpose: "Sale", owner: "Fatima Khalil", city: "New Cairo", price: "2,800,000 EGP", verified: true, thumbnail: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=70" },
];

export default function FranchiseAreaPropertiesMobile() {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingProperty, setVerifyingProperty] = useState(null);
  const [verifyStep, setVerifyStep] = useState(1);
  const [verifyChecklist, setVerifyChecklist] = useState({
    exists: false, dimensions: false, photos: false, price: false, owner: false, legal: false, onSite: false, signage: false,
  });

  const filteredProperties = PROPERTIES_DATA.filter(p => {
    const tabMatch = selectedTab === "All" || 
                    (selectedTab === "Pending" && !p.verified) ||
                    (selectedTab === "Active" && p.verified) ||
                    (selectedTab === "Recent");
    const searchMatch = searchQuery === "" || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return tabMatch && searchMatch;
  });

  const startVerify = (property) => {
    setVerifyingProperty(property);
    setShowVerifyModal(true);
    setVerifyStep(1);
    setVerifyChecklist({ exists: false, dimensions: false, photos: false, price: false, owner: false, legal: false, onSite: false, signage: false });
  };

  const completeVerify = () => {
    console.log("Property verified:", verifyingProperty);
    setShowVerifyModal(false);
    setVerifyingProperty(null);
  };

  return (
    <div className="min-h-full bg-gray-50 pb-28 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Area Properties</h1>
        <button onClick={() => navigate("/m/kemedar/add/property")} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Plus size={22} className="text-gray-900" />
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {["All", "Pending ⚠️", "Active", "Recent", "Mine"].map(tab => (
          <button key={tab} onClick={() => setSelectedTab(tab.replace(" ⚠️", ""))}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              selectedTab === tab.replace(" ⚠️", "")
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="sticky top-28 z-20 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search properties..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Settings size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {[
          { label: "Total", value: PROPERTIES_DATA.length },
          { label: "Pending", value: PROPERTIES_DATA.filter(p => !p.verified).length },
          { label: "Verified", value: PROPERTIES_DATA.filter(p => p.verified).length },
        ].map((stat, i) => (
          <div key={i} className="flex-shrink-0 bg-white rounded-full px-3 py-1.5 border border-gray-200 text-xs">
            <span className="font-black text-gray-900">{stat.value}</span>
            <span className="text-gray-500 ml-1">{stat.label}</span>
          </div>
        ))}
      </div>

      {/* Property Cards */}
      <div className="px-4 py-4 space-y-3">
        {filteredProperties.map(prop => (
          <div key={prop.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex">
            {/* Thumbnail */}
            <div className="relative w-24 h-24 flex-shrink-0">
              <img src={prop.thumbnail} alt={prop.title} className="w-full h-full object-cover" />
              <span className={`absolute top-2 left-2 text-xs font-bold px-2 py-1 rounded ${
                prop.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
              }`}>
                {prop.verified ? "✓ Verified" : "⚠️ Pending"}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
              <div>
                <p className="font-bold text-gray-900 text-sm line-clamp-2">{prop.title}</p>
                <div className="flex gap-1 mt-1 flex-wrap">
                  <span className="bg-orange-100 text-orange-700 text-[10px] font-bold px-2 py-0.5 rounded">{prop.category}</span>
                  <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded">{prop.purpose}</span>
                </div>
              </div>
              <div>
                <p className="font-black text-orange-600 text-sm">{prop.price}</p>
                <p className="text-xs text-gray-500">📍 {prop.city} • {prop.owner}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col items-center justify-between p-2 gap-2 flex-shrink-0">
              <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                <Eye size={16} />
              </button>
              {!prop.verified && (
                <button onClick={() => startVerify(prop)} className="p-1.5 hover:bg-gray-100 rounded text-purple-600">
                  <Check size={16} />
                </button>
              )}
              {prop.verified && (
                <button className="p-1.5 hover:bg-gray-100 rounded text-yellow-600">
                  <Star size={16} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Verify Modal */}
      {showVerifyModal && verifyingProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            
            {/* Progress */}
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Step {verifyStep} of 4</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(verifyStep / 4) * 100}%` }} />
              </div>
            </div>

            {verifyStep === 1 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4">Review Property</h2>
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-2">
                  <div className="flex justify-between text-xs"><span className="text-gray-600">Title:</span><span className="font-bold text-gray-900">{verifyingProperty.title}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-600">Category:</span><span className="font-bold text-gray-900">{verifyingProperty.category}</span></div>
                  <div className="flex justify-between text-xs"><span className="text-gray-600">City:</span><span className="font-bold text-gray-900">{verifyingProperty.city}</span></div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setVerifyStep(2)} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg">Yes ✓</button>
                  <button className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-lg">No</button>
                </div>
              </div>
            )}

            {verifyStep === 2 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4">On-Site Checklist</h2>
                <div className="space-y-2 mb-6">
                  {[
                    { key: "exists", label: "Property exists" },
                    { key: "dimensions", label: "Dimensions match" },
                    { key: "photos", label: "Photos current" },
                    { key: "price", label: "Price accurate" },
                    { key: "owner", label: "Owner confirmed" },
                    { key: "legal", label: "No legal issues" },
                    { key: "onSite", label: "Photos uploaded" },
                    { key: "signage", label: "Signage photo" },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer">
                      <input type="checkbox" checked={verifyChecklist[item.key]} onChange={e => setVerifyChecklist({...verifyChecklist, [item.key]: e.target.checked})} className="w-4 h-4" />
                      <span className="text-xs text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
                <button onClick={() => setVerifyStep(3)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg">Continue</button>
              </div>
            )}

            {verifyStep === 3 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4">Upload Photos</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center mb-4">
                  <p className="text-xs text-gray-600">📸 Upload on-site photos (min 3)</p>
                  <button className="mt-3 bg-orange-100 text-orange-700 font-bold text-xs px-3 py-1.5 rounded-lg">Choose Files</button>
                </div>
                <textarea placeholder="Notes..." className="w-full border border-gray-200 rounded-lg px-3 py-2 mb-4 text-xs focus:outline-none resize-none h-20" />
                <button onClick={() => setVerifyStep(4)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg">Review</button>
              </div>
            )}

            {verifyStep === 4 && (
              <div>
                <h2 className="text-lg font-black text-gray-900 mb-4">Approve</h2>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-xs text-green-800">Ready to approve verification?</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setShowVerifyModal(false)} className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-lg">❌ Reject</button>
                  <button onClick={completeVerify} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg">✅ Verify</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* FAB */}
      <button onClick={() => navigate("/m/kemedar/add/property")} className="fixed bottom-24 right-4 w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-lg hover:bg-orange-700">
        ➕
      </button>
    </div>
  );
}