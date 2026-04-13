import { useState } from "react";
import { Copy, Check } from "lucide-react";

export default function KemetroShipmentStep3({ data, onBack, onConfirm }) {
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const shipmentNum = "SHP-2025-" + String(Math.floor(Math.random() * 9000) + 1000);

  const handleConfirm = () => {
    onConfirm();
    setConfirmed(true);
  };

  const copy = () => {
    navigator.clipboard.writeText(shipmentNum);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (confirmed) {
    return (
      <div className="text-center py-8 space-y-5">
        <div className="text-5xl">✅</div>
        <h3 className="text-2xl font-black text-gray-900">Shipment Created!</h3>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 inline-block">
          <p className="text-sm text-gray-500 mb-1">Shipment Number</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-black text-[#FF6B00]">{shipmentNum}</span>
            <button onClick={copy} className="text-gray-500 hover:text-gray-700">
              {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
            </button>
          </div>
        </div>
        <p className="text-gray-500">
          Status: <span className={`font-bold ${data.shipperMode === "bids" ? "text-blue-600" : "text-purple-600"}`}>
            {data.shipperMode === "bids" ? "Posted for Bids" : "Assigned"}
          </span>
        </p>
        <div className="flex gap-3 justify-center">
          <button className="bg-[#FF6B00] hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors">View Shipment</button>
          <button onClick={() => window.location.href = "/kemetro/seller/shipments"} className="border border-gray-200 text-gray-700 font-bold px-6 py-3 rounded-xl hover:bg-gray-50 transition-colors">Back to Shipments</button>
        </div>
      </div>
    );
  }

  const shipper = data.selectedShipper;

  return (
    <div className="space-y-5">
      <h3 className="font-black text-gray-900 text-lg">Review & Confirm</h3>

      {/* Route visual */}
      <div className="bg-gradient-to-r from-blue-50 to-orange-50 rounded-xl border border-gray-200 p-5">
        <div className="flex items-center gap-3">
          <div className="text-center">
            <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-sm mx-auto">A</div>
            <p className="font-black text-gray-900 mt-2 text-sm">{data.pickupCity || "Pickup City"}</p>
            <p className="text-xs text-gray-500 mt-1 max-w-28 truncate">{data.pickupAddress || "—"}</p>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2">
            <div className="h-0.5 flex-1 bg-gray-300" />
            <span className="text-xl">🚚</span>
            <div className="h-0.5 flex-1 bg-gray-300" />
          </div>
          <div className="text-center">
            <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-black text-sm mx-auto">B</div>
            <p className="font-black text-gray-900 mt-2 text-sm">{data.deliveryCity || "Delivery City"}</p>
            <p className="text-xs text-gray-500 mt-1 max-w-28 truncate">{data.deliveryAddress || "—"}</p>
          </div>
        </div>
      </div>

      {/* Package Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2">
        <h4 className="font-black text-gray-800">📦 Package</h4>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-sm">
          <div className="text-gray-500">Description</div><div className="font-medium text-gray-900">{data.packageDescription || "—"}</div>
          <div className="text-gray-500">Weight</div><div className="font-medium text-gray-900">{data.packageWeight || "—"} {data.weightUnit || "kg"}</div>
          <div className="text-gray-500">Packages</div><div className="font-medium text-gray-900">{data.packageCount || 1}</div>
          <div className="text-gray-500">Dimensions</div><div className="font-medium text-gray-900">{data.packageDimensions || "—"}</div>
          {data.requiresFragileHandling && <><div className="text-gray-500">Special</div><div className="font-medium text-orange-600">Fragile</div></>}
          {data.requiresColdChain && <><div className="text-gray-500">Cold Chain</div><div className="font-medium text-blue-600">Required</div></>}
          {data.codAmount > 0 && <><div className="text-gray-500">COD</div><div className="font-medium text-gray-900">${data.codAmount}</div></>}
        </div>
      </div>

      {/* Shipper Summary */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-2">
        <h4 className="font-black text-gray-800">🚚 Shipper</h4>
        {data.shipperMode === "bids" ? (
          <div className="flex items-center gap-3 bg-blue-50 rounded-lg p-3">
            <span className="text-2xl">📣</span>
            <div>
              <p className="font-bold text-blue-800">Posted for Bids</p>
              <p className="text-xs text-blue-600">Shippers will submit offers for your request</p>
            </div>
          </div>
        ) : shipper ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center text-lg">🚚</div>
              <div>
                <p className="font-black text-gray-900">{shipper.shipper?.name}</p>
                <p className="text-xs text-gray-500">{shipper.shipper?.type}</p>
              </div>
            </div>
            {shipper.price && <span className="font-black text-[#FF6B00] text-lg">${shipper.price}</span>}
          </div>
        ) : null}
      </div>

      <div className="flex gap-3">
        <button onClick={onBack} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3.5 rounded-xl hover:bg-gray-50 transition-colors">← Edit Details</button>
        <button onClick={handleConfirm} className="flex-1 bg-[#FF6B00] hover:bg-orange-600 text-white font-black py-3.5 rounded-xl transition-colors">✅ Confirm & Create Shipment</button>
      </div>
    </div>
  );
}