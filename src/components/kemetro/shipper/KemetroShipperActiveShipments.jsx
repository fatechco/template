import { useState } from "react";
import { X, Upload } from "lucide-react";

const MOCK_ACTIVE = [
  { id: "SHP-001", route: "Cairo → Alexandria", store: "Tile Experts Co.", status: "In_Transit", scheduled: "2026-03-19" },
  { id: "SHP-002", route: "Giza → Cairo", store: "BuildRight Materials", status: "Picked_Up", scheduled: "2026-03-18" },
  { id: "SHP-005", route: "Alexandria → Cairo", store: "Steel Direct", status: "Assigned", scheduled: "2026-03-20" },
];

const STATUS_OPTIONS = ["Picked Up", "In Transit", "Out for Delivery", "Delivered", "Failed"];
const STATUS_STYLES = {
  Assigned: "bg-purple-100 text-purple-700", Picked_Up: "bg-teal-100 text-teal-700",
  In_Transit: "bg-orange-100 text-orange-700", Out_for_Delivery: "bg-yellow-100 text-yellow-700",
  Delivered: "bg-green-100 text-green-700", Failed: "bg-red-100 text-red-700",
};

function UpdateNoteModal({ shipment, onClose }) {
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState("");
  const [note, setNote] = useState("");
  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-black text-gray-900">Add Update — {shipment.id}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className={inp}>
              <option value="">Select status...</option>
              {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Location Note</label>
            <input value={location} onChange={e => setLocation(e.target.value)} className={inp} placeholder="e.g. Cairo Ring Road checkpoint" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Upload Photo</label>
            <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-teal-400 transition-colors">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">Click to upload photo</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Note</label>
            <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-teal-400 resize-none" placeholder="Describe the update..." />
          </div>
        </div>
        <div className="p-5 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
          <button onClick={onClose} className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl transition-colors">Save Update</button>
        </div>
      </div>
    </div>
  );
}

function DeliveryModal({ shipment, onClose }) {
  const [receiverName, setReceiverName] = useState("");
  const inp = "w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-green-400";

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-black text-gray-900">Confirm Delivery — {shipment.id}</h3>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Receiver Name *</label>
            <input value={receiverName} onChange={e => setReceiverName(e.target.value)} className={inp} placeholder="Full name of receiver" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Proof of Delivery Photo *</label>
            <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-400 transition-colors">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">Upload delivery photo</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Signature Photo (optional)</label>
            <label className="flex items-center gap-2 border-2 border-dashed border-gray-200 rounded-lg p-4 cursor-pointer hover:border-green-400 transition-colors">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">Upload signature photo</span>
              <input type="file" accept="image/*" className="hidden" />
            </label>
          </div>
        </div>
        <div className="p-5 border-t flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl hover:bg-gray-50">Cancel</button>
          <button onClick={onClose} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 rounded-xl transition-colors">✅ Confirm Delivery</button>
        </div>
      </div>
    </div>
  );
}

export default function KemetroShipperActiveShipments() {
  const [updateModal, setUpdateModal] = useState(null);
  const [deliveryModal, setDeliveryModal] = useState(null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">My Active Shipments</h1>
        <p className="text-gray-500 text-sm mt-1">{MOCK_ACTIVE.length} shipments in progress</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Shipment#", "Route", "Seller Store", "Status", "Scheduled", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_ACTIVE.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-4 py-3 font-mono text-xs font-black">{s.id}</td>
                  <td className="px-4 py-3 font-medium text-gray-900">{s.route}</td>
                  <td className="px-4 py-3 text-gray-600">{s.store}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLES[s.status]}`}>{s.status.replace("_", " ")}</span></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.scheduled}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <button onClick={() => setUpdateModal(s)} className="border border-teal-400 text-teal-700 hover:bg-teal-50 font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">Add Update</button>
                      <button onClick={() => setDeliveryModal(s)} className="bg-green-600 hover:bg-green-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs transition-colors">Mark Delivered</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {updateModal && <UpdateNoteModal shipment={updateModal} onClose={() => setUpdateModal(null)} />}
      {deliveryModal && <DeliveryModal shipment={deliveryModal} onClose={() => setDeliveryModal(null)} />}
    </div>
  );
}