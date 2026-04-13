import { useState } from "react";
import { X, Upload, ChevronDown, MessageCircle, Clock, DollarSign } from "lucide-react";

const TABS = ["All", "Pending", "In Progress", "Under Review", "Completed"];

const STATUS_STYLES = {
  Pending: "bg-gray-100 text-gray-600",
  "In Progress": "bg-amber-100 text-amber-700",
  "Under Review": "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
  Disputed: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-500",
};

const MOCK_ORDERS = [
  { id: "KW-00421", client: "Fatima Al-Zahra", clientAvatar: null, service: "Kitchen Cabinet Installation", status: "In Progress", amount: 1800, currency: "USD", startDate: "Mar 10", deadline: "Mar 31", progress: 65, notes: "Currently installing upper cabinets. Everything is on schedule." },
  { id: "KW-00398", client: "Karim Mansour", clientAvatar: null, service: "Plumbing Repair — 2 Bathrooms", status: "Pending", amount: 350, currency: "USD", startDate: "Mar 22", deadline: "Mar 27", progress: 0, notes: "Waiting for client confirmation on preferred materials." },
  { id: "KW-00355", client: "Nour Salem", clientAvatar: null, service: "Electrical Panel Upgrade", status: "Under Review", amount: 900, currency: "USD", startDate: "Mar 12", deadline: "Mar 18", progress: 100, notes: "Work completed and ready for client approval." },
  { id: "KW-00310", client: "Ahmed Badr", clientAvatar: null, service: "Interior Painting — Living Room", status: "Completed", amount: 450, currency: "USD", startDate: "Feb 28", deadline: "Mar 5", progress: 100, notes: "Client approved. Two coats applied, final touches completed." },
];

const PROGRESS_STATUSES = ["In Progress", "50% Done", "Almost Complete", "Delivered"];

function UpdateStatusModal({ order, onClose }) {
  const [status, setStatus] = useState("In Progress");
  const [note, setNote] = useState("");
  const [photos, setPhotos] = useState([]);

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">Update Status</p>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <p className="text-xs text-gray-400 mb-4">{order.id} · {order.service}</p>
        <div className="flex flex-col gap-3 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">New Status</label>
            <select value={status} onChange={e => setStatus(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 bg-white">
              {PROGRESS_STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Progress Note</label>
            <textarea rows={3} value={note} onChange={e => setNote(e.target.value)} placeholder="Describe progress..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Work Photos (optional)</label>
            <label className="flex items-center gap-2 border border-dashed border-gray-200 rounded-xl px-4 py-3 cursor-pointer hover:border-teal-400">
              <Upload size={16} className="text-gray-400" />
              <span className="text-sm text-gray-500">Upload photos</span>
              <input type="file" multiple accept="image/*" onChange={e => setPhotos(Array.from(e.target.files || []))} className="hidden" />
            </label>
            {photos.length > 0 && <p className="text-xs text-green-600 mt-1">{photos.length} photo(s)</p>}
          </div>
          <button onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm text-white mt-2" style={{ background: "#0D9488" }}>Update Order</button>
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
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-h-[90vh] overflow-y-auto p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <p className="font-black text-gray-900">Deliver Order</p>
          <button onClick={onClose}><X size={20} className="text-gray-400" /></button>
        </div>
        <p className="text-xs text-gray-400 mb-4">{order.id} · {order.service}</p>
        <div className="flex flex-col gap-3 mb-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Delivery Message <span className="text-red-500">*</span></label>
            <textarea rows={4} value={message} onChange={e => setMessage(e.target.value)} placeholder="Describe what was completed..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none" />
            <p className={`text-xs mt-1 ${message.length < 30 ? "text-red-400" : "text-green-600"}`}>{message.length}/30 minimum</p>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Delivery Images <span className="text-red-500">*</span></label>
            <label className="flex flex-col items-center gap-1.5 border-2 border-dashed border-gray-200 rounded-xl px-4 py-5 cursor-pointer hover:border-teal-400">
              <Upload size={20} className="text-gray-400" />
              <span className="text-sm text-gray-500">Upload proof images</span>
              <input type="file" multiple accept="image/*" onChange={e => setImages(Array.from(e.target.files || []))} className="hidden" />
            </label>
            {images.length > 0 && <p className="text-xs text-green-600 mt-1">✅ {images.length} image(s)</p>}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1.5">Final Notes</label>
            <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional notes..." className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-teal-400 resize-none" />
          </div>
          <button disabled={!message || message.length < 30 || images.length === 0} onClick={onClose} className="w-full py-3 rounded-xl font-bold text-sm text-white disabled:opacity-40 mt-2" style={{ background: "#0D9488" }}>
            Submit Delivery →
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProOrdersPageMobile() {
  const [activeTab, setActiveTab] = useState("All");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [updateOrder, setUpdateOrder] = useState(null);
  const [deliverOrder, setDeliverOrder] = useState(null);

  const filtered = MOCK_ORDERS.filter(o => activeTab === "All" || o.status === activeTab);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-4 sticky top-0 z-30">
        <h1 className="text-lg font-black text-gray-900">My Orders</h1>
        <p className="text-xs text-gray-500 mt-0.5">{MOCK_ORDERS.length} total</p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-100 px-4 py-3 sticky top-14 z-20 flex gap-2 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold transition-colors"
            style={{ background: activeTab === t ? "#0D9488" : "#f3f4f6", color: activeTab === t ? "#fff" : "#6b7280" }}>
            {t}
          </button>
        ))}
      </div>

      {/* Orders List */}
      <div className="px-4 py-4 space-y-3">
        {filtered.map(order => (
          <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {/* Order Summary - Always Visible */}
            <button
              onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
              className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors text-left"
            >
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-600 flex-shrink-0">{order.client[0]}</div>
              <div className="flex-1 min-w-0">
                <p className="font-black text-gray-900 text-sm line-clamp-1">{order.service}</p>
                <p className="text-xs text-gray-400">{order.client}</p>
              </div>
              <div className="flex flex-col items-end gap-1 flex-shrink-0">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                <ChevronDown size={16} className={`text-gray-400 transition-transform ${expandedOrder === order.id ? "rotate-180" : ""}`} />
              </div>
            </button>

            {/* Expanded Details */}
            {expandedOrder === order.id && (
              <div className="border-t border-gray-100 px-4 py-4 space-y-3">
                {/* Order Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Order ID</span>
                    <span className="font-bold text-gray-900">{order.id}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1"><Clock size={14} /> Deadline</span>
                    <span className="font-bold text-gray-900">{order.deadline}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center gap-1"><DollarSign size={14} /> Amount</span>
                    <span className="font-bold text-gray-900">${order.amount}</span>
                  </div>
                </div>

                {/* Progress Bar */}
                {order.progress > 0 && (
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-gray-700">Progress</span>
                      <span className="text-xs font-bold text-gray-600">{order.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all" style={{ width: `${order.progress}%`, background: "#0D9488" }} />
                    </div>
                  </div>
                )}

                {/* Notes */}
                {order.notes && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs font-bold text-gray-700 mb-1">Notes</p>
                    <p className="text-xs text-gray-600">{order.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => setUpdateOrder(order)}
                    className="w-full py-2.5 rounded-lg text-xs font-bold text-white transition-colors"
                    style={{ background: "#0D9488" }}
                  >
                    Update Status
                  </button>
                  <button className="w-full py-2.5 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 flex items-center justify-center gap-2">
                    <MessageCircle size={14} /> Message Client
                  </button>
                  {(order.status === "In Progress" || order.status === "Pending") && (
                    <button
                      onClick={() => setDeliverOrder(order)}
                      className="w-full py-2.5 rounded-lg text-xs font-bold text-white"
                      style={{ background: "#C41230" }}
                    >
                      Deliver Order →
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}

        {filtered.length === 0 && (
          <div className="text-center py-12">
            <p className="text-4xl mb-2">📋</p>
            <p className="text-gray-500 font-semibold">No orders found</p>
          </div>
        )}
      </div>

      {updateOrder && <UpdateStatusModal order={updateOrder} onClose={() => setUpdateOrder(null)} />}
      {deliverOrder && <DeliverModal order={deliverOrder} onClose={() => setDeliverOrder(null)} />}
    </div>
  );
}