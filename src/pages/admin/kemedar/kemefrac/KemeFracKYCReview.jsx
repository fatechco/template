import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

const TABS = ["pending_review", "approved", "rejected", "expired"];
const REJECT_REASONS = ["Blurry documents", "ID mismatch", "Incomplete info", "PEP flag", "Other"];

const MOCK_KYCS = [
  { id: "k1", userId: "u1", fullName: "Ahmed Hassan", dateOfBirth: "1985-04-12", nationality: "Egyptian", residencyCountryId: "Egypt", investmentExperience: "intermediate", politicallyExposedPerson: false, kycStatus: "pending_review", nationalIdFileUrl: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400", selfieWithIdUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300", created_date: "2026-04-05T10:00:00Z" },
  { id: "k2", userId: "u2", fullName: "Sara Mohamed", dateOfBirth: "1992-11-30", nationality: "Egyptian", residencyCountryId: "Egypt", investmentExperience: "beginner", politicallyExposedPerson: false, kycStatus: "pending_review", nationalIdFileUrl: "https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=400", selfieWithIdUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300", created_date: "2026-04-04T14:00:00Z" },
  { id: "k3", userId: "u3", fullName: "Omar Khalil", dateOfBirth: "1978-07-18", nationality: "Egyptian", residencyCountryId: "UAE", investmentExperience: "expert", politicallyExposedPerson: false, kycStatus: "approved", approvedAt: "2026-03-20T00:00:00Z" },
];

function KYCCard({ kyc, onApprove, onReject }) {
  const [rejectMode, setRejectMode] = useState(false);
  const [reason, setReason] = useState(REJECT_REASONS[0]);
  const [details, setDetails] = useState("");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-gray-50">
        {/* Documents */}
        <div className="p-5 space-y-3">
          <p className="font-black text-gray-800 text-sm">📄 Documents</p>
          {kyc.nationalIdFileUrl && (
            <div>
              <p className="text-xs text-gray-400 mb-1">National ID</p>
              <img src={kyc.nationalIdFileUrl} alt="National ID" className="w-full h-36 object-cover rounded-xl border border-gray-100" />
            </div>
          )}
          {kyc.selfieWithIdUrl && (
            <div>
              <p className="text-xs text-gray-400 mb-1">Selfie with ID</p>
              <img src={kyc.selfieWithIdUrl} alt="Selfie" className="w-32 h-32 object-cover rounded-xl border border-gray-100" />
            </div>
          )}
        </div>
        {/* Details */}
        <div className="p-5 space-y-3">
          <p className="font-black text-gray-800 text-sm">👤 Personal Details</p>
          {[
            ["Full Name", kyc.fullName],
            ["Date of Birth", kyc.dateOfBirth],
            ["Nationality", kyc.nationality],
            ["Residency", kyc.residencyCountryId],
            ["Experience", kyc.investmentExperience],
            ["PEP", kyc.politicallyExposedPerson ? "⚠️ YES" : "No"],
            ["Submitted", kyc.created_date ? new Date(kyc.created_date).toLocaleString() : "—"],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between text-sm border-b border-gray-50 pb-1.5">
              <span className="text-gray-400">{label}</span>
              <span className="font-bold text-gray-900">{value}</span>
            </div>
          ))}

          {kyc.kycStatus === "pending_review" && !rejectMode && (
            <div className="flex gap-3 pt-2">
              <button onClick={() => onApprove(kyc.id)}
                className="flex-1 py-2.5 rounded-xl text-sm font-black"
                style={{ background: "#00C896", color: "#0A1628" }}>
                ✅ Approve KYC
              </button>
              <button onClick={() => setRejectMode(true)}
                className="flex-1 py-2.5 rounded-xl text-sm font-black bg-red-500 text-white hover:bg-red-600">
                ❌ Reject
              </button>
            </div>
          )}

          {rejectMode && (
            <div className="space-y-3 pt-2">
              <select value={reason} onChange={e => setReason(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-red-400">
                {REJECT_REASONS.map(r => <option key={r}>{r}</option>)}
              </select>
              <textarea value={details} onChange={e => setDetails(e.target.value)}
                placeholder="Additional details..."
                className="w-full border border-gray-200 rounded-xl p-3 text-sm h-20 resize-none focus:outline-none focus:border-red-400" />
              <div className="flex gap-2">
                <button onClick={() => setRejectMode(false)} className="flex-1 border border-gray-200 rounded-xl py-2 text-sm font-bold text-gray-600">Cancel</button>
                <button onClick={() => onReject(kyc.id, `${reason}${details ? ": " + details : ""}`)}
                  className="flex-1 bg-red-500 text-white rounded-xl py-2 text-sm font-black">Reject</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function KemeFracKYCReview() {
  const [kycs, setKycs] = useState(MOCK_KYCS);
  const [tab, setTab] = useState("pending_review");

  useEffect(() => {
    base44.entities.FracKYC.filter({}, "-created_date", 100).then(d => { if (d?.length) setKycs(d); }).catch(() => {});
  }, []);

  const handleApprove = async (id) => {
    await base44.entities.FracKYC.update(id, { kycStatus: "approved", approvedAt: new Date().toISOString(), expiresAt: new Date(Date.now() + 2 * 365 * 24 * 3600000).toISOString() }).catch(() => {});
    setKycs(prev => prev.map(k => k.id === id ? { ...k, kycStatus: "approved" } : k));
  };

  const handleReject = async (id, reason) => {
    await base44.entities.FracKYC.update(id, { kycStatus: "rejected", rejectionReason: reason }).catch(() => {});
    setKycs(prev => prev.map(k => k.id === id ? { ...k, kycStatus: "rejected" } : k));
  };

  const filtered = kycs.filter(k => k.kycStatus === tab);

  return (
    <div className="p-6 space-y-5">
      <h1 className="text-2xl font-black text-gray-900">👤 KYC Review</h1>

      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className="px-4 py-2.5 text-xs font-bold capitalize whitespace-nowrap border-b-2 -mb-px transition-colors"
            style={{ borderColor: tab === t ? "#00C896" : "transparent", color: tab === t ? "#00C896" : "#6b7280" }}>
            {t.replace("_", " ")} ({kycs.filter(k => k.kycStatus === t).length})
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl p-16 text-center border border-gray-100">
          <p className="text-4xl mb-3">✅</p>
          <p className="font-black text-gray-600">No {tab.replace("_", " ")} KYC applications</p>
        </div>
      ) : (
        <div className="space-y-5">
          {filtered.map(k => <KYCCard key={k.id} kyc={k} onApprove={handleApprove} onReject={handleReject} />)}
        </div>
      )}
    </div>
  );
}