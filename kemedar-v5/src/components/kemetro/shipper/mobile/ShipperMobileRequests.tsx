// @ts-nocheck
import { MapPin, Package, DollarSign, Clock, Check, X } from "lucide-react";

const REQUESTS = [
  { id: "REQ-001", from: "Cairo", to: "Alexandria", distance: "225 km", rate: "$95", pickup: "Urgent", time: "ASAP", status: "Pending" },
  { id: "REQ-002", from: "Giza", to: "Cairo", distance: "35 km", rate: "$65", pickup: "Standard", time: "Today", status: "Pending" },
  { id: "REQ-003", from: "Helwan", to: "New Cairo", distance: "45 km", rate: "$75", pickup: "Scheduled", time: "Tomorrow", status: "Pending" },
  { id: "REQ-004", from: "6th October", to: "Giza", distance: "60 km", rate: "$85", pickup: "Standard", time: "Today", status: "Pending" },
];

export default function ShipperMobileRequests() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Shipment Requests</h1>
        <p className="text-gray-500 text-sm mt-1">{REQUESTS.length} new requests</p>
      </div>

      <div className="space-y-3">
        {REQUESTS.map((req) => (
          <div key={req.id} className="bg-white border border-blue-200 rounded-lg p-4 space-y-3">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-900 text-sm">{req.id}</p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><MapPin size={12} /> {req.from} → {req.to}</p>
              </div>
              <span className="bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded">{req.status}</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="text-gray-600">Distance: <span className="font-bold text-gray-900">{req.distance}</span></div>
              <div className="text-gray-600">Rate: <span className="font-bold text-green-600">{req.rate}</span></div>
              <div className="text-gray-600">Type: <span className="font-bold text-gray-900">{req.pickup}</span></div>
              <div className="text-gray-600">Pickup: <span className="font-bold text-gray-900">{req.time}</span></div>
            </div>

            <div className="flex gap-2 pt-2">
              <button className="flex-1 flex items-center justify-center gap-1 bg-green-600 hover:bg-green-700 text-white font-bold text-xs py-2 rounded-lg transition-colors">
                <Check size={14} /> Accept
              </button>
              <button className="flex-1 flex items-center justify-center gap-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-bold text-xs py-2 rounded-lg transition-colors">
                <X size={14} /> Decline
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}