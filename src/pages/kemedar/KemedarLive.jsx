import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import LiveEventCard from "@/components/live/LiveEventCard";
import LiveNowBanner from "@/components/live/LiveNowBanner";
import { EVENT_TYPE_META } from "@/lib/liveEventUtils";

const EVENT_FILTERS = [
  { label: 'All', value: '' },
  { label: '🏗️ Property Launch', value: 'property_launch' },
  { label: '📊 Market Briefing', value: 'market_briefing' },
  { label: '💰 Investment', value: 'investment_seminar' },
  { label: '🏠 Open House', value: 'open_house' },
  { label: '🎓 Educational', value: 'educational_webinar' },
];

const DATE_FILTERS = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
  { label: 'All', value: 'all' },
];

export default function KemedarLive() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [langFilter, setLangFilter] = useState('');

  useEffect(() => { loadEvents(); }, []);

  const loadEvents = async () => {
    const data = await base44.entities.LiveEvent.filter({ isApproved: true }, 'scheduledStartAt', 100);
    setEvents(data);
    setLoading(false);
  };

  const now = new Date();
  const todayEnd = new Date(now); todayEnd.setHours(23, 59, 59);
  const weekEnd = new Date(now); weekEnd.setDate(weekEnd.getDate() + 7);
  const monthEnd = new Date(now); monthEnd.setDate(monthEnd.getDate() + 30);

  const filterByDate = (e) => {
    const start = new Date(e.scheduledStartAt);
    if (dateFilter === 'today') return start <= todayEnd;
    if (dateFilter === 'week') return start <= weekEnd;
    if (dateFilter === 'month') return start <= monthEnd;
    return true;
  };

  const filtered = events.filter(e => {
    if (typeFilter && e.eventType !== typeFilter) return false;
    if (langFilter && e.language !== langFilter) return false;
    if (!filterByDate(e)) return false;
    return true;
  });

  const liveNow = events.find(e => e.streamStatus === 'live');
  const nextUpcoming = events.find(e => e.streamStatus === 'scheduled' && new Date(e.scheduledStartAt) > now);
  const bannerEvent = liveNow || nextUpcoming;

  const todayEvents = filtered.filter(e => {
    const s = new Date(e.scheduledStartAt);
    return s.toDateString() === now.toDateString() && (e.streamStatus === 'live' || e.streamStatus === 'scheduled' || e.streamStatus === 'rehearsal');
  });
  const upcomingEvents = filtered.filter(e => e.streamStatus === 'scheduled' && new Date(e.scheduledStartAt) > now);
  const featuredEvents = filtered.filter(e => e.isFeatured && e.streamStatus !== 'ended' && e.streamStatus !== 'replay_available');
  const replayEvents = filtered.filter(e => e.streamStatus === 'replay_available' || e.streamStatus === 'ended');

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-slate-900 pt-10 pb-8 px-4">
        <div className="max-w-6xl mx-auto">
          {!liveNow && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-red-500/20 text-red-300 text-sm font-bold px-4 py-1.5 rounded-full mb-4">
                <span className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                📺 Kemedar Live™
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-white mb-3">
                Property Launches.<br />Market Briefings.<br />
                <span className="text-orange-400">Investment Seminars. Live.</span>
              </h1>
              <p className="text-gray-400 text-lg max-w-xl mx-auto">
                Watch real estate events live, ask questions, and reserve property — all from your screen.
              </p>
            </div>
          )}
          <LiveNowBanner event={bannerEvent} />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 flex-1 w-full">

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex gap-1 flex-wrap">
            {EVENT_FILTERS.map(f => (
              <button key={f.value} onClick={() => setTypeFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${typeFilter === f.value ? 'bg-orange-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-orange-300'}`}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex gap-1 ml-auto">
            {DATE_FILTERS.map(f => (
              <button key={f.value} onClick={() => setDateFilter(f.value)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${dateFilter === f.value ? 'bg-gray-800 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-400'}`}>
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="space-y-10">
            {/* Today */}
            {todayEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-4">🔴 Today's Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {todayEvents.map(e => <LiveEventCard key={e.id} event={e} />)}
                </div>
              </section>
            )}

            {/* Featured */}
            {featuredEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-4">⭐ Featured Events</h2>
                <div className="space-y-4">
                  {featuredEvents.slice(0, 2).map(e => (
                    <div key={e.id} className="bg-white rounded-2xl border-2 border-orange-200 shadow-sm overflow-hidden">
                      <div className="flex flex-col md:flex-row">
                        <div className="md:w-72 h-48 md:h-auto flex-shrink-0 relative">
                          {e.coverImageUrl ? (
                            <img src={e.coverImageUrl} alt={e.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className={`w-full h-full bg-gradient-to-br ${e.eventType === 'property_launch' ? 'from-orange-500 to-red-600' : 'from-purple-600 to-indigo-700'} flex items-center justify-center`}>
                              <span className="text-6xl">{EVENT_TYPE_META[e.eventType]?.icon}</span>
                            </div>
                          )}
                          <span className="absolute top-3 left-3 bg-orange-500 text-white text-xs font-black px-2.5 py-1 rounded-full">⭐ FEATURED</span>
                        </div>
                        <div className="flex-1 p-6 flex flex-col">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-full mb-2 self-start ${EVENT_TYPE_META[e.eventType]?.color}`}>
                            {EVENT_TYPE_META[e.eventType]?.icon} {EVENT_TYPE_META[e.eventType]?.label}
                          </span>
                          <h3 className="text-xl font-black text-gray-900 mb-2">{e.title}</h3>
                          <p className="text-gray-500 text-sm mb-4 line-clamp-3">{e.description}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                            <span>📅 {new Date(e.scheduledStartAt).toLocaleDateString('en-EG', { weekday: 'long', month: 'long', day: 'numeric' })}</span>
                            <span>👥 {e.totalRegistered?.toLocaleString()} registered</span>
                          </div>
                          <Link to={`/kemedar/live/event/${e.id}`} className="bg-orange-500 hover:bg-orange-600 text-white font-black px-6 py-3 rounded-xl text-sm self-start transition-colors">
                            Register Now →
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Upcoming */}
            {upcomingEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-4">📅 Upcoming Events</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {upcomingEvents.map(e => <LiveEventCard key={e.id} event={e} />)}
                </div>
              </section>
            )}

            {/* Replays */}
            {replayEvents.length > 0 && (
              <section>
                <h2 className="text-2xl font-black text-gray-900 mb-4">▶️ Watch Replays</h2>
                <p className="text-gray-500 text-sm mb-4">Missed a live event? Watch the recording with the AI summary.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {replayEvents.map(e => <LiveEventCard key={e.id} event={e} />)}
                </div>
              </section>
            )}

            {/* Empty */}
            {filtered.length === 0 && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">📺</div>
                <h3 className="text-xl font-black text-gray-800 mb-2">No events found</h3>
                <p className="text-gray-500 mb-6">Check back soon or adjust your filters</p>
                <Link to="/kemedar/live/create" className="bg-orange-500 text-white font-black px-6 py-3 rounded-xl hover:bg-orange-600 transition-colors inline-block">
                  + Host an Event
                </Link>
              </div>
            )}

            {/* CTA for hosts */}
            <section className="bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl p-8 text-center text-white">
              <h3 className="text-2xl font-black mb-2">🎙️ Are You a Developer or Agent?</h3>
              <p className="text-orange-100 mb-6">Host your own live event and reach thousands of qualified buyers nationwide.</p>
              <Link to="/kemedar/live/create" className="bg-white text-orange-600 font-black px-8 py-3 rounded-xl hover:bg-orange-50 transition-colors inline-block">
                Host a Live Event →
              </Link>
            </section>
          </div>
        )}
      </div>

      <SiteFooter />
    </div>
  );
}