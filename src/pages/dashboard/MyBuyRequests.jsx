import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Eye, Trash2, PauseCircle, X } from "lucide-react";

const MOCK = [
  { id: "BR-001", categories: ["Apartment", "Studio"], location: "New Cairo, Cairo", budgetMin: 80000, budgetMax: 150000, status: "Active", matches: 12, date: "2025-02-15" },
  { id: "BR-002", categories: ["Villa"], location: "Sheikh Zayed, Giza", budgetMin: 300000, budgetMax: 500000, status: "Active", matches: 5, date: "2025-03-01" },
  { id: "BR-003", categories: ["Office"], location: "Downtown, Cairo", budgetMin: 2000, budgetMax: 4000, status: "Paused", matches: 3, date: "2024-12-10" },
];

const STATUS_COLORS = { Active: "bg-green-100 text-green-700", Paused: "bg-yellow-100 text-yellow-700", Expired: "bg-red-100 text-red-700" };

export default function MyBuyRequests() {
  const [matchPanel, setMatchPanel] = useState(null);

  const MOCK_MATCHES = [
    { id: 1, title: "Modern Apartment New Cairo", price: "$120,000", image: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=100&q=70" },
    { id: 2, title: "Studio near AUC", price: "$95,000", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=100&q=70" },
    { id: 3, title: "2BR in Madinaty", price: "$140,000", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=100&q=70" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Buy Requests</h1>
          <p className="text-gray-500 text-sm mt-0.5">{MOCK.length} active requests</p>
        </div>
        <Link to="/create/buy-request" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={16} /> Add Buy Request
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Request #</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Categories</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Location</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Budget</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Matches</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK.map((r, i) => (
                <tr key={r.id} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                  <td className="px-4 py-3 font-bold text-gray-900">{r.id}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {r.categories.map(c => <span key={c} className="bg-blue-50 text-blue-700 text-xs font-semibold px-2 py-0.5 rounded-full">{c}</span>)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{r.location}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">${r.budgetMin.toLocaleString()} – ${r.budgetMax.toLocaleString()}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[r.status]}`}>{r.status}</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setMatchPanel(r)} className="flex items-center gap-1 font-bold text-orange-500 hover:text-orange-600">
                      <Eye size={14} /> {r.matches}
                    </button>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{r.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title="Edit" className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Edit size={14} /></button>
                      <button title="View Matches" onClick={() => setMatchPanel(r)} className="w-7 h-7 rounded-lg hover:bg-orange-50 text-orange-500 flex items-center justify-center"><Eye size={14} /></button>
                      <button title="Deactivate" className="w-7 h-7 rounded-lg hover:bg-yellow-50 text-yellow-600 flex items-center justify-center"><PauseCircle size={14} /></button>
                      <button title="Delete" className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Matches Side Panel */}
      {matchPanel && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setMatchPanel(null)} />
          <div className="fixed top-0 right-0 h-full w-80 bg-white shadow-2xl z-50 flex flex-col">
            <div className="flex items-center justify-between px-5 py-4 border-b">
              <h3 className="font-bold text-gray-900">Matching Properties</h3>
              <button onClick={() => setMatchPanel(null)} className="text-gray-400 hover:text-gray-700"><X size={18} /></button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              <p className="text-sm text-gray-500 mb-4">Request: <span className="font-bold text-gray-900">{matchPanel.id}</span></p>
              {MOCK_MATCHES.map(m => (
                <div key={m.id} className="flex gap-3 p-3 rounded-lg border border-gray-100 hover:bg-gray-50">
                  <img src={m.image} alt={m.title} className="w-16 h-14 object-cover rounded-lg flex-shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{m.title}</p>
                    <p className="text-sm font-black text-orange-500 mt-1">{m.price}</p>
                    <Link to={`/property/${m.id}`} className="text-xs text-blue-600 hover:underline mt-1 inline-block">View Details →</Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}