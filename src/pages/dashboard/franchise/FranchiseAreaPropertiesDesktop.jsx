import { useState } from 'react';
import { Search, MapPin, Check, X } from 'lucide-react';

const PROPERTIES = [
  { id: 1, title: "Modern Villa in Giza", owner: "Ahmed Hassan", status: "pending", verified: false, location: "Giza", price: "$250,000", addedDate: "2024-03-10" },
  { id: 2, title: "Apartment Downtown", owner: "Sara Mohamed", status: "active", verified: true, location: "Downtown", price: "$180,000", addedDate: "2024-02-20" },
  { id: 3, title: "Studio in Heliopolis", owner: "Karim Ali", status: "pending", verified: false, location: "Heliopolis", price: "$95,000", addedDate: "2024-03-15" },
  { id: 4, title: "Penthouse New Cairo", owner: "Fatima Khalil", status: "active", verified: true, location: "New Cairo", price: "$450,000", addedDate: "2024-01-25" },
  { id: 5, title: "Twin House 6th October", owner: "Hassan Ibrahim", status: "pending", verified: false, location: "6th October", price: "$320,000", addedDate: "2024-03-12" },
  { id: 6, title: "Commercial Space Maadi", owner: "Leila Ahmed", status: "active", verified: true, location: "Maadi", price: "$150,000", addedDate: "2024-02-15" },
];

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  pending: "bg-orange-100 text-orange-700",
};

export default function FranchiseAreaPropertiesDesktop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [verifyingProperty, setVerifyingProperty] = useState(null);
  const [verifyStep, setVerifyStep] = useState(1);
  const [verifyData, setVerifyData] = useState({
    checklist: {
      location: false,
      photos: false,
      description: false,
      price: false,
      amenities: false,
      documentation: false,
      ownership: false,
      condition: false,
    },
    notes: "",
  });

  const tabs = ["All", "Pending Verify", "Active", "Recent"];

  const filteredProperties = PROPERTIES.filter(p => {
    let tabMatch = true;
    if (selectedTab === "Pending Verify") tabMatch = p.status === "pending";
    else if (selectedTab === "Active") tabMatch = p.status === "active";
    
    const searchMatch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                       p.owner.toLowerCase().includes(searchQuery.toLowerCase());
    return tabMatch && searchMatch;
  });

  const handleCompleteVerify = (approved) => {
    console.log("Property verification:", approved ? "approved" : "rejected", verifyData);
    setVerifyingProperty(null);
    setVerifyStep(1);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900">Area Properties</h1>
        <p className="text-gray-500 text-sm mt-1">Verify and manage properties in your area</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by property or owner..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setSelectedTab(tab)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                selectedTab === tab
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-700">Property</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-700">Owner</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-700">Location</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-700">Price</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-700">Added</th>
              <th className="px-6 py-3 text-right text-xs font-black text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProperties.map((property) => (
              <tr key={property.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3">
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{property.title}</p>
                    {property.verified && <span className="text-xs text-green-600 font-semibold">✅ Verified</span>}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <p className="text-sm text-gray-600">{property.owner}</p>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-1 text-sm text-gray-600">
                    <MapPin size={14} />
                    {property.location}
                  </div>
                </td>
                <td className="px-6 py-3">
                  <p className="text-sm font-bold text-orange-600">{property.price}</p>
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[property.status]}`}>
                    {property.status === "active" ? "Active" : "Pending"}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <p className="text-sm text-gray-600">{new Date(property.addedDate).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-3 text-right">
                  {property.status === "pending" && (
                    <button
                      onClick={() => setVerifyingProperty(property)}
                      className="text-orange-600 hover:text-orange-700 font-bold text-sm"
                    >
                      Verify →
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verify Property Modal */}
      {verifyingProperty && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full p-6">
            <div className="mb-6">
              <p className="text-sm text-gray-500 mb-2">Step {verifyStep} of 4</p>
              <h2 className="text-xl font-black text-gray-900">{verifyingProperty.title}</h2>
            </div>

            {/* Step 1: Details */}
            {verifyStep === 1 && (
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                  <p className="text-sm text-gray-700"><strong>Title:</strong> {verifyingProperty.title}</p>
                  <p className="text-sm text-gray-700"><strong>Owner:</strong> {verifyingProperty.owner}</p>
                  <p className="text-sm text-gray-700"><strong>Location:</strong> {verifyingProperty.location}</p>
                  <p className="text-sm text-gray-700"><strong>Price:</strong> {verifyingProperty.price}</p>
                </div>
                <button
                  onClick={() => setVerifyStep(2)}
                  className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700"
                >
                  Continue to Checklist
                </button>
              </div>
            )}

            {/* Step 2: Checklist */}
            {verifyStep === 2 && (
              <div className="space-y-6">
                <p className="font-black text-gray-900">Verification Checklist</p>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(verifyData.checklist).map(([key, value]) => (
                    <label key={key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => setVerifyData({
                          ...verifyData,
                          checklist: { ...verifyData.checklist, [key]: e.target.checked },
                        })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-700 capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                    </label>
                  ))}
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setVerifyStep(1)}
                    className="flex-1 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setVerifyStep(3)}
                    className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Notes */}
            {verifyStep === 3 && (
              <div className="space-y-6">
                <p className="font-black text-gray-900">Add Verification Notes</p>
                <textarea
                  placeholder="Add any verification notes..."
                  value={verifyData.notes}
                  onChange={(e) => setVerifyData({ ...verifyData, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-24"
                />
                <div className="flex gap-3">
                  <button
                    onClick={() => setVerifyStep(2)}
                    className="flex-1 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setVerifyStep(4)}
                    className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-lg hover:bg-orange-700"
                  >
                    Review
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirm */}
            {verifyStep === 4 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800">All checklist items completed. Ready to verify this property.</p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleCompleteVerify(false)}
                    className="flex-1 border-2 border-red-300 text-red-600 font-bold py-3 rounded-lg hover:bg-red-50"
                  >
                    ❌ Reject
                  </button>
                  <button
                    onClick={() => handleCompleteVerify(true)}
                    className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700"
                  >
                    ✅ Approve
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}