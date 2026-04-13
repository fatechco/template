import { Link } from "react-router-dom";
import { fmtViewers, formatCountdown } from "@/lib/liveEventUtils";
import { useState, useEffect } from "react";

export default function LiveNowBanner({ event }) {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTick(n => n + 1), 1000);
    return () => clearInterval(t);
  }, []);

  if (!event) return null;

  const isLive = event.streamStatus === 'live';
  const upcoming = !isLive;
  const cd = formatCountdown(event.scheduledStartAt);

  return (
    <div className={`relative overflow-hidden rounded-2xl mb-6 ${isLive ? 'bg-gradient-to-r from-red-600 to-red-700' : 'bg-gradient-to-r from-gray-900 to-gray-800'} p-6 text-white`}>
      {isLive && (
        <div className="absolute inset-0 bg-red-600 animate-pulse opacity-10 pointer-events-none" />
      )}
      <div className="relative flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="flex-1">
          {isLive ? (
            <div className="flex items-center gap-2 mb-2">
              <span className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm text-white text-sm font-black px-3 py-1 rounded-full">
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse" />
                🔴 LIVE NOW
              </span>
              {event.peakViewers > 0 && (
                <span className="text-white/80 text-sm">{fmtViewers(event.peakViewers)} watching</span>
              )}
            </div>
          ) : (
            <div className="text-white/60 text-sm font-bold uppercase tracking-wider mb-2">🔔 Next Live Event</div>
          )}
          <h2 className="text-xl md:text-2xl font-black text-white mb-1 leading-tight">{event.title}</h2>
          <p className="text-white/70 text-sm">{event.organizationName || 'Kemedar Host'}</p>
          {upcoming && (
            <div className="mt-3 flex items-center gap-3">
              <span className="text-white/60 text-sm">Starts in:</span>
              <div className="flex items-center gap-1 text-white font-black text-lg">
                {cd.d > 0 && <span>{cd.d}d </span>}
                <span>{String(cd.h).padStart(2,'0')}h</span>
                <span className="opacity-50">:</span>
                <span>{String(cd.m).padStart(2,'0')}m</span>
                <span className="opacity-50">:</span>
                <span>{String(cd.s).padStart(2,'0')}s</span>
              </div>
            </div>
          )}
        </div>
        <Link
          to={isLive ? `/kemedar/live/watch/${event.id}` : `/kemedar/live/event/${event.id}`}
          className={`flex-shrink-0 font-black px-6 py-3 rounded-xl text-sm transition-colors ${isLive ? 'bg-white text-red-600 hover:bg-red-50' : 'bg-orange-500 hover:bg-orange-400 text-white'}`}
        >
          {isLive ? '📺 Watch Live →' : '🔔 Register & Get Reminded'}
        </Link>
      </div>
    </div>
  );
}