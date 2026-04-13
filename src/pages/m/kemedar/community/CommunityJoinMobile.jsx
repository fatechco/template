import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const OWNERSHIP_TYPES = [
  { id: "owner", label: "Owner", icon: "🏠" },
  { id: "tenant", label: "Tenant", icon: "🔑" },
  { id: "relative", label: "Family Member", icon: "👨‍👩‍👧" },
  { id: "facility_staff", label: "Staff", icon: "👷" },
];

export default function CommunityJoinMobile() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [form, setForm] = useState({ unitNumber: "", ownershipType: "owner", proofDocumentUrl: "" });
  const [step, setStep] = useState("form");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      base44.entities.CommunityMember.filter({ communityId, userId: u.id }).then(m => {
        if (m[0]) {
          setMembership(m[0]);
          setStep(m[0].role === "pending" ? "pending" : "approved");
        }
      });
    }).catch(() => {});
    base44.entities.Community.filter({ id: communityId }).then(c => setCommunity(c[0]));
  }, [communityId]);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setForm(p => ({ ...p, proofDocumentUrl: file_url }));
  };

  const handleSubmit = async () => {
    if (!user) { base44.auth.redirectToLogin(); return; }
    setSubmitting(true);
    const resp = await base44.functions.invoke("joinCommunity", { communityId, ...form });
    setSubmitting(false);
    if (resp.data?.requiresApproval) setStep("pending");
    else if (resp.data?.success) navigate(`/m/kemedar/community/${communityId}`);
  };

  if (!community) return (
    <div className="fixed inset-0 z-[9999] bg-white flex items-center justify-center">
      <Loader2 size={32} className="animate-spin text-orange-500" />
    </div>
  );

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: "#EA580C", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">Join Community</p>
        <div className="w-9" />
      </div>

      <div style={{ flex: 1, overflowY: "auto" }} className="px-4 py-4">
        {/* Community preview */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden mb-4">
          <div className="h-16 bg-gradient-to-br from-orange-400 to-orange-600">
            {community.coverPhotoUrl && <img src={community.coverPhotoUrl} className="w-full h-full object-cover opacity-80" />}
          </div>
          <div className="px-4 pb-3 pt-2 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-xl text-white -mt-6 border-3 border-white shadow flex-shrink-0">🏘</div>
            <div>
              <p className="font-black text-gray-900 text-sm">{community.communityName}</p>
              <p className="text-[10px] text-gray-500">{community.totalMembers} members · {community.communityType}</p>
            </div>
          </div>
        </div>

        {step === "pending" && (
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-4xl mb-2">⏳</p>
            <h2 className="font-black text-gray-900 text-lg mb-2">Request Pending</h2>
            <p className="text-gray-500 text-sm mb-4">A Franchise Owner or admin will verify your membership within 24 hours.</p>
            <button onClick={() => navigate("/m/kemedar/community")} className="text-orange-500 font-bold text-sm">← Back</button>
          </div>
        )}

        {step === "approved" && (
          <div className="bg-white rounded-2xl p-6 text-center">
            <p className="text-4xl mb-2">✅</p>
            <h2 className="font-black text-gray-900 text-lg mb-2">You're a member!</h2>
            <Link to={`/m/kemedar/community/${communityId}`}
              className="mt-3 inline-block bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm">
              Go to Community →
            </Link>
          </div>
        )}

        {step === "form" && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h2 className="font-black text-gray-900 text-base mb-1">Request to Join</h2>
            <p className="text-xs text-gray-500 mb-5">
              {community.privacyLevel === "private" ? "This is a private community — verification required." : "Fill in your details to join."}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-gray-600 mb-1 block">Unit / Apartment Number *</label>
                <input value={form.unitNumber} onChange={e => setForm(p => ({ ...p, unitNumber: e.target.value }))}
                  placeholder="e.g. 4B, Villa 12"
                  className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div>
                <label className="text-[10px] font-bold text-gray-600 mb-2 block">You are a *</label>
                <div className="grid grid-cols-2 gap-2">
                  {OWNERSHIP_TYPES.map(t => (
                    <button key={t.id} onClick={() => setForm(p => ({ ...p, ownershipType: t.id }))}
                      className="flex items-center gap-2 p-2.5 rounded-xl border-2 text-xs font-semibold transition-all"
                      style={{ borderColor: form.ownershipType === t.id ? "#EA580C" : "#e5e7eb", background: form.ownershipType === t.id ? "#FFF7ED" : "white" }}>
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {community.privacyLevel !== "public" && (
                <div>
                  <label className="text-[10px] font-bold text-gray-600 mb-2 block">Proof of Residence</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center">
                    {form.proofDocumentUrl ? (
                      <p className="text-xs text-green-600 font-bold">✅ Document uploaded</p>
                    ) : (
                      <>
                        <Upload size={20} className="text-gray-300 mx-auto mb-1" />
                        <p className="text-[10px] text-gray-500">Upload utility bill, deed, or rental contract</p>
                        <label className="cursor-pointer mt-1 inline-block text-orange-500 font-bold text-[10px]">
                          Choose file
                          <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
                        </label>
                      </>
                    )}
                  </div>
                </div>
              )}

              <button onClick={handleSubmit} disabled={!form.unitNumber || submitting}
                className="w-full bg-orange-500 text-white font-black py-3 rounded-xl text-sm disabled:opacity-60">
                {submitting ? "Submitting..." : community.privacyLevel === "public" ? "✅ Join Community" : "📩 Submit Join Request"}
              </button>
            </div>
          </div>
        )}

        <div className="h-20" />
      </div>
      <MobileBottomNav />
    </div>
  );
}