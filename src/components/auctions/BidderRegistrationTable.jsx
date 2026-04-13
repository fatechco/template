import { useState } from "react";
import { CheckCircle, Clock, Eye } from "lucide-react";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  pending_payment: "bg-yellow-100 text-yellow-700",
  winner: "bg-blue-100 text-blue-700",
  suspended: "bg-red-100 text-red-700",
  refunded: "bg-gray-100 text-gray-500",
  forfeited: "bg-red-200 text-red-800",
};

export default function BidderRegistrationTable({ auction, registrations, bids }) {
  const [expandedBidder, setExpandedBidder] = useState(null);

  const bidsByBidder = {};
  bids?.forEach(b => {
    if (!bidsByBidder[b.bidderUserId]) bidsByBidder[b.bidderUserId] = [];
    bidsByBidder[b.bidderUserId].push(b);
  });

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100">
        <h3 className="font-black text-lg text-gray-900">
          👥 Registered Bidders ({registrations?.length || 0})
        </h3>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 text-left">
              {["#", "Bidder", "KYC", "Proof of Funds", "Deposit", "Bids", "Highest Bid", "Last Active", "Status", ""].map(h => (
                <th key={h} className="px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!registrations?.length ? (
              <tr>
                <td colSpan={10} className="px-4 py-8 text-center text-gray-400">
                  No bidders registered yet
                </td>
              </tr>
            ) : registrations.map((reg, i) => {
              const myBids = bidsByBidder[reg.bidderUserId] || [];
              const highestBid = reg.highestBidPlaced || Math.max(0, ...myBids.map(b => b.bidAmountEGP));
              const lastBid = reg.lastBidAt || myBids[0]?.bidPlacedAt;
              const isWinner = reg.bidderUserId === auction.currentHighestBidderUserId;

              return (
                <tr key={reg.id} className={`border-t border-gray-50 hover:bg-gray-50 ${isWinner ? "bg-green-50" : ""}`}>
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs">#{i + 1}</td>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-bold text-gray-900 text-xs">
                        {isWinner && "🏆 "} Bidder {i + 1}
                      </p>
                      <p className="text-[10px] text-gray-400">{reg.bidderUserId?.slice(0, 8)}…</p>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    {reg.kycVerified
                      ? <CheckCircle size={16} className="text-green-500" />
                      : <Clock size={16} className="text-gray-300" />}
                  </td>
                  <td className="px-4 py-3">
                    {auction.requireBuyerProofOfFunds ? (
                      reg.proofOfFundsUploaded ? (
                        <div className="flex items-center gap-1">
                          {reg.proofOfFundsApprovedByAdmin
                            ? <CheckCircle size={14} className="text-green-500" />
                            : <Clock size={14} className="text-yellow-500" />}
                          <button
                            onClick={() => setExpandedBidder(expandedBidder === reg.id ? null : reg.id)}
                            className="text-blue-600 text-xs font-bold hover:underline flex items-center gap-1"
                          >
                            <Eye size={12} /> Review
                          </button>
                        </div>
                      ) : <span className="text-xs text-gray-400">Not uploaded</span>
                    ) : <span className="text-xs text-gray-400">N/A</span>}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      reg.depositStatus === "held" ? "bg-green-100 text-green-700" :
                      reg.depositStatus === "refunded" ? "bg-gray-100 text-gray-500" :
                      reg.depositStatus === "forfeited" ? "bg-red-100 text-red-700" :
                      "bg-yellow-100 text-yellow-700"
                    }`}>
                      {reg.depositStatus || "pending"}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">
                      {Number(reg.depositAmountEGP).toLocaleString()} EGP
                    </p>
                  </td>
                  <td className="px-4 py-3 font-bold text-gray-900">{myBids.length}</td>
                  <td className="px-4 py-3 font-bold text-red-600">
                    {highestBid > 0 ? `${Number(highestBid).toLocaleString()} EGP` : "—"}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400">
                    {lastBid ? new Date(lastBid).toLocaleTimeString() : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[reg.registrationStatus] || "bg-gray-100 text-gray-600"}`}>
                      {reg.registrationStatus?.replace(/_/g, " ") || "unknown"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button className="text-xs text-gray-400 hover:text-gray-700">Notes</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Expanded proof of funds viewer */}
        {expandedBidder && (() => {
          const reg = registrations.find(r => r.id === expandedBidder);
          if (!reg) return null;
          return (
            <div className="border-t border-gray-100 p-6 bg-blue-50">
              <h4 className="font-bold text-gray-900 mb-3">📄 Proof of Funds Document</h4>
              {reg.proofOfFundsUrl ? (
                <a href={reg.proofOfFundsUrl} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-bold rounded-lg text-sm hover:bg-blue-700">
                  View Document →
                </a>
              ) : <p className="text-gray-500 text-sm">No document URL available</p>}
              <button onClick={() => setExpandedBidder(null)} className="ml-4 text-sm text-gray-500 hover:underline">Close</button>
            </div>
          );
        })()}
      </div>
    </div>
  );
}