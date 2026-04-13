import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function SurplusShipments() {
  const [shipments, setShipments] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    base44.entities.SurplusShipmentRequest.list("-created_date", 500)
      .then(data => setShipments(data || []))
      .catch(() => {});
  }, []);

  const filtered = shipments.filter(s => filter === "all" || s.status === filter);

  const statusStyle = {
    open: "bg-yellow-100 text-yellow-700",
    accepted: "bg-blue-100 text-blue-700",
    picked_up: "bg-purple-100 text-purple-700",
    delivered: "bg-green-100 text-green-700",
    failed: "bg-red-100 text-red-700",
  };

  return (
    <div className="space-y-6 p-8">
      <h1 className="text-3xl font-black text-gray-900">Surplus Shipments</h1>

      <div className="bg-white rounded-lg border border-gray-200 p-4 flex gap-2 flex-wrap">
        {["all", "open", "accepted", "picked_up", "delivered", "failed"].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-sm font-bold capitalize ${filter === f ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
            {f.replace("_", " ")}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b border-gray-200 bg-gray-50">
            <tr>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Status</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Pickup Address</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Delivery Address</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Weight (kg)</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Cost</th>
              <th className="text-left px-4 py-3 font-bold text-gray-700">Date</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(s => (
              <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${statusStyle[s.status] || "bg-gray-100 text-gray-700"}`}>
                    {s.status?.replace("_", " ")}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-700">{s.pickupAddress}</td>
                <td className="px-4 py-3 text-gray-700">{s.deliveryAddress}</td>
                <td className="px-4 py-3 font-bold">{s.estimatedWeightKg?.toLocaleString()}</td>
                <td className="px-4 py-3 font-bold text-green-700">{s.shippingCostEGP?.toLocaleString()} EGP</td>
                <td className="px-4 py-3 text-gray-600 text-xs">{new Date(s.created_date).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No shipments yet</div>}
      </div>
    </div>
  );
}