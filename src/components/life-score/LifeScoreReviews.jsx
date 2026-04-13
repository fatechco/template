import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function LifeScoreReviews({ areaId }) {
  const [reviews, setReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({
    overallRating: 0,
    userContext: "tenant",
    reviewText: "",
    yearsLivedHere: 1
  });

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const query = { isApproved: true, isHidden: false };
        if (areaId) query.areaId = areaId;
        const data = await base44.entities.LifeScoreReview.filter(query, "-created_date", 50);
        setReviews(data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };
    if (areaId) fetchReviews();
  }, [areaId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await base44.auth.me();
      await base44.entities.LifeScoreReview.create({
        ...form,
        userId: user.id,
        areaId,
        isApproved: false
      });
      setShowForm(false);
      setForm({ overallRating: 0, userContext: "tenant", reviewText: "", yearsLivedHere: 1 });
    } catch (err) {
      console.error("Error submitting review:", err);
    }
  };

  const filtered = filter === "all" ? reviews : reviews.filter(r => r.userContext === filter);

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">👥 What Residents Say</h2>
          <p className="text-gray-500 text-sm mt-1">Reviews from {reviews.length} verified residents</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-3 rounded-xl transition-colors"
        >
          ✏️ Write Review
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {[
          { val: "all", label: "All" },
          { val: "owner", label: "Owners" },
          { val: "tenant", label: "Tenants" },
          { val: "former_resident", label: "Former" },
          { val: "visitor", label: "Visitors" }
        ].map(tab => (
          <button
            key={tab.val}
            onClick={() => setFilter(tab.val)}
            className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
              filter === tab.val ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Review Form */}
      {showForm && (
        <div className="border border-orange-200 bg-orange-50 rounded-xl p-6 mb-6">
          <h3 className="font-bold text-lg text-gray-900 mb-4">Share Your Experience</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Your context</label>
              <div className="flex flex-wrap gap-3">
                {["owner", "tenant", "former_resident", "visitor"].map(ctx => (
                  <label key={ctx} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="userContext"
                      value={ctx}
                      checked={form.userContext === ctx}
                      onChange={e => setForm({ ...form, userContext: e.target.value })}
                    />
                    <span className="text-sm capitalize">{ctx.replace("_", " ")}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Overall Rating</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, overallRating: star })}
                    className={`text-3xl transition-transform hover:scale-110 ${
                      form.overallRating >= star ? "text-yellow-400" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700 block mb-2">Your review</label>
              <textarea
                value={form.reviewText}
                onChange={e => setForm({ ...form, reviewText: e.target.value })}
                placeholder="Tell future residents what to expect..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            <div className="flex gap-3">
              <button type="submit" className="bg-orange-500 text-white font-bold px-8 py-3 rounded-xl hover:bg-orange-600 transition-colors">
                Submit Review
              </button>
              <button type="button" onClick={() => setShowForm(false)} className="border border-gray-200 text-gray-600 font-bold px-8 py-3 rounded-xl hover:bg-gray-50 transition-colors">
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p className="text-4xl mb-2">📝</p>
            <p>No reviews yet. Be the first to share your experience!</p>
          </div>
        ) : (
          filtered.map(review => (
            <div key={review.id} className="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold">
                  {review.userId.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">Resident</p>
                  <div className="flex gap-2 items-center">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                      {review.userContext.replace("_", " ")}
                    </span>
                    {review.isVerifiedResident && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        🏠 Verified
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-auto flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={review.overallRating >= star ? "text-yellow-400" : "text-gray-200"}>
                      ★
                    </span>
                  ))}
                </div>
              </div>
              
              {review.reviewText && (
                <p className="text-gray-700 text-sm leading-relaxed">{review.reviewText}</p>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}