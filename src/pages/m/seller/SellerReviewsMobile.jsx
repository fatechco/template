import { useState } from "react";
import { Menu, Star, ThumbsUp, MessageCircle, Search } from "lucide-react";

const MOCK_REVIEWS = [
  { id: "r1", buyer: "Ahmed Hassan", avatar: "A", rating: 5, product: "Premium Cement 50kg", date: "2025-03-14", comment: "Excellent quality cement! Exactly as described, fast delivery. Will order again.", helpful: 12, replied: false },
  { id: "r2", buyer: "Fatima Mohamed", avatar: "F", rating: 4, product: "Steel Rods 10mm", date: "2025-03-12", comment: "Good product, consistent quality. The packaging could be improved for transport.", helpful: 8, replied: true, reply: "Thank you for your feedback, Fatima! We're working on improving our packaging." },
  { id: "r3", buyer: "Omar Al-Rashid", avatar: "O", rating: 5, product: "Ceramic Tiles 60×60", date: "2025-03-10", comment: "Ordered 500 bags for a large project. Quality is excellent — professional grade.", helpful: 23, replied: false },
  { id: "r4", buyer: "Layla Hassan", avatar: "L", rating: 3, product: "Wall Paint 20L", date: "2025-03-07", comment: "Average product. The color shade was slightly different from the photo.", helpful: 5, replied: false },
  { id: "r5", buyer: "Khaled Ali", avatar: "K", rating: 5, product: "Electrical Cable 2.5mm", date: "2025-03-05", comment: "Perfect cable, good insulation. Delivered quickly to Giza.", helpful: 9, replied: true, reply: "So glad you're happy with the order, Khaled! Thanks for your support." },
  { id: "r6", buyer: "Sara Ibrahim", avatar: "S", rating: 2, product: "Premium Cement 50kg", date: "2025-03-01", comment: "Two of the bags were damaged on arrival. Customer service was slow to respond.", helpful: 4, replied: false },
];

const FILTER_OPTS = ["All", "5★", "4★", "3★", "2★", "1★", "Replied", "Unreplied"];

function StarDisplay({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1,2,3,4,5].map(s => <Star key={s} size={12} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />)}
    </div>
  );
}

export default function SellerReviewsMobile({ onOpenDrawer }) {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState({});
  const [replyOpen, setReplyOpen] = useState({});

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({ rating: r, count: reviews.filter(rev => rev.rating === r).length }));

  const filtered = reviews.filter(r => {
    const matchFilter = filter === "All" ||
      (filter === "Unreplied" && !r.replied) ||
      (filter === "Replied" && r.replied) ||
      filter === `${r.rating}★`;
    const matchSearch = r.buyer.toLowerCase().includes(search.toLowerCase()) || r.comment.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const submitReply = (id) => {
    const text = replyText[id];
    if (!text?.trim()) return;
    setReviews(reviews.map(r => r.id === id ? { ...r, replied: true, reply: text } : r));
    setReplyOpen({ ...replyOpen, [id]: false });
    setReplyText({ ...replyText, [id]: "" });
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF]">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white flex items-center px-4 gap-3" style={{ height: 56, boxShadow: "0 1px 4px rgba(0,0,0,0.1)" }}>
        <button onClick={onOpenDrawer} className="p-1 -ml-1"><Menu size={24} className="text-gray-900" /></button>
        <span className="flex-1 font-bold text-base text-gray-900 text-center">Reviews</span>
        <span className="w-8" />
      </div>

      <div className="pb-28 space-y-4 pt-4 px-4">
        {/* Rating Summary */}
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex gap-4">
          <div className="text-center flex-shrink-0">
            <p className="text-5xl font-black text-gray-900">{avgRating}</p>
            <StarDisplay rating={Math.round(avgRating)} />
            <p className="text-xs text-gray-500 mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {ratingCounts.map(({ rating, count }) => (
              <div key={rating} className="flex items-center gap-2 text-xs">
                <span className="w-6 text-gray-500">{rating}★</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-yellow-400" style={{ width: `${(count / reviews.length) * 100}%` }} />
                </div>
                <span className="w-4 text-right text-gray-500">{count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTER_OPTS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${
                filter === f ? "bg-[#0077B6] text-white" : "bg-white border border-gray-200 text-gray-600"
              }`}>{f}</button>
          ))}
        </div>

        {/* Search */}
        <div className="flex items-center gap-2 bg-white rounded-xl px-3 py-2 border border-gray-200">
          <Search size={15} className="text-gray-400" />
          <input type="text" placeholder="Search reviews..." value={search}
            onChange={e => setSearch(e.target.value)} className="flex-1 bg-transparent text-sm focus:outline-none" />
        </div>

        {/* Review Cards */}
        <div className="space-y-3">
          {filtered.map(review => (
            <div key={review.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">{review.avatar}</div>
                  <div>
                    <p className="font-bold text-gray-900 text-sm">{review.buyer}</p>
                    <p className="text-[11px] text-gray-400">{review.product}</p>
                  </div>
                </div>
                <div className="text-right">
                  <StarDisplay rating={review.rating} />
                  <p className="text-[11px] text-gray-400 mt-0.5">{new Date(review.date).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed">{review.comment}</p>
              <div className="flex items-center gap-1 text-[11px] text-gray-400">
                <ThumbsUp size={11} /> {review.helpful} found helpful
              </div>
              {review.replied && review.reply && (
                <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 ml-3">
                  <p className="text-xs font-bold text-teal-700 mb-1">Your Reply</p>
                  <p className="text-xs text-teal-800">{review.reply}</p>
                </div>
              )}
              {!review.replied && (
                replyOpen[review.id] ? (
                  <div className="ml-3 space-y-2">
                    <textarea rows={3} value={replyText[review.id] || ""}
                      onChange={e => setReplyText({ ...replyText, [review.id]: e.target.value })}
                      placeholder="Write your reply..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400 resize-none" />
                    <div className="flex gap-2">
                      <button onClick={() => submitReply(review.id)} className="bg-teal-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Send Reply</button>
                      <button onClick={() => setReplyOpen({ ...replyOpen, [review.id]: false })} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs">Cancel</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => setReplyOpen({ ...replyOpen, [review.id]: true })}
                    className="flex items-center gap-1.5 text-teal-600 font-bold text-xs">
                    <MessageCircle size={13} /> Reply to this review
                  </button>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}