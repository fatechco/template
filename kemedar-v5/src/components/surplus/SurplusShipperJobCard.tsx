"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";
import { Weight, MapPin, Truck, ChevronRight, Eye } from "lucide-react";

export default function SurplusShipperJobCard({ shipment, onAccepted }) {
  const [accepting, setAccepting] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const handleAccept = async () => {
    setAccepting(true);
    try {
      const user = await apiClient.get("/api/auth/session");
      await apiClient.put("/api/v1/surplusshipmentrequest/", shipment.id, {
        status: "accepted",
        assignedShipperId: user.id,
      });
      setAccepted(true);
      onAccepted?.(shipment.id);
    } catch (e) {
      console.error(e);
    }
    setAccepting(false);
  };

  if (accepted) {
    return (
      <div className="rounded-2xl border-l-4 border-green-600 bg-green-50 p-5 text-center">
        <p className="text-2xl mb-2">✅</p>
        <p className="font-black text-green-800 text-base">Job Accepted!</p>
        <p className="text-xs text-green-600 mt-1">Seller address and buyer contact have been sent to your phone.</p>
      </div>
    );
  }

  const earn = Number(shipment.shippingCostEGP || 0).toLocaleString();

  return (
    <div className="rounded-2xl border-l-4 border-green-600 bg-white shadow-sm p-4">
      {/* Badge */}
      <div className="flex items-center justify-between mb-3">
        <span className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full">
          ♻️ Surplus Heavy Load
        </span>
        {shipment.estimatedWeightKg && (
          <span className="flex items-center gap-1 text-orange-600 font-bold text-sm">
            <Weight size={14} /> {shipment.estimatedWeightKg} kg
          </span>
        )}
      </div>

      {/* Route */}
      <div className="flex items-start gap-3 mb-3">
        <div className="flex flex-col items-center gap-0.5 pt-1">
          <div className="w-3 h-3 rounded-full bg-green-500 flex-shrink-0" />
          <div className="w-0.5 h-10 bg-gray-200 flex-shrink-0" />
          <div className="w-3 h-3 rounded-full bg-orange-500 flex-shrink-0" />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Pickup</p>
            <p className="text-xs font-bold text-gray-800">{shipment.pickupAddress}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide">Delivery</p>
            <p className="text-xs font-bold text-gray-800">{shipment.deliveryAddress}</p>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1">
          <Truck size={12} /> Arrange with buyer
        </div>
        <div className="flex items-center gap-1 ml-auto">
          <span className="text-green-700 font-black text-base">{earn} EGP</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <a
          href={`/kemetro/surplus/${shipment.surplusItemId}`}
          className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-xl text-xs font-bold hover:bg-gray-50 transition-colors"
        >
          <Eye size={13} /> View Item
        </a>
        <button
          onClick={handleAccept}
          disabled={accepting}
          className="flex-1 flex items-center justify-center gap-1.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold py-2 disabled:opacity-50 transition-colors"
        >
          {accepting ? (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <><span>✅</span> Accept This Job</>
          )}
        </button>
      </div>
    </div>
  );
}