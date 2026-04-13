import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

const SEVERITY_BORDER = {
  critical: "border-l-red-600", high: "border-l-orange-500", medium: "border-l-yellow-400", low: "border-l-blue-400",
};
const SEVERITY_BADGE = {
  critical: "bg-red-600 text-white", high: "bg-orange-500 text-white", medium: "bg-yellow-400 text-white", low: "bg-blue-400 text-white",
};

const ACTIONS = [
  "Suspend listing permanently",
  "Remove listing + warn seller",
  "Ban seller account",
  "Suspend listing + escalate to legal",
];

function FraudCard({ token, onAction }) {
  const [resolving, setResolving] = useState(false);
  const [confirming, setConfirming] = useState(false);
  const [actionType, setActionType] = useState(ACTIONS[0]);
  const [adminNote, setAdminNote] = useState("");

  const severity = token.verificationStatus === "fraud_flagged" ? "critical" : "high";

  const handleResolve = async () => {
    setResolving(true);
    await base44.entities.PropertyToken.update(token.id, { verificationStatus: "pending" }).catch(() => {});
    await base44.functions.invoke("appendVerificationRecord", {
      tokenId: token.id, recordType: "fraud_flag_cleared",
      actorType: "admin", actorLabel: "Admin",
      title: "Fraud flag cleared — False alarm",
      details: adminNote || "Admin resolved as false alarm",
    }).catch(() => {});
    setResolving(false);
    onAction();
  };

  const handleConfirm = async () => {
    setConfirming(true);
    await base44.entities.PropertyToken.update(token.id, { verificationStatus: "suspended" }).catch(() => {});
    await base44.functions.invoke("appendVerificationRecord", {
      tokenId: token.id, recordType: "suspension_applied",
      actorType: "admin", actorLabel: "Admin",
      title: `Fraud confirmed: ${actionType}`,
      details: adminNote,
    }).catch(() => {});
    setConfirming(false);
    onAction();
  };

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm border-l-4 ${SEVERITY_BORDER[severity]} overflow-hidden`}>
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${SEVERITY_BADGE[severity]}`}>{severity}</span>
              <span className="text-sm font-black text-gray-900">🚨 Fraud Flag — {token.verificationStatus?.replace(/_/g, " ")}</span>
            </div>
            <p className="text-xs text-gray-500">Property: <span className="font-bold">{token.propertyId?.slice(0, 12)}...</span></p>
            <p className="text-xs text-gray-400 font-mono">Token: {token.tokenId}</p>
          </div>
          <div className="text-xs text-gray-400">{token.updated_date ? new Date(token.updated_date).toLocaleDateString() : "—"}</div>
        </div>

        <div className="flex gap-3 mb-5">
          <Link to={`/admin/kemedar/verify-pro/tokens`} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-lg transition-colors">
            🔍 View Full Chain
          </Link>
          <Link to={`/admin/kemedar/verify-pro/documents`} className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-3 py-1.5 rounded-lg transition-colors">
            👁️ View Documents
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          {/* Resolve: False Alarm */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="font-black text-green-800 text-sm mb-3">✅ Resolve: False Alarm</p>
            <textarea value={adminNote} onChange={e => setAdminNote(e.target.value)}
              placeholder="Admin note..."
              className="w-full bg-white border border-green-200 rounded-xl px-3 py-2 text-xs focus:outline-none mb-3 h-16 resize-none" />
            <button onClick={handleResolve} disabled={resolving}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
              {resolving ? "Processing..." : "✅ Resolve & Reinstate Listing"}
            </button>
          </div>

          {/* Confirm Fraud */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <p className="font-black text-red-800 text-sm mb-3">🚨 Confirm Fraud — Take Action</p>
            <select value={actionType} onChange={e => setActionType(e.target.value)}
              className="w-full border border-red-200 rounded-xl px-3 py-2 text-xs bg-white focus:outline-none mb-2">
              {ACTIONS.map(a => <option key={a}>{a}</option>)}
            </select>
            <textarea placeholder="Admin notes..." className="w-full bg-white border border-red-200 rounded-xl px-3 py-2 text-xs focus:outline-none mb-3 h-12 resize-none" />
            <button onClick={handleConfirm} disabled={confirming}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-2.5 rounded-xl text-sm transition-colors disabled:opacity-50">
              {confirming ? "Processing..." : "🚨 Confirm Action"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyProFraud() {
  const [tokens, setTokens] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severity, setSeverity] = useState("");
  const [status, setStatus] = useState("fraud_flagged");

  const load = async () => {
    const data = await base44.entities.PropertyToken.filter({ verificationStatus: "fraud_flagged" }, "-updated_date", 100).catch(() => []);
    const suspended = await base44.entities.PropertyToken.filter({ verificationStatus: "suspended" }, "-updated_date", 50).catch(() => []);
    setTokens([...data, ...suspended]);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const filtered = tokens.filter(t => !status || t.verificationStatus === status);

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-black text-gray-900">🚨 Fraud Alerts</h1>

      {tokens.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 flex items-center gap-3">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-black text-red-800 text-sm">{tokens.length} Active Fraud Flags</p>
            <p className="text-xs text-red-600">Requires immediate admin review</p>
          </div>
        </div>
      )}

      <div className="flex gap-3 flex-wrap">
        <div className="flex gap-1 bg-white border border-gray-100 rounded-xl p-1 shadow-sm">
          {["fraud_flagged", "suspended", ""].map((s, i) => (
            <button key={i} onClick={() => setStatus(s)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${status === s ? "bg-orange-500 text-white" : "text-gray-600 hover:bg-gray-50"}`}>
              {s === "fraud_flagged" ? "Open Fraud" : s === "suspended" ? "Suspended" : "All"}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{[1, 2].map(i => <div key={i} className="h-64 bg-white rounded-2xl border border-gray-100 animate-pulse" />)}</div>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-16 text-center">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-bold text-gray-500">No active fraud alerts</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(t => <FraudCard key={t.id} token={t} onAction={load} />)}
        </div>
      )}
    </div>
  );
}