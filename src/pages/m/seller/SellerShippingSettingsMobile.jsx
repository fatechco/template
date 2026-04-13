import { useState } from "react";
import { Truck, Globe, Clock, Save, CheckCircle } from "lucide-react";

const SHIPPING_METHODS = [
  { id: "free", label: "🆓 Free Shipping", desc: "You cover all shipping costs" },
  { id: "fixed", label: "📦 Fixed Rate", desc: "Charge flat fee per order" },
  { id: "kemetro", label: "🚚 Kemetro Shipper", desc: "Live quotes from shippers" },
];

const ZONES = [
  { id: 1, region: "Egypt", rate: 15.0 },
  { id: 2, region: "Saudi Arabia", rate: 25.0 },
  { id: 3, region: "UAE", rate: 25.0 },
];

export default function SellerShippingSettingsMobile({ onOpenDrawer }) {
  const [saved, setSaved] = useState(false);
  const [method, setMethod] = useState("fixed");
  const [fixedRate, setFixedRate] = useState(15);
  const [freeThreshold, setFreeThreshold] = useState(100);
  const [processingTime, setProcessingTime] = useState("1-2 Days");

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={onOpenDrawer} className="p-1 -ml-1"><Truck size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-black text-base text-gray-900 text-center">Shipping Settings</span>
        <div className="w-8" />
      </div>

      <div className="pb-8 pt-4 px-4 space-y-4">
        {/* Save Button */}
        <button
          onClick={handleSave}
          className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
            saved ? "bg-green-600 text-white" : "bg-[#0077B6] text-white"
          }`}
        >
          {saved ? <><CheckCircle size={18} /> Saved!</> : <><Save size={18} /> Save Settings</>}
        </button>

        {/* Shipping Method */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3">Default Shipping Method</h3>
          <div className="space-y-2">
            {SHIPPING_METHODS.map(m => (
              <label
                key={m.id}
                className={`flex flex-col gap-1 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                  method === m.id ? "border-[#0077B6] bg-blue-50" : "border-gray-100 hover:border-gray-300"
                }`}
              >
                <input type="radio" name="method" value={m.id} checked={method === m.id} onChange={() => setMethod(m.id)} className="sr-only" />
                <p className="font-black text-gray-900 text-xs">{m.label}</p>
                <p className="text-[10px] text-gray-500">{m.desc}</p>
                {method === m.id && <span className="text-[10px] font-bold text-[#0077B6]">✓ Selected</span>}
              </label>
            ))}
          </div>

          {method === "fixed" && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mt-3">
              <div className="mb-3">
                <label className="text-[10px] font-bold text-gray-600 block mb-1">Fixed Shipping Fee ($)</label>
                <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-white">
                  <span className="px-3 py-2 text-xs text-gray-600 bg-blue-50 border-r border-blue-200 font-bold">$</span>
                  <input type="number" value={fixedRate} onChange={e => setFixedRate(parseFloat(e.target.value) || 0)} className="flex-1 px-3 py-2 text-xs focus:outline-none" />
                </div>
              </div>
              <div>
                <label className="text-[10px] font-bold text-gray-600 block mb-1">Free Shipping Threshold ($)</label>
                <div className="flex items-center border border-blue-200 rounded-lg overflow-hidden bg-white">
                  <span className="px-3 py-2 text-xs text-gray-600 bg-blue-50 border-r border-blue-200 font-bold">$</span>
                  <input type="number" value={freeThreshold} onChange={e => setFreeThreshold(parseFloat(e.target.value) || 0)} className="flex-1 px-3 py-2 text-xs focus:outline-none" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Shipping Zones */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3">Shipping Zones</h3>
          <div className="space-y-2">
            {ZONES.map(zone => (
              <div key={zone.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <span className="font-bold text-gray-900 text-sm">{zone.region}</span>
                <span className="font-black text-gray-900">${zone.rate.toFixed(2)}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2.5 border-2 border-[#0077B6] text-[#0077B6] font-bold text-xs rounded-xl">+ Add Zone</button>
        </div>

        {/* Processing Time */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <h3 className="font-black text-gray-900 text-sm mb-3">Processing Time</h3>
          <div className="flex gap-2 flex-wrap">
            {["Same Day", "1-2 Days", "3-5 Days", "1-2 Weeks"].map(opt => (
              <button
                key={opt}
                onClick={() => setProcessingTime(opt)}
                className={`px-4 py-2 rounded-xl font-bold text-xs border-2 transition-all ${
                  processingTime === opt ? "border-[#0077B6] bg-blue-50 text-[#0077B6]" : "border-gray-100 bg-white text-gray-600"
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}