// @ts-nocheck
import Link from "next/link";

function StatusCard({ bg, border, icon, title, children }) {
  return (
    <div className="rounded-2xl p-6 max-w-xl" style={{ background: bg, border: `1.5px solid ${border}` }}>
      <div className="flex items-start gap-3">
        <span className="text-2xl flex-shrink-0">{icon}</span>
        <div className="flex-1">
          <p className="font-black text-gray-900 mb-2">{title}</p>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function TabKYCStatus({ kyc }) {
  if (!kyc || kyc.kycStatus === "not_submitted") {
    return (
      <StatusCard bg="#FFF7ED" border="#FED7AA" icon="⚠️" title="Identity Verification Required">
        <p className="text-sm text-gray-600 mb-4">You must complete KYC to purchase KemeFrac™ tokens.</p>
        <Link href="/kemefrac/kyc"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm"
          style={{ background: "#0A1628", color: "#00C896" }}>
          Complete KYC Now →
        </Link>
      </StatusCard>
    );
  }

  if (kyc.kycStatus === "pending_review") {
    return (
      <StatusCard bg="#F0FDF9" border="#6EE7B7" icon="⏳" title="KYC Submitted — Under Review">
        <div className="space-y-1 text-sm text-gray-600">
          <p>✅ Your documents have been submitted successfully.</p>
          {kyc.created_date && <p>Submitted: <span className="font-bold">{new Date(kyc.created_date).toLocaleDateString()}</span></p>}
          <p className="text-gray-400 mt-2">Admin reviews within 24 hours. You'll be notified when approved.</p>
        </div>
      </StatusCard>
    );
  }

  if (kyc.kycStatus === "approved") {
    return (
      <StatusCard bg="#F0FDF4" border="#86EFAC" icon="✅" title="KYC Approved">
        <div className="space-y-1.5 text-sm text-gray-600">
          {kyc.approvedAt && <p>Approved: <span className="font-bold text-green-700">{new Date(kyc.approvedAt).toLocaleDateString()}</span></p>}
          {kyc.expiresAt && <p>Expires: <span className="font-bold">{new Date(kyc.expiresAt).toLocaleDateString()}</span></p>}
          <p className="text-green-700 font-bold mt-2">✅ You are cleared to purchase KemeFrac™ tokens</p>
        </div>
      </StatusCard>
    );
  }

  if (kyc.kycStatus === "rejected") {
    return (
      <StatusCard bg="#FEF2F2" border="#FECACA" icon="❌" title="KYC Not Approved">
        <div className="space-y-2 text-sm text-gray-600">
          {kyc.rejectionReason && (
            <p>Reason: <span className="font-bold text-red-700">{kyc.rejectionReason}</span></p>
          )}
          <Link href="/kemefrac/kyc"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm mt-2"
            style={{ background: "#0A1628", color: "#00C896" }}>
            Resubmit KYC →
          </Link>
        </div>
      </StatusCard>
    );
  }

  if (kyc.kycStatus === "expired") {
    return (
      <StatusCard bg="#FFFBEB" border="#FDE68A" icon="⚠️" title="KYC Expired — Renewal Required">
        <div className="space-y-2 text-sm text-gray-600">
          {kyc.expiresAt && <p>Expired: <span className="font-bold text-orange-600">{new Date(kyc.expiresAt).toLocaleDateString()}</span></p>}
          <Link href="/kemefrac/kyc"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-black text-sm mt-2"
            style={{ background: "#0A1628", color: "#00C896" }}>
            Renew KYC →
          </Link>
        </div>
      </StatusCard>
    );
  }

  return null;
}