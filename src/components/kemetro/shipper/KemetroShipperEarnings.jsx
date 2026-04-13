const MOCK_TRANSACTIONS = [
  { id: "SHP-001", store: "Tile Experts Co.", amount: "$85.00", status: "Delivered", date: "2026-03-18", payout: "Pending" },
  { id: "SHP-002", store: "BuildRight Materials", amount: "$30.00", status: "Delivered", date: "2026-03-17", payout: "Pending" },
  { id: "SHP-004", store: "Paint Hub", amount: "$45.00", status: "Delivered", date: "2026-03-15", payout: "Paid" },
  { id: "SHP-006", store: "Steel Direct", amount: "$120.00", status: "Delivered", date: "2026-03-10", payout: "Paid" },
  { id: "SHP-008", store: "Tile Experts Co.", amount: "$60.00", status: "Delivered", date: "2026-03-05", payout: "Paid" },
];

export default function KemetroShipperEarnings() {
  const totalEarned = 1240;
  const thisMonth = 340;
  const pending = 115;
  const paidOut = 1125;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900">Earnings</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Total Earned", value: `$${totalEarned.toLocaleString()}`, color: "text-gray-900" },
          { label: "This Month", value: `$${thisMonth}`, color: "text-blue-600" },
          { label: "Pending", value: `$${pending}`, color: "text-orange-600" },
          { label: "Paid Out", value: `$${paidOut}`, color: "text-green-600" },
        ].map(s => (
          <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-black text-gray-800">Transactions</h3>
          <button disabled={pending < 50} className={`font-bold px-4 py-2 rounded-xl text-sm transition-colors ${pending >= 50 ? "bg-[#FF6B00] hover:bg-orange-600 text-white" : "bg-gray-100 text-gray-400 cursor-not-allowed"}`}>
            Request Payout {pending < 50 && "(min $50)"}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                {["Shipment#", "Seller Store", "Amount", "Status", "Date", "Payout"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_TRANSACTIONS.map((t, i) => (
                <tr key={t.id} className={i % 2 === 0 ? "bg-white" : "bg-gray-50/50"}>
                  <td className="px-4 py-3 font-mono text-xs font-bold">{t.id}</td>
                  <td className="px-4 py-3 text-gray-700">{t.store}</td>
                  <td className="px-4 py-3 font-black text-gray-900">{t.amount}</td>
                  <td className="px-4 py-3"><span className="text-xs bg-green-100 text-green-700 font-bold px-2 py-0.5 rounded-full">{t.status}</span></td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{t.date}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${t.payout === "Paid" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>{t.payout}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}