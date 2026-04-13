import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { EVENT_TYPE_META, fmtViewers, formatDuration } from "@/lib/liveEventUtils";
import { Send, ThumbsUp, Heart, MessageSquare, HelpCircle, BarChart2, Home, ChevronUp } from "lucide-react";

const REACTIONS = ['❤️', '🔥', '👍', '😮', '👏', '🏠'];

function WaitingRoom({ event, viewerCount }) {
  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="text-center max-w-lg">
        <div className="text-6xl mb-4 animate-bounce">🎬</div>
        <h2 className="text-2xl font-black text-white mb-2">Event starts soon</h2>
        <p className="text-gray-400 mb-6">{event.title}</p>
        <div className="bg-white/10 rounded-2xl p-6 mb-6">
          <div className="flex items-center gap-3 justify-center mb-4">
            <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center font-black text-white">{(event.organizationName || 'H')[0]}</div>
            <div className="text-left">
              <p className="font-bold text-white">{event.organizationName || 'Host'}</p>
              <p className="text-xs text-gray-400">Your host today</p>
            </div>
          </div>
          <div className="text-gray-300 text-sm mb-4">👥 {fmtViewers(viewerCount)} people waiting...</div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Link to={`/kemedar/live/event/${event.id}`} className="bg-white/10 hover:bg-white/20 text-white font-bold py-2.5 px-4 rounded-xl text-sm transition-colors">
            📋 View Agenda
          </Link>
          <div className="bg-white/10 text-white font-bold py-2.5 px-4 rounded-xl text-sm text-center">
            🔊 Test Audio
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LiveEventWatch() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [polls, setPolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('chat');
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [reactions, setReactions] = useState([]);
  const [viewerCount] = useState(Math.floor(Math.random() * 800) + 200);
  const [showReservation, setShowReservation] = useState(false);
  const chatRef = useRef(null);

  useEffect(() => { init(); }, [eventId]);
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  const init = async () => {
    const [evts, u] = await Promise.all([
      base44.entities.LiveEvent.filter({ id: eventId }),
      base44.auth.me().catch(() => null)
    ]);
    setEvent(evts[0]);
    setUser(u);

    const [msgs, qs, ps] = await Promise.all([
      base44.entities.LiveEventMessage.filter({ eventId, messageType: 'chat' }, 'created_date', 50),
      base44.entities.LiveEventMessage.filter({ eventId, isQuestion: true }, '-upvotes', 30),
      base44.entities.LiveEventPoll.filter({ eventId }),
    ]);
    setMessages(msgs);
    setQuestions(qs);
    setPolls(ps);
    setLoading(false);

    // Subscribe to new messages
    const unsub = base44.entities.LiveEventMessage.subscribe((ev) => {
      if (ev.data?.eventId === eventId) {
        if (ev.type === 'create') {
          if (ev.data.isQuestion) setQuestions(prev => [...prev, ev.data]);
          else setMessages(prev => [...prev.slice(-99), ev.data]);
        }
      }
    });
    return unsub;
  };

  const sendMessage = async (isQuestion = false) => {
    if (!input.trim() || !user || sending) return;
    setSending(true);
    const msg = await base44.entities.LiveEventMessage.create({
      eventId,
      senderId: user.id,
      senderName: user.full_name || 'Viewer',
      senderType: 'viewer',
      messageType: isQuestion ? 'question' : 'chat',
      content: input,
      isQuestion,
      isModeratorApproved: !event?.moderationRequired,
    });
    if (!isQuestion) setMessages(prev => [...prev, msg]);
    setInput('');
    setSending(false);
  };

  const sendReaction = (emoji) => {
    const id = Date.now();
    setReactions(prev => [...prev, { id, emoji }]);
    setTimeout(() => setReactions(prev => prev.filter(r => r.id !== id)), 3000);
    if (user) {
      base44.entities.LiveEventMessage.create({
        eventId, senderId: user.id, senderName: user.full_name || 'Viewer',
        senderType: 'viewer', messageType: 'reaction', content: emoji,
        reactionType: emoji, isModeratorApproved: true,
      });
    }
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!event) return <div className="p-8 text-center">Event not found</div>;
  if (event.streamStatus === 'scheduled') return <WaitingRoom event={event} viewerCount={viewerCount} />;

  const isLive = event.streamStatus === 'live';
  const meta = EVENT_TYPE_META[event.eventType];

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2 bg-gray-900 border-b border-gray-800 flex-shrink-0">
        <Link to={`/kemedar/live/event/${event.id}`} className="text-gray-400 hover:text-white">←</Link>
        <span className="text-white font-bold text-sm truncate flex-1">{event.title}</span>
        {isLive && (
          <span className="flex items-center gap-1.5 bg-red-500 text-white text-xs font-black px-2.5 py-1 rounded-full flex-shrink-0">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" /> LIVE
          </span>
        )}
        <span className="text-gray-400 text-xs flex-shrink-0">👀 {fmtViewers(viewerCount)}</span>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left panel */}
        <div className="hidden lg:flex w-72 bg-gray-900 border-r border-gray-800 flex-col p-3 overflow-y-auto flex-shrink-0">
          <div className="bg-gray-800 rounded-xl p-3 mb-3">
            <p className="text-white font-black text-sm mb-1">{event.title}</p>
            <p className="text-gray-400 text-xs">{event.organizationName}</p>
            <div className="flex items-center gap-2 mt-2">
              {isLive && <span className="text-xs text-red-400 font-bold">🔴 LIVE</span>}
              <span className="text-xs text-gray-500">👀 {fmtViewers(viewerCount)}</span>
            </div>
          </div>

          {event.agenda?.length > 0 && (
            <div className="mb-3">
              <p className="text-xs font-bold text-gray-400 uppercase mb-2">📋 Agenda</p>
              {event.agenda.map((item, i) => (
                <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-800 last:border-0">
                  <span className="w-5 h-5 bg-gray-700 rounded-full flex items-center justify-center text-[10px] text-gray-400 flex-shrink-0">{i + 1}</span>
                  <p className="text-xs text-gray-300">{item.topic}</p>
                </div>
              ))}
            </div>
          )}

          <div className="text-xs font-bold text-gray-400 uppercase mb-2">Live Stats</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Watching', val: fmtViewers(viewerCount) },
              { label: 'Messages', val: messages.length },
              { label: 'Questions', val: questions.length },
              { label: 'Reserved', val: event.reservationsDuringEvent || 0 },
            ].map(s => (
              <div key={s.label} className="bg-gray-800 rounded-xl p-2 text-center">
                <p className="text-white font-black text-sm">{s.val}</p>
                <p className="text-gray-500 text-[10px]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Center: Video */}
        <div className="flex-1 flex flex-col overflow-hidden bg-black relative">
          {/* Video placeholder */}
          <div className="flex-1 relative flex items-center justify-center bg-gradient-to-br from-gray-800 to-gray-900">
            <div className="text-center">
              <div className="text-8xl mb-4">{meta?.icon}</div>
              <p className="text-white font-black text-xl mb-2">{event.title}</p>
              <p className="text-gray-400">{isLive ? 'Live stream would appear here' : 'Replay would appear here'}</p>
              {!isLive && event.replayUrl && (
                <a href={event.replayUrl} target="_blank" rel="noreferrer" className="mt-4 inline-block bg-blue-500 text-white font-bold px-6 py-2.5 rounded-xl hover:bg-blue-600 transition-colors">
                  ▶️ Watch Replay
                </a>
              )}
            </div>

            {/* Reaction overlays */}
            <div className="absolute right-4 top-0 bottom-0 pointer-events-none overflow-hidden w-16">
              {reactions.map(r => (
                <div key={r.id} className="absolute right-2 text-2xl animate-bounce" style={{ bottom: `${Math.random() * 60 + 20}%`, animationDuration: '1s' }}>
                  {r.emoji}
                </div>
              ))}
            </div>

            {/* Purchase CTA overlay */}
            {event.purchaseEnabled && isLive && (
              <div className="absolute bottom-4 left-4 right-4">
                <button onClick={() => setShowReservation(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 animate-pulse">
                  🏠 Reserve Your Unit — Event Exclusive Price
                </button>
              </div>
            )}
          </div>

          {/* Quick reactions */}
          <div className="flex items-center justify-center gap-3 p-3 bg-gray-900 flex-shrink-0">
            {REACTIONS.map(r => (
              <button key={r} onClick={() => sendReaction(r)} className="text-xl hover:scale-125 transition-transform active:scale-95">{r}</button>
            ))}
          </div>
        </div>

        {/* Right panel: Chat/Q&A */}
        <div className="hidden lg:flex w-80 bg-gray-900 border-l border-gray-800 flex-col flex-shrink-0">
          {/* Tabs */}
          <div className="flex border-b border-gray-800 flex-shrink-0">
            {[
              { id: 'chat', icon: <MessageSquare size={14} />, label: 'Chat' },
              { id: 'qa', icon: <HelpCircle size={14} />, label: 'Q&A' },
              { id: 'polls', icon: <BarChart2 size={14} />, label: 'Polls' },
              { id: 'properties', icon: <Home size={14} />, label: 'Units' },
            ].map(t => (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1 py-2.5 text-xs font-semibold border-b-2 transition-colors ${activeTab === t.id ? 'border-orange-500 text-orange-400' : 'border-transparent text-gray-500 hover:text-gray-300'}`}>
                {t.icon} {t.label}
              </button>
            ))}
          </div>

          {/* Chat content */}
          {activeTab === 'chat' && (
            <>
              <div ref={chatRef} className="flex-1 overflow-y-auto p-3 space-y-2">
                {messages.length === 0 && (
                  <div className="text-center text-gray-600 text-xs mt-8">No messages yet. Be the first!</div>
                )}
                {messages.map(msg => (
                  <div key={msg.id} className={`flex gap-2 ${msg.senderType === 'host' ? 'bg-orange-900/30 rounded-lg p-2' : ''}`}>
                    <div className="w-6 h-6 rounded-full bg-gray-700 flex items-center justify-center text-xs text-gray-300 flex-shrink-0 font-bold">
                      {msg.senderName?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <span className={`text-xs font-bold ${msg.senderType === 'host' ? 'text-orange-400' : 'text-gray-400'}`}>
                        {msg.senderType === 'host' ? '🎙️ ' : ''}{msg.senderName}
                      </span>
                      <p className="text-xs text-gray-200 mt-0.5">{msg.content}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-800 flex-shrink-0">
                <div className="flex gap-2">
                  <input value={input} onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
                    placeholder="Type a message..."
                    className="flex-1 bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500" />
                  <button onClick={() => sendMessage()} disabled={!input.trim() || !user}
                    className="bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white p-2 rounded-xl transition-colors">
                    <Send size={14} />
                  </button>
                </div>
              </div>
            </>
          )}

          {/* Q&A content */}
          {activeTab === 'qa' && (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {questions.map(q => (
                  <div key={q.id} className={`p-3 rounded-xl ${q.isAnswered ? 'bg-green-900/30 border border-green-800' : 'bg-gray-800'}`}>
                    <p className="text-xs text-gray-200 mb-1">Q: {q.content}</p>
                    {q.isAnswered && q.answerContent && (
                      <div className="mt-2 pt-2 border-t border-green-800">
                        <p className="text-xs text-green-400">✅ A: {q.answerContent}</p>
                      </div>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] text-gray-500">{q.upvotes || 0} upvotes</span>
                      {q.isAnswered && <span className="text-[10px] text-green-500">Answered</span>}
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-gray-800 flex-shrink-0">
                <textarea value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Type your question..."
                  rows={2}
                  className="w-full bg-gray-800 border border-gray-700 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-orange-500 resize-none mb-2" />
                <button onClick={() => sendMessage(true)} disabled={!input.trim() || !user}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:opacity-40 text-white font-bold py-2 rounded-xl text-xs transition-colors">
                  🙋 Submit Question
                </button>
              </div>
            </>
          )}

          {/* Polls */}
          {activeTab === 'polls' && (
            <div className="flex-1 overflow-y-auto p-3">
              {polls.length === 0 ? (
                <div className="text-center text-gray-600 text-xs mt-8">No polls yet</div>
              ) : polls.map(poll => (
                <div key={poll.id} className="bg-gray-800 rounded-xl p-4 mb-3">
                  <p className="text-white font-bold text-sm mb-3">{poll.question}</p>
                  <div className="space-y-2">
                    {poll.options?.map((opt, i) => {
                      const pct = poll.totalResponses > 0 ? Math.round((opt.votes / poll.totalResponses) * 100) : 0;
                      return (
                        <div key={opt.optionId || i} className="relative">
                          <div className="h-8 bg-gray-700 rounded-lg overflow-hidden">
                            <div className="h-full bg-orange-500/40 rounded-lg transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <div className="absolute inset-0 flex items-center justify-between px-3">
                            <span className="text-xs text-white">{opt.text}</span>
                            <span className="text-xs text-gray-300 font-bold">{pct}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">{poll.totalResponses} responses</p>
                </div>
              ))}
            </div>
          )}

          {/* Properties */}
          {activeTab === 'properties' && (
            <div className="flex-1 overflow-y-auto p-3">
              <p className="text-xs text-gray-400 mb-3">Featured properties in this event</p>
              {event.featuredPropertyIds?.length > 0 ? (
                event.featuredPropertyIds.map(pid => (
                  <div key={pid} className="bg-gray-800 rounded-xl p-3 mb-2">
                    <p className="text-xs text-gray-300 font-bold mb-2">Property #{pid.slice(0, 8)}...</p>
                    <div className="flex gap-2">
                      <Link to={`/property/${pid}`} target="_blank" className="text-[10px] bg-gray-700 text-gray-300 px-2 py-1 rounded-lg hover:bg-gray-600">View →</Link>
                      {event.purchaseEnabled && <button onClick={() => setShowReservation(true)} className="text-[10px] bg-orange-500 text-white px-2 py-1 rounded-lg hover:bg-orange-600">🏠 Reserve</button>}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-600 text-xs mt-8">No properties listed</div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Reservation modal */}
      {showReservation && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-end sm:items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-black text-gray-900">🏠 Reserve During Live Event</h3>
                <button onClick={() => setShowReservation(false)} className="text-gray-400 hover:text-gray-600 text-xl">×</button>
              </div>
              {event.exclusivePricing && event.eventOnlyDiscount && (
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 mb-4">
                  <p className="text-sm font-black text-orange-700">⚡ Event Exclusive: -{event.eventOnlyDiscount}% discount active</p>
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Unit Type</label>
                  <select className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
                    <option>Studio — 55m²</option>
                    <option>1 Bedroom — 75m²</option>
                    <option>2 Bedroom — 110m²</option>
                    <option>3 Bedroom — 160m²</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-600 block mb-1">Payment Plan</label>
                  <div className="space-y-2">
                    {['10% down | 5 year installments', '20% down | Cash over 2 years', 'Cash — special discount'].map(plan => (
                      <label key={plan} className="flex items-center gap-2 p-3 rounded-xl border border-gray-100 hover:border-orange-300 cursor-pointer">
                        <input type="radio" name="paymentPlan" className="text-orange-500" />
                        <span className="text-sm text-gray-700">{plan}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-4">
                  <p className="text-xs text-gray-500 mb-1">Reservation deposit (refundable 7 days)</p>
                  <p className="text-2xl font-black text-gray-900">5% <span className="text-sm font-normal text-gray-500">of unit price</span></p>
                  <p className="text-xs text-gray-400 mt-1">Secured via Kemedar Escrow™</p>
                </div>
                <button onClick={() => setShowReservation(false)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl transition-colors">
                  🏠 Confirm Reservation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}