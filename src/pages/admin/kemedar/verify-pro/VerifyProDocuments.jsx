import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { ChevronDown, ChevronUp } from "lucide-react";

const DECISION_COLORS = {
  authentic: "bg-green-100 text-green-700",
  likely_authentic: "bg-emerald-100 text-emerald-600",
  suspicious: "bg-yellow-100 text-yellow-700",
  likely_fraudulent: "bg-red-100 text-red-700",
  unreadable: "bg-gray-100 text-gray-600",
};

function DocumentCard({ doc, onAction }) {
  const [expanded, setExpanded] = useState(false);
  const [note, setNote] = useState("");
  const [acting, setActing] = useState(false);

  const isPriority1 = (doc.aiScore || 100) < 40;
  const isPriority2 = !isPriority1 && doc.created_date && (Date.now() - new Date(doc.created_date)) > 48 * 3600 * 1000;

  const borderClass = isPriority1 ? "border-l-4 border-l-red-500" : isPriority2 ? "border-l-4 border-l-orange-400" : "";

  const handleAction = async (action) => {
    setActing(true);
    const updateData = {
      foReviewStatus: action === "approve" ? "approved" : action === "resubmit" ? "needs_resubmission" : "rejected",
      overallStatus: action === "approve" ? "approved" : action === "resubmit" ? "pending" : "rejected",
      foReviewNotes: note,
      foReviewedAt: new Date().toISOString(),
    };
    await base44.entities.VerificationDocument.update(doc.id, updateData).catch(() => {});
    setActing(false);
    onAction();
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden ${borderClass}`}>
      {isPriority1 && <div className="bg-red-500 text-white text-[10px] font-black px-4 py-1">⚠️ PRIORITY — AI Score Suspicious</div>}
      {isPriority2 && !isPriority1 && <div className="bg-orange-400 text-white text-[10px] font-black px-4 py-1">⏰ PRIORITY — Pending &gt; 48 hours</div>}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">
        {/* Left: Document View */}
        <div className="lg:col-span-3 p-5">
          <div className="flex items-start gap-3 mb-4">
            <div className="flex-1">
              <p className="font-black text-gray-900">{doc.documentType?.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase())}</p>
              <p className="text-xs text-gray-400 font-mono mt-0.5">{doc.tokenId?.slice(0, 12)}...</p>
            </div>
            <span className="text-xs text-gray-400">Submitted {doc.created_date ? new Date(doc.created_date).toLocaleDateString() : "—"}</span>
          </div>

          {doc.aiAnalyzed && (
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-2">
                <span className="text-sm font-bold text-gray-700">AI Score:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                  <div className="h-2.5 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500"
                    style={{ width: `${doc.aiScore || 0}%` }} />
                </div>
                <span className="font-black text-gray-900">{doc.aiScore || 0}/100</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DECISION_COLORS[doc.aiDecision] || "bg-gray-100"}`}>
                  {doc.aiDecision?.replace(/_/g, " ")}
                </span>
              </div>
              {doc.aiSummary && <p className="text-xs text-gray-600 italic">"{doc.aiSummary}"</p>}
              {doc.aiFindings?.length > 0 && (
                <button onClick={() => setExpanded(!expanded)} className="mt-2 text-xs text-orange-500 font-bold flex items-center gap-1">
                  {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />} {doc.aiFindings.length} AI Findings
                </button>
              )}
              {expanded && doc.aiFindings?.map((f, i) => (
                <div key={i} className="mt-2 bg-white rounded-lg p-2 text-xs">
                  <span className={`font-bold ${f.severity === "critical" ? "text-red-600" : f.severity === "high" ? "text-orange-600" : "text-yellow-600"}`}>
                    {f.severity?.toUpperCase()}:
                  </span> {f.finding || f.detail}
                </div>
              ))}
            </div>
          )}

          {doc.fileUrl && (
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {doc.fileType === "pdf" ? (
                <iframe src={doc.fileUrl} className="w-full h-48" title="Document" />
              ) : (
                <img src={doc.fileUrl} alt="Document" className="w-full h-48 object-contain bg-gray-50" />
              )}
            </div>
          )}
        </div>

        {/* Right: Review Panel */}
        <div className="lg:col-span-2 p-5 bg-gray-50/50">
          <p className="font-black text-gray-900 mb-4 text-sm">Franchise Owner Decision</p>

          <textarea value={note} onChange={e => setNote(e.target.value)}
            placeholder="Add note for seller (optional)..."
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200 mb-4 bg-white h-20 resize-none" />

          <div className="space-y-2">
            <button onClick={() => handleAction("approve")} disabled={acting}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
              ✅ Approve Document
            </button>
            <button onClick={() => handleAction("resubmit")} disabled={acting}
              className="w-full border-2 border-amber-400 text-amber-700 font-bold py-2.5 rounded-xl text-sm hover:bg-amber-50 transition-colors disabled:opacity-50">
              🔄 Request Resubmission
            </button>
            <button onClick={() => handleAction("reject")} disabled={acting}
              className="w-full border-2 border-red-300 text-red-600 font-bold py-2.5 rounded-xl text-sm hover:bg-red-50 transition-colors disabled:opacity-50">
              🚨 Reject — Fraud Suspected
            </button>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-200">
            <p className="text-[10px] text-gray-400 mb-1">Current FO Status</p>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              doc.foReviewStatus === "approved" ? "bg-green-100 text-green-700" :
              doc.foReviewStatus === "rejected" ? "bg-red-100 text-red-600" :
              doc.foReviewStatus === "needs_resubmission" ? "bg-amber-100 text-amber-700" :
              "bg-gray-100 text-gray-600"
            }`}>
              {doc.foReviewStatus || "pending"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyProDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("pending");

  const load = async () => {
    const data = await base44.entities.VerificationDocument.list("-created_date", 100).catch(() => []);
    setDocs(data);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const byTab = {
    pending: docs.filter(d => d.foReviewStatus === "pending" || !d.foReviewStatus),
    approved: docs.filter(d => d.foReviewStatus === "approved"),
    rejected: docs.filter(d => d.foReviewStatus === "rejected" || d.foReviewStatus === "needs_resubmission"),
  };

  const sorted = [...(byTab[tab] || [])].sort((a, b) => {
    const aScore = a.aiScore || 100;
    const bScore = b.aiScore || 100;
    if (aScore < 40 && bScore >= 40) return -1;
    if (bScore < 40 && aScore >= 40) return 1;
    return new Date(a.created_date) - new Date(b.created_date);
  });

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-black text-gray-900">📄 Document Review Queue</h1>

      <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 w-fit shadow-sm">
        {Object.entries({ pending: "Pending", approved: "Approved", rejected: "Rejected / Resubmit" }).map(([k, v]) => (
          <button key={k} onClick={() => setTab(k)}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === k ? "bg-orange-500 text-white shadow" : "text-gray-600 hover:bg-gray-50"}`}>
            {v} ({byTab[k]?.length || 0})
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-4">{[1,2].map(i => <div key={i} className="h-48 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}</div>
      ) : sorted.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-4xl mb-3">📭</p>
          <p className="font-bold text-gray-500">No documents in this queue</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sorted.map(doc => <DocumentCard key={doc.id} doc={doc} onAction={load} />)}
        </div>
      )}
    </div>
  );
}