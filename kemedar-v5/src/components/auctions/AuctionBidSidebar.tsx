"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { Gavel, Users, Clock, ShieldCheck, Lock } from "lucide-react";

const STATUS_BADGES = {
  live:         { label: "🔴 LIVE", color: "bg-red-600 text-white animate-pulse" },
  extended:     { label: "🔴 EXTENDED", color: "bg-red-600 text-white animate-pulse" },
  registration: { label: "📋 Registration Open", color: "bg-blue-600 text-white" },
  scheduled:    { label: "📅 Scheduled", color: "bg-gray-600 text-white" },
  ended:        { label: "✅ Ended", color: "bg-green-600 text-white" },
  completed:    { label: "✅ Completed", color: "bg-green-700 text-white" },
  cancelled:    { label: "⛔ Cancelled", color: "bg-gray-400 text-white" },
};

function formatCountdown(ms) {
  if (ms <= 0) return "00:00:00";
  const h = Math.floor(ms / 3600000);
  const m = Math.floor((ms % 3600000) / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export default function AuctionBidSidebar({ auction }) {
  const [remaining, setRemaining] = useState(0);

  useEffect(() => {
    if (!auction?.auctionEndAt) return;
    const endTime = new Date(auction.finalEndAt || auction.auctionEndAt).getTime();
    const tick = () => setRemaining(Math.max(0, endTime - Date.now()));
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [auction?.auctionEndAt, auction?.finalEndAt]);

  if (!auction) return null;

  const badge = STATUS_BADGES[auction.status] || STATUS_BADGES.scheduled;
  const isLive = auction.status === "live" || auction.status === "extended";
  const isEnded = ["ended", "completed", "cancelled", "reserve_not_met", "awaiting_payment", "payment_received", "legal_transfer", "failed"].includes(auction.status);
  const hasBids = auction.totalBids > 0;
  const code = auction.auctionCode || "KBA-??????";

  return (
    <div className="rounded-2xl overflow-hidden border-2 border-red-200 shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Gavel size={16} className="text-white" />
          <span className="font-black text-white text-sm">KemedarBid™</span>
        </div>
        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${badge.color}`}>{badge.label}</span>
      </div>

      <div className="bg-white p-4 flex flex-col gap-3">
        {/* Auction Code */}
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400 font-medium">Auction Code</span>
          <span className="font-black text-sm text-gray-900 tracking-wider">{code}</span>
        </div>

        {/* Current Bid or Starting Price */}
        <div className="bg-red-50 rounded-xl p-3 text-center">
          <p className="text-[10px] text-gray-500 font-medium mb-0.5">
            {hasBids ? "Current Highest Bid" : "Starting At"}
          </p>
          <p className="text-2xl font-black text-red-700">
            {Number(hasBids ? auction.currentHighestBidEGP : auction.startingPriceEGP).toLocaleString()} EGP
          </p>
        </div>

        {/* Countdown */}
        {!isEnded && (
          <div className="flex items-center justify-center gap-2 bg-gray-900 rounded-xl py-3 px-4">
            <Clock size={14} className="text-red-400" />
            <span className="font-mono font-black text-white text-lg tracking-widest">
              {formatCountdown(remaining)}
            </span>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="flex items-center justify-center gap-1 text-xs text-gray-400"><Users size={11} /> Bidders</p>
            <p className="font-black text-gray-900 text-sm">{auction.totalRegisteredBidders || 0}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-2 text-center">
            <p className="flex items-center justify-center gap-1 text-xs text-gray-400"><Gavel size={11} /> Bids</p>
            <p className="font-black text-gray-900 text-sm">{auction.totalBids || 0}</p>
          </div>
        </div>

        {/* Reserve status */}
        {auction.auctionType === "reserve" && (
          <div className={`flex items-center justify-center gap-1.5 text-xs font-bold rounded-lg py-2 ${
            auction.reserveMet
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-amber-50 text-amber-700 border border-amber-200"
          }`}>
            {auction.reserveMet
              ? <><ShieldCheck size={13} /> Reserve Met</>
              : <><Lock size={13} /> Reserve Not Met</>}
          </div>
        )}

        {/* CTA */}
        <Link
          href={`/auctions/${code}`}
          className={`flex items-center justify-center gap-2 font-black text-sm py-3 rounded-xl transition-colors ${
            isLive
              ? "bg-red-600 hover:bg-red-700 text-white"
              : "border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
          }`}
        >
          {isLive ? (
            <><Gavel size={14} /> View Live Auction →</>
          ) : isEnded ? (
            <>View Auction Results →</>
          ) : (
            <><>📋 Register to Bid — {Number(auction.buyerDepositEGP || 0).toLocaleString()} EGP</></>
          )}
        </Link>
      </div>
    </div>
  );
}