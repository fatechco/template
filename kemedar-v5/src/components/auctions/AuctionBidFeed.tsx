"use client";
// @ts-nocheck
import { useEffect, useRef } from "react";

export default function AuctionBidFeed({ auction, bids, isSeller }) {
  const feedRef = useRef(null);

  useEffect(() => {
    if (feedRef.current) {
      feedRef.current.scrollTop = 0;
    }
  }, [bids]);

  const sortedBids = [...(bids || [])].sort((a, b) => new Date(b.bidPlacedAt) - new Date(a.bidPlacedAt));

  if (!sortedBids.length) {
    return <p className="text-center text-gray-400 py-8">No bids placed yet</p>;
  }

  return (
    <div
      ref={feedRef}
      className="overflow-y-auto max-h-80 rounded-xl border border-gray-100 bg-gray-50 divide-y divide-gray-100"
    >
      {sortedBids.map((bid, i) => {
        const isTop = i === 0;
        return (
          <div
            key={bid.id}
            className={`flex items-center gap-4 px-4 py-3 ${isTop ? "bg-red-50" : ""}`}
          >
            {/* Sequence */}
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
              isTop ? "bg-red-600 text-white" : "bg-gray-200 text-gray-600"
            }`}>
              {bid.bidSequenceNumber || sortedBids.length - i}
            </div>

            {/* Bid info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className={`font-black text-base ${isTop ? "text-red-600" : "text-gray-900"}`}>
                  {Number(bid.bidAmountEGP).toLocaleString()} EGP
                </span>
                {bid.isAutoBid && (
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-1.5 py-0.5 rounded">🤖 Auto</span>
                )}
                {bid.bidType === "buy_now" && (
                  <span className="text-[10px] bg-yellow-100 text-yellow-700 font-bold px-1.5 py-0.5 rounded">⚡ Buy Now</span>
                )}
                {isTop && (
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded">🏆 Current Top</span>
                )}
                {bid.wasExtended && (
                  <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-1.5 py-0.5 rounded">⏱ +{bid.extensionMinutesAdded}m</span>
                )}
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                {isSeller ? `Bidder (${bid.bidderUserId?.slice(0, 8)}…)` : "Anonymous bidder"} ·{" "}
                {new Date(bid.bidPlacedAt).toLocaleTimeString()}
              </p>
            </div>

            {/* Amount delta */}
            {i < sortedBids.length - 1 && (
              <div className="text-right flex-shrink-0">
                <p className="text-xs text-green-600 font-bold">
                  +{Number(bid.bidAmountEGP - sortedBids[i + 1].bidAmountEGP).toLocaleString()}
                </p>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}