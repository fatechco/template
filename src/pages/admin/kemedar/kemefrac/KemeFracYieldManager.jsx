import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

const MOCK_LIVE = [
  { id: "f1", offeringTitle: "New Cairo Apt — Series A", tokenSymbol: "KMF-NC-001", tokensSold: 420, expectedAnnualYieldPercent: 9.5, tokenPriceEGP: 1000, yieldFrequency: "monthly" },
  { id: "f4", offeringTitle: "Maadi Office Space", tokenSymbol: "KMF-MO-004", tokensSold: 120, expectedAnnualYieldPercent: 8, tokenPriceEGP: 3000, yieldFrequency: "quarterly" },
];

const MOCK_HISTORY = [
  { id: "d1", distributionPeriod: "March 2026", offeringTitle: "New Cairo Apt", totalYieldAmountEGP: 47500, recipientsCount: 19, yieldPerTokenEGP: 79.2, distributionDate: "2026-03-01", distributionStatus: "completed" },
  { id: "d2", distributionPeriod: "February 2026", offeringTitle: "New Cairo Apt", totalYieldAmountEGP: 47500, recipientsCount: 19, yieldPerTokenEGP: 79.2, distributionDate: "2026-02-01", distributionStatus: "completed" },
];

const STATUS_COLORS = { completed: "bg-green-100 text-green-700", scheduled: "bg-blue-100 text-blue-700", processing: "bg-yellow-100 text-yellow-700", failed: "bg-red-100 text-red-700" };

export default function KemeFracYieldManager() {
  const [tab, setTab] = useState("distribute");
  const [liveOfferings, setLiveOfferings] = useState(MOCK_LIVE);
  const [history, setHistory] = useState(MOCK_HISTORY);
  const [selectedOffering, setSelectedOffering] = useState(null);
  const [form, setForm] = useState({ period: "", amount: "", date: "", notes: "" });
  const [confirming, setConfirming] = useState(false);
  const [distributing, setDistributing] = useState(false);

  useEffect(() => {
    base44.entities.FracProperty.filter({ status: "live" }, "-created_date", 50).then(d => { if (d?.length) setLiveOfferings(d.filter(o => o.expectedAnnualYieldPercent > 0)); }).catch(() => {});
    base44.entities.FracYieldDistribution.filter({}, "-distributionDate", 100).then(d => { if (d?.length) setHistory(d); }).catch(() => {});
  }, []);

  const yieldPerToken = selectedOffering && form.amount
    ? (parseFloat(form.amount) / (selectedOffering.tokensSold || 1)).toFixed(2)
    : null;

  const handleDistribute = async () => {
    setDistributing(true);
    await base44.functions.invoke("distributeYield", {
      fracPropertyId: selectedOffering.id,
      distributionPeriod: form.period,
      totalYieldAmountEGP: parseFloat(form.amount),
      distributionDate: form.date,
      notes: form.notes,
    }).catch(() => {});
    setDistributing(false);
    setConfirming(false);
    setForm({ period: "", amount: "", date: "", notes: "" });
    setSelectedOffering(null);
    alert("Yield distributed successfully!");
  };

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-black text-gray-900">💰 Yield Manager</h1>

      <div className="flex gap-0 border-b border-gray-200">
        {["distribute", "history"].map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-5 py-2.5 text-sm font-bold capitalize border-b-2 -mb-px transition-colors"
            style={{ borderColor: tab === t ? "#00C896" : "transparent", color: tab === t ? "#00C896" : "#6b7280" }}>
            {t === "distribute" ? "Distribute Yield" : "History"}
          </button>
        ))}
      </div>

      {tab === "distribute" && (
        <div className="space-y-5 max-w-xl">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1.5">Select Offering</label>
            <select value={selectedOffering?.id || ""} onChange={e => setSelectedOffering(liveOfferings.find(o => o.id === e.target.value) || null)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00C896]">
              <option value="">— Choose a live yield-bearing offering —</option>
              {liveOfferings.map(o => <option key={o.id} value={o.id}>{o.offeringTitle} ({o.tokenSymbol})</option>)}
            </select>
          </div>

          {selectedOffering && (
            <div className="rounded-xl p-4 text-sm space-y-1" style={{ background: "#F0FDF9", border: "1.5px solid #6EE7B7" }}>
              <p className="text-gray-600">Total investors: <span className="font-black text-gray-900">~19</span></p>
              <p className="text-gray-600">Total tokens sold: <span className="font-black text-gray-900">{fmt(selectedOffering.tokensSold)}</span></p>
              <p className="text-gray-600">Yield frequency: <span className="font-black text-gray-900 capitalize">{selectedOffering.yieldFrequency}</span></p>
              <p className="text-gray-600">Annual yield: <span className="font-black text-gray-900">{selectedOffering.expectedAnnualYieldPercent}%</span></p>
            </div>
          )}

          {[
            { key: "period", label: "Distribution Period", placeholder: 'e.g. "Q1 2026" or "March 2026"' },
            { key: "amount", label: "Total Yield Amount (EGP)", placeholder: "e.g. 47500", type: "number" },
            { key: "date", label: "Distribution Date", type: "date" },
            { key: "notes", label: "Notes (optional)", placeholder: "Admin notes..." },
          ].map(f => (
            <div key={f.key}>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">{f.label}</label>
              <input type={f.type || "text"} value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                placeholder={f.placeholder || ""}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00C896]" />
            </div>
          ))}

          {yieldPerToken && form.amount && (
            <div className="rounded-xl border border-gray-200 overflow-hidden">
              {[
                ["Yield per token", `${yieldPerToken} EGP`],
                ["Recipients", "~19 investors"],
                ["Largest payout", `${fmt(parseFloat(yieldPerToken) * 50)} EGP`],
                ["Smallest payout", `${fmt(parseFloat(yieldPerToken) * 5)} EGP`],
              ].map(([label, value], i) => (
                <div key={label} className={`flex justify-between px-4 py-3 text-sm ${i % 2 ? "bg-gray-50" : "bg-white"}`}>
                  <span className="text-gray-500">{label}</span>
                  <span className="font-black text-gray-900">{value}</span>
                </div>
              ))}
            </div>
          )}

          <button
            disabled={!selectedOffering || !form.period || !form.amount || !form.date}
            onClick={() => setConfirming(true)}
            className="w-full py-3 rounded-xl font-black text-sm disabled:opacity-40"
            style={{ background: "#F59E0B", color: "#0A1628" }}>
            💰 Distribute Yield to All Holders
          </button>
        </div>
      )}

      {tab === "history" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  {["Period", "Offering", "Total Paid", "Recipients", "Per Token", "Date", "Status"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {history.map((d, i) => (
                  <tr key={d.id} className={`border-t border-gray-50 ${i % 2 ? "bg-gray-50/40" : ""}`}>
                    <td className="px-4 py-3 font-bold text-gray-800">{d.distributionPeriod}</td>
                    <td className="px-4 py-3 text-gray-600 max-w-[140px] truncate">{d.offeringTitle}</td>
                    <td className="px-4 py-3 font-black" style={{ color: "#F59E0B" }}>{fmt(d.totalYieldAmountEGP)} EGP</td>
                    <td className="px-4 py-3 text-gray-700">{d.recipientsCount}</td>
                    <td className="px-4 py-3 text-gray-700">{fmt(d.yieldPerTokenEGP)} EGP</td>
                    <td className="px-4 py-3 text-xs text-gray-400">{d.distributionDate}</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${STATUS_COLORS[d.distributionStatus] || "bg-gray-100"}`}>
                        {d.distributionStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirm modal */}
      {confirming && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl text-center">
            <p className="text-3xl mb-3">💰</p>
            <h3 className="font-black text-gray-900 mb-2">Confirm Yield Distribution</h3>
            <p className="text-sm text-gray-500 mb-4">
              This will send <span className="font-black text-gray-900">{fmt(parseFloat(form.amount || 0))} EGP</span> to <span className="font-black text-gray-900">~19 investors</span>. This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setConfirming(false)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-600">Cancel</button>
              <button onClick={handleDistribute} disabled={distributing}
                className="flex-1 rounded-xl py-2.5 text-sm font-black disabled:opacity-60"
                style={{ background: "#F59E0B", color: "#0A1628" }}>
                {distributing ? "Processing..." : "Confirm"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}