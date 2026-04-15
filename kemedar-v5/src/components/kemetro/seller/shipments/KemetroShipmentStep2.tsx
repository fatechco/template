"use client";
// @ts-nocheck
import { useState } from "react";
import { Star, X } from "lucide-react";

const MOCK_SHIPPERS = [
  { id: "s1", name: "FastDeliver Co.", type: "Company", verified: true, cities: ["Cairo", "Giza", "Alexandria"], vehicles: ["Small Van", "Large Van"], rating: 4.8, reviews: 234, baseRate: "$2.5/km", deliveries: 1240 },
  { id: "s2", name: "Ahmed Transport", type: "Individual", verified: true, cities: ["Cairo", "Giza"], vehicles: ["Motorcycle", "Small Van"], rating: 4.6, reviews: 87, baseRate: "$1.5/km", deliveries: 420 },
  { id: "s3", name: "EgyptFreight Ltd.", type: "Freight Company", verified: true, cities: ["Cairo", "Alexandria", "Luxor", "Aswan"], vehicles: ["Truck", "Container Truck"], rating: 4.9, reviews: 512, baseRate: "$3/km", deliveries: 2100 },
  { id: "s4", name: "City Riders", type: "Individual", verified: false, cities: ["Cairo"], vehicles: ["Motorcycle"], rating: 4.2, reviews: 43, baseRate: "$1/km", deliveries: 180 },
  { id: "s5", name: "NileShip", type: "Company", verified: true, cities: ["Cairo", "Giza", "Luxor"], vehicles: ["Large Van", "Truck"], rating: 4.7, reviews: 167, baseRate: "$2.8/km", deliveries: 890 },
];

const VEHICLE_ICONS = { Motorcycle: "🏍", "Small Van": "🚐", "Large Van": "🚚", Truck: "🚛", "Container Truck": "🏗" };

function SelectShipperModal({ shipper, onConfirm, onClose }) {
  const [price, setPrice] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [message, setMessage] = useState("");
  const inputClass = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6 border-b flex items-center justify-between">
          <h3 className="font-black text-gray-900">Confirm Shipper Selection</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-teal-100 rounded-full flex items-center justify-center text-lg">🚚</div>
            <div>
              <p className="font-black text-gray-900">{shipper.name}</p>
              <p className="text-xs text-gray-500">{shipper.type} · ⭐ {shipper.rating}</p>
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Agreed Price (USD)</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inputClass} placeholder="0.00" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Expected Pickup</label>
              <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className={inputClass} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Expected Delivery</label>
              <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className={inputClass} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Message to Shipper</label>
            <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" placeholder="Any special instructions..." />
          </div>
        </div>
        <div className="p-6 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
          <button onClick={() => onConfirm({ shipper, price, pickupDate, deliveryDate, message })} className="flex-1 bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl transition-colors">Confirm Selection</button>
        </div>
      </div>
    </div>
  );
}

export default function KemetroShipmentStep2({ data, onChange, onNext, onBack }) {
  const [mode, setMode] = useState("bids");
  const [maxBudget, setMaxBudget] = useState("");
  const [bidDeadline, setBidDeadline] = useState("");
  const [modalShipper, setModalShipper] = useState(null);

  const handleConfirmShipper = (selection) => {
    onChange({ ...data, shipperMode: "direct", selectedShipper: selection });
    setModalShipper(null);
    onNext();
  };

  const handlePostBids = () => {
    onChange({ ...data, shipperMode: "bids", maxBudget, bidDeadline });
    onNext();
  };

  return (
    <div className="space-y-6">
      {/* Mode selector */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { id: "bids", label: "Let shippers bid on my request", icon: "📣" },
          { id: "browse", label: "Browse and choose a shipper directly", icon: "🔍" },
        ].map(m => (
          <button key={m.id} type="button" onClick={() => setMode(m.id)}
            className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${mode === m.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-gray-300"}`}>
            <span className="text-xl flex-shrink-0">{m.icon}</span>
            <span className={`font-bold text-sm ${mode === m.id ? "text-orange-700" : "text-gray-700"}`}>{m.label}</span>
          </button>
        ))}
      </div>

      {mode === "bids" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
            📢 Registered shippers covering <strong>{data.pickupCity || "pickup city"}</strong> → <strong>{data.deliveryCity || "delivery city"}</strong> will see your request and submit bids. You then choose the best offer.
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Maximum Budget (optional)</label>
              <input type="number" value={maxBudget} onChange={e => setMaxBudget(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" placeholder="0.00 USD" />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Bid Deadline</label>
              <input type="datetime-local" value={bidDeadline} onChange={e => setBidDeadline(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={onBack} className="flex-1 border border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50">← Back</button>
            <button onClick={handlePostBids} className="flex-1 bg-[#FF6B00] hover:bg-orange-600 text-white font-black py-3 rounded-xl transition-colors">Post for Bids →</button>
          </div>
        </div>
      )}

      {mode === "browse" && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 flex-wrap text-sm">
            <select className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option>All Vehicle Types</option>
              {["Motorcycle", "Small Van", "Large Van", "Truck", "Container Truck"].map(v => <option key={v}>{v}</option>)}
            </select>
            <input type="number" placeholder="Max price (USD)" className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none w-36" />
            <select className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
              <option>Min Rating: Any</option>
              {[4, 4.5, 4.8].map(r => <option key={r}>⭐ {r}+</option>)}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {MOCK_SHIPPERS.map(s => (
              <div key={s.id} className="bg-white border border-gray-200 rounded-xl p-5 space-y-3 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 bg-teal-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">🚚</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="font-black text-gray-900 text-sm">{s.name}</p>
                      {s.verified && <span className="text-xs text-green-700 bg-green-100 px-1.5 py-0.5 rounded-full font-bold">✅ Verified</span>}
                    </div>
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full font-medium">{s.type}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Star size={13} className="fill-yellow-400 text-yellow-400" />
                  <span className="font-bold text-gray-900">{s.rating}</span>
                  <span className="text-gray-400">({s.reviews} reviews)</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {s.vehicles.map(v => <span key={v} className="text-xs bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">{VEHICLE_ICONS[v]} {v}</span>)}
                </div>
                <p className="text-xs text-gray-500">📍 {s.cities.join(", ")}</p>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Base: <strong className="text-gray-900">{s.baseRate}</strong></span>
                  <span>{s.deliveries.toLocaleString()} deliveries</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <button className="border border-teal-500 text-teal-700 font-bold py-2 rounded-lg text-xs hover:bg-teal-50 transition-colors">Request Quote</button>
                  <button onClick={() => setModalShipper(s)} className="bg-[#FF6B00] hover:bg-orange-600 text-white font-bold py-2 rounded-lg text-xs transition-colors">Select</button>
                </div>
              </div>
            ))}
          </div>

          <button onClick={onBack} className="border border-gray-200 text-gray-700 font-bold py-3 px-6 rounded-xl hover:bg-gray-50">← Back</button>
        </div>
      )}

      {modalShipper && (
        <SelectShipperModal shipper={modalShipper} onConfirm={handleConfirmShipper} onClose={() => setModalShipper(null)} />
      )}
    </div>
  );
}