import { useState, useEffect } from "react";

export default function FlashLiveCounter({ liveDeals, groupBuys, endingSoon }) {
  const [pulse, setPulse] = useState(false);
  useEffect(() => {
    const t = setInterval(() => setPulse(p => !p), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="inline-flex items-center gap-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-6 py-3 text-white text-sm flex-wrap justify-center">
      <span className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full bg-orange-400 ${pulse ? "opacity-100" : "opacity-40"} transition-opacity`} />
        <strong>{liveDeals}</strong> deals live now
      </span>
      <span className="text-white/30">|</span>
      <span className="flex items-center gap-1">🏘 <strong>{groupBuys}</strong> group buys forming</span>
      <span className="text-white/30">|</span>
      <span className="flex items-center gap-1 text-red-300">⏰ <strong>{endingSoon}</strong> ending soon</span>
    </div>
  );
}