import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { CheckCircle, Clock, FileText, Download, MessageCircle, AlertTriangle } from "lucide-react";
import AuctionDocumentCenter from "@/components/auctions/AuctionDocumentCenter";

const STAGES = [
  {
    id: 1,
    label: "Payment Secured",
    desc: (auction) => `Winner's ${Number(auction.winnerBidEGP).toLocaleString()} EGP held in XeedWallet Escrow`,
    completedAt: (auction) => auction.winnerPaymentCompletedAt,
    checkStatus: (auction) => auction.status !== "awaiting_payment" ? "done" : "pending",
  },
  {
    id: 2,
    label: "Kemework Lawyer Assigned",
    desc: () => "Lawyer has received all auction documents",
    completedAt: () => null,
    checkStatus: (auction) => ["payment_received", "legal_transfer", "completed"].includes(auction.status) ? "done" : "pending",
  },
  {
    id: 3,
    label: "Contract Drafting",
    desc: () => "Dual title transfer contract being drafted · Expected: 2–5 business days",
    completedAt: () => null,
    checkStatus: (auction) => ["legal_transfer", "completed"].includes(auction.status) ? "done" : ["payment_received"].includes(auction.status) ? "active" : "pending",
  },
  {
    id: 4,
    label: "Both Parties Sign",
    desc: () => null,
    completedAt: () => null,
    checkStatus: (auction) => auction.status === "completed" ? "done" : ["legal_transfer"].includes(auction.status) ? "active" : "pending",
  },
  {
    id: 5,
    label: "Title Deed Transfer",
    desc: () => "Official title deed transferred at Egyptian notary / real estate registry",
    completedAt: () => null,
    checkStatus: (auction) => auction.status === "completed" ? "done" : "pending",
  },
  {
    id: 6,
    label: "Escrow Released",
    desc: (auction) => {
      const commission = (auction.winnerBidEGP * 0.02).toFixed(0);
      const net = (auction.winnerBidEGP - parseFloat(commission)).toFixed(0);
      return `Platform commission deducted: ${Number(commission).toLocaleString()} EGP · Seller receives: ${Number(net).toLocaleString()} EGP`;
    },
    completedAt: () => null,
    checkStatus: (auction) => auction.status === "completed" ? "done" : "pending",
  },
  {
    id: 7,
    label: "Handover Complete",
    desc: () => "Keys and property access transferred",
    completedAt: () => null,
    checkStatus: (auction) => auction.status === "completed" ? "done" : "pending",
    hasAction: true,
  },
];

function StageRow({ stage, auction, user, onConfirmHandover }) {
  const status = stage.checkStatus(auction);
  const desc = stage.desc(auction);
  const completedAt = stage.completedAt(auction);
  const isSeller = user?.id === auction.sellerUserId;
  const isWinner = user?.id === auction.winnerUserId;

  return (
    <div className="flex gap-5">
      {/* Icon column */}
      <div className="flex flex-col items-center flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
          status === "done" ? "bg-green-600 text-white" :
          status === "active" ? "bg-blue-600 text-white" :
          "bg-gray-200 text-gray-500"
        }`}>
          {status === "done" ? <CheckCircle size={18} /> : status === "active" ? <Clock size={18} /> : stage.id}
        </div>
        {stage.id < 7 && (
          <div className={`w-0.5 h-8 mt-1 ${status === "done" ? "bg-green-400" : "bg-gray-200"}`} />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pb-8">
        <div className="flex items-center gap-2 mb-1">
          <h4 className={`font-black text-base ${status === "done" ? "text-gray-900" : status === "active" ? "text-blue-900" : "text-gray-400"}`}>
            {stage.label}
          </h4>
          {status === "active" && (
            <span className="text-xs bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">In Progress</span>
          )}
        </div>
        {desc && (
          <p className={`text-sm leading-relaxed mb-2 ${status === "done" ? "text-gray-600" : status === "active" ? "text-blue-800" : "text-gray-400"}`}>
            {desc}
          </p>
        )}
        {completedAt && (
          <p className="text-xs text-gray-400">Completed: {new Date(completedAt).toLocaleString()}</p>
        )}

        {/* Stage 2: Lawyer info */}
        {stage.id === 2 && status === "done" && (
          <div className="bg-gray-50 rounded-lg p-3 text-sm mt-2">
            <p className="font-bold">👤 Lawyer Name · ⭐ 4.9</p>
            {auction.kemeworkLegalTaskId && (
              <p className="text-gray-500 text-xs mt-1">Task ID: {auction.kemeworkLegalTaskId}</p>
            )}
          </div>
        )}

        {/* Stage 3: Message lawyer */}
        {stage.id === 3 && status === "active" && (
          <a href="/kemework/tasks" className="inline-flex items-center gap-2 text-blue-600 font-bold text-sm mt-2 hover:underline">
            <MessageCircle size={14} /> Message Lawyer
          </a>
        )}

        {/* Stage 4: Signing status */}
        {stage.id === 4 && status !== "pending" && (
          <div className="space-y-2 mt-2">
            <div className="flex items-center gap-2 text-sm">
              <span className={status === "done" ? "text-green-500" : "text-gray-400"}>{status === "done" ? "✅" : "⏳"}</span>
              <span className="font-medium">Seller signing status: {status === "done" ? "Signed" : "Pending"}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className={status === "done" ? "text-green-500" : "text-gray-400"}>{status === "done" ? "✅" : "⏳"}</span>
              <span className="font-medium">Winner signing status: {status === "done" ? "Signed" : "Pending"}</span>
            </div>
            {status === "active" && (
              <button className="mt-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700">
                View &amp; Sign Contract →
              </button>
            )}
          </div>
        )}

        {/* Stage 7: Confirm handover */}
        {stage.id === 7 && status === "active" && (isSeller || isWinner) && (
          <button
            onClick={onConfirmHandover}
            className="mt-3 px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded-xl text-sm transition-colors"
          >
            Confirm Handover ✅
          </button>
        )}
      </div>
    </div>
  );
}

export default function AuctionTransfer() {
  const { auctionCode } = useParams();
  const [user, setUser] = useState(null);
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => { base44.auth.me().then(setUser); }, []);

  const { data: auction } = useQuery({
    queryKey: ["auction-transfer", auctionCode],
    queryFn: () => base44.entities.PropertyAuction.filter({ auctionCode }).then(r => r[0]),
    enabled: !!auctionCode,
    refetchInterval: 10000,
  });

  if (!auction) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  const isSeller = user?.id === auction.sellerUserId;
  const isWinner = user?.id === auction.winnerUserId;

  if (!isSeller && !isWinner) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-700 font-semibold">Not authorized to view this transfer</p>
        </div>
      </div>
    );
  }

  const isComplete = auction.status === "completed";

  const handleConfirmHandover = async () => {
    await base44.functions.invoke("confirmHandover", { auctionId: auction.id });
    setConfirmed(true);
  };

  const commission = Math.round((auction.winnerBidEGP || 0) * 0.02);
  const sellerNet = (auction.winnerBidEGP || 0) - commission;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-6">
          <h1 className="text-3xl font-black text-gray-900 mb-2">
            ⚖️ Legal Transfer — <span className="text-blue-600">{auctionCode}</span>
          </h1>
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            <span>Property: <strong>{auction.auctionTitle}</strong></span>
            <span>•</span>
            <span>Seller → Winner (parties confirmed)</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        {/* Completion Banner */}
        {isComplete && (
          <div className="bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 text-center text-white">
            <div className="text-7xl mb-4">🏠</div>
            <h2 className="text-3xl font-black mb-2">🎉 Transfer Complete!</h2>
            {isSeller && (
              <p className="text-xl text-green-100">You've sold {auction.auctionTitle}!</p>
            )}
            {isWinner && (
              <p className="text-xl text-green-100">Welcome to your new property!</p>
            )}
          </div>
        )}

        {/* Progress Timeline */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
          <h3 className="font-black text-xl text-gray-900 mb-8">Transfer Progress</h3>
          {STAGES.map((stage) => (
            <StageRow
              key={stage.id}
              stage={stage}
              auction={auction}
              user={user}
              onConfirmHandover={handleConfirmHandover}
            />
          ))}
          {confirmed && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-4 mt-4 text-center">
              <p className="font-bold text-green-700">✅ Handover confirmed by you! Awaiting the other party.</p>
            </div>
          )}
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h3 className="font-black text-lg text-gray-900 mb-4">💰 Financial Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between text-gray-700 py-2 border-b border-gray-100">
              <span>Winning bid</span>
              <span className="font-bold">{Number(auction.winnerBidEGP || 0).toLocaleString()} EGP</span>
            </div>
            <div className="flex justify-between text-gray-700 py-2 border-b border-gray-100">
              <span>Platform commission (2%)</span>
              <span className="font-bold text-red-600">−{Number(commission).toLocaleString()} EGP</span>
            </div>
            <div className="flex justify-between text-gray-900 py-2 font-black text-lg">
              <span>Seller net proceeds</span>
              <span className="text-green-600">{Number(sellerNet).toLocaleString()} EGP</span>
            </div>
          </div>
        </div>

        {/* Document Center */}
        <AuctionDocumentCenter auction={auction} user={user} />
      </div>
    </div>
  );
}