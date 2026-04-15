"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { X, Clock } from "lucide-react";
import SurplusShipperJobCard from "@/components/surplus/SurplusShipperJobCard";
import { apiClient } from "@/lib/api-client";

const MOCK_REQUESTS = [
  { id: "SHP-2025-010", pickupCity: "Cairo", deliveryCity: "Alexandria", weight: 250, packages: 5, fragile: true, coldChain: false, heavyEquipment: false, declaredValue: 1500, postedHoursAgo: 2, bidDeadline: "24h left", bids: 3, maxBudget: 120, hasDirect: false },
  { id: "SHP-2025-011", pickupCity: "Giza", deliveryCity: "Cairo", weight: 80, packages: 2, fragile: false, coldChain: true, heavyEquipment: false, declaredValue: 500, postedHoursAgo: 5, bidDeadline: "18h left", bids: 1, maxBudget: null, hasDirect: true },
  { id: "SHP-2025-012", pickupCity: "Cairo", deliveryCity: "Luxor", weight: 400, packages: 8, fragile: false, coldChain: false, heavyEquipment: true, declaredValue: 3000, postedHoursAgo: 1, bidDeadline: "23h left", bids: 0, maxBudget: 200, hasDirect: false },
  { id: "SHP-2025-013", pickupCity: "Alexandria", deliveryCity: "Cairo", weight: 40, packages: 1, fragile: true, coldChain: false, heavyEquipment: false, declaredValue: 800, postedHoursAgo: 8, bidDeadline: "16h left", bids: 5, maxBudget: 60, hasDirect: false },
];

function BidModal({ request, onClose, onSubmit }) {
  const [price, setPrice] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [message, setMessage] = useState("");
  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-black text-gray-900">Submit Bid — {request.id}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Your Price (USD) *</label>
            <input type="number" value={price} onChange={e => setPrice(e.target.value)} className={inp} placeholder="0.00" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Est. Pickup Date</label>
              <input type="date" value={pickupDate} onChange={e => setPickupDate(e.target.value)} className={inp} />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Est. Delivery Date</label>
              <input type="date" value={deliveryDate} onChange={e => setDeliveryDate(e.target.value)} className={inp} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Message to Seller</label>
            <textarea rows={3} value={message} onChange={e => setMessage(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 resize-none" placeholder="Any notes or questions..." />
          </div>
        </div>
        <div className="p-5 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
          <button onClick={() => { onSubmit({ price, pickupDate, deliveryDate, message }); onClose(); }} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition-colors">Submit Bid</button>
        </div>
      </div>
    </div>
  );
}

export default function KemetroShipperRequests() {
  const [cityFilter, setCityFilter] = useState("");
  const [bidModal, setBidModal] = useState(null);
  const [surplusJobs, setSurplusJobs] = useState([]);

  useEffect(() => {
    apiClient.list("/api/v1/surplusshipmentrequest", { status: "open" }, "-created_date", 20)
      .then(data => setSurplusJobs(data || []))
      .catch(() => {});
  }, []);

  const handleSurplusAccepted = (id) => setSurplusJobs(j => j.filter(x => x.id !== id));

  const filtered = MOCK_REQUESTS.filter(r =>
    !cityFilter || r.pickupCity.toLowerCase().includes(cityFilter.toLowerCase()) || r.deliveryCity.toLowerCase().includes(cityFilter.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Available Requests</h1>
        <p className="text-gray-500 text-sm mt-1">Shipment requests within your coverage area</p>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 flex-wrap text-sm">
        <input value={cityFilter} onChange={e => setCityFilter(e.target.value)} placeholder="Filter by city..." className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none" />
        <select className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
          <option>Any Weight</option>
          <option>0–100 kg</option>
          <option>100–500 kg</option>
          <option>500+ kg</option>
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 focus:outline-none">
          <option>All Payment Types</option>
          <option>COD</option>
          <option>Prepaid</option>
        </select>
      </div>

      {/* Surplus Heavy Load jobs */}
      {surplusJobs.length > 0 && (
        <div>
          <p className="text-sm font-black text-green-700 mb-3 flex items-center gap-2">
            ♻️ Surplus Heavy Loads <span className="bg-green-100 text-green-700 text-xs px-2 py-0.5 rounded-full">{surplusJobs.length} open</span>
          </p>
          <div className="space-y-3 mb-6">
            {surplusJobs.map(job => (
              <SurplusShipperJobCard key={job.id} shipment={job} onAccepted={handleSurplusAccepted} />
            ))}
          </div>
          <div className="border-t border-gray-200 pt-4 mb-4">
            <p className="text-sm font-bold text-gray-500">Standard Shipment Requests</p>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {filtered.map(r => (
          <div key={r.id} className="bg-white border border-gray-200 rounded-xl p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between flex-wrap gap-3">
              <div className="space-y-2 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-black text-gray-800 bg-gray-100 px-2 py-1 rounded">{r.id}</span>
                  <span className="font-bold text-gray-900">{r.pickupCity}</span>
                  <span className="text-gray-400">→</span>
                  <span className="font-bold text-gray-900">{r.deliveryCity}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>⚖️ <strong>{r.weight} kg</strong></span>
                  <span>📦 {r.packages} packages</span>
                  <span>💰 Declared: ${r.declaredValue}</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  {r.fragile && <span className="text-xs bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full font-bold">⚠️ Fragile</span>}
                  {r.coldChain && <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-bold">❄️ Cold Chain</span>}
                  {r.heavyEquipment && <span className="text-xs bg-gray-100 text-gray-700 px-2 py-0.5 rounded-full font-bold">🔨 Heavy Equipment</span>}
                </div>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span>Posted {r.postedHoursAgo}h ago</span>
                  <span className="flex items-center gap-1"><Clock size={11} /> {r.bidDeadline}</span>
                  <span>{r.bids} bids so far</span>
                  {r.maxBudget && <span className="font-bold text-green-700">Budget: ${r.maxBudget} max</span>}
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setBidModal(r)} className="border border-teal-500 text-teal-700 font-bold px-4 py-2 rounded-xl text-sm hover:bg-teal-50 transition-colors">Submit Bid</button>
                {r.hasDirect && <button className="bg-[#FF6B00] hover:bg-orange-600 text-white font-bold px-4 py-2 rounded-xl text-sm transition-colors">Accept Directly</button>}
              </div>
            </div>
          </div>
        ))}
      </div>

      {bidModal && <BidModal request={bidModal} onClose={() => setBidModal(null)} onSubmit={() => {}} />}
    </div>
  );
}