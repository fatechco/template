import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Copy, Phone, MessageSquare, Video, Mail, Lightbulb, Mic, Bot, Zap, ChevronRight } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";
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

function CopiedToast({ show }) {
  if (!show) return null;
  return (
    <div className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white font-bold text-xs px-4 py-2 rounded-full shadow-lg">
      ✅ Copied to clipboard!
    </div>
  );
}

function InquirySheet({ onClose }) {
  const [module, setModule] = useState("Kemedar");
  const [priority, setPriority] = useState("Normal");
  const MODULES = ["Kemedar", "Kemetro", "Kemework", "General"];
  const PRIORITIES = ["Normal", "Urgent"];
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-[480px] mx-auto p-5" style={{ maxHeight: "90vh", overflowY: "auto" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <p className="font-black text-gray-900 text-base mb-4">Send Inquiry</p>
        <div className="space-y-3">
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
          <button className="w-full border-2 border-dashed border-gray-300 rounded-xl py-3 text-sm text-gray-500 font-bold">📎 Attach File (optional)</button>
          <button onClick={onClose} className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-sm">Send Inquiry</button>
        </div>
      </div>
    </div>
  );
}

function FeedbackSheet({ onClose }) {
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-[480px] mx-auto p-5">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4" />
        <p className="font-black text-gray-900 text-base mb-1">Feedback</p>
        <p className="text-sm text-gray-500 mb-4">How is your experience?</p>
        <div className="flex justify-center gap-3 mb-4">
          {[1,2,3,4,5].map(s => (
            <button key={s} onClick={() => setRating(s)} className="text-3xl transition-transform active:scale-110">
              {s <= rating ? "⭐" : "☆"}
            </button>
          ))}
        </div>
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Tell us more..." rows={4}
          className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-orange-400 mb-3" />
        <button onClick={onClose} className="w-full bg-orange-600 text-white font-bold py-3.5 rounded-2xl text-sm">Submit Feedback</button>
      </div>
    </div>
  );
}

export default function ContactKemedarPage() {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [activeSheet, setActiveSheet] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const EXT = "EXT-4821";

  const handleCopy = () => {
    navigator.clipboard.writeText(EXT).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleContactBtn = (label) => {
    if (label === "Chat with Bot") setShowChatbot(true);
    else if (label === "Send Inquiry") setActiveSheet("inquiry");
    else if (label === "Feedback") setActiveSheet("feedback");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28 max-w-[480px] mx-auto">
      <CopiedToast show={copied} />
      <MobileTopBar title="Contact Kemedar" showBack />

      <div className="px-4 py-4 space-y-4">

        {/* AI Bot Hero Card */}
        <div
          onClick={() => setShowChatbot(true)}
          className="bg-gradient-to-br from-orange-600 to-orange-500 rounded-2xl p-5 shadow-lg cursor-pointer active:scale-[0.98] transition-transform"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                <Bot size={26} className="text-white" />
              </div>
              <div>
                <p className="text-white font-black text-base leading-tight">Kemedar AI Bot</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-2 h-2 bg-green-300 rounded-full animate-pulse" />
                  <p className="text-orange-100 text-xs font-medium">Always online · Instant replies</p>
                </div>
              </div>
            </div>
            <ChevronRight size={20} className="text-white/70 mt-1" />
          </div>

          <p className="text-white/90 text-sm mb-4 leading-relaxed">
            Ask anything about Kemedar — properties, agents, franchise owners, Kemework services, Kemetro products and more. Get instant AI-powered answers 24/7.
          </p>

          <div className="flex flex-wrap gap-2 mb-4">
            {["🏠 Search Properties", "👷 Find Agents", "🔧 Kemework", "🛒 Kemetro", "🏢 Franchise Info"].map(tag => (
              <span key={tag} className="text-[11px] font-bold bg-white/20 text-white px-2.5 py-1 rounded-full">{tag}</span>
            ))}
          </div>

          <div className="bg-white/20 rounded-xl px-4 py-3 flex items-center gap-3">
            <Zap size={16} className="text-yellow-300 flex-shrink-0" />
            <p className="text-white text-xs font-bold flex-1">Tap to chat with Kemedar AI Bot →</p>
          </div>
        </div>

        {/* Section 1: Extension */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
              <Phone size={18} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <p className="text-[14px] font-black text-gray-900">Your Kemedar Extension</p>
              <button onClick={handleCopy}
                className="flex items-center gap-2 mt-1">
                <span className="text-xl font-black text-orange-600">{EXT}</span>
                <Copy size={14} className="text-gray-400" />
              </button>
              <p className="text-[10px] text-gray-400 mt-0.5">Tap to copy</p>
            </div>
          </div>
          <button className="text-xs text-blue-600 font-bold mt-3">📱 How to install chat app →</button>
        </div>

        {/* Section 2: Online now */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-black text-gray-900">Online Now in Your Area</p>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <p className="text-[12px] text-gray-500">{ONLINE_REPS.length} online</p>
            </div>
          </div>
          <div className="flex gap-3 overflow-x-auto no-scrollbar">
            {ONLINE_REPS.map(rep => (
              <div key={rep.name} className="flex flex-col items-center flex-shrink-0 w-14">
                <div className="relative">
                  <div className={`w-10 h-10 rounded-full ${rep.color} flex items-center justify-center text-xs font-black`}>{rep.initials}</div>
                  <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                </div>
                <p className="text-[10px] text-gray-700 font-bold mt-1 text-center leading-tight truncate w-full">{rep.name}</p>
                <p className="text-[9px] text-orange-600 font-bold">Chat</p>
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Contact options */}
        <div>
          <p className="text-base font-black text-gray-900 mb-3">Get in Touch</p>
          <div className="grid grid-cols-2 gap-3">
            {CONTACT_BUTTONS.map(btn => {
              const Icon = btn.icon;
              return (
                <button key={btn.label} onClick={() => handleContactBtn(btn.label)}
                  className={`${btn.bg} rounded-2xl p-4 flex flex-col items-center justify-center gap-2 h-[70px] shadow-sm`}>
                  <Icon size={22} className="text-white" />
                  <div>
                    <p className="text-[12px] font-black text-white leading-tight">{btn.label}</p>
                    <p className="text-[10px] text-white/70 leading-tight">{btn.sub}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section 4: Franchise contacts */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-[14px] font-black text-gray-900 mb-3">Other Representatives</p>
          {FRANCHISE_REPS.map((rep, i) => (
            <div key={rep.name} className={`flex items-center gap-3 py-3 ${i < FRANCHISE_REPS.length - 1 ? "border-b border-gray-50" : ""}`}>
              <div className="relative flex-shrink-0">
                <div className={`w-10 h-10 rounded-full ${rep.color} flex items-center justify-center text-xs font-black`}>{rep.initials}</div>
                <div className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-white ${rep.online ? "bg-green-500" : "bg-gray-300"}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold text-gray-900">{rep.name}</p>
                <p className="text-[11px] text-gray-400">{rep.role} · {rep.area}</p>
              </div>
              <div className="flex gap-1.5 flex-shrink-0">
                {["📞", "💬", "📧"].map(ic => (
                  <button key={ic} className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-sm">{ic}</button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Section 5: Broadcast */}
        <div className="bg-white rounded-2xl border border-gray-100 border-l-4 border-l-orange-400 shadow-sm p-4">
          <p className="text-[14px] font-black text-gray-900 mb-1">Add Request for All Representatives</p>
          <p className="text-[12px] text-gray-500 mb-3">Send a message to all Kemedar representatives in your network</p>
          <input placeholder="Subject" className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm mb-2 focus:outline-none focus:border-orange-400" />
          <textarea placeholder="Message..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm resize-none mb-3 focus:outline-none focus:border-orange-400" />
          <button className="w-full bg-orange-600 text-white font-bold py-3 rounded-xl text-sm">📣 Send to All</button>
        </div>

        {/* Section 6: Call log */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[14px] font-black text-gray-900">Call History</p>
            <button className="text-xs font-bold text-orange-600">View all →</button>
          </div>
          <div className="space-y-0">
            {CALL_LOG.map((call, i) => (
              <div key={i} className={`flex items-center gap-3 py-3 ${i < CALL_LOG.length - 1 ? "border-b border-gray-50" : ""}`}>
                <span className="text-xl flex-shrink-0">{call.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-gray-900 truncate">{call.label}</p>
                  <p className="text-[11px] text-gray-400">{call.date} · {call.duration}</p>
                </div>
                <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${call.outcome === "Answered" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500"}`}>
                  {call.outcome}
                </span>
              </div>
            ))}
          </div>
          <button className="text-xs font-bold text-orange-600 mt-2">View Full Call History →</button>
        </div>

      </div>

      {activeSheet === "inquiry" && <InquirySheet onClose={() => setActiveSheet(null)} />}
      {activeSheet === "feedback" && <FeedbackSheet onClose={() => setActiveSheet(null)} />}
      {showChatbot && <ChatbotModule onClose={() => setShowChatbot(false)} />}
    </div>
  );
}