import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Circle } from "lucide-react";
import VerifyProBadge from "./VerifyProBadge";

const CHECKLIST = {
  1: [
    { label: "Property listed", done: true },
    { label: "Seller identity verified", done: false },
    { label: "Documents uploaded", done: false },
    { label: "FO inspection", done: false },
    { label: "Certificate issued", done: false },
  ],
  2: [
    { label: "Seller identity: Confirmed", done: true },
    { label: "Accuracy pledge: Signed", done: true },
    { label: "Documents: Not yet submitted", done: false },
    { label: "FO inspection: Not yet booked", done: false },
    { label: "Certificate: Not issued", done: false },
  ],
  3: [
    { label: "Seller identity: Confirmed", done: true },
    { label: "Title Deed: AI reviewed — Authentic", done: true },
    { label: "Documents: FO Approved", done: true },
    { label: "FO physical inspection: Not yet done", done: false },
    { label: "Certificate: Not issued", done: false },
  ],
  4: [
    { label: "Seller identity: Confirmed", done: true },
    { label: "Documents: FO Approved", done: true },
    { label: "Physical inspection: Passed", done: true },
    { label: "Legal documents: Pending admin review", done: false },
    { label: "Certificate: Not yet issued", done: false },
  ],
  5: [
    { label: "Seller identity: Confirmed", done: true },
    { label: "Documents: FO Approved", done: true },
    { label: "Physical inspection: Passed", done: true },
    { label: "Legal documents: Approved", done: true },
    { label: "Certificate: Issued", done: true },
  ],
};

export default function VerifyProPanel({ property, user }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    if (!property?.id) { setLoading(false); return; }
    base44.entities.PropertyToken.filter({ propertyId: property.id })
      .then(toks => setToken(toks?.[0] || null))
      .finally(() => setLoading(false));
  }, [property?.id]);

  const level = token?.verificationLevel || 1;
  const isOwner = user?.id === property?.created_by || user?.email === property?.created_by;
  const isFraud = token?.verificationStatus === "fraud_flagged";

  const borderColor = level >= 5 ? "border-l-yellow-400" : level >= 3 ? "border-l-[#FF6B00]" : "border-l-gray-200";
  const items = CHECKLIST[Math.min(level, 5)] || CHECKLIST[1];

  if (loading) return null;

  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm border-l-4 ${borderColor} p-5`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <p className="font-black text-gray-900 text-sm">🔐 Kemedar Verify Pro™</p>
        <VerifyProBadge level={level} />
      </div>

      <div className="border-t border-gray-100 pt-3">
        {/* Level 1 — not started */}
        {level === 1 && !isFraud && (
          <div>
            <p className="text-sm text-gray-400 mb-3">This property has not been verified yet</p>
            {isOwner && (
              <Link
                to={`/verify/my-property/${property.id}`}
                className="text-sm font-bold text-[#FF6B00] border border-[#FF6B00] rounded-xl px-4 py-2 hover:bg-orange-50 transition-colors inline-flex items-center gap-1"
              >
                ✓ Verify This Property — Free to Start →
              </Link>
            )}
          </div>
        )}

        {/* Level 2–4: checklist */}
        {level >= 2 && level < 5 && !isFraud && (
          <div>
            <div className="flex flex-col gap-2 mb-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  {item.done
                    ? <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
                    : <Circle size={13} className="text-gray-300 flex-shrink-0" />}
                  <span className={item.done ? "text-gray-700" : "text-gray-400"}>{item.label}</span>
                </div>
              ))}
            </div>
            <Link to={`/verify/${token?.tokenId || ""}`} className="text-xs font-bold text-[#FF6B00] hover:underline">
              View Verification Chain →
            </Link>
          </div>
        )}

        {/* Level 5: full certificate */}
        {level === 5 && !isFraud && (
          <div>
            <div className="flex flex-col gap-1.5 mb-3">
              {items.map((item, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <CheckCircle2 size={13} className="text-green-500 flex-shrink-0" />
                  <span className="text-gray-700">{item.label}</span>
                </div>
              ))}
            </div>

            {/* Certificate box */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-3 flex items-start justify-between gap-2">
              <div>
                <p className="font-black text-yellow-800 text-xs">🏅 {token?.tokenId}</p>
                {token?.certificateExpiresAt && (
                  <p className="text-[10px] text-yellow-600">Valid until: {new Date(token.certificateExpiresAt).toLocaleDateString()}</p>
                )}
                <p className="text-[10px] text-yellow-600">Chain: {token?.chainLength || 0} immutable records</p>
              </div>
              {/* QR thumb */}
              <button onClick={() => setShowQRModal(true)} className="flex-shrink-0">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${encodeURIComponent(`https://kemedar.com/verify/${token?.tokenId}`)}&color=1a1a2e`}
                  alt="QR"
                  className="w-16 h-16 rounded-lg hover:opacity-80 transition-opacity"
                />
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              <Link to={`/verify/${token?.tokenId}`} className="flex items-center gap-1 bg-[#FF6B00] text-white font-bold text-xs px-3 py-2 rounded-lg hover:bg-[#e55f00] transition-colors">
                🔍 View Full Certificate
              </Link>
              {!isOwner && user && (
                <button className="flex items-center gap-1 font-bold text-xs px-3 py-2 rounded-lg border-2 transition-colors"
                  style={{ borderColor: "#FFD700", color: "#b8860b", boxShadow: "0 0 6px rgba(255,215,0,0.3)" }}>
                  🤝 Start Verified Deal →
                </button>
              )}
            </div>
          </div>
        )}

        {/* Fraud flagged */}
        {isFraud && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
            <p className="font-black">🚨 Verification Suspended</p>
            <p className="mt-0.5">This property is under investigation</p>
          </div>
        )}
      </div>

      {/* QR Modal */}
      {showQRModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={() => setShowQRModal(false)}>
          <div className="bg-white rounded-2xl p-6 flex flex-col items-center gap-3" onClick={e => e.stopPropagation()}>
            <p className="font-black text-gray-900">Scan to Verify</p>
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(`https://kemedar.com/verify/${token?.tokenId}`)}&color=1a1a2e`}
              alt="QR" className="w-48 h-48 rounded-xl"
            />
            <p className="font-mono text-xs text-gray-400">{token?.tokenId}</p>
            <button onClick={() => setShowQRModal(false)} className="text-sm text-gray-400 hover:text-gray-700">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}