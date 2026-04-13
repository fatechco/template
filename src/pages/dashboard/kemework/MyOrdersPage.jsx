import { useState } from "react";
import { X, Phone, MessageCircle, Mail, Star } from "lucide-react";

const TABS = ["All", "Pending", "In Progress", "Under Review", "Completed", "Disputed", "Cancelled"];

const STATUS_STYLES = {
  Pending: "bg-gray-100 text-gray-600",
  "In Progress": "bg-amber-100 text-amber-700",
  "Under Review": "bg-purple-100 text-purple-700",
  Completed: "bg-green-100 text-green-700",
  Disputed: "bg-red-100 text-red-700",
  Cancelled: "bg-gray-100 text-gray-500",
};

const TIMELINE_STEPS = ["Ordered", "Pro Accepted", "In Progress", "Delivered", "Complete"];

const MOCK_ORDERS = [
  { id: "KW-00421", pro: "Ahmed Hassan", proAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=70", proRating: 4.9, service: "Kitchen Cabinet Installation", status: "In Progress", amount: 1800, currency: "USD", startDate: "2026-03-10", deliveryDate: "2026-03-31", timelineStep: 2, notes: "Sourced all materials, starting installation tomorrow.", deliveryImages: [] },
  { id: "KW-00398", pro: "Omar Khalid", proAvatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&q=70", proRating: 4.7, service: "Plumbing Repair — 2 Bathrooms", status: "Completed", amount: 350, currency: "USD", startDate: "2026-02-20", deliveryDate: "2026-02-25", timelineStep: 4, notes: "All pipes replaced and tested. No leaks detected.", deliveryImages: ["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=70"] },
  { id: "KW-00355", pro: "Sara Mohamed", proAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&q=70", proRating: 4.8, service: "Electrical Panel Upgrade", status: "Under Review", amount: 900, currency: "USD", startDate: "2026-03-12", deliveryDate: "2026-03-18", timelineStep: 3, notes: "Panel upgraded and all circuits tested. Please review and confirm.", deliveryImages: ["https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=300&q=70"] },
  { id: "KW-00310", pro: "Rania Hassan", proAvatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=60&q=70", proRating: 4.8, service: "Interior Painting — Living Room", status: "Pending", amount: 450, currency: "USD", startDate: "2026-03-22", deliveryDate: "2026-03-27", timelineStep: 0, notes: "", deliveryImages: [] },
];

function OrderDetail({ order, onClose }) {
  const [rating, setRating] = useState(0);
  const [reviewTitle, setReviewTitle] = useState("");
  const [reviewText, setReviewText] = useState("");
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  const timelineIdx = order.timelineStep;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white w-full max-w-lg h-full overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-100 px-5 py-4 flex items-center justify-between z-10">
          <div>
            <p className="font-black text-gray-900 text-sm">Order {order.id}</p>
            <p className="text-xs text-gray-500">{order.service}</p>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} /></button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Status timeline */}
          <div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Order Progress</p>
            <div className="relative">
              {TIMELINE_STEPS.map((step, i) => {
                const done = i < timelineIdx;
                const active = i === timelineIdx;
                return (
                  <div key={step} className="flex items-start gap-3 mb-3 last:mb-0">
                    <div className="flex flex-col items-center flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 ${done ? "bg-teal-600 border-teal-600 text-white" : active ? "bg-teal-50 border-teal-500 text-teal-700" : "bg-gray-100 border-gray-200 text-gray-400"}`}>
                        {done ? "✓" : i + 1}
                      </div>
                      {i < TIMELINE_STEPS.length - 1 && <div className={`w-0.5 h-5 mt-1 ${done ? "bg-teal-500" : "bg-gray-200"}`} />}
                    </div>
                    <div className="pt-1.5">
                      <p className={`text-sm font-bold ${active ? "text-teal-700" : done ? "text-gray-900" : "text-gray-400"}`}>{step}</p>
                      {active && <p className="text-xs text-teal-500 mt-0.5">Current status</p>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Professional card */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Professional</p>
            <div className="flex items-center gap-3 mb-3">
              <img src={order.proAvatar} alt={order.pro} className="w-12 h-12 rounded-full object-cover" />
              <div className="flex-1">
                <p className="font-black text-gray-900">{order.pro}</p>
                <p className="text-xs text-gray-400">⭐ {order.proRating}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50">
                <Phone size={13} /> Call
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-bold text-white" style={{ background: "#0D9488" }}>
                <MessageCircle size={13} /> Message
              </button>
              <button className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50">
                <Mail size={13} /> Email
              </button>
            </div>
          </div>

          {/* Delivery info */}
          <div className="bg-gray-50 rounded-2xl p-4">
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Work Delivered</p>
            {order.notes
              ? <p className="text-sm text-gray-700 italic mb-3">"{order.notes}"</p>
              : <p className="text-sm text-gray-400 italic mb-3">No notes from professional yet.</p>
            }
            {order.deliveryImages.length > 0 && (
              <div className="flex gap-2 flex-wrap">
                {order.deliveryImages.map((img, i) => (
                  <img key={i} src={img} alt="" className="w-20 h-20 rounded-xl object-cover border border-gray-200" />
                ))}
              </div>
            )}
          </div>

          {/* Completion actions */}
          {order.status === "Under Review" && (
            <div className="flex flex-col gap-2">
              <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Actions</p>
              <button className="w-full py-3 rounded-xl font-bold text-sm text-white bg-green-600 hover:bg-green-700 transition-colors">
                ✅ Mark as Complete
              </button>
              <button className="w-full py-3 rounded-xl font-bold text-sm border-2 border-gray-300 text-gray-700 hover:border-gray-400 transition-colors">
                🔄 Request Revision
              </button>
              <button className="w-full py-3 rounded-xl font-bold text-sm border-2 border-red-300 text-red-600 hover:border-red-400 transition-colors">
                ⚠️ Open Dispute
              </button>
            </div>
          )}

          {/* Review section */}
          {order.status === "Completed" && (
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4">
              <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-3">Leave a Review</p>
              {reviewSubmitted ? (
                <p className="text-sm font-bold text-green-700 text-center py-2">✅ Review submitted! Thank you.</p>
              ) : (
                <>
                  <div className="flex gap-1.5 mb-3">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setRating(star)} className="text-2xl transition-transform hover:scale-110">
                        {star <= rating ? "⭐" : "☆"}
                      </button>
                    ))}
                  </div>
                  <input value={reviewTitle} onChange={e => setReviewTitle(e.target.value)} placeholder="Review title" className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 mb-2 bg-white" />
                  <textarea rows={3} value={reviewText} onChange={e => setReviewText(e.target.value)} placeholder="Share your experience..." className="w-full border border-amber-200 rounded-xl px-3 py-2 text-sm outline-none focus:border-amber-400 resize-none mb-3 bg-white" />
                  <button disabled={!rating || !reviewText} onClick={() => setReviewSubmitted(true)} className="w-full py-2.5 rounded-xl font-bold text-sm text-white disabled:opacity-40" style={{ background: "#D4A017" }}>
                    Submit Review →
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function MyOrdersPage() {
  const [activeTab, setActiveTab] = useState("All");
  const [selectedOrder, setSelectedOrder] = useState(null);

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
        {/* Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar mb-4">
          {TABS.map(t => (
            <button key={t} onClick={() => setActiveTab(t)}
              className="flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-bold transition-colors"
              style={{ background: activeTab === t ? "#0D9488" : "#fff", color: activeTab === t ? "#fff" : "#374151", border: activeTab === t ? "none" : "1px solid #e5e7eb" }}>
              {t}
            </button>
          ))}
        </div>

        {/* Orders list */}
        <div className="flex flex-col gap-3">
          {filtered.map(order => (
            <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <div className="flex items-start gap-3 mb-3">
                <img src={order.proAvatar} alt={order.pro} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-black text-gray-900 text-sm line-clamp-1">{order.service}</p>
                  <p className="text-xs text-gray-400">{order.pro} · {order.id}</p>
                  <p className="text-xs text-gray-400">Start: {order.startDate} · Due: {order.deliveryDate}</p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>{order.status}</span>
                  <p className="text-sm font-black text-gray-900">${order.amount} {order.currency}</p>
                </div>
              </div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => setSelectedOrder(order)} className="flex-1 py-2 rounded-lg text-xs font-bold bg-teal-50 text-teal-700 hover:bg-teal-100 transition-colors min-w-[80px]">
                  View Details
                </button>
                <button className="flex-1 py-2 rounded-lg text-xs font-bold border border-gray-200 text-gray-600 hover:bg-gray-50 min-w-[80px]">
                  Message Pro
                </button>
                {order.status === "Under Review" && (
                  <button className="flex-1 py-2 rounded-lg text-xs font-bold border border-green-300 text-green-700 hover:bg-green-50 min-w-[80px]">
                    Mark Complete
                  </button>
                )}
                {(order.status === "In Progress" || order.status === "Under Review") && (
                  <button className="flex-1 py-2 rounded-lg text-xs font-bold border border-red-200 text-red-600 hover:bg-red-50 min-w-[80px]">
                    Dispute
                  </button>
                )}
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <p className="text-4xl mb-2">📦</p>
              <p className="text-gray-500 font-semibold">No orders found</p>
            </div>
          )}
        </div>
      </div>

      {selectedOrder && <OrderDetail order={selectedOrder} onClose={() => setSelectedOrder(null)} />}
    </div>
  );
}