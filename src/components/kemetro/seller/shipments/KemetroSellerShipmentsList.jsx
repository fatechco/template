import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, MapPin, RefreshCw, X, Plus } from "lucide-react";

const MOCK_SHIPMENTS = [
  { id: "SHP-001", shipmentNum: "SHP-2025-001", orderNum: "ORD-2025-001", buyer: "Ahmed Hassan", pickupCity: "Cairo", deliveryCity: "Alexandria", weight: "50 kg", status: "In_Transit", shipper: "FastDeliver Co.", price: "$45.00", date: "2025-03-10" },
  { id: "SHP-002", shipmentNum: "SHP-2025-002", orderNum: "ORD-2025-002", buyer: "Sara Mohamed", pickupCity: "Giza", deliveryCity: "Cairo", weight: "120 kg", status: "Delivered", shipper: "QuickShip", price: "$30.00", date: "2025-03-08" },
  { id: "SHP-003", shipmentNum: "SHP-2025-003", orderNum: "ORD-2025-003", buyer: "Omar Khalil", pickupCity: "Cairo", deliveryCity: "Luxor", weight: "200 kg", status: "Posted", shipper: "—", price: "—", date: "2025-03-12" },
  { id: "SHP-004", shipmentNum: "SHP-2025-004", orderNum: "ORD-2025-004", buyer: "Layla Hassan", pickupCity: "Cairo", deliveryCity: "Aswan", weight: "80 kg", status: "Draft", shipper: "—", price: "—", date: "2025-03-13" },
  { id: "SHP-005", shipmentNum: "SHP-2025-005", orderNum: "ORD-2025-005", buyer: "Karim Nasser", pickupCity: "Alexandria", deliveryCity: "Cairo", weight: "35 kg", status: "Assigned", shipper: "EgyptExpress", price: "$25.00", date: "2025-03-09" },
];

const STATUS_STYLES = {
  Draft: "bg-gray-100 text-gray-600",
  Posted: "bg-blue-100 text-blue-700",
  Assigned: "bg-purple-100 text-purple-700",
  Picked_Up: "bg-teal-100 text-teal-700",
  In_Transit: "bg-orange-100 text-orange-700",
  Out_for_Delivery: "bg-yellow-100 text-yellow-700",
  Delivered: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
  Returned: "bg-yellow-100 text-yellow-800",
  Cancelled: "bg-gray-100 text-gray-500",
};

export default function KemetroSellerShipmentsList({ onViewDetail }) {
  const navigate = useNavigate();
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const stats = [
    { label: "Total Shipments", value: MOCK_SHIPMENTS.length, color: "text-gray-900" },
    { label: "Pending Assignment", value: MOCK_SHIPMENTS.filter(s => s.status === "Posted" || s.status === "Draft").length, color: "text-blue-600" },
    { label: "In Transit", value: MOCK_SHIPMENTS.filter(s => s.status === "In_Transit" || s.status === "Picked_Up").length, color: "text-orange-600" },
    { label: "Delivered This Month", value: MOCK_SHIPMENTS.filter(s => s.status === "Delivered").length, color: "text-green-600" },
  ];

  const filtered = MOCK_SHIPMENTS.filter(s => {
    const matchStatus = statusFilter === "all" || s.status === statusFilter;
    const matchSearch = !search || s.shipmentNum.toLowerCase().includes(search.toLowerCase()) || s.orderNum.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Shipments</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your delivery requests</p>
        </div>
        <button onClick={() => navigate("/kemetro/seller/shipments/create")} className="flex items-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-xl transition-colors text-sm">
          <Plus size={16} /> Create New Shipment
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className={`text-3xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 flex gap-3 flex-wrap">
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none">
          <option value="all">All Statuses</option>
          {Object.keys(STATUS_STYLES).map(s => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by order# or shipment#..." className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none flex-1 min-w-48" />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Shipment#", "Order#", "Buyer", "Route", "Weight", "Status", "Shipper", "Price", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-4 py-3 font-mono text-xs font-bold text-gray-900">{s.shipmentNum}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.orderNum}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.buyer}</td>
                  <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                    <span className="font-semibold">{s.pickupCity}</span>
                    <span className="text-gray-400 mx-1">→</span>
                    <span className="font-semibold">{s.deliveryCity}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{s.weight}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[s.status]}`}>{s.status.replace("_", " ")}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{s.shipper}</td>
                  <td className="px-4 py-3 font-semibold text-gray-900">{s.price}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.date}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button onClick={() => onViewDetail(s.id)} className="text-blue-600 hover:text-blue-700 p-1 rounded" title="View"><Eye size={14} /></button>
                      <button className="text-teal-600 hover:text-teal-700 p-1 rounded" title="Track"><MapPin size={14} /></button>
                      <button className="text-purple-600 hover:text-purple-700 p-1 rounded" title="Reassign"><RefreshCw size={14} /></button>
                      <button className="text-red-500 hover:text-red-600 p-1 rounded" title="Cancel"><X size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}