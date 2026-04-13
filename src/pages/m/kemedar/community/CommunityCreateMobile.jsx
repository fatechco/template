import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const TYPES = [
  { id: "compound", icon: "🏘", label: "Compound", desc: "Private group for compound residents" },
  { id: "building", icon: "🏢", label: "Building", desc: "For a specific building" },
  { id: "district", icon: "🏙", label: "Area", desc: "For a neighborhood" },
  { id: "city", icon: "🌆", label: "City Feed", desc: "Open to all city residents" },
  { id: "interest_group", icon: "🎯", label: "Interest Group", desc: "Topic-based" },
];

const PRIVACY = [
  { id: "private", icon: "🔒", label: "Private", desc: "Invite & verify only" },
  { id: "semi_private", icon: "🔓", label: "Semi-Private", desc: "Request + admin approves" },
  { id: "public", icon: "🌐", label: "Public", desc: "Anyone can join" },
];

const STEPS = ["Type", "Info", "Location", "Rules", "Launch"];

export default function CommunityCreateMobile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    communityType: null, privacyLevel: "semi_private",
    communityName: "", communityNameAr: "", description: "",
    compoundName: "", cityName: "", districtName: "",
    allowMemberPosts: true, allowMarketplace: true, allowPolls: true, allowAlerts: true,
    requirePostApproval: false,
    membershipRequirements: { requiresPropertyProof: true, requiresFOApproval: false, requiresAddressVerification: true },
  });
  const [submitting, setSubmitting] = useState(false);
  const update = p => setForm(prev => ({ ...prev, ...p }));

  const handleCreate = async () => {
    setSubmitting(true);
    const user = await base44.auth.me().catch(() => null);
    if (!user) { base44.auth.redirectToLogin(); return; }
    const communityNumber = `KCM-${Date.now().toString(36).toUpperCase()}`;
    const community = await base44.entities.Community.create({
      communityNumber, communityName: form.communityName, communityNameAr: form.communityNameAr || null,
      description: form.description || null, communityType: form.communityType, privacyLevel: form.privacyLevel,
      compoundName: form.compoundName || null, cityName: form.cityName || null, districtName: form.districtName || null,
      allowMemberPosts: form.allowMemberPosts, allowMarketplace: form.allowMarketplace,
      allowPolls: form.allowPolls, allowAlerts: form.allowAlerts, requirePostApproval: form.requirePostApproval,
      membershipRequirements: form.membershipRequirements, totalMembers: 1, status: "active", kemetroGroupBuyEnabled: true,
    });
    await base44.entities.CommunityMember.create({
      communityId: community.id, userId: user.id, userName: user.full_name, userEmail: user.email,
      role: "owner", verificationStatus: "verified", verificationMethod: "admin_override", joinedAt: new Date().toISOString(),
    });
    setSubmitting(false);
    navigate(`/m/kemedar/community/${community.id}`);
  };

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "#f9fafb", display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ background: "#EA580C", flexShrink: 0, paddingTop: "max(12px, env(safe-area-inset-top))" }}
        className="px-4 pb-3 flex items-center justify-between">
        <button onClick={() => step > 0 ? setStep(s => s - 1) : navigate(-1)}
          className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: "rgba(255,255,255,0.2)" }}>
          <ArrowLeft size={18} color="white" />
        </button>
        <p className="font-black text-white text-sm">🏘 Create Community</p>
        <span className="text-white text-[10px] font-bold">{step + 1}/{STEPS.length}</span>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-4 py-2 bg-white border-b border-gray-100 flex-shrink-0">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1">
            <div className="h-1 rounded-full" style={{ background: i <= step ? "#EA580C" : "#e5e7eb" }} />
            <p className="text-[8px] mt-0.5 font-semibold" style={{ color: i === step ? "#EA580C" : "#9ca3af" }}>{s}</p>
          </div>
        ))}
      </div>

      <div style={{ flex: 1, overflowY: "auto" }} className="px-4 py-4">
        {/* Step 0: Type */}
        {step === 0 && (
          <div className="space-y-2">
            <h2 className="font-black text-gray-900 text-base mb-3">What type of community?</h2>
            {TYPES.map(t => (
              <button key={t.id} onClick={() => update({ communityType: t.id })}
                className="w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left"
                style={{ borderColor: form.communityType === t.id ? "#EA580C" : "#e5e7eb", background: form.communityType === t.id ? "#FFF7ED" : "white" }}>
                <span className="text-2xl">{t.icon}</span>
                <div>
                  <p className="font-black text-gray-900 text-sm">{t.label}</p>
                  <p className="text-[10px] text-gray-500">{t.desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Step 1: Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-black text-gray-900 text-base mb-2">Basic Information</h2>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-1 block">Community Name (EN) *</label>
              <input value={form.communityName} onChange={e => update({ communityName: e.target.value })}
                placeholder="e.g. Silver Compound Community"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-1 block">Community Name (AR)</label>
              <input value={form.communityNameAr} onChange={e => update({ communityNameAr: e.target.value })}
                placeholder="مجتمع كومباوند سيلفر" dir="rtl"
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-1 block">Description</label>
              <textarea value={form.description} onChange={e => update({ description: e.target.value })}
                placeholder="Tell people about this community..." rows={3}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-600 mb-2">Privacy Level *</p>
              {PRIVACY.map(p => (
                <button key={p.id} onClick={() => update({ privacyLevel: p.id })}
                  className="w-full flex items-center gap-2.5 p-3 rounded-xl border-2 mb-2 text-left transition-all"
                  style={{ borderColor: form.privacyLevel === p.id ? "#EA580C" : "#e5e7eb", background: form.privacyLevel === p.id ? "#FFF7ED" : "white" }}>
                  <span className="text-lg">{p.icon}</span>
                  <div>
                    <p className="font-bold text-gray-900 text-xs">{p.label}</p>
                    <p className="text-[10px] text-gray-500">{p.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Location */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-black text-gray-900 text-base mb-2">Location</h2>
            {form.communityType === "compound" && (
              <div>
                <label className="text-[10px] font-bold text-gray-600 mb-1 block">Compound Name</label>
                <input value={form.compoundName} onChange={e => update({ compoundName: e.target.value })}
                  placeholder="e.g. Madinaty" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            )}
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-1 block">City</label>
              <input value={form.cityName} onChange={e => update({ cityName: e.target.value })}
                placeholder="e.g. New Cairo" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
            <div>
              <label className="text-[10px] font-bold text-gray-600 mb-1 block">District / Area</label>
              <input value={form.districtName} onChange={e => update({ districtName: e.target.value })}
                placeholder="e.g. 5th Settlement" className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
            </div>
          </div>
        )}

        {/* Step 3: Rules */}
        {step === 3 && (
          <div className="space-y-3">
            <h2 className="font-black text-gray-900 text-base mb-2">Community Rules</h2>
            {[
              ["allowMemberPosts", "Allow members to post"],
              ["allowMarketplace", "Enable marketplace"],
              ["allowPolls", "Enable polls"],
              ["allowAlerts", "Enable alert system"],
              ["requirePostApproval", "Require admin approval"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center justify-between py-2.5 border-b border-gray-100">
                <span className="text-xs text-gray-700">{label}</span>
                <button onClick={() => update({ [key]: !form[key] })}
                  className="w-11 h-6 rounded-full transition-colors relative"
                  style={{ background: form[key] ? "#EA580C" : "#d1d5db" }}>
                  <div className="w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow"
                    style={{ [form[key] ? "right" : "left"]: 2 }} />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Step 4: Launch */}
        {step === 4 && (
          <div className="text-center py-6">
            <p className="text-5xl mb-3">🏘</p>
            <h2 className="font-black text-gray-900 text-xl mb-2">Ready to Launch!</h2>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5 text-left">
              <p className="font-bold text-orange-800 text-xs mb-1">Summary:</p>
              <p className="text-sm font-black text-orange-700">{form.communityName}</p>
              <p className="text-[10px] text-orange-600 capitalize">{form.communityType} · {form.privacyLevel?.replace("_", " ")} · {form.cityName}</p>
            </div>
            <button onClick={handleCreate} disabled={submitting}
              className="w-full bg-orange-500 text-white font-black py-3.5 rounded-2xl text-base disabled:opacity-60">
              {submitting ? "Creating..." : "🚀 Create Community"}
            </button>
          </div>
        )}

        <div className="h-20" />
      </div>

      {/* Navigation */}
      {step < 4 && (
        <div className="bg-white border-t border-gray-100 px-4 py-3 flex-shrink-0"
          style={{ paddingBottom: "max(12px, env(safe-area-inset-bottom))" }}>
          <button onClick={() => setStep(s => s + 1)}
            disabled={(step === 0 && !form.communityType) || (step === 1 && !form.communityName)}
            className="w-full bg-orange-500 text-white font-black py-3 rounded-xl text-sm disabled:opacity-50">
            Continue →
          </button>
        </div>
      )}

      <MobileBottomNav />
    </div>
  );
}