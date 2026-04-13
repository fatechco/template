const MOCK_REVIEWS = [
  { shipment: "SHP-004", reviewer: "Paint Hub", rating: 5, comment: "Excellent delivery, very careful with fragile items.", date: "2026-03-15" },
  { shipment: "SHP-006", reviewer: "Steel Direct", rating: 4, comment: "Good service, slight delay but communicated well.", date: "2026-03-10" },
  { shipment: "SHP-008", reviewer: "Tile Experts", rating: 5, comment: "Perfect, arrived on time and items were in great condition.", date: "2026-03-05" },
];

export default function KemetroShipperReviews() {
  const avg = (MOCK_REVIEWS.reduce((s, r) => s + r.rating, 0) / MOCK_REVIEWS.length).toFixed(1);
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-black text-gray-900">My Reviews</h1>
        <span className="text-lg font-black text-yellow-600">⭐ {avg} avg</span>
      </div>
      <div className="space-y-4">
        {MOCK_REVIEWS.map((r, i) => (
          <div key={i} className="bg-white border border-gray-200 rounded-xl p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-black text-gray-900">{r.reviewer}</p>
                <p className="text-xs text-gray-400 mt-0.5">Shipment {r.shipment} · {r.date}</p>
              </div>
              <span className="text-base">{"⭐".repeat(r.rating)}</span>
            </div>
            <p className="text-sm text-gray-700 mt-3">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
}