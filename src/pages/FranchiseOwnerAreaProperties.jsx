import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const PROPERTIES = [
  { id: 1, title: "Modern Villa in Giza", owner: "Ahmed Hassan", status: "pending", verified: false, image: "bg-blue-300" },
  { id: 2, title: "Apartment Downtown", owner: "Sara Mohamed", status: "active", verified: true, image: "bg-green-300" },
  { id: 3, title: "Studio in Heliopolis", owner: "Karim Ali", status: "pending", verified: false, image: "bg-orange-300" },
  { id: 4, title: "Penthouse New Cairo", owner: "Fatima Khalil", status: "active", verified: true, image: "bg-purple-300" },
];

const PROPERTY_TABS = ["All", "Pending Verify", "Active", "Recent"];

export default function FranchiseOwnerAreaProperties() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");
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
    photos: [],
  });

  const filteredProperties = PROPERTIES.filter(p => {
    if (activeTab === "All") return true;
    if (activeTab === "Pending Verify") return p.status === "pending";
    if (activeTab === "Active") return p.status === "active";
    if (activeTab === "Recent") return p.status === "pending";
    return true;
  });

  const handleStartVerify = (property) => {
    setVerifyingProperty(property);
    setVerifyStep(1);
    setVerifyData({
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
      photos: [],
    });
  };

  const handleCompleteVerify = (approved) => {
    console.log("Property verification:", approved ? "approved" : "rejected", verifyData);
    setVerifyingProperty(null);
    setVerifyStep(1);
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">Area Properties</h1>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {PROPERTY_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeTab === tab
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Property Cards */}
      <div className="px-4 py-4 pb-24 space-y-3">
        {filteredProperties.map(property => (
          <div key={property.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex">
              {/* Thumbnail */}
              <div className={`${property.image} w-20 h-20 flex-shrink-0`} />

              {/* Content */}
              <div className="flex-1 p-3 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-gray-900 line-clamp-1">{property.title}</p>
                    {property.verified && <span className="text-xs">✅</span>}
                  </div>
                  <p className="text-xs text-gray-500 mt-1">By {property.owner}</p>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    property.status === "active"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {property.status === "active" ? "Active" : "Pending"}
                  </span>
                  {property.status === "pending" && (
                    <button
                      onClick={() => handleStartVerify(property)}
                      className="text-orange-600 text-xs font-bold hover:underline"
                    >
                      Verify →
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Verify Property Modal */}
      {verifyingProperty && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
              <p className="text-xs font-bold text-gray-600">Step {verifyStep} of 4</p>
              <button onClick={() => setVerifyingProperty(null)} className="text-gray-400 text-2xl">✕</button>
            </div>

            <div className="p-4">
              {/* Step 1: Details */}
              {verifyStep === 1 && (
                <div className="space-y-4">
                  <p className="font-bold text-gray-900">Review Property Details</p>
                  <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                    <p className="text-sm text-gray-700"><strong>Title:</strong> {verifyingProperty.title}</p>
                    <p className="text-sm text-gray-700"><strong>Owner:</strong> {verifyingProperty.owner}</p>
                    <p className="text-sm text-gray-700"><strong>Status:</strong> {verifyingProperty.status}</p>
                    <p className="text-sm text-gray-700"><strong>Category:</strong> Villa</p>
                    <p className="text-sm text-gray-700"><strong>Location:</strong> Giza, Egypt</p>
                    <p className="text-sm text-gray-700"><strong>Price:</strong> $250,000</p>
                  </div>
                  <button
                    onClick={() => setVerifyStep(2)}
                    className="w-full bg-orange-600 text-white font-bold py-3 rounded-lg"
                  >
                    Continue to Checklist
                  </button>
                </div>
              )}

              {/* Step 2: Checklist */}
              {verifyStep === 2 && (
                <div className="space-y-4">
                  <p className="font-bold text-gray-900">Verification Checklist</p>
                  <div className="space-y-2">
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
                  <div className="flex gap-2">
                    <button
                      onClick={() => setVerifyStep(1)}
                      className="flex-1 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setVerifyStep(3)}
                      className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-lg"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Notes & Photos */}
              {verifyStep === 3 && (
                <div className="space-y-4">
                  <p className="font-bold text-gray-900">Add Notes & Photos</p>
                  <textarea
                    placeholder="Add verification notes..."
                    value={verifyData.notes}
                    onChange={(e) => setVerifyData({ ...verifyData, notes: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 min-h-24"
                  />
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <p className="text-sm text-gray-600">📷 Tap to upload photos</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setVerifyStep(2)}
                      className="flex-1 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg"
                    >
                      Back
                    </button>
                    <button
                      onClick={() => setVerifyStep(4)}
                      className="flex-1 bg-orange-600 text-white font-bold py-3 rounded-lg"
                    >
                      Review
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Approve/Reject */}
              {verifyStep === 4 && (
                <div className="space-y-4">
                  <p className="font-bold text-gray-900">Confirm Verification</p>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <p className="text-xs text-blue-800">All checklist items completed. Ready to approve this property.</p>
                  </div>
                  <div className="flex gap-2">
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
        </div>
      )}
    </div>
  );
}