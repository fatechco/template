import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Share2, Star, ChevronDown, ChevronUp } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const ORDER = {
  id: 1, num: "KW-00121", status: "delivered",
  pro: { name: "Ahmed Hassan", rating: 4.9, reviews: 127, verified: true, avatar: "AH", category: "Remodeling" },
  task: "Full Kitchen Renovation & Cabinet Installation",
  description: "Complete renovation of the kitchen including demolition of old cabinets, installation of new MDF cabinets with soft-close hinges, granite countertop, and backsplash tiling.",
  amount: 2800, startDate: "Mar 5, 2026", deadline: "Apr 10, 2026",
  deliveryNotes: "All work is complete. Cabinets installed and sealed. Countertop leveled and polished. Please review and confirm delivery.",
  deliveryImages: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=300&q=70",
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=300&q=70",
    "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?w=300&q=70",
  ],
  timeline: [
    { label: "Order Placed", time: "Mar 3, 2026 · 10:30 AM", done: true },
    { label: "Professional Accepted", time: "Mar 4, 2026 · 9:15 AM", done: true },
    { label: "In Progress", time: "Mar 5, 2026 · 8:00 AM", done: true, current: false },
    { label: "Delivered", time: "Mar 20, 2026 · 5:00 PM", done: true, current: true },
    { label: "Completed", time: null, done: false },
  ],
};

function Timeline({ steps }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
      <p className="font-black text-gray-900 text-sm mb-4">Order Timeline</p>
      <div className="space-y-0">
        {steps.map((step, i) => (
          <div key={i} className="flex gap-3">
            <div className="flex flex-col items-center">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-sm flex-shrink-0 ${
                step.done ? (step.current ? "bg-teal-500 text-white" : "bg-green-100 text-green-600")
                : "bg-gray-100 text-gray-400"
              }`}>
                {step.done ? "✅" : "○"}
              </div>
              {i < steps.length - 1 && (
                <div className={`w-0.5 h-8 my-0.5 ${step.done ? "bg-green-200" : "bg-gray-100"}`} />
              )}
            </div>
            <div className="pb-2">
              <p className={`text-sm font-bold ${step.done ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
              {step.time ? (
                <p className="text-[11px] text-gray-400">{step.time}</p>
              ) : (
                <p className="text-[11px] text-gray-300">Pending</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProCard({ pro }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-14 h-14 rounded-full bg-orange-100 flex items-center justify-center text-lg font-black text-orange-600 flex-shrink-0">
          {pro.avatar}
        </div>
        <div>
          <p className="font-black text-gray-900">{pro.name}</p>
          <p className="text-xs text-gray-500">{pro.category}</p>
          <p className="text-xs text-gray-400">⭐ {pro.rating} ({pro.reviews} reviews) {pro.verified && "· ✅ Verified"}</p>
        </div>
      </div>
      <div className="flex gap-2">
        {[{ icon: "📞", label: "Call" }, { icon: "💬", label: "Chat" }, { icon: "📧", label: "Email" }].map(a => (
          <button key={a.label} className="flex-1 flex flex-col items-center gap-1 py-2.5 border border-gray-200 rounded-xl text-xs font-bold text-gray-700">
            <span>{a.icon}</span> {a.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function OrderDetailsCard({ order }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
      <p className="font-black text-gray-900 text-sm mb-3">Order Details</p>
      <p className="font-bold text-gray-900 mb-1">{order.task}</p>
      <p className={`text-sm text-gray-500 mb-2 ${!expanded && "line-clamp-2"}`}>{order.description}</p>
      <button onClick={() => setExpanded(e => !e)} className="text-xs text-orange-600 font-bold flex items-center gap-1 mb-3">
        {expanded ? <><ChevronUp size={13} /> Show less</> : <><ChevronDown size={13} /> Read more</>}
      </button>
      {[
        ["Agreed Amount", `$${order.amount.toLocaleString()}`],
        ["Started", order.startDate],
        ["Deadline", order.deadline],
      ].map(([k, v]) => (
        <div key={k} className="flex items-center justify-between py-2 border-t border-gray-50">
          <p className="text-xs text-gray-500">{k}</p>
          <p className="text-xs font-bold text-gray-900">{v}</p>
        </div>
      ))}
    </div>
  );
}

function DeliverySection({ order }) {
  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
      <p className="font-black text-gray-900 text-sm mb-2">Delivery Notes</p>
      <p className="text-sm text-gray-600 mb-4">{order.deliveryNotes}</p>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {order.deliveryImages.map((img, i) => (
          <img key={i} src={img} alt="" className="w-full aspect-square rounded-xl object-cover" />
        ))}
      </div>
      <button className="w-full bg-green-600 text-white font-bold py-3.5 rounded-xl text-sm mb-2">✅ Mark as Complete</button>
      <button className="w-full border-2 border-orange-500 text-orange-600 font-bold py-3 rounded-xl text-sm mb-2">🔄 Request Revision</button>
      <button className="w-full border-2 border-red-400 text-red-500 font-bold py-3 rounded-xl text-sm">⚠️ Open Dispute</button>
    </div>
  );
}

function ReviewSection() {
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (submitted) return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
      <p className="font-black text-gray-900 text-sm mb-2">Your Review</p>
      <div className="flex gap-0.5 mb-2">
        {[1,2,3,4,5].map(s => <Star key={s} size={20} fill={s <= rating ? "#f59e0b" : "none"} stroke={s <= rating ? "#f59e0b" : "#d1d5db"} />)}
      </div>
      <p className="font-bold text-gray-900 text-sm mb-1">{title}</p>
      <p className="text-sm text-gray-500">{comment}</p>
    </div>
  );

  return (
    <div className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm mb-4">
      <p className="font-black text-gray-900 text-sm mb-3">How was your experience?</p>
      <div className="flex gap-2 mb-4 justify-center">
        {[1,2,3,4,5].map(s => (
          <button key={s} onClick={() => setRating(s)}>
            <Star size={36} fill={s <= rating ? "#f59e0b" : "none"} stroke={s <= rating ? "#f59e0b" : "#d1d5db"} />
          </button>
        ))}
      </div>
      <input value={title} onChange={e => setTitle(e.target.value)}
        placeholder="Review title"
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-2 focus:outline-none focus:border-orange-400" />
      <textarea value={comment} onChange={e => setComment(e.target.value)}
        placeholder="Tell us about your experience..."
        rows={4}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm mb-3 resize-none focus:outline-none focus:border-orange-400" />
      <button onClick={() => setSubmitted(true)} disabled={!rating}
        className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-xl text-sm disabled:opacity-40">
        Submit Review
      </button>
    </div>
  );
}

export default function KemeworkOrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const order = ORDER; // would fetch by id

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <MobileTopBar title={`Order #${order.num}`} showBack
        rightAction={<button><Share2 size={20} className="text-gray-700" /></button>} />

      <div className="px-4 py-4">
        <Timeline steps={order.timeline} />
        <ProCard pro={order.pro} />
        <OrderDetailsCard order={order} />
        {(order.status === "delivered" || order.status === "in_progress") && <DeliverySection order={order} />}
        {order.status === "completed" && <ReviewSection />}
        {order.status === "delivered" && <ReviewSection />}
      </div>
    </div>
  );
}