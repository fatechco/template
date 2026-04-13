import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Truck, Package, Clock, CheckCircle, AlertCircle } from "lucide-react";

const SHIPMENTS = [
  { id: 1, orderNum: "#ORD-2025-001", product: "Cement 50kg ×10", buyer: "Ahmed Hassan", city: "Cairo", status: "In Transit", date: "Mar 24, 2026", tracker: "KT123456789" },
  { id: 2, orderNum: "#ORD-2025-002", product: "Steel Rods 10mm ×5", buyer: "Fatima Mohamed", city: "Riyadh", status: "Pending Pickup", date: "Mar 23, 2026", tracker: "KT123456790" },
  { id: 3, orderNum: "#ORD-2025-003", product: "Ceramic Tiles ×20", buyer: "Omar Ahmed", city: "Dubai", status: "Delivered", date: "Mar 20, 2026", tracker: "KT123456791" },
];

const STATUS_CONFIG = {
  "Pending Pickup": { color: "bg-yellow-100 text-yellow-700", icon: "⏳" },
  "In Transit": { color: "bg-blue-100 text-blue-700", icon: "🚚" },
  "Delivered": { color: "bg-green-100 text-green-700", icon: "✅" },
  "Cancelled": { color: "bg-red-100 text-red-700", icon: "❌" },
};

export default function SellerShipmentsMobile({ onOpenDrawer }) {
  const [filter, setFilter] = useState("All");
  const navigate = useNavigate();

  const filtered = filter === "All" ? SHIPMENTS : SHIPMENTS.filter(s => s.status === filter);

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={() => navigate(-1)} className="p-1 -ml-1"><ArrowLeft size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-black text-base text-gray-900 text-center">Shipments</span>
        <div className="w-8" />
      </div>

      <div className="pb-8 pt-4 px-4 space-y-4">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Active", value: SHIPMENTS.filter(s => s.status === "In Transit").length, color: "text-blue-600" },
            { label: "Pending", value: SHIPMENTS.filter(s => s.status === "Pending Pickup").length, color: "text-yellow-600" },
            { label: "Delivered", value: SHIPMENTS.filter(s => s.status === "Delivered").length, color: "text-green-600" },
          ].map((stat, i) => (
            <div key={i} className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 text-center">
              <p className={`text-2xl font-black ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500 font-medium mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {["All", "Pending Pickup", "In Transit", "Delivered"].map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors ${
                filter === f ? "bg-[#0077B6] text-white" : "bg-white text-gray-600 border border-gray-200"
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Shipments List */}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
            <Truck size={48} className="mx-auto text-gray-300 mb-3" />
            <p className="font-black text-gray-700">No shipments found</p>
            <p className="text-xs text-gray-400 mt-1">Orders will appear here once shipped</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(shipment => {
              const sc = STATUS_CONFIG[shipment.status];
              return (
                <div key={shipment.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-bold text-gray-500">{shipment.orderNum}</p>
                      <p className="text-sm font-black text-gray-900 mt-1">{shipment.product}</p>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${sc.color}`}>{sc.icon} {shipment.status}</span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
                    <span className="flex items-center gap-1"><Package size={12} /> {shipment.buyer}</span>
                    <span className="flex items-center gap-1"><Clock size={12} /> {shipment.date}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">Tracking:</span>
                      <span className="text-xs font-mono font-bold text-gray-700">{shipment.tracker}</span>
                    </div>
                    <button onClick={() => navigate(`/kemetro/track/${shipment.tracker}`)} className="text-xs font-bold text-[#0077B6] hover:underline">Track →</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}