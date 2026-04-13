import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";

const BUY_REQUESTS = [
  { id: 1, title: "Looking for Villa in Giza", buyer: "Ahmed Hassan", budget: "$150K - $250K", status: "active", priority: "high", image: "bg-blue-300" },
  { id: 2, title: "Apartment Downtown Cairo", buyer: "Sara Mohamed", budget: "$80K - $120K", status: "active", priority: "medium", image: "bg-green-300" },
  { id: 3, title: "Studio in New Cairo", buyer: "Karim Ali", budget: "$40K - $60K", status: "pending", priority: "low", image: "bg-orange-300" },
  { id: 4, title: "Penthouse Sheikh Zayed", buyer: "Fatima Khalil", budget: "$300K+", status: "active", priority: "high", image: "bg-purple-300" },
  { id: 5, title: "Commercial Space Cairo", buyer: "Omar Hassan", budget: "$200K - $350K", status: "pending", priority: "medium", image: "bg-red-300" },
];

const BUY_REQUEST_TABS = ["All", "Active", "Pending", "Matched"];

export default function FranchiseOwnerAreaBuyRequests() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("All");

  const filteredRequests = BUY_REQUESTS.filter(br => {
    if (activeTab === "All") return true;
    if (activeTab === "Active") return br.status === "active";
    if (activeTab === "Pending") return br.status === "pending";
    if (activeTab === "Matched") return br.status === "active" && br.priority === "high";
    return true;
  });

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">Area Buy Requests</h1>
      </div>

      {/* Tabs */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {BUY_REQUEST_TABS.map(tab => (
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

      {/* Buy Request Cards */}
      <div className="px-4 py-4 pb-24 space-y-3">
        {filteredRequests.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No buy requests found</p>
          </div>
        ) : (
          filteredRequests.map(request => (
            <div key={request.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex">
                {/* Thumbnail */}
                <div className={`${request.image} w-20 h-20 flex-shrink-0`} />

                {/* Content */}
                <div className="flex-1 p-3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-sm text-gray-900 line-clamp-1">{request.title}</p>
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                        request.priority === "high"
                          ? "bg-red-100 text-red-700"
                          : request.priority === "medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-blue-100 text-blue-700"
                      }`}>
                        {request.priority}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">By {request.buyer}</p>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      request.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {request.status === "active" ? "Active" : "Pending"}
                    </span>
                    <span className="text-[10px] text-gray-600 font-semibold">{request.budget}</span>
                    <button className="text-orange-600 text-xs font-bold hover:underline ml-auto">
                      View →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}