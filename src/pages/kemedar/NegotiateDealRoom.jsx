import { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Send, Sparkles, Clock, Loader2, Handshake,
  CheckCircle, XCircle, RefreshCw, FileText, ChevronDown, ChevronUp
} from "lucide-react";
import { base44 } from "@/api/base44Client";
import SellerOfferReview from "@/components/negotiate/SellerOfferReview";
import DealAcceptanceModal from "@/components/negotiate/DealAcceptanceModal";

function fmt(n) { return n ? Number(n).toLocaleString() : "—"; }
function timeAgo(d) {
  if (!d) return "";
  const diff = Date.now() - new Date(d);
  const m = Math.floor(diff / 60000);
  if (m < 1) return "Just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

function CountdownTimer({ expiresAt }) {
  const [left, setLeft] = useState("");
  useEffect(() => {
    const update = () => {
      const diff = new Date(expiresAt) - Date.now();
      if (diff <= 0) { setLeft("Expired"); return; }
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      setLeft(`${h}:${String(m).padStart(2,"0")}:${String(s).padStart(2,"0")}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [expiresAt]);
  const isUrgent = new Date(expiresAt) - Date.now() < 2 * 3600000;
  return <span className={`font-mono font-bold ${isUrgent ? "text-red-500" : "text-gray-600"}`}>{left}</span>;
}

function MessageBubble({ msg, myRole }) {
  const isMe = msg.senderRole === myRole;
  const isSystem = msg.senderRole === "system";
  const isAI = msg.senderRole === "ai";
  const isOffer = msg.messageType === "offer" || msg.messageType === "counter_offer";
  const isAcceptance = msg.messageType === "acceptance";
  const isRejection = msg.messageType === "rejection";

  if (isSystem || isAcceptance || isRejection) return (
    <div className="flex justify-center my-3">
      <span className={`text-xs font-semibold px-4 py-1.5 rounded-full ${
        isAcceptance ? "bg-green-100 text-green-700" :
        isRejection ? "bg-red-100 text-red-600" :
        "bg-gray-100 text-gray-500"
      }`}>{msg.content}</span>
    </div>
  );

  if (isAI) return (
    <div className="flex justify-center my-3 px-4">
      <div className="bg-purple-50 border border-purple-100 rounded-2xl px-4 py-3 max-w-md w-full">
        <p className="text-[10px] font-black text-purple-600 mb-1 flex items-center gap-1">
          <Sparkles size={9} /> Kemedar Negotiate™ (Private to you)
        </p>
        <p className="text-xs text-purple-800 leading-relaxed italic">{msg.content}</p>
      </div>
    </div>
  );

  if (isOffer) {
    return (
      <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-3 px-2`}>
        <div className={`rounded-2xl p-4 max-w-[75%] shadow-sm ${isMe ? "bg-orange-500 text-white" : "bg-white border border-gray-200 text-gray-900"}`}>
          <p className={`text-[10px] font-black mb-1 ${isMe ? "text-orange-200" : "text-gray-400"}`}>
            {msg.messageType === "counter_offer" ? "🔄 Counter-Offer" : "🤝 Offer"}
          </p>
          {msg.relatedOfferAmount && (
            <p className={`text-xl font-black ${isMe ? "text-white" : "text-orange-600"}`}>
              {fmt(msg.relatedOfferAmount)} EGP
            </p>
          )}
          <p className={`text-sm mt-1 leading-relaxed ${isMe ? "text-orange-100" : "text-gray-700"}`}>{msg.content}</p>
          <p className={`text-[9px] mt-2 ${isMe ? "text-orange-200" : "text-gray-400"}`}>{timeAgo(msg.created_date)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"} mb-2 px-2`}>
      <div className={`rounded-2xl px-4 py-2.5 max-w-[75%] text-sm leading-relaxed ${isMe ? "bg-orange-500 text-white" : "bg-white border border-gray-100 text-gray-800"}`}>
        {msg.content}
        <p className={`text-[9px] mt-1 ${isMe ? "text-orange-200" : "text-gray-400"}`}>{timeAgo(msg.created_date)}</p>
      </div>
    </div>
  );
}

function CounterPanel({ session, onSendCounter, onClose, loading }) {
  const strategy = session?.buyerStrategy || session?.sellerStrategy || {};
  const [amount, setAmount] = useState(session?.currentOfferAmount || 0);
  const [message, setMessage] = useState("");
  const [drafting, setDrafting] = useState(false);

  const recommended = strategy?.recommendedOpeningOffer || strategy?.recommendedCounterOffer || amount;

  const draftMessage = async () => {
    setDrafting(true);
    const res = await base44.functions.invoke("draftOfferMessage", {
      sessionId: session.id,
      offerAmount: amount,
      direction: "buy",
      language: "en",
      tone: "professional",
      paymentMethod: "cash",
    }).catch(() => null);
    if (res?.data?.draft?.fullMessage) setMessage(res.data.draft.fullMessage);
    setDrafting(false);
  };

  return (
    <div className="bg-orange-50 border-t border-orange-200 p-4 space-y-3">
      <div className="flex items-center justify-between">
        <p className="font-black text-gray-800 text-sm">🤝 Send Counter-Offer</p>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><XCircle size={16} /></button>
      </div>
      <div>
        <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))}
          className="w-full border-2 border-orange-300 rounded-xl px-4 py-2.5 font-black text-lg text-right outline-none focus:border-orange-500" />
        <p className="text-xs text-orange-500 mt-1">AI recommends: {fmt(recommended)} EGP</p>
      </div>
      <button onClick={draftMessage} disabled={drafting}
        className="w-full bg-purple-600 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 disabled:opacity-50">
        {drafting ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
        {drafting ? "Drafting..." : "✨ Draft Message with AI"}
      </button>
      <textarea value={message} onChange={e => setMessage(e.target.value)}
        rows={3} placeholder="Your counter-offer message..."
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm resize-none outline-none focus:border-orange-400" />
      <div className="flex gap-2">
        <button onClick={onClose} className="flex-1 border border-gray-200 text-gray-600 font-bold py-2.5 rounded-xl text-sm">Cancel</button>
        <button onClick={() => onSendCounter(amount, message)} disabled={loading || !amount}
          className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-sm flex items-center justify-center gap-2">
          {loading ? <Loader2 size={14} className="animate-spin" /> : null}
          Send Counter
        </button>
      </div>
    </div>
  );
}

const STATUS_CONFIG = {
  offer_sent:      { label: "AWAITING RESPONSE", color: "bg-blue-100 text-blue-700" },
  counter_offered: { label: "COUNTER RECEIVED",  color: "bg-yellow-100 text-yellow-700" },
  negotiating:     { label: "NEGOTIATING",        color: "bg-purple-100 text-purple-700" },
  accepted:        { label: "DEAL ACCEPTED ✅",   color: "bg-green-100 text-green-700" },
  rejected:        { label: "DECLINED",           color: "bg-red-100 text-red-600" },
  deal_closed:     { label: "DEAL CLOSED 🎉",     color: "bg-green-100 text-green-700" },
};

export default function NegotiateDealRoom() {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [offers, setOffers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [chatInput, setChatInput] = useState("");
  const [showCounter, setShowCounter] = useState(false);
  const [counterLoading, setCounterLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiAnswer, setAiAnswer] = useState("");
  const [aiLoading, setAiLoading] = useState(false);
  const [showAcceptance, setShowAcceptance] = useState(null); // offer to accept
  const [activeTab, setActiveTab] = useState("chat"); // mobile tabs: chat | offers | coach
  const messagesEndRef = useRef(null);

  // Determine my role
  const myRole = user?.id === session?.buyerId ? "buyer" : user?.id === session?.sellerId ? "seller" : "buyer";

  const loadData = async () => {
    const sessions = await base44.entities.NegotiationSession.filter({ id: sessionId }).catch(() => []);
    if (!sessions[0]) { setLoading(false); return; }
    setSession(sessions[0]);
    const [offerData, msgData] = await Promise.all([
      base44.entities.NegotiationOffer.filter({ sessionId }).catch(() => []),
      base44.entities.NegotiationMessage.filter({ sessionId }).catch(() => []),
    ]);
    setOffers(offerData.sort((a,b) => new Date(a.created_date) - new Date(b.created_date)));
    setMessages(msgData.sort((a,b) => new Date(a.created_date) - new Date(b.created_date)));
    setLoading(false);
  };

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
    }).catch(() => {});
    loadData();

    // Real-time subscription
    const unsubSession = base44.entities.NegotiationSession.subscribe(ev => {
      if (ev.data?.id === sessionId) setSession(ev.data);
    });
    const unsubOffer = base44.entities.NegotiationOffer.subscribe(ev => {
      if (ev.data?.sessionId === sessionId) {
        setOffers(prev => {
          const exists = prev.find(o => o.id === ev.id);
          return exists ? prev.map(o => o.id === ev.id ? ev.data : o) : [...prev, ev.data];
        });
      }
    });
    const unsubMsg = base44.entities.NegotiationMessage.subscribe(ev => {
      if (ev.data?.sessionId === sessionId) {
        setMessages(prev => {
          const exists = prev.find(m => m.id === ev.id);
          return exists ? prev : [...prev, ev.data];
        });
      }
    });
    return () => { unsubSession(); unsubOffer(); unsubMsg(); };
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!chatInput.trim() || !session) return;
    const optimistic = {
      id: `temp-${Date.now()}`, sessionId, senderId: user?.id,
      senderRole: myRole, messageType: "chat", content: chatInput,
      created_date: new Date().toISOString(),
    };
    setMessages(prev => [...prev, optimistic]);
    setChatInput("");
    await base44.entities.NegotiationMessage.create(optimistic).catch(() => {});
  };

  const sendCounter = async (amount, message) => {
    if (!session) return;
    setCounterLoading(true);
    const newRound = (session.currentRound || 0) + 1;
    const validUntil = new Date(Date.now() + 3 * 86400000).toISOString();
    const listedPrice = session.listedPrice || 0;
    const pct = listedPrice ? Math.round((amount / listedPrice) * 100) : 100;

    const offer = await base44.entities.NegotiationOffer.create({
      sessionId: session.id,
      roundNumber: newRound,
      offeredBy: myRole,
      offererId: user?.id,
      offerAmount: amount,
      offerCurrency: "EGP",
      percentOfListed: pct,
      validUntil,
      offerMessage: message,
      messageLanguage: "en",
      status: "sent",
    }).catch(() => null);

    if (offer) {
      await Promise.all([
        base44.entities.NegotiationSession.update(session.id, {
          status: "counter_offered",
          currentOfferAmount: amount,
          currentOfferBy: myRole,
          currentOfferAt: new Date().toISOString(),
          currentOfferExpiresAt: validUntil,
          currentRound: newRound,
        }),
        base44.entities.NegotiationMessage.create({
          sessionId: session.id, senderId: user?.id,
          senderRole: myRole, messageType: "counter_offer",
          content: message || `Counter-offer: ${fmt(amount)} EGP`,
          relatedOfferId: offer.id,
          relatedOfferAmount: amount,
        }),
      ]).catch(() => {});
      await loadData();
    }
    setCounterLoading(false);
    setShowCounter(false);
  };

  const handleAcceptOffer = async (offer) => {
    if (!session) return;
    await Promise.all([
      base44.entities.NegotiationOffer.update(offer.id, { status: "accepted", respondedAt: new Date().toISOString() }),
      base44.entities.NegotiationSession.update(session.id, {
        status: "accepted",
        agreedPrice: offer.offerAmount,
        agreedPaymentMethod: offer.paymentMethod,
        agreedTimeline: offer.paymentTimeline,
        dealClosedAt: new Date().toISOString(),
      }),
      base44.entities.NegotiationMessage.create({
        sessionId: session.id, senderId: user?.id,
        senderRole: myRole, messageType: "acceptance",
        content: `🎉 Offer of ${fmt(offer.offerAmount)} EGP has been accepted! Deal agreed.`,
        relatedOfferId: offer.id,
      }),
    ]).catch(() => {});
    await loadData();
    setShowAcceptance(null);
  };

  const handleDeclineOffer = async (offer, reason) => {
    if (!session) return;
    await Promise.all([
      base44.entities.NegotiationOffer.update(offer.id, { status: "rejected", respondedAt: new Date().toISOString(), responseType: reason }),
      base44.entities.NegotiationSession.update(session.id, { status: "rejected" }),
      base44.entities.NegotiationMessage.create({
        sessionId: session.id, senderId: user?.id,
        senderRole: myRole, messageType: "rejection",
        content: `Offer declined. Reason: ${reason}`,
        relatedOfferId: offer.id,
      }),
    ]).catch(() => {});
    await loadData();
  };

  const askAI = async () => {
    if (!aiQuestion.trim() || !session) return;
    setAiLoading(true);
    const listedPrice = session.listedPrice || 0;
    const currentOffer = session.currentOfferAmount || 0;
    const strategy = myRole === "buyer" ? session.buyerStrategy : session.sellerStrategy;
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `You are Kemedar Negotiate™ AI coach. 
Role: ${myRole}. Property: ${session.propertySnapshot?.title}. 
Listed: ${fmt(listedPrice)} EGP. Current offer: ${fmt(currentOffer)} EGP. Round: ${session.currentRound}.
${strategy?.briefingSummary ? `Strategy: ${strategy.briefingSummary}` : ""}
Question: ${aiQuestion}
Give specific, actionable coaching in 2-3 sentences. Be direct and use exact numbers.`,
    }).catch(() => null);
    setAiAnswer(typeof res === "string" ? res : res?.choices?.[0]?.message?.content || "Consider a strategic counter that narrows the gap while signaling good faith.");
    setAiLoading(false);
  };

  // Latest pending offer that I need to respond to
  const pendingOfferForMe = offers.find(o =>
    o.status === "sent" && o.offeredBy !== myRole
  );

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <RefreshCw size={28} className="animate-spin text-orange-400" />
    </div>
  );

  if (!session) return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Negotiation session not found.</p>
      <Link to="/dashboard/negotiations" className="text-orange-500 font-bold">← Back</Link>
    </div>
  );

  const listedPrice = session.listedPrice || 0;
  const currentOffer = session.currentOfferAmount || 0;
  const gap = listedPrice - currentOffer;
  const gapPct = listedPrice ? Math.round((gap / listedPrice) * 100) : 0;
  const statusCfg = STATUS_CONFIG[session.status] || STATUS_CONFIG.negotiating;
  const isDeal = session.status === "accepted" || session.status === "deal_closed";
  const isEnded = session.status === "rejected" || session.status === "withdrawn" || session.status === "expired";
  const strategy = myRole === "buyer" ? session.buyerStrategy : session.sellerStrategy;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3 sticky top-0 z-20 shadow-sm">
        <Link to="/dashboard/negotiations" className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
          <ArrowLeft size={16} />
        </Link>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-black text-gray-900 text-sm">🤝 Deal Room</span>
            <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${statusCfg.color}`}>{statusCfg.label}</span>
            <span className="text-[10px] text-gray-400">Round {session.currentRound}</span>
          </div>
          <p className="text-xs text-gray-400 truncate">{session.propertySnapshot?.title}</p>
        </div>
        {session.currentOfferExpiresAt && !isDeal && !isEnded && (
          <div className="flex items-center gap-1 text-xs flex-shrink-0">
            <Clock size={11} className="text-gray-400" />
            <CountdownTimer expiresAt={session.currentOfferExpiresAt} />
          </div>
        )}
      </div>

      {/* Deal success banner */}
      {isDeal && (
        <div className="bg-green-500 text-white px-4 py-3 text-center">
          <p className="font-black">🎉 Deal Agreed at {fmt(session.agreedPrice)} EGP!</p>
          <p className="text-xs text-green-100 mt-0.5">Congratulations to both parties</p>
        </div>
      )}

      {/* Pending offer action bar (mobile-friendly) */}
      {pendingOfferForMe && myRole === "seller" && !isDeal && !isEnded && (
        <SellerOfferReview
          offer={pendingOfferForMe}
          session={session}
          onAccept={() => setShowAcceptance(pendingOfferForMe)}
          onCounter={() => setShowCounter(true)}
          onDecline={(reason) => handleDeclineOffer(pendingOfferForMe, reason)}
        />
      )}

      {/* Mobile tabs */}
      <div className="lg:hidden flex border-b border-gray-200 bg-white">
        {["chat","offers","coach"].map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`flex-1 py-2.5 text-xs font-bold capitalize transition-colors border-b-2 ${activeTab === t ? "text-orange-600 border-orange-500" : "text-gray-400 border-transparent"}`}>
            {t === "chat" ? "💬 Chat" : t === "offers" ? "🤝 Offers" : "🤖 AI Coach"}
          </button>
        ))}
      </div>

      {/* 3-panel body */}
      <div className="flex-1 flex overflow-hidden" style={{ maxHeight: "calc(100vh - 120px)" }}>

        {/* LEFT: Timeline — desktop only */}
        <div className={`w-[220px] flex-shrink-0 bg-white border-r border-gray-100 overflow-y-auto p-4 ${activeTab === "offers" ? "block w-full" : "hidden lg:block"}`}>
          <p className="text-xs font-black text-gray-500 uppercase mb-3 tracking-wide">📊 Offer History</p>
          <div className="space-y-4">
            {[...offers].reverse().map((offer, i) => (
              <div key={offer.id} className="relative pl-4">
                <div className={`absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white shadow ${offer.offeredBy === "buyer" ? "bg-orange-400" : "bg-blue-400"}`} />
                {i < offers.length - 1 && <div className="absolute left-[4px] top-5 w-0.5 h-6 bg-gray-100" />}
                <p className="text-[10px] text-gray-400 font-semibold capitalize">Round {offer.roundNumber} · {offer.offeredBy}</p>
                <p className="text-sm font-black text-gray-900">{fmt(offer.offerAmount)} EGP</p>
                <p className="text-[10px] text-gray-400">{timeAgo(offer.created_date)}</p>
                <span className={`inline-block text-[9px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${
                  offer.status === "accepted" ? "bg-green-100 text-green-600" :
                  offer.status === "rejected" ? "bg-red-100 text-red-500" :
                  offer.status === "countered" ? "bg-gray-100 text-gray-500" :
                  "bg-yellow-100 text-yellow-600"
                }`}>{offer.status}</span>
              </div>
            ))}
          </div>

          {listedPrice > 0 && (
            <div className="mt-5 pt-4 border-t border-gray-100">
              <p className="text-[10px] text-gray-400 font-bold uppercase mb-2">Gap Narrowing</p>
              <p className="text-xs font-semibold text-gray-600">Listed: {fmt(listedPrice)}</p>
              <div className="w-full h-2 bg-gray-100 rounded-full mt-1.5 overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-400 to-green-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, (currentOffer / listedPrice) * 100)}%` }} />
              </div>
              <p className={`text-[10px] font-bold mt-1 ${gap > 0 ? "text-orange-600" : "text-green-600"}`}>
                Gap: {fmt(gap)} EGP ({gapPct}%)
              </p>
            </div>
          )}
        </div>

        {/* CENTER: Chat */}
        <div className={`flex-1 flex flex-col overflow-hidden ${activeTab === "offers" ? "hidden" : activeTab === "coach" ? "hidden lg:flex" : "flex"}`}>
          <div className="flex-1 overflow-y-auto py-4">
            {messages.length === 0 && (
              <div className="text-center text-gray-400 text-sm py-12">No messages yet</div>
            )}
            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} myRole={myRole} />)}
            <div ref={messagesEndRef} />
          </div>

          {/* Counter panel */}
          {showCounter && !isDeal && !isEnded && (
            <CounterPanel session={session} onSendCounter={sendCounter} onClose={() => setShowCounter(false)} loading={counterLoading} />
          )}

          {/* Input bar */}
          {!isDeal && !isEnded && (
            <div className="bg-white border-t border-gray-100 p-3 flex-shrink-0">
              <div className="flex gap-2 mb-2">
                <button onClick={() => setShowCounter(true)}
                  className="flex items-center gap-1.5 bg-orange-500 text-white text-xs font-bold px-3 py-2 rounded-xl">
                  <Handshake size={12} /> {myRole === "buyer" ? "Counter" : "Counter"}
                </button>
                {pendingOfferForMe && myRole === "buyer" && (
                  <button onClick={() => setShowAcceptance(pendingOfferForMe)}
                    className="flex items-center gap-1.5 bg-green-500 text-white text-xs font-bold px-3 py-2 rounded-xl">
                    <CheckCircle size={12} /> Accept Offer
                  </button>
                )}
              </div>
              <div className="flex gap-2">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && sendMessage()}
                  placeholder="Type a message..."
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-orange-400" />
                <button onClick={sendMessage}
                  className="w-10 h-10 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Send size={15} color="white" />
                </button>
              </div>
            </div>
          )}

          {isDeal && (
            <div className="bg-green-50 border-t border-green-200 p-4 text-center">
              <p className="font-black text-green-700 mb-2">🎉 Deal Closed at {fmt(session.agreedPrice)} EGP</p>
              <div className="flex justify-center gap-2">
                <button className="bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-1.5">
                  <FileText size={12} /> Download Deal Summary
                </button>
                <Link to="/dashboard/negotiations" className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs">
                  My Negotiations
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* RIGHT: AI Coach */}
        <div className={`w-[260px] flex-shrink-0 bg-white border-l border-gray-100 overflow-y-auto p-4 ${activeTab === "coach" ? "block w-full" : "hidden lg:block"}`}>
          <div className="flex items-center gap-1.5 mb-0.5">
            <Sparkles size={14} className="text-purple-500" />
            <p className="font-black text-gray-900 text-sm">AI Coach</p>
          </div>
          <p className="text-[9px] text-gray-400 mb-4">Private — other party cannot see this</p>

          {/* Situation card */}
          <div className="bg-gray-50 rounded-xl p-3 space-y-1.5 mb-4 text-xs">
            <div className="flex justify-between"><span className="text-gray-500">Round</span><span className="font-black">{session.currentRound}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Current offer</span><span className="font-black text-orange-600">{fmt(currentOffer)} EGP</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Gap</span><span className="font-black">{fmt(gap)} EGP</span></div>
            {strategy?.walkAwayPrice && (
              <div className="flex justify-between"><span className="text-gray-500">Walk-away</span><span className="font-black text-red-500">{fmt(strategy.walkAwayPrice)} EGP</span></div>
            )}
            {strategy?.minimumAcceptable && (
              <div className="flex justify-between"><span className="text-gray-500">Min acceptable</span><span className="font-black text-red-500">{fmt(strategy.minimumAcceptable)} EGP</span></div>
            )}
          </div>

          {/* Round-specific tip */}
          <div className="bg-purple-50 border border-purple-100 rounded-xl p-3 mb-4">
            <p className="text-[10px] font-black text-purple-600 mb-1">💡 Round {session.currentRound} Tip</p>
            <p className="text-xs text-purple-800 leading-relaxed">
              {session.currentRound === 1
                ? "Seller typically responds within their expected counter range. Hold firm if they come in above your walk-away."
                : session.currentRound === 2
                ? "You're making progress. Consider whether to split the difference or ask for non-price concessions (parking, fixtures, A/C units)."
                : "You're close. One last firm counter or a small concession could close the deal. Don't give too much away this late."}
            </p>
          </div>

          {/* Ask AI */}
          <div className="mb-4">
            <p className="text-xs font-black text-gray-600 mb-2">🤖 Ask AI Coach</p>
            <textarea value={aiQuestion} onChange={e => setAiQuestion(e.target.value)} rows={3}
              placeholder="Should I accept? What should I counter at?"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs resize-none outline-none focus:border-purple-400" />
            <button onClick={askAI} disabled={aiLoading || !aiQuestion.trim()}
              className="w-full mt-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5">
              {aiLoading ? <Loader2 size={11} className="animate-spin" /> : <Sparkles size={11} />}
              {aiLoading ? "Thinking..." : "Get Advice"}
            </button>
            {aiAnswer && (
              <div className="mt-3 bg-purple-50 border border-purple-100 rounded-xl p-3">
                <p className="text-xs text-purple-800 leading-relaxed">{aiAnswer}</p>
              </div>
            )}
          </div>

          {/* Journey */}
          {offers.filter(o => o.offeredBy === myRole).length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Your Offer Journey</p>
              <div className="space-y-1 text-xs">
                {offers.filter(o => o.offeredBy === myRole).map(o => (
                  <div key={o.id} className="flex justify-between">
                    <span className="text-gray-500">Round {o.roundNumber}</span>
                    <span className="font-bold text-gray-700">{fmt(o.offerAmount)} EGP</span>
                  </div>
                ))}
                {listedPrice > 0 && (
                  <div className="flex justify-between pt-1 border-t border-gray-100 text-green-600">
                    <span>Listed</span>
                    <span className="font-bold">{fmt(listedPrice)} EGP</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Acceptance modal */}
      {showAcceptance && (
        <DealAcceptanceModal
          offer={showAcceptance}
          session={session}
          onConfirm={() => handleAcceptOffer(showAcceptance)}
          onClose={() => setShowAcceptance(null)}
        />
      )}
    </div>
  );
}