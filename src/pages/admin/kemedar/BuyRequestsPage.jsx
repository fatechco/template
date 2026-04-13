import { Search, Download, Eye, X } from "lucide-react";
import { useState } from "react";

const mockBuyRequests = [
  { id: "BR-001", buyer: "Anonymous", category: "Villa", location: "Cairo", budget: "500K - 1M", date: "2024-03-15", status: "active" },
  { id: "BR-002", buyer: "Anonymous", category: "Apartment", location: "Giza", budget: "100K - 250K", date: "2024-03-18", status: "active" },
];

export default function BuyRequestsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetail, setShowDetail] = useState(null);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Buy Requests</h1>
        <p className="text-sm text-gray-600 mt-1">Manage property search requests from buyers</p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search by request ID, location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
              />
            </div>
          </div>
          <select className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none">
            <option>All Categories</option>
            <option>Villa</option>
            <option>Apartment</option>
          </select>
          <button className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">Reset</button>
          <button className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">
            <Download size={16} /> Export
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Request ID</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Buyer</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Category</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Location</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Budget</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
              <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {mockBuyRequests.map(req => (
              <tr key={req.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-bold text-gray-900">{req.id}</td>
                <td className="px-4 py-3 text-gray-600">{req.buyer}</td>
                <td className="px-4 py-3 text-gray-600">{req.category}</td>
                <td className="px-4 py-3 text-gray-600">{req.location}</td>
                <td className="px-4 py-3 text-gray-600">{req.budget}</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{req.date}</td>
                <td className="px-4 py-3"><span className="px-2.5 py-1 bg-green-100 text-green-700 rounded text-xs font-bold">{req.status}</span></td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => setShowDetail(req)} className="text-blue-600 font-bold text-sm hover:underline">👁 View</button>
                    <button className="text-green-600 font-bold text-sm hover:underline">✅ Activate</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {showDetail && (
        <div className="fixed right-0 top-16 h-screen w-96 bg-white border-l border-gray-200 shadow-lg overflow-y-auto z-40">
          <div className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <h2 className="text-xl font-black text-gray-900">{showDetail.id}</h2>
              <button onClick={() => setShowDetail(null)}>
                <X size={20} className="text-gray-600" />
              </button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Category</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{showDetail.category}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Location</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{showDetail.location}</p>
              </div>
              <div>
                <p className="text-xs text-gray-600 uppercase font-bold">Budget</p>
                <p className="text-sm text-gray-900 font-bold mt-1">{showDetail.budget}</p>
              </div>
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2">
              <button className="w-full px-4 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">🏠 Find Matching Properties</button>
              <button className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50">✅ Activate Request</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}