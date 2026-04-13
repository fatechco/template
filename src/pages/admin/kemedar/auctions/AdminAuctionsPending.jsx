import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { AlertCircle, Clock } from "lucide-react";

const fmt = (n) => new Intl.NumberFormat("en-EG").format(Math.round(n || 0));

export default function AdminAuctionsPending() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [aiReviews, setAiReviews] = useState({});
  const [expandedId, setExpandedId] = useState(null);
  const [requestingChanges, setRequestingChanges] = useState(null);
  const [rejecting, setRejecting] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await base44.entities.PropertyAuction.filter({ status: "pending_review" }, "created_date", 100);
    setAuctions(data.sort((a, b) => new Date(a.created_date) - new Date(b.created_date)));
    setLoading(false);
  };

  const getAiReview = async (auctionId, startPrice, reservePrice) => {
    if (aiReviews[auctionId]) return aiReviews[auctionId];
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are a Kemedar auction compliance officer. Review this auction for red flags:
Starting Price: ${fmt(startPrice)} EGP
Reserve Price: ${fmt(reservePrice)} EGP
Respond in JSON: { riskLevel: "Low" | "Medium" | "High", findings: ["finding1", "finding2"] }`,
      response_json_schema: {
        type: "object",
        properties: {
          riskLevel: { type: "string" },
          findings: { type: "array", items: { type: "string" } }
        }
      }
    });
    setAiReviews(prev => ({ ...prev, [auctionId]: res }));
    return res;
  };

  const handleApprove = async (auctionId) => {
    await base44.entities.PropertyAuction.update(auctionId, { status: "scheduled" });
    setAuctions(prev => prev.filter(a => a.id !== auctionId));
  };

  const handleRequestChanges = async (auctionId, notes) => {
    await base44.entities.PropertyAuction.update(auctionId, { adminNotes: notes });
    await base44.integrations.Core.SendEmail({
      to: "seller@example.com",
      subject: "Auction Requires Changes",
      body: `Admin requested changes: ${notes}`
    });
    setRequestingChanges(null);
  };

  const handleReject = async (auctionId, reason, notes) => {
    await base44.entities.PropertyAuction.update(auctionId, { status: "cancelled", rejectionReason: reason, adminNotes: notes });
    setAuctions(prev => prev.filter(a => a.id !== auctionId));
    setRejecting(null);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">📋 Auctions Pending Review</h1>
        <p className="text-xs text-gray-500 mt-1">Sorted by submission date (oldest first). Priority flag if starts in less than 48h.</p>
      </div>

      {auctions.length === 0 ? (
        <div className="text-center py-12 text-gray-400"><p>All auctions have been reviewed!</p></div>
      ) : (
        <div className="space-y-4">
          {auctions.map(a => {
            const daysOld = Math.floor((Date.now() - new Date(a.created_date).getTime()) / (24 * 60 * 60 * 1000));
            const startsIn = Math.floor((new Date(a.auctionStartAt) - Date.now()) / (24 * 60 * 60 * 1000));
            const isPriority = startsIn < 2;
            const review = aiReviews[a.id];

            return (
              <div key={a.id} className={`bg-white rounded-2xl border ${isPriority ? "border-red-300 bg-red-50" : "border-gray-100"} shadow-sm p-6`}>
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <img src={a.property?.featured_image || "https://via.placeholder.com/60"} alt="" className="w-16 h-16 rounded-xl object-cover flex-shrink-0" />
                    <div>
                      <p className="font-black text-gray-900">{a.auctionTitle}</p>
                      <p className="text-sm text-gray-500">{a.property?.address}</p>
                      <div className="flex gap-2 mt-1.5">
                        {a.property?.verification_level && <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">✅ Verify Level {a.property.verification_level}</span>}
                        {isPriority && <span className="text-xs bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">⚠️ Starts in {startsIn}d</span>}
                      </div>
                    </div>
                  </div>
                  <div className="text-right text-xs text-gray-500">
                    <p>Submitted {daysOld}d ago</p>
                  </div>
                </div>

                {/* Property Details */}
                <div className="grid grid-cols-2 gap-4 mb-4 pb-4 border-b border-gray-200">
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-1">AUCTION TYPE</p>
                    <p className="text-sm font-bold text-gray-900">{a.auctionType}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-1">STARTING PRICE</p>
                    <p className="text-sm font-bold text-green-700">{fmt(a.startingPriceEGP)} EGP</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-1">RESERVE PRICE</p>
                    <p className="text-sm font-bold text-gray-900">{a.reservePriceEGP ? fmt(a.reservePriceEGP) + " EGP" : "None (Absolute)"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-1">AUCTION DURATION</p>
                    <p className="text-sm font-bold text-gray-900">{Math.floor((new Date(a.auctionEndAt) - new Date(a.auctionStartAt)) / (24 * 60 * 60 * 1000))} days</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-1">SELLER DEPOSIT</p>
                    <p className="text-sm font-bold text-gray-900">{fmt(a.sellerDepositEGP)} EGP</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-bold mb-1">BUYER DEPOSIT</p>
                    <p className="text-sm font-bold text-gray-900">{fmt(a.buyerDepositEGP)} EGP</p>
                  </div>
                </div>

                {/* AI Review */}
                <div className="mb-4 pb-4 border-b border-gray-200">
                  <p className="text-xs text-gray-500 font-bold mb-2">AI RISK ASSESSMENT</p>
                  {review ? (
                    <div className="bg-gray-50 rounded-xl p-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`text-lg ${review.riskLevel === "Low" ? "🟢" : review.riskLevel === "Medium" ? "🟡" : "🔴"}`}></span>
                        <span className="font-bold text-gray-900">Risk Level: {review.riskLevel}</span>
                      </div>
                      <ul className="text-xs text-gray-600 space-y-1">
                        {review.findings?.map((f, i) => <li key={i}>• {f}</li>)}
                      </ul>
                    </div>
                  ) : (
                    <button onClick={() => getAiReview(a.id, a.startingPriceEGP, a.reservePriceEGP)} className="text-xs text-blue-600 font-bold hover:underline">
                      Run AI Review →
                    </button>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button onClick={() => handleApprove(a.id)} className="flex-1 py-2.5 rounded-xl bg-green-600 text-white font-bold text-sm hover:bg-green-700">
                    ✅ Approve Auction
                  </button>
                  <button onClick={() => setRequestingChanges(a.id)} className="px-4 py-2.5 rounded-xl bg-orange-600 text-white font-bold text-sm hover:bg-orange-700">
                    ✏️ Changes
                  </button>
                  <button onClick={() => setRejecting(a.id)} className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700">
                    ❌ Reject
                  </button>
                </div>

                {/* Request Changes Modal */}
                {requestingChanges === a.id && (
                  <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-xl">
                    <textarea placeholder="Notes for seller..." className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-20 mb-3" id={`changes-${a.id}`} />
                    <div className="flex gap-2">
                      <button onClick={() => handleRequestChanges(a.id, document.getElementById(`changes-${a.id}`)?.value || "")} className="flex-1 py-2 rounded-lg bg-orange-600 text-white font-bold text-sm">
                        Send Request
                      </button>
                      <button onClick={() => setRequestingChanges(null)} className="flex-1 py-2 rounded-lg bg-gray-300 text-gray-700 font-bold text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {/* Reject Modal */}
                {rejecting === a.id && (
                  <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <select id={`reject-reason-${a.id}`} className="w-full border border-gray-200 rounded-lg p-2 text-sm mb-3">
                      <option value="">Select rejection reason...</option>
                      <option value="mismatched_pricing">Mismatched Pricing</option>
                      <option value="seller_history">Seller History Issues</option>
                      <option value="fraudulent_activity">Suspected Fraud</option>
                      <option value="policy_violation">Policy Violation</option>
                      <option value="other">Other</option>
                    </select>
                    <textarea placeholder="Optional notes..." className="w-full border border-gray-200 rounded-lg p-3 text-sm resize-none h-20 mb-3" id={`reject-notes-${a.id}`} />
                    <div className="flex gap-2">
                      <button onClick={() => handleReject(a.id, document.getElementById(`reject-reason-${a.id}`)?.value || "", document.getElementById(`reject-notes-${a.id}`)?.value || "")} className="flex-1 py-2 rounded-lg bg-red-600 text-white font-bold text-sm">
                        Confirm Rejection
                      </button>
                      <button onClick={() => setRejecting(null)} className="flex-1 py-2 rounded-lg bg-gray-300 text-gray-700 font-bold text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}