import { useState } from "react";
import { Bot, Plus, Pencil, Play, Pause, X, CheckCircle, AlertCircle, Shield, Zap } from "lucide-react";

// ─── Config ────────────────────────────────────────────────────────────────────
const AGENT_TYPES = [
  { value: "message_assistant", label: "Message Assistant", icon: "💬", desc: "Drafts, improves, and personalizes outbound messages" },
  { value: "contact_summarizer", label: "Contact Summarizer", icon: "📋", desc: "Generates contact summaries and battlecards" },
  { value: "next_best_action", label: "Next Best Action Agent", icon: "🎯", desc: "Suggests next actions based on CRM context" },
  { value: "renewal_assistant", label: "Renewal Assistant", icon: "🔄", desc: "Handles renewal outreach drafts and call suggestions" },
  { value: "reactivation_assistant", label: "Reactivation Assistant", icon: "🔁", desc: "Drafts reactivation campaigns for churned users" },
  { value: "voice_call_agent", label: "Voice Call Agent", icon: "📞", desc: "AI-powered outbound call automation (readiness phase)" },
];

const ALLOWED_ACTIONS = [
  "draft_message", "improve_message", "translate_message", "personalize_message",
  "summarize_contact", "generate_battlecard", "suggest_next_action",
  "suggest_template", "request_call", "log_transcript", "create_task",
  "change_stage", "add_tag", "schedule_callback",
];

const CHANNELS = ["whatsapp", "email", "sms", "phone"];

const MOCK_AGENTS = [
  {
    id: "ag1", name: "Kemedar Message Assistant", type: "message_assistant",
    isActive: true, requiresApproval: true,
    allowedActions: ["draft_message", "improve_message", "translate_message", "personalize_message"],
    allowedChannels: ["whatsapp", "email", "sms"],
    eligibleAudiences: ["agents", "developers", "common_users"],
    businessHoursOnly: true, businessHoursStart: "09:00", businessHoursEnd: "20:00",
    retryLimit: 2, escalationAfterRetries: true,
    actionsCount: 312, lastActiveAt: "30 min ago",
    systemPrompt: "You are a professional real estate CRM assistant for Kemedar. Draft messages that are professional, concise, and personalized to the contact's role and context.",
  },
  {
    id: "ag2", name: "Contact Summarizer", type: "contact_summarizer",
    isActive: true, requiresApproval: false,
    allowedActions: ["summarize_contact", "generate_battlecard"],
    allowedChannels: [],
    eligibleAudiences: ["all"],
    businessHoursOnly: false, businessHoursStart: null, businessHoursEnd: null,
    retryLimit: 1, escalationAfterRetries: false,
    actionsCount: 1248, lastActiveAt: "5 min ago",
    systemPrompt: "Summarize the contact's CRM profile, recent activities, and generate a battle-card with key facts, likely objections, and next best action.",
  },
  {
    id: "ag3", name: "Next Best Action Agent", type: "next_best_action",
    isActive: true, requiresApproval: false,
    allowedActions: ["suggest_next_action", "suggest_template"],
    allowedChannels: [],
    eligibleAudiences: ["all"],
    businessHoursOnly: false, businessHoursStart: null, businessHoursEnd: null,
    retryLimit: 1, escalationAfterRetries: false,
    actionsCount: 892, lastActiveAt: "15 min ago",
    systemPrompt: "Based on the contact's profile, timeline, and open opportunities, suggest the single best next action for the assigned rep to take.",
  },
  {
    id: "ag4", name: "Renewal Assistant", type: "renewal_assistant",
    isActive: true, requiresApproval: true,
    allowedActions: ["draft_message", "personalize_message", "request_call", "create_task"],
    allowedChannels: ["whatsapp", "email"],
    eligibleAudiences: ["agents", "agencies", "developers"],
    businessHoursOnly: true, businessHoursStart: "09:00", businessHoursEnd: "18:00",
    retryLimit: 3, escalationAfterRetries: true,
    actionsCount: 178, lastActiveAt: "2 hrs ago",
    systemPrompt: "You assist with subscription renewal outreach. Draft personalized renewal messages highlighting the value of the plan and offering appropriate incentives.",
  },
  {
    id: "ag5", name: "Reactivation Assistant", type: "reactivation_assistant",
    isActive: false, requiresApproval: true,
    allowedActions: ["draft_message", "schedule_callback", "add_tag"],
    allowedChannels: ["whatsapp", "sms"],
    eligibleAudiences: ["churned_users"],
    businessHoursOnly: true, businessHoursStart: "10:00", businessHoursEnd: "19:00",
    retryLimit: 2, escalationAfterRetries: false,
    actionsCount: 34, lastActiveAt: "5 days ago",
    systemPrompt: "Draft re-engagement messages for churned contacts. Be empathetic, offer a clear incentive, and keep messages short.",
  },
  {
    id: "ag6", name: "Voice Call Agent", type: "voice_call_agent",
    isActive: false, requiresApproval: true,
    allowedActions: ["request_call", "log_transcript", "create_task", "schedule_callback"],
    allowedChannels: ["phone"],
    eligibleAudiences: ["agents", "developers"],
    businessHoursOnly: true, businessHoursStart: "09:00", businessHoursEnd: "17:00",
    retryLimit: 1, escalationAfterRetries: true,
    actionsCount: 0, lastActiveAt: null,
    systemPrompt: "You are an AI call agent for Kemedar. Handle outbound reminder calls for profile completion, renewals, and activation. Always introduce yourself as a Kemedar virtual assistant.",
    readinessPhase: true,
  },
];

// ─── Agent Edit Modal ──────────────────────────────────────────────────────────
function AgentModal({ agent, onClose }) {
  const [form, setForm] = useState(agent);
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));
  const toggleAction = (a) => setForm(p => ({ ...p, allowedActions: p.allowedActions.includes(a) ? p.allowedActions.filter(x => x !== a) : [...p.allowedActions, a] }));
  const toggleChannel = (c) => setForm(p => ({ ...p, allowedChannels: p.allowedChannels.includes(c) ? p.allowedChannels.filter(x => x !== c) : [...p.allowedChannels, c] }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-base font-black text-gray-900">Configure AI Agent</h2>
          <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
        </div>
        <div className="p-5 space-y-4">
          {/* Basics */}
          <input placeholder="Agent name..." value={form.name} onChange={e => set("name", e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-violet-400" />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Type</label>
              <select value={form.type} onChange={e => set("type", e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none">
                {AGENT_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>
            <div className="flex flex-col gap-2 pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.requiresApproval} onChange={e => set("requiresApproval", e.target.checked)} className="accent-violet-600" />
                <span className="text-xs font-semibold text-gray-700">Requires Approval</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.businessHoursOnly} onChange={e => set("businessHoursOnly", e.target.checked)} className="accent-violet-600" />
                <span className="text-xs font-semibold text-gray-700">Business Hours Only</span>
              </label>
            </div>
          </div>

          {form.businessHoursOnly && (
            <div className="grid grid-cols-2 gap-3">
              <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Start</label>
                <input type="time" value={form.businessHoursStart || ""} onChange={e => set("businessHoursStart", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" /></div>
              <div><label className="block text-[10px] font-bold text-gray-500 mb-1">End</label>
                <input type="time" value={form.businessHoursEnd || ""} onChange={e => set("businessHoursEnd", e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" /></div>
            </div>
          )}

          {/* Allowed actions */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Allowed Actions</label>
            <div className="flex flex-wrap gap-1.5">
              {ALLOWED_ACTIONS.map(a => (
                <button key={a} onClick={() => toggleAction(a)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-full border transition-all ${form.allowedActions.includes(a) ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-500 border-gray-200 hover:border-violet-300"}`}>
                  {a.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          {/* Channels */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-2">Allowed Channels</label>
            <div className="flex gap-2">
              {CHANNELS.map(c => (
                <button key={c} onClick={() => toggleChannel(c)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-all capitalize ${form.allowedChannels.includes(c) ? "bg-green-600 text-white border-green-600" : "bg-white text-gray-500 border-gray-200"}`}>
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Retry + Escalation */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] font-bold text-gray-500 mb-1">Retry Limit</label>
              <input type="number" min={0} max={5} value={form.retryLimit} onChange={e => set("retryLimit", +e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none" />
            </div>
            <div className="flex items-end pb-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.escalationAfterRetries} onChange={e => set("escalationAfterRetries", e.target.checked)} className="accent-violet-600" />
                <span className="text-xs font-semibold text-gray-700">Escalate after retries</span>
              </label>
            </div>
          </div>

          {/* System prompt */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1.5">System Prompt</label>
            <textarea value={form.systemPrompt} onChange={e => set("systemPrompt", e.target.value)} rows={4}
              className="w-full border border-gray-200 rounded-xl px-3 py-3 text-xs font-mono focus:outline-none focus:border-violet-400 resize-none bg-gray-50" />
            <div className="flex items-center gap-2 mt-1">
              <span className="text-[10px] text-red-500 font-bold">⚠️ Super Admin only</span>
              <span className="text-[10px] text-gray-400">Changes affect all new AI actions</span>
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
          <button onClick={onClose} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs">Cancel</button>
          <button className="bg-violet-600 text-white font-black px-5 py-2 rounded-xl text-xs">Save Configuration</button>
        </div>
      </div>
    </div>
  );
}

// ─── Agent Card ───────────────────────────────────────────────────────────────
function AgentCard({ agent, onEdit, onToggle }) {
  const typeConf = AGENT_TYPES.find(t => t.value === agent.type);
  return (
    <div className={`bg-white rounded-xl border shadow-sm p-5 ${!agent.isActive ? "opacity-75" : "border-gray-100"} ${agent.readinessPhase ? "border-dashed border-purple-300" : ""}`}>
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-violet-100 text-2xl flex items-center justify-center flex-shrink-0">{typeConf?.icon}</div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-black text-gray-900">{agent.name}</h3>
              {agent.readinessPhase && <span className="text-[9px] bg-purple-100 text-purple-600 font-black px-1.5 py-0.5 rounded-full">READINESS PHASE</span>}
            </div>
            <p className="text-[11px] text-gray-500">{typeConf?.desc}</p>
          </div>
        </div>
        <button onClick={() => onToggle(agent.id)}
          className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all flex-shrink-0 ${agent.isActive ? "bg-orange-50 border-orange-200 text-orange-600" : "bg-green-50 border-green-200 text-green-600"}`}>
          {agent.isActive ? <><Pause size={11} /> Pause</> : <><Play size={11} /> Activate</>}
        </button>
      </div>

      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] mb-3">
        <div className="flex items-center gap-1.5"><Shield size={11} className="text-gray-400" /><span className="text-gray-500">Approval:</span><span className="font-bold text-gray-700">{agent.requiresApproval ? "Required" : "Auto"}</span></div>
        <div className="flex items-center gap-1.5"><Zap size={11} className="text-gray-400" /><span className="text-gray-500">Actions:</span><span className="font-bold text-gray-700">{agent.actionsCount}</span></div>
        {agent.businessHoursOnly && <div className="flex items-center gap-1.5 col-span-2"><Bot size={11} className="text-gray-400" /><span className="text-gray-500">Hours:</span><span className="font-bold text-gray-700">{agent.businessHoursStart}–{agent.businessHoursEnd}</span></div>}
      </div>

      {agent.allowedActions.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {agent.allowedActions.map(a => <span key={a} className="text-[9px] bg-violet-50 text-violet-600 font-bold px-1.5 py-0.5 rounded-full">{a.replace(/_/g, " ")}</span>)}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <span className="text-[10px] text-gray-400">{agent.lastActiveAt ? `Last active: ${agent.lastActiveAt}` : "Never activated"}</span>
        <button onClick={() => onEdit(agent)} className="flex items-center gap-1 text-[10px] font-bold text-violet-600 hover:underline"><Pencil size={10} /> Configure</button>
      </div>
    </div>
  );
}

// ─── AI Actions Log ───────────────────────────────────────────────────────────
const MOCK_AI_ACTIONS = Array.from({ length: 12 }, (_, i) => ({
  id: `aia${i + 1}`,
  agentId: MOCK_AGENTS[i % MOCK_AGENTS.length].id,
  agentName: MOCK_AGENTS[i % MOCK_AGENTS.length].name,
  actionType: ["draft_message", "summarize_contact", "suggest_next_action", "generate_battlecard"][i % 4],
  contactName: ["Ahmed Hassan", "Sara Mohamed", "Karim Ali"][i % 3],
  status: ["pending_approval", "approved", "rejected", "executed", "failed"][i % 5],
  requestedBy: ["System", "You", "Automation"][i % 3],
  approvedBy: i % 5 === 1 ? "Admin" : null,
  executedAt: i % 5 === 3 ? "30 min ago" : null,
  createdAt: `2026-04-0${Math.min(i + 1, 9)}`,
}));

const ACTION_STATUS_COLORS = {
  pending_approval: "bg-yellow-100 text-yellow-700",
  approved: "bg-blue-100 text-blue-700",
  rejected: "bg-red-100 text-red-600",
  executed: "bg-green-100 text-green-700",
  failed: "bg-red-100 text-red-700",
};

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CRMAIAgents() {
  const [agents, setAgents] = useState(MOCK_AGENTS);
  const [editingAgent, setEditingAgent] = useState(null);
  const [activeTab, setActiveTab] = useState("agents");

  const toggleAgent = (id) => {
    setAgents(prev => prev.map(a => a.id === id ? { ...a, isActive: !a.isActive } : a));
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-black text-gray-900">AI Agents Center</h1><p className="text-gray-500 text-sm">Configure and monitor CRM AI agents</p></div>
      </div>

      {/* Warning banner */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-2 text-xs text-orange-700">
        <AlertCircle size={14} className="flex-shrink-0 mt-0.5" />
        <div>
          <strong>AI Governance Active.</strong> All AI actions that require approval will not execute until reviewed and approved in the Approvals Queue. AI agents cannot modify sensitive fields without human approval.
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {[["agents", "Agents"], ["actions", "Action Log"], ["voice", "Voice Readiness"]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === id ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "agents" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} onEdit={setEditingAgent} onToggle={toggleAgent} />
          ))}
        </div>
      )}

      {activeTab === "actions" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Agent", "Action Type", "Contact", "Status", "Requested By", "Approved By", "Date", ""].map(h => <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_AI_ACTIONS.map(a => (
                <tr key={a.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 font-semibold text-gray-800 max-w-[140px] truncate">{a.agentName}</td>
                  <td className="px-3 py-2.5 text-gray-600 capitalize">{a.actionType.replace(/_/g, " ")}</td>
                  <td className="px-3 py-2.5 text-gray-600">{a.contactName}</td>
                  <td className="px-3 py-2.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${ACTION_STATUS_COLORS[a.status]}`}>{a.status.replace(/_/g, " ")}</span></td>
                  <td className="px-3 py-2.5 text-gray-500">{a.requestedBy}</td>
                  <td className="px-3 py-2.5 text-gray-500">{a.approvedBy || <span className="text-gray-300">—</span>}</td>
                  <td className="px-3 py-2.5 text-gray-400">{a.createdAt}</td>
                  <td className="px-3 py-2.5">
                    {a.status === "pending_approval" && (
                      <button className="text-[10px] text-violet-600 font-bold hover:underline">Review →</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "voice" && (
        <div className="space-y-4">
          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 flex items-start gap-3">
            <span className="text-3xl">📞</span>
            <div>
              <h3 className="text-sm font-black text-purple-700">Voice Call Agent — Readiness Phase</h3>
              <p className="text-xs text-purple-600 mt-1">The AI Voice Call Agent infrastructure is built and ready. Connect a telephony provider (Twilio, ElevenLabs) to activate. All call scripts, personalization inputs, and outcome capture are configured.</p>
            </div>
          </div>

          {/* Call script builder */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-black text-gray-900 mb-3">📜 Approved Call Scripts</h3>
            <div className="space-y-3">
              {[
                { name: "Renewal Reminder — AR", useCase: "subscription_expires_Xd", lang: "Arabic", status: "approved" },
                { name: "Profile Completion — AR", useCase: "profile_incomplete_Xd", lang: "Arabic", status: "approved" },
                { name: "Activation Follow-up — EN", useCase: "no_reply_Xh", lang: "English", status: "draft" },
                { name: "Onboarding Welcome — AR", useCase: "new_user_registered", lang: "Arabic", status: "pending_review" },
              ].map(s => (
                <div key={s.name} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3 border border-gray-100">
                  <span className="text-xl">📞</span>
                  <div className="flex-1">
                    <p className="text-xs font-bold text-gray-900">{s.name}</p>
                    <p className="text-[10px] text-gray-500">{s.useCase} · {s.lang}</p>
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${s.status === "approved" ? "bg-green-100 text-green-700" : s.status === "pending_review" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-500"}`}>{s.status.replace(/_/g, " ")}</span>
                  <button className="text-[10px] border border-gray-200 text-gray-600 font-bold px-2 py-1 rounded-lg">Edit</button>
                </div>
              ))}
            </div>
          </div>

          {/* Personalization inputs */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-black text-gray-900 mb-3">🎯 Personalization Input Fields</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {["name", "role", "company", "properties_count", "profile_completeness", "package", "renewal_date", "last_activity", "preferred_area", "budget_range", "city"].map(field => (
                <div key={field} className="bg-violet-50 border border-violet-100 rounded-lg px-3 py-2 text-[10px] font-mono text-violet-700 font-bold">
                  {`{{${field}}}`}
                </div>
              ))}
            </div>
          </div>

          {/* Outcome capture */}
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <h3 className="text-sm font-black text-gray-900 mb-3">📊 Post-Call Outcome Capture</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {[["Transcript", "Stored in CRMCall"], ["Summary", "AI-generated"], ["Outcome", "classified from script"], ["Sentiment", "positive/neutral/negative"], ["Objection Type", "tagged from taxonomy"], ["Callback Request", "→ creates task"], ["Escalation Flag", "→ notifies manager"], ["Next Task", "AI-suggested"]].map(([label, desc]) => (
                <div key={label} className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
                  <p className="text-[11px] font-bold text-gray-700">{label}</p>
                  <p className="text-[10px] text-gray-400">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {editingAgent && <AgentModal agent={editingAgent} onClose={() => setEditingAgent(null)} />}
    </div>
  );
}