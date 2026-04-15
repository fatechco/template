"use client";
// @ts-nocheck
import { useState } from "react";
import Link from "next/link";
import { Pencil, Plus, CheckCircle, ChevronRight, AlertCircle, Star, Bot } from "lucide-react";
import RoleCard from "@/components/crm/RoleCard";

const DEFAULT_PINNED_NOTES = [
  { id: "n1", body: "Very interested in upgrading plan. Prefers morning calls.", authorId: "You", createdAt: "2 days ago", isPinned: true },
];

const MOCK_OPEN_TASKS = [
  { id: "t1", title: "Follow-up call", dueAt: "Tomorrow 10:00", priority: "high", type: "call" },
  { id: "t2", title: "Send renewal proposal", dueAt: "Apr 5", priority: "medium", type: "email" },
];

const MOCK_OPEN_OPPS = [
  { id: "op1", title: "Pro Plan Renewal", stage: "Proposal", value: "EGP 1,200", probability: 70 },
];

const MOCK_RECENT_ACTIVITY = [
  { icon: "📞", text: "Called — no answer", time: "2 hours ago", actor: "You" },
  { icon: "💬", text: "WhatsApp sent — renewal offer", time: "1 day ago", actor: "You" },
  { icon: "🔄", text: "Stage changed: prospect → active", time: "3 days ago", actor: "System" },
  { icon: "📝", text: "Note added", time: "4 days ago", actor: "Adel M." },
];

function InfoRow({ label, value, editable, onEdit }) {
  return (
    <div className="flex items-center justify-between py-1.5 border-b border-gray-50 last:border-0">
      <span className="text-xs text-gray-500 w-32 flex-shrink-0">{label}</span>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <span className="text-xs font-semibold text-gray-800 truncate">{value || <span className="text-gray-300">—</span>}</span>
        {editable && <button onClick={onEdit} className="text-gray-300 hover:text-violet-500 flex-shrink-0"><Pencil size={10} /></button>}
      </div>
    </div>
  );
}

export default function ContactOverviewTab({ contact }) {
  const [addingNote, setAddingNote] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [pinnedNotes, setPinnedNotes] = useState(DEFAULT_PINNED_NOTES);
  const [tasks, setTasks] = useState(MOCK_OPEN_TASKS);

  const handleSaveNote = () => {
    if (!noteText.trim()) return;
    setPinnedNotes(prev => [...prev, { id: `n${Date.now()}`, body: noteText, authorId: "You", createdAt: "Just now", isPinned: true }]);
    setNoteText("");
    setAddingNote(false);
  };

  const handleTaskDone = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      {/* LEFT COLUMN */}
      <div className="xl:col-span-2 space-y-5">
        {/* Contact Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-gray-900">Contact Information</h3>
            <button className="text-xs text-violet-600 font-bold hover:underline flex items-center gap-1"><Pencil size={11} /> Edit</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
            <div>
              <InfoRow label="Phone" value={contact.phone} editable />
              <InfoRow label="Email" value={contact.email} editable />
              <InfoRow label="WhatsApp" value={contact.whatsapp} editable />
              <InfoRow label="City" value={contact.city} editable />
              <InfoRow label="Country" value={contact.country} />
            </div>
            <div>
              <InfoRow label="Source" value={contact.source} />
              <InfoRow label="Source Detail" value={contact.sourceDetail} />
              <InfoRow label="Registered User" value={contact.userId ? `User #${contact.userId}` : "Not registered"} />
              <InfoRow label="Created" value={contact.createdAt} />
              <InfoRow label="Account" value={contact.accountName} />
            </div>
          </div>
        </div>

        {/* Role-specific card */}
        <RoleCard contact={contact} />

        {/* Pinned Notes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-gray-900">📌 Pinned Notes</h3>
            <button onClick={() => setAddingNote(!addingNote)} className="text-xs text-violet-600 font-bold hover:underline flex items-center gap-1">
              <Plus size={11} /> Add Note
            </button>
          </div>
          {addingNote && (

            <div className="mb-3 p-3 bg-violet-50 rounded-xl border border-violet-200">
              <textarea value={noteText} onChange={e => setNoteText(e.target.value)}
                placeholder="Write your note..." rows={3}
                className="w-full bg-transparent text-xs border-0 focus:outline-none resize-none" />
              <div className="flex justify-end gap-2 mt-2">
                <button onClick={() => setAddingNote(false)} className="text-xs text-gray-500 font-bold">Cancel</button>
                <button onClick={handleSaveNote} className="text-xs bg-violet-600 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-violet-700">Save Note</button>
              </div>
            </div>
          )}
          {pinnedNotes.length === 0 && !addingNote && (
            <p className="text-xs text-gray-400 py-4 text-center">No pinned notes yet</p>
          )}
          {pinnedNotes.map(n => (
            <div key={n.id} className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 mb-2">
              <p className="text-xs text-gray-800">{n.body}</p>
              <p className="text-[10px] text-gray-400 mt-1.5">{n.authorId} · {n.createdAt}</p>
            </div>
          ))}
        </div>

        {/* Open Tasks */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-gray-900">✅ Open Tasks</h3>
            <button className="text-xs text-violet-600 font-bold hover:underline flex items-center gap-1"><Plus size={11} /> Add Task</button>
          </div>
          {tasks.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No open tasks</p>}
          {tasks.map(t => (
            <div key={t.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${t.priority === "high" ? "bg-red-400" : t.priority === "medium" ? "bg-orange-300" : "bg-gray-300"}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800">{t.title}</p>
                <p className="text-[10px] text-gray-400">{t.dueAt}</p>
              </div>
              <button onClick={() => handleTaskDone(t.id)} className="text-[10px] bg-green-100 text-green-700 font-bold px-2 py-1 rounded-lg hover:bg-green-200">Done</button>
            </div>
          ))}
        </div>

        {/* Open Opportunities */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-gray-900">🎯 Open Opportunities</h3>
            <button className="text-xs text-violet-600 font-bold hover:underline flex items-center gap-1"><Plus size={11} /> New Opp</button>
          </div>
          {MOCK_OPEN_OPPS.length === 0 && <p className="text-xs text-gray-400 text-center py-4">No open opportunities</p>}
          {MOCK_OPEN_OPPS.map(o => (
            <div key={o.id} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-gray-800">{o.title}</p>
                <p className="text-[10px] text-gray-400">{o.stage} · {o.probability}% probability</p>
              </div>
              <span className="text-xs font-black text-violet-600">{o.value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT COLUMN */}
      <div className="space-y-5">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 mb-3">🕒 Recent Activity</h3>
          {MOCK_RECENT_ACTIVITY.map((a, i) => (
            <div key={i} className="flex items-start gap-2 py-2 border-b border-gray-50 last:border-0">
              <span className="text-base flex-shrink-0 mt-0.5">{a.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-gray-700">{a.text}</p>
                <p className="text-[10px] text-gray-400">{a.actor} · {a.time}</p>
              </div>
            </div>
          ))}
        </div>

        {/* AI Battlecard */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-xl border border-violet-200 p-5">
          <div className="flex items-center gap-2 mb-3">
            <Bot size={16} className="text-violet-600" />
            <h3 className="text-sm font-black text-violet-700">AI Battlecard</h3>
            <span className="text-[9px] bg-violet-200 text-violet-700 font-black px-1.5 py-0.5 rounded-full">PLACEHOLDER</span>
          </div>
          <div className="space-y-2">
            {[
              { label: "Why contact now", value: "Renewal due in 30 days" },
              { label: "Key fact to mention", value: "Has 12 active listings" },
              { label: "Likely objection", value: "Price increase concern" },
              { label: "Best channel", value: "WhatsApp, morning" },
              { label: "Next action", value: "Send renewal offer template" },
            ].map(({ label, value }) => (
              <div key={label} className="bg-white/70 rounded-lg p-2.5">
                <p className="text-[10px] text-violet-500 font-bold">{label}</p>
                <p className="text-xs text-gray-700 mt-0.5">{value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Commercial Status */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 mb-3">💳 Commercial Status</h3>
          <div className="space-y-2 text-xs">
            <InfoRow label="Plan" value="Pro" />
            <InfoRow label="Payment" value="Paid" />
            <InfoRow label="Renewal" value="May 1, 2026" />
            <InfoRow label="Score" value={`${contact.score}/100`} />
          </div>
        </div>
      </div>
    </div>
  );
}