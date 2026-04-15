// @ts-nocheck
const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

const STATUS_COLORS = {
  completed: "bg-green-100 text-green-700",
  scheduled: "bg-blue-100 text-blue-700",
  processing: "bg-yellow-100 text-yellow-700",
  failed: "bg-red-100 text-red-700",
};

function exportCSV(rows) {
  const header = "Period,Property,Tokens,Yield/Token (EGP),Total (EGP),Date,Status";
  const lines = rows.map(r =>
    `"${r.distributionPeriod}","${r.offeringTitle || r.fracPropertyId}",${r.totalTokensEligible},${r.yieldPerTokenEGP},${r.totalYieldAmountEGP},"${r.distributionDate}",${r.distributionStatus}`
  );
  const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = "kemefrac_yield_history.csv";
  a.click();
}

export default function TabYieldHistory({ yieldHistory }) {
  const completed = yieldHistory.filter(y => y.distributionStatus === "completed");
  const allTimeTotal = completed.reduce((s, y) => s + (y.totalYieldAmountEGP || 0), 0);

  if (!yieldHistory || yieldHistory.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
        <p className="text-4xl mb-3">💰</p>
        <p className="font-black text-gray-700">No yield distributions yet</p>
        <p className="text-gray-400 text-sm mt-1">Distributions are paid based on each property's yield frequency</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center justify-between px-5 py-4 border-b border-gray-50">
        <p className="font-black text-gray-900">{yieldHistory.length} distributions</p>
        <button onClick={() => exportCSV(yieldHistory)}
          className="flex items-center gap-2 text-xs font-bold px-3 py-2 rounded-xl border border-gray-200 text-gray-600 hover:border-[#00C896] hover:text-[#00C896] transition-colors">
          ⬇ Export CSV
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50">
            <tr>
              {["Period", "Property", "Tokens", "Yield/Token", "Total", "Date", "Status"].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {yieldHistory.map((row, i) => (
              <tr key={row.id || i} className={`border-t border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                <td className="px-4 py-3 font-bold text-gray-800 whitespace-nowrap">{row.distributionPeriod}</td>
                <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{row.offeringTitle || row.fracPropertyId}</td>
                <td className="px-4 py-3 text-gray-700 font-bold">{row.totalTokensEligible}</td>
                <td className="px-4 py-3 text-gray-700">{fmt(row.yieldPerTokenEGP)} EGP</td>
                <td className="px-4 py-3 font-black" style={{ color: "#F59E0B" }}>{fmt(row.totalYieldAmountEGP)} EGP</td>
                <td className="px-4 py-3 text-gray-400 text-xs whitespace-nowrap">{row.distributionDate}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${STATUS_COLORS[row.distributionStatus] || "bg-gray-100 text-gray-600"}`}>
                    {row.distributionStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t-2 border-gray-200 bg-gray-50">
              <td colSpan={4} className="px-4 py-3 font-black text-gray-700">All time total:</td>
              <td className="px-4 py-3 font-black text-lg" style={{ color: "#F59E0B" }}>{fmt(allTimeTotal)} EGP</td>
              <td colSpan={2} />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}