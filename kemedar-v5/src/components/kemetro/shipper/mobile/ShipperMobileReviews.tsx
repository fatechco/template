// @ts-nocheck
import { Star, MessageCircle, ThumbsUp } from "lucide-react";

const REVIEWS = [
  { id: 1, customer: "Ahmed Hassan", rating: 5, date: "Mar 18", comment: "Very professional and on time. Highly recommended!", helpful: 8 },
  { id: 2, customer: "Fatima Mohamed", rating: 5, date: "Mar 15", comment: "Excellent service! Great communication throughout.", helpful: 12 },
  { id: 3, customer: "Omar Ali", rating: 4, date: "Mar 12", comment: "Good service. Could improve on delivery time.", helpful: 5 },
  { id: 4, customer: "Layla Hassan", rating: 5, date: "Mar 10", comment: "Outstanding! Will use again.", helpful: 9 },
  { id: 5, customer: "Khaled Ahmed", rating: 5, date: "Mar 8", comment: "Fast, reliable, and courteous driver.", helpful: 15 },
];

export default function ShipperMobileReviews() {
  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);
  const fiveStars = REVIEWS.filter(r => r.rating === 5).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Reviews</h1>
        <p className="text-gray-500 text-sm mt-1">Customer feedback and ratings</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
        <p className="text-4xl font-black text-gray-900">{avgRating}</p>
        <div className="flex items-center justify-center gap-1 mt-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} size={16} className="fill-yellow-400 text-yellow-400" />
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-2">{REVIEWS.length} reviews</p>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-black text-green-600">{fiveStars}</p>
          <p className="text-xs text-gray-600 mt-1">5 Star Reviews</p>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <p className="text-2xl font-black text-blue-600">{REVIEWS.reduce((s, r) => s + r.helpful, 0)}</p>
          <p className="text-xs text-gray-600 mt-1">Total Helpful</p>
        </div>
      </div>

      <div className="space-y-3">
        {REVIEWS.map((review) => (
          <div key={review.id} className="bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-start justify-between mb-2">
              <div>
                <p className="font-bold text-gray-900 text-sm">{review.customer}</p>
                <p className="text-xs text-gray-500 mt-0.5">{review.date}</p>
              </div>
              <div className="flex gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={12} className={i < review.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />
                ))}
              </div>
            </div>

            <p className="text-sm text-gray-700 my-2">{review.comment}</p>

            <div className="flex items-center gap-1 text-xs text-gray-500 pt-2 border-t border-gray-100">
              <ThumbsUp size={12} />
              <span>{review.helpful} people found this helpful</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}