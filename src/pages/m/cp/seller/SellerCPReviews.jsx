import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Filter, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";

const MOCK_REVIEWS = [
  { id: 1, product: "Office Chair Ergonomic", customer: "Ahmed Hassan", rating: 5, comment: "Excellent quality! Very comfortable for long working hours.", date: "2 days ago", helpful: 12, status: "approved" },
  { id: 2, product: "LED Desk Lamp", customer: "Fatima Ali", rating: 4, comment: "Good brightness, but delivery took longer than expected.", date: "5 days ago", helpful: 8, status: "approved" },
  { id: 3, product: "Standing Desk", customer: "Mohamed Samir", rating: 5, comment: "Perfect! Exactly what I needed for my home office.", date: "1 week ago", helpful: 15, status: "approved" },
  { id: 4, product: "Filing Cabinet", customer: "Sara Mohamed", rating: 3, comment: "Decent quality but assembly instructions were unclear.", date: "2 weeks ago", helpful: 5, status: "pending" },
  { id: 5, product: "Monitor Stand", customer: "Omar Farouk", rating: 2, comment: "Not as sturdy as I expected. Disappointed.", date: "3 weeks ago", helpful: 3, status: "pending" },
];

const RATING_BREAKDOWN = {
  5: 45,
  4: 28,
  3: 12,
  2: 8,
  1: 7,
};

export default function SellerCPReviews() {
  const navigate = useNavigate();
  const [filter, setFilter] = useState("all");

  const filtered = MOCK_REVIEWS.filter(r => {
    if (filter === "all") return true;
    if (filter === "pending") return r.status === "pending";
    if (filter === "approved") return r.status === "approved";
    if (filter === "low") return r.rating <= 3;
    return true;
  });

  const avgRating = (MOCK_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);

  return (
    <div className="space-y-6 pb-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-black">⭐ Customer Reviews</h1>
            <p className="text-amber-100 text-sm mt-1">Manage and respond to customer feedback</p>
          </div>
          <MessageSquare size={32} className="opacity-80" />
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 flex-1">
            <p className="text-amber-100 text-xs font-medium mb-1">Average Rating</p>
            <div className="flex items-center gap-2">
              <p className="text-4xl font-black">{avgRating}</p>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} className={i < Math.floor(avgRating) ? "fill-white text-white" : "text-white/60"} />
                ))}
              </div>
            </div>
            <p className="text-xs text-amber-100 mt-2">{MOCK_REVIEWS.length} reviews total</p>
          </div>
        </div>
      </div>

      {/* Rating Breakdown */}
      <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
        <h3 className="font-black text-gray-900 text-sm mb-4">Rating Breakdown</h3>
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map(stars => (
            <div key={stars} className="flex items-center gap-3">
              <span className="text-xs font-bold text-gray-600 w-8">{stars}⭐</span>
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full"
                  style={{ width: `${(RATING_BREAKDOWN[stars] / 100) * 100}%` }}
                />
              </div>
              <span className="text-xs font-bold text-gray-500 w-8 text-right">{RATING_BREAKDOWN[stars]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl overflow-x-auto">
        {[
          { value: "all", label: "All Reviews" },
          { value: "pending", label: "⏳ Pending" },
          { value: "approved", label: "✅ Approved" },
          { value: "low", label: "⭐ Low Ratings" },
        ].map(tab => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`px-4 py-2 text-xs font-bold rounded-lg whitespace-nowrap transition-all ${
              filter === tab.value
                ? "bg-white text-amber-600 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-3">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-gray-900 text-sm">{review.product}</h3>
                  <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    review.status === "approved" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {review.status === "approved" ? "✅ Approved" : "⏳ Pending"}
                  </span>
                </div>
                <p className="text-xs text-gray-400">By {review.customer} · {review.date}</p>
              </div>
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={14} className={i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"} />
                ))}
              </div>
            </div>
            <p className="text-sm text-gray-700 mb-3">{review.comment}</p>
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-teal-600 transition-colors">
                  <ThumbsUp size={14} /> {review.helpful} found helpful
                </button>
                <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors">
                  <ThumbsDown size={14} />
                </button>
              </div>
              {review.status === "pending" && (
                <div className="flex gap-2">
                  <button className="text-xs font-bold text-green-600 hover:text-green-700">✅ Approve</button>
                  <button className="text-xs font-bold text-red-600 hover:text-red-700">❌ Reject</button>
                </div>
              )}
              {review.status === "approved" && (
                <button className="text-xs font-bold text-teal-600 hover:text-teal-700">
                  💬 Respond →
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-100">
          <div className="text-6xl mb-4">⭐</div>
          <p className="font-bold text-gray-700 text-lg mb-1">No reviews found</p>
          <p className="text-gray-500 text-sm">Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}