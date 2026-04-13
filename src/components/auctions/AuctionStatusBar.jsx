import { useEffect, useState } from "react";

const LiveCountdown = ({ endAt, status }) => {
  const [time, setTime] = useState("00:00:00");
  const [isLow, setIsLow] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const end = new Date(endAt);
      const diff = end - now;

      if (diff <= 0) {
        setTime("00:00:00");
        setIsLow(false);
        return;
      }

      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTime(`${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`);

      // Turn red if less than 10 minutes
      setIsLow(diff < 10 * 60 * 1000);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [endAt]);

  return (
    <span className={`font-mono text-2xl font-black tabular-nums ${isLow ? "animate-pulse text-orange-300" : "text-white"}`}>
      {time}
    </span>
  );
};

export default function AuctionStatusBar({ auction }) {
  const statusConfig = {
    live: { bg: "bg-red-600", label: "🔴 LIVE", dot: true },
    extended: { bg: "bg-purple-600", label: "⚡ EXTENDED", dot: false },
    ended: { bg: "bg-gray-900", label: "✅ ENDED", dot: false },
    registration: { bg: "bg-blue-600", label: "📋 REGISTRATION OPEN", dot: false },
  };

  const config = statusConfig[auction.status] || statusConfig.ended;

  return (
    <div className={`${config.bg} sticky top-0 z-40 px-4 py-4`}>
      <div className="max-w-[1400px] mx-auto flex items-center justify-between">
        {/* Left: Status */}
        <div className="flex items-center gap-2">
          {config.dot && <span className="inline-block w-2 h-2 bg-white rounded-full animate-pulse"></span>}
          <span className="text-white font-black text-sm">{config.label}</span>
        </div>

        {/* Center: Countdown */}
        <div className="flex-1 text-center">
          {(auction.status === "live" || auction.status === "extended") && (
            <LiveCountdown endAt={auction.auctionEndAt} status={auction.status} />
          )}
        </div>

        {/* Right: Viewers */}
        <div className="text-white text-sm font-bold">
          👥 {Math.floor(Math.random() * 500) + 50} watching now
        </div>
      </div>
    </div>
  );
}