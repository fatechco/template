import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AlertTriangle, ChevronRight, Upload, Loader2, Check, X, Shield } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";

const DISPUTE_TYPES = [
  { value: "property_misrepresentation", icon: "🏠", label: "Property Misrepresentation", desc: "Property doesn't match listing" },
  { value: "milestone_not_completed", icon: "❌", label: "Milestone Not Completed", desc: "Required step was not done" },
  { value: "deal_terms_violated", icon: "🔑", label: "Terms Violated", desc: "Agreed terms were broken" },
  { value: "payment_not_received", icon: "💰", label: "Payment Issue", desc: "Payment problem or discrepancy" },
  { value: "inspection_failed", icon: "🔍", label: "Inspection Failed", desc: "Property inspection revealed issues" },
  { value: "other", icon: "⚠️", label: "Other Concern", desc: "Describe below" },
];

function StepBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {["Type", "Describe", "Evidence", "Confirm"].map((s, i) => (
        <div key={i} className="flex items-center gap-1.5 flex-1">
          <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${i < step ? "bg-red-500 text-white" : i === step - 1 ? "bg-red-500 text-white" : "bg-gray-200 text-gray-500"}`}>
            {i < step - 1 ? <Check className="w-3 h-3" /> : i + 1}
          </div>
          <span className={`text-xs hidden sm:block ${i === step - 1 ? "font-bold text-red-600" : "text-gray-400"}`}>{s}</span>
          {i < 3 && <div className={`flex-1 h-0.5 ${i < step - 1 ? "bg-red-400" : "bg-gray-200"}`} />}
        </div>
      ))}
    </div>
  );
}

export default function EscrowDisputeRoom() {
  const { dealId, disputeId } = useParams();
  const navigate = useNavigate();
  const [step, setStep] = useState(disputeId ? 0 : 1); // 0 = viewing existing, 1-4 = raising new
  const [deal, setDeal] = useState(null);
  const [dispute, setDispute] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [evaluating, setEvaluating] = useState(false);

  // Form state
  const [disputeType, setDisputeType] = useState("");
  const [amountType, setAmountType] = useState("full");
  const [customAmount, setCustomAmount] = useState(0);
  const [description, setDescription] = useState("");
  const [evidenceFiles, setEvidenceFiles] = useState([]);

  useEffect(() => {
    const init = async () => {
      try {
        const me = await base44.auth.me();
        setUser(me);
        const deals = await base44.entities.EscrowDeal.filter({ id: dealId });
        if (deals.length) setDeal(deals[0]);
        if (disputeId) {
          const disputes = await base44.entities.EscrowDispute.filter({ id: disputeId });
          if (disputes.length) setDispute(disputes[0]);
        }
      } catch (e) {}
      setLoading(false);
    };
    init();
  }, [dealId, disputeId]);

  const handleSubmitDispute = async () => {
    setSubmitting(true);
    const amount = amountType === "full" ? (deal?.agreedPrice || 0) : customAmount;
    const disputeNumber = `KED-DSP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`;
    const role = user?.id === deal?.buyerId ? "buyer" : "seller";

    const newDispute = await base44.entities.EscrowDispute.create({
      disputeNumber,
      dealId,
      raisedBy: role,
      raisedById: user?.id,
      raisedAt: new Date().toISOString(),
      disputeType,
      description,
      evidenceUrls: evidenceFiles,
      amountDisputed: amount,
      aiEvaluationStatus: "pending",
      status: "open"
    });

    // Freeze the deal
    await base44.entities.EscrowDeal.update(dealId, {
      isDisputed: true,
      disputeId: newDispute.id,
      status: "disputed"
    });

    setDispute(newDispute);
    setSubmitting(false);

    // Trigger AI evaluation
    setEvaluating(true);
    await base44.functions.invoke("evaluateDispute", { disputeId: newDispute.id }).catch(() => null);
    setEvaluating(false);
    // Reload dispute
    const updated = await base44.entities.EscrowDispute.filter({ id: newDispute.id });
    if (updated.length) setDispute(updated[0]);
    setStep(0);
  };

  const handleAcceptAI = async () => {
    if (!dispute?.aiEvaluationResult) return;
    const r = dispute.aiEvaluationResult;
    await base44.entities.EscrowDispute.update(dispute.id, {
      status: r.recommendedRefundToBuyer > r.recommendedReleaseToSeller ? "resolved_buyer_wins" : "resolved_seller_wins",
      resolution: r.recommendedResolution,
      refundToBuyer: r.recommendedRefundToBuyer,
      releaseToSeller: r.recommendedReleaseToSeller,
      resolvedAt: new Date().toISOString(),
      resolvedBy: "ai"
    });
    await base44.entities.EscrowDeal.update(dealId, { isDisputed: false, status: "in_progress" });
    navigate(`/kemedar/escrow/${dealId}`);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-red-500" />
    </div>
  );

  // VIEWING EXISTING DISPUTE
  if (step === 0 && dispute) {
    const ai = dispute.aiEvaluationResult;
    const isEvaluated = dispute.aiEvaluationStatus === "evaluated" || dispute.aiEvaluationStatus === "human_review";
    const buyerWins = ai && ai.recommendedRefundToBuyer > ai.recommendedReleaseToSeller;

    return (
      <div className="min-h-screen bg-gray-50">
        <SiteHeader />
        {/* Dispute banner */}
        <div className="bg-red-500 text-white py-3 px-4 text-center">
          <p className="font-black">⚠️ ACTIVE DISPUTE — All Fund Releases Frozen</p>
          <p className="text-red-200 text-xs">{dispute.disputeNumber}</p>
        </div>
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* AI Evaluation */}
            <div className="lg:col-span-2 space-y-5">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-black text-gray-900 text-lg">🤖 Kemedar AI Evaluation</h2>
                  {isEvaluated && <span className="text-xs font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Evaluated</span>}
                </div>
                {!isEvaluated ? (
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Loader2 className={`w-8 h-8 text-purple-500 ${evaluating ? "animate-spin" : ""}`} />
                    </div>
                    <p className="font-bold text-gray-700">AI Evaluating This Dispute...</p>
                    <p className="text-sm text-gray-500 mt-1">Analyzing evidence from both parties</p>
                    <p className="text-xs text-gray-400 mt-1">Usually takes 2-4 hours</p>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mt-4">
                      <div className="h-full bg-purple-500 rounded-full animate-pulse" style={{ width: "60%" }} />
                    </div>
                  </div>
                ) : (
                  <div>
                    {/* Confidence */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="flex-1">
                        <p className="text-xs font-bold text-gray-500 mb-1">AI Confidence</p>
                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full rounded-full" style={{ width: `${ai.confidenceScore}%`, backgroundColor: ai.confidenceScore >= 70 ? "#22c55e" : "#f97316" }} />
                        </div>
                      </div>
                      <span className="font-black text-2xl">{ai.confidenceScore}%</span>
                    </div>

                    {/* Fault bars */}
                    <div className="grid grid-cols-2 gap-3 mb-5">
                      {[
                        { label: "Buyer Responsibility", pct: ai.buyerFaultPercent, color: "bg-blue-500" },
                        { label: "Seller Responsibility", pct: ai.sellerFaultPercent, color: "bg-orange-500" }
                      ].map(item => (
                        <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                          <p className="text-xs text-gray-500 mb-2">{item.label}</p>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-1">
                            <div className={`h-full ${item.color} rounded-full`} style={{ width: `${item.pct}%` }} />
                          </div>
                          <p className="font-black text-lg">{item.pct}%</p>
                        </div>
                      ))}
                    </div>

                    {/* Recommendation */}
                    <div className={`rounded-xl p-4 mb-4 ${buyerWins ? "bg-green-50 border border-green-200" : "bg-orange-50 border border-orange-200"}`}>
                      <p className="font-black text-sm mb-2">{buyerWins ? "🟢 Recommended Resolution" : "🟠 Recommended Resolution"}</p>
                      <p className={`text-base font-black ${buyerWins ? "text-green-700" : "text-orange-700"}`}>
                        {buyerWins
                          ? `Refund to Buyer: ${(ai.recommendedRefundToBuyer || 0).toLocaleString()} EGP`
                          : `Release to Seller: ${(ai.recommendedReleaseToSeller || 0).toLocaleString()} EGP`}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">{ai.reasoning}</p>
                    </div>

                    {/* Key factors */}
                    {ai.keyFactors?.length > 0 && (
                      <div className="mb-5">
                        <p className="text-xs font-bold text-gray-500 mb-2">Key Factors:</p>
                        {ai.keyFactors.map((f, i) => (
                          <p key={i} className="text-sm text-gray-700 flex items-start gap-2 mb-1.5">
                            <span className="text-purple-400 mt-0.5">•</span>{f}
                          </p>
                        ))}
                      </div>
                    )}

                    {ai.requiresHumanReview && (
                      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-4">
                        <p className="text-sm font-bold text-yellow-800">⚠️ Human Review Required</p>
                        <p className="text-xs text-yellow-700 mt-0.5">{ai.humanReviewReason}</p>
                        <p className="text-xs text-yellow-600 mt-1">A Kemedar admin will review within 48 hours</p>
                      </div>
                    )}

                    <div className="space-y-2">
                      <button onClick={handleAcceptAI} className="w-full bg-green-500 hover:bg-green-600 text-white font-black py-3 rounded-xl text-sm transition-colors">
                        ✅ Accept AI Decision
                      </button>
                      <button onClick={() => navigate(`/kemedar/escrow/${dealId}`)} className="w-full border-2 border-orange-300 text-orange-700 font-bold py-2.5 rounded-xl text-sm hover:bg-orange-50 transition-colors">
                        🤝 Request FO Mediation
                      </button>
                      <button className="w-full border-2 border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                        📞 Request Admin Review
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Dispute Details */}
            <div className="space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="font-black text-gray-900 text-sm mb-3">Dispute Details</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-gray-400">Raised by</span><span className="font-bold capitalize">{dispute.raisedBy}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Type</span><span className="font-bold text-right">{dispute.disputeType?.replace(/_/g, " ")}</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Amount</span><span className="font-black text-red-600">{(dispute.amountDisputed || 0).toLocaleString()} EGP</span></div>
                  <div className="flex justify-between"><span className="text-gray-400">Status</span><span className="font-bold text-orange-600 capitalize">{dispute.status?.replace(/_/g, " ")}</span></div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <p className="text-xs font-bold text-gray-500 mb-1">Description:</p>
                  <p className="text-xs text-gray-600">{dispute.description}</p>
                </div>
              </div>
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
                <p className="font-black text-gray-900 text-sm mb-3">🛡 Kemedar Escrow™ Guarantees</p>
                {["Fair AI-powered evaluation", "FO mediation available", "Admin override if needed", "Resolution within 14 days"].map((g, i) => (
                  <p key={i} className="text-xs text-gray-600 flex items-center gap-1.5 mb-1.5">
                    <Shield className="w-3 h-3 text-green-500" /> {g}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // RAISE NEW DISPUTE — Step 1
  if (step === 1) return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black text-red-600 mb-2">⚠️ Raise a Dispute</h1>
        <StepBar step={1} />
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-6">
          <p className="text-sm font-bold text-orange-800">Raising a dispute freezes all fund releases until resolved. Only raise a dispute if you have a genuine concern.</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-gray-900 mb-4">What is the issue?</h2>
          <div className="grid grid-cols-2 gap-3">
            {DISPUTE_TYPES.map(dt => (
              <button key={dt.value} onClick={() => setDisputeType(dt.value)}
                className={`p-4 rounded-xl border-2 text-left transition-all ${disputeType === dt.value ? "border-red-500 bg-red-50" : "border-gray-200 hover:border-red-200"}`}>
                <span className="text-2xl mb-1 block">{dt.icon}</span>
                <p className="font-bold text-sm text-gray-900">{dt.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{dt.desc}</p>
              </button>
            ))}
          </div>
          <button onClick={() => setStep(2)} disabled={!disputeType}
            className="w-full bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl mt-6 transition-colors">
            Continue → <ChevronRight className="inline w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  // STEP 2 — DESCRIBE
  if (step === 2) return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black text-red-600 mb-2">⚠️ Raise a Dispute</h1>
        <StepBar step={2} />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="space-y-4 mb-6">
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">How much is in dispute?</p>
              <div className="space-y-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" checked={amountType === "full"} onChange={() => setAmountType("full")} className="accent-red-500" />
                  <span className="text-sm">Full escrow amount ({(deal?.agreedPrice || 0).toLocaleString()} EGP)</span>
                </label>
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" checked={amountType === "partial"} onChange={() => setAmountType("partial")} className="accent-red-500" />
                  <span className="text-sm">Partial amount</span>
                </label>
                {amountType === "partial" && (
                  <input type="number" value={customAmount} onChange={e => setCustomAmount(Number(e.target.value))}
                    placeholder="Amount in EGP" className="w-full border-2 border-gray-200 rounded-xl px-4 py-2.5 focus:border-red-400 outline-none" />
                )}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="radio" checked={amountType === "none"} onChange={() => setAmountType("none")} className="accent-red-500" />
                  <span className="text-sm">No specific amount — need resolution</span>
                </label>
              </div>
            </div>
            <div>
              <p className="text-sm font-bold text-gray-700 mb-2">Describe the issue in detail:</p>
              <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5}
                placeholder="Provide as much detail as possible (minimum 100 characters)..."
                className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:border-red-400 outline-none" />
              <p className={`text-xs mt-1 ${description.length < 100 ? "text-red-400" : "text-gray-400"}`}>{description.length}/2000 (min 100)</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(1)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl">← Back</button>
            <button onClick={() => setStep(3)} disabled={description.length < 100}
              className="flex-[2] bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-black py-4 rounded-2xl transition-colors">Continue →</button>
          </div>
        </div>
      </div>
    </div>
  );

  // STEP 3 — EVIDENCE
  if (step === 3) return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black text-red-600 mb-2">⚠️ Raise a Dispute</h1>
        <StepBar step={3} />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-gray-900 mb-4">Upload Evidence</h2>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 mb-4">
            <p className="text-xs text-blue-700">💡 Strong evidence = faster resolution. Accepted: photos, videos, documents, emails, screenshots</p>
          </div>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-4 hover:border-red-300 transition-colors cursor-pointer">
            <Upload className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 font-semibold">Drop files here or click to upload</p>
            <p className="text-xs text-gray-400 mt-1">Max 50MB each · Multiple files allowed</p>
          </div>
          <p className="text-xs text-gray-400 text-center mb-6">{evidenceFiles.length} files uploaded</p>
          <div className="flex gap-3">
            <button onClick={() => setStep(2)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-4 rounded-2xl">← Back</button>
            <button onClick={() => setStep(4)} className="flex-[2] bg-red-500 hover:bg-red-600 text-white font-black py-4 rounded-2xl transition-colors">Continue →</button>
          </div>
        </div>
      </div>
    </div>
  );

  // STEP 4 — CONFIRM
  return (
    <div className="min-h-screen bg-gray-50">
      <SiteHeader />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-black text-red-600 mb-2">⚠️ Raise a Dispute</h1>
        <StepBar step={4} />
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-black text-gray-900 mb-4">Confirm Dispute</h2>
          <div className="bg-gray-50 rounded-xl p-4 mb-5 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-gray-500">Dispute Type</span><span className="font-bold">{disputeType.replace(/_/g, " ")}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Amount</span><span className="font-black text-red-600">{amountType === "full" ? `${(deal?.agreedPrice || 0).toLocaleString()} EGP` : amountType === "partial" ? `${customAmount.toLocaleString()} EGP` : "TBD"}</span></div>
            <div className="flex justify-between text-sm"><span className="text-gray-500">Evidence</span><span className="font-bold">{evidenceFiles.length} files</span></div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-5">
            <p className="font-black text-orange-800 text-sm mb-2">By raising this dispute:</p>
            {["All fund releases are frozen", "Other party will be notified", "AI will evaluate your case", "FO mediator may be assigned", "Resolution within 14 days"].map((t, i) => (
              <p key={i} className="text-xs text-orange-700 flex items-center gap-1.5 mb-1"><Check className="w-3 h-3 text-orange-500" /> {t}</p>
            ))}
          </div>
          <div className="flex gap-3">
            <button onClick={() => setStep(3)} className="flex-1 border-2 border-gray-200 text-gray-600 font-bold py-4 rounded-2xl">← Back</button>
            <button onClick={handleSubmitDispute} disabled={submitting}
              className="flex-[2] bg-red-500 hover:bg-red-600 disabled:opacity-60 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-colors">
              {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : <><AlertTriangle className="w-5 h-5" /> Confirm & Raise Dispute</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}