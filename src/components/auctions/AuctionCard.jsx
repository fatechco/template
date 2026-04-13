import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Eye } from "lucide-react";

const AuctionCountdown = ({ endAt, status }) => {
  const [time, setTime] = useState("");

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(endAt);
      const diff = end - now;

      if (diff <= 0) {
        setTime("Ended");
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTime(`${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [endAt]);

  return (
    <div className="text-white">
      <div className="font-mono text-2xl font-black">{time}</div>
      <div className="text-xs text-gray-300">Time Remaining</div>
    </div>
  );
};

const StatusBadge = ({ status, startAt, endAt, registrationCloseAt }) => {
  const now = new Date();

  if (status === "live") {
    return (
      <div className="absolute top-3 left-3 bg-red-600 text-white px-3 py-1.5 rounded-full text-xs font-black flex items-center gap-1.5">
        <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>
        🔴 LIVE
      </div>
    );
  }

  if (status === "extended") {
    return (
      <div className="absolute top-3 left-3 bg-purple-600 text-white px-3 py-1.5 rounded-full text-xs font-black">
        ⚡ EXTENDED
      </div>
    );
  }

  if (status === "registration") {
    return (
      <div className="absolute top-3 left-3 bg-blue-600 text-white px-3 py-1.5 rounded-full text-xs font-black">
        📋 Registration Open
      </div>
    );
  }

  if (status === "scheduled") {
    const daysUntil = Math.ceil((new Date(startAt) - now) / (24 * 60 * 60 * 1000));
    return (
      <div className="absolute top-3 left-3 bg-gray-600 text-white px-3 py-1.5 rounded-full text-xs font-black">
        📅 Starting in {daysUntil}d
      </div>
    );
  }

  if (status === "ended") {
    return (
      <div className="absolute top-3 left-3 bg-gray-700 text-gray-300 px-3 py-1.5 rounded-full text-xs font-black">
        ✅ Ended
      </div>
    );
  }

  return null;
};

export default function AuctionCard({ auction }) {
  const property = auction.property || {};

  return (
    <Link to={`/auctions/${auction.auctionCode}`}>
      <div className="bg-white rounded-[20px] shadow hover:shadow-lg transition-all overflow-hidden group cursor-pointer h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-48 bg-gray-200 overflow-hidden">
          <img
            src={property.featured_image || "https://images.unsplash.com/photo-1512917774080-9b274b3d0f87?w=400&h=300&fit=crop"}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />

          {/* Status Badge */}
          <StatusBadge 
            status={auction.status}
            startAt={auction.auctionStartAt}
            endAt={auction.auctionEndAt}
            registrationCloseAt={auction.registrationCloseAt}
          />

          {/* Verify Pro Badge (top right) */}
          {property.verification_level && (
            <div className="absolute top-3 right-3 bg-green-600 text-white px-2 py-1.5 rounded-full text-xs font-black">
              ✅ Level {property.verification_level}
            </div>
          )}

          {/* Countdown Overlay (bottom) */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4 justify-center">
            {(auction.status === "live" || auction.status === "extended") && (
              <AuctionCountdown endAt={auction.auctionEndAt} status={auction.status} />
            )}
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 flex flex-col p-4">
          {/* Title & Location */}
          <h3 className="font-bold text-15px text-gray-900 line-clamp-2 mb-1">
            {property.title || "Property"}
          </h3>
          <p className="text-12px text-gray-500 flex items-center gap-1 mb-3">
            📍 {property.city_name || "Location"}, {property.district_id || "District"}
          </p>

          {/* Current Bid */}
          <div className="mb-3">
            <p className="text-11px text-gray-600 mb-0.5">Current Bid:</p>
            <p className="text-20px font-black text-red-600">
              {auction.currentHighestBidEGP
                ? `${Number(auction.currentHighestBidEGP).toLocaleString()} EGP`
                : `Starting at ${Number(auction.startingPriceEGP).toLocaleString()} EGP`}
            </p>
          </div>

          {/* Bid Stats */}
          <p className="text-11px text-gray-600 mb-3">
            🔨 {auction.totalBids || 0} bids · 👥 {auction.totalUniqueBidders || 0} bidders
          </p>

          {/* Reserve Status */}
          <div className="mb-3">
            {auction.reservePriceEGP && !auction.reserveMet && (
              <p className="text-11px font-bold text-orange-600">🔒 Reserve Not Met</p>
            )}
            {auction.reservePriceEGP && auction.reserveMet && (
              <p className="text-11px font-bold text-green-600">✅ Reserve Met</p>
            )}
            {!auction.reservePriceEGP && (
              <p className="text-11px font-bold text-blue-600">⚡ Absolute — No Reserve</p>
            )}
          </div>

          {/* Deposit Tag */}
          <p className="text-11px text-gray-600 mb-4">
            Deposit to bid: {Number(auction.buyerDepositEGP).toLocaleString()} EGP
          </p>

          {/* Footer */}
          <div className="border-t border-gray-100 pt-3 mt-auto flex gap-2">
            <button className="flex-1 px-3 py-2 text-gray-600 hover:text-gray-900 font-bold text-12px border border-gray-200 rounded-lg transition-colors">
              👁️ Watch
            </button>
            <button className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white font-bold text-12px rounded-lg transition-colors">
              🔨 View Auction →
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
}