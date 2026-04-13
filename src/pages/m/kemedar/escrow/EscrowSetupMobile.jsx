import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, Check, Lock, Loader2, Info } from "lucide-react";
import { base44 } from "@/api/base44Client";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const PAYMENT_STRUCTURES = [
  { value: "full_cash", label: "Full Cash", icon: "💵", desc: "Full payment on handover" },
  { value: "mortgage", label: "Mortgage", icon: "🏦", desc: "Bank-financed purchase" },
  { value: "cash_installment", label: "Installments", icon: "📅", desc: "Agreed payment schedule" },
  { value: "developer_plan", label: "Developer Plan", icon: "🏗", desc: "Off-plan developer schedule" },
];

const STEPS = ["Deal Overview", "Earnest Money", "Milestones", "Confirm"];
const fmt = n => n ? Number(n).toLocaleString() : "0";

export default function EscrowSetupMobile() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const negotiationId = searchParams.get("negotiationId");
  const propertyId = searchParams.get("propertyId");

  const [step, setStep] = useState(1);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [milestones, setMilestones] = useState([]);
  const [conditions, setConditions] = useState([]);
  const [aiSummary, setAiSummary] = useState(null);
  const [termsAgreed, setTermsAgreed] = useState(false);
  const [detailsAgreed, setDetailsAgreed] = useState(false);

  const [deal, setDeal] = useState({
    agreedPrice: 3500000, currency: "EGP", paymentStructure: "full_cash",
    earnestPercent: 10, earnestAmount: 350000, depositDeadlineHours: 48,
    property: null,
  });

  useEffect(() => {
    const init = async () => {
      const me = await base44.auth.me().catch(() => null);
      setUser(me);
      if (propertyId) {
        const props = await base44.entities.Property.filter({ id: propertyId }).catch(() => []);
        if (props.length) setDeal(d => ({ ...d, property: props[0] }));
      }
      if (negotiationId) {
        const sessions = await base44.entities.NegotiationSession.filter({ id: negotiationId }).catch(() => []);
        if (sessions.length) {
          const s = sessions[0];
          setDeal(d => ({ ...d, agreedPrice: s.agreedPrice || d.agreedPrice, earnestAmount: Math.round((s.agreedPrice || d.agreedPrice) * d.earnestPercent / 100) }));
        }
      }
      setLoading(false);
    };
    init();
  }, []);

  const updateEarnest = (percent) => setDeal(d => ({ ...d, earnestPercent: percent, earnestAmount: Math.round(d.agreedPrice * percent / 100) }));

  const generateStructure = async () => {
    setGenerating(true);
    const result = await base44.functions.invoke("generateDealStructure", {
      negotiationSessionId: negotiationId,
      dealTerms: { agreedPrice: deal.agreedPrice, paymentStructure: deal.paymentStructure, propertyTitle: deal.property?.title || "Property" }
    }).catch(() => null);
    if (result?.data) {
      setMilestones(result.data.milestones || []);
      setConditions(result.data.conditions || []);
      setAiSummary(result.data.aiSummary);
    } else {
      // Fallback milestones
      setMilestones([
        { order: 1, name: "Earnest Deposit", type: "earnest_deposit", description: "Buyer deposits earnest money into escrow.", paymentAmount: deal.earnestAmount, paymentPercent: deal.earnestPercent },
        { order: 2, name: "Contract Signing", type: "contract_signing", description: "Both parties review and sign the sale contract.", paymentAmount: 0, paymentPercent: 0 },
        { order: 3, name: "Legal Due Diligence", type: "legal_verification", description: "Title deed verified. FO inspection complete.", paymentAmount: 0, paymentPercent: 0 },
        { order: 4, name: "Balance Payment", type: "balance_payment", description: "Buyer pays remaining balance.", paymentAmount: deal.agreedPrice - deal.earnestAmount, paymentPercent: 100 - deal.earnestPercent },
        { order: 5, name: "Keys Handover", type: "keys_handover", description: "Physical handover confirmed. Certificate generated.", paymentAmount: 0, paymentPercent: 0 },
      ]);
    }
    setGenerating(false);
    setStep(3);
  };

  const handleCreateDeal = async () => {
    setSubmitting(true);
    const dealNumber = `KED-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).slice(2, 7).toUpperCase()}`;
    const newDeal = await base44.entities.EscrowDeal.create({
      dealNumber, buyerId: user?.id, sellerId: deal.property?.user_id || "pending",
      propertyId: propertyId || deal.property?.id || null,
      negotiationSessionId: negotiationId || null,
      agreedPrice: deal.agreedPrice, currency: deal.currency,
      paymentStructure: deal.paymentStructure,
      earnestMoneyAmount: deal.earnestAmount, earnestMoneyPercent: deal.earnestPercent,
      totalEscrowAmount: deal.agreedPrice, conditions,
      status: "awaiting_deposit", completionPercent: 0,
      depositDeadline: new Date(Date.now() + deal.depositDeadlineHours * 3600000).toISOString(),
      completionDeadline: new Date(Date.now() + 90 * 86400000).toISOString(),
      platformFeeAmount: Math.round(deal.agreedPrice * 0.015), platformFeePercent: 1.5,
    });
    for (const m of milestones) {
      await base44.entities.EscrowMilestone.create({
        dealId: newDeal.id, milestoneOrder: m.order, milestoneName: m.name,
        milestoneType: m.type, description: m.description,
        paymentAmount: m.paymentAmount || 0, paymentPercent: m.paymentPercent || 0,
        paymentOnCompletion: (m.paymentAmount || 0) > 0,
        status: m.order === 1 ? "in_progress" : "pending",
      });
    }
    navigate(`/m/kemedar/escrow/${newDeal.id}?new=1`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 flex items-center gap-3" style={{ paddingTop: "max(16px, env(safe-area-inset-top))", paddingBottom: 12 }}>
        <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="w-9 h-9 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={18} className="text-gray-700" />
        </button>
        <div className="flex-1">
          <p className="font-black text-gray-900 text-sm flex items-center gap-1.5"><Lock size={13} className="text-orange-500" /> Escrow Setup</p>
          <p className="text-xs text-gray-400">Step {step} of {STEPS.length} — {STEPS[step - 1]}</p>
        </div>
      </div>

      {/* Progress */}
      <div className="flex gap-1 px-4 py-2 bg-white border-b border-gray-100">
        {STEPS.map((_, i) => (
          <div key={i} className={`flex-1 h-1.5 rounded-full transition-all ${i < step ? "bg-orange-500" : "bg-gray-200"}`} />
        ))}
      </div>

      <div className="px-4 py-5">
        {/* Step 1 — Deal Overview */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900">📋 Deal Summary</h2>
            {deal.property && (
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-4 flex gap-3 items-center">
                {deal.property.featured_image && <img src={deal.property.featured_image} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" alt="" />}
                <div><p className="font-black text-gray-900 text-sm">{deal.property.title}</p></div>
              </div>
            )}
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-1 block">Agreed Price</label>
              <div className="relative">
                <input type="number" value={deal.agreedPrice}
                  onChange={e => setDeal(d => ({ ...d, agreedPrice: Number(e.target.value), earnestAmount: Math.round(Number(e.target.value) * d.earnestPercent / 100) }))}
                  className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-xl font-black text-orange-600 focus:border-orange-400 outline-none" />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">EGP</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold text-gray-500 uppercase mb-2 block">Payment Structure</label>
              <div className="grid grid-cols-2 gap-2">
                {PAYMENT_STRUCTURES.map(ps => (
                  <button key={ps.value} onClick={() => setDeal(d => ({ ...d, paymentStructure: ps.value }))}
                    className={`p-3 rounded-xl border-2 text-left transition-all ${deal.paymentStructure === ps.value ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                    <span className="text-xl">{ps.icon}</span>
                    <p className="font-bold text-sm mt-1">{ps.label}</p>
                    <p className="text-[10px] text-gray-500">{ps.desc}</p>
                  </button>
                ))}
              </div>
            </div>
            <button onClick={() => setStep(2)} className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl">Continue →</button>
          </div>
        )}

        {/* Step 2 — Earnest Money */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900">💰 Earnest Money</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex gap-2">
              <Info size={16} className="text-blue-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800">Earnest money is held safely by Kemedar and returned if the deal falls through through no fault of your own.</p>
            </div>
            <div className="space-y-2">
              {[{ percent: 5, label: "Standard", badge: null }, { percent: 10, label: "Strong", badge: "✅ Recommended" }].map(opt => (
                <button key={opt.percent} onClick={() => updateEarnest(opt.percent)}
                  className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${deal.earnestPercent === opt.percent ? "border-orange-500 bg-orange-50" : "border-gray-200"}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-black text-gray-900 text-sm">{opt.percent}% — {opt.label}</span>
                        {opt.badge && <span className="bg-green-100 text-green-700 text-[9px] font-black px-1.5 py-0.5 rounded-full">{opt.badge}</span>}
                      </div>
                      <p className="text-xl font-black text-orange-600">{fmt(Math.round(deal.agreedPrice * opt.percent / 100))} EGP</p>
                    </div>
                    {deal.earnestPercent === opt.percent && <div className="w-7 h-7 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0"><Check size={14} className="text-white" /></div>}
                  </div>
                </button>
              ))}
            </div>
            <div>
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
            <button onClick={generateStructure} disabled={generating}
              className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-60">
              {generating ? <><Loader2 size={18} className="animate-spin" />Generating plan...</> : "Continue →"}
            </button>
          </div>
        )}

        {/* Step 3 — Milestones */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900">📅 Deal Milestones</h2>
            {/* Timeline */}
            <div className="flex items-center">
              {["💰", "📝", "⚖️", "💵", "🔑"].map((icon, i) => (
                <div key={i} className="flex items-center flex-1 last:flex-none">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-base flex-shrink-0 ${i === 0 ? "bg-orange-500 text-white" : "bg-gray-100"}`}>{icon}</div>
                  {i < 4 && <div className="flex-1 h-0.5 bg-gray-200 mx-1" />}
                </div>
              ))}
            </div>
            <div className="space-y-2">
              {milestones.map((m, idx) => (
                <div key={idx} className={`rounded-xl border p-3 ${idx === 0 ? "border-orange-300 bg-orange-50" : "border-gray-100 bg-white"}`}>
                  <div className="flex items-center gap-2">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${idx === 0 ? "bg-orange-500 text-white" : "bg-gray-100 text-gray-500"}`}>{idx + 1}</div>
                    <div className="flex-1">
                      <p className="font-black text-gray-900 text-sm">{m.name}</p>
                      <p className="text-[10px] text-gray-500">{m.description}</p>
                      {m.paymentAmount > 0 && <p className="text-xs font-black text-orange-600">{fmt(m.paymentAmount)} EGP</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {aiSummary && (
              <div className="bg-purple-50 border border-purple-200 rounded-xl p-3">
                <p className="text-xs font-black text-purple-700 mb-1">🤖 AI Deal Summary</p>
                <p className="text-xs text-purple-800">{aiSummary.dealSummaryLetter}</p>
              </div>
            )}
            <button onClick={() => setStep(4)} className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl">Continue →</button>
          </div>
        )}

        {/* Step 4 — Confirm */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-lg font-black text-gray-900">✅ Confirm Escrow Setup</h2>
            <div className="bg-gray-50 rounded-xl p-4 space-y-2">
              {[
                { label: "Agreed Price", value: `${fmt(deal.agreedPrice)} EGP` },
                { label: "Earnest Money", value: `${fmt(deal.earnestAmount)} EGP (${deal.earnestPercent}%)` },
                { label: "Payment Structure", value: deal.paymentStructure.replace(/_/g, " ").toUpperCase() },
                { label: "Milestones", value: `${milestones.length} milestones` },
                { label: "Deposit Deadline", value: `Within ${deal.depositDeadlineHours} hours` },
              ].map((item, i) => (
                <div key={i} className="flex justify-between text-sm">
                  <span className="text-gray-500">{item.label}</span>
                  <span className="font-bold text-gray-900">{item.value}</span>
                </div>
              ))}
            </div>
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3">
              <p className="font-black text-orange-800 text-sm">Kemedar Escrow™ Fee: 1.5%</p>
              <div className="flex justify-between mt-1">
                <span className="text-orange-700 text-sm">Platform fee (split 50/50)</span>
                <span className="font-black text-orange-600 text-sm">{fmt(Math.round(deal.agreedPrice * 0.015))} EGP</span>
              </div>
              <p className="text-[10px] text-orange-600 mt-1">Only charged on successful completion</p>
            </div>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={termsAgreed} onChange={e => setTermsAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-orange-500" />
                <span className="text-sm text-gray-700">I agree to Kemedar Escrow™ Terms & Conditions</span>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={detailsAgreed} onChange={e => setDetailsAgreed(e.target.checked)} className="mt-1 w-4 h-4 accent-orange-500" />
                <span className="text-sm text-gray-700">I confirm the deal details are accurate</span>
              </label>
            </div>
            <button onClick={handleCreateDeal} disabled={!termsAgreed || !detailsAgreed || submitting}
              className="w-full bg-orange-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-50">
              {submitting ? <><Loader2 size={18} className="animate-spin" />Creating...</> : <><Lock size={16} />Create Escrow Deal</>}
            </button>
          </div>
        )}
      </div>

      <MobileBottomNav />
    </div>
  );
}