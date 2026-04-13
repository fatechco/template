import { useState, useEffect } from "react";

export default function FlashCountdown({ endsAt, small = false, large = false }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());

  function getTimeLeft() {
    const diff = new Date(endsAt) - Date.now();
    if (diff <= 0) return { d: 0, h: 0, m: 0, s: 0, expired: true };
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s, expired: false };
  }

  useEffect(() => {
    const timer = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(timer);
  }, [endsAt]);

  if (timeLeft.expired) {
    return <span className={`font-bold text-white ${small ? "text-[10px]" : "text-sm"}`}>⏰ Expired</span>;
  }

  if (small) {
    return (
      <span className="text-white font-black text-xs">
        ⏰ {timeLeft.d > 0 ? `${timeLeft.d}d ` : ""}{timeLeft.h}h {timeLeft.m}m {timeLeft.s}s
      </span>
    );
  }

  if (large) {
    return (
      <div className="flex items-center gap-2">
        {timeLeft.d > 0 && (
          <div className="flex flex-col items-center bg-white/20 rounded-xl px-3 py-2">
            <span className="text-3xl font-black text-white">{String(timeLeft.d).padStart(2, "0")}</span>
            <span className="text-[10px] text-white/70">Days</span>
          </div>
        )}
        {[["h", timeLeft.h], ["m", timeLeft.m], ["s", timeLeft.s]].map(([label, val]) => (
          <div key={label} className="flex flex-col items-center bg-white/20 rounded-xl px-3 py-2">
            <span className="text-3xl font-black text-white">{String(val).padStart(2, "0")}</span>
            <span className="text-[10px] text-white/70 capitalize">{label === "h" ? "Hours" : label === "m" ? "Mins" : "Secs"}</span>
          </div>
        ))}
      </div>
    );
  }

  return (
    <span className="font-bold text-sm">
      ⏰ {timeLeft.d > 0 ? `${timeLeft.d}d ` : ""}{String(timeLeft.h).padStart(2,"0")}:{String(timeLeft.m).padStart(2,"0")}:{String(timeLeft.s).padStart(2,"0")}
    </span>
  );
}