import { useState, useEffect } from "react";
import { Plus, MessageCircle, Phone, CheckCircle, RefreshCw, Zap, X } from "lucide-react";

const MOCK_TIMELINE = [
  { id: 1, type: "call", icon: "📞", color: "bg-green-100 text-green-600 border-green-200", title: "Called — No Answer", actor: "You", time: "2 hours ago", status: "no_answer", detail: "Outbound call · 0:00 duration", linkType: "call", linkId: "call1" },
  { id: 2, type: "whatsapp", icon: "💬", color: "bg-green-50 text-green-500 border-green-100", title: "WhatsApp — Renewal offer sent", actor: "You", time: "1 day ago", status: "delivered", detail: "Template: renewal_offer_ar" },
  { id: 3, type: "note", icon: "📝", color: "bg-yellow-100 text-yellow-600 border-yellow-200", title: "Note added", actor: "Adel M.", time: "2 days ago", status: null, detail: "Prefers morning calls. Follow up after Eid.", noteType: "general", pinned: true },
  { id: 4, type: "stage_change", icon: "🔄", color: "bg-blue-100 text-blue-600 border-blue-200", title: "Stage changed: Prospect → Active", actor: "System", time: "3 days ago", status: null, detail: "Auto-updated after plan activation" },
  { id: 5, type: "task", icon: "✅", color: "bg-teal-100 text-teal-600 border-teal-200", title: "Task completed: Send welcome email", actor: "Sara K.", time: "5 days ago", status: "done", detail: null },
  { id: 6, type: "email", icon: "📧", color: "bg-blue-100 text-blue-600 border-blue-200", title: "Email opened — welcome package", actor: "System", time: "6 days ago", status: "opened", detail: "Opened 2 times" },
  { id: 7, type: "opportunity", icon: "🎯", color: "bg-violet-100 text-violet-600 border-violet-200", title: "Opportunity created: Pro Renewal", actor: "You", time: "7 days ago", status: "open", detail: "Value: EGP 1,200 · Stage: Proposal" },
  { id: 8, type: "note", icon: "⚠️", color: "bg-red-100 text-red-600 border-red-200", title: "Objection noted: Price concerns", actor: "You", time: "1 week ago", status: null, detail: "Mentioned competitor pricing from Property Finder", noteType: "objection" },
  { id: 9, type: "message", icon: "📱", color: "bg-orange-50 text-orange-500 border-orange-100", title: "SMS — Activation reminder", actor: "System", time: "10 days ago", status: "failed", detail: "Delivery failed — number unreachable" },
  { id: 10, type: "import", icon: "📥", color: "bg-gray-100 text-gray-600 border-gray-200", title: "Contact imported from Aqarmap", actor: "System", time: "2 weeks ago", status: null, detail: "Job #JOB-002 · 5 linked properties" },
  { id: 11, type: "automation", icon: "⚡", color: "bg-orange-100 text-orange-600 border-orange-200", title: "Automation: Welcome sequence started", actor: "AI", time: "2 weeks ago", status: "running", detail: "Step 1 of 5 — PLACEHOLDER" },
];

const NOTE_TYPES = [
  { value: "general", label: "General Note", icon: "📝" },
  { value: "objection", label: "Objection Note", icon: "⚠️" },
  { value: "promise", label: "Promise Note", icon: "🤝" },
  { value: "handoff", label: "Handoff Note", icon: "🔁" },
  { value: "important", label: "Important Note", icon: "⭐" },
  { value: "ai_summary", label: "AI Summary", icon: "🤖" },
];

const TYPE_FILTERS = [
  { id: "all", label: "All" },
  { id: "call", label: "Calls" },
  { id: "whatsapp", label: "WhatsApp" },
  { id: "email", label: "Email" },
  { id: "message", label: "SMS/Messages" },
  { id: "note", label: "Notes" },
  { id: "task", label: "Tasks" },
  { id: "stage_change", label: "Stage Changes" },
  { id: "opportunity", label: "Opportunities" },
  { id: "automation", label: "Automations" },
  { id: "import", label: "Import Events" },
];

const STATUS_COLOR = {
  done: "bg-green-100 text-green-700",
  no_answer: "bg-red-100 text-red-600",
  delivered: "bg-blue-100 text-blue-700",
  opened: "bg-teal-100 text-teal-700",
  failed: "bg-red-100 text-red-600",
  open: "bg-violet-100 text-violet-700",
  running: "bg-orange-100 text-orange-700",
};

export default function ContactTimelineTab({ contact, autoOpenNote, onFormOpened }) {
  const [typeFilter, setTypeFilter] = useState("all");
  const [showAddNote, setShowAddNote] = useState(false);

  useEffect(() => {
    if (autoOpenNote) {
      setShowAddNote(true);
      onFormOpened?.();
    }
  }, [autoOpenNote]);
  const [noteText, setNoteText] = useState("");
  const [noteType, setNoteType] = useState("general");
  const [notePrivate, setNotePrivate] = useState(false);
  const [notePin, setNotePin] = useState(false);
  const [timeline, setTimeline] = useState(MOCK_TIMELINE);

  const filtered = typeFilter === "all" ? timeline : timeline.filter(i => i.type === typeFilter);

  // Pinned notes at top
  const pinned = filtered.filter(i => i.pinned);
  const rest = filtered.filter(i => !i.pinned);
  const ordered = [...pinned, ...rest];

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    const conf = NOTE_TYPES.find(n => n.value === noteType) || NOTE_TYPES[0];
    setTimeline(prev => [{
      id: Date.now(), type: "note", icon: conf.icon,
      color: noteType === "objection" ? "bg-red-100 text-red-600 border-red-200"
           : noteType === "important" ? "bg-yellow-100 text-yellow-600 border-yellow-200"
           : "bg-yellow-100 text-yellow-600 border-yellow-200",
      title: `${conf.label}${notePrivate ? " (private)" : ""}`,
      actor: "You", time: "Just now", status: null, detail: noteText,
      noteType: noteType, pinned: notePin,
    }, ...prev]);
    setNoteText(""); setShowAddNote(false); setNotePin(false); setNotePrivate(false);
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900">Activity Timeline</h3>
        <button onClick={() => setShowAddNote(!showAddNote)}
          className="flex items-center gap-1.5 border border-violet-300 text-violet-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-violet-50">
          <Plus size={12} /> Add Note
        </button>
      </div>

      {/* Add note form */}
      {showAddNote && (
        <div className="bg-yellow-50 border border-yellow-300 rounded-xl p-4 space-y-3">
          {/* Note type */}
          <div className="flex flex-wrap gap-1.5">
            {NOTE_TYPES.map(nt => (
              <button key={nt.value} onClick={() => setNoteType(nt.value)}
                className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${noteType === nt.value ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200"}`}>
                {nt.icon} {nt.label}
              </button>
            ))}
          </div>
          <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
            placeholder="Write your note here..." rows={3}
            className="w-full bg-white border border-yellow-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-violet-400 resize-none" />
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" checked={notePrivate} onChange={e => setNotePrivate(e.target.checked)} className="accent-violet-600" /> Private
            </label>
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input type="checkbox" checked={notePin} onChange={e => setNotePin(e.target.checked)} className="accent-violet-600" /> Pin note
            </label>
            <div className="ml-auto flex gap-2">
              <button onClick={() => setShowAddNote(false)} className="text-xs text-gray-500 font-bold">Cancel</button>
              <button onClick={handleSaveNote} className="text-xs bg-violet-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-violet-700">Save Note</button>
            </div>
          </div>
        </div>
      )}

      {/* Type filters */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {TYPE_FILTERS.map(f => (
          <button key={f.id} onClick={() => setTypeFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-[11px] font-bold border whitespace-nowrap flex-shrink-0 transition-all ${typeFilter === f.id ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
        <div className="space-y-1">
          {ordered.map(item => (
            <div key={item.id} className="flex gap-4 relative">
              <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center text-base flex-shrink-0 bg-white z-10 ${item.color}`}>
                {item.icon}
              </div>
              <div className={`flex-1 rounded-xl border shadow-sm p-3 mb-2 ${item.pinned ? "bg-yellow-50 border-yellow-200" : "bg-white border-gray-100"}`}>
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      {item.pinned && <span className="text-[9px] bg-yellow-200 text-yellow-800 font-black px-1.5 py-0.5 rounded-full">📌 Pinned</span>}
                      <p className="text-xs font-bold text-gray-900">{item.title}</p>
                    </div>
                    {item.detail && <p className="text-[11px] text-gray-500 mt-0.5">{item.detail}</p>}
                  </div>
                  {item.status && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-full flex-shrink-0 capitalize ${STATUS_COLOR[item.status] || "bg-gray-100 text-gray-500"}`}>{item.status.replace(/_/g, " ")}</span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1.5">
                  <span className="text-[10px] text-gray-400">{item.actor}</span>
                  <span className="text-[10px] text-gray-300">·</span>
                  <span className="text-[10px] text-gray-400">{item.time}</span>
                  {item.linkType === "call" && (
                    <a href={`/admin/crm/calls/${item.linkId}`} className="text-[10px] text-violet-500 font-bold hover:underline ml-1">View call →</a>
                  )}
                </div>
              </div>
            </div>
          ))}
          {ordered.length === 0 && (
            <div className="text-center py-12 text-gray-400 ml-10">
              <p className="text-sm font-semibold">No {typeFilter === "all" ? "" : typeFilter} events yet</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}