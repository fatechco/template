import { useState, useMemo } from "react";
import {
  Search, Filter, Phone, MessageCircle, Mail, Send, Paperclip,
  Clock, CheckCircle, AlertCircle, ChevronRight, Bot, Plus,
  Calendar, Star, X, RefreshCw, Tag, Download, Mic
} from "lucide-react";

// ─── Mock data ─────────────────────────────────────────────────────────────────
const CONVERSATIONS = [
  { id: "cv1", contactId: "c1", contactName: "Ahmed Hassan", accountName: "Elite Realty", channel: "whatsapp", subject: "Renewal discussion", status: "open", assignedTo: "You", lastMessageAt: "10 min ago", lastPreview: "Yes, I'll review the offer and get back to you", unreadCount: 2, direction: "inbound", avatarBg: "bg-green-100 text-green-700" },
  { id: "cv2", contactId: "c2", contactName: "Sara Mohamed", accountName: "Palm Hills Dev", channel: "email", subject: "Contract renewal — follow up", status: "pending", assignedTo: "Adel M.", lastMessageAt: "1 hr ago", lastPreview: "Please find attached the updated proposal...", unreadCount: 0, direction: "outbound", avatarBg: "bg-blue-100 text-blue-700" },
  { id: "cv3", contactId: "c3", contactName: "Karim Ali", accountName: null, channel: "sms", subject: "Activation follow-up", status: "awaiting_reply", assignedTo: "You", lastMessageAt: "3 hrs ago", lastPreview: "Can we schedule a quick call tomorrow?", unreadCount: 1, direction: "inbound", avatarBg: "bg-orange-100 text-orange-700" },
  { id: "cv4", contactId: "c4", contactName: "Nour Hassan", accountName: null, channel: "whatsapp", subject: "Profile completion reminder", status: "open", assignedTo: "Sara K.", lastMessageAt: "Yesterday", lastPreview: "I will complete the profile soon", unreadCount: 0, direction: "inbound", avatarBg: "bg-purple-100 text-purple-700" },
  { id: "cv5", contactId: "c5", contactName: "Mohamed Sayed", accountName: "Gulf Corp", channel: "email", subject: "Onboarding documents", status: "resolved", assignedTo: "You", lastMessageAt: "2 days ago", lastPreview: "Documents received, thank you!", unreadCount: 0, direction: "inbound", avatarBg: "bg-teal-100 text-teal-700" },
  { id: "cv6", contactId: "c6", contactName: "Rania Bassem", accountName: null, channel: "whatsapp", subject: "Failed delivery", status: "failed", assignedTo: "You", lastMessageAt: "3 days ago", lastPreview: "Message delivery failed — number unreachable", unreadCount: 0, direction: "outbound", avatarBg: "bg-red-100 text-red-700" },
  { id: "cv7", contactId: "c7", contactName: "Omar Rashid", accountName: "City Homes", channel: "phone", subject: "Requires callback", status: "awaiting_reply", assignedTo: "Adel M.", lastMessageAt: "4 days ago", lastPreview: "Missed call — requested callback", unreadCount: 0, direction: "inbound", avatarBg: "bg-yellow-100 text-yellow-700" },
];

const MESSAGES = {
  cv1: [
    { id: "m1", direction: "outbound", body: "Hello Ahmed, I wanted to follow up on your Pro plan renewal. It expires on May 1st.", sentAt: "Yesterday 9:00", status: "read", actor: "You" },
    { id: "m2", direction: "inbound", body: "Hi! Thanks for reaching out. I've been meaning to discuss the renewal.", sentAt: "Yesterday 11:30", status: "read", actor: "Ahmed Hassan" },
    { id: "m3", direction: "outbound", body: "Great! I can offer you a 10% discount if you renew before April 15. Shall I send the offer?", sentAt: "Yesterday 12:00", status: "read", actor: "You" },
    { id: "m4", direction: "inbound", body: "Yes, I'll review the offer and get back to you", sentAt: "10 min ago", status: "delivered", actor: "Ahmed Hassan" },
  ],
  cv2: [
    { id: "m5", direction: "outbound", body: "Dear Sara, following up on the contract renewal for Palm Hills account.", sentAt: "2 days ago", status: "sent", actor: "Adel M." },
    { id: "m6", direction: "outbound", body: "Please find attached the updated proposal...", sentAt: "1 hr ago", status: "sent", actor: "Adel M.", attachment: "renewal_proposal.pdf" },
  ],
};

const CHANNEL_ICON = { whatsapp: "💬", email: "📧", sms: "📱", phone: "📞", app: "📲" };
const CHANNEL_COLOR = { whatsapp: "text-green-600", email: "text-blue-600", sms: "text-orange-500", phone: "text-gray-600", app: "text-violet-600" };
const STATUS_BADGE = {
  open: "bg-blue-100 text-blue-700",
  pending: "bg-yellow-100 text-yellow-700",
  awaiting_reply: "bg-orange-100 text-orange-700",
  resolved: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-600",
  archived: "bg-gray-100 text-gray-500",
};

const VIEWS = [
  { id: "all", label: "All", count: CONVERSATIONS.length },
  { id: "mine", label: "Mine", count: CONVERSATIONS.filter(c => c.assignedTo === "You").length },
  { id: "unassigned", label: "Unassigned", count: 0 },
  { id: "awaiting", label: "Awaiting Reply", count: CONVERSATIONS.filter(c => c.status === "awaiting_reply").length },
  { id: "unread", label: "Unread", count: CONVERSATIONS.filter(c => c.unreadCount > 0).length },
  { id: "whatsapp", label: "WhatsApp", count: CONVERSATIONS.filter(c => c.channel === "whatsapp").length },
  { id: "email", label: "Email", count: CONVERSATIONS.filter(c => c.channel === "email").length },
  { id: "sms", label: "SMS", count: CONVERSATIONS.filter(c => c.channel === "sms").length },
  { id: "calls", label: "Calls — Follow-up", count: CONVERSATIONS.filter(c => c.channel === "phone").length },
  { id: "failed", label: "Failed Delivery", count: CONVERSATIONS.filter(c => c.status === "failed").length },
];

const MOCK_CONTACT_SUMMARY = {
  cv1: { stage: "Active", priority: "High", score: 78, openTasks: 2, openOpps: 1, nextAction: "Send renewal offer by April 10" },
  cv2: { stage: "Active", priority: "High", score: 91, openTasks: 1, openOpps: 2, nextAction: "Follow up on proposal in 2 days" },
  cv3: { stage: "Prospect", priority: "Medium", score: 55, openTasks: 1, openOpps: 0, nextAction: "Schedule callback for tomorrow AM" },
};

// ─── Conversation List Item ─────────────────────────────────────────────────────
function ConvItem({ conv, active, onClick }) {
  return (
    <button onClick={onClick}
      className={`w-full text-left px-4 py-3 border-b border-gray-100 hover:bg-gray-50 transition-colors ${active ? "bg-violet-50 border-l-2 border-l-violet-500" : ""}`}>
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-full text-[11px] font-black flex items-center justify-center flex-shrink-0 ${conv.avatarBg}`}>
          {conv.contactName.slice(0, 2).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-0.5">
            <p className="text-xs font-bold text-gray-900 truncate">{conv.contactName}</p>
            <span className="text-[10px] text-gray-400 flex-shrink-0 ml-1">{conv.lastMessageAt}</span>
          </div>
          <div className="flex items-center gap-1 mb-0.5">
            <span className={`text-sm ${CHANNEL_COLOR[conv.channel]}`}>{CHANNEL_ICON[conv.channel]}</span>
            {conv.accountName && <span className="text-[10px] text-gray-400 truncate">{conv.accountName}</span>}
          </div>
          <p className="text-[11px] text-gray-500 truncate">{conv.lastPreview}</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize ${STATUS_BADGE[conv.status] || "bg-gray-100 text-gray-500"}`}>{conv.status.replace(/_/g, " ")}</span>
            <span className="text-[10px] text-gray-400">{conv.assignedTo}</span>
            {conv.unreadCount > 0 && <span className="ml-auto bg-violet-600 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">{conv.unreadCount}</span>}
            {conv.status === "failed" && <AlertCircle size={10} className="text-red-500 ml-auto" />}
          </div>
        </div>
      </div>
    </button>
  );
}

// ─── Message Bubble ──────────────────────────────────────────────────────────────
function MessageBubble({ msg }) {
  const isOut = msg.direction === "outbound";
  const STATUS_ICON = { sent: "✓", delivered: "✓✓", read: "✓✓", failed: "✗", queued: "⏳", draft: "✎" };
  return (
    <div className={`flex ${isOut ? "justify-end" : "justify-start"} mb-3`}>
      <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${isOut ? "bg-violet-600 text-white rounded-br-sm" : "bg-white border border-gray-100 text-gray-800 rounded-bl-sm shadow-sm"}`}>
        {msg.attachment && (
          <div className={`flex items-center gap-2 text-xs mb-1.5 p-2 rounded-lg ${isOut ? "bg-white/20" : "bg-gray-50"}`}>
            <Paperclip size={11} />
            <span>{msg.attachment}</span>
          </div>
        )}
        <p className="text-xs leading-relaxed">{msg.body}</p>
        <div className={`flex items-center justify-end gap-1 mt-1 ${isOut ? "text-white/60" : "text-gray-400"}`}>
          <span className="text-[10px]">{msg.sentAt}</span>
          {isOut && <span className="text-[11px]">{STATUS_ICON[msg.status] || ""}</span>}
        </div>
      </div>
    </div>
  );
}

// ─── Composer ────────────────────────────────────────────────────────────────────
function Composer({ conv }) {
  const [text, setText] = useState("");
  const [channel, setChannel] = useState(conv?.channel || "whatsapp");
  const [showSchedule, setShowSchedule] = useState(false);

  return (
    <div className="border-t border-gray-200 bg-white p-3">
      {/* Provider warning */}
      <div className="bg-orange-50 border border-orange-200 rounded-lg px-3 py-1.5 text-[10px] text-orange-700 mb-2 flex items-center gap-1.5">
        <AlertCircle size={11} /> Provider not connected — messages will be queued and sent when integration is configured.
        <button className="ml-auto font-bold underline">Configure →</button>
      </div>

      {/* Channel select */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[10px] font-bold text-gray-500">Via:</span>
        {["whatsapp", "email", "sms", "phone"].map(ch => (
          <button key={ch} onClick={() => setChannel(ch)}
            className={`text-sm px-2 py-1 rounded-lg text-[11px] font-bold border transition-all ${channel === ch ? "bg-violet-600 text-white border-violet-600" : "border-gray-200 text-gray-500 hover:border-violet-300"}`}>
            {CHANNEL_ICON[ch]} {ch}
          </button>
        ))}
        <button className="ml-auto flex items-center gap-1 text-[10px] text-gray-400 hover:text-violet-600 font-bold border border-dashed border-gray-200 px-2 py-1 rounded-lg">
          <Bot size={10} /> Template
        </button>
        <button className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-violet-600 font-bold border border-dashed border-gray-200 px-2 py-1 rounded-lg">
          <Bot size={10} /> AI Improve
        </button>
      </div>

      {/* Text area */}
      <textarea
        value={text} onChange={e => setText(e.target.value)}
        placeholder="Type your message..."
        rows={3}
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-400 resize-none"
      />

      {/* Action bar */}
      <div className="flex items-center gap-2 mt-2">
        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" title="Attach"><Paperclip size={14} /></button>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" title="Voice"><Mic size={14} /></button>
        <button onClick={() => setShowSchedule(!showSchedule)} className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-violet-600 border border-gray-200 rounded-lg px-2 py-1.5">
          <Calendar size={11} /> Schedule
        </button>
        <button className="flex items-center gap-1 text-[10px] font-bold text-gray-500 hover:text-teal-600 border border-gray-200 rounded-lg px-2 py-1.5">
          <CheckCircle size={11} /> + Task
        </button>
        <button className="flex items-center gap-1 text-[10px] font-bold text-gray-500 border border-gray-200 rounded-lg px-2 py-1.5">
          Save Draft
        </button>
        <button className="ml-auto flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-4 py-1.5 rounded-lg text-xs">
          <Send size={12} /> Send
        </button>
      </div>

      {showSchedule && (
        <div className="mt-2 bg-gray-50 border border-gray-200 rounded-xl p-3 flex items-center gap-3">
          <span className="text-xs font-bold text-gray-700">Schedule for:</span>
          <input type="datetime-local" className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none flex-1" />
          <button className="bg-violet-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg">Confirm</button>
          <button onClick={() => setShowSchedule(false)} className="text-gray-400 hover:text-red-500"><X size={14} /></button>
        </div>
      )}
    </div>
  );
}

// ─── Right Panel ──────────────────────────────────────────────────────────────────
function RightPanel({ conv }) {
  if (!conv) return null;
  const summary = MOCK_CONTACT_SUMMARY[conv.id] || {};
  return (
    <div className="w-64 border-l border-gray-200 bg-white overflow-y-auto flex-shrink-0">
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-2">
          <div className={`w-9 h-9 rounded-full text-sm font-black flex items-center justify-center ${conv.avatarBg}`}>{conv.contactName.slice(0, 2).toUpperCase()}</div>
          <div>
            <p className="text-xs font-black text-gray-900">{conv.contactName}</p>
            {conv.accountName && <p className="text-[10px] text-gray-400">{conv.accountName}</p>}
          </div>
        </div>
        <div className="space-y-1 text-xs">
          <div className="flex justify-between"><span className="text-gray-500">Stage</span><span className="font-semibold text-gray-800">{summary.stage || "—"}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Priority</span><span className="font-semibold text-gray-800">{summary.priority || "—"}</span></div>
          <div className="flex justify-between"><span className="text-gray-500">Score</span><span className="font-bold text-violet-600">{summary.score || "—"}</span></div>
        </div>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 flex items-center justify-center gap-1 bg-green-500 text-white font-bold py-1.5 rounded-lg text-[10px]"><Phone size={10} /> Call</button>
          <button className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-gray-700 font-bold py-1.5 rounded-lg text-[10px]"><ChevronRight size={10} /> Profile</button>
        </div>
      </div>

      {/* Open tasks */}
      <div className="p-3 border-b border-gray-100">
        <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Open Tasks ({summary.openTasks || 0})</p>
        {(summary.openTasks || 0) > 0
          ? <div className="space-y-1"><div className="bg-orange-50 rounded-lg p-2 text-[10px] text-gray-700 font-semibold">📞 Follow-up call — Tomorrow</div></div>
          : <p className="text-[10px] text-gray-400">No open tasks</p>}
        <button className="w-full mt-2 border border-dashed border-gray-200 text-[10px] text-gray-400 py-1 rounded-lg hover:border-violet-300 hover:text-violet-600">+ Add Task</button>
      </div>

      {/* Open opps */}
      <div className="p-3 border-b border-gray-100">
        <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Open Opps ({summary.openOpps || 0})</p>
        {(summary.openOpps || 0) > 0
          ? <div className="bg-violet-50 rounded-lg p-2 text-[10px] text-gray-700 font-semibold">🎯 Pro Renewal — EGP 1,200</div>
          : <p className="text-[10px] text-gray-400">No open opportunities</p>}
      </div>

      {/* AI Battle-card placeholder */}
      <div className="p-3 border-b border-gray-100">
        <div className="flex items-center gap-1 mb-2">
          <Bot size={11} className="text-violet-500" />
          <p className="text-[10px] font-black text-gray-500 uppercase">AI Battle-card</p>
          <span className="text-[8px] bg-violet-100 text-violet-500 font-bold px-1 rounded">PLACEHOLDER</span>
        </div>
        <p className="text-[10px] text-gray-500 italic">AI engine not connected. Battle-card will appear here.</p>
      </div>

      {/* Next action */}
      <div className="p-3">
        <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Suggested Next Action</p>
        <div className="bg-green-50 border border-green-200 rounded-lg p-2 text-[10px] text-green-700 font-semibold">
          💡 {summary.nextAction || "No suggestion available"}
        </div>
      </div>
    </div>
  );
}

// ─── Main inbox ────────────────────────────────────────────────────────────────────
export default function CRMInbox() {
  const [activeView, setActiveView] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedConv, setSelectedConv] = useState(CONVERSATIONS[0]);

  const filtered = useMemo(() => {
    let list = [...CONVERSATIONS];
    if (search) { const q = search.toLowerCase(); list = list.filter(c => c.contactName.toLowerCase().includes(q) || c.lastPreview.toLowerCase().includes(q)); }
    if (activeView === "mine") list = list.filter(c => c.assignedTo === "You");
    if (activeView === "awaiting") list = list.filter(c => c.status === "awaiting_reply");
    if (activeView === "unread") list = list.filter(c => c.unreadCount > 0);
    if (activeView === "whatsapp") list = list.filter(c => c.channel === "whatsapp");
    if (activeView === "email") list = list.filter(c => c.channel === "email");
    if (activeView === "sms") list = list.filter(c => c.channel === "sms");
    if (activeView === "calls") list = list.filter(c => c.channel === "phone");
    if (activeView === "failed") list = list.filter(c => c.status === "failed");
    return list;
  }, [activeView, search]);

  const messages = selectedConv ? (MESSAGES[selectedConv.id] || []) : [];

  return (
    <div className="flex h-[calc(100vh-8rem)] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      {/* Left: Views + List */}
      <div className="w-72 flex flex-col border-r border-gray-200 flex-shrink-0">
        {/* Views */}
        <div className="p-3 border-b border-gray-100">
          <div className="relative mb-2">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search conversations..."
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-violet-400" />
          </div>
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {VIEWS.map(v => (
              <button key={v.id} onClick={() => setActiveView(v.id)}
                className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs font-semibold transition-colors ${activeView === v.id ? "bg-violet-100 text-violet-700" : "text-gray-600 hover:bg-gray-50"}`}>
                <span>{v.label}</span>
                {v.count > 0 && <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${activeView === v.id ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-500"}`}>{v.count}</span>}
              </button>
            ))}
          </div>
        </div>

        {/* Conversation list */}
        <div className="flex-1 overflow-y-auto">
          {filtered.map(conv => (
            <ConvItem key={conv.id} conv={conv} active={selectedConv?.id === conv.id} onClick={() => setSelectedConv(conv)} />
          ))}
          {filtered.length === 0 && (
            <div className="text-center py-10 text-gray-400">
              <MessageCircle size={28} className="mx-auto mb-2 opacity-30" />
              <p className="text-xs font-semibold">No conversations</p>
            </div>
          )}
        </div>
      </div>

      {/* Center: Thread */}
      <div className="flex-1 flex flex-col min-w-0">
        {selectedConv ? (
          <>
            {/* Thread header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100 bg-white">
              <div className={`w-8 h-8 rounded-full text-xs font-black flex items-center justify-center flex-shrink-0 ${selectedConv.avatarBg}`}>{selectedConv.contactName.slice(0, 2).toUpperCase()}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black text-gray-900">{selectedConv.contactName}</p>
                <div className="flex items-center gap-1.5">
                  <span className="text-sm">{CHANNEL_ICON[selectedConv.channel]}</span>
                  <span className="text-[10px] text-gray-400">{selectedConv.subject}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize ${STATUS_BADGE[selectedConv.status]}`}>{selectedConv.status.replace(/_/g, " ")}</span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {["Resolve", "Assign", "Archive"].map(a => (
                  <button key={a} className="text-[10px] font-bold border border-gray-200 text-gray-600 px-2.5 py-1.5 rounded-lg hover:bg-gray-50">{a}</button>
                ))}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="text-center py-12 text-gray-400">
                  <MessageCircle size={28} className="mx-auto mb-2 opacity-20" />
                  <p className="text-xs">No messages yet — start a conversation</p>
                </div>
              )}
              {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}
            </div>

            {/* Composer */}
            <Composer conv={selectedConv} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400">
            <div className="text-center">
              <MessageCircle size={36} className="mx-auto mb-3 opacity-20" />
              <p className="text-sm font-semibold">Select a conversation</p>
            </div>
          </div>
        )}
      </div>

      {/* Right: Summary Panel */}
      <RightPanel conv={selectedConv} />
    </div>
  );
}