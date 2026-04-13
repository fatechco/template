import { useState } from 'react';
import { Star, Search, MessageSquare, ThumbsUp, ThumbsDown, Flag } from 'lucide-react';

const REVIEWS = [
  { id: 1, customer: 'Ahmed Hassan', avatar: 'AH', product: 'Wireless Headphones Pro', rating: 5, comment: 'Absolutely amazing quality! The sound is crystal clear and the battery life is incredible. Will definitely buy again.', date: '2026-03-20', helpful: 12, replied: false },
  { id: 2, customer: 'Fatima Ali', avatar: 'FA', product: 'USB-C Cable 2m', rating: 4, comment: 'Good quality cable, works perfectly with my devices. Fast shipping too!', date: '2026-03-19', helpful: 8, replied: true, reply: 'Thank you for your kind review! We are glad you are satisfied with the product.' },
  { id: 3, customer: 'Mohamed Samir', avatar: 'MS', product: 'Phone Case (Blue)', rating: 2, comment: 'The case is a bit loose on my phone. Not the best fit but the color is nice.', date: '2026-03-18', helpful: 3, replied: false },
  { id: 4, customer: 'Sara Mohamed', avatar: 'SM', product: 'Screen Protector Pack', rating: 5, comment: 'Perfect fit, no bubbles at all! Easy to apply and very clear. Highly recommend.', date: '2026-03-17', helpful: 19, replied: true, reply: 'So happy to hear that! Thank you for the 5-star review, Sara!' },
  { id: 5, customer: 'Omar Khalid', avatar: 'OK', product: 'Power Bank 20000mAh', rating: 3, comment: 'Charges okay but takes very long to recharge itself. Expected faster charging.', date: '2026-03-15', helpful: 6, replied: false },
  { id: 6, customer: 'Leila Ahmed', avatar: 'LA', product: 'Laptop Stand Aluminum', rating: 5, comment: 'Sturdy, sleek and worth every penny. My desk setup looks much better now!', date: '2026-03-14', helpful: 24, replied: false },
];

const RATING_TABS = ['All', '5 Stars', '4 Stars', '3 Stars', '2 Stars', '1 Star'];

function StarRating({ rating, size = 16 }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star
          key={s}
          size={size}
          className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200 fill-gray-200'}
        />
      ))}
    </div>
  );
}

export default function ReviewsDesktop() {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState('');

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / REVIEWS.length).toFixed(1);
  const ratingCounts = [5, 4, 3, 2, 1].map(r => ({
    stars: r,
    count: REVIEWS.filter(rev => rev.rating === r).length,
    percent: Math.round((REVIEWS.filter(rev => rev.rating === r).length / REVIEWS.length) * 100),
  }));

  const filtered = REVIEWS.filter(r => {
    const tabMatch = activeTab === 'All' || r.rating === parseInt(activeTab[0]);
    const searchMatch = r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
                        r.product.toLowerCase().includes(searchQuery.toLowerCase());
    return tabMatch && searchMatch;
  });

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2">Reviews</h1>
        <p className="text-gray-600">Manage customer feedback and respond to reviews</p>
      </div>

      {/* Summary + Rating Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Overall Score */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col items-center justify-center text-center">
          <p className="text-7xl font-black text-gray-900 mb-2">{avgRating}</p>
          <StarRating rating={Math.round(avgRating)} size={24} />
          <p className="text-sm text-gray-500 mt-3">{REVIEWS.length} total reviews</p>
        </div>

        {/* Rating Bars */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-black text-gray-900 mb-5">Rating Breakdown</h2>
          <div className="space-y-3">
            {ratingCounts.map(({ stars, count, percent }) => (
              <div key={stars} className="flex items-center gap-4">
                <div className="flex items-center gap-1 w-20 flex-shrink-0">
                  <span className="text-sm font-bold text-gray-700">{stars}</span>
                  <Star size={14} className="text-yellow-400 fill-yellow-400" />
                </div>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-yellow-400 rounded-full"
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 w-16 text-right">{count} ({percent}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer or product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-400"
            />
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {RATING_TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 font-bold text-sm border-b-2 transition-all ${
              activeTab === tab
                ? 'border-blue-600 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.map(review => (
          <div key={review.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                {review.avatar}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <p className="font-black text-gray-900">{review.customer}</p>
                    <p className="text-xs text-blue-600 font-bold">{review.product}</p>
                  </div>
                  <div className="text-right flex-shrink-0 ml-4">
                    <StarRating rating={review.rating} />
                    <p className="text-xs text-gray-500 mt-1">{review.date}</p>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

                {/* Seller Reply */}
                {review.replied && review.reply && (
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
                    <p className="text-xs font-black text-blue-700 mb-1">📣 Your Reply</p>
                    <p className="text-sm text-blue-800">{review.reply}</p>
                  </div>
                )}

                {/* Reply Form */}
                {replyingTo === review.id && (
                  <div className="mb-4">
                    <textarea
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Write your reply..."
                      className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-blue-400 resize-none h-24 mb-2"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setReplyingTo(null); setReplyText(''); }}
                        className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-bold text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => { setReplyingTo(null); setReplyText(''); }}
                        className="px-4 py-2 bg-blue-600 rounded-lg text-sm font-bold text-white hover:bg-blue-700"
                      >
                        Post Reply
                      </button>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex items-center gap-3">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <ThumbsUp size={13} /> {review.helpful} helpful
                  </span>
                  {!review.replied && replyingTo !== review.id && (
                    <button
                      onClick={() => setReplyingTo(review.id)}
                      className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 px-3 py-1.5 border border-blue-200 rounded-lg hover:bg-blue-50"
                    >
                      <MessageSquare size={13} /> Reply
                    </button>
                  )}
                  <button className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-red-500 ml-auto">
                    <Flag size={13} /> Report
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}