"use client";
// @ts-nocheck
import { MapPin, Phone, Star, MessageCircle, Copy, CheckCircle, Clock } from "lucide-react";
import { useState } from "react";

export default function ShipmentDetail({ shipment }) {
  const [copied, setCopied] = useState(false);

  const copyTracking = () => {
    navigator.clipboard.writeText(shipment.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const statusSteps = [
    { label: "Assigned", completed: ["In Transit", "Delivered", "Picked Up"].includes(shipment.status) },
    { label: "Picked Up", completed: ["In Transit", "Delivered"].includes(shipment.status) },
    { label: "In Transit", completed: shipment.status === "Delivered" },
    { label: "Delivered", completed: shipment.status === "Delivered" },
  ];

  return (
    <div className="space-y-4">
      {/* Status Timeline */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <p className="font-bold text-gray-900 mb-4">Shipment Status</p>
        <div className="space-y-4">
          {statusSteps.map((step, i) => (
            <div key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                    step.completed
                      ? "bg-green-100 text-green-700"
                      : shipment.status === step.label
                      ? "bg-blue-100 text-blue-700"
                      : "bg-gray-100 text-gray-400"
                  }`}
                >
                  {step.completed ? <CheckCircle size={16} /> : i + 1}
                </div>
                {i < statusSteps.length - 1 && (
                  <div className={`w-0.5 h-12 ${step.completed ? "bg-green-200" : "bg-gray-200"}`} />
                )}
              </div>
              <div className="py-1">
                <p className="font-bold text-gray-900 text-sm">{step.label}</p>
                {step.completed && <p className="text-xs text-gray-500">Completed</p>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Reference */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <p className="text-xs text-gray-500 uppercase mb-2">Linked Order</p>
        <p className="font-bold text-blue-600 text-sm">{shipment.orderId}</p>
      </div>

      {/* Shipper Card */}
      {shipment.shipper && (
        <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
          <p className="font-bold text-gray-900">Shipper</p>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center font-bold text-blue-600 flex-shrink-0">
              {shipment.shipper.name.charAt(0)}
            </div>
            <div className="flex-1">
              <p className="font-bold text-gray-900 text-sm">{shipment.shipper.name}</p>
              <p className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                {shipment.shipper.rating}
              </p>
              <p className="text-xs text-gray-500 mt-0.5">Vehicle: {shipment.shipper.vehicle}</p>
            </div>
          </div>
          <div className="flex gap-2 pt-2">
            <button className="flex-1 flex items-center justify-center gap-1 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold text-xs py-2 rounded-lg transition-colors">
              <Phone size={14} /> Call
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 bg-green-50 hover:bg-green-100 text-green-600 font-bold text-xs py-2 rounded-lg transition-colors">
              <MessageCircle size={14} /> WhatsApp
            </button>
          </div>
        </div>
      )}

      {/* Route Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4 space-y-3">
        <div>
          <p className="text-xs text-orange-600 font-bold uppercase mb-1">Pickup Address</p>
          <div className="flex gap-2">
            <MapPin size={16} className="text-orange-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-900 leading-relaxed">{shipment.address_from}</p>
          </div>
        </div>
        <div className="border-t border-gray-100" />
        <div>
          <p className="text-xs text-blue-600 font-bold uppercase mb-1">Delivery Address</p>
          <div className="flex gap-2">
            <MapPin size={16} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-gray-900 leading-relaxed">{shipment.address_to}</p>
          </div>
        </div>
        <button className="w-full text-xs font-bold text-blue-600 hover:underline pt-2">
          📍 View on Map
        </button>
      </div>

      {/* Package Info */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <p className="font-bold text-gray-900 mb-3">Package Details</p>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Weight</span>
            <span className="font-bold text-gray-900">{shipment.weight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Type</span>
            <span className="font-bold text-gray-900">{shipment.type}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-600">Distance</span>
            <span className="font-bold text-gray-900">{shipment.distance}</span>
          </div>
        </div>
      </div>

      {/* Payment Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <p className="font-bold text-gray-900 mb-3">Payment</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-600">Agreed Price</span>
          <span className="font-black text-blue-600 text-lg">${shipment.agreed_price.toFixed(2)}</span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Status</span>
          <span className="font-bold text-green-600">Paid ✓</span>
        </div>
      </div>

      {/* Tracking Number */}
      <div className="bg-white border border-gray-200 rounded-2xl p-4">
        <button
          onClick={copyTracking}
          className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 p-3 rounded-lg transition-colors"
        >
          <span className="text-xs text-gray-600">📋 {shipment.id}</span>
          <span className="text-xs font-bold text-gray-600">{copied ? "Copied!" : "Copy"}</span>
        </button>
      </div>
    </div>
  );
}