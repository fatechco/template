import { useState } from "react";
import { X, Upload } from "lucide-react";

const TABS = ["All", "Pending", "In Progress", "Under Review", "Completed", "Disputed", "Cancelled"];

const STATUS_STYLES = {
  Pending: "bg-gray-100 text-gray-600",
  "In Progress": "bg-amber-100 text-amber-700",
  "Under Review": "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
  Disputed: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-500",
};

const MOCK_ORDERS = [
  { id: "KW-00421", client: "Fatima Al-Zahra", clientAvatar: null, service: "Kitchen Cabinet Installation", status: "In Progress", amount: 1800, currency: "USD", startDate: "Mar 10", deadline: "Mar 31" },
  { id: "KW-00398", client: "Karim Mansour", clientAvatar: null, service: "Plumbing Repair — 2 Bathrooms", status: "Pending", amount: 350, currency: "USD", startDate: "Mar 22", deadline: "Mar 27" },
  { id: "KW-00355", client: "Nour Salem", clientAvatar: null, service: "Electrical Panel Upgrade", status: "Under Review", amount: 900, currency: "USD", startDate: "Mar 12", deadline: "Mar 18" },
  { id: "KW-00310", client: "Ahmed Badr", clientAvatar: null, service: "Interior Painting — Living Room", status: "Completed", amount: 450, currency: "USD", startDate: "Feb 28", deadline: "Mar 5" },
];

const PROGRESS_STATUSES = ["In Progress", "50% Done", "Almost Complete", "Delivered"];

function UpdateStatusModal({ order, onClose }) {
  const [status, setStatus] = useState("In Progress");
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState([]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">Update Order Status</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <p className="text-xs text-gray-400 mb-4">{order.id} · {order.service}</p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">New Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 bg-white">
              {PROGRESS_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Progress Note</label>
            <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Describe progress made..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Work Photos (optional)</label>
            <label className="flex items-center gap-2 border border-dashed border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-teal-400">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">Upload progress photos</span>
              <input type="file" multiple accept="image/*" onChange={e => setPhotos(Array.from(e.target.files || []))} className="hidden" />
            </label>
            {photos.length > 0 && <p className="text-xs text-green-600 mt-1">{photos.length} photo(s) selected</p>}
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm text-white mt-1" style={{ background: "#0D9488" }}>Update Order</button>
        </div>
      </div>
    </div>
  );
}

function DeliverModal({ order, onClose }) {
  const [message, setMessage] = useState("");
  const [images, setImages] = useState([]);
  const [notes, setNotes] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl w-full max-w-md p-5 shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">Deliver Order</p>
          <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
        </div>
        <p className="text-xs text-gray-400 mb-4">{order.id} · {order.service}</p>
        <div className="flex flex-col gap-3">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Delivery Message <span className="text-red-500">*</span></label>
            <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe what was completed. Include all details about the work done..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none" />
            <p className={`text-xs mt-1 ${message.length < 30 ? "text-red-400" : "text-green-600"}`}>{message.length}/30 minimum</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Delivery Images <span className="text-red-500">* (min. 1)</span></label>
            <label className="flex flex-col items-center gap-1.5 border-2 border-dashed border-gray-200 rounded-xl px-4 py-5 cursor-pointer hover:border-teal-400">
              <Upload size={20} className="text-gray-400" />
              <span className="text-sm text-gray-500">Upload delivery proof images</span>
              <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files || []))} className="hidden" />
            </label>
            {images.length > 0 && <p className="text-xs text-green-600 mt-1">✅ {images.length} image(s) ready</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Upload Delivery Video <span className="text-gray-400 font-normal">(optional)</span></label>
            <label className="flex items-center gap-2 border border-dashed border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-teal-400">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">Upload video (MP4, max 100MB)</span>
              <input type="file" accept="video/*" className="hidden" />
            </label>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Final Notes</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any additional notes for the client..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none" />
          </div>
          <button disabled={!message || message.length < 30 || images.length === 0} onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40 mt-1" style={{ background: "#0D9488" }}>
            Submit Delivery →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProOrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [updateOrder, setUpdateOrder] = useState(null);
  const [deliverOrder, setDeliverOrder] = useState(null);

  const filtered = MOCK_ORDERS.filter(o => activeTab === "All" || o.status === activeTab);

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-[900px] mx-auto">
          <h1 className="text-xl font-black text-gray-900">My Orders</h1>
          <p className="text-sm text-gray-500">{MOCK_ORDERS.length} total orders</p>
        </div>
      </div>

      <div className="max-w-[900px] mx-auto px-4 py-5">
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
              style={{ background: activeTab === t ? "#0D9488" : "#fff", color: activeTab === t ? "#fff" : "#374151", border: activeTab === t ? "none" : "1px solid #e5e7eb" }}>
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-sm font-black text-gray-600 flex-shrink-0">{order.client[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 text-sm line-clamp-1">{order.service}</p>
                  <p className="text-xs text-gray-400">{order.client} · {order.id}</p>
                  <p className="text-xs text-gray-400">Start: {order.startDate} · Due: {order.deadline}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                  <p className="text-sm font-black text-gray-900">${order.amount}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setUpdateOrder(order)} className="flex-1 py-2 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 min-w-[80px]">
                  Update Status
                </button>
                <button className="flex-1 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 min-w-[80px]">
                  Message Client
                </button>
                {(order.status === "In Progress" || order.status === "Pending") && (
                  <button onClick={() => setDeliverOrder(order)} className="flex-1 py-2 rounded-lg text-xs font-bold text-white min-w-[80px]" style={{ background: "#C41230" }}>
                    Deliver →
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">📋</p>
              <p className="text-gray-500 font-semibold">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {updateOrder && <UpdateStatusModal order={updateOrder} onClose={() => setUpdateOrder(null)} />}
      {deliverOrder && <DeliverModal order={deliverOrder} onClose={() => setDeliverOrder(null)} />}
    </div>
  );
}