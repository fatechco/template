"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { CheckCircle2, Circle } from "lucide-react";
import confetti from "npm:canvas-confetti";

const REQUIREMENTS = [
  { key: "level4", label: "Level 4 achieved (FO inspection passed)" },
  { key: "identity", label: "Seller identity confirmed" },
  { key: "titleDeed", label: "Title Deed uploaded and approved" },
  { key: "noFraud", label: "No active fraud flags" },
];

export default function VerifyLevel5({ token, property, user, currentLevel, onComplete }) {
  const [taxFile, setTaxFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [adminApproved] = useState(false); // comes from admin action
  const [paying, setPaying] = useState(false);
  const [issued, setIssued] = useState(token?.certificateIssued || false);

  const locked = currentLevel < 4;

  const metChecks = {
    level4: currentLevel >= 4,
    identity: currentLevel >= 2,
    titleDeed: false, // would check VerificationDocument records
    noFraud: token?.verificationStatus !== "fraud_flagged",
  };

  const handleTaxUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const { file_url } = await /* integration Core.UploadFile TODO */ ({ file });
    await apiClient.post("/api/v1/verificationdocument", {
      tokenId: token?.id, propertyId: property?.id,
      submittedByUserId: user?.id, documentType: "tax_certificate",
      fileUrl: file_url, fileType: file.name.split(".").pop().toLowerCase(),
      overallStatus: "pending",
    });
    await apiClient.post("/api/v1/ai/appendVerificationRecord", {
      tokenId: token?.id, recordType: "legal_doc_submitted",
      actorType: "seller", actorLabel: user?.full_name || "Seller",
      title: "Tax Clearance Certificate submitted for Level 5",
      metaData: { fileUrl: file_url },
    });
    setTaxFile({ name: file.name, url: file_url });
    setUploading(false);
  };

  const handlePayAndIssue = async () => {
    setPaying(true);
    await apiClient.post("/api/v1/ai/issueCertificate", { tokenId: token?.id, issuedByAdminId: "system" });
    setIssued(true);
    setPaying(false);
    onComplete();
    // Confetti
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.5 } });
  };

  if (locked) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 opacity-50">
        <div className="flex items-center gap-2">
          <span className="text-xl">🏅</span>
          <p className="font-black text-gray-400">Get Your Full Verification Certificate</p>
          <span className="ml-auto text-xs bg-gray-100 text-gray-400 px-2 py-1 rounded-full">Unlocked at Level 4</span>
        </div>
      </div>
    );
  }

  if (issued || token?.certificateIssued) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center">
        <div className="text-6xl mb-3 animate-bounce">🏅</div>
        <h2 className="text-2xl font-black text-gray-900 mb-1">🎉 CONGRATULATIONS!</h2>
        <p className="text-gray-500 mb-6">Your property is now FULLY VERIFIED</p>

        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#FF6B00] rounded-2xl p-5 mb-6 text-left">
          <p className="text-xs text-gray-400 mb-3 font-bold uppercase tracking-wide">Certificate Details</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-500">Token ID:</span> <span className="font-mono font-bold text-gray-900 text-xs">{token?.tokenId}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Property:</span> <span className="font-bold text-gray-900 truncate ml-2 max-w-[180px]">{property?.title}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Level:</span> <span className="font-black text-[#FF6B00]">● 5 — Fully Verified</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Issued:</span> <span className="font-bold text-gray-900">{token?.certificateIssuedAt ? new Date(token.certificateIssuedAt).toLocaleDateString() : new Date().toLocaleDateString()}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Valid Until:</span> <span className="font-bold text-gray-900">{token?.certificateExpiresAt ? new Date(token.certificateExpiresAt).toLocaleDateString() : "—"}</span></div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button className="w-full bg-[#FF6B00] text-white font-black py-3 rounded-xl hover:bg-[#e55f00] transition-colors text-sm">
            📥 Download PDF Certificate
          </button>
          <a href={token?.certificateQrCode || "#"} target="_blank" rel="noreferrer" className="w-full border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors text-sm text-center">
            🔗 View Public Verify Page
          </a>
          <a href={`https://wa.me/?text=${encodeURIComponent(`My property is now Kemedar Fully Verified! 🏅 See: ${token?.certificateQrCode || ""}`)}`} target="_blank" rel="noreferrer"
            className="w-full border-2 border-green-200 text-green-700 font-bold py-3 rounded-xl hover:bg-green-50 transition-colors text-sm text-center">
            💬 Share on WhatsApp
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xl">🏅</span>
        <p className="font-black text-gray-900">Get Your Full Verification Certificate</p>
      </div>
      <p className="text-sm text-gray-500 mb-5">Final step — admin review + certificate payment</p>

      {/* Requirements checklist */}
      <div className="flex flex-col gap-2 mb-5">
        {REQUIREMENTS.map(req => (
          <div key={req.key} className="flex items-center gap-2 text-sm">
            {metChecks[req.key]
              ? <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
              : <Circle size={16} className="text-gray-300 flex-shrink-0" />}
            <span className={metChecks[req.key] ? "text-gray-700" : "text-gray-400"}>{req.label}</span>
          </div>
        ))}
      </div>

      {/* Tax certificate upload */}
      <div className="mb-5">
        <p className="text-sm font-bold text-gray-700 mb-1">📄 Tax Clearance Certificate <span className="text-red-500">(Required)</span></p>
        <p className="text-xs text-gray-400 mb-3">Latest year property tax clearance from Tax Authority</p>
        <label className="flex flex-col items-center border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#FF6B00] transition-colors relative">
          {taxFile ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm font-bold text-green-700">{taxFile.name}</span>
            </div>
          ) : uploading ? (
            <div className="w-5 h-5 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <span className="text-2xl mb-1">📋</span>
              <p className="text-xs text-gray-500">Drag & drop or tap to upload</p>
            </>
          )}
          <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onChange={e => handleTaxUpload(e.target.files?.[0])} disabled={uploading} />
        </label>
      </div>

      {/* Admin review status */}
      {!adminApproved && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-5">
          <p className="font-bold text-blue-800 text-sm">⏳ Admin Final Review</p>
          <p className="text-xs text-blue-600 mt-0.5">Kemedar admin will review all your documents</p>
          <p className="text-xs text-blue-500">Expected: 2–5 business days</p>
          <p className="text-xs text-blue-400 mt-0.5">You will receive an email and notification when done</p>
        </div>
      )}

      {/* Certificate payment */}
      {adminApproved && (
        <div className="bg-gradient-to-br from-amber-50 to-orange-50 border-2 border-[#FF6B00] rounded-xl p-5">
          <p className="font-black text-gray-900 text-base mb-1">🏅 Issue Your Certificate</p>
          <p className="text-2xl font-black text-[#FF6B00] mb-0.5">299 EGP <span className="text-sm font-normal text-gray-500">/ year</span></p>
          <p className="text-xs text-gray-400 mb-4">Renew annually at 199 EGP to keep Level 5 status</p>
          <button onClick={handlePayAndIssue} disabled={paying} className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black py-3 rounded-xl text-sm transition-colors disabled:bg-gray-200 disabled:text-gray-400">
            {paying ? "Processing..." : "💳 Pay & Issue Certificate"}
          </button>
        </div>
      )}
    </div>
  );
}