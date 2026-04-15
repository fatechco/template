// @ts-nocheck
import { MapPin, Phone, Clock, CheckCircle } from "lucide-react";

const SHIPMENTS = [
  { id: "SHP-001", from: "Cairo", to: "Alexandria", status: "In Transit", progress: 65, pickup: "Ahmed Hassan", phone: "+20 100 123 4567", amount: "$85", eta: "2 hours" },
  { id: "SHP-002", from: "Giza", to: "Cairo", status: "Picked Up", progress: 25, pickup: "Fatima Mohamed", phone: "+20 100 234 5678", amount: "$65", eta: "30 min" },
  { id: "SHP-003", from: "Helwan", to: "Giza", status: "Assigned", progress: 0, pickup: "Omar Ali", phone: "+20 100 345 6789", amount: "$55", eta: "Pending" },
];

export default function ShipperMobileActiveShipments() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Active Shipments</h1>
        <p className="text-gray-500 text-sm mt-1">{SHIPMENTS.length} active shipments</p>
      </div>

      <div className="space-y-3">
        {SHIPMENTS.map((ship) => (
          <div key={ship.id} className="bg-white border border-gray-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-900 text-sm">{ship.id}</p>
                <p className="text-xs text-gray-500 mt-0.5">{ship.from} → {ship.to}</p>
              </div>
              <span className={`text-xs font-bold px-2 py-1 rounded ${ship.status === "In Transit" ? "bg-blue-100 text-blue-700" : ship.status === "Picked Up" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>
                {ship.status}
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-600">Progress</span>
                <span className="font-bold text-gray-900">{ship.progress}%</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${ship.progress}%` }} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 text-gray-600">
                <Phone size={14} /> {ship.phone}
              </div>
              <div className="text-right font-bold text-gray-900">{ship.amount}</div>
            </div>

            <div className="flex items-center gap-2 text-xs text-gray-600 pt-1 border-t border-gray-100">
              <Clock size={14} />
              <span>ETA: {ship.eta}</span>
            </div>

            <button className="w-full text-sm font-bold text-green-600 hover:bg-green-50 py-2 rounded-lg transition-colors">
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}