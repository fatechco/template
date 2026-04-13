import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Check, ChevronRight, Info, Lock, Plus, X, Loader2, AlertCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";

const PAYMENT_STRUCTURES = [
  { value: "full_cash", label: "Full Cash", icon: "💵", desc: "Full payment on handover" },
  { value: "mortgage", label: "Mortgage", icon: "🏦", desc: "Bank-financed purchase" },
  { value: "cash_installment", label: "Installments", icon: "📅", desc: "Agreed payment schedule" },
  { value: "developer_plan", label: "Developer Plan", icon: "🏗", desc: "Off-plan developer schedule" },
];

const MILESTONE_ICONS = {
  earnest_deposit: "💰", contract_signing: "📝", legal_verification: "⚖️",
  inspection_complete: "🔍", title_search: "📋", mortgage_approval: "🏦",
  balance_payment: "💵", keys_handover: "🔑", registration_complete: "📜", custom: "⚙️"
};

function fmt(n) {
  if (!n) return "0";
  return Number(n).toLocaleString();
}

function StepBar({ step, total = 5 }) {
  return (
    <div className="flex items-center gap-2 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i < step ? "bg-orange-500" : i === step - 1 ? "bg-orange-400" : "bg-gray-200"}`} />
      ))}
      <span className="text-xs text-gray-400 whitespace-nowrap">{step}/{total}</span>
    </div>
  );
}

export default function EscrowSetupWizard() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const negotiationId = searchParams.get("negotiationId");
  const propertyId = searchParams.get("propertyId");

  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Deal data
  const [deal, setDeal] = useState({
    agreedPrice: 3500000,
    currency: "EGP",
    paymentStructure: "full_cash",
    earnestPercent: 10,
    earnestAmount: 350000,
    depositDeadlineHours: 48,
    property: null,
    negotiationSession: null
  });
  const [milestones, setMilestones] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [detailsAgreed, setDetailsAgreed] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        if (propertyId) {
          const props = await base44.entities.Property.filter({ id: propertyId });
          if (props.length) setDeal(d => ({ ...d, property: props[0] }));
        }
        if (negotiationId) {
          const sessions = await base44.entities.NegotiationSession.filter({ id: negotiationId });
          if (sessions.length) {
            const s = sessions[0];
            setDeal(d => ({
              ...d,
              agreedPrice: s.agreedPrice || d.agreedPrice,
              earnestAmount: Math.round((s.agreedPrice || d.agreedPrice) * d.earnestPercent / 100),
              negotiationSession: s
            }));
          }
        }
      } catch (e) {}
      setLoading(false);
    };
    init();
  }, []);

  const updateEarnest = (percent) => {
    setDeal(d => ({
      ...d,
      earnestPercent: percent,
      earnestAmount: Math.round(d.agreedPrice * percent / 100)
    }));
  };

  const generateStructure = async () => {
    setGenerating(true);
    const result = await base44.functions.invoke("generateDealStructure", {
      negotiationSessionId: negotiationId,
      dealTerms: {
        agreedPrice: deal.agreedPrice,
        paymentStructure: deal.paymentStructure,
        propertyTitle: deal.property?.title || "Property"
      }
    }).catch(() => null);
    if (result?.data) {
      setMilestones(result.data.milestones || []);
      setConditions(result.data.conditions || []);
      setAiSummary(result.data.aiSummary);
    }
    setGenerating(false);
    setStep(3);
  };

  const handleCreateDeal = async () => {
    if (!termsAgreed || !detailsAgreed) return;
    setSubmitting(true);
    const dealNumber = `KED-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const platformFeePercent = 1.5;
    const platformFeeAmount = Math.round(deal.agreedPrice * platformFeePercent / 100);
    const depositDeadline = new Date(Date.now() + deal.depositDeadlineHours * 3600000).toISOString();

    const newDeal = await base44.entities.EscrowDeal.create({
      dealNumber,
      buyerId: user?.id,
      sellerId: deal.negotiationSession?.sellerId || "pending",
      propertyId: propertyId || deal.property?.id,
      negotiationSessionId: negotiationId || null,
      agreedPrice: deal.agreedPrice,
      currency: deal.currency,
      paymentStructure: deal.paymentStructure,
      earnestMoneyAmount: deal.earnestAmount,
      earnestMoneyPercent: deal.earnestPercent,
      totalEscrowAmount: deal.agreedPrice,
      conditions,
      status: "awaiting_deposit",
      completionPercent: 0,
      depositDeadline,
      completionDeadline: new Date(Date.now() + 90 * 86400000).toISOString(),
      platformFeeAmount,
      platformFeePercent,
      dealDocuments: []
    });

    // Create milestones
    for (const m of milestones) {
      await base44.entities.EscrowMilestone.create({
        dealId: newDeal.id,
        milestoneOrder: m.order,
        milestoneName: m.name,
        milestoneNameAr: m.nameAr,
        milestoneType: m.type,
        description: m.description,
        paymentAmount: m.paymentAmount || 0,
        paymentPercent: m.paymentPercent || 0,
        paymentOnCompletion: (m.paymentAmount || 0) > 0,
        status: m.order === 1 ? "in_progress" : "pending",
        autoReleaseAfterDays: m.autoReleaseDays || null
      });
    }

    navigate(`/kemedar/escrow/${newDeal.id}?new=1`);
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Lock className="w-5 h-5 text-orange-500" />
            <h1 className="text-2xl font-black text-gray-900">Kemedar Escrow™ Setup</h1>
          </div>
          <p className="text-gray-500 text-sm">Secure your property deal with trusted digital escrow</p>
        </div>
        <StepBar step={step} />

        {/* STEP 1 — DEAL OVERVIEW */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-black text-gray-900 mb-6">📋 Deal Summary</h2>
            {deal.property && (
              <div className="border-2 border-orange-200 rounded-xl p-4 mb-6 flex gap-4 items-center">
                {deal.property.featured_image && (
                  <img src={deal.property.featured_image} className="w-16 h-16 rounded-xl object-cover flex-shrink-0" alt="" />
                )}
                <div>
                  <p className="font-black text-gray-900">{deal.property.title}</p>
                  <p className="text-sm text-gray-500">{deal.property.city_name} · {deal.property.area_size}m² · {deal.property.beds} beds</p>
                </div>
              </div>
            )}
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Agreed Price</label>
                <div className="relative">
                  <input type="number" value={deal.agreedPrice}
                    onChange={e => setDeal(d => ({ ...d, agreedPrice: Number(e.target.value), earnestAmount: Math.round(Number(e.target.value) * d.earnestPercent / 100) }))}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-2xl font-black text-orange-600 focus:border-orange-400 outline-none" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold">EGP</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Payment Structure</label>
                <div className="grid grid-cols-2 gap-2">
                  {PAYMENT_STRUCTURES.map(ps => (
                    <button key={ps.value} onClick={() => setDeal(d => ({ ...d, paymentStructure: ps.value }))}
                      className={`p-3 rounded-xl border-2 text-left transition-all ${deal.paymentStructure === ps.value ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200"}`}>
                      <span className="text-xl">{ps.icon}</span>
                      <p className="font-bold text-sm mt-1">{ps.label}</p>
                      <p className="text-xs text-gray-500">{ps.desc}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl text-lg transition-colors">
              Continue → <ChevronRight className="inline w-5 h-5" />
            </button>
          </div>
        )}

        {/* STEP 2 — EARNEST MONEY */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-black text-gray-900 mb-2">💰 Earnest Money Deposit</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 flex gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-blue-800">Earnest money shows you're serious about buying. It's held safely by Kemedar Escrow™ and returned if the deal falls through through no fault of your own.</p>
            </div>
            <div className="space-y-3 mb-6">
              {[
                { percent: 5, label: "Standard", badge: null, desc: "Most common choice" },
                { percent: 10, label: "Strong", badge: "✅ Recommended", desc: "Shows serious commitment" }
              ].map(opt => (
                <button key={opt.percent} onClick={() => updateEarnest(opt.percent)}
                  className={`w-full p-5 rounded-2xl border-2 text-left transition-all ${deal.earnestPercent === opt.percent ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200"}`}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-black text-gray-900">{opt.percent}% — {opt.label}</span>
                        {opt.badge && <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full">{opt.badge}</span>}
                      </div>
                      <p className="text-3xl font-black text-orange-600">{fmt(Math.round(deal.agreedPrice * opt.percent / 100))} EGP</p>
                      <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                    </div>
                    {deal.earnestPercent === opt.percent && <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center"><Check className="w-4 h-4 text-white" /></div>}
                  </div>
                </button>
              ))}
              <div className={`p-5 rounded-2xl border-2 transition-all ${![5, 10].includes(deal.earnestPercent) ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                <p className="font-bold text-gray-700 mb-2">Custom Amount</p>
                <div className="flex items-center gap-3">
                  <input type="number" value={deal.earnestAmount}
                    onChange={e => {
                      const amt = Number(e.target.value);
                      setDeal(d => ({ ...d, earnestAmount: amt, earnestPercent: Math.round(amt / d.agreedPrice * 100) }));
                    }}
                    className="flex-1 border-2 border-gray-200 rounded-xl px-3 py-2 font-bold text-lg focus:border-orange-400 outline-none" />
                  <span className="font-bold text-gray-500">EGP</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">Min 1% ({fmt(Math.round(deal.agreedPrice * 0.01))}) · Max 50%</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-500">Earnest Amount:</span>
                <span className="font-black text-orange-600">{fmt(deal.earnestAmount)} EGP</span>
              </div>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-gray-500">Percentage:</span>
                <span className="font-bold">{deal.earnestPercent}% of agreed price</span>
              </div>
              <p className="text-xs text-gray-400">100% refundable if deal fails through seller's fault · Non-refundable if buyer withdraws without valid reason</p>
            </div>
            <div className="mb-6">
              <p className="text-sm font-bold text-gray-700 mb-2">Deposit deadline:</p>
              <div className="grid grid-cols-3 gap-2">
                {[24, 48, 72].map(h => (
                  <button key={h} onClick={() => setDeal(d => ({ ...d, depositDeadlineHours: h }))}
                    className={`py-2.5 rounded-xl font-bold text-sm border-2 transition-all ${deal.depositDeadlineHours === h ? "border-orange-500 bg-orange-50 text-orange-700" : "border-gray-200 text-gray-600"}`}>
                    {h}h
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors">← Back</button>
              <button onClick={generateStructure} disabled={generating} className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                {generating ? <><Loader2 className="w-5 h-5 animate-spin" /> Generating plan...</> : <>Continue →</>}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 — MILESTONES */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-black text-gray-900 mb-1">📅 Deal Milestones</h2>
            <p className="text-gray-500 text-sm mb-5">5-step escrow process — each milestone must be confirmed by both parties</p>

            {/* Timeline visual */}
            <div className="flex items-center justify-between mb-6 px-2">
              {["💰", "📝", "⚖️", "💵", "🔑"].map((icon, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg flex-shrink-0 ${i === 0 ? "bg-orange-500 text-white ring-4 ring-orange-100" : "bg-gray-100"}`}>
                    {icon}
                  </div>
                  {i < 4 && <div className="flex-1 h-0.5 bg-gray-200 mx-1" />}
                </div>
              ))}
            </div>

            <div className="relative mb-5">
              {milestones.map((m, idx) => (
                <div key={idx} className="flex gap-4 mb-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base font-black flex-shrink-0 ${idx === 0 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"}`}>
                      {idx === 0 ? "1" : idx + 1}
                    </div>
                    {idx < milestones.length - 1 && <div className="w-0.5 flex-1 bg-gray-200 mt-1 min-h-[24px]" />}
                  </div>
                  <div className="flex-1 pb-3">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-black text-gray-900 text-sm">{MILESTONE_ICONS[m.type] || "📌"} {m.name}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{m.description}</p>
                        {m.paymentAmount > 0 && (
                          <p className="text-sm font-black text-orange-600 mt-1">💰 {fmt(m.paymentAmount)} EGP ({m.paymentPercent}%)</p>
                        )}
                        {m.requiredDocs?.length > 0 && (
                          <p className="text-xs text-blue-600 mt-1">📄 {m.requiredDocs.slice(0, 2).join(", ")}{m.requiredDocs.length > 2 ? " +" + (m.requiredDocs.length - 2) + " more" : ""}</p>
                        )}
                      </div>
                      {idx === 0 && <span className="bg-orange-100 text-orange-700 text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ml-2">First</span>}
                      {idx === milestones.length - 1 && <span className="bg-green-100 text-green-700 text-[10px] font-black px-2 py-0.5 rounded-full flex-shrink-0 ml-2">Final 🎉</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {aiSummary && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mb-4">
                <p className="text-xs font-black text-purple-700 mb-2">🤖 AI Deal Summary</p>
                <p className="text-sm text-purple-800">{aiSummary.dealSummaryLetter}</p>
                {aiSummary.estimatedTimelineWeeks && (
                  <p className="text-xs text-purple-500 mt-2">⏱ Estimated timeline: {aiSummary.estimatedTimelineWeeks} weeks</p>
                )}
              </div>
            )}

            <div className="bg-teal-50 border border-teal-200 rounded-xl p-3 mb-5">
              <p className="text-xs font-black text-teal-700 mb-1">🔒 Parallel Safeguards (always active)</p>
              <div className="grid grid-cols-2 gap-1">
                {["KYC verification", "Document verification", "FO facilitation (optional)", "AI monitoring"].map((s, i) => (
                  <p key={i} className="text-xs text-teal-600 flex items-center gap-1"><span>✓</span>{s}</p>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors">← Back</button>
              <button onClick={() => setStep(4)} className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-colors">Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 4 — CONDITIONS */}
        {step === 4 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-black text-gray-900 mb-2">📋 Deal Conditions</h2>
            <p className="text-gray-500 text-sm mb-6">These conditions must be met before funds are released:</p>
            <div className="space-y-3 mb-6">
              {conditions.map((c, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-xl border border-gray-100 hover:bg-gray-50">
                  <div className="w-5 h-5 bg-green-500 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-gray-800">{c.text}</p>
                    <p className="text-xs text-gray-400">{c.textAr}</p>
                  </div>
                  <span className="text-[10px] text-orange-600 bg-orange-50 px-1.5 py-0.5 rounded font-bold">{c.required ? "Required" : "Optional"}</span>
                </div>
              ))}
            </div>
            <div className="bg-gray-50 rounded-xl p-4 mb-6">
              <p className="text-sm font-bold text-gray-700 mb-3">📄 Required Documents</p>
              {[
                { doc: "Sale Contract", uploader: "Both parties", when: "Milestone 2" },
                { doc: "Title Deed (Original)", uploader: "Seller", when: "Milestone 3" },
                { doc: "National ID (both parties)", uploader: "Each party", when: "Milestone 1" },
                { doc: "Inspection Report", uploader: "Buyer / FO", when: "Milestone 3" },
              ].map((d, i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">📄 {d.doc}</span>
                  <span className="text-xs text-gray-400">{d.uploader} · {d.when}</span>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(3)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors">← Back</button>
              <button onClick={() => setStep(5)} className="flex-[2] bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl transition-colors">Continue →</button>
            </div>
          </div>
        )}

        {/* STEP 5 — CONFIRM */}
        {step === 5 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-black text-gray-900 mb-6">✅ Confirm Escrow Setup</h2>
            <div className="bg-gray-50 rounded-xl p-5 mb-5 space-y-3">
              {[
                { label: "Agreed Price", value: `${fmt(deal.agreedPrice)} EGP`, bold: true },
                { label: "Earnest Money", value: `${fmt(deal.earnestAmount)} EGP (${deal.earnestPercent}%)` },
                { label: "Payment Structure", value: deal.paymentStructure.replace("_", " ").toUpperCase() },
                { label: "Milestones", value: `${milestones.length} milestones` },
                { label: "Conditions", value: `${conditions.length} conditions` },
                { label: "Deposit Deadline", value: `Within ${deal.depositDeadlineHours} hours` },
              ].map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span className="text-gray-500 text-sm">{item.label}</span>
                  <span className={`text-sm ${item.bold ? "font-black text-orange-600 text-base" : "font-semibold text-gray-900"}`}>{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">
              <p className="font-black text-orange-800 text-sm mb-2">Kemedar Escrow™ Service Fee</p>
              <div className="flex justify-between items-center">
                <span className="text-orange-700 text-sm">1.5% of deal value</span>
                <span className="font-black text-orange-600">{fmt(Math.round(deal.agreedPrice * 0.015))} EGP</span>
              </div>
              <p className="text-xs text-orange-600 mt-2">Split: Buyer 50% / Seller 50% · Only charged on successful completion</p>
            </div>
            <div className="space-y-3 mb-6">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={termsAgreed} onChange={e => setTermsAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-orange-500" />
                <span className="text-sm text-gray-700">I agree to Kemedar Escrow™ Terms & Conditions</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={detailsAgreed} onChange={e => setDetailsAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-orange-500" />
                <span className="text-sm text-gray-700">I confirm the deal details are accurate</span>
              </label>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(4)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl hover:bg-gray-50 transition-colors">← Back</button>
              <button onClick={handleCreateDeal} disabled={!termsAgreed || !detailsAgreed || submitting}
                className="flex-[2] bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-black py-4 rounded-2xl transition-colors flex items-center justify-center gap-2">
                {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating...</> : <><Lock className="w-5 h-5" /> Create Escrow Deal</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}