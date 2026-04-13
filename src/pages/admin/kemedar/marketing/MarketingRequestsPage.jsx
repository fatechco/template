import { Eye, CheckCircle, XCircle, MessageSquare, User } from "lucide-react";
import { useState } from "react";

const mockRequests = [
  { id: 1, propTitle: "Modern Villa Cairo", propImage: "🏠", owner: "Ahmed Hassan", requester: "Fatima Agency", message: "Great property, can I promote it?", requestedDate: "2024-03-21", status: "pending", propId: "P-001" },
  { id: 2, propTitle: "Luxury Apartment Giza", propImage: "🏢", owner: "Layla Mohamed", requester: "Omar Marketing", message: "Interested in marketing this", requestedDate: "2024-03-20", status: "approved", propId: "P-002" },
  { id: 3, propTitle: "Downtown Office", propImage: "🏬", owner: "Khaled Mustafa", requester: "Sara Promotions", message: "Would love to promote", requestedDate: "2024-03-19", status: "rejected", propId: "P-003" },
];

export default function MarketingRequestsPage() {
  const [tab, setTab] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const filtered = tab === "all" ? mockRequests : mockRequests.filter(r => r.status === tab);

  const statusCounts = {
    all: mockRequests.length,
    pending: mockRequests.filter(r => r.status === "pending").length,
    approved: mockRequests.filter(r => r.status === "approved").length,
    rejected: mockRequests.filter(r => r.status === "rejected").length,
  };

  const getStatusColor = (status) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-700",
      approved: "bg-green-100 text-green-700",
      rejected: "bg-red-100 text-red-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Marketing Requests</h1>
        <p className="text-sm text-gray-600 mt-1">Manage property promotion requests from marketers</p>
      </div>

      {/* Info Card */}
      <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4 space-y-2">
        <p className="text-sm font-bold text-blue-900">📋 Marketing Request Cycle:</p>
        <ol className="text-xs text-blue-800 space-y-1 ml-4 list-decimal">
          <li>Marketer clicks 'Promote this property'</li>
          <li>Writes message to owner</li>
          <li>Request arrives to owner for approval</li>
          <li>If approved: copy of property (without contact info) goes to marketer's account</li>
          <li>Marketer promotes as their own listing</li>
        </ol>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Total Requests", value: statusCounts.all, color: "bg-blue-100 text-blue-700" },
          { label: "Pending", value: statusCounts.pending, color: "bg-yellow-100 text-yellow-700" },
          { label: "Approved", value: statusCounts.approved, color: "bg-green-100 text-green-700" },
          { label: "Rejected", value: statusCounts.rejected, color: "bg-red-100 text-red-700" },
        ].map(stat => (
          <div key={stat.label} className={`${stat.color} rounded-xl p-4 text-center`}>
            <p className="text-2xl font-black">{stat.value}</p>
            <p className="text-xs font-bold mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 pb-4 overflow-x-auto">
        {["all", "pending", "approved", "rejected"].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap px-4 py-2.5 text-sm font-bold rounded-t-lg transition-all border-b-2 ${
              tab === t
                ? "border-orange-600 text-orange-600 bg-orange-50"
                : "border-transparent text-gray-600 hover:text-gray-900"
            }`}
          >
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Request ID</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Property</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Owner</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Requester</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Message</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Requested</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(req => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900">#{req.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">{req.propImage}</span>
                      <span className="font-bold text-gray-900 text-xs">{req.propTitle}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{req.owner}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{req.requester}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs max-w-xs truncate">{req.message}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{req.requestedDate}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${getStatusColor(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-1">
                    <button onClick={() => { setSelectedRequest(req); setShowDetail(true); }} className="p-1 hover:bg-gray-200 rounded text-blue-600">
                      <Eye size={14} />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded text-green-600">
                      <CheckCircle size={14} />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded text-red-600">
                      <XCircle size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {showDetail && selectedRequest && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Request #{selectedRequest.id}</h2>

            {/* Property */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="text-xs text-gray-600 uppercase font-bold mb-2">Property</p>
              <div className="flex items-center gap-3 bg-gray-50 p-3 rounded-lg">
                <span className="text-3xl">{selectedRequest.propImage}</span>
                <div>
                  <p className="font-bold text-gray-900">{selectedRequest.propTitle}</p>
                  <p className="text-xs text-gray-600">{selectedRequest.propId}</p>
                </div>
              </div>
            </div>

            {/* Owner */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="text-xs text-gray-600 uppercase font-bold mb-2">Property Owner</p>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <User size={16} className="text-gray-600" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{selectedRequest.owner}</p>
                </div>
                <button className="text-blue-600 font-bold text-xs hover:underline">View Profile</button>
              </div>
            </div>

            {/* Requester */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="text-xs text-gray-600 uppercase font-bold mb-2">Requester/Marketer</p>
              <div className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg">
                <User size={16} className="text-gray-600" />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-sm">{selectedRequest.requester}</p>
                </div>
                <button className="text-blue-600 font-bold text-xs hover:underline">View Profile</button>
              </div>
            </div>

            {/* Message */}
            <div className="border-b border-gray-200 pb-4 mb-4">
              <p className="text-xs text-gray-600 uppercase font-bold mb-2">Message</p>
              <p className="text-sm text-gray-800 bg-gray-50 p-3 rounded-lg">{selectedRequest.message}</p>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <button className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg font-bold text-sm hover:bg-green-700">
                ✅ Force Approve
              </button>
              <button className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg font-bold text-sm hover:bg-red-700">
                ❌ Force Reject
              </button>
              <button onClick={() => setShowDetail(false)} className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}