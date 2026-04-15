// @ts-nocheck
const MOCK_COMPLETED = [
  { id: "SHP-004", route: "Cairo → Giza", store: "Paint Hub", weight: "45 kg", price: "$45", date: "2026-03-15", rating: 5 },
  { id: "SHP-006", route: "Alexandria → Luxor", store: "Steel Direct", weight: "300 kg", price: "$120", date: "2026-03-10", rating: 4 },
  { id: "SHP-008", route: "Cairo → Alexandria", store: "Tile Experts", weight: "150 kg", price: "$60", date: "2026-03-05", rating: 5 },
];

export default function KemetroShipperCompleted() {
  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-black text-gray-900">Completed Deliveries</h1>
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Shipment#", "Route", "Store", "Weight", "Earned", "Date", "Rating"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_COMPLETED.map((s, i) => (
                <tr key={s.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-4 py-3 font-mono text-xs font-black">{s.id}</td>
                  <td className="px-4 py-3 text-gray-700">{s.route}</td>
                  <td className="px-4 py-3 text-gray-600">{s.store}</td>
                  <td className="px-4 py-3 text-gray-600">{s.weight}</td>
                  <td className="px-4 py-3 font-black text-green-700">{s.price}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{s.date}</td>
                  <td className="px-4 py-3">{"⭐".repeat(s.rating)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}