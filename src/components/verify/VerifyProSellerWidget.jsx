import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";

export default function VerifyProSellerWidget({ propertyId }) {
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!propertyId) { setLoading(false); return; }
    base44.entities.PropertyToken.filter({ propertyId })
      .then(toks => setToken(toks?.[0] || null))
      .finally(() => setLoading(false));
  }, [propertyId]);

  if (loading) return <div className="h-5 w-32 bg-gray-100 rounded animate-pulse" />;

  const level = token?.verificationLevel || 1;
  const isFraud = token?.verificationStatus === "fraud_flagged" || token?.verificationStatus === "suspended";

  if (isFraud) {
    return (
      <div className="flex items-center gap-2 flex-wrap mt-1">
        <span className="text-[10px] font-black bg-red-100 text-red-700 px-2 py-0.5 rounded-full">🚨 Listing Suspended</span>
        <Link to="/contact" className="text-[10px] text-red-600 hover:underline font-bold">Contact Support</Link>
      </div>
    );
  }

  // Check expiry warning
  const daysUntilExpiry = token?.certificateExpiresAt
    ? Math.ceil((new Date(token.certificateExpiresAt) - new Date()) / (1000 * 60 * 60 * 24))
    : null;
  const expiringSoon = daysUntilExpiry !== null && daysUntilExpiry <= 30 && daysUntilExpiry > 0;

  if (level === 5) {
    return (
      <div className="mt-1 flex flex-col gap-1">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[10px] font-black bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">🏅 Fully Verified</span>
          {token?.certificateExpiresAt && (
            <span className="text-[10px] text-gray-400">Expires: {new Date(token.certificateExpiresAt).toLocaleDateString()}</span>
          )}
          <Link to={`/verify/${token?.tokenId}`} className="text-[10px] text-[#FF6B00] hover:underline font-bold">View Certificate</Link>
        </div>
        {expiringSoon && (
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-bold text-orange-600">⚠️ Expires in {daysUntilExpiry} days</span>
            <button className="text-[10px] bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full hover:bg-orange-200 transition-colors">
              Renew — 199 EGP
            </button>
          </div>
        )}
      </div>
    );
  }

  if (level >= 2) {
    return (
      <div className="mt-1 flex items-center gap-2 flex-wrap">
        <span className="text-[10px] font-bold bg-orange-100 text-orange-700 px-2 py-0.5 rounded-full">◑ Level {level} — In Progress</span>
        <span className="text-[10px] text-gray-400">Level {level} of 5 completed</span>
        <Link to={`/verify/my-property/${propertyId}`} className="text-[10px] text-[#FF6B00] hover:underline font-bold">Continue Verifying →</Link>
      </div>
    );
  }

  // Level 1 — not started
  return (
    <div className="mt-1 flex items-center gap-2 flex-wrap">
      <span className="text-[10px] font-bold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">○ Not Verified</span>
      <Link to={`/verify/my-property/${propertyId}`} className="text-[10px] text-[#FF6B00] hover:underline font-bold">Start Verifying →</Link>
    </div>
  );
}