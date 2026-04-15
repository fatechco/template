"use client";
// @ts-nocheck
import { useState, useEffect } from "react";

const Countdown = ({ endAt }) => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = new Date(endAt) - new Date();
      if (diff <= 0) { setTime("00:00:00"); return; }
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      setTime(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endAt]);
  return <span className="font-mono text-red-600 text-3xl font-black tabular-nums">{time}</span>;
};

export default function SellerKPICards({ auction, registrations, bids }) {
  const isLive = ["live", "extended"].includes(auction?.status);
  const activeBidders = new Set(bids?.filter(b => b.bidPlacedAt > Date.now() - 30 * 60 * 1000).map(b => b.bidderUserId)).size;
  const uniqueBidders = new Set(bids?.map(b => b.bidderUserId)).size;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Current Highest Bid */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">💰 Current Highest Bid</p>
        <p className="text-3xl font-black text-red-600">
          {Number(auction?.currentHighestBidEGP || 0).toLocaleString()}
        </p>
        <p className="text-sm text-gray-500 mt-1 font-bold">EGP</p>
        <p className="text-xs text-gray-400 mt-1">
          {auction?.currentHighestBidderUserId ? "by active bidder" : "No bids yet"}
        </p>
      </div>

      {/* Registered Bidders */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">👥 Registered Bidders</p>
        <p className="text-3xl font-black text-gray-900">
          {registrations?.length || 0}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          {activeBidders} actively bidding
        </p>
      </div>

      {/* Total Bids */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">🔨 Total Bids Placed</p>
        <p className="text-3xl font-black text-gray-900">
          {auction?.totalBids || bids?.length || 0}
        </p>
        <p className="text-sm text-gray-500 mt-1">
          from {uniqueBidders} unique bidders
        </p>
      </div>

      {/* Time Remaining */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">⏰ Time Remaining</p>
        {isLive && auction?.auctionEndAt ? (
          <Countdown endAt={auction.auctionEndAt} />
        ) : (
          <p className="text-2xl font-black text-gray-500 capitalize">
            {(auction?.status || "").replace(/_/g, " ")}
          </p>
        )}
        {auction?.extensionsUsed > 0 && (
          <p className="text-xs text-purple-600 font-bold mt-1">⚡ Extended {auction.extensionsUsed}×</p>
        )}
      </div>
    </div>
  );
}