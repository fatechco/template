import { useState } from "react";
import { Send, Phone, Video, Paperclip } from "lucide-react";

const MOCK_CONVERSATIONS = [
  { id: 1, avatar: "AH", name: "Ahmed Hassan", last: "Can you help me with the documents?", time: "5m", unread: 2, messages: [
    { from: "them", text: "Hello, I need help with my property listing", time: "10:20 AM" },
    { from: "me", text: "Sure! What do you need?", time: "10:22 AM" },
    { from: "them", text: "Can you help me with the documents?", time: "10:25 AM" },
  ]},
  { id: 2, avatar: "KH", name: "Kemedar HQ", last: "Your February report is ready", time: "1h", unread: 1, messages: [
    { from: "them", text: "Your February report is ready for review", time: "9:00 AM" },
  ]},
  { id: 3, avatar: "FM", name: "Fatima Mohamed", last: "I'd like to schedule a viewing", time: "2h", unread: 0, messages: [
    { from: "me", text: "Hi Fatima! How can I help?", time: "8:30 AM" },
    { from: "them", text: "I'd like to schedule a viewing", time: "8:35 AM" },
  ]},
  { id: 4, avatar: "OR", name: "Omar Rashid", last: "The handyman finished the job", time: "3h", unread: 0, messages: [
    { from: "them", text: "The handyman finished the job — please verify", time: "7:45 AM" },
  ]},
  { id: 5, avatar: "SK", name: "Sara Khaled", last: "Invoice has been paid ✅", time: "5h", unread: 0, messages: [
    { from: "them", text: "Invoice #INV-045 has been paid ✅", time: "6:00 AM" },
  ]},
];

export default function FranchiseMessages() {
  const [active, setActive] = useState(MOCK_CONVERSATIONS[0]);
  const [msg, setMsg] = useState("");
  const [conversations, setConversations] = useState(MOCK_CONVERSATIONS);

  const send = () => {
    if (!msg.trim()) return;
    const updated = conversations.map(c => c.id === active.id
      ? { ...c, messages: [...c.messages, { from: "me", text: msg, time: "now" }], last: msg }
      : c
    );
    setConversations(updated);
    setActive(updated.find(c => c.id === active.id));
    setMsg("");
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-black text-gray-900">💬 Conversations</h1>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex h-[calc(100vh-220px)] min-h-[500px]">
        {/* Left: conversation list */}
        <div className="w-72 border-r border-gray-100 flex flex-col flex-shrink-0">
          <div className="p-3 border-b border-gray-100">
            <input placeholder="Search conversations..." className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none" />
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.map(c => (
              <button key={c.id} onClick={() => setActive(c)} className={`w-full flex items-center gap-3 px-4 py-3.5 border-b border-gray-50 text-left transition-colors ${active.id === c.id ? "bg-orange-50" : "hover:bg-gray-50"}`}>
                <div className="w-10 h-10 rounded-full bg-[#1a1a2e] text-white text-xs font-bold flex items-center justify-center flex-shrink-0 relative">
                  {c.avatar}
                  {c.unread > 0 && <span className="absolute -top-1 -right-1 w-4 h-4 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">{c.unread}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-bold ${c.unread > 0 ? "text-gray-900" : "text-gray-700"}`}>{c.name}</p>
                    <span className="text-[10px] text-gray-400">{c.time}</span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{c.last}</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Right: active chat */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#1a1a2e] text-white text-xs font-bold flex items-center justify-center">{active.avatar}</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{active.name}</p>
                <p className="text-xs text-green-500">Online</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center"><Phone size={16} /></button>
              <button className="w-8 h-8 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center"><Video size={16} /></button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-3">
            {active.messages.map((m, i) => (
              <div key={i} className={`flex ${m.from === "me" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 text-sm ${m.from === "me" ? "bg-[#1a1a2e] text-white" : "bg-gray-100 text-gray-900"}`}>
                  <p>{m.text}</p>
                  <p className={`text-[10px] mt-1 ${m.from === "me" ? "text-white/50" : "text-gray-400"}`}>{m.time}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div className="px-5 py-3 border-t border-gray-100 flex items-center gap-3">
            <button className="text-gray-400 hover:text-gray-600"><Paperclip size={18} /></button>
            <input
              value={msg}
              onChange={e => setMsg(e.target.value)}
              onKeyDown={e => e.key === "Enter" && send()}
              placeholder="Type a message..."
              className="flex-1 border border-gray-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
            <button onClick={send} className="w-10 h-10 bg-orange-500 hover:bg-orange-600 text-white rounded-full flex items-center justify-center transition-colors">
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}