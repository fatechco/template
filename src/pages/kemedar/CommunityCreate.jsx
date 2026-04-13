import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";

const COMMUNITY_TYPES = [
  { id: "compound", icon: "🏘", label: "Compound Community", desc: "Private group for compound residents" },
  { id: "building", icon: "🏢", label: "Building Community", desc: "For a specific building" },
  { id: "district", icon: "🏙", label: "Area Community", desc: "For a neighborhood or district" },
  { id: "city", icon: "🌆", label: "City Feed", desc: "Open to all city residents" },
  { id: "interest_group", icon: "🎯", label: "Interest Group", desc: "Based on a topic or interest" },
];

const PRIVACY_OPTIONS = [
  { id: "private", icon: "🔒", label: "Private", desc: "Invite and verify members only" },
  { id: "semi_private", icon: "🔓", label: "Semi-Private", desc: "Request to join, admin approves" },
  { id: "public", icon: "🌐", label: "Public", desc: "Anyone can join instantly" },
];

const STEPS = ["Type", "Info", "Location", "Rules", "Launch"];

export default function CommunityCreate() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState({
    communityType: null, privacyLevel: "semi_private",
    communityName: "", communityNameAr: "", description: "",
    compoundName: "", cityName: "", districtName: "",
    allowMemberPosts: true, allowMarketplace: true,
    allowPolls: true, allowAlerts: true,
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
      communityNumber,
      communityName: form.communityName,
      communityNameAr: form.communityNameAr || null,
      description: form.description || null,
      communityType: form.communityType,
      privacyLevel: form.privacyLevel,
      compoundName: form.compoundName || null,
      cityName: form.cityName || null,
      districtName: form.districtName || null,
      allowMemberPosts: form.allowMemberPosts,
      allowMarketplace: form.allowMarketplace,
      allowPolls: form.allowPolls,
      allowAlerts: form.allowAlerts,
      requirePostApproval: form.requirePostApproval,
      membershipRequirements: form.membershipRequirements,
      totalMembers: 1,
      status: "active",
      kemetroGroupBuyEnabled: true,
    });

    // Creator becomes admin
    await base44.entities.CommunityMember.create({
      communityId: community.id,
      userId: user.id,
      userName: user.full_name,
      userEmail: user.email,
      role: "owner",
      verificationStatus: "verified",
      verificationMethod: "admin_override",
      joinedAt: new Date().toISOString(),
    });

    setSubmitting(false);
    navigate(`/kemedar/community/${community.id}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-10 w-full flex-1">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <h1 className="font-black text-gray-900 text-2xl">🏘 Create Community</h1>
            <span className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</span>
          </div>
          <div className="flex gap-2">
            {STEPS.map((s, i) => (
              <div key={s} className="flex-1">
                <div className={`h-1.5 rounded-full ${i <= step ? "bg-orange-500" : "bg-gray-200"}`} />
                <p className={`text-[10px] mt-1 font-semibold ${i === step ? "text-orange-600" : "text-gray-400"}`}>{s}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Step 0: Type */}
          {step === 0 && (
            <div>
              <h2 className="font-black text-gray-900 text-lg mb-4">What type of community?</h2>
              <div className="space-y-3">
                {COMMUNITY_TYPES.map(t => (
                  <button key={t.id} onClick={() => update({ communityType: t.id })}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ${form.communityType === t.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}>
                    <span className="text-3xl">{t.icon}</span>
                    <div className="text-left">
                      <p className="font-black text-gray-900">{t.label}</p>
                      <p className="text-sm text-gray-500">{t.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-black text-gray-900 text-lg mb-4">Basic Information</h2>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Community Name (English) *</label>
                <input value={form.communityName} onChange={e => update({ communityName: e.target.value })}
                  placeholder="e.g. Silver Compound Community"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Community Name (Arabic)</label>
                <input value={form.communityNameAr} onChange={e => update({ communityNameAr: e.target.value })}
                  placeholder="مجتمع كومباوند سيلفر"
                  dir="rtl"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">Description</label>
                <textarea value={form.description} onChange={e => update({ description: e.target.value })}
                  placeholder="Tell people about this community..."
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
              </div>
              <div>
                <p className="text-xs font-bold text-gray-600 mb-2">Privacy Level *</p>
                {PRIVACY_OPTIONS.map(p => (
                  <button key={p.id} onClick={() => update({ privacyLevel: p.id })}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 mb-2 transition-all text-left ${form.privacyLevel === p.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-300"}`}>
                    <span className="text-xl">{p.icon}</span>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{p.label}</p>
                      <p className="text-xs text-gray-500">{p.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 2: Location */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-black text-gray-900 text-lg mb-4">Location Setup</h2>
              {form.communityType === "compound" && (
                <div>
                  <label className="text-xs font-bold text-gray-600 mb-1 block">Compound Name</label>
                  <input value={form.compoundName} onChange={e => update({ compoundName: e.target.value })}
                    placeholder="e.g. Madinaty, Silver Compound"
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                </div>
              )}
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">City</label>
                <input value={form.cityName} onChange={e => update({ cityName: e.target.value })}
                  placeholder="e.g. New Cairo, Alexandria"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 mb-1 block">District / Area</label>
                <input value={form.districtName} onChange={e => update({ districtName: e.target.value })}
                  placeholder="e.g. 5th Settlement, Zamalek"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              </div>
            </div>
          )}

          {/* Step 3: Rules */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-black text-gray-900 text-lg mb-4">Community Rules</h2>
              {[
                ["allowMemberPosts", "Allow members to post"],
                ["allowMarketplace", "Enable neighbor marketplace"],
                ["allowPolls", "Enable community polls"],
                ["allowAlerts", "Enable alert system"],
                ["requirePostApproval", "Require admin approval for posts"],
              ].map(([key, label]) => (
                <div key={key} className="flex items-center justify-between py-3 border-b border-gray-100">
                  <span className="text-sm text-gray-700">{label}</span>
                  <button onClick={() => update({ [key]: !form[key] })}
                    className={`w-12 h-6 rounded-full transition-colors relative ${form[key] ? "bg-orange-500" : "bg-gray-300"}`}>
                    <div className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition-all shadow ${form[key] ? "right-0.5" : "left-0.5"}`} />
                  </button>
                </div>
              ))}
              <div>
                <p className="text-xs font-bold text-gray-600 mb-2">Membership Verification</p>
                {[
                  ["requiresPropertyProof", "Require proof of residence"],
                  ["requiresFOApproval", "Require FO approval"],
                  ["requiresAddressVerification", "Require address verification"],
                ].map(([key, label]) => (
                  <label key={key} className="flex items-center gap-3 py-2 cursor-pointer">
                    <input type="checkbox" checked={form.membershipRequirements[key]}
                      onChange={e => update({ membershipRequirements: { ...form.membershipRequirements, [key]: e.target.checked } })}
                      className="accent-orange-500 w-4 h-4" />
                    <span className="text-sm text-gray-700">{label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Launch */}
          {step === 4 && (
            <div className="text-center py-4">
              <p className="text-6xl mb-4">🏘</p>
              <h2 className="font-black text-gray-900 text-2xl mb-2">Ready to Launch!</h2>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6 text-left">
                <p className="font-bold text-orange-800 text-sm mb-2">Community Summary:</p>
                <p className="text-sm text-orange-700"><strong>{form.communityName}</strong></p>
                <p className="text-xs text-orange-600 capitalize">{form.communityType} · {form.privacyLevel?.replace("_", " ")} · {form.cityName}</p>
              </div>
              <button onClick={handleCreate} disabled={submitting}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl text-lg disabled:opacity-60 transition-colors">
                {submitting ? "Creating..." : "🚀 Create Community"}
              </button>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex gap-3 mt-4">
          {step > 0 && <button onClick={() => setStep(s => s - 1)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-50">← Back</button>}
          {step < 4 && (
            <button onClick={() => setStep(s => s + 1)}
              disabled={(step === 0 && !form.communityType) || (step === 1 && !form.communityName)}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl disabled:opacity-50 transition-colors">
              Continue →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}