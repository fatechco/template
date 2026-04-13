import { useState, useEffect } from "react";

export default function AuctionCountdownPanel({ auction }) {
  const [timeRemaining, setTimeRemaining] = useState(null);

  useEffect(() => {
    if (!auction.auctionEndAt) return;

    const updateTime = () => {
      const now = new Date();
      const end = new Date(auction.auctionEndAt);
      const start = new Date(auction.auctionStartAt || auction.created_date);
      const diff = end - now;
      const totalDuration = end - start;
      const elapsed = totalDuration - diff;
      const percentElapsed = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));

      if (diff <= 0) {
        setTimeRemaining({ hours: 0, minutes: 0, seconds: 0, percentElapsed: 100, isLow: false, isVeryLow: false });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      const totalMinutes = hours * 60 + minutes;

      setTimeRemaining({
        hours,
        minutes,
        seconds,
        percentElapsed,
        isLow: totalMinutes < 60,
        isVeryLow: totalMinutes < 10,
      });
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, [auction.auctionEndAt, auction.auctionStartAt]);

  if (!timeRemaining) return null;

  const { hours, minutes, seconds, percentElapsed, isLow, isVeryLow } = timeRemaining;

  const timerColor = isVeryLow
    ? "text-red-600"
    : isLow
    ? "text-orange-600"
    : auction.status === "extended"
    ? "text-purple-700"
    : "text-gray-900";

  const statusLabel = auction.status === "extended"
    ? "⚡ EXTENDED"
    : isVeryLow
    ? "🔴 Ending Very Soon!"
    : isLow
    ? "⚠️ Ending Soon"
    : "⏰ Time Remaining";

  return (
    <div className="bg-white rounded-[20px] shadow-lg border border-gray-200 overflow-hidden">
      <div className={`py-2 px-4 text-center text-xs font-black text-white ${
        auction.status === "extended"
          ? "bg-purple-600"
          : isVeryLow
          ? "bg-red-600 animate-pulse"
          : isLow
          ? "bg-orange-500"
          : "bg-gray-800"
      }`}>
        {statusLabel}
      </div>

      <div className="p-6">
        {/* Big Clock */}
        <div className="flex items-end justify-center gap-2 mb-4">
          {[
            { value: hours, label: "hrs" },
            { value: minutes, label: "mins" },
            { value: seconds, label: "secs" },
          ].map((unit, idx) => (
            <div key={unit.label} className="flex items-end gap-2">
              <div className="text-center">
                <div className={`font-mono text-5xl font-black tabular-nums leading-none ${timerColor} ${isVeryLow ? "animate-pulse" : ""}`}>
                  {String(unit.value).padStart(2, "0")}
                </div>
                <div className="text-11px text-gray-500 mt-1">{unit.label}</div>
              </div>
              {idx < 2 && <div className={`font-mono text-4xl font-black pb-6 ${timerColor}`}>:</div>}
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              auction.status === "extended"
                ? "bg-purple-600"
                : isVeryLow
                ? "bg-red-600"
                : isLow
                ? "bg-orange-500"
                : "bg-red-600"
            }`}
            style={{ width: `${percentElapsed}%` }}
          />
        </div>
        <div className="flex justify-between mt-1 text-xs text-gray-400">
          <span>Start</span>
          <span>{Math.round(percentElapsed)}% elapsed</span>
          <span>End</span>
        </div>
      </div>
    </div>
  );
}