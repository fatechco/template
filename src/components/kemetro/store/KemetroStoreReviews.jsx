import { useState } from "react";

const MOCK_REVIEWS = [
  {
    id: "1",
    author: "Ahmed Hassan",
    rating: 5,
    title: "Excellent Quality",
    comment: "The cement quality is outstanding and delivery was fast. Highly recommended!",
    images: ["https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=150&q=80"],
    date: "2025-03-10",
  },
  {
    id: "2",
    author: "Fatima Mohamed",
    rating: 4,
    title: "Good Service",
    comment: "Great products and responsive customer service. Minor issue with packaging but resolved quickly.",
    images: [],
    date: "2025-03-08",
  },
  {
    id: "3",
    author: "Omar Ahmed",
    rating: 5,
    title: "Perfect For Our Project",
    comment: "All items arrived as described. Seller was helpful in answering questions about product specifications.",
    images: ["https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=150&q=80"],
    date: "2025-03-05",
  },
];

const RATING_DISTRIBUTION = [
  { stars: 5, count: 156, percentage: 67 },
  { stars: 4, count: 52, percentage: 22 },
  { stars: 3, count: 18, percentage: 8 },
  { stars: 2, count: 5, percentage: 2 },
  { stars: 1, count: 3, percentage: 1 },
];

export default function KemetroStoreReviews({ store }) {
  const [sortBy, setSortBy] = useState("recent");

  return (
    <div className="grid grid-cols-3 gap-6">
      {/* Ratings Summary */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 h-fit sticky top-64">
        <h3 className="font-bold text-gray-900 mb-6">Rating Summary</h3>

        {/* Average Rating */}
        <div className="text-center mb-8 pb-8 border-b">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-5xl font-black text-[#FF6B00]">{store.rating}</span>
            <span className="text-2xl">⭐</span>
          </div>
          <p className="text-gray-600 text-sm">Based on {store.totalReviews} reviews</p>
        </div>

        {/* Rating Distribution */}
        <div className="space-y-3">
          {RATING_DISTRIBUTION.map((item) => (
            <div key={item.stars} className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-600 w-8">
                {item.stars}⭐
              </span>
              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF6B00]"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
              <span className="text-xs text-gray-500 w-12 text-right">
                {item.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Reviews List */}
      <div className="col-span-2">
        {/* Sort */}
        <div className="mb-6 flex gap-3">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#FF6B00]"
          >
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>

        {/* Reviews */}
        <div className="space-y-4">
          {MOCK_REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl border border-gray-200 p-6"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-900">{review.author}</p>
                  <p className="text-xs text-gray-500">
                    {new Date(review.date).toLocaleDateString()}
                  </p>
                </div>
                <div className="flex gap-1">
                  {Array(review.rating)
                    .fill(0)
                    .map((_, i) => (
                      <span key={i}>⭐</span>
                    ))}
                </div>
              </div>

              {/* Title & Comment */}
              <h4 className="font-bold text-gray-900 mb-2">{review.title}</h4>
              <p className="text-gray-700 mb-3">{review.comment}</p>

              {/* Images */}
              {review.images.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {review.images.map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Review"
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                  ))}
                </div>
              )}

              {/* Helpful */}
              <button className="text-xs text-gray-600 hover:text-gray-900">
                👍 Helpful
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}