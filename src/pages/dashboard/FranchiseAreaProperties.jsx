import { useState } from 'react';
import { Search, Filter, RotateCcw, Download, Eye, Edit, Check, Star, AlertCircle, Trash2, ChevronRight, MapPin } from 'lucide-react';

const PROPERTIES_DATA = [
  { id: 1, title: "Luxury Villa in Giza", category: "Villa", purpose: "Sale", owner: "Ahmed Hassan", phone: "+201234567890", city: "Giza", price: "4,500,000 EGP", status: "pending", verified: false, addedDate: "2025-03-20", views: 234, thumbnail: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&q=70", images: ["https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80", "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80"] },
  { id: 2, title: "Modern Apartment Downtown", category: "Apartment", purpose: "Rent", owner: "Sara Mohamed", phone: "+201234567891", city: "Cairo", price: "8,500 EGP/month", status: "active", verified: true, addedDate: "2025-03-10", views: 567, thumbnail: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=70", images: [] },
  { id: 3, title: "Studio in Heliopolis", category: "Apartment", purpose: "Rent", owner: "Karim Ali", phone: "+201234567892", city: "Cairo", price: "3,500 EGP/month", status: "pending", verified: false, addedDate: "2025-03-18", views: 123, thumbnail: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=200&q=70", images: [] },
  { id: 4, title: "Commercial Space in New Cairo", category: "Commercial", purpose: "Sale", owner: "Fatima Khalil", phone: "+201234567893", city: "New Cairo", price: "2,800,000 EGP", status: "active", verified: true, addedDate: "2025-02-28", views: 890, thumbnail: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=200&q=70", images: [] },
  { id: 5, title: "Penthouse with Lake View", category: "Apartment", purpose: "Sale", owner: "Hassan Ibrahim", phone: "+201234567894", city: "New Cairo", price: "6,200,000 EGP", status: "active", verified: true, addedDate: "2025-03-01", views: 1200, thumbnail: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=200&q=70", images: [] },
];

const STATUS_TABS = ["All", "Active", "Pending Verification", "Recently Added", "My Properties"];

export default function FranchiseAreaProperties() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [selectedProperties, setSelectedProperties] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPurpose, setSelectedPurpose] = useState("All");
  const [selectedVerified, setSelectedVerified] = useState("All");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingProperty, setVerifyingProperty] = useState(null);
  const [verifyStep, setVerifyStep] = useState(1);
  const [verifyChecklist, setVerifyChecklist] = useState({
    exists: false, dimensions: false, photos: false, price: false, owner: false, legal: false, onSite: false, signage: false,
  });
  const [uploadedPhotos, setUploadedPhotos] = useState([]);
  const [verifyNotes, setVerifyNotes] = useState("");

  const filteredProperties = PROPERTIES_DATA.filter(p => {
    const tabMatch = activeTab === "All" || 
                    (activeTab === "Active" && p.status === "active") ||
                    (activeTab === "Pending Verification" && p.status === "pending") ||
                    (activeTab === "Recently Added" && p.addedDate > "2025-03-15");
    const searchMatch = searchQuery === "" || p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const purposeMatch = selectedPurpose === "All" || p.purpose === selectedPurpose;
    const verifiedMatch = selectedVerified === "All" || (selectedVerified === "Verified" ? p.verified : !p.verified);
    return tabMatch && searchMatch && purposeMatch && verifiedMatch;
  });

  const statCards = [
    { label: "Total Properties", value: PROPERTIES_DATA.length, color: "text-orange-600" },
    { label: "Pending Verification", value: PROPERTIES_DATA.filter(p => p.status === "pending").length, color: "text-red-600" },
    { label: "Added Today", value: 2, color: "text-green-600" },
    { label: "Verified", value: PROPERTIES_DATA.filter(p => p.verified).length, color: "text-teal-600" },
  ];

  const handleSelectProperty = (id) => {
    setSelectedProperties(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    setSelectedProperties(selectedProperties.length === filteredProperties.length ? [] : filteredProperties.map(p => p.id));
  };

  const startVerify = (property) => {
    setVerifyingProperty(property);
    setShowVerifyModal(true);
    setVerifyStep(1);
    setVerifyChecklist({ exists: false, dimensions: false, photos: false, price: false, owner: false, legal: false, onSite: false, signage: false });
    setUploadedPhotos([]);
    setVerifyNotes("");
  };

  const completeVerify = () => {
    console.log("Property verified:", verifyingProperty, verifyNotes);
    setShowVerifyModal(false);
    setVerifyingProperty(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Dashboard {">"} My Area {">"} Properties</p>
        <h1 className="text-3xl font-black text-gray-900">Properties in My Area</h1>
      </div>

      {/* Status Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {STATUS_TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-xs transition-all border-b-2 ${
              activeTab === tab
                ? "bg-orange-50 text-orange-600 border-orange-600"
                : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
            }`}
          >
            {tab} ({filteredProperties.length})
          </button>
        ))}
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

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by title, owner name, phone..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <select value={selectedPurpose} onChange={e => setSelectedPurpose(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 cursor-pointer"
          >
            <option>All Purpose</option>
            <option>Sale</option>
            <option>Rent</option>
          </select>
          <select value={selectedVerified} onChange={e => setSelectedVerified(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 cursor-pointer"
          >
            <option>All Verified</option>
            <option>Verified</option>
            <option>Unverified</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold">
            <Filter size={14} /> Filter
          </button>
          <button onClick={() => { setSearchQuery(""); setSelectedPurpose("All"); setSelectedVerified("All"); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold ml-auto">
            <Download size={14} /> Export
          </button>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedProperties.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
          <p className="font-bold text-gray-900 text-sm">{selectedProperties.length} properties selected</p>
          <div className="flex gap-2 ml-auto">
            <button className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700">✅ Verify Selected</button>
            <button className="px-3 py-1.5 rounded-lg bg-yellow-600 text-white text-xs font-bold hover:bg-yellow-700">⭐ Feature Selected</button>
            <button className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700">✅ Activate Selected</button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">📤 Export</button>
          </div>
        </div>
      )}

      {/* Properties Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" checked={selectedProperties.length === filteredProperties.length && filteredProperties.length > 0}
                  onChange={handleSelectAll} className="rounded w-4 h-4" /></th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Title & Category</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Owner</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">City</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Price</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Verified</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Views</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProperties.map(prop => (
                <tr key={prop.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedProperties.includes(prop.id)} onChange={() => handleSelectProperty(prop.id)} className="rounded w-4 h-4" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedProperty(prop)}>
                      <img src={prop.thumbnail} alt={prop.title} className="w-10 h-10 rounded object-cover" />
                      <div>
                        <p className="font-bold text-gray-900">{prop.title}</p>
                        <span className="text-xs text-gray-500">{prop.category}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{prop.owner}</td>
                  <td className="px-4 py-3 text-gray-600">{prop.city}</td>
                  <td className="px-4 py-3 font-bold text-orange-600">{prop.price}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-xs font-bold px-2 py-1 rounded ${
                      prop.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}>
                      {prop.status === "active" ? "Active" : "Pending"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {prop.verified ? <Check size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-yellow-500" />}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{prop.views}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedProperty(prop)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Eye size={16} /></button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600"><Edit size={16} /></button>
                      <button onClick={() => startVerify(prop)} className="p-1.5 hover:bg-gray-100 rounded text-purple-600"><Check size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Property Detail Panel */}
      {selectedProperty && (
        <div className="fixed right-0 top-0 bottom-0 w-[500px] bg-white shadow-2xl border-l border-gray-200 z-40 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-5 flex items-center justify-between">
            <h2 className="text-lg font-black text-gray-900">Property Details</h2>
            <button onClick={() => setSelectedProperty(null)} className="text-gray-400 text-2xl">×</button>
          </div>

          {/* Gallery */}
          <div className="bg-gray-200 h-64 overflow-x-auto flex">
            {selectedProperty.images.length > 0 ? selectedProperty.images.map((img, i) => (
              <img key={i} src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover flex-shrink-0" />
            )) : (
              <img src={selectedProperty.thumbnail} alt="Thumbnail" className="w-full h-full object-cover" />
            )}
          </div>

          {/* Title + Status */}
          <div className="p-5 border-b border-gray-100">
            <h3 className="text-2xl font-black text-gray-900 mb-2">{selectedProperty.title}</h3>
            <div className="flex items-center gap-2">
              <span className="bg-orange-100 text-orange-700 text-xs font-bold px-2 py-1 rounded">{selectedProperty.category}</span>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">{selectedProperty.purpose}</span>
              <span className={`text-xs font-bold px-2 py-1 rounded ${selectedProperty.status === "active" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                {selectedProperty.status === "active" ? "Active" : "Pending"}
              </span>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100 flex px-5">
            {["Details", "Owner", "Verification", "History"].map(tab => (
              <button key={tab} className={`flex-1 py-3 font-bold text-xs border-b-2 ${tab === "Details" ? "text-orange-600 border-orange-600" : "text-gray-600 border-transparent"}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Details Tab Content */}
          <div className="p-5 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500 mb-1">Category</p>
                <p className="font-bold text-gray-900">{selectedProperty.category}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Purpose</p>
                <p className="font-bold text-gray-900">{selectedProperty.purpose}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">City</p>
                <p className="font-bold text-gray-900">{selectedProperty.city}</p>
              </div>
              <div>
                <p className="text-gray-500 mb-1">Price</p>
                <p className="font-black text-orange-600">{selectedProperty.price}</p>
              </div>
            </div>

            {!selectedProperty.verified && (
              <button onClick={() => startVerify(selectedProperty)} className="w-full bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700">
                ✅ Verify Property
              </button>
            )}
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && verifyingProperty && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="mb-6">
              <p className="text-xs font-bold text-gray-500 uppercase mb-2">Step {verifyStep} of 4</p>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: `${(verifyStep / 4) * 100}%` }} />
              </div>
            </div>

            {verifyStep === 1 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">Review Property Details</h2>
                <div className="bg-gray-50 rounded-xl p-4 mb-4 space-y-3">
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Title:</span><span className="font-bold text-gray-900">{verifyingProperty.title}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Category:</span><span className="font-bold text-gray-900">{verifyingProperty.category}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">City:</span><span className="font-bold text-gray-900">{verifyingProperty.city}</span></div>
                  <div className="flex justify-between"><span className="text-sm text-gray-600">Price:</span><span className="font-black text-orange-600">{verifyingProperty.price}</span></div>
                </div>
                <p className="font-bold text-gray-900 mb-4">Is the information accurate?</p>
                <div className="flex gap-3">
                  <button onClick={() => setVerifyStep(2)} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700">Yes ✓</button>
                  <button className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-lg hover:bg-red-50">No — Request Edit</button>
                </div>
              </div>
            )}

            {verifyStep === 2 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">On-Site Verification Checklist</h2>
                <div className="space-y-2 mb-6">
                  {[
                    { key: "exists", label: "Property exists at listed address" },
                    { key: "dimensions", label: "Dimensions match listing" },
                    { key: "photos", label: "Photos are current and accurate" },
                    { key: "price", label: "Price is market-accurate" },
                    { key: "owner", label: "Owner is confirmed" },
                    { key: "legal", label: "No legal issues found" },
                    { key: "onSite", label: "Images taken on-site uploaded" },
                    { key: "signage", label: "VERIFIED signage photo uploaded" },
                  ].map(item => (
                    <label key={item.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input type="checkbox" checked={verifyChecklist[item.key]} onChange={e => setVerifyChecklist({...verifyChecklist, [item.key]: e.target.checked})} className="w-4 h-4" />
                      <span className="text-sm text-gray-700">{item.label}</span>
                    </label>
                  ))}
                </div>
                <button onClick={() => setVerifyStep(3)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700">Continue to Photos</button>
              </div>
            )}

            {verifyStep === 3 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">Verification Photos & Notes</h2>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-4">
                  <p className="text-sm text-gray-600">📸 Upload on-site verification photos (min 3)</p>
                  <button className="mt-3 bg-orange-100 text-orange-700 font-bold px-4 py-2 rounded-lg">Choose Files</button>
                </div>
                <textarea placeholder="Verification notes..." value={verifyNotes} onChange={e => setVerifyNotes(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:border-orange-400 resize-none h-24"
                />
                <button onClick={() => setVerifyStep(4)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700">Review & Approve</button>
              </div>
            )}

            {verifyStep === 4 && (
              <div>
                <h2 className="text-2xl font-black text-gray-900 mb-4">Approve Verification</h2>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6">
                  <p className="text-sm text-green-800">All checklist items completed. Ready to approve verification.</p>
                </div>
                <div className="flex gap-3">
                  <button onClick={() => setShowVerifyModal(false)} className="flex-1 border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-lg hover:bg-red-50">❌ Reject</button>
                  <button onClick={completeVerify} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700">✅ Grant Verification</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}