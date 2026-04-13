import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";

const fmt = (n) => n != null ? new Intl.NumberFormat("en-EG").format(Math.round(n)) : "—";

const STATUS_COLORS = {
  draft: "bg-gray-100 text-gray-600",
  under_review: "bg-orange-100 text-orange-700",
  approved: "bg-purple-100 text-purple-700",
  tokenizing: "bg-blue-100 text-blue-700",
  live: "bg-green-100 text-green-700",
  sold_out: "bg-teal-100 text-teal-700",
  rejected: "bg-red-100 text-red-700",
  suspended: "bg-gray-200 text-gray-700",
};

const TABS = ["all", "under_review", "approved", "live", "sold_out", "rejected"];

const MOCK = [
  { id: "f1", offeringTitle: "New Cairo Apt — Series A", tokenSymbol: "KMF-NC-001", submittedByUserId: "Ahmed Hassan", propertyValuationEGP: 3500000, offeringType: "fractional_investment", tokensSold: 420, totalTokenSupply: 1000, status: "live" },
  { id: "f2", offeringTitle: "Sheikh Zayed Villa", tokenSymbol: "KMF-SZ-002", submittedByUserId: "Sara Mohamed", propertyValuationEGP: 8000000, offeringType: "fractional_sale", tokensSold: 0, totalTokenSupply: 500, status: "under_review" },
  { id: "f3", offeringTitle: "North Coast Chalet", tokenSymbol: "KMF-NC-003", submittedByUserId: "Omar Khalil", propertyValuationEGP: 1800000, offeringType: "fractional_investment", tokensSold: 2000, totalTokenSupply: 2000, status: "approved" },
];

export default function KemeFracOfferings() {
  const [searchParams] = useSearchParams();
  const defaultTab = searchParams.get("status") || "all";
  const [tab, setTab] = useState(defaultTab);
  const [offerings, setOfferings] = useState(MOCK);
  const [search, setSearch] = useState("");
  const [rejectingId, setRejectingId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");

  useEffect(() => {
    base44.entities.FracProperty.filter({}, "-created_date", 200).then(d => { if (d?.length) setOfferings(d); }).catch(() => {});
  }, []);

  const filtered = offerings.filter(o => {
    const matchTab = tab === "all" || o.status === tab;
    const matchSearch = !search || o.offeringTitle?.toLowerCase().includes(search.toLowerCase()) || o.tokenSymbol?.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  const handleApprove = async (id) => {
    await base44.entities.FracProperty.update(id, { status: "approved" }).catch(() => {});
    setOfferings(prev => prev.map(o => o.id === id ? { ...o, status: "approved" } : o));
  };

  const handleReject = async (id) => {
    await base44.entities.FracProperty.update(id, { status: "rejected", rejectionReason: rejectReason }).catch(() => {});
    setOfferings(prev => prev.map(o => o.id === id ? { ...o, status: "rejected" } : o));
    setRejectingId(null); setRejectReason("");
  };

  const handleFeature = async (id, current) => {
    await base44.entities.FracProperty.update(id, { isFeatured: !current }).catch(() => {});
    setOfferings(prev => prev.map(o => o.id === id ? { ...o, isFeatured: !current } : o));
  };

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black text-gray-900">🔷 Offerings Management</h1>
        <button onClick={() => {}} className="text-xs font-bold px-3 py-2 border border-gray-200 rounded-xl text-gray-600 hover:border-[#00C896]">⬇ Export CSV</button>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2.5 text-xs font-bold capitalize whitespace-nowrap border-b-2 -mb-px transition-colors"
            style={{ borderColor: tab === t ? "#00C896" : "transparent", color: tab === t ? "#00C896" : "#6b7280" }}>
            {t.replace("_", " ")} ({t === "all" ? offerings.length : offerings.filter(o => o.status === t).length})
          </button>
        ))}
      </div>

      {/* Search */}
      <input type="text" value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search by property name or token symbol..."
        className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#00C896]" />

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50">
              <tr>
                {["Property", "Token Symbol", "Seller", "Valuation", "Type", "Tokens Sold", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((o, i) => (
                <tr key={o.id} className={`border-t border-gray-50 ${i % 2 ? "bg-gray-50/40" : ""}`}>
                  <td className="px-4 py-3 font-bold text-gray-900 max-w-[160px] truncate">{o.offeringTitle}</td>
                  <td className="px-4 py-3"><code className="text-xs font-mono font-black" style={{ color: "#00C896" }}>{o.tokenSymbol || "—"}</code></td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{o.submittedByUserId}</td>
                  <td className="px-4 py-3 font-bold text-gray-800 text-xs">{fmt(o.propertyValuationEGP)} EGP</td>
                  <td className="px-4 py-3 text-xs text-gray-500 capitalize">{o.offeringType?.replace("_", " ")}</td>
                  <td className="px-4 py-3 text-xs">
                    <span className="font-black text-gray-900">{o.tokensSold || 0}</span>
                    <span className="text-gray-400"> / {o.totalTokenSupply}</span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${STATUS_COLORS[o.status] || "bg-gray-100 text-gray-600"}`}>
                      {o.status?.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1 flex-wrap">
                      <Link to={`/admin/kemedar/kemefrac/offerings/${o.id}`}
                        className="text-[10px] font-bold px-2 py-1 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200">👁️</Link>
                      {o.status === "under_review" && (
                        <button onClick={() => handleApprove(o.id)}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg bg-green-100 text-green-700 hover:bg-green-200">✅</button>
                      )}
                      {o.status === "approved" && (
                        <Link to="/admin/kemedar/kemefrac/tokenize"
                          className="text-[10px] font-bold px-2 py-1 rounded-lg text-white" style={{ background: "#0A1628" }}>🔷</Link>
                      )}
                      {["under_review", "approved"].includes(o.status) && (
                        <button onClick={() => setRejectingId(o.id)}
                          className="text-[10px] font-bold px-2 py-1 rounded-lg bg-red-100 text-red-600 hover:bg-red-200">❌</button>
                      )}
                      <button onClick={() => handleFeature(o.id, o.isFeatured)}
                        className={`text-[10px] font-bold px-2 py-1 rounded-lg ${o.isFeatured ? "bg-yellow-200 text-yellow-700" : "bg-gray-100 text-gray-500"} hover:bg-yellow-100`}>⭐</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Reject modal */}
      {rejectingId && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="font-black text-gray-900 mb-3">Reject Offering</h3>
            <textarea value={rejectReason} onChange={e => setRejectReason(e.target.value)}
              placeholder="Provide a rejection reason for the seller..."
              className="w-full border border-gray-200 rounded-xl p-3 text-sm h-24 focus:outline-none focus:border-red-400 resize-none mb-4" />
            <div className="flex gap-3">
              <button onClick={() => { setRejectingId(null); setRejectReason(""); }}
                className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-600">Cancel</button>
              <button onClick={() => handleReject(rejectingId)}
                className="flex-1 bg-red-500 text-white rounded-xl py-2.5 text-sm font-black hover:bg-red-600">Reject Offering</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}