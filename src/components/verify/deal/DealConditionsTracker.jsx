import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Clock, XCircle, Minus } from "lucide-react";

const CONDITIONS = [
  { key: "property_verified", label: "Property is minimum Level 3 Verified", auto: true },
  { key: "seller_identity", label: "Seller identity is confirmed", auto: true },
  { key: "title_deed", label: "Title Deed uploaded and approved", auto: true },
  { key: "no_fraud", label: "No active fraud flags on this property", auto: true },
  { key: "buyer_kyc", label: "Your KYC Confirmation", auto: false, action: "kyc" },
  { key: "payment", label: "Payment Confirmation (receipt upload)", auto: false, action: "payment" },
  { key: "admin_approval", label: "Kemedar Admin Approval", auto: false, system: true },
];

function ConditionRow({ cond, status, uploadedAt, user, deal, isBuyer, onUpload }) {
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    await base44.integrations.Core.UploadFile({ file });
    onUpload(cond.key);
    setUploading(false);
  };

  let icon, textClass, subText;
  if (status === "passed") {
    icon = <CheckCircle2 size={16} className="text-green-500 flex-shrink-0 mt-0.5" />;
    textClass = "text-gray-800";
    subText = <span className="text-xs text-green-600">Passed{uploadedAt ? ` on ${new Date(uploadedAt).toLocaleDateString()}` : ""}</span>;
  } else if (status === "failed") {
    icon = <XCircle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />;
    textClass = "text-gray-800";
    subText = <span className="text-xs text-red-500">Not met — action required</span>;
  } else if (status === "waived") {
    icon = <Minus size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />;
    textClass = "text-gray-400 line-through";
    subText = <span className="text-xs text-gray-400">Waived by admin</span>;
  } else {
    icon = <Clock size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />;
    textClass = "text-gray-700";
    subText = null;
  }

  return (
    <div className="flex items-start gap-3 py-3 border-b border-gray-50 last:border-0">
      {icon}
      <div className="flex-1">
        <p className={`text-sm font-semibold ${textClass}`}>{cond.label}</p>
        {subText}
        {status === "pending" && isBuyer && cond.action === "kyc" && (
          <label className="mt-2 flex items-center gap-2 cursor-pointer">
            <span className="text-xs bg-orange-50 border border-orange-200 text-orange-700 font-bold px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">
              {uploading ? "Uploading..." : "Upload National ID + Selfie →"}
            </span>
            <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleFileUpload(e.target.files?.[0])} disabled={uploading} />
          </label>
        )}
        {status === "pending" && isBuyer && cond.action === "payment" && (
          <label className="mt-2 flex items-center gap-2 cursor-pointer">
            <span className="text-xs bg-orange-50 border border-orange-200 text-orange-700 font-bold px-3 py-1.5 rounded-lg hover:bg-orange-100 transition-colors">
              {uploading ? "Uploading..." : "Upload Bank Receipt / Transfer Screenshot →"}
            </span>
            <input type="file" className="hidden" accept=".jpg,.jpeg,.png,.pdf" onChange={e => handleFileUpload(e.target.files?.[0])} disabled={uploading} />
          </label>
        )}
        {status === "pending" && cond.system && (
          <span className="text-xs text-gray-400 block mt-1">⏳ Under review — no action needed</span>
        )}
      </div>
    </div>
  );
}

export default function DealConditionsTracker({ deal, token, property, user, onRefresh }) {
  const [conditionOverrides, setConditionOverrides] = useState({});
  const isBuyer = user?.id === deal?.buyerId;

  const getStatus = (key) => {
    if (conditionOverrides[key]) return "passed";
    switch (key) {
      case "property_verified": return (token?.verificationLevel || 1) >= 3 ? "passed" : "pending";
      case "seller_identity": return (token?.verificationLevel || 1) >= 2 ? "passed" : "pending";
      case "title_deed": return "pending";
      case "no_fraud": return token?.verificationStatus !== "fraud_flagged" ? "passed" : "failed";
      case "admin_approval": return deal?.status === "deal_closed" ? "passed" : "pending";
      default: return "pending";
    }
  };

  const metCount = CONDITIONS.filter(c => getStatus(c.key) === "passed").length;
  const allMet = metCount === CONDITIONS.length;
  const pct = Math.round((metCount / CONDITIONS.length) * 100);

  const handleUpload = (key) => {
    setConditionOverrides(p => ({ ...p, [key]: true }));
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
      <h3 className="font-black text-gray-900 text-base mb-1">📋 Smart Contract Conditions</h3>
      <p className="text-xs text-gray-500 mb-4">{metCount} of {CONDITIONS.length} conditions met</p>

      {/* Progress bar */}
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-5">
        <div className="h-full bg-[#FF6B00] rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>

      {/* Conditions */}
      <div className="mb-4">
        {CONDITIONS.map(cond => (
          <ConditionRow
            key={cond.key}
            cond={cond}
            status={getStatus(cond.key)}
            isBuyer={isBuyer}
            deal={deal}
            user={user}
            onUpload={handleUpload}
          />
        ))}
      </div>

      {/* All met banner */}
      {allMet && (
        <div className="bg-green-50 border-2 border-green-400 rounded-xl p-4 text-center animate-pulse">
          <p className="font-black text-green-800 text-lg">🎉 All Conditions Met — Deal Ready!</p>
          <p className="text-sm text-green-600 mt-1">Kemedar admin will execute the ownership transfer</p>
          <p className="text-xs text-green-500 mt-0.5">Expected: within 24 hours</p>
        </div>
      )}
    </div>
  );
}