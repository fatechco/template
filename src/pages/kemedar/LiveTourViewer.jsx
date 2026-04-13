import { useState, useEffect, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { Send, Heart, ThumbsUp, Eye, Share2, ChevronLeft, Zap } from "lucide-react";
import { base44 } from "@/api/base44Client";

const SAMPLE_MESSAGES = [
  { id: 1, sender: "Ahmed K.", role: "buyer", content: "What floor is this apartment on?", type: "question", time: "2:15" },
  { id: 2, sender: "Host", role: "host", content: "It's on the 8th floor with elevator access!", type: "answer", time: "2:16" },
  { id: 3, sender: "Sara M.", role: "buyer", content: "Does it come with parking?", type: "question", time: "2:18" },
  { id: 4, sender: "Khaled R.", role: "buyer", content: "❤️", type: "reaction", time: "2:19" },
  { id: 5, sender: "Host", role: "host", content: "Yes, one dedicated parking spot in the basement!", type: "answer", time: "2:20" }
];

export default function LiveTourViewerPage() {
  const { sessionId } = useParams();
  const [session, setSession] = useState(null);
  const [messages, setMessages] = useState(SAMPLE_MESSAGES);
  const [newMessage, setNewMessage] = useState("");
  const [activeTab, setActiveTab] = useState("chat");
  const [viewers, setViewers] = useState(23);
  const [isLive, setIsLive] = useState(true);
  const [timer, setTimer] = useState(0);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Load session
    base44.entities.LiveTourSession.filter({ id: sessionId })
      .then(data => { if (data.length) setSession(data[0]); })
      .catch(() => {});

    const interval = setInterval(() => setTimer(t => t + 1), 1000);
    return () => clearInterval(interval);
  }, [sessionId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${String(sec).padStart(2, '0')}`;
  };

  const handleSend = () => {
    if (!newMessage.trim()) return;
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "You",
      role: "buyer",
      content: newMessage,
      type: "chat",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }]);
    setNewMessage("");
  };

  const handleReaction = (emoji) => {
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: "You",
      role: "buyer",
      content: emoji,
      type: "reaction",
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }]);
  };

  return (
    <div className="fixed inset-0 bg-black text-white flex flex-col md:flex-row overflow-hidden">
      {/* LEFT: Video Area */}
      <div className="flex-1 flex flex-col relative min-h-0">
        {/* Video Placeholder */}
        <div className="flex-1 bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center relative">
          <img
            src="https://images.unsplash.com/photo-1560184897-ae75f418493e?w=1200&q=80"
            alt="Live Tour"
            className="absolute inset-0 w-full h-full object-cover opacity-60"
          />

          {/* Top Bar */}
          <div className="absolute top-0 inset-x-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-3">
              <Link 
                to="/"
                className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </Link>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                <span className="text-xs font-black text-red-400">LIVE</span>
                <span className="text-xs text-gray-300 font-mono">{formatTime(timer)}</span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm flex items-center gap-1">
                <Eye className="w-4 h-4" /> {viewers}
              </span>
              <button className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Host Badge */}
          <div className="absolute bottom-16 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-3 py-1.5 text-sm">
            📹 Mohamed Hassan — Live
          </div>

          {/* Reactions */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {["❤️", "👍", "😮", "🏠"].map(emoji => (
              <button
                key={emoji}
                onClick={() => handleReaction(emoji)}
                className="w-10 h-10 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full text-xl flex items-center justify-center transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* RIGHT: Chat Panel */}
      <div className="w-full md:w-96 bg-gray-950 flex flex-col border-l border-gray-800 min-h-0 max-h-[50vh] md:max-h-full">
        {/* Tabs */}
        <div className="grid grid-cols-3 border-b border-gray-800 flex-shrink-0">
          {[
            { id: "chat", label: "💬 Chat" },
            { id: "questions", label: "❓ Q&A" },
            { id: "info", label: "ℹ️ Info" }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`py-3 text-xs font-bold transition-colors border-b-2 ${
                activeTab === t.id
                  ? "text-orange-400 border-orange-500"
                  : "text-gray-400 border-transparent hover:text-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {activeTab === "chat" && messages.map(msg => (
            <div key={msg.id} className={`text-sm ${msg.sender === "You" ? "text-right" : ""}`}>
              {msg.type === "reaction" ? (
                <span className="text-2xl">{msg.content}</span>
              ) : (
                <div className={`inline-block max-w-xs ${
                  msg.role === "host" ? "bg-orange-500/20 border border-orange-500/30" :
                  msg.sender === "You" ? "bg-blue-500/20" : "bg-gray-800"
                } rounded-xl px-3 py-2`}>
                  <p className={`text-xs font-bold mb-1 ${
                    msg.role === "host" ? "text-orange-400" :
                    msg.sender === "You" ? "text-blue-400" : "text-gray-400"
                  }`}>{msg.sender}</p>
                  <p className={msg.type === "question" ? "font-semibold" : ""}>{msg.content}</p>
                </div>
              )}
            </div>
          ))}

          {activeTab === "questions" && (
            <div className="space-y-3">
              {messages.filter(m => m.type === "question" || m.type === "answer").map(msg => (
                <div key={msg.id} className={`p-3 rounded-xl ${
                  msg.type === "question" ? "bg-gray-800" : "bg-orange-500/10 border border-orange-500/30"
                }`}>
                  <p className="text-xs font-bold text-gray-400 mb-1">
                    {msg.type === "question" ? `❓ ${msg.sender}` : `✅ Host answered`}
                  </p>
                  <p className="text-sm">{msg.content}</p>
                </div>
              ))}
            </div>
          )}

          {activeTab === "info" && (
            <div className="space-y-4">
              <div>
                <p className="font-black text-gray-100 mb-3">Property Details</p>
                <div className="space-y-2 text-sm text-gray-400">
                  <div className="flex justify-between"><span>Price</span><span className="font-bold text-orange-400">3,500,000 EGP</span></div>
                  <div className="flex justify-between"><span>Size</span><span className="font-bold text-white">185 m²</span></div>
                  <div className="flex justify-between"><span>Bedrooms</span><span className="font-bold text-white">3</span></div>
                  <div className="flex justify-between"><span>Location</span><span className="font-bold text-white">New Cairo</span></div>
                </div>
              </div>
              <div className="space-y-2">
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                  🤝 Make an Offer
                </button>
                <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">
                  💬 Message Host
                </button>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        {activeTab === "chat" && (
          <div className="border-t border-gray-800 p-3 flex-shrink-0">
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSend()}
                placeholder="Type a message..."
                className="flex-1 bg-gray-800 text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-1 focus:ring-orange-500"
              />
              <button
                onClick={handleSend}
                className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}