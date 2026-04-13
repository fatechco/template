import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Bookmark, Share2 } from "lucide-react";

const TASK = {
  title: "Full Kitchen Renovation with New Cabinets and Countertops",
  category: "Home Remodeling", status: "Open",
  city: "Cairo", country: "Egypt",
  hoursAgo: 2, budgetMin: 2000, budgetMax: 5000, currency: "USD",
  deadline: "Apr 15, 2026",
  description: "Looking for an experienced contractor to renovate our 15sqm kitchen. Work includes removing old cabinets, installing new ones, new countertops, tiling floor and walls. Premium materials will be partially supplied. Must have portfolio of similar work and be willing to visit for assessment before bidding.",
  skills: ["Kitchen Renovation", "Carpentry", "Tiling", "Countertops", "Renovation"],
  bids: 7,
  images: [
    "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    "https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=600&q=80",
  ],
  client: { name: "Fatima Al-Zahra", rating: 4.8, tasks: 12, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=60&q=70" },
};

const BIDS = [
  { pro: "Ahmed Hassan", amount: 3200, days: 21, note: "I have completed 15+ similar kitchen renovations. Can visit for assessment this week.", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&q=70", rating: 4.9 },
  { pro: "Kareem Saad", amount: 2800, days: 28, note: "Specialized in custom cabinetry and kitchen remodels. Portfolio available.", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&q=70", rating: 4.6 },
];

export default function KemeworkMobileTaskDetail() {
  const navigate = useNavigate();
  const [bookmarked, setBookmarked] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [showBidModal, setShowBidModal] = useState(false);
  const [bid, setBid] = useState({ amount: "", days: "", note: "" });

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5"><ChevronLeft size={22} className="text-gray-700" /></button>
        <p className="font-black text-gray-900 text-sm">Task Details</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setBookmarked(b => !b)}>
            <Bookmark size={20} className={bookmarked ? "fill-amber-500 text-amber-500" : "text-gray-400"} />
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="relative overflow-hidden" style={{ height: 220 }}>
        <img src={TASK.images[imgIdx]} alt="" className="w-full h-full object-cover" />
        {TASK.images.length > 1 && (
          <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
            {TASK.images.map((_, i) => (
              <button key={i} onClick={() => setImgIdx(i)} className={`w-1.5 h-1.5 rounded-full ${i === imgIdx ? "bg-white" : "bg-white/50"}`} />
            ))}
          </div>
        )}
      </div>

      <div className="px-4 pt-4 flex flex-col gap-3">
        {/* Title + Meta */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex flex-wrap gap-1.5 mb-2">
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#C41230" }}>{TASK.category}</span>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-100 text-green-700">{TASK.status}</span>
          </div>
          <h1 className="font-black text-gray-900 text-lg leading-snug mb-3">{TASK.title}</h1>
          <div className="flex flex-wrap gap-3 text-xs text-gray-500">
            <span>📍 {TASK.city}, {TASK.country}</span>
            <span>⏰ {TASK.hoursAgo}h ago</span>
            <span>🗓 Deadline: {TASK.deadline}</span>
            <span className="font-black" style={{ color: "#C41230" }}>💰 ${TASK.budgetMin.toLocaleString()}–${TASK.budgetMax.toLocaleString()}</span>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="font-black text-gray-900 text-sm mb-2">Description</p>
          <p className={`text-sm text-gray-600 leading-relaxed ${!expanded ? "line-clamp-3" : ""}`}>{TASK.description}</p>
          <button onClick={() => setExpanded(e => !e)} className="text-xs font-bold mt-1" style={{ color: "#C41230" }}>
            {expanded ? "Show less" : "Read more →"}
          </button>
        </div>

        {/* Skills */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="font-black text-gray-900 text-sm mb-2">Skills Required</p>
          <div className="flex flex-wrap gap-2">
            {TASK.skills.map(s => <span key={s} className="text-xs bg-gray-100 text-gray-600 font-semibold px-2.5 py-1 rounded-full">{s}</span>)}
          </div>
        </div>

        {/* Client */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="font-black text-gray-900 text-sm mb-3">Posted by</p>
          <div className="flex items-center gap-3">
            <img src={TASK.client.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-black text-gray-900 text-sm">{TASK.client.name}</p>
              <p className="text-xs text-gray-400">⭐ {TASK.client.rating} · {TASK.client.tasks} tasks posted</p>
            </div>
          </div>
        </div>

        {/* Bids */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="font-black text-gray-900 text-sm mb-3">Bids ({TASK.bids})</p>
          <div className="flex flex-col gap-3">
            {BIDS.map(b => (
              <div key={b.pro} className="bg-gray-50 rounded-xl p-3 flex gap-3">
                <img src={b.avatar} alt="" className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-gray-900 text-xs">{b.pro}</p>
                    <p className="font-black text-xs" style={{ color: "#C41230" }}>${b.amount.toLocaleString()}</p>
                  </div>
                  <p className="text-[10px] text-gray-400">⭐ {b.rating} · 📦 {b.days} days</p>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{b.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Share */}
        <div className="flex gap-3 justify-center py-2">
          {["📤 Share", "🔗 Copy Link", "💬 WhatsApp"].map(s => (
            <button key={s} className="flex-1 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600">{s}</button>
          ))}
        </div>
      </div>

      {/* Sticky Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-100 px-4 py-3">
        <button onClick={() => setShowBidModal(true)}
          className="w-full py-4 rounded-2xl font-bold text-white text-sm" style={{ background: "#C41230" }}>
          📬 Submit a Bid
        </button>
      </div>

      {/* Bid Modal */}
      {showBidModal && (
        <div className="fixed inset-0 z-50 flex items-end">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowBidModal(false)} />
          <div className="relative bg-white rounded-t-3xl w-full p-5">
            <p className="font-black text-gray-900 text-base mb-4">Submit Your Bid</p>
            <div className="flex flex-col gap-3 mb-4">
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Your Price ($)</label>
                  <input type="number" value={bid.amount} onChange={e => setBid(b => ({ ...b, amount: e.target.value }))}
                    placeholder="0" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 text-sm outline-none" style={{ height: 44 }} />
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-bold text-gray-700 mb-1.5">Delivery Days</label>
                  <input type="number" value={bid.days} onChange={e => setBid(b => ({ ...b, days: e.target.value }))}
                    placeholder="e.g. 14" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 text-sm outline-none" style={{ height: 44 }} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1.5">Cover Letter</label>
                <textarea rows={4} value={bid.note} onChange={e => setBid(b => ({ ...b, note: e.target.value }))}
                  placeholder="Describe your experience with similar projects..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none resize-none" />
              </div>
            </div>
            <button disabled={!bid.amount || !bid.days} onClick={() => setShowBidModal(false)}
              className="w-full py-4 rounded-2xl font-bold text-white disabled:opacity-40" style={{ background: "#C41230" }}>
              Submit Bid →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}