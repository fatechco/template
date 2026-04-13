import { useState, useEffect } from "react";
import { Shield, AlertCircle, CheckCircle, Clock } from "lucide-react";
import { base44 } from "@/api/base44Client";
import KYCForm from "@/components/escrow/KYCForm";

const STATUS_CONFIG = {
  pending: { icon: Clock, label: "Not Started", color: "text-gray-600", bg: "bg-gray-50" },
  submitted: { icon: Clock, label: "Under Review", color: "text-orange-600", bg: "bg-orange-50" },
  approved: { icon: CheckCircle, label: "Approved", color: "text-green-600", bg: "bg-green-50" },
  rejected: { icon: AlertCircle, label: "Rejected", color: "text-red-600", bg: "bg-red-50" },
  requires_update: { icon: AlertCircle, label: "Update Needed", color: "text-yellow-600", bg: "bg-yellow-50" },
};

export default function KYCDashboard() {
  const [user, setUser] = useState(null);
  const [account, setAccount] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);

        const accounts = await base44.entities.EscrowAccount.filter({ userId: me.id });
        if (accounts.length) {
          setAccount(accounts[0]);
        }
      } catch (e) {}
      setLoading(false);
    };
    init();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;
  if (!user) return <div className="p-8 text-center text-red-600">Please log in</div>;

  const cfg = STATUS_CONFIG[account?.kycStatus || "pending"];
  const Icon = cfg.icon;

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-blue-500" /> KYC Verification
        </h1>
        <p className="text-gray-500 text-sm">Complete identity verification to unlock escrow trading</p>
      </div>

      {/* Status Card */}
      <div className={`${cfg.bg} border border-gray-200 rounded-2xl p-6`}>
        <div className="flex items-center gap-3 mb-3">
          <Icon className={`w-6 h-6 ${cfg.color}`} />
          <div>
            <p className={`font-black text-lg ${cfg.color}`}>{cfg.label}</p>
            <p className="text-sm text-gray-600">{account?.kycStatus === "approved" ? "You can now trade with escrow" : "Complete your profile to get started"}</p>
          </div>
        </div>
        
        {account?.kycStatus === "approved" && (
          <div className="text-xs text-green-700 font-bold mt-3">
            ✓ Verified {account.verifiedAt ? new Date(account.verifiedAt).toLocaleDateString() : ""}
          </div>
        )}
      </div>

      {/* Verification Progress */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-4">
        <h3 className="font-black text-gray-900">Requirements</h3>
        {[
          { label: "Legal Name", done: !!account?.verificationDocuments?.some(d => d.type.includes("name")) },
          { label: "ID Document (Photo)", done: !!account?.verificationDocuments?.some(d => ["national_id", "passport", "driver_license"].includes(d.type)) },
          { label: "Proof of Address", done: !!account?.verificationDocuments?.some(d => d.type.includes("address")) },
        ].map((req, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${req.done ? "bg-green-500 border-green-500" : "border-gray-300"}`}>
              {req.done && <span className="text-white font-bold text-xs">✓</span>}
            </div>
            <span className="text-sm text-gray-700">{req.label}</span>
          </div>
        ))}
      </div>

      {/* Form or Completion */}
      {account?.kycStatus !== "approved" && account?.kycStatus !== "submitted" ? (
        <KYCForm
          accountId={account?.id}
          onSuccess={() => window.location.reload()}
        />
      ) : account?.kycStatus === "submitted" ? (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
          <Clock className="w-12 h-12 text-orange-600 mx-auto mb-3" />
          <h3 className="font-black text-gray-900 mb-1">Under Review</h3>
          <p className="text-sm text-gray-600">Your documents are being reviewed. This usually takes 1-3 business days.</p>
        </div>
      ) : null}

      {/* Current Documents */}
      {account?.verificationDocuments?.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 p-6 space-y-3">
          <h3 className="font-black text-gray-900">Submitted Documents</h3>
          {account.verificationDocuments.map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-700">{doc.name}</span>
              <span className="text-xs text-gray-500">{new Date(doc.uploadedAt).toLocaleDateString()}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}