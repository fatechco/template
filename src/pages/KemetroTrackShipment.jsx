import { useState } from "react";
import { Search, Phone, MessageCircle, HelpCircle } from "lucide-react";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const MOCK_SHIPMENT = {
  shipmentNum: "SHP-2025-001",
  orderNum: "ORD-2025-001",
  product: "Ceramic Floor Tiles 60x60 (5 packages)",
  store: "Tile Experts Co.",
  status: "In_Transit",
  estimatedDelivery: "2026-03-19",
  shipper: { name: "FastDeliver Co.", phone: "+20 122 555 7777" },
  timeline: [
    { timestamp: "2026-03-17 10:30", status: "Posted", note: "Shipment request created", location: "Cairo", image: null },
    { timestamp: "2026-03-17 14:00", status: "Assigned", note: "FastDeliver Co. assigned to your shipment", location: "Cairo", image: null },
    { timestamp: "2026-03-18 09:15", status: "Picked Up", note: "Package collected from seller's warehouse", location: "Cairo Industrial Zone", image: null },
    { timestamp: "2026-03-18 11:30", status: "In Transit", note: "On the way to Alexandria", location: "Cairo–Alexandria Desert Road", image: null },
  ],
};

const STATUS_STYLES = {
  Posted: { bg: "bg-blue-100", text: "text-blue-700", dot: "bg-blue-500" },
  Assigned: { bg: "bg-purple-100", text: "text-purple-700", dot: "bg-purple-500" },
  "Picked Up": { bg: "bg-teal-100", text: "text-teal-700", dot: "bg-teal-500" },
  "In Transit": { bg: "bg-orange-100", text: "text-orange-700", dot: "bg-orange-500" },
  "Out for Delivery": { bg: "bg-yellow-100", text: "text-yellow-700", dot: "bg-yellow-500" },
  Delivered: { bg: "bg-green-100", text: "text-green-700", dot: "bg-green-500" },
  Failed: { bg: "bg-red-100", text: "text-red-700", dot: "bg-red-500" },
};

const STATUS_STEPS = ["Posted", "Assigned", "Picked Up", "In Transit", "Out for Delivery", "Delivered"];

export default function KemetroTrackShipment() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [showPhone, setShowPhone] = useState(false);

  const handleTrack = () => {
    if (!query.trim()) return;
    if (query.toUpperCase().includes("SHP-2025-001") || query.toUpperCase().includes("ORD-2025-001")) {
      setResult(MOCK_SHIPMENT);
      setNotFound(false);
    } else {
      setResult(null);
      setNotFound(true);
    }
  };

  const currentStepIdx = result ? STATUS_STEPS.findIndex(s => s === result.status.replace("_", " ") || s.replace(" ", "_") === result.status) : -1;
  const statusStyle = result ? (STATUS_STYLES[result.status.replace("_", " ")] || STATUS_STYLES["In Transit"]) : null;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />

      <div className="max-w-3xl mx-auto px-4 py-16 space-y-8">
        {/* Search */}
        <div className="text-center">
          <h1 className="text-3xl font-black text-gray-900 mb-2">Track Your Shipment</h1>
          <p className="text-gray-500">Enter your shipment number or order number to track your delivery</p>
        </div>

        <div className="flex gap-3">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleTrack()}
            placeholder="e.g. SHP-2025-001 or ORD-2025-001"
            className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 transition-colors"
          />
          <button onClick={handleTrack} className="flex items-center gap-2 bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl transition-colors">
            <Search size={18} /> Track
          </button>
        </div>

        {notFound && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-black text-gray-900">No shipment found</p>
            <p className="text-gray-600 text-sm mt-1">No shipment found with this number. Please check and try again.</p>
          </div>
        )}

        {result && (
          <div className="space-y-5">
            {/* Order summary */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 mb-1">Shipment #{result.shipmentNum}</p>
                <p className="font-black text-gray-900">{result.product}</p>
                <p className="text-sm text-gray-500 mt-0.5">From <span className="font-semibold text-blue-600">{result.store}</span></p>
              </div>
              <div className={`px-4 py-2 rounded-full text-sm font-black ${statusStyle.bg} ${statusStyle.text}`}>
                {result.status.replace("_", " ")}
              </div>
            </div>

            {/* Visual Progress Timeline */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <div className="flex items-center overflow-x-auto pb-2 gap-1">
                {STATUS_STEPS.map((s, i) => (
                  <div key={i} className="flex items-center flex-shrink-0">
                    <div className="flex flex-col items-center gap-1.5">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${i < currentStepIdx ? "bg-green-500 text-white" : i === currentStepIdx ? "bg-[#FF6B00] text-white ring-4 ring-orange-200" : "bg-gray-200 text-gray-400"}`}>
                        {i < currentStepIdx ? "✓" : i + 1}
                      </div>
                      <span className={`text-xs font-semibold whitespace-nowrap ${i === currentStepIdx ? "text-[#FF6B00]" : i < currentStepIdx ? "text-green-600" : "text-gray-400"}`}>{s}</span>
                    </div>
                    {i < STATUS_STEPS.length - 1 && <div className={`w-8 h-0.5 mx-1 ${i < currentStepIdx ? "bg-green-400" : "bg-gray-200"}`} />}
                  </div>
                ))}
              </div>
              <div className="mt-4 text-sm text-gray-600 border-t pt-4">
                📅 Estimated delivery: <span className="font-black text-gray-900">{result.estimatedDelivery}</span>
              </div>
            </div>

            {/* Tracking Updates */}
            <div className="bg-white border border-gray-200 rounded-xl p-6">
              <h3 className="font-black text-gray-800 mb-5">Tracking Updates</h3>
              <div className="space-y-5">
                {[...result.timeline].reverse().map((t, i) => {
                  const style = STATUS_STYLES[t.status] || STATUS_STYLES["In Transit"];
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full mt-1.5 flex-shrink-0 ${i === 0 ? "bg-orange-500" : style.dot}`} />
                        {i < result.timeline.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 my-1" />}
                      </div>
                      <div className="pb-2 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-xs font-black px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>{t.status}</span>
                          <span className="text-xs text-gray-400">{t.timestamp}</span>
                        </div>
                        <p className="text-sm text-gray-700 mt-1">{t.note}</p>
                        {t.location && <p className="text-xs text-gray-400 mt-0.5">📍 {t.location}</p>}
                        {t.image && <img src={t.image} alt="Update" className="mt-2 w-32 h-24 object-cover rounded-lg border" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipper Contact */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center justify-between flex-wrap gap-3">
              <div>
                <p className="text-xs text-gray-400 mb-0.5">Your Shipper</p>
                <p className="font-black text-gray-900">{result.shipper.name}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => setShowPhone(!showPhone)} className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                  <Phone size={14} /> {showPhone ? result.shipper.phone : "Reveal Phone"}
                </button>
                <a href={`https://wa.me/${result.shipper.phone.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                  <MessageCircle size={14} /> WhatsApp
                </a>
                <button className="flex items-center gap-2 border border-blue-200 text-blue-700 hover:bg-blue-50 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                  <HelpCircle size={14} /> Support
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <KemetroFooter />
    </div>
  );
}