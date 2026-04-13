import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import LiveEventCard from "@/components/live/LiveEventCard";
import LiveNowBanner from "@/components/live/LiveNowBanner";
import { EVENT_TYPE_META } from "@/lib/liveEventUtils";

const TABS = ['🔴 Live', '📅 Upcoming', '▶️ Replays', '⭐ For You'];

export default function KemedarLiveMobile() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    base44.entities.LiveEvent.filter({ isApproved: true }, 'scheduledStartAt', 50)
      .then(data => { setEvents(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const now = new Date();
  const liveNow = events.find(e => e.streamStatus === 'live');
  const nextUpcoming = events.find(e => e.streamStatus === 'scheduled' && new Date(e.scheduledStartAt) > now);
  const bannerEvent = liveNow || nextUpcoming;

  const tabEvents = [
    events.filter(e => e.streamStatus === 'live' || (e.streamStatus === 'scheduled' && new Date(e.scheduledStartAt).toDateString() === now.toDateString())),
    events.filter(e => e.streamStatus === 'scheduled' && new Date(e.scheduledStartAt) > now),
    events.filter(e => e.streamStatus === 'replay_available' || e.streamStatus === 'ended'),
    events.filter(e => e.isFeatured),
  ][activeTab];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-gray-900 px-4 py-3 flex items-center justify-between">
        <h1 className="text-white font-black text-lg">📺 Kemedar Live™</h1>
        <Link to="/kemedar/live/create" className="text-xs bg-orange-500 text-white font-bold px-3 py-1.5 rounded-full">+ Host</Link>
      </div>

      {bannerEvent && (
        <div className="px-4 pt-4">
          <LiveNowBanner event={bannerEvent} />
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 px-4 mb-4 overflow-x-auto no-scrollbar">
        {TABS.map((t, i) => (
          <button key={i} onClick={() => setActiveTab(i)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${activeTab === i ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}>
            {t}
            {i === 0 && liveNow && <span className="ml-1 w-1.5 h-1.5 bg-red-500 rounded-full inline-block animate-pulse" />}
          </button>
        ))}
      </div>

      {/* Events */}
      <div className="px-4 pb-8">
        {loading ? (
          <div className="flex justify-center py-12"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>
        ) : tabEvents.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-3">📺</p>
            <p className="font-black text-gray-700">No events here yet</p>
            <p className="text-gray-400 text-sm mt-1">Check back soon</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tabEvents.map(e => <LiveEventCard key={e.id} event={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}