"use client";
// @ts-nocheck
import { useState } from "react";
import { apiClient } from "@/lib/api-client";

function StepCard({ borderColor, icon, title, subtitle, children }) {
  return (
    <div className="bg-white rounded-xl p-4" style={{ borderLeft: `4px solid ${borderColor}` }}>
      <div className="flex items-start gap-3 mb-3">
        <span className="text-xl flex-shrink-0">{icon}</span>
        <div>
          <p className="font-black text-gray-900 text-sm">{title}</p>
          <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{subtitle}</p>
        </div>
      </div>
      {children}
    </div>
  );
}

export default function SwapConciergeSection({ match, isUserA, userId, settings, onRefresh }) {
  const [assigningLawyer, setAssigningLawyer] = useState(false);
  const [lawyerAssigned, setLawyerAssigned] = useState(!!match.kemeworkLegalTaskId);

  const gapEGP = match.agreedGapEGP || match.valuationGapEGP || 0;
  const escrowFeePercent = settings?.escrowFeePercent || 1.5;
  const escrowFee = Math.round(gapEGP * escrowFeePercent / 100);
  const legalFee = settings?.legalFeePerSwapEGP || 3000;
  const legalFeeEach = Math.round(legalFee / 2);

  const handleAssignLawyer = async () => {
    setAssigningLawyer(true);
    try {
      await apiClient.put("/api/v1/swapmatch/", match.id, {
        status: "legal_review",
        kemeworkLegalTaskId: "kemework-task-" + Date.now(),
      });
      setLawyerAssigned(true);
      onRefresh();
    } catch (e) { console.error(e); }
    setAssigningLawyer(false);
  };

  return (
    <div className="rounded-2xl p-5 border-2 border-amber-200" style={{ background: "#FFFBEB" }}>
      {/* Header */}
      <div className="flex items-start gap-3 mb-5">
        <span className="text-3xl">🛡️</span>
        <div>
          <h3 className="font-black text-gray-900 text-xl">Secure This Swap</h3>
          <p className="text-sm text-gray-600 mt-0.5">Your terms are agreed. Now make it legally binding with 3 mandatory steps.</p>
        </div>
      </div>

      <div className="space-y-3">
        {/* Step 1 */}
        <StepCard
          borderColor="#14B8A6"
          icon="🔍"
          title="Step 1: Kemedar Verify Pro™"
          subtitle="Both properties need Verify Pro Level 3+ for the legal transfer to proceed."
        >
          <div className="space-y-1.5 mb-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Property A (Party A)</span>
              <span className="bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">Level 2</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-gray-600">Property B (Party B)</span>
              <span className="bg-teal-100 text-teal-700 font-bold px-2 py-0.5 rounded-full">Level 2</span>
            </div>
          </div>
          <a
            href={`/verify/my-property/${isUserA ? match.propertyAId : match.propertyBId}`}
            className="block w-full text-center border border-teal-400 text-teal-700 font-bold text-xs py-2 rounded-lg hover:bg-teal-50 transition-colors"
          >
            Request Verification →
          </a>
          <p className="text-[10px] text-gray-400 mt-1.5 text-center">500 EGP per party</p>
        </StepCard>

        {/* Step 2 */}
        <StepCard
          borderColor="#7C3AED"
          icon="⚖️"
          title="Step 2: Legal Contracts via Kemework"
          subtitle="A certified real estate lawyer drafts the dual title transfer contracts."
        >
          {lawyerAssigned || match.status === "legal_review" ? (
            <div className="bg-green-50 rounded-lg p-2 text-center">
              <p className="text-xs font-bold text-green-700">✅ Kemework legal task created</p>
              {match.kemeworkLegalTaskId && (
                <a href="/kemework/tasks" className="text-[11px] text-[#7C3AED] hover:underline">View task →</a>
              )}
            </div>
          ) : (
            <button
              onClick={handleAssignLawyer}
              disabled={assigningLawyer}
              className="w-full bg-[#7C3AED] hover:bg-purple-700 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-1.5"
            >
              {assigningLawyer ? <><div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />Assigning...</> : "⚖️ Assign a Kemework Lawyer"}
            </button>
          )}
          <p className="text-[10px] text-gray-400 mt-1.5 text-center">{legalFeeEach.toLocaleString()} EGP each — split equally</p>
        </StepCard>

        {/* Step 3 */}
        <StepCard
          borderColor="#F59E0B"
          icon="🔒"
          title="Step 3: XeedWallet Escrow"
          subtitle="Deposit the cash gap into escrow. Funds only released when both title deeds are officially transferred."
        >
          {!gapEGP || gapEGP === 0 ? (
            <p className="text-xs font-bold text-green-700 bg-green-50 rounded-lg py-2 text-center">✅ No cash gap — escrow not required</p>
          ) : match.xeedWalletEscrowReference ? (
            <p className="text-xs font-bold text-green-700 bg-green-50 rounded-lg py-2 text-center">✅ Escrow active — funds secured</p>
          ) : (
            <>
              <div className="text-xs text-gray-600 mb-2 space-y-0.5">
                <div className="flex justify-between"><span>Escrow amount:</span><span className="font-bold">{Number(gapEGP).toLocaleString()} EGP</span></div>
                <div className="flex justify-between"><span>Escrow fee ({escrowFeePercent}%):</span><span className="font-bold">{escrowFee.toLocaleString()} EGP</span></div>
              </div>
              <button className="w-full font-bold text-xs py-2.5 rounded-lg text-white flex items-center justify-center gap-1.5 transition-colors"
                style={{ background: "#F59E0B" }}>
                🔒 Deposit via XeedWallet
              </button>
            </>
          )}
        </StepCard>
      </div>
    </div>
  );
}