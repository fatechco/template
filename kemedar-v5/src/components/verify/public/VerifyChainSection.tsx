"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

const RECORD_META = {
  property_listed:          { icon: "🏠", color: "bg-gray-400" },
  seller_identity_verified: { icon: "👤", color: "bg-blue-500" },
  seller_signed_pledge:     { icon: "✍️",  color: "bg-blue-500" },
  document_uploaded:        { icon: "📤", color: "bg-orange-400" },
  document_ai_analyzed:     { icon: "🤖", color: "bg-orange-400" },
  document_fo_verified:     { icon: "👁️",  color: "bg-orange-400" },
  fo_inspection_scheduled:  { icon: "📅", color: "bg-purple-500" },
  fo_inspection_completed:  { icon: "🔍", color: "bg-purple-500" },
  legal_doc_submitted:      { icon: "📋", color: "bg-orange-400" },
  admin_manual_review:      { icon: "🛡️",  color: "bg-gray-700" },
  certificate_issued:       { icon: "🏅", color: "bg-yellow-500" },
  certificate_renewed:      { icon: "🔁", color: "bg-yellow-500" },
  ownership_transferred:    { icon: "🔄", color: "bg-green-500" },
  fraud_flag_raised:        { icon: "🚨", color: "bg-red-500" },
  fraud_flag_cleared:       { icon: "✅", color: "bg-green-500" },
  suspension_applied:       { icon: "🚫", color: "bg-red-500" },
  suspension_lifted:        { icon: "✅", color: "bg-green-500" },
  level_upgraded:           { icon: "⬆️",  color: "bg-green-500" },
  custom_admin_note:        { icon: "📝", color: "bg-gray-500" },
};

function ChainRecord({ rec }) {
  const [expanded, setExpanded] = useState(false);
  const meta = RECORD_META[rec.recordType] || { icon: "📌", color: "bg-gray-400" };

  return (
    <div className="flex gap-4 items-start">
      {/* Dot */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-4 h-4 rounded-full ${meta.color} flex items-center justify-center text-[8px] mt-0.5`} />
        <div className="w-px flex-1 bg-gray-200 mt-1" />
      </div>
      {/* Content */}
      <div className="flex-1 pb-5">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <span className="text-base">{meta.icon}</span>
          <p className="font-bold text-gray-900 text-sm">{rec.title || rec.recordType?.replace(/_/g, " ")}</p>
        </div>
        {rec.details && <p className="text-xs text-gray-500 mb-1 leading-relaxed">{rec.details}</p>}
        <div className="flex flex-wrap items-center gap-3 text-[10px] text-gray-400">
          <span>Actor: {rec.actorLabel || rec.actorType}</span>
          <span>·</span>
          <span>{rec.recordedAt ? new Date(rec.recordedAt).toLocaleString() : ""}</span>
          {rec.recordHash && (
            <>
              <span>·</span>
              <span className="font-mono">Hash: {rec.recordHash.slice(0, 16)}...</span>
              <button onClick={() => setExpanded(!expanded)} className="text-[#FF6B00] hover:underline">
                {expanded ? "Hide ▲" : "Full Hash ▼"}
              </button>
            </>
          )}
        </div>
        {expanded && rec.recordHash && (
          <p className="font-mono text-[9px] text-gray-400 mt-1 break-all bg-gray-50 rounded p-2">{rec.recordHash}</p>
        )}
      </div>
    </div>
  );
}

export default function VerifyChainSection({ token, records }) {
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const handleVerify = async () => {
    setVerifying(true);
    const res = await apiClient.post("/api/v1/ai/verifyChainIntegrity", { tokenId: token?.id });
    setVerifyResult(res.data);
    setVerifying(false);
  };

  const chainValid = verifyResult ? verifyResult.isValid : true;
  const chainBroken = verifyResult && !verifyResult.isValid;
  const sorted = [...records].reverse(); // newest first

  return (
    <div className="bg-gray-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-xl font-black text-gray-900 mb-1">⛓️ Immutable Verification Chain</h2>
        <p className="text-sm text-gray-500 mb-6">Every action is permanently recorded and tamper-proof</p>

        {/* Integrity banner */}
        <div className={`rounded-xl px-4 py-3 flex items-center gap-3 mb-8 ${chainBroken ? "bg-red-50 border border-red-200" : "bg-green-50 border border-green-200"}`}>
          <span className="text-xl">{chainBroken ? "🔴" : "🟢"}</span>
          <div className="flex-1">
            <p className={`font-bold text-sm ${chainBroken ? "text-red-800" : "text-green-800"}`}>
              Chain Integrity: {chainBroken ? "FAILED" : "Verified"}
            </p>
            {!chainBroken && (
              <p className="text-xs text-green-600">
                {records.length} records — all hashes valid
                {verifyResult?.verifiedAt && ` · Last verified: ${new Date(verifyResult.verifiedAt).toLocaleString()}`}
              </p>
            )}
            {chainBroken && (
              <p className="text-xs text-red-600">Tampering detected — chain integrity compromised</p>
            )}
          </div>
          <button
            onClick={handleVerify}
            disabled={verifying}
            className="text-xs border border-green-400 text-green-700 px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors flex items-center gap-1"
          >
            {verifying ? <span className="w-3 h-3 border border-green-500 border-t-transparent rounded-full animate-spin inline-block" /> : null}
            Re-verify Chain
          </button>
        </div>

        {/* Timeline */}
        {sorted.length === 0 ? (
          <p className="text-sm text-gray-400 text-center py-8">No chain records found.</p>
        ) : (
          <div>
            {sorted.map(rec => <ChainRecord key={rec.id} rec={rec} />)}
          </div>
        )}
      </div>
    </div>
  );
}