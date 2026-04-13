import { useState } from "react";
import { Shield, Clock, Users, Bot, Phone, Settings, CheckCircle, AlertCircle } from "lucide-react";

function Section({ title, icon: IconComp, iconColor = "text-violet-600", children }) {
  const Icon = IconComp;
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100 bg-gray-50">
        {Icon && <Icon size={16} className={iconColor} />}
        <h2 className="text-sm font-black text-gray-900">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange, label, sub }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="text-sm font-semibold text-gray-700">{label}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      <button onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full flex-shrink-0 transition-all relative ${checked ? "bg-green-500" : "bg-gray-200"}`}>
        <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all ${checked ? "left-6" : "left-1"}`} />
      </button>
    </div>
  );
}

export default function CRMSettings() {
  // Quiet hours
  const [quietStart, setQuietStart] = useState("21:00");
  const [quietEnd, setQuietEnd] = useState("09:00");
  const [quietEnabled, setQuietEnabled] = useState(true);

  // Channel limits
  const [maxWA, setMaxWA] = useState(3);
  const [maxEmail, setMaxEmail] = useState(2);
  const [maxSMS, setMaxSMS] = useState(2);
  const [maxCalls, setMaxCalls] = useState(2);

  // Consent
  const [blockOptedOut, setBlockOptedOut] = useState(true);
  const [requireConsentMarketing, setRequireConsentMarketing] = useState(true);
  const [requireConsentAI, setRequireConsentAI] = useState(true);
  const [logConsent, setLogConsent] = useState(true);

  // Assignments
  const [roundRobin, setRoundRobin] = useState(true);
  const [autoAssignImport, setAutoAssignImport] = useState(true);
  const [defaultOwner, setDefaultOwner] = useState("Adel M.");

  // AI
  const [aiApprovalRequired, setAiApprovalRequired] = useState(true);
  const [aiBulkSendApproval, setAiBulkSendApproval] = useState(true);
  const [aiEditFieldsApproval, setAiEditFieldsApproval] = useState(true);
  const [aiMaxRetries, setAiMaxRetries] = useState(2);

  // Approvals
  const [templateApprovalRequired, setTemplateApprovalRequired] = useState(true);
  const [bulkSendThreshold, setBulkSendThreshold] = useState(50);
  const [autoApproveAgentSummary, setAutoApproveAgentSummary] = useState(true);

  // Retention
  const [auditRetentionDays, setAuditRetentionDays] = useState(365);
  const [callRetentionDays, setCallRetentionDays] = useState(90);
  const [messageRetentionDays, setMessageRetentionDays] = useState(365);

  // Score formula
  const [scoreRecency, setScoreRecency] = useState(30);
  const [scoreEngagement, setScoreEngagement] = useState(40);
  const [scoreProfile, setScoreProfile] = useState(20);
  const [scoreOpps, setScoreOpps] = useState(10);
  const scoreTotal = scoreRecency + scoreEngagement + scoreProfile + scoreOpps;

  // Call outcomes
  const [callOutcomes] = useState(["connected", "voicemail", "no_answer", "wrong_number", "callback_requested", "interested", "not_interested", "escalated"]);

  // Objection taxonomy
  const [objections] = useState(["price_concern", "competitor_comparison", "not_ready", "budget_constraint", "feature_missing", "bad_experience", "timing"]);

  const SECTIONS = [
    { id: "compliance", label: "Compliance & Consent", icon: Shield },
    { id: "quiet_hours", label: "Quiet Hours & Contact Limits", icon: Clock },
    { id: "assignment", label: "Assignment Rules", icon: Users },
    { id: "ai", label: "AI Policy", icon: Bot },
    { id: "approvals", label: "Approval Rules", icon: CheckCircle },
    { id: "pipelines", label: "Default Pipelines", icon: Settings },
    { id: "scoring", label: "Lead Score Formula", icon: Settings },
    { id: "taxonomy", label: "Outcome Taxonomy", icon: Phone },
    { id: "retention", label: "Data Retention & Audit", icon: Shield },
  ];

  const [activeSection, setActiveSection] = useState("compliance");

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-black text-gray-900">CRM Settings</h1><p className="text-gray-500 text-sm">Operational configuration and compliance rules</p></div>
        <button className="bg-violet-600 text-white font-black px-6 py-2.5 rounded-xl text-sm hover:bg-violet-700">💾 Save All Settings</button>
      </div>

      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 text-xs text-orange-700">
        ⚠️ Settings changes apply immediately. Some changes may affect active workflows and automations.
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
        {SECTIONS.map(s => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap flex-shrink-0 transition-all ${activeSection === s.id ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"}`}>
            {s.label}
          </button>
        ))}
      </div>

      {activeSection === "compliance" && (
        <Section title="Compliance & Consent Rules" icon={Shield}>
          <Toggle checked={blockOptedOut} onChange={setBlockOptedOut} label="Block all outbound to opted-out contacts" sub="Contacts with opted_out=true will never receive messages or calls" />
          <Toggle checked={requireConsentMarketing} onChange={setRequireConsentMarketing} label="Require marketing consent for promotional templates" sub="If consent not given, marketing templates will be blocked" />
          <Toggle checked={requireConsentAI} onChange={setRequireConsentAI} label="Require AI processing consent for AI features" sub="AI summarization and battlecards require ai_processing consent" />
          <Toggle checked={logConsent} onChange={setLogConsent} label="Log all consent changes to audit trail" sub="Every consent grant or revocation creates an audit record" />
          <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-3 text-xs text-green-700">
            ✅ GDPR-ready: All blocked actions due to opt-out are logged. Consent records include timestamp, channel, IP, and recorded_by.
          </div>
        </Section>
      )}

      {activeSection === "quiet_hours" && (
        <Section title="Quiet Hours & Contact Limits" icon={Clock}>
          <Toggle checked={quietEnabled} onChange={setQuietEnabled} label="Enable Quiet Hours" sub="Messages and calls will be queued (not blocked) during quiet hours" />
          {quietEnabled && (
            <div className="grid grid-cols-2 gap-4 mt-3 mb-3">
              <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Quiet Start</label>
                <input type="time" value={quietStart} onChange={e => setQuietStart(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" /></div>
              <div><label className="block text-[10px] font-bold text-gray-500 mb-1">Quiet End</label>
                <input type="time" value={quietEnd} onChange={e => setQuietEnd(e.target.value)} className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none" /></div>
            </div>
          )}
          <p className="text-xs font-black text-gray-700 mb-3 mt-2">Max contact attempts per channel per day:</p>
          <div className="grid grid-cols-2 gap-4">
            {[["WhatsApp", maxWA, setMaxWA], ["Email", maxEmail, setMaxEmail], ["SMS", maxSMS, setMaxSMS], ["Calls", maxCalls, setMaxCalls]].map(([label, val, set]) => (
              <div key={label} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-16 flex-shrink-0">{label}:</span>
                <input type="range" min={1} max={10} value={val} onChange={e => set(+e.target.value)} className="flex-1 accent-violet-500" />
                <span className="text-sm font-black text-violet-600 w-4 text-center">{val}</span>
              </div>
            ))}
          </div>
        </Section>
      )}

      {activeSection === "assignment" && (
        <Section title="Assignment Rules" icon={Users}>
          <Toggle checked={roundRobin} onChange={setRoundRobin} label="Round-robin owner assignment for new contacts" sub="New contacts assigned evenly across active reps" />
          <Toggle checked={autoAssignImport} onChange={setAutoAssignImport} label="Auto-assign imported records" sub="Imported contacts assigned via round-robin on import" />
          <div className="mt-4 flex items-center gap-3">
            <span className="text-sm text-gray-700">Default owner (fallback):</span>
            <select value={defaultOwner} onChange={e => setDefaultOwner(e.target.value)}
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
              {["Adel M.", "Sara K.", "Mona A.", "You"].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
        </Section>
      )}

      {activeSection === "ai" && (
        <Section title="AI Policy Rules" icon={Bot}>
          <Toggle checked={aiApprovalRequired} onChange={setAiApprovalRequired} label="Require approval for all AI outbound actions" sub="AI cannot send messages without human approval" />
          <Toggle checked={aiBulkSendApproval} onChange={setAiBulkSendApproval} label="Require approval for AI bulk sends" sub="Any AI-triggered bulk send needs manager approval" />
          <Toggle checked={aiEditFieldsApproval} onChange={setAiEditFieldsApproval} label="Require approval for AI field edits" sub="AI cannot change stage, plan, or commercial fields without approval" />
          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm text-gray-700">AI max retries per action:</span>
            <input type="number" min={0} max={5} value={aiMaxRetries} onChange={e => setAiMaxRetries(+e.target.value)}
              className="w-16 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
          </div>
          <div className="mt-4 bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700">
            🔒 AI actions that fail the compliance check (opted-out contact, quiet hours, approval missing) are automatically blocked and logged to the audit trail.
          </div>
        </Section>
      )}

      {activeSection === "approvals" && (
        <Section title="Approval Rules" icon={CheckCircle}>
          <Toggle checked={templateApprovalRequired} onChange={setTemplateApprovalRequired} label="Require approval to publish templates" sub="All new templates need admin review before use" />
          <Toggle checked={autoApproveAgentSummary} onChange={setAutoApproveAgentSummary} label="Auto-approve AI contact summaries and battlecards" sub="Summaries are read-only and low risk — no approval needed" />
          <div className="flex items-center gap-3 mt-4">
            <span className="text-sm text-gray-700">Require approval for bulk sends over:</span>
            <input type="number" value={bulkSendThreshold} onChange={e => setBulkSendThreshold(+e.target.value)}
              className="w-20 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
            <span className="text-sm text-gray-500">contacts</span>
          </div>
        </Section>
      )}

      {activeSection === "scoring" && (
        <Section title="Lead Score Formula" icon={Settings}>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs text-gray-600">Total must equal 100%</p>
            <span className={`text-sm font-black ${scoreTotal === 100 ? "text-green-600" : "text-red-500"}`}>{scoreTotal}% {scoreTotal === 100 ? "✅" : "⚠️"}</span>
          </div>
          <div className="space-y-4">
            {[["Recency (last activity)", scoreRecency, setScoreRecency], ["Engagement (calls, messages, opens)", scoreEngagement, setScoreEngagement], ["Profile completeness", scoreProfile, setScoreProfile], ["Open opportunities", scoreOpps, setScoreOpps]].map(([label, val, set]) => (
              <div key={label}>
                <div className="flex justify-between mb-1"><span className="text-xs text-gray-700">{label}</span><span className="text-sm font-black text-violet-600">{val}%</span></div>
                <input type="range" min={0} max={100} value={val} onChange={e => set(+e.target.value)} className="w-full accent-violet-500" />
              </div>
            ))}
          </div>
        </Section>
      )}

      {activeSection === "taxonomy" && (
        <Section title="Outcome Taxonomy" icon={Phone}>
          <p className="text-xs font-black text-gray-700 mb-2">Call Outcome Codes</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {callOutcomes.map(o => <span key={o} className="bg-gray-100 text-gray-700 text-xs font-bold px-3 py-1 rounded-full capitalize">{o.replace(/_/g, " ")}</span>)}
            <button className="border border-dashed border-gray-300 text-gray-400 text-xs font-bold px-3 py-1 rounded-full hover:border-violet-400 hover:text-violet-600">+ Add</button>
          </div>
          <p className="text-xs font-black text-gray-700 mb-2">Objection Taxonomy</p>
          <div className="flex flex-wrap gap-2">
            {objections.map(o => <span key={o} className="bg-red-50 text-red-600 border border-red-200 text-xs font-bold px-3 py-1 rounded-full capitalize">{o.replace(/_/g, " ")}</span>)}
            <button className="border border-dashed border-gray-300 text-gray-400 text-xs font-bold px-3 py-1 rounded-full hover:border-violet-400 hover:text-violet-600">+ Add</button>
          </div>
        </Section>
      )}

      {activeSection === "retention" && (
        <Section title="Data Retention & Audit" icon={Shield}>
          <div className="space-y-4">
            {[["Audit log retention (days)", auditRetentionDays, setAuditRetentionDays], ["Call recording retention (days)", callRetentionDays, setCallRetentionDays], ["Message history retention (days)", messageRetentionDays, setMessageRetentionDays]].map(([label, val, set]) => (
              <div key={label} className="flex items-center gap-4">
                <span className="text-sm text-gray-700 flex-1">{label}</span>
                <input type="number" value={val} onChange={e => set(+e.target.value)} min={30} max={3650}
                  className="w-24 border border-gray-200 rounded-lg px-2 py-1.5 text-sm text-center focus:outline-none" />
              </div>
            ))}
            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
              ℹ️ Audit logs capture: all approval actions, all AI executions, all field changes, all consent updates, all compliance blocks. Logs are immutable and cannot be deleted through the UI.
            </div>
          </div>
        </Section>
      )}

      {/* Default pipelines section - simplified */}
      {activeSection === "pipelines" && (
        <Section title="Default Pipelines" icon={Settings}>
          <p className="text-xs text-gray-500 mb-3">Configure which pipeline is automatically used for each contact type.</p>
          <div className="space-y-3">
            {[["New Agent", "activation"], ["Renewal Due", "renewal"], ["Churned Contact", "reactivation"], ["New Buyer Inquiry", "buyer_conversion"]].map(([type, pipeline]) => (
              <div key={type} className="flex items-center gap-3">
                <span className="text-sm text-gray-700 flex-1">{type}</span>
                <select defaultValue={pipeline} className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none">
                  {["activation", "renewal", "onboarding", "upsell", "reactivation", "buyer_conversion"].map(p => <option key={p} value={p}>{p.replace(/_/g, " ")}</option>)}
                </select>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Sticky save */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-20 px-6 py-3 flex items-center justify-between">
        <p className="text-xs text-gray-400">Last saved: 2026-04-03 09:00 by Admin</p>
        <button className="bg-violet-600 text-white font-black px-8 py-2.5 rounded-xl text-sm hover:bg-violet-700">💾 Save All Settings</button>
      </div>
      <div className="h-16" />
    </div>
  );
}