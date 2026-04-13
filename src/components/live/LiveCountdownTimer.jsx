import { useState, useEffect } from "react";
import { formatCountdown } from "@/lib/liveEventUtils";

export default function LiveCountdownTimer({ targetDate, label = "Event starts in", large = false }) {
  const [cd, setCd] = useState(formatCountdown(targetDate));

  useEffect(() => {
    const t = setInterval(() => setCd(formatCountdown(targetDate)), 1000);
    return () => clearInterval(t);
  }, [targetDate]);

  if (cd.total <= 0) return <span className="text-red-500 font-black">Starting now!</span>;

  const box = large
    ? "bg-white/20 rounded-xl px-4 py-3 text-center min-w-[60px]"
    : "bg-white/20 rounded-lg px-2 py-1.5 text-center min-w-[40px]";

  const numCls = large ? "text-4xl font-black text-white block" : "text-xl font-black text-white block";
  const lblCls = large ? "text-xs text-white/60 mt-0.5" : "text-[9px] text-white/60";

  return (
    <div className="flex flex-col items-center gap-2">
      {label && <p className="text-white/70 text-sm font-semibold">{label}</p>}
      <div className="flex items-center gap-2">
        {cd.d > 0 && (
          <>
            <div className={box}><span className={numCls}>{cd.d}</span><span className={lblCls}>days</span></div>
            <span className="text-white/50 font-black text-xl">:</span>
          </>
        )}
        <div className={box}><span className={numCls}>{String(cd.h).padStart(2,'0')}</span><span className={lblCls}>hrs</span></div>
        <span className="text-white/50 font-black text-xl">:</span>
        <div className={box}><span className={numCls}>{String(cd.m).padStart(2,'0')}</span><span className={lblCls}>min</span></div>
        <span className="text-white/50 font-black text-xl">:</span>
        <div className={box}><span className={numCls}>{String(cd.s).padStart(2,'0')}</span><span className={lblCls}>sec</span></div>
      </div>
    </div>
  );
}