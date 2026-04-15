"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

export default function KemeKitFreightJobCard({ job }) {
  const [status, setStatus] = useState(null);

  const handleAccept = async () => {
    setStatus("loading");
    try {
      await apiClient.put("/api/v1/kemetroshipmentrequest/", job.id, { status: "accepted" });
      setStatus("accepted");
    } catch { setStatus(null); }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-blue-100" style={{ borderTop: "3px solid #0A6EBD" }}>
      {/* Kit Job Badge */}
      <div className="px-4 pt-3 pb-1">
        <span className="bg-blue-100 text-blue-700 text-xs font-black px-3 py-1 rounded-full">
          📦 KemeKit Freight Job
        </span>
      </div>

      <div className="px-4 py-3 space-y-2">
        <p className="font-black text-gray-900 text-sm line-clamp-2">{job.kitTitle || "KemeKit Delivery"}</p>

        <div className="flex items-center gap-2">
          <span className="text-orange-600 font-black text-base">
            {(job.totalWeightKg || 0).toLocaleString()} kg
          </span>
          <span className="text-xs bg-orange-50 border border-orange-200 text-orange-600 font-bold px-2 py-0.5 rounded-full">
            HEAVY
          </span>
        </div>

        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-gray-500">
          <div>📍 Pickup: <span className="font-semibold text-gray-800">{job.pickupCity || job.pickupAddress || "—"}</span></div>
          <div>🏠 Delivery: <span className="font-semibold text-gray-800">{job.deliveryCity || job.deliveryAddress || "—"}</span></div>
          {job.distanceKm && <div>📏 Distance: <span className="font-semibold text-gray-800">{job.distanceKm} km</span></div>}
          <div>💰 Earnings: <span className="font-black text-green-600 text-sm">{(job.shippingCostEGP || 0).toLocaleString()} EGP</span></div>
        </div>

        <div className="flex items-center gap-1.5 text-orange-500 text-xs font-semibold">
          ⚠️ Requires: Pickup truck or larger vehicle
        </div>
      </div>

      <div className="px-4 pb-4">
        {status === "accepted" ? (
          <div className="w-full text-center py-3 rounded-xl bg-green-50 text-green-700 font-bold text-sm">
            ✅ Freight job accepted!
          </div>
        ) : (
          <button
            onClick={handleAccept}
            disabled={status === "loading"}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-3 rounded-xl transition-colors"
          >
            {status === "loading" ? "Accepting..." : "✅ Accept Freight Job"}
          </button>
        )}
      </div>
    </div>
  );
}