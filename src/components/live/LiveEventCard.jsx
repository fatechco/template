import { Link } from "react-router-dom";
import { EVENT_TYPE_META, LANGUAGE_FLAGS, STREAM_STATUS, formatCountdown, formatDuration, fmtViewers, getEventGradient } from "@/lib/liveEventUtils";
import { useState, useEffect } from "react";

export default function LiveEventCard({ event, compact = false }) {
  const [countdown, setCountdown] = useState(null);

  useEffect(() => {
    if (event.streamStatus !== 'scheduled') return;
    const update = () => setCountdown(formatCountdown(event.scheduledStartAt));
    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [event.scheduledStartAt, event.streamStatus]);

  const meta = EVENT_TYPE_META[event.eventType] || EVENT_TYPE_META.property_launch;
  const isLive = event.streamStatus === 'live';
  const isReplay = event.streamStatus === 'replay_available' || event.streamStatus === 'ended';
  const isUpcoming = event.streamStatus === 'scheduled';
  const startsInMinutes = countdown ? Math.floor(countdown.total / 60000) : null;
  const gradient = getEventGradient(event.eventType);

  const actionLabel = isLive ? '📺 Watch Live' : isReplay ? '▶️ Watch Replay' : '🔔 Register Free';
  const actionBg = isLive ? 'bg-red-500 hover:bg-red-600' : isReplay ? 'bg-blue-500 hover:bg-blue-600' : 'bg-orange-500 hover:bg-orange-600';
  const linkTo = isLive ? `/kemedar/live/watch/${event.id}` : `/kemedar/live/event/${event.id}`;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col group hover:shadow-md transition-shadow">
      {/* Cover */}
      <div className="relative h-44 overflow-hidden flex-shrink-0">
        {event.coverImageUrl ? (
          <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}>
            <span className="text-6xl opacity-80">{meta.icon}</span>
          </div>
        )}

        {/* Status badge */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          {isLive && (
            <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full">
              <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
              LIVE
            </span>
          )}
          {isReplay && <span className="bg-blue-500 text-white text-xs font-black px-2.5 py-1 rounded-full">▶️ REPLAY</span>}
          {isUpcoming && startsInMinutes !== null && startsInMinutes <= 60 && startsInMinutes > 0 && (
            <span className="bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-full">⏰ Starting in {startsInMinutes}m</span>
          )}
        </div>

        {/* Viewer count */}
        {isLive && event.peakViewers > 0 && (
          <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
            👀 {fmtViewers(event.peakViewers)} watching
          </span>
        )}
        {isReplay && (
          <span className="absolute bottom-3 left-3 bg-black/60 text-white text-xs font-bold px-2 py-1 rounded-full backdrop-blur-sm">
            👁 {fmtViewers(event.totalAttended)} views
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 self-start ${meta.color}`}>
          {meta.icon} {meta.label}
        </span>

        <h3 className="font-black text-gray-900 text-sm leading-tight mb-2 line-clamp-2">{event.title}</h3>

        <div className="flex items-center gap-2 mb-2">
          <div className="w-6 h-6 bg-orange-100 rounded-full flex items-center justify-center text-xs font-black text-orange-600 flex-shrink-0">
            {(event.organizationName || 'H')[0]}
          </div>
          <div className="min-w-0">
            <span className="text-xs font-bold text-gray-800 truncate block">{event.organizationName || 'Host'}</span>
          </div>
          <span className="text-xs text-gray-400 ml-auto flex-shrink-0">{LANGUAGE_FLAGS[event.language]}</span>
        </div>

        <div className="text-xs text-gray-500 mb-1">
          📅 {new Date(event.scheduledStartAt).toLocaleDateString('en-EG', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })} Cairo
        </div>
        <div className="text-xs text-gray-400 mb-3">⏱ ~{formatDuration(event.estimatedDurationMinutes)}</div>

        {/* Registrations */}
        <div className="mb-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-gray-500">{fmtViewers(event.totalRegistered)} registered</span>
            {event.maxViewers && event.totalRegistered / event.maxViewers > 0.8 && (
              <span className="text-xs text-orange-600 font-bold">⚡ Almost Full!</span>
            )}
          </div>
          {event.maxViewers && (
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-orange-400 rounded-full transition-all" style={{ width: `${Math.min(100, (event.totalRegistered / event.maxViewers) * 100)}%` }} />
            </div>
          )}
        </div>

        <Link to={linkTo} className={`${actionBg} text-white text-xs font-black py-2.5 rounded-xl text-center transition-colors mt-auto`}>
          {actionLabel}
        </Link>
      </div>
    </div>
  );
}