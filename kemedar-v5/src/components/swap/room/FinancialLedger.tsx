"use client";
// @ts-nocheck
import { apiClient } from "@/lib/api-client";
import { useState } from "react";

export default function FinancialLedger({
  match, isUserA, userId,
  pendingOfferFromOther, myLatestOffer, agreedOffer,
  onOpenCounter, onRefresh
}) {
  const [accepting, setAccepting] = useState(false);
  const [agreeing, setAgreeing] = useState(false);

  const myValueEGP = isUserA ? match.propertyAValueEGP : match.propertyBValueEGP;
  const theirValueEGP = isUserA ? match.propertyBValueEGP : match.propertyAValueEGP;
  const aiGap = match.valuationGapEGP;
  const iPayGap = match.gapPayerUserId === userId;

  const handleAcceptOffer = async () => {
    setAccepting(true);
    await apiClient.post("/api/v1/ai/submitCounterOffer", {
      matchId: match.id,
      proposedGapEGP: pendingOfferFromOther.proposedGapEGP,
      proposedGapDirection: pendingOfferFromOther.proposedGapDirection,
      accepting: true,
    });
    onRefresh();
    setAccepting(false);
  };

  const handleAgreeTerms = async () => {
    setAgreeing(true);
    await apiClient.post("/api/v1/ai/agreeToTerms", {
      matchId: match.id,
      agreedGapEGP: agreedOffer?.proposedGapEGP || aiGap || 0,
    });
    onRefresh();
    setAgreeing(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderTop: "4px solid #7C3AED" }}>
      <div className="p-5">
        <h3 className="font-black text-gray-900 text-base flex items-center gap-2 mb-0.5">⚖️ The Financial Ledger</h3>
        <p className="text-xs text-gray-500 mb-4">Both parties must agree on the gap amount</p>

        {/* Ledger table */}
        <div className="bg-gray-50 rounded-xl p-4 mb-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Property A ({isUserA ? "Yours" : "Theirs"}) — AI Estimate:</span>
              <span className="font-bold text-gray-900">{myValueEGP ? `${Number(isUserA ? myValueEGP : theirValueEGP).toLocaleString()} EGP` : "—"}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Property B ({isUserA ? "Theirs" : "Yours"}) — AI Estimate:</span>
              <span className="font-bold text-gray-900">{theirValueEGP ? `${Number(isUserA ? theirValueEGP : myValueEGP).toLocaleString()} EGP` : "—"}</span>
            </div>
            <div className="border-t border-gray-200 pt-2 flex justify-between items-center">
              <span className="text-gray-700 font-bold">AI-Calculated Gap:</span>
              <span className="font-black text-xl text-orange-600">
                {aiGap ? `${Number(aiGap).toLocaleString()} EGP` : "Equal Swap"}
              </span>
            </div>
            {aiGap > 0 && (
              <p className="text-xs text-gray-500">
                {iPayGap ? "You pay" : "You receive"} this amount
              </p>
            )}
          </div>
        </div>

        {/* AGREED state */}
        {match.status === "terms_agreed" || agreedOffer ? (
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4 text-center">
            <p className="text-2xl mb-2">✅</p>
            <p className="font-black text-green-800 text-lg mb-1">Both Parties Agreed!</p>
            <p className="text-green-700 font-bold text-sm mb-1">
              Gap amount locked at: {(agreedOffer?.proposedGapEGP || match.agreedGapEGP) ? `${Number(agreedOffer?.proposedGapEGP || match.agreedGapEGP).toLocaleString()} EGP` : "Equal Swap"}
            </p>
            <p className="text-xs text-green-600">{iPayGap ? "You pay" : "You receive"} this amount</p>
            <p className="text-xs text-gray-500 mt-2">Proceed to secure the swap below →</p>
          </div>
        ) : pendingOfferFromOther ? (
          /* Pending offer from other party */
          <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4 mb-3">
            <p className="text-xs font-bold text-amber-600 uppercase tracking-wider mb-2">⚡ Offer Received</p>
            <p className="font-black text-gray-900 text-lg mb-1">
              Party {pendingOfferFromOther.offeredByUserId === match.userAId ? "A" : "B"} proposed: {Number(pendingOfferFromOther.proposedGapEGP).toLocaleString()} EGP
            </p>
            <p className="text-sm text-gray-600 mb-4">
              {pendingOfferFromOther.proposedGapDirection === "equal" ? "Equal swap — no payment" :
               pendingOfferFromOther.proposedGapDirection === "a_pays_b" ? "Party A pays Party B" : "Party B pays Party A"}
            </p>
            <div className="flex gap-2">
              <button
                onClick={handleAgreeTerms}
                disabled={agreeing}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
              >
                {agreeing ? "Accepting..." : "✅ Accept This Offer"}
              </button>
              <button
                onClick={onOpenCounter}
                className="flex-1 border-2 border-[#7C3AED] text-[#7C3AED] font-bold py-2.5 rounded-xl text-sm hover:bg-purple-50 transition-colors"
              >
                ✏️ Counter-Offer
              </button>
            </div>
          </div>
        ) : (
          /* No agreement yet */
          <div>
            <p className="text-sm text-gray-500 text-center mb-3">Waiting for both parties to agree</p>
            {myLatestOffer && (
              <p className="text-xs text-gray-400 text-center mb-1">
                Your latest offer: <span className="font-bold text-gray-700">{Number(myLatestOffer.proposedGapEGP).toLocaleString()} EGP</span> (pending)
              </p>
            )}
            <button
              onClick={onOpenCounter}
              className="w-full border-2 border-[#7C3AED] text-[#7C3AED] font-bold py-2.5 rounded-xl text-sm hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
              ✏️ Make a Counter-Offer
            </button>
          </div>
        )}
      </div>
    </div>
  );
}