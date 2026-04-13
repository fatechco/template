import { MapPin, Package, DollarSign, Clock, Truck } from "lucide-react";

const STATUS_COLORS = {
  "Pending Pickup": "bg-yellow-100 text-yellow-700",
  "Assigned": "bg-blue-100 text-blue-700",
  "Picked Up": "bg-purple-100 text-purple-700",
  "In Transit": "bg-cyan-100 text-cyan-700",
  "Delivered": "bg-green-100 text-green-700",
  "Failed": "bg-red-100 text-red-700",
  "Cancelled": "bg-gray-100 text-gray-700",
};

export default function ShipmentList({ shipments, onSelect }) {
  return (
    <div className="space-y-3">
      {shipments.map((ship) => (
        <button
          key={ship.id}
          onClick={() => onSelect(ship)}
          className="w-full text-left bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-all active:bg-gray-50"
        >
          {/* Header */}
          <div className="flex items-start justify-between mb-3 pb-3 border-b border-gray-100">
            <div>
              <p className="font-bold text-gray-900 text-sm">{ship.id}</p>
              <p className="text-xs text-gray-500 mt-0.5">Order {ship.orderId}</p>
            </div>
            <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[ship.status]}`}>
              {ship.status}
            </span>
          </div>

          {/* Route */}
          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase mb-0.5">Pickup</p>
              <p className="font-bold text-gray-900 text-sm">{ship.from}</p>
            </div>
            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              <Truck size={16} className="text-blue-600" />
              <span className="text-xs text-gray-500">{ship.distance}</span>
            </div>
            <div className="flex-1 text-right">
              <p className="text-xs text-gray-500 uppercase mb-0.5">Delivery</p>
              <p className="font-bold text-gray-900 text-sm">{ship.to}</p>
            </div>
          </div>

          {/* Package Info */}
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <Package size={14} /> {ship.weight}
            </span>
            <span>•</span>
            <span>{ship.type}</span>
            <span>•</span>
            <span className="font-bold text-blue-600">${ship.agreed_price.toFixed(2)}</span>
          </div>

          {/* Timeline */}
          <div className="flex items-center gap-2 mb-3 px-2 py-2 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <div className="flex gap-1">
                {["Assigned", "Picked Up", "In Transit", "Delivered"].map((step, i) => (
                  <div key={i} className="flex-1 h-1 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${
                        ["Assigned", "Picked Up", "In Transit"].includes(ship.status)
                          ? i < ["Assigned", "Picked Up", "In Transit"].indexOf(ship.status) + 1
                            ? "bg-green-500"
                            : i === ["Assigned", "Picked Up", "In Transit"].indexOf(ship.status) + 1
                            ? "bg-blue-500"
                            : "bg-gray-200"
                          : ship.status === "Delivered"
                          ? "bg-green-500"
                          : "bg-gray-200"
                      }`}
                    />
                  </div>
                ))}
              </div>
              <p className="text-xs text-gray-500 mt-1">{ship.status}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Created: {ship.created}</span>
            {ship.delivered ? (
              <span className="text-green-600 font-bold">Delivered: {ship.delivered}</span>
            ) : ship.estimated_delivery ? (
              <span className="text-blue-600">Est: {ship.estimated_delivery}</span>
            ) : null}
          </div>
        </button>
      ))}
    </div>
  );
}