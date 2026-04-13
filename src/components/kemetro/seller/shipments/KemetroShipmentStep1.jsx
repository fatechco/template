import { useState } from "react";

const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-colors";
const labelClass = "block text-sm font-bold text-gray-700 mb-1.5";

export default function KemetroShipmentStep1({ data, onChange, onNext }) {
  const [linkOrder, setLinkOrder] = useState(false);

  const set = (k, v) => onChange({ ...data, [k]: v });
  const toggleSpecial = (key) => set(key, !data[key]);

  return (
    <div className="space-y-6">
      {/* Link to Order */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-bold text-gray-800 text-sm">Link to an existing order</p>
            <p className="text-xs text-gray-500 mt-0.5">Auto-fills buyer address as delivery address</p>
          </div>
          <button type="button" onClick={() => setLinkOrder(!linkOrder)}
            className={`w-12 h-6 rounded-full transition-colors relative ${linkOrder ? "bg-orange-500" : "bg-gray-300"}`}>
            <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${linkOrder ? "left-6" : "left-0.5"}`} />
          </button>
        </div>
        {linkOrder && (
          <div className="mt-3">
            <label className={labelClass}>Order Number</label>
            <input value={data.orderId || ""} onChange={e => set("orderId", e.target.value)} className={inputClass} placeholder="Search order #..." />
          </div>
        )}
      </div>

      {/* Pickup Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="font-black text-gray-800 flex items-center gap-2">📍 Pickup Details</h3>
        <div>
          <label className={labelClass}>Pickup Address *</label>
          <input value={data.pickupAddress || ""} onChange={e => set("pickupAddress", e.target.value)} className={inputClass} placeholder="Full pickup address" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Pickup City *</label>
            <input value={data.pickupCity || ""} onChange={e => set("pickupCity", e.target.value)} className={inputClass} placeholder="City" />
          </div>
          <div>
            <label className={labelClass}>Preferred Pickup Date & Time</label>
            <input type="datetime-local" value={data.pickupDate || ""} onChange={e => set("pickupDate", e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Contact Name at Pickup</label>
            <input value={data.pickupContactName || ""} onChange={e => set("pickupContactName", e.target.value)} className={inputClass} placeholder="Contact name" />
          </div>
          <div>
            <label className={labelClass}>Contact Phone at Pickup</label>
            <input value={data.pickupContactPhone || ""} onChange={e => set("pickupContactPhone", e.target.value)} className={inputClass} placeholder="+20 xxx xxx xxxx" />
          </div>
        </div>
      </div>

      {/* Delivery Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="font-black text-gray-800 flex items-center gap-2">🏁 Delivery Details</h3>
        <div>
          <label className={labelClass}>Delivery Address *</label>
          <input value={data.deliveryAddress || ""} onChange={e => set("deliveryAddress", e.target.value)} className={inputClass} placeholder="Full delivery address" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Delivery City *</label>
            <input value={data.deliveryCity || ""} onChange={e => set("deliveryCity", e.target.value)} className={inputClass} placeholder="City" />
          </div>
          <div>
            <label className={labelClass}>Preferred Delivery Date</label>
            <input type="date" value={data.deliveryDate || ""} onChange={e => set("deliveryDate", e.target.value)} className={inputClass} />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Contact Name at Delivery</label>
            <input value={data.deliveryContactName || ""} onChange={e => set("deliveryContactName", e.target.value)} className={inputClass} placeholder="Contact name" />
          </div>
          <div>
            <label className={labelClass}>Contact Phone at Delivery</label>
            <input value={data.deliveryContactPhone || ""} onChange={e => set("deliveryContactPhone", e.target.value)} className={inputClass} placeholder="+20 xxx xxx xxxx" />
          </div>
        </div>
      </div>

      {/* Package Details */}
      <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
        <h3 className="font-black text-gray-800">📦 Package Details</h3>
        <div>
          <label className={labelClass}>Package Description</label>
          <input value={data.packageDescription || ""} onChange={e => set("packageDescription", e.target.value)} className={inputClass} placeholder="e.g. Ceramic tiles, cement bags..." />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>Number of Packages</label>
            <input type="number" min="1" value={data.packageCount || 1} onChange={e => set("packageCount", e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Total Weight</label>
            <input type="number" value={data.packageWeight || ""} onChange={e => set("packageWeight", e.target.value)} className={inputClass} placeholder="0" />
          </div>
          <div>
            <label className={labelClass}>Unit</label>
            <select value={data.weightUnit || "kg"} onChange={e => set("weightUnit", e.target.value)} className={inputClass}>
              <option value="kg">kg</option>
              <option value="ton">ton</option>
            </select>
          </div>
        </div>
        <div>
          <label className={labelClass}>Dimensions (L × W × H cm)</label>
          <input value={data.packageDimensions || ""} onChange={e => set("packageDimensions", e.target.value)} className={inputClass} placeholder="e.g. 100 x 80 x 60" />
        </div>

        {/* Special Handling */}
        <div>
          <label className={labelClass}>Special Handling</label>
          <div className="space-y-2">
            {[
              { key: "requiresFragileHandling", label: "🥚 Fragile — Handle with care" },
              { key: "requiresColdChain", label: "🧊 Cold chain required" },
              { key: "requiresHeavyEquipment", label: "🏗 Heavy equipment needed for unloading" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                <input type="checkbox" checked={!!data[key]} onChange={() => toggleSpecial(key)} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm font-medium text-gray-700">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Declared Value</label>
            <input type="number" value={data.declaredValue || ""} onChange={e => set("declaredValue", e.target.value)} className={inputClass} placeholder="0.00" />
          </div>
          <div>
            <label className={labelClass}>Cash on Delivery (COD)</label>
            <input type="number" value={data.codAmount || ""} onChange={e => set("codAmount", e.target.value)} className={inputClass} placeholder="0 if not applicable" />
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input type="checkbox" checked={!!data.insuranceRequested} onChange={() => toggleSpecial("insuranceRequested")} className="w-4 h-4 accent-orange-500" />
          <span className="text-sm font-medium text-gray-700">🛡 Request Insurance</span>
        </label>

        <div>
          <label className={labelClass}>Notes for Shipper</label>
          <textarea rows={3} value={data.sellerNotes || ""} onChange={e => set("sellerNotes", e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" placeholder="Any special instructions..." />
        </div>
      </div>

      <button onClick={onNext} className="w-full bg-[#FF6B00] hover:bg-orange-600 text-white font-black py-3.5 rounded-xl transition-colors">
        Next: Find Shipper →
      </button>
    </div>
  );
}