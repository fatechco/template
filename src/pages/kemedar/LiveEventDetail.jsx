import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import LiveCountdownTimer from "@/components/live/LiveCountdownTimer";
import { EVENT_TYPE_META, LANGUAGE_FLAGS, formatDuration } from "@/lib/liveEventUtils";
import { CheckCircle, Calendar, Globe, Share2, Bell } from "lucide-react";

const REGISTRANT_TYPES = [
  { value: 'buyer', label: '🏠 Property Buyer' },
  { value: 'investor', label: '💰 Investor' },
  { value: 'agent', label: '🤝 Real Estate Agent' },
  { value: 'expat', label: '🌍 Expat Buyer' },
  { value: 'general', label: '👀 Just Interested' },
];

export default function LiveEventDetail() {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [registration, setRegistration] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState([]);
  const [form, setForm] = useState({ registrantType: 'buyer', budget: '', countryOfResidence: '', interestedInUnit: '' });

  useEffect(() => { init(); }, [eventId]);

  const init = async () => {
    const [evts, u] = await Promise.all([
      base44.entities.LiveEvent.filter({ id: eventId }),
      base44.auth.me().catch(() => null)
    ]);
    const ev = evts[0];
    setEvent(ev);
    setUser(u);

    if (u && ev) {
      const regs = await base44.entities.LiveEventRegistration.filter({ eventId, userId: u.id });
      if (regs.length > 0) { setRegistration(regs[0]); setRegistered(true); }
    }
    setLoading(false);

    // Load suggested questions
    if (u && ev) {
      base44.functions.invoke('suggestEventQuestions', { eventId })
        .then(r => setSuggestedQuestions(r.data?.questions || []))
        .catch(() => {});
    }
  };

  const handleRegister = async () => {
    if (!user) { base44.auth.redirectToLogin(); return; }
    setRegistering(true);
    const reg = await base44.entities.LiveEventRegistration.create({
      eventId,
      userId: user.id,
      ...form,
      registeredAt: new Date().toISOString(),
      attended: false,
    });
    await base44.entities.LiveEvent.update(eventId, { totalRegistered: (event.totalRegistered || 0) + 1 });
    setRegistration(reg);
    setRegistered(true);
    setRegistering(false);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!event) return <div className="p-8 text-center">Event not found</div>;

  const meta = EVENT_TYPE_META[event.eventType] || EVENT_TYPE_META.property_launch;
  const isLive = event.streamStatus === 'live';
  const isEnded = event.streamStatus === 'ended' || event.streamStatus === 'replay_available';
  const isUpcoming = event.streamStatus === 'scheduled';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* Cover */}
      <div className="relative h-64 md:h-80 overflow-hidden bg-gray-900">
        {event.coverImageUrl ? (
          <img src={event.coverImageUrl} alt={event.title} className="w-full h-full object-cover opacity-70" />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${meta.badge} opacity-80 flex items-center justify-center`}>
            <span className="text-9xl opacity-60">{meta.icon}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 p-6">
          <div className="flex items-center gap-2 mb-3">
            <span className={`text-xs font-bold px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-sm`}>{meta.icon} {meta.label}</span>
            {isLive && <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-black px-3 py-1 rounded-full"><span className="w-2 h-2 bg-white rounded-full animate-pulse" /> LIVE NOW</span>}
            {isEnded && <span className="bg-blue-500 text-white text-xs font-black px-3 py-1 rounded-full">▶️ REPLAY AVAILABLE</span>}
          </div>
          <h1 className="text-2xl md:text-3xl font-black text-white">{event.title}</h1>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 w-full flex-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

          {/* LEFT: Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Host */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center text-2xl font-black text-orange-600 flex-shrink-0">
                  {(event.organizationName || 'H')[0]}
                </div>
                <div>
                  <p className="font-black text-gray-900">{event.organizationName || 'Host'}</p>
                  <p className="text-sm text-gray-500 capitalize">{event.hostType?.replace(/_/g, ' ')}</p>
                  <p className="text-xs text-gray-400">{LANGUAGE_FLAGS[event.language]} {event.language}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            {event.description && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-900 mb-3">About This Event</h3>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{event.description}</p>
              </div>
            )}

            {/* Agenda */}
            {event.agenda?.length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                <h3 className="font-black text-gray-900 mb-3">📋 What We'll Cover</h3>
                <div className="space-y-2">
                  {event.agenda.map((item, i) => (
                    <div key={i} className="flex gap-3 p-3 rounded-xl bg-gray-50">
                      <span className="w-6 h-6 bg-orange-500 text-white rounded-full flex items-center justify-center text-xs font-black flex-shrink-0">{i + 1}</span>
                      <div>
                        <p className="text-sm font-bold text-gray-900">{item.topic}</p>
                        {item.time && <p className="text-xs text-gray-400">{item.time}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What to expect */}
            <div className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
              <h3 className="font-black text-gray-900 mb-3">💡 At This Event You Can:</h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  'Ask questions in real-time', 'See exclusive pricing',
                  ...(event.purchaseEnabled ? ['Reserve units during the event'] : []),
                  'Download the event summary', 'Watch the replay if you miss it',
                  event.pollsEnabled ? 'Vote in live polls' : null,
                ].filter(Boolean).map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-gray-700">
                    <CheckCircle size={14} className="text-green-500 flex-shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            {/* AI Summary (if ended) */}
            {isEnded && event.aiEventSummary && (
              <div className="bg-orange-50 border border-orange-200 rounded-2xl p-5">
                <h3 className="font-black text-orange-800 mb-3">🤖 AI Event Summary</h3>
                <p className="text-orange-900 text-sm leading-relaxed">{event.aiEventSummary}</p>
                {event.aiTopQuestions?.length > 0 && (
                  <div className="mt-4">
                    <p className="font-black text-orange-800 text-sm mb-2">Top Questions & Answers:</p>
                    {event.aiTopQuestions.slice(0, 3).map((q, i) => (
                      <div key={i} className="mb-3 p-3 bg-white rounded-xl">
                        <p className="text-sm font-bold text-gray-900">Q: {q.question}</p>
                        {q.answer && <p className="text-sm text-gray-600 mt-1">A: {q.answer}</p>}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT: Registration */}
          <div className="lg:col-span-1">
            <div className="sticky top-4 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              {/* Countdown */}
              {isUpcoming && (
                <div className="bg-gray-900 rounded-xl p-4 mb-4 text-center">
                  <LiveCountdownTimer targetDate={event.scheduledStartAt} label="Starts in" />
                </div>
              )}

              {/* Date/Time */}
              <div className="space-y-2 mb-4 text-sm">
                <div className="flex items-center gap-2 text-gray-600">
                  <Calendar size={14} className="text-orange-500" />
                  <span>{new Date(event.scheduledStartAt).toLocaleDateString('en-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-600">
                  <Globe size={14} className="text-orange-500" />
                  <span>{new Date(event.scheduledStartAt).toLocaleTimeString('en-EG', { hour: '2-digit', minute: '2-digit' })} Cairo time</span>
                </div>
                <div className="text-gray-400 text-xs pl-5">⏱ Duration: ~{formatDuration(event.estimatedDurationMinutes)}</div>
              </div>

              {/* Registration state */}
              {registered ? (
                <div className="space-y-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4 text-center">
                    <CheckCircle size={28} className="text-green-500 mx-auto mb-1" />
                    <p className="font-black text-green-800">You're Registered!</p>
                    <p className="text-xs text-green-600 mt-0.5">We'll remind you before the event</p>
                  </div>
                  {isLive && (
                    <Link to={`/kemedar/live/watch/${event.id}`} className="block w-full bg-red-500 hover:bg-red-600 text-white font-black py-3 rounded-xl text-center transition-colors">
                      📺 Watch Live Now →
                    </Link>
                  )}
                  {isEnded && (
                    <Link to={`/kemedar/live/watch/${event.id}`} className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-black py-3 rounded-xl text-center transition-colors">
                      ▶️ Watch Replay →
                    </Link>
                  )}
                  {/* Suggested questions */}
                  {suggestedQuestions.length > 0 && (
                    <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
                      <p className="text-xs font-black text-purple-700 mb-2">🤖 Personalized questions to ask:</p>
                      {suggestedQuestions.slice(0, 3).map((q, i) => (
                        <p key={i} className="text-xs text-purple-700 mb-1">• {q.question}</p>
                      ))}
                    </div>
                  )}
                  <button className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-600 text-sm font-semibold py-2.5 rounded-xl hover:bg-gray-50">
                    <Share2 size={14} /> Share Event
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {!event.inviteOnly && (
                    <div className="bg-green-50 border border-green-200 rounded-xl p-2.5 text-center">
                      <p className="text-xs font-black text-green-700">✅ Registration is FREE</p>
                    </div>
                  )}

                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">You are registering as:</label>
                    <div className="space-y-1">
                      {REGISTRANT_TYPES.map(t => (
                        <label key={t.value} className="flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 cursor-pointer">
                          <input type="radio" name="registrantType" value={t.value} checked={form.registrantType === t.value} onChange={() => setForm(f => ({...f, registrantType: t.value}))} className="text-orange-500" />
                          <span className="text-sm text-gray-700">{t.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-600 block mb-1">Country of residence</label>
                    <input value={form.countryOfResidence} onChange={e => setForm(f => ({...f, countryOfResidence: e.target.value}))}
                      placeholder="e.g. Egypt, UAE, UK..."
                      className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
                  </div>

                  <button onClick={handleRegister} disabled={registering}
                    className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-60 text-white font-black py-3.5 rounded-xl transition-colors text-sm">
                    {registering ? 'Registering...' : isLive ? '📺 Join Live Event' : '🔔 Register & Get Reminded'}
                  </button>

                  <div className="text-center">
                    <span className="text-xs text-gray-400">👥 {event.totalRegistered?.toLocaleString() || 0} people registered</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <SiteFooter />
    </div>
  );
}