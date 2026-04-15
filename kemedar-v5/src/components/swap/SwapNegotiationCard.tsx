// @ts-nocheck
import Link from "next/link";

const STATUS_LABELS = {
  both_interested: { label: "Matched — Opening Room", color: "bg-purple-100 text-purple-700" },
  negotiating: { label: "In Negotiation", color: "bg-blue-100 text-blue-700" },
  terms_agreed: { label: "Terms Agreed", color: "bg-green-100 text-green-700" },
  legal_review: { label: "Legal Review", color: "bg-orange-100 text-orange-700" },
  escrow_active: { label: "Escrow Active", color: "bg-teal-100 text-teal-700" },
  completed: { label: "Completed ✅", color: "bg-gray-100 text-gray-600" },
  rejected: { label: "Passed", color: "bg-gray-100 text-gray-400" },
  expired: { label: "Expired", color: "bg-gray-100 text-gray-400" },
};

export default function SwapNegotiationCard({ match, userId, readOnly = false }) {
  const isUserA = match.userAId === userId;
  const statusInfo = STATUS_LABELS[match.status] || { label: match.status, color: "bg-gray-100 text-gray-600" };
  const gap = match.agreedGapEGP || match.valuationGapEGP;
  const iPayGap = match.gapPayerUserId === userId;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center gap-5">
      {/* Thumbnails A ↔ B */}
      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center text-xl">🏠</div>
        <span className="text-gray-400 font-bold text-sm">⇄</span>
        <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center text-xl">🏠</div>
      </div>

      {/* Center info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="font-bold text-gray-900 text-sm">
            {isUserA ? "Party B" : "Party A"}'s Property
          </p>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
        {gap > 0 && (
          <p className="text-sm font-bold text-gray-700">
            Gap: {Number(gap).toLocaleString()} EGP
            <span className="text-xs font-normal text-gray-400 ml-1">
              ({iPayGap ? "you pay" : "you receive"})
            </span>
          </p>
        )}
        <p className="text-xs text-gray-400 mt-1 line-clamp-1">
          Match score: {match.matchScore || "—"}%
        </p>
      </div>

      {/* Action */}
      {!readOnly && (
        <Link
          href={`/dashboard/swap/negotiation/${match.id}`}
          className="flex-shrink-0 flex items-center gap-2 bg-[#7C3AED] hover:bg-purple-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap"
        >
          💬 Enter Negotiation Room →
        </Link>
      )}
    </div>
  );
}