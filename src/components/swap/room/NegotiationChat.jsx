import { useState, useRef, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Send, Paperclip } from "lucide-react";

function SystemMessage({ text }) {
  return (
    <div className="flex justify-center my-2">
      <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full">{text}</span>
    </div>
  );
}

function ChatBubble({ message, isOwn }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div
        className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
          isOwn
            ? "bg-[#7C3AED] text-white rounded-tr-sm"
            : "bg-white border border-gray-200 text-gray-800 rounded-tl-sm shadow-sm"
        }`}
      >
        {message.messageText}
        <p className={`text-[10px] mt-1 ${isOwn ? "text-purple-200" : "text-gray-400"} text-right`}>
          {new Date(message.created_date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
}

function CounterOfferBubble({ message, isOwn, onAccept, onCounter }) {
  return (
    <div className={`flex ${isOwn ? "justify-end" : "justify-start"} mb-2`}>
      <div className="max-w-[85%] border-2 border-[#7C3AED] rounded-2xl overflow-hidden bg-white shadow-sm">
        <div className="bg-purple-50 px-4 py-2 border-b border-purple-100">
          <p className="text-[11px] font-black text-[#7C3AED] uppercase tracking-wider">💱 Counter-Offer</p>
        </div>
        <div className="px-4 py-3">
          <p className="font-black text-gray-900 text-lg">{Number(message.proposedGapEGP).toLocaleString()} EGP</p>
          <p className="text-xs text-gray-500 mt-0.5">{message.messageText}</p>
        </div>
        {!isOwn && (
          <div className="flex border-t border-gray-100">
            <button onClick={onAccept} className="flex-1 py-2 text-xs font-bold text-green-700 hover:bg-green-50 transition-colors border-r border-gray-100">
              ✅ Accept
            </button>
            <button onClick={onCounter} className="flex-1 py-2 text-xs font-bold text-[#7C3AED] hover:bg-purple-50 transition-colors">
              ✏️ Counter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function NegotiationChat({
  matchId, userId, isUserA, messages,
  offers, onRefresh, onOpenCounter, pendingOfferFromOther
}) {
  const [text, setText] = useState("");
  const [sending, setSending] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!text.trim()) return;
    setSending(true);
    await base44.entities.SwapNegotiationMessage.create({
      matchId,
      senderUserId: userId,
      messageType: "text",
      messageText: text.trim(),
    });
    setText("");
    onRefresh();
    setSending(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col h-full overflow-hidden">
      {/* Chat header */}
      <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between flex-shrink-0">
        <h3 className="font-black text-gray-900 text-base">💬 Negotiation Chat</h3>
        <span className="text-xs text-gray-400">{messages.length} messages</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3">
        {messages.length === 0 && (
          <SystemMessage text="🎉 You both matched! Start negotiating." />
        )}
        {messages.map((msg, i) => {
          if (msg.messageType === "system") return <SystemMessage key={msg.id || i} text={msg.messageText} />;
          if (msg.messageType === "counter_offer") {
            return (
              <CounterOfferBubble
                key={msg.id || i}
                message={msg}
                isOwn={msg.senderUserId === userId}
                onAccept={() => { /* accept via ledger */ }}
                onCounter={onOpenCounter}
              />
            );
          }
          return <ChatBubble key={msg.id || i} message={msg} isOwn={msg.senderUserId === userId} />;
        })}
        <div ref={bottomRef} />
      </div>

      {/* Quick actions */}
      <div className="px-4 pt-2 pb-1 flex gap-2 flex-shrink-0 border-t border-gray-50">
        <button
          onClick={onOpenCounter}
          className="flex items-center gap-1 text-xs font-bold text-[#7C3AED] bg-purple-50 px-3 py-1.5 rounded-full hover:bg-purple-100 transition-colors"
        >
          💱 Counter-Offer
        </button>
        <button className="flex items-center gap-1 text-xs font-bold text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full hover:bg-gray-100 transition-colors">
          📅 Schedule Viewing
        </button>
      </div>

      {/* Chat input */}
      <div className="px-4 pb-4 pt-2 flex gap-2 items-center flex-shrink-0">
        <button className="text-gray-400 hover:text-gray-600 transition-colors">
          <Paperclip size={18} />
        </button>
        <input
          type="text"
          value={text}
          onChange={e => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type a message..."
          className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-[#7C3AED]"
          style={{ height: 44 }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim() || sending}
          className="w-10 h-10 rounded-xl bg-[#7C3AED] flex items-center justify-center text-white disabled:opacity-40 hover:bg-purple-700 transition-colors flex-shrink-0"
        >
          <Send size={16} />
        </button>
      </div>
    </div>
  );
}