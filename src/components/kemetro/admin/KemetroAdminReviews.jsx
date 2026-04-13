import { useState } from "react";
import { Search, Star, Trash2, Eye, Flag, CheckCircle, XCircle } from "lucide-react";

const MOCK_REVIEWS = [
  { id: 1, buyer: "Ahmed Hassan", product: "Premium Cement 50kg", seller: "BuildRight Materials", rating: 5, comment: "Excellent quality, fast delivery. Will order again!", date: "2025-03-10", status: "Published", reported: false },
  { id: 2, buyer: "Fatima Mohamed", product: "Steel Rod 10mm", seller: "Steel Direct", rating: 2, comment: "Product was damaged on arrival. Very disappointed.", date: "2025-03-11", status: "Published", reported: true },
  { id: 3, buyer: "Omar Khalil", product: "Ceramic Floor Tile 60x60", seller: "Tile Experts Co.", rating: 4, comment: "Good tiles, slight color variation but acceptable for large areas.", date: "2025-03-12", status: "Pending", reported: false },
  { id: 4, buyer: "Sara Mostafa", product: "Wall Paint White 20L", seller: "Paint Hub", rating: 5, comment: "Perfect coverage and dries quickly. Very satisfied.", date: "2025-03-12", status: "Published", reported: false },
  { id: 5, buyer: "Nadia Farouk", product: "Premium Cement 50kg", seller: "BuildRight Materials", rating: 1, comment: "Spam spam spam buy from us instead check link", date: "2025-03-13", status: "Pending", reported: true },
  { id: 6, buyer: "Khaled Nour", product: "Steel Rod 10mm", seller: "Steel Direct", rating: 4, comment: "Good product, standard quality as expected.", date: "2025-03-08", status: "Published", reported: false },
  { id: 7, buyer: "Youssef Adel", product: "Sand Bag Fine 25kg", seller: "BuildRight Materials", rating: 3, comment: "Average quality, took longer than expected to deliver.", date: "2025-03-07", status: "Published", reported: false },
];

const STATUS_COLORS = {
  Published: "bg-green-100 text-green-700",
  Pending: "bg-yellow-100 text-yellow-700",
  Removed: "bg-red-100 text-red-700",
};

const FILTERS = ["All", "Published", "Pending", "Reported"];

function StarRow({ rating }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} size={12} className={s <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-200"} />
      ))}
    </div>
  );
}

export default function KemetroAdminReviews() {
  const [reviews, setReviews] = useState(MOCK_REVIEWS);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");
  const [ratingFilter, setRatingFilter] = useState(0);

  const filtered = reviews.filter((r) => {
    const matchSearch = r.buyer.toLowerCase().includes(search.toLowerCase()) ||
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.seller.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || (filter === "Reported" ? r.reported : r.status === filter);
    const matchRating = ratingFilter === 0 || r.rating === ratingFilter;
    return matchSearch && matchFilter && matchRating;
  });

  const approve = (id) => setReviews(reviews.map((r) => r.id === id ? { ...r, status: "Published" } : r));
  const remove = (id) => setReviews(reviews.map((r) => r.id === id ? { ...r, status: "Removed" } : r));

  const stats = [
    { label: "Total Reviews", value: reviews.length },
    { label: "Pending", value: reviews.filter((r) => r.status === "Pending").length },
    { label: "Reported", value: reviews.filter((r) => r.reported).length },
    { label: "Avg Rating", value: (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) + " ★" },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">Reviews Management</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">{s.label}</p>
            <p className="text-2xl font-black text-gray-900 mt-1">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search buyer, product, seller…" className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500" />
        </div>
        <div className="flex gap-1">
          {FILTERS.map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${filter === f ? "bg-blue-600 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{f}</button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500 font-medium">Stars:</span>
          {[0, 1, 2, 3, 4, 5].map((r) => (
            <button key={r} onClick={() => setRatingFilter(r)} className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-colors ${ratingFilter === r ? "bg-yellow-400 text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>{r === 0 ? "All" : `${r}★`}</button>
          ))}
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-3">
        {filtered.map((r) => (
          <div key={r.id} className={`bg-white rounded-xl border p-5 ${r.reported ? "border-red-200" : "border-gray-200"}`}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="font-bold text-gray-900">{r.buyer}</span>
                  <StarRow rating={r.rating} />
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[r.status]}`}>{r.status}</span>
                  {r.reported && <span className="flex items-center gap-1 text-xs font-bold bg-red-100 text-red-600 px-2 py-0.5 rounded-full"><Flag size={10} /> Reported</span>}
                </div>
                <p className="text-xs text-gray-400 mb-2">{r.product} · <span className="text-blue-600">{r.seller}</span> · {r.date}</p>
                <p className="text-sm text-gray-700 leading-relaxed">{r.comment}</p>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {r.status === "Pending" && (
                  <button onClick={() => approve(r.id)} className="flex items-center gap-1 bg-green-100 hover:bg-green-200 text-green-700 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors">
                    <CheckCircle size={13} /> Approve
                  </button>
                )}
                {r.status !== "Removed" && (
                  <button onClick={() => remove(r.id)} className="flex items-center gap-1 bg-red-100 hover:bg-red-200 text-red-600 font-bold text-xs px-3 py-1.5 rounded-lg transition-colors">
                    <XCircle size={13} /> Remove
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}