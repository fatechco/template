import { useState } from "react";
import { Eye } from "lucide-react";

const MOCK_RECENT = [
  { id: "SHP-001", route: "Cairo → Alexandria", weight: "250 kg", price: "$85", status: "In_Transit" },
  { id: "SHP-002", route: "Giza → Cairo", weight: "80 kg", price: "$30", status: "Picked_Up" },
  { id: "SHP-003", route: "Cairo → Luxor", weight: "150 kg", price: "$120", status: "Posted" },
  { id: "SHP-004", route: "Alexandria → Cairo", weight: "40 kg", price: "$25", status: "Delivered" },
  { id: "SHP-005", route: "Cairo → Aswan", weight: "300 kg", price: "$200", status: "Assigned" },
];

const STATUS_STYLES = {
  Posted: "bg-blue-100 text-blue-700", Assigned: "bg-purple-100 text-purple-700",
  Picked_Up: "bg-teal-100 text-teal-700", In_Transit: "bg-orange-100 text-orange-700",
  Delivered: "bg-green-100 text-green-700", Failed: "bg-red-100 text-red-700",
};

export default function KemetroShipperOverview() {
  const [available, setAvailable] = useState(true);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Welcome, FastDeliver Co. 👋</h1>
          <p className="text-gray-500 text-sm mt-1">Here's what's happening today</p>
        </div>
        {/* Availability Toggle */}
        <button onClick={() => setAvailable(!available)}
          className={`flex items-center gap-3 px-5 py-3 rounded-2xl border-2 font-black text-sm transition-all shadow-sm ${available ? "border-green-400 bg-green-50 text-green-700" : "border-red-300 bg-red-50 text-red-700"}`}>
          <div className={`w-5 h-5 rounded-full ${available ? "bg-green-500" : "bg-red-400"}`} />
          {available ? "🟢 Available for Pickups" : "🔴 Not Available"}
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Shipments", value: "3", color: "text-orange-600" },
          { label: "Completed Today", value: "2", color: "text-green-600" },
          { label: "This Month Earnings", value: "$1,240", color: "text-blue-600" },
          { label: "My Rating", value: "⭐ 4.8", color: "text-yellow-600" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-black text-gray-800">Active Shipment Locations</h3>
          <span className="text-xs text-gray-400">3 active pins</span>
        </div>
        <div className="h-56 bg-gradient-to-br from-blue-50 to-teal-50 flex items-center justify-center">
          <div className="text-center text-gray-400">
            <p className="text-4xl mb-2">🗺</p>
            <p className="text-sm font-semibold">Map view — pickup & delivery pins</p>
            <p className="text-xs mt-1">Cairo → Alexandria · Giza → Cairo · Cairo → Luxor</p>
          </div>
        </div>
      </div>

      {/* Recent requests */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b">
          <h3 className="font-black text-gray-800">Recent Requests</h3>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              {["Shipment#", "Route", "Weight", "Offered Price", "Status", "Action"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_RECENT.map((r, i) => (
              <tr key={r.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                <td className="px-4 py-3 font-mono text-xs font-bold">{r.id}</td>
                <td className="px-4 py-3 text-gray-700">{r.route}</td>
                <td className="px-4 py-3 text-gray-600">{r.weight}</td>
                <td className="px-4 py-3 font-bold text-gray-900">{r.price}</td>
                <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[r.status]}`}>{r.status.replace("_", " ")}</span></td>
                <td className="px-4 py-3"><button className="text-blue-600 hover:text-blue-700"><Eye size={14} /></button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}