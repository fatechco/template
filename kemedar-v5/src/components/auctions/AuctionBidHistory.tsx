"use client";
// @ts-nocheck
import { useEffect, useRef } from "react";
import { formatDistanceToNow } from "date-fns";

const BidRow = ({ bid, isNew }) => {
  const initials = (bid.bidderUserId || "??").slice(0, 2).toUpperCase();

  return (
    <div
      className={`flex items-center justify-between py-3 px-4 rounded-xl mb-2 transition-all ${
        isNew ? "bg-red-50 border border-red-100 animate-pulse" : "bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-red-700 font-black text-sm flex-shrink-0">
          {initials}
        </div>
        <div>
          <p className="font-bold text-gray-900 text-sm">
            Bidder {initials}
          </p>
          <p className="text-xs text-gray-500">
            {bid.bidPlacedAt
              ? formatDistanceToNow(new Date(bid.bidPlacedAt), { addSuffix: true })
              : "Unknown time"}{" "}
            · Bid #{bid.bidSequenceNumber}
          </p>
        </div>
      </div>

      <div className="flex flex-col items-end gap-1">
        <p className="font-black text-gray-900">
          {Number(bid.bidAmountEGP).toLocaleString()} EGP
        </p>
        <div className="flex gap-1">
          {bid.isWinning && (
            <span className="bg-red-600 text-white px-2 py-0.5 rounded-full text-xs font-black">
              HIGHEST BID
            </span>
          )}
          {bid.wasExtended && (
            <span className="bg-purple-600 text-white px-2 py-0.5 rounded-full text-xs font-black">
              ⚡ +{bid.extensionMinutesAdded}min
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default function AuctionBidHistory({ bids, auction }) {
  const containerRef = useRef(null);

  if (auction.auctionType === "sealed") {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-black text-gray-900 mb-4">
          🔨 Bid History ({bids.length} bids)
        </h3>
        <div className="bg-gray-100 rounded-xl p-6 text-center">
          <p className="text-3xl mb-4">🔒</p>
          <p className="text-gray-900 font-bold mb-2">Bids are sealed until auction ends</p>
          <p className="text-gray-600 text-sm">
            {auction.totalBids || 0} bids from {auction.totalUniqueBidders || 0} registered bidders
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-black text-gray-900 mb-4">
        🔨 Bid History ({bids.length} bids)
      </h3>

      {bids.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p className="text-4xl mb-3">🔨</p>
          <p className="font-bold">No bids yet. Be the first!</p>
        </div>
      ) : (
        <div className="max-h-96 overflow-y-auto" ref={containerRef}>
          {bids.map((bid, idx) => (
            <BidRow key={bid.id} bid={bid} isNew={idx === 0} />
          ))}
        </div>
      )}
    </div>
  );
}