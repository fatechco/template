"use client";
// @ts-nocheck
import { useState } from "react";
import { Star, MessageCircle, ThumbsUp, Search, Filter } from "lucide-react";

const MOCK_REVIEWS = [
  { id: "r1", buyer: "Ahmed Hassan", avatar: "A", rating: 5, product: "Premium Cement 50kg", date: "2025-03-14", comment: "Excellent quality cement! Exactly as described, fast delivery. Will order again.", helpful: 12, replied: false },
  { id: "r2", buyer: "Fatima Mohamed", avatar: "F", rating: 4, product: "Steel Rods 10mm", date: "2025-03-12", comment: "Good product, consistent quality. The packaging could be improved for transport.", helpful: 8, replied: true, reply: "Thank you for your feedback, Fatima! We're working on improving our packaging." },
  { id: "r3", buyer: "Omar Al-Rashid", avatar: "O", rating: 5, product: "Ceramic Tiles 60×60", date: "2025-03-10", comment: "Ordered 500 bags for a large project. Quality is excellent — professional grade.", helpful: 23, replied: false },
  { id: "r4", buyer: "Layla Hassan", avatar: "L", rating: 3, product: "Wall Paint 20L", date: "2025-03-07", comment: "Average product. The color shade was slightly different from the photo.", helpful: 5, replied: false },
  { id: "r5", buyer: "Khaled Ali", avatar: "K", rating: 5, product: "Electrical Cable 2.5mm", date: "2025-03-05", comment: "Perfect cable, good insulation. Delivered quickly to Giza.", helpful: 9, replied: true, reply: "So glad you're happy with the order, Khaled! Thanks for your support." },
  { id: "r6", buyer: "Sara Ibrahim", avatar: "S", rating: 2, product: "Premium Cement 50kg", date: "2025-03-01", comment: "Two of the bags were damaged on arrival. Customer service was slow to respond.", helpful: 4, replied: false },
];

const FILTER_OPTIONS = ["All", "5 Stars", "4 Stars", "3 Stars", "2 Stars", "1 Star", "Unanswered"];

function StarDisplay({ rating, size = 14 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={size} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

export default function KemetroSellerReviews() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [replyText, setReplyText] = useState({});
  const [replyOpen, setReplyOpen] = useState({});

  const avgRating = (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map((r) => ({ rating: r, count: reviews.filter((rev) => rev.rating === r).length }));
  const unanswered = reviews.filter((r) => !r.replied).length;

  const filtered = reviews.filter((r) => {
    const matchFilter =
      filter === "All" ||
      (filter === "Unanswered" && !r.replied) ||
      filter === `${r.rating} Stars`;
    const matchSearch = r.buyer.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.comment.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const submitReply = (id) => {
    const text = replyText[id];
    if (!text?.trim()) return;
    setReviews(reviews.map((r) => r.id === id ? { ...r, replied: true, reply: text } : r));
    setReplyOpen({ ...replyOpen, [id]: false });
    setReplyText({ ...replyText, [id]: "" });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor and respond to customer feedback</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4">
        {/* Average Rating */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 col-span-1 flex flex-col items-center justify-center">
          <p className="text-6xl font-black text-gray-900">{avgRating}</p>
          <StarDisplay rating={Math.round(avgRating)} size={20} />
          <p className="text-gray-500 text-sm mt-2">{reviews.length} total reviews</p>
        </div>

        {/* Rating breakdown */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 col-span-1 space-y-2">
          {ratingCounts.map(({ rating, count }) => (
            <div key={rating} className="flex items-center gap-3 text-sm">
              <span className="w-12 text-gray-600 font-semibold">{rating} ★</span>
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-yellow-400 rounded-full" style={{ width: `${(count / reviews.length) * 100}%` }} />
              </div>
              <span className="w-6 text-gray-500 text-right">{count}</span>
            </div>
          ))}
        </div>

        {/* Quick stats */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 col-span-1 space-y-4">
          <div>
            <p className="text-3xl font-black text-yellow-500">{unanswered}</p>
            <p className="text-xs text-gray-500 mt-0.5">Unanswered Reviews</p>
          </div>
          <div>
            <p className="text-3xl font-black text-teal-600">{reviews.filter((r) => r.replied).length}</p>
            <p className="text-xs text-gray-500 mt-0.5">Responses Sent</p>
          </div>
          <div>
            <p className="text-3xl font-black text-blue-600">{reviews.reduce((s, r) => s + r.helpful, 0)}</p>
            <p className="text-xs text-gray-500 mt-0.5">Helpful Votes</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex gap-1 flex-wrap">
          {FILTER_OPTIONS.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === f ? "bg-teal-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}
            >
              {f}
            </button>
          ))}
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search reviews..."
            className="pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-teal-500 w-52"
          />
        </div>
      </div>

      {/* Review Cards */}
      <div className="space-y-4">
        {filtered.map((review) => (
          <div key={review.id} className="bg-white rounded-xl border border-gray-200 p-6 space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-black text-sm flex-shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <p className="font-bold text-gray-900">{review.buyer}</p>
                  <p className="text-xs text-gray-500">{review.product}</p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StarDisplay rating={review.rating} />
                <span className="text-xs text-gray-400">{new Date(review.date).toLocaleDateString()}</span>
              </div>
            </div>

            <p className="text-gray-700 text-sm leading-relaxed">{review.comment}</p>

            <div className="flex items-center gap-2 text-xs text-gray-400">
              <ThumbsUp size={12} /> {review.helpful} people found this helpful
            </div>

            {/* Existing reply */}
            {review.replied && review.reply && (
              <div className="bg-teal-50 border border-teal-100 rounded-lg p-3 ml-4">
                <p className="text-xs font-bold text-teal-700 mb-1">Your Reply</p>
                <p className="text-sm text-teal-800">{review.reply}</p>
              </div>
            )}

            {/* Reply form */}
            {!review.replied && (
              replyOpen[review.id] ? (
                <div className="ml-4 space-y-2">
                  <textarea
                    value={replyText[review.id] || ""}
                    onChange={(e) => setReplyText({ ...replyText, [review.id]: e.target.value })}
                    rows={3}
                    placeholder="Write a professional reply..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-teal-500 resize-none"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => submitReply(review.id)} className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-lg text-xs transition-colors">
                      Send Reply
                    </button>
                    <button onClick={() => setReplyOpen({ ...replyOpen, [review.id]: false })} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-lg text-xs hover:bg-gray-50 transition-colors">
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setReplyOpen({ ...replyOpen, [review.id]: true })}
                  className="flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold text-xs transition-colors"
                >
                  <MessageCircle size={14} /> Reply to this review
                </button>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}