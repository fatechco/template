import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft, Phone, MessageCircle, Bot, Mic, Clock, CheckCircle,
  AlertCircle, Tag, FileText, ChevronRight, Play, Download
} from "lucide-react";

const MOCK_CALLS = {
  call1: {
    id: "call1", contactName: "Ahmed Hassan", contactId: "c1", accountName: "Elite Realty",
    direction: "outbound", callerType: "human", calledBy: "You",
    phone: "+20 100 123 4567", status: "completed", outcome: "connected",
    durationSeconds: 347, startedAt: "2026-04-02 09:14", endedAt: "2026-04-02 09:20",
    recordingUrl: null, transcriptAvailable: true,
    summary: "Contact confirmed interest in renewing the Pro plan. Raised concerns about the price increase. Promised to review the updated pricing page and respond by EOW. Tone: Positive.",
    sentiment: "positive",
    objectionTags: ["price_concern", "competitor_comparison"],
    nextBestAction: "Send comparison sheet + discount offer via WhatsApp. Follow up Friday if no response.",
    linkedTask: "Renewal follow-up task",
    linkedOpp: "Pro Renewal — EGP 1,200",
    notes: "Contact mentioned they're also evaluating Property Finder. Highlight Aqarmap + Kemedar integration advantage.",
    tags: ["warm", "renewal", "decision_stage"],
  }
};

const FALLBACK = {
  id: "cx", contactName: "Unknown Contact", contactId: "cx", accountName: null,
  direction: "outbound", callerType: "human", calledBy: "You",
  phone: "—", status: "completed", outcome: "no_answer",
  durationSeconds: 0, startedAt: "—", endedAt: "—",
  recordingUrl: null, transcriptAvailable: false,
  summary: null, sentiment: null, objectionTags: [], nextBestAction: null,
  linkedTask: null, linkedOpp: null, notes: "", tags: [],
};

const OUTCOME_COLORS = {
  connected: "bg-green-100 text-green-700",
  voicemail: "bg-blue-100 text-blue-700",
  no_answer: "bg-red-100 text-red-600",
  callback_requested: "bg-orange-100 text-orange-700",
  interested: "bg-teal-100 text-teal-700",
  not_interested: "bg-gray-100 text-gray-500",
  escalated: "bg-purple-100 text-purple-700",
  wrong_number: "bg-red-100 text-red-700",
};

const SENTIMENT_CONFIG = {
  positive: { label: "😊 Positive", color: "bg-green-100 text-green-700" },
  neutral: { label: "😐 Neutral", color: "bg-gray-100 text-gray-600" },
  negative: { label: "😟 Negative", color: "bg-red-100 text-red-600" },
};

const MOCK_TRANSCRIPT = [
  { speaker: "Rep", time: "0:00", text: "Hello Ahmed, this is calling from Kemedar. How are you today?" },
  { speaker: "Contact", time: "0:08", text: "Hi! I'm good, thanks. I was actually expecting your call about the renewal." },
  { speaker: "Rep", time: "0:15", text: "Great! Your Pro plan expires May 1st. I wanted to walk you through the renewal options and see if we can make it work for you." },
  { speaker: "Contact", time: "0:30", text: "Yes, I've been meaning to discuss this. The price has gone up compared to last year, hasn't it?" },
  { speaker: "Rep", time: "0:42", text: "You're right, there's been a modest increase. But the plan now includes featured placements and the new AI listing tools." },
  { speaker: "Contact", time: "1:05", text: "I'm also comparing with Property Finder's new agent package. Can you send me a comparison?" },
  { speaker: "Rep", time: "1:18", text: "Absolutely, I'll send that over WhatsApp this afternoon with a special offer just for you." },
  { speaker: "Contact", time: "1:35", text: "Sounds good. I'll review it by end of week." },
  { speaker: "Rep", time: "1:42", text: "Perfect! I'll follow up Friday if I don't hear from you. Thanks Ahmed!" },
];

const AUDIT = [
  { action: "call_logged", actor: "You", time: "2 hrs ago" },
  { action: "transcript_generated", actor: "System", time: "2 hrs ago" },
  { action: "task_created", actor: "System", time: "2 hrs ago" },
];

export default function CRMCallDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("summary");
  const [notes, setNotes] = useState(MOCK_CALLS[id]?.notes || "");
  const call = MOCK_CALLS[id] || { ...FALLBACK, id };

  const dur = call.durationSeconds > 0
    ? `${Math.floor(call.durationSeconds / 60)}:${String(call.durationSeconds % 60).padStart(2, "0")}`
    : "—";

  const TABS = [
    { id: "summary", label: "Summary" },
    { id: "transcript", label: "Transcript" },
    { id: "notes", label: "Notes" },
    { id: "audit", label: "Audit" },
  ];

  return (
    <div className="space-y-5">
      <Link to="/admin/crm/calls" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-600 font-semibold">
        <ChevronLeft size={14} /> Back to Calls
      </Link>

      {/* Header card */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-green-100 text-green-700 font-black text-lg flex items-center justify-center flex-shrink-0">
            📞
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-black text-gray-900">{call.contactName}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${OUTCOME_COLORS[call.outcome] || "bg-gray-100 text-gray-500"}`}>{call.outcome.replace(/_/g, " ")}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${call.direction === "inbound" ? "bg-blue-100 text-blue-700" : "bg-orange-100 text-orange-700"}`}>{call.direction}</span>
              {call.callerType === "ai_agent" && <span className="text-[10px] bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">🤖 AI</span>}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span>📅 {call.startedAt}</span>
              <span>⏱ {dur}</span>
              <span>👤 {call.calledBy}</span>
              {call.accountName && <span>🏢 {call.accountName}</span>}
              <span className="font-mono">{call.phone}</span>
            </div>
            {/* Tags */}
            {call.tags.length > 0 && (
              <div className="flex gap-1 mt-2 flex-wrap">
                {call.tags.map(t => <span key={t} className="text-[10px] bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded-full">{t}</span>)}
              </div>
            )}
          </div>
          <div className="flex flex-col items-end gap-2">
            {call.sentiment && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${SENTIMENT_CONFIG[call.sentiment]?.color}`}>
                {SENTIMENT_CONFIG[call.sentiment]?.label} <span className="text-[8px] opacity-60">PLACEHOLDER</span>
              </span>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 flex-wrap">
          <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-2 rounded-lg text-xs"><Phone size={12} /> Call Again</button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50"><MessageCircle size={12} /> WhatsApp</button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50"><CheckCircle size={12} /> Create Task</button>
          <Link to={`/admin/crm/contacts/${call.contactId}`} className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50"><ChevronRight size={12} /> View Contact</Link>
        </div>
      </div>

      {/* Linked */}
      {(call.linkedTask || call.linkedOpp) && (
        <div className="flex gap-3 flex-wrap">
          {call.linkedTask && (
            <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-orange-700 flex items-center gap-2">
              <CheckCircle size={13} /> {call.linkedTask}
            </div>
          )}
          {call.linkedOpp && (
            <div className="bg-violet-50 border border-violet-200 rounded-xl px-4 py-2.5 text-xs font-semibold text-violet-700 flex items-center gap-2">
              🎯 {call.linkedOpp}
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 bg-white overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "summary" && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
            <div className="xl:col-span-2 space-y-4">
              {/* AI Summary */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <div className="flex items-center gap-2 mb-3">
                  <Bot size={15} className="text-violet-500" />
                  <h3 className="text-sm font-black text-gray-900">Call Summary</h3>
                  {call.transcriptAvailable && <span className="text-[9px] bg-teal-100 text-teal-700 font-bold px-1.5 py-0.5 rounded-full">AI-Generated</span>}
                  {!call.transcriptAvailable && <span className="text-[9px] bg-gray-100 text-gray-500 font-bold px-1.5 py-0.5 rounded-full">Manual</span>}
                </div>
                {call.summary
                  ? <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-4 border border-gray-100">{call.summary}</p>
                  : <div className="bg-gray-50 rounded-xl p-4 text-xs text-gray-400 italic">No summary available. Add transcript or manual notes.</div>}
              </div>

              {/* Objection Tags */}
              {call.objectionTags?.length > 0 && (
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                  <h3 className="text-sm font-black text-gray-900 mb-3">🎯 Objections Detected</h3>
                  <div className="flex flex-wrap gap-2">
                    {call.objectionTags.map(t => (
                      <span key={t} className="bg-red-50 border border-red-200 text-red-700 text-xs font-bold px-3 py-1.5 rounded-full capitalize">{t.replace(/_/g, " ")}</span>
                    ))}
                  </div>
                  <p className="text-[10px] text-gray-400 mt-2 italic">Detected by AI from transcript — PLACEHOLDER</p>
                </div>
              )}

              {/* Recording placeholder */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
                <h3 className="text-sm font-black text-gray-900 mb-3">🎙 Recording</h3>
                <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-4 flex items-center gap-3 text-gray-400">
                  <Play size={24} className="opacity-30" />
                  <div>
                    <p className="text-xs font-semibold">Recording not available</p>
                    <p className="text-[10px]">Call recordings will appear here when a telephony integration is configured</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-4">
              {/* Next best action */}
              {call.nextBestAction && (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <div className="flex items-center gap-1.5 mb-2">
                    <Bot size={13} className="text-green-600" />
                    <p className="text-xs font-black text-green-700">Next Best Action <span className="text-[9px] opacity-60">PLACEHOLDER</span></p>
                  </div>
                  <p className="text-xs text-green-700">{call.nextBestAction}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <h3 className="text-xs font-black text-gray-700 mb-3">Call Metadata</h3>
                <div className="space-y-1.5">
                  {[["Direction", call.direction], ["Duration", dur], ["Started", call.startedAt], ["Ended", call.endedAt], ["Made by", call.calledBy], ["Caller type", call.callerType]].map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span className="text-[11px] text-gray-400">{k}</span>
                      <span className="text-[11px] font-semibold text-gray-700 capitalize">{v}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "transcript" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-sm font-black text-gray-900">Transcript</h3>
              {call.transcriptAvailable && (
                <button className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-200 font-bold px-2.5 py-1.5 rounded-lg hover:bg-gray-50">
                  <Download size={11} /> Export
                </button>
              )}
            </div>
            {call.transcriptAvailable ? (
              <div className="p-5 space-y-3">
                {MOCK_TRANSCRIPT.map((line, i) => (
                  <div key={i} className={`flex gap-3 ${line.speaker === "Rep" ? "justify-start" : "justify-end"}`}>
                    {line.speaker === "Rep" && (
                      <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">REP</div>
                    )}
                    <div className={`max-w-[70%] rounded-2xl px-4 py-2.5 ${line.speaker === "Rep" ? "bg-violet-50 border border-violet-100" : "bg-gray-50 border border-gray-100"}`}>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-black text-gray-600">{line.speaker}</span>
                        <span className="text-[10px] text-gray-400">{line.time}</span>
                      </div>
                      <p className="text-xs text-gray-700">{line.text}</p>
                    </div>
                    {line.speaker !== "Rep" && (
                      <div className="w-7 h-7 rounded-full bg-orange-100 text-orange-700 text-[10px] font-black flex items-center justify-center flex-shrink-0 mt-0.5">CT</div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center text-gray-400">
                <Mic size={30} className="mx-auto mb-3 opacity-20" />
                <p className="text-sm font-semibold">No transcript available</p>
                <p className="text-xs mt-1">Connect a telephony integration to enable auto-transcription</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-black text-gray-900 mb-3">Call Notes</h3>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={6}
              placeholder="Add notes about this call..."
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-violet-400 resize-none" />
            <div className="flex justify-end mt-3">
              <button className="bg-violet-600 text-white font-bold px-5 py-2 rounded-xl text-xs hover:bg-violet-700">Save Notes</button>
            </div>
          </div>
        )}

        {activeTab === "audit" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{["Action", "Actor", "Time"].map(h => <th key={h} className="px-4 py-3 text-left font-bold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {AUDIT.map((e, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3"><span className="bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded-full text-[10px] capitalize">{e.action.replace(/_/g, " ")}</span></td>
                    <td className="px-4 py-3 font-semibold text-gray-700">{e.actor}</td>
                    <td className="px-4 py-3 text-gray-400">{e.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}