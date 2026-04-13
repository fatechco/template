import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle, Eye, Loader2, Trash2 } from "lucide-react";

export default function LifeScoreReviewsAdmin() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState([]);

  const fetchReviews = async () => {
    setLoading(true);
    let q = {};
    if (filter === "pending") q = { isApproved: false, isHidden: false };
    else if (filter === "approved") q = { isApproved: true, isHidden: false };
    else if (filter === "hidden") q = { isHidden: true };
    const data = await base44.entities.LifeScoreReview.filter(q, "-created_date", 200);
    setReviews(data);
    setLoading(false);
    setSelected([]);
  };

  useEffect(() => { fetchReviews(); }, [filter]);

  const handleApprove = async (id) => {
    await base44.entities.LifeScoreReview.update(id, { isApproved: true, isHidden: false });
    fetchReviews();
  };

  const handleHide = async (id) => {
    await base44.entities.LifeScoreReview.update(id, { isHidden: true });
    fetchReviews();
  };

  const handleBulkApprove = async () => {
    await Promise.all(selected.map(id => base44.entities.LifeScoreReview.update(id, { isApproved: true })));
    fetchReviews();
  };

  const toggleSelect = (id) => {
    setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">📝 Reviews Management</h1>
        {selected.length > 0 && (
          <button onClick={handleBulkApprove} className="bg-green-500 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-green-600">
            ✅ Approve {selected.length} Selected
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {["pending", "approved", "hidden"].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm capitalize transition-colors ${
              filter === tab ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="py-3 px-4 w-8">
                <input type="checkbox" onChange={e => setSelected(e.target.checked ? reviews.map(r => r.id) : [])} />
              </th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">User</th>
              <th className="text-center py-3 px-4 font-bold text-gray-700">Rating</th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Review</th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Context</th>
              <th className="text-left py-3 px-4 font-bold text-gray-700">Date</th>
              <th className="text-right py-3 px-4 font-bold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-8"><Loader2 className="animate-spin mx-auto text-gray-400" size={24} /></td></tr>
            ) : reviews.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-8 text-gray-400">No reviews in this category</td></tr>
            ) : reviews.map(r => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50">
                <td className="py-3 px-4">
                  <input type="checkbox" checked={selected.includes(r.id)} onChange={() => toggleSelect(r.id)} />
                </td>
                <td className="py-3 px-4">
                  <p className="font-semibold text-gray-900 text-xs">{r.userId.slice(0, 8)}...</p>
                  {r.isVerifiedResident && <span className="text-xs text-green-600">✓ Verified</span>}
                </td>
                <td className="text-center py-3 px-4">
                  <span className="text-yellow-500">{"★".repeat(r.overallRating)}</span>
                </td>
                <td className="py-3 px-4 max-w-xs">
                  <p className="text-gray-600 text-xs line-clamp-2">{r.reviewText || "—"}</p>
                </td>
                <td className="py-3 px-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full capitalize">
                    {r.userContext?.replace("_", " ")}
                  </span>
                </td>
                <td className="py-3 px-4 text-xs text-gray-400">
                  {new Date(r.created_date).toLocaleDateString()}
                </td>
                <td className="text-right py-3 px-4">
                  <div className="flex gap-1 justify-end">
                    {!r.isApproved && (
                      <button onClick={() => handleApprove(r.id)} className="text-green-600 hover:bg-green-50 px-2 py-1 rounded text-xs font-bold">
                        ✅ Approve
                      </button>
                    )}
                    {!r.isHidden && (
                      <button onClick={() => handleHide(r.id)} className="text-gray-400 hover:bg-gray-50 px-2 py-1 rounded text-xs font-bold">
                        🙈 Hide
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}