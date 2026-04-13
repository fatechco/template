import { MessageCircle, AlertTriangle, FileImage } from "lucide-react";

const MOCK_DETAIL = {
  id: "SHP-001",
  shipmentNum: "SHP-2025-001",
  orderNum: "ORD-2025-001",
  status: "In_Transit",
  createdDate: "2025-03-10",
  pickup: { address: "45 Industrial Zone, Cairo", city: "Cairo", contact: "Mohamed Ali", phone: "+20 100 123 4567", scheduledDate: "2025-03-11 09:00" },
  delivery: { address: "12 Corniche St, Alexandria", city: "Alexandria", contact: "Ahmed Hassan", phone: "+20 111 987 6543", scheduledDate: "2025-03-13 14:00" },
  pkg: { description: "Ceramic floor tiles (60x60)", weight: "250 kg", count: 5, dimensions: "120 x 80 x 60 cm", fragile: true, coldChain: false },
  shipper: { name: "FastDeliver Co.", type: "Company", phone: "+20 122 555 7777", whatsapp: "+20 122 555 7777", agreedPrice: "$85.00", trackingNum: "FD-2025-9912", trackingUrl: "https://fastdeliver.com/track/FD-2025-9912" },
  timeline: [
    { timestamp: "2025-03-10 14:30", status: "Posted", note: "Shipment request posted", location: "Cairo" },
    { timestamp: "2025-03-10 16:45", status: "Assigned", note: "FastDeliver Co. accepted the shipment", location: "Cairo" },
    { timestamp: "2025-03-11 09:15", status: "Picked Up", note: "Package collected from seller", location: "Cairo Industrial Zone" },
    { timestamp: "2025-03-11 11:00", status: "In Transit", note: "En route to Alexandria", location: "Cairo-Alex Desert Road" },
  ],
};

const STATUS_STEPS = ["Posted", "Assigned", "Picked Up", "In Transit", "Out for Delivery", "Delivered"];
const STATUS_STYLES = {
  Draft: "bg-gray-100 text-gray-600", Posted: "bg-blue-100 text-blue-700", Assigned: "bg-purple-100 text-purple-700",
  Picked_Up: "bg-teal-100 text-teal-700", In_Transit: "bg-orange-100 text-orange-700",
  Out_for_Delivery: "bg-yellow-100 text-yellow-700", Delivered: "bg-green-100 text-green-700",
  Failed: "bg-red-100 text-red-700",
};

export default function KemetroShipmentDetail({ onBack }) {
  const d = MOCK_DETAIL;
  const currentStepIdx = STATUS_STEPS.findIndex(s => s.replace(" ", "_") === d.status || s === d.status.replace("_", " "));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <button onClick={onBack} className="text-sm text-gray-500 hover:text-gray-700 mb-2 flex items-center gap-1">← Back to Shipments</button>
          <h1 className="text-2xl font-black text-gray-900">{d.shipmentNum}</h1>
          <p className="text-gray-500 text-sm mt-1">Created {d.createdDate} · Linked to <span className="font-semibold text-blue-600">{d.orderNum}</span></p>
        </div>
        <span className={`text-sm font-bold px-4 py-2 rounded-full ${STATUS_STYLES[d.status]}`}>{d.status.replace("_", " ")}</span>
      </div>

      {/* Status Timeline */}
      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="font-black text-gray-800 mb-5">Shipment Status</h3>
        <div className="flex items-center overflow-x-auto pb-2">
          {STATUS_STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-shrink-0">
              <div className="flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black transition-all ${i < currentStepIdx ? "bg-green-500 text-white" : i === currentStepIdx ? "bg-[#FF6B00] text-white ring-4 ring-orange-200" : "bg-gray-200 text-gray-400"}`}>
                  {i < currentStepIdx ? "✓" : i + 1}
                </div>
                <span className={`text-xs font-semibold whitespace-nowrap ${i === currentStepIdx ? "text-[#FF6B00]" : i < currentStepIdx ? "text-green-600" : "text-gray-400"}`}>{s}</span>
              </div>
              {i < STATUS_STEPS.length - 1 && <div className={`w-12 h-0.5 mx-1 flex-shrink-0 ${i < currentStepIdx ? "bg-green-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left — Details */}
        <div className="lg:col-span-2 space-y-4">
          {/* Pickup */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-black text-gray-800 mb-3 flex items-center gap-2">📍 Pickup</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              <span className="text-gray-500">Address</span><span className="font-medium">{d.pickup.address}</span>
              <span className="text-gray-500">City</span><span className="font-medium">{d.pickup.city}</span>
              <span className="text-gray-500">Contact</span><span className="font-medium">{d.pickup.contact}</span>
              <span className="text-gray-500">Phone</span><span className="font-medium">{d.pickup.phone}</span>
              <span className="text-gray-500">Scheduled</span><span className="font-medium">{d.pickup.scheduledDate}</span>
            </div>
          </div>

          {/* Delivery */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-black text-gray-800 mb-3 flex items-center gap-2">🏁 Delivery</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              <span className="text-gray-500">Address</span><span className="font-medium">{d.delivery.address}</span>
              <span className="text-gray-500">City</span><span className="font-medium">{d.delivery.city}</span>
              <span className="text-gray-500">Contact</span><span className="font-medium">{d.delivery.contact}</span>
              <span className="text-gray-500">Phone</span><span className="font-medium">{d.delivery.phone}</span>
              <span className="text-gray-500">Scheduled</span><span className="font-medium">{d.delivery.scheduledDate}</span>
            </div>
          </div>

          {/* Package */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-black text-gray-800 mb-3">📦 Package</h4>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-sm">
              <span className="text-gray-500">Description</span><span className="font-medium">{d.pkg.description}</span>
              <span className="text-gray-500">Weight</span><span className="font-medium">{d.pkg.weight}</span>
              <span className="text-gray-500">Count</span><span className="font-medium">{d.pkg.count} packages</span>
              <span className="text-gray-500">Dimensions</span><span className="font-medium">{d.pkg.dimensions}</span>
              {d.pkg.fragile && <><span className="text-gray-500">Special</span><span className="font-medium text-orange-600">🥚 Fragile</span></>}
            </div>
          </div>

          {/* Tracking Updates */}
          <div className="bg-white border border-gray-200 rounded-xl p-5">
            <h4 className="font-black text-gray-800 mb-4">🗺 Tracking Updates</h4>
            <div className="space-y-4">
              {d.timeline.map((t, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className={`w-3 h-3 rounded-full mt-1 flex-shrink-0 ${i === d.timeline.length - 1 ? "bg-orange-500" : "bg-green-500"}`} />
                    {i < d.timeline.length - 1 && <div className="w-0.5 h-10 bg-gray-200 my-1" />}
                  </div>
                  <div className="pb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-gray-900 text-sm">{t.status}</span>
                      <span className="text-xs text-gray-400">{t.timestamp}</span>
                    </div>
                    <p className="text-sm text-gray-600">{t.note}</p>
                    {t.location && <p className="text-xs text-gray-400 mt-0.5">📍 {t.location}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right — Shipper Info */}
        <div className="space-y-4">
          <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-4">
            <h4 className="font-black text-gray-800">🚚 Shipper Info</h4>
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 bg-teal-100 rounded-xl flex items-center justify-center text-xl">🚚</div>
              <div>
                <p className="font-black text-gray-900">{d.shipper.name}</p>
                <p className="text-xs text-gray-500">{d.shipper.type}</p>
              </div>
            </div>
            <div className="space-y-1.5 text-sm">
              <p><span className="text-gray-500">Phone:</span> <span className="font-medium">{d.shipper.phone}</span></p>
              <p><span className="text-gray-500">Agreed Price:</span> <span className="font-black text-[#FF6B00]">{d.shipper.agreedPrice}</span></p>
              {d.shipper.trackingNum && <p><span className="text-gray-500">Tracking#:</span> <span className="font-mono font-bold text-gray-900">{d.shipper.trackingNum}</span></p>}
            </div>
            {d.shipper.trackingUrl && (
              <a href={d.shipper.trackingUrl} target="_blank" rel="noopener noreferrer" className="block text-center border border-blue-500 text-blue-700 font-bold py-2 rounded-lg text-sm hover:bg-blue-50 transition-colors">Track on Shipper's System →</a>
            )}
            <a href={`https://wa.me/${d.shipper.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-lg text-sm transition-colors">
              <MessageCircle size={14} /> WhatsApp Shipper
            </a>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full flex items-center justify-center gap-2 border border-red-300 text-red-600 hover:bg-red-50 font-bold py-2.5 rounded-xl text-sm transition-colors">
              <AlertTriangle size={14} /> Mark as Issue
            </button>
            {d.status === "Delivered" && (
              <button className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold py-2.5 rounded-xl text-sm transition-colors">
                <FileImage size={14} /> View Proof of Delivery
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}