import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Search, Download, ChevronLeft, ChevronRight } from "lucide-react";

const LEVEL_COLORS = {
  1: "bg-slate-100 text-slate-600",
  2: "bg-orange-100 text-orange-600",
  3: "bg-amber-100 text-amber-700",
  4: "bg-emerald-100 text-emerald-700",
  5: "bg-yellow-100 text-yellow-700 font-black",
};
const STATUS_COLORS = {
  pending: "bg-gray-100 text-gray-600",
  in_review: "bg-blue-100 text-blue-700",
  verified: "bg-green-100 text-green-700",
  expired: "bg-red-100 text-red-600",
  suspended: "bg-red-200 text-red-800",
  fraud_flagged: "bg-red-500 text-white",
};

function ChainPanel({ token, onClose }) {
  const [records, setRecords] = useState([]);
  useEffect(() => {
    if (!token) return;
    base44.entities.VerificationRecord.filter({ tokenId: token.id }, "recordNumber", 100)
      .then(setRecords).catch(() => {});
  }, [token]);

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
          <div>
            <p className="font-black text-gray-900">Verification Chain</p>
            <p className="text-xs font-mono text-gray-400">{token?.tokenId}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center hover:bg-gray-200">✕</button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {records.length === 0 ? <p className="text-sm text-gray-400 text-center py-8">No records found</p> :
            records.map((r, i) => (
              <div key={i} className="flex gap-3 items-start">
                <div className="flex flex-col items-center">
                  <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center text-xs font-black flex-shrink-0">{r.recordNumber || i + 1}</div>
                  {i < records.length - 1 && <div className="w-0.5 h-4 bg-gray-200 mt-1" />}
                </div>
                <div className="flex-1 pb-2">
                  <p className="text-xs font-bold text-gray-900">{r.title || r.recordType}</p>
                  <p className="text-[10px] text-gray-400">{r.actorLabel || r.actorType} · {r.recordedAt ? new Date(r.recordedAt).toLocaleString() : ""}</p>
                  <p className="text-[10px] font-mono text-gray-300 truncate mt-0.5">{r.recordHash?.slice(0, 24)}...</p>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </div>
  );
}

export default function VerifyProTokens() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [selectedToken, setSelectedToken] = useState(null);
  const PAGE = 20;

  useEffect(() => {
    base44.entities.PropertyToken.list("-created_date", 500).then(data => {
      setTokens(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const filtered = tokens.filter(t => {
    const matchSearch = !search || t.tokenId?.toLowerCase().includes(search.toLowerCase()) || t.propertyId?.toLowerCase().includes(search.toLowerCase());
    const matchLevel = !levelFilter || String(t.verificationLevel || 1) === levelFilter;
    const matchStatus = !statusFilter || t.verificationStatus === statusFilter;
    return matchSearch && matchLevel && matchStatus;
  });

  const pages = Math.ceil(filtered.length / PAGE);
  const paginated = filtered.slice((page - 1) * PAGE, page * PAGE);

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900">🔐 All Tokens</h1>
        <button className="flex items-center gap-2 border border-gray-200 text-gray-600 text-sm font-bold px-4 py-2 rounded-xl hover:bg-gray-50">
          <Download size={14} /> Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 flex flex-wrap gap-3">
        <div className="flex gap-1 border border-gray-200 rounded-xl overflow-hidden">
          {["", "1", "2", "3", "4", "5"].map(lv => (
            <button key={lv} onClick={() => { setLevelFilter(lv); setPage(1); }}
              className={`px-3 py-1.5 text-xs font-bold transition-all ${levelFilter === lv ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
              {lv || "All"}
            </button>
          ))}
        </div>
        <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-xl px-3 py-1.5 text-sm focus:outline-none">
          <option value="">All Statuses</option>
          {["pending", "in_review", "verified", "expired", "suspended", "fraud_flagged"].map(s => (
            <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
          ))}
        </select>
        <div className="relative flex-1 min-w-[200px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search token ID or property..."
            className="w-full pl-8 pr-4 py-1.5 border border-gray-200 rounded-xl text-sm focus:outline-none" />
        </div>
        <span className="text-xs text-gray-400 self-center">{filtered.length} tokens</span>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-400">Loading tokens...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  {["Token ID", "Property ID", "Level", "Status", "Chain", "Cert Expires", "Actions"].map(h => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center text-gray-400">No tokens found</td></tr>
                ) : paginated.map(token => (
                  <tr key={token.id} className="border-t border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3 font-mono text-xs text-gray-700">{token.tokenId}</td>
                    <td className="px-4 py-3 text-xs text-gray-500 truncate max-w-[100px]">{token.propertyId?.slice(0, 8)}...</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${LEVEL_COLORS[token.verificationLevel || 1]}`}>
                        L{token.verificationLevel || 1}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[token.verificationStatus] || "bg-gray-100 text-gray-600"}`}>
                        {token.verificationStatus || "pending"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600">{token.chainLength || 0} records</td>
                    <td className="px-4 py-3 text-xs text-gray-500">
                      {token.certificateExpiresAt ? new Date(token.certificateExpiresAt).toLocaleDateString() : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1">
                        <button onClick={() => setSelectedToken(token)}
                          title="View Chain"
                          className="text-[10px] bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-2 py-1 rounded-lg transition-colors">
                          👁️ Chain
                        </button>
                        <button title="Flag" className="text-[10px] bg-red-50 hover:bg-red-100 text-red-600 font-bold px-2 py-1 rounded-lg transition-colors">
                          🚨
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-orange-400 disabled:opacity-40">
            <ChevronLeft size={14} /> Prev
          </button>
          <span className="text-sm text-gray-600">Page {page} of {pages}</span>
          <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages}
            className="flex items-center gap-1 px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:border-orange-400 disabled:opacity-40">
            Next <ChevronRight size={14} />
          </button>
        </div>
      )}

      {selectedToken && <ChainPanel token={selectedToken} onClose={() => setSelectedToken(null)} />}
    </div>
  );
}