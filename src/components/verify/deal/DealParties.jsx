import { useState } from "react";
import { base44 } from "@/api/base44Client";
import { CheckCircle2, Clock } from "lucide-react";

function PartyCard({ label, userId, isCurrent, canSign, deal, onSign }) {
  const [signing, setSigning] = useState(false);
  const signed = label === "Seller" ? deal?.sellerStrategy?.signed : deal?.buyerStrategy?.signed;
  const signedAt = label === "Seller" ? deal?.sellerStrategy?.signedAt : deal?.buyerStrategy?.signedAt;

  const handleSign = async () => {
    setSigning(true);
    await onSign(label.toLowerCase());
    setSigning(false);
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">{label}</p>
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-black text-base flex-shrink-0">
          {label[0]}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">{label === "Seller" ? "Property Seller" : "Property Buyer"}</p>
          {userId && <p className="font-mono text-[10px] text-gray-400">KW-{userId.slice(0, 8)}...</p>}
        </div>
      </div>

      <div className={`flex items-center gap-2 text-xs px-3 py-2 rounded-lg mb-3 ${signed ? "bg-green-50 text-green-700" : "bg-gray-50 text-gray-500"}`}>
        {signed ? <CheckCircle2 size={13} className="flex-shrink-0" /> : <Clock size={13} className="flex-shrink-0" />}
        <span>{signed ? `Signed — ${signedAt ? new Date(signedAt).toLocaleDateString() : "✓"}` : "Awaiting signature"}</span>
      </div>

      {canSign && !signed && (
        <button onClick={handleSign} disabled={signing} className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black py-2 rounded-xl text-xs transition-colors disabled:bg-gray-200 disabled:text-gray-400">
          {signing ? "Signing..." : "✍️ Sign Deal"}
        </button>
      )}
    </div>
  );
}

export default function DealParties({ deal, user, property, onRefresh }) {
  const isSeller = user?.id === deal?.sellerId;
  const isBuyer = user?.id === deal?.buyerId;

  const handleSign = async (role) => {
    const now = new Date().toISOString();
    const update = role === "seller"
      ? { sellerStrategy: { ...deal.sellerStrategy, signed: true, signedAt: now } }
      : { buyerStrategy: { ...deal.buyerStrategy, signed: true, signedAt: now } };
    await base44.entities.NegotiationSession.update(deal.id, update);
    onRefresh();
  };

  return (
    <>
      <PartyCard
        label="Seller"
        userId={deal?.sellerId}
        isCurrent={isSeller}
        canSign={isSeller && deal?.status === "offer_sent"}
        deal={deal}
        onSign={handleSign}
      />
      <PartyCard
        label="Buyer"
        userId={deal?.buyerId}
        isCurrent={isBuyer}
        canSign={isBuyer && deal?.status === "offer_sent"}
        deal={deal}
        onSign={handleSign}
      />
      {/* Deal Terms */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">Deal Terms</p>
        <div className="flex flex-col gap-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Agreed Price</span>
            <span className="font-bold text-gray-900">{deal?.agreedPrice ? `${Number(deal.agreedPrice).toLocaleString()} ${deal.listedCurrency || "EGP"}` : `${Number(deal.currentOfferAmount || deal.listedPrice || 0).toLocaleString()} EGP`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Payment</span>
            <span className="font-bold text-gray-900 capitalize">{deal?.agreedPaymentMethod || "—"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Handover</span>
            <span className="font-bold text-gray-900">{deal?.agreedTimeline || "—"}</span>
          </div>
          {deal?.agreedConditions && (
            <div className="pt-2 border-t border-gray-100">
              <span className="text-gray-500 text-xs block mb-1">Special Conditions</span>
              <p className="text-gray-700 text-xs leading-relaxed">{deal.agreedConditions}</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}