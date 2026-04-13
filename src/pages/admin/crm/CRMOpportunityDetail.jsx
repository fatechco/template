import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronLeft, Phone, MessageCircle, CheckCircle, Clock, TrendingUp, Pencil, X, Bot } from "lucide-react";

const MOCK_OPPS = {
  opp1: {
    id: "opp1", title: "Pro Plan Renewal", contactName: "Ahmed Hassan", contactId: "c1",
    accountName: "Elite Realty", accountId: "acc1",
    pipelineId: "renewal", pipeline: "Renewal",
    stageName: "In Discussion", stageOrder: 3,
    owner: "You", value: 1200, probability: 70,
    expectedClose: "2026-05-01", status: "open",
    nextStep: "Send final offer with discount",
    source: "CRM", tags: ["hot", "renewal"], lastActivity: "2 days ago",
    wonLostReason: null,
    notes: "Contact confirmed interest. Main concern is price increase vs. last year.",
    stageHistory: [
      { stage: "Identified", enteredAt: "Mar 1, 2026", exitedAt: "Mar 5, 2026", daysInStage: 4, movedBy: "System" },
      { stage: "Outreach Sent", enteredAt: "Mar 5, 2026", exitedAt: "Mar 12, 2026", daysInStage: 7, movedBy: "You" },
      { stage: "In Discussion", enteredAt: "Mar 12, 2026", exitedAt: null, daysInStage: 21, movedBy: "You" },
    ],
    activities: [
      { type: "call", text: "Called — Connected. Discussed renewal options.", actor: "You", time: "2 days ago" },
      { type: "whatsapp", text: "Sent renewal offer via WhatsApp.", actor: "You", time: "4 days ago" },
      { type: "stage", text: "Moved to In Discussion from Outreach Sent.", actor: "You", time: "Mar 12" },
      { type: "note", text: "Contact raised price concern — competitor comparison needed.", actor: "You", time: "Mar 15" },
    ]
  }
};

const FALLBACK = {
  id: "cx", title: "Opportunity Not Found", contactName: "—", contactId: "cx",
  accountName: null, pipelineId: "renewal", pipeline: "—", stageName: "—", stageOrder: 1,
  owner: "—", value: 0, probability: 0, expectedClose: "—", status: "open",
  nextStep: "—", source: "—", tags: [], lastActivity: "—", wonLostReason: null,
  notes: "", stageHistory: [], activities: [],
};

const ACTIVITY_ICON = { call: "📞", whatsapp: "💬", email: "📧", stage: "🔄", note: "📝", task: "✅" };

export default function CRMOpportunityDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const [notes, setNotes] = useState("");
  const opp = MOCK_OPPS[id] || { ...FALLBACK, id };

  const TABS = ["overview", "history", "activity", "notes"];

  return (
    <div className="space-y-5">
      <Link to="/admin/crm/pipelines" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-600 font-semibold">
        <ChevronLeft size={14} /> Back to Pipelines
      </Link>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 text-xl font-black flex items-center justify-center flex-shrink-0">🎯</div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <h1 className="text-xl font-black text-gray-900">{opp.title}</h1>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${opp.status === "won" ? "bg-green-100 text-green-700" : opp.status === "lost" ? "bg-red-100 text-red-600" : "bg-blue-100 text-blue-700"}`}>{opp.status}</span>
              {opp.tags.map(t => <span key={t} className="text-[9px] bg-red-100 text-red-600 font-bold px-1.5 rounded-full">{t}</span>)}
            </div>
            <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
              <span>📊 {opp.pipeline}</span>
              <span>🏷 Stage: <strong>{opp.stageName}</strong></span>
              <span>👤 {opp.owner}</span>
              <span>🕒 {opp.lastActivity}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-black text-violet-600">EGP {opp.value.toLocaleString()}</p>
            <p className="text-xs text-gray-400">{opp.probability}% probability</p>
          </div>
        </div>
        {/* Quick actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 flex-wrap">
          <button className="flex items-center gap-1.5 bg-green-500 text-white font-bold px-3 py-2 rounded-lg text-xs"><Phone size={12} /> Call</button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs"><MessageCircle size={12} /> Message</button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs"><CheckCircle size={12} /> Task</button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs"><Pencil size={12} /> Edit</button>
          <Link to={`/admin/crm/contacts/${opp.contactId}`} className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs ml-auto">View Contact →</Link>
        </div>
      </div>

      {/* Key fields */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Contact", value: opp.contactName },
          { label: "Account", value: opp.accountName || "—" },
          { label: "Close Date", value: opp.expectedClose },
          { label: "Source", value: opp.source },
        ].map(({ label, value }) => (
          <div key={label} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3">
            <p className="text-[10px] text-gray-400 mb-0.5">{label}</p>
            <p className="text-xs font-bold text-gray-800">{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 overflow-x-auto no-scrollbar">
        {TABS.map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap capitalize ${activeTab === tab ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
            {tab}
          </button>
        ))}
      </div>

      <div>
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <h3 className="text-sm font-black text-gray-900 mb-3">Opportunity Details</h3>
              <div className="space-y-2">
                {[["Pipeline", opp.pipeline], ["Stage", opp.stageName], ["Probability", `${opp.probability}%`], ["Value", `EGP ${opp.value.toLocaleString()}`], ["Expected Close", opp.expectedClose], ["Owner", opp.owner], ["Next Step", opp.nextStep]].map(([k, v]) => (
                  <div key={k} className="flex justify-between py-1.5 border-b border-gray-50 last:border-0">
                    <span className="text-xs text-gray-500 w-28">{k}</span>
                    <span className="text-xs font-semibold text-gray-800">{v}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3"><Bot size={14} className="text-violet-500" /><h3 className="text-sm font-black text-gray-900">AI Insights <span className="text-[9px] bg-gray-100 text-gray-400 font-bold px-1.5 rounded ml-1">PLACEHOLDER</span></h3></div>
              <div className="space-y-2">
                <div className="bg-violet-50 rounded-xl p-3 text-xs text-gray-600">🎯 High probability win (70%). Contact confirmed interest. Price sensitivity noted.</div>
                <div className="bg-yellow-50 rounded-xl p-3 text-xs text-gray-600">⚠️ Deal at risk if not closed before May 1 renewal date.</div>
                <div className="bg-green-50 rounded-xl p-3 text-xs text-gray-600">💡 Suggested: Send competitor comparison + 10% discount offer.</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "history" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>{["Stage", "Entered", "Exited", "Days in Stage", "Moved By"].map(h => <th key={h} className="px-4 py-3 text-left font-bold text-gray-500">{h}</th>)}</tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {opp.stageHistory.map((h, i) => (
                  <tr key={i} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-bold text-gray-800">{h.stage}</td>
                    <td className="px-4 py-3 text-gray-600">{h.enteredAt}</td>
                    <td className="px-4 py-3 text-gray-500">{h.exitedAt || <span className="text-blue-600 font-bold">Current</span>}</td>
                    <td className="px-4 py-3"><span className={`font-bold ${h.daysInStage > 14 ? "text-red-500" : "text-gray-700"}`}>{h.daysInStage}d</span></td>
                    <td className="px-4 py-3 text-gray-600">{h.movedBy}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "activity" && (
          <div className="space-y-2">
            {opp.activities.map((a, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3 shadow-sm">
                <span className="text-xl">{ACTIVITY_ICON[a.type] || "•"}</span>
                <div className="flex-1"><p className="text-xs font-semibold text-gray-800">{a.text}</p><p className="text-[10px] text-gray-400 mt-0.5">{a.actor} · {a.time}</p></div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "notes" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-black text-gray-900 mb-3">Notes</h3>
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 text-xs text-gray-700 mb-4">{opp.notes}</div>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={4} placeholder="Add a note..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-violet-400 resize-none" />
            <div className="flex justify-end mt-2"><button className="bg-violet-600 text-white font-bold px-4 py-2 rounded-xl text-xs">Save</button></div>
          </div>
        )}
      </div>
    </div>
  );
}