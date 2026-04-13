import { useState } from "react";
import { Copy, Phone, MessageSquare, Video, Mail, Lightbulb, Mic, Bot, Zap, ChevronRight } from "lucide-react";
import ChatbotModule from "@/components/mobile-v2/ChatbotModule";

const ONLINE_REPS = [
  { name: "Khaled M.", initials: "KM", color: "bg-blue-100 text-blue-700" },
  { name: "Sara A.", initials: "SA", color: "bg-purple-100 text-purple-700" },
  { name: "Omar T.", initials: "OT", color: "bg-green-100 text-green-700" },
];

const FRANCHISE_REPS = [
  { name: "Ahmed Hassan", role: "Country Franchise Owner", area: "Egypt", color: "bg-orange-100 text-orange-700", initials: "AH", online: true },
  { name: "Sara Mohamed", role: "Area Representative", area: "Cairo West", color: "bg-blue-100 text-blue-700", initials: "SM", online: true },
  { name: "Omar Khalid", role: "Area Representative", area: "Cairo East", color: "bg-teal-100 text-teal-700", initials: "OK", online: false },
  { name: "Layla Nour", role: "Area Representative", area: "Alexandria", color: "bg-pink-100 text-pink-700", initials: "LN", online: true },
];

const CALL_LOG = [
  { icon: "📞", label: "Kemedar Support", duration: "4m 32s", date: "Today, 2:15 PM", outcome: "Answered" },
  { icon: "📞", label: "Area Rep — Cairo", duration: "—", date: "Yesterday, 11:00 AM", outcome: "Missed" },
  { icon: "📞", label: "Kemedar Support", duration: "1m 10s", date: "Mar 18, 2026", outcome: "Answered" },
];

const CONTACT_BUTTONS = [
  { icon: MessageSquare, label: "Chat with Bot", sub: "AI assistant 24/7", bg: "bg-orange-600" },
  { icon: MessageSquare, label: "Message Chat", sub: "Chat with us now", bg: "bg-blue-600" },
  { icon: Mic, label: "Voice Chat", sub: "Start voice call", bg: "bg-green-600" },
  { icon: Video, label: "Video Chat", sub: "Start video call", bg: "bg-purple-600" },
  { icon: Phone, label: "Call Kemedar", sub: "Direct phone call", bg: "bg-orange-500" },
  { icon: Mail, label: "Send Inquiry", sub: "Send us a message", bg: "bg-blue-900" },
  { icon: Lightbulb, label: "Feedback", sub: "Share your thoughts", bg: "bg-gray-600" },
];

function InquiryModal({ onClose }) {
  const [module, setModule] = useState("Kemedar");
  const [priority, setPriority] = useState("Normal");
  const MODULES = ["Kemedar", "Kemetro", "Kemework", "General"];
  const PRIORITIES = ["Normal", "Urgent"];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-lg mx-4 p-6 shadow-xl">
        <h2 className="font-black text-gray-900 text-lg mb-4">Send Inquiry</h2>
        <div className="space-y-4">
          <input placeholder="Subject" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-orange-400" />
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">Module</p>
            <div className="flex gap-2 flex-wrap">
              {MODULES.map(m => <button key={m} onClick={() => setModule(m)} className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${module === m ? "bg-orange-600 text-white border-orange-600" : "border-gray-200 text-gray-600"}`}>{m}</button>)}
            </div>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-2">Priority</p>
            <div className="flex gap-2">
              {PRIORITIES.map(p => <button key={p} onClick={() => setPriority(p)} className={`text-xs font-bold px-4 py-1.5 rounded-full border transition-colors ${priority === p ? "bg-orange-600 text-white border-orange-600" : "border-gray-200 text-gray-600"}`}>{p}</button>)}
            </div>
          </div>
          <textarea placeholder="Message..." rows={5} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-orange-400" />
          <div className="flex gap-3 justify-end pt-2 border-t border-gray-100">
            <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button onClick={onClose} className="px-5 py-2.5 bg-orange-600 text-white font-bold rounded-xl text-sm hover:bg-orange-700">Send Inquiry</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function FeedbackModal({ onClose }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl w-full max-w-md mx-4 p-6 shadow-xl">
        <h2 className="font-black text-gray-900 text-lg mb-1">Feedback</h2>
        <p className="text-sm text-gray-500 mb-4">How is your experience?</p>
        <div className="flex justify-center gap-3 mb-4">
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setRating(s)} className="text-3xl transition-transform hover:scale-110">
              {s <= rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Tell us more..." rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-orange-400 mb-4" />
        <div className="flex gap-3 justify-end">
          <button onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
          <button onClick={onClose} className="px-5 py-2.5 bg-orange-600 text-white font-bold rounded-xl text-sm hover:bg-orange-700">Submit Feedback</button>
        </div>
      </div>
    </div>
  );
}

export default function ContactKemedarDesktop() {
  const [copied, setCopied] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const EXT = "EXT-4821";

  const handleCopy = () => {
    navigator.clipboard.writeText(EXT).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactBtn = (label) => {
    if (label === "Chat with Bot") setShowChatbot(true);
    else if (label === "Send Inquiry") setActiveModal("inquiry");
    else if (label === "Feedback") setActiveModal("feedback");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {copied && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg">
          ✅ Copied to clipboard!
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 space-y-6">
        <div>
          <h1 className="text-3xl font-black text-gray-900 mb-1">Contact Kemedar</h1>
          <p className="text-gray-500">Reach our support team or AI assistant instantly</p>
        </div>

        {/* AI Bot Hero */}
        <div
          onClick={() => setShowChatbot(true)}
          className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-8 shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-[1.01]"
        >
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                <Bot size={32} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-xl leading-tight">Kemedar AI Bot</p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-2.5 h-2.5 bg-green-300 rounded-full animate-pulse" />
                  <p className="text-orange-100 text-sm font-medium">Always online · Instant replies</p>
                </div>
              </div>
            </div>
            <ChevronRight size={24} className="text-white/70 mt-2" />
          </div>
          <p className="text-white/90 text-base mb-5 leading-relaxed max-w-2xl">
            Ask anything about Kemedar — properties, agents, franchise owners, Kemework services, Kemetro products and more. Get instant AI-powered answers 24/7.
          </p>
          <div className="flex flex-wrap gap-2 mb-5">
            {["🏠 Search Properties", "👷 Find Agents", "🔧 Kemework", "🛒 Kemetro", "🏢 Franchise Info"].map(tag => (
              <span key={tag} className="text-xs font-bold bg-white/20 text-white px-3 py-1.5 rounded-full">{tag}</span>
            ))}
          </div>
          <div className="bg-white/20 rounded-xl px-5 py-3.5 flex items-center gap-3 max-w-sm">
            <Zap size={18} className="text-yellow-300 flex-shrink-0" />
            <p className="text-white text-sm font-bold">Click to chat with Kemedar AI Bot →</p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6">
          {/* Left column */}
          <div className="col-span-2 space-y-6">
            {/* Contact Buttons */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-black text-gray-900 text-base mb-4">Get in Touch</h2>
              <div className="grid grid-cols-4 gap-3">
                {CONTACT_BUTTONS.map(btn => {
                  const Icon = btn.icon;
                  return (
                    <button key={btn.label} onClick={() => handleContactBtn(btn.label)}
                      className={`${btn.bg} rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:opacity-90 transition-opacity`}>
                      <Icon size={22} className="text-white" />
                      <div className="text-center">
                        <p className="text-xs font-black text-white leading-tight">{btn.label}</p>
                        <p className="text-[10px] text-white/70 leading-tight">{btn.sub}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Representatives */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="font-black text-gray-900 text-base mb-4">Representatives</h2>
              <div className="divide-y divide-gray-50">
                {FRANCHISE_REPS.map(rep => (
                  <div key={rep.name} className="flex items-center gap-4 py-3">
                    <div className="relative flex-shrink-0">
                      <div className={`w-10 h-10 rounded-full ${rep.color} flex items-center justify-center text-xs font-black`}>{rep.initials}</div>
                      <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${rep.online ? "bg-green-500" : "bg-gray-300"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900">{rep.name}</p>
                      <p className="text-xs text-gray-400">{rep.role} · {rep.area}</p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {["📞", "💬", "📧"].map(ic => (
                        <button key={ic} className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-sm transition-colors">{ic}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Broadcast */}
            <div className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-orange-400 shadow-sm p-6">
              <h2 className="font-black text-gray-900 text-base mb-1">Add Request for All Representatives</h2>
              <p className="text-sm text-gray-500 mb-4">Send a message to all Kemedar representatives in your network</p>
              <input placeholder="Subject" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-orange-400" />
              <textarea placeholder="Message..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none mb-3 focus:outline-none focus:border-orange-400" />
              <button className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-2.5 px-6 rounded-xl text-sm transition-colors">📣 Send to All</button>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Extension */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                  <Phone size={18} className="text-orange-600" />
                </div>
                <p className="font-black text-gray-900 text-sm">Your Kemedar Extension</p>
              </div>
              <button onClick={handleCopy} className="flex items-center gap-2 mb-1">
                <span className="text-2xl font-black text-orange-600">{EXT}</span>
                <Copy size={14} className="text-gray-400" />
              </button>
              <p className="text-xs text-gray-400 mb-3">Click to copy</p>
              <button className="text-xs text-blue-600 font-bold">📱 How to install chat app →</button>
            </div>

            {/* Online now */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-black text-gray-900 text-sm">Online Now</p>
                <div className="flex items-center gap-1">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  <p className="text-xs text-gray-500">{ONLINE_REPS.length} online</p>
                </div>
              </div>
              <div className="space-y-3">
                {ONLINE_REPS.map(rep => (
                  <div key={rep.name} className="flex items-center gap-2">
                    <div className="relative flex-shrink-0">
                      <div className={`w-8 h-8 rounded-full ${rep.color} flex items-center justify-center text-xs font-black`}>{rep.initials}</div>
                      <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 rounded-full border border-white" />
                    </div>
                    <p className="text-xs font-bold text-gray-700 flex-1">{rep.name}</p>
                    <button className="text-[10px] text-orange-600 font-bold">Chat</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Call Log */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <p className="font-black text-gray-900 text-sm">Call History</p>
                <button className="text-xs font-bold text-orange-600">View all →</button>
              </div>
              <div className="divide-y divide-gray-50">
                {CALL_LOG.map((call, i) => (
                  <div key={i} className="flex items-center gap-2 py-2.5">
                    <span className="text-base flex-shrink-0">{call.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-bold text-gray-900 truncate">{call.label}</p>
                      <p className="text-[10px] text-gray-400">{call.date}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${call.outcome === "Answered" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                      {call.outcome}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeModal === "inquiry" && <InquiryModal onClose={() => setActiveModal(null)} />}
      {activeModal === "feedback" && <FeedbackModal onClose={() => setActiveModal(null)} />}
      {showChatbot && <ChatbotModule onClose={() => setShowChatbot(false)} />}
    </div>
  );
}