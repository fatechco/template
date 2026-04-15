"use client";
// @ts-nocheck
import { useState } from "react";
import { X, CheckCircle, Loader2, Handshake } from "lucide-react";

function fmt(n) { return n ? Number(n).toLocaleString() : "—"; }

const NEXT_STEPS = [
  { icon: "📄", title: "Sign Memorandum of Understanding", subtitle: "Both parties sign digital MOU" },
  { icon: "💳", title: "Buyer deposits earnest money (10%)", subtitle: "Via Kemedar Escrow™ within 48 hours" },
  { icon: "📅", title: "Schedule property inspection", subtitle: "Within 7 days of acceptance" },
  { icon: "🏛️", title: "Legal documentation & title transfer", subtitle: "Connect with a lawyer" },
  { icon: "🔑", title: "Final payment & keys handover", subtitle: "On agreed closing date" },
];

export default function DealAcceptanceModal({ offer, session, onConfirm, onClose }) {
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  const listedPrice = session?.listedPrice || 0;
  const savings = listedPrice - offer.offerAmount;
  const savingsPct = listedPrice ? Math.round((savings / listedPrice) * 100) : 0;

  const handleConfirm = async () => {
    setLoading(true);
    await onConfirm();
    setLoading(false);
    setConfirmed(true);
  };

  if (confirmed) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 text-center">
        <div className="text-7xl mb-4">🎉</div>
        <h2 className="font-black text-3xl text-gray-900 mb-2">Deal Agreed!</h2>
        <p className="text-gray-500 mb-6">Congratulations to both parties</p>
        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-6 space-y-2 text-sm">
          <div className="flex justify-between"><span className="text-gray-500">Agreed Price</span><span className="font-black text-green-600 text-lg">{fmt(offer.offerAmount)} EGP</span></div>
          {savings > 0 && <div className="flex justify-between"><span className="text-gray-500">Savings from listed</span><span className="font-black text-green-600">-{savingsPct}%</span></div>}
          {offer.paymentMethod && <div className="flex justify-between"><span className="text-gray-500">Payment</span><span className="font-semibold capitalize">{offer.paymentMethod}</span></div>}
        </div>
        <button onClick={onClose} className="w-full bg-orange-500 text-white font-black py-3 rounded-xl">
          View Deal Room →
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="font-black text-gray-900 text-xl">🎉 Accepting This Offer</h2>
            <p className="text-xs text-gray-400 mt-0.5">Review deal terms before confirming</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center">
            <X size={16} />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Deal Summary */}
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 space-y-2">
            <p className="text-xs font-black text-green-600 uppercase tracking-wide">Deal Summary</p>
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Agreed Price</span>
                <span className="font-black text-green-700 text-lg">{fmt(offer.offerAmount)} EGP</span>
              </div>
              {savings > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Below asking</span>
                  <span className="font-bold text-green-600">-{savingsPct}% ({fmt(savings)} EGP)</span>
                </div>
              )}
              {offer.paymentMethod && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Payment</span>
                  <span className="font-semibold capitalize">{offer.paymentMethod}</span>
                </div>
              )}
              {offer.paymentTimeline && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Timeline</span>
                  <span className="font-semibold">{offer.paymentTimeline}</span>
                </div>
              )}
              {session?.propertySnapshot?.title && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Property</span>
                  <span className="font-semibold text-right max-w-[200px] truncate">{session.propertySnapshot.title}</span>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          <div>
            <p className="text-xs font-black text-gray-600 uppercase tracking-wide mb-3">Next Steps</p>
            <div className="space-y-2.5">
              {NEXT_STEPS.map((step, i) => (
                <div key={i} className="flex items-start gap-3 bg-gray-50 rounded-xl px-3 py-2.5">
                  <span className="text-lg flex-shrink-0 mt-0.5">{step.icon}</span>
                  <div>
                    <p className="text-sm font-bold text-gray-800">{i + 1}. {step.title}</p>
                    <p className="text-xs text-gray-500">{step.subtitle}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FO Facilitation offer */}
          <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
            <p className="text-sm font-black text-gray-800 mb-1">🤝 Need Help with Next Steps?</p>
            <p className="text-xs text-gray-500 mb-3">A Franchise Owner can facilitate the MOU, escrow, and inspection coordination.</p>
            <button className="text-xs font-bold text-orange-600 border border-orange-300 px-3 py-1.5 rounded-lg hover:bg-orange-100">
              Request FO Facilitation →
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 pb-6 flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-bold py-3 rounded-xl text-sm">
            Cancel
          </button>
          <button onClick={handleConfirm} disabled={loading}
            className="flex-1 bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2">
            {loading ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
            {loading ? "Confirming..." : "✅ Confirm Acceptance"}
          </button>
        </div>
      </div>
    </div>
  );
}