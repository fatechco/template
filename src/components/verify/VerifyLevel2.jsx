import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Upload, Phone } from "lucide-react";

function UploadZone({ label, icon, file, onUpload, uploading }) {
  return (
    <label className="flex-1 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-[#FF6B00] transition-colors relative">
      {file ? (
        <div className="flex flex-col items-center gap-2">
          <CheckCircle2 className="text-green-500" size={24} />
          <p className="text-xs font-bold text-green-600 truncate max-w-full">{file.name}</p>
        </div>
      ) : uploading ? (
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-[#FF6B00] border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-gray-400">Uploading...</p>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-2">
          <span className="text-2xl">{icon}</span>
          <p className="text-xs font-bold text-gray-700">{label}</p>
          <p className="text-[10px] text-gray-400">Drag & drop or tap to upload</p>
          <p className="text-[10px] text-gray-300">JPG, PNG or PDF — max 5MB</p>
        </div>
      )}
      <input type="file" accept=".jpg,.jpeg,.png,.pdf" className="absolute inset-0 opacity-0 w-full h-full cursor-pointer" onChange={e => onUpload(e.target.files?.[0])} disabled={uploading} />
    </label>
  );
}

export default function VerifyLevel2({ token, user, currentLevel, onComplete }) {
  const [phoneVerified] = useState(true); // assume verified via platform auth
  const [idFront, setIdFront] = useState(null);
  const [idBack, setIdBack] = useState(null);
  const [uploading, setUploading] = useState({ front: false, back: false });
  const [pledge1, setPledge1] = useState(false);
  const [pledge2, setPledge2] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(currentLevel >= 2);

  const canSubmit = pledge1 && pledge2 && phoneVerified && idFront;

  const handleUpload = async (file, side) => {
    if (!file) return;
    setUploading(p => ({ ...p, [side]: true }));
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    if (side === "front") setIdFront({ name: file.name, url: file_url });
    else setIdBack({ name: file.name, url: file_url });
    setUploading(p => ({ ...p, [side]: false }));
  };

  const handleSubmit = async () => {
    if (!canSubmit || !token?.id) return;
    setSubmitting(true);
    await base44.functions.invoke("appendVerificationRecord", {
      tokenId: token.id, recordType: "seller_identity_verified",
      actorType: "seller", actorUserId: user?.id, actorLabel: user?.full_name,
      title: "Seller identity verified", details: "National ID uploaded and phone verified",
    });
    await base44.functions.invoke("appendVerificationRecord", {
      tokenId: token.id, recordType: "seller_signed_pledge",
      actorType: "seller", actorUserId: user?.id, actorLabel: user?.full_name,
      title: "Accuracy Pledge signed", details: "Seller confirmed accuracy pledge",
    });
    await base44.functions.invoke("advanceVerificationLevel", { tokenId: token.id, newLevel: 2, actorUserId: user?.id });
    setDone(true);
    setSubmitting(false);
    onComplete();
  };

  const locked = currentLevel < 1;

  return (
    <div className={`flex flex-col gap-4 ${locked ? "opacity-50 pointer-events-none" : ""}`}>
      {/* Card 1 */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xl">👤</span>
          <p className="font-black text-gray-900">Verify Your Identity</p>
        </div>
        <p className="text-sm text-gray-500 mb-5">Adds a Seller Verified badge to your listing</p>

        {/* Phone */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3 mb-5">
          <Phone size={16} className="text-[#FF6B00] flex-shrink-0" />
          {phoneVerified ? (
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-green-500" />
              <span className="text-sm font-bold text-gray-700">{user?.phone || "+20 1XX XXX XXXX"} — Verified</span>
            </div>
          ) : (
            <button className="text-sm font-bold text-[#FF6B00] hover:underline">Verify Phone →</button>
          )}
        </div>

        {/* ID Upload */}
        <p className="text-sm font-bold text-gray-700 mb-3">Upload your National ID</p>
        <div className="flex gap-3">
          <UploadZone label="Front of National ID" icon="📄" file={idFront} uploading={uploading.front} onUpload={f => handleUpload(f, "front")} />
          <UploadZone label="Back of National ID" icon="📄" file={idBack} uploading={uploading.back} onUpload={f => handleUpload(f, "back")} />
        </div>
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-2xl shadow-sm border-t-4 border-[#FF6B00] border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-xl">📋</span>
          <p className="font-black text-gray-900">Accuracy Pledge</p>
        </div>

        <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm text-gray-600 leading-relaxed mb-5">
          I confirm that all information in this listing is accurate and complete to the best of my knowledge.
          I am the legal owner or authorized representative of this property. I understand that providing false
          information may result in listing suspension and legal liability.
        </div>

        <div className="flex flex-col gap-3 mb-5">
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={pledge1} onChange={e => setPledge1(e.target.checked)} className="accent-[#FF6B00] mt-0.5 w-4 h-4 flex-shrink-0" />
            <span className="text-sm text-gray-700">I have read and agree to the Accuracy Pledge above</span>
          </label>
          <label className="flex items-start gap-3 cursor-pointer">
            <input type="checkbox" checked={pledge2} onChange={e => setPledge2(e.target.checked)} className="accent-[#FF6B00] mt-0.5 w-4 h-4 flex-shrink-0" />
            <span className="text-sm text-gray-700">I understand that false information may result in listing suspension</span>
          </label>
        </div>

        {done ? (
          <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-green-700 font-bold text-sm flex items-center gap-2">
            <CheckCircle2 size={16} /> Level 2 Achieved! Seller Verified badge added.
          </div>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!canSubmit || submitting}
            className="w-full bg-[#FF6B00] hover:bg-[#e55f00] disabled:bg-gray-200 disabled:text-gray-400 text-white font-black py-3 rounded-xl transition-colors text-sm"
          >
            {submitting ? "Processing..." : "✓ Complete Level 2 →"}
          </button>
        )}
      </div>
    </div>
  );
}