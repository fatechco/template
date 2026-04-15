"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const Countdown = ({ endAt, onTimeChange }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const update = () => {
      const diff = new Date(endAt) - new Date();
      if (diff <= 0) {
        setTime("00:00:00");
        return;
      }
      const h = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const m = Math.floor((diff / (1000 * 60)) % 60);
      const s = Math.floor((diff / 1000) % 60);
      const formatted = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
      setTime(formatted);
      onTimeChange && onTimeChange(diff);
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, [endAt]);

  return <span className="font-mono">{time}</span>;
};

export default function BiddingAuctionCard({ auction, registration }) {
  const isWinning = auction.currentHighestBidderUserId === registration.bidderUserId;
  const isOutbid = !isWinning && registration.highestBidPlaced > 0;
  const [timeRemaining, setTimeRemaining] = useState(null);
  const isLow = timeRemaining && timeRemaining < 10 * 60 * 1000;
  const isVeryLow = timeRemaining && timeRemaining < 60 * 1000;

  const statusColor = auction.status === "ended" 
    ? "bg-gray-900"
    : isWinning
    ? "bg-green-600"
    : isOutbid
    ? "bg-red-600"
    : "bg-gray-700";

  const statusLabel = auction.status === "ended"
    ? "Ended"
    : isWinning
    ? "🏆 WINNING"
    : isOutbid
    ? "⚡ OUTBID — Act Now!"
    : "In Progress";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      {/* Status strip */}
      <div className={`${statusColor} text-white font-bold text-xs py-2 px-4`}>
        {statusLabel}
      </div>

      <div className="p-5 flex gap-4">
        {/* Left: Property thumbnail */}
        <div className="flex-shrink-0">
          <img
            src={auction.property?.featured_image || "https://images.unsplash.com/photo-1512917774080-9b274b3d0f87?w=100&h=100&fit=crop"}
            alt=""
            className="w-20 h-20 rounded-lg object-cover"
          />
        </div>

        {/* Right: Details */}
        <div className="flex-1">
          <h4 className="font-bold text-gray-900 mb-1">{auction.auctionTitle}</h4>
          <p className="text-xs text-gray-500 mb-3">📍 {auction.property?.city_name || "Location"}</p>

          {/* Status + Time */}
          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-10px text-gray-500 font-bold mb-0.5">Your last bid</p>
              <p className="font-black text-gray-900">
                {Number(registration.highestBidPlaced || 0).toLocaleString()} EGP
              </p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2">
              <p className="text-10px text-gray-500 font-bold mb-0.5">Current bid</p>
              <p className="font-black text-gray-900">
                {Number(auction.currentHighestBidEGP || 0).toLocaleString()} EGP
              </p>
            </div>
          </div>

          {/* Outbid alert */}
          {isOutbid && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2 mb-3 text-center">
              <p className="text-xs font-black text-red-700">
                {Number(auction.currentHighestBidEGP - registration.highestBidPlaced).toLocaleString()} EGP ahead
              </p>
            </div>
          )}

          {/* Time left */}
          <div className="mb-3">
            <p className="text-10px text-gray-500 font-bold mb-1">Time remaining</p>
            <p className={`text-xl font-black tabular-nums ${isVeryLow ? "text-red-600" : isLow ? "text-orange-600" : "text-gray-900"}`}>
              <Countdown endAt={auction.auctionEndAt} onTimeChange={setTimeRemaining} />
            </p>
          </div>

          {/* Auto-bid */}
          {registration.hasAutoBid && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-2 mb-3 text-left">
              <p className="text-xs font-bold text-blue-900">
                🤖 Auto-bid up to {Number(registration.autoBidMaxEGP).toLocaleString()} EGP
              </p>
              {auction.currentHighestBidEGP >= registration.autoBidMaxEGP && (
                <p className="text-xs text-orange-600 font-bold mt-1">⚠️ Limit reached</p>
              )}
            </div>
          )}

          {/* Deposit */}
          <p className="text-xs text-gray-600 mb-3">
            🔒 {Number(registration.depositAmountEGP).toLocaleString()} EGP held in escrow
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <Link
              href={`/auctions/${auction.auctionCode}`}
              className="flex-1 px-3 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              🔨 Go Live <ChevronRight size={14} />
            </Link>
            <button className="px-3 py-2.5 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 font-bold text-xs rounded-lg transition-colors">
              🤖 Auto-Bid
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}