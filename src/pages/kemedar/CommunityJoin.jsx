import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Upload, CheckCircle, Clock } from "lucide-react";
import SiteHeader from "@/components/header/SiteHeader";

const OWNERSHIP_TYPES = [
  { id: "owner", label: "Owner", icon: "🏠" },
  { id: "tenant", label: "Tenant", icon: "🔑" },
  { id: "relative", label: "Family Member of Resident", icon: "👨‍👩‍👧" },
  { id: "facility_staff", label: "Facility Staff", icon: "👷" },
];

export default function CommunityJoin() {
  const { communityId } = useParams();
  const navigate = useNavigate();
  const [community, setCommunity] = useState(null);
  const [user, setUser] = useState(null);
  const [membership, setMembership] = useState(null);
  const [form, setForm] = useState({ unitNumber: "", ownershipType: "owner", proofDocumentUrl: "" });
  const [step, setStep] = useState("form"); // form | pending | approved | rejected
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
    else if (resp.data?.success) navigate(`/kemedar/community/${communityId}`);
  };

  if (!community) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-lg mx-auto px-4 py-10 w-full flex-1">
        {/* Community card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
          <div className="h-20 bg-gradient-to-br from-orange-400 to-orange-600">
            {community.coverPhotoUrl && <img src={community.coverPhotoUrl} className="w-full h-full object-cover opacity-80" />}
          </div>
          <div className="px-5 pb-5 pt-3 flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-orange-500 flex items-center justify-center text-2xl text-white -mt-8 border-4 border-white shadow flex-shrink-0">🏘</div>
            <div>
              <h2 className="font-black text-gray-900">{community.communityName}</h2>
              <p className="text-xs text-gray-500">{community.totalMembers} members · {community.communityType}</p>
            </div>
          </div>
        </div>

        {step === "pending" && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <Clock size={48} className="text-orange-400 mx-auto mb-3" />
            <h2 className="font-black text-gray-900 text-xl mb-2">Request Pending</h2>
            <p className="text-gray-500 text-sm mb-4">A Franchise Owner or admin will verify your membership. Usually within 24 hours.</p>
            <Link to="/kemedar/community" className="text-orange-500 font-bold text-sm hover:underline">← Back to Communities</Link>
          </div>
        )}

        {step === "approved" && (
          <div className="bg-white rounded-2xl shadow-sm p-8 text-center">
            <CheckCircle size={48} className="text-green-500 mx-auto mb-3" />
            <h2 className="font-black text-gray-900 text-xl mb-2">You're already a member!</h2>
            <Link to={`/kemedar/community/${communityId}`} className="mt-4 inline-block bg-orange-500 text-white font-bold px-6 py-2.5 rounded-xl text-sm hover:bg-orange-600 transition-colors">
              Go to Community →
            </Link>
          </div>
        )}

        {step === "form" && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="font-black text-gray-900 text-xl mb-1">Request to Join</h2>
            <p className="text-sm text-gray-500 mb-6">
              {community.privacyLevel === "private" ? "This is a private community — verification required." : "Fill in your details to join."}
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Unit / Apartment Number *</label>
                <input value={form.unitNumber} onChange={e => setForm(p => ({ ...p, unitNumber: e.target.value }))}
                  placeholder="e.g. 4B, Villa 12"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600 mb-2 block">You are a *</label>
                <div className="grid grid-cols-2 gap-2">
                  {OWNERSHIP_TYPES.map(t => (
                    <button key={t.id} onClick={() => setForm(p => ({ ...p, ownershipType: t.id }))}
                      className={`flex items-center gap-2 p-3 rounded-xl border-2 text-sm font-semibold transition-all ${form.ownershipType === t.id ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600 hover:border-orange-300"}`}>
                      <span>{t.icon}</span> {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {community.privacyLevel !== "public" && (
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-2 block">Proof of Residence</label>
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:border-orange-300 transition-colors">
                    {form.proofDocumentUrl ? (
                      <div className="text-sm text-green-600 font-bold">✅ Document uploaded</div>
                    ) : (
                      <>
                        <Upload size={24} className="text-gray-300 mx-auto mb-2" />
                        <p className="text-xs text-gray-500">Upload utility bill, property deed, or rental contract</p>
                        <label className="cursor-pointer mt-2 inline-block text-orange-500 font-bold text-xs hover:underline">
                          Choose file
                          <input type="file" accept="image/*,.pdf" onChange={handleFileUpload} className="hidden" />
                        </label>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">Or request FO in-person verification after submitting</p>
                </div>
              )}

              <button onClick={handleSubmit} disabled={!form.unitNumber || submitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm disabled:opacity-60 transition-colors">
                {submitting ? "Submitting..." : community.privacyLevel === "public" ? "✅ Join Community" : "📩 Submit Join Request"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}