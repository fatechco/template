import { useState, useMemo } from "react";
import {
  Plus, Play, Pause, Zap, Clock, CheckCircle, AlertCircle,
  ChevronRight, X, RefreshCw, Eye, Filter, Search, History
} from "lucide-react";

// ─── Config ────────────────────────────────────────────────────────────────────
const TRIGGERS = [
  { value: "new_user_registered", label: "New User Registered" },
  { value: "profile_incomplete_Xd", label: "Profile Incomplete for X Days" },
  { value: "subscription_expires_Xd", label: "Subscription Expires in X Days" },
  { value: "no_reply_Xh", label: "No Reply After X Hours" },
  { value: "opportunity_stage_changed", label: "Opportunity Stage Changed" },
  { value: "call_completed", label: "Call Completed" },
  { value: "task_overdue", label: "Task Overdue" },
  { value: "import_moved_pending", label: "Imported Record Moved to Pending" },
  { value: "order_created", label: "Order Created" },
  { value: "service_request_created", label: "Service Request Created" },
  { value: "contact_tag_added", label: "Tag Added to Contact" },
  { value: "manual_trigger", label: "Manual / On Demand" },
];

const ACTIONS = [
  { value: "create_task", label: "Create Task", icon: "✅" },
  { value: "assign_owner", label: "Assign Owner", icon: "👤" },
  { value: "change_stage", label: "Change Stage", icon: "🔄" },
  { value: "add_tag", label: "Add Tag", icon: "🏷" },
  { value: "notify_manager", label: "Notify Manager", icon: "🔔" },
  { value: "schedule_callback", label: "Schedule Callback", icon: "📞" },
  { value: "request_ai_draft", label: "Request AI Message Draft", icon: "🤖" },
  { value: "request_ai_call", label: "Request AI Call", icon: "🤖📞" },
  { value: "send_approved_template", label: "Send Approved Template", icon: "💬" },
  { value: "wait", label: "Wait (Delay)", icon: "⏳" },
  { value: "branch", label: "Branch / Condition", icon: "⑂" },
  { value: "approval_step", label: "Require Approval", icon: "🛡" },
  { value: "stop_sequence", label: "Stop Sequence", icon: "🛑" },
  { value: "escalate", label: "Escalate", icon: "⚠️" },
];

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  paused: "bg-yellow-100 text-yellow-700",
  draft: "bg-gray-100 text-gray-600",
  archived: "bg-gray-50 text-gray-400",
};

const RUN_STATUS_COLORS = {
  completed: "bg-green-100 text-green-700",
  running: "bg-blue-100 text-blue-700",
  failed: "bg-red-100 text-red-600",
  waiting: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-gray-100 text-gray-500",
};

// ─── Mock workflows ────────────────────────────────────────────────────────────
const MOCK_WORKFLOWS = [
  {
    id: "wf1", name: "New Agent Welcome Sequence", trigger: "new_user_registered",
    status: "active", runCount: 142, lastRunAt: "10 min ago",
    steps: [
      { id: "s1", type: "send_approved_template", label: "Send Welcome WhatsApp", icon: "💬" },
      { id: "s2", type: "wait", label: "Wait 24 hours", icon: "⏳" },
      { id: "s3", type: "create_task", label: "Create: Profile check task", icon: "✅" },
      { id: "s4", type: "branch", label: "If profile < 60% → send reminder", icon: "⑂" },
    ],
    audience: "Agents", createdBy: "Admin",
  },
  {
    id: "wf2", name: "Subscription Renewal — 30 Days Out", trigger: "subscription_expires_Xd",
    status: "active", runCount: 89, lastRunAt: "2 hrs ago",
    steps: [
      { id: "s1", type: "create_task", label: "Create renewal task", icon: "✅" },
      { id: "s2", type: "send_approved_template", label: "Send renewal reminder", icon: "💬" },
      { id: "s3", type: "wait", label: "Wait 7 days", icon: "⏳" },
      { id: "s4", type: "request_ai_draft", label: "Request AI follow-up draft", icon: "🤖" },
      { id: "s5", type: "approval_step", label: "Require manager approval", icon: "🛡" },
    ],
    audience: "All subscribers", createdBy: "Admin",
  },
  {
    id: "wf3", name: "No-Response Follow-up (3 Days)", trigger: "no_reply_Xh",
    status: "active", runCount: 214, lastRunAt: "1 day ago",
    steps: [
      { id: "s1", type: "send_approved_template", label: "Send follow-up #1", icon: "💬" },
      { id: "s2", type: "wait", label: "Wait 48 hours", icon: "⏳" },
      { id: "s3", type: "branch", label: "If still no reply → escalate", icon: "⑂" },
      { id: "s4", type: "escalate", label: "Escalate to manager", icon: "⚠️" },
    ],
    audience: "All contacts", createdBy: "Adel M.",
  },
  {
    id: "wf4", name: "Profile Completion Nudge", trigger: "profile_incomplete_Xd",
    status: "paused", runCount: 58, lastRunAt: "5 days ago",
    steps: [
      { id: "s1", type: "send_approved_template", label: "Send profile completion SMS", icon: "📱" },
      { id: "s2", type: "wait", label: "Wait 3 days", icon: "⏳" },
      { id: "s3", type: "request_ai_call", label: "Request AI reminder call", icon: "🤖📞" },
    ],
    audience: "Agents < 70% profile", createdBy: "Admin",
  },
  {
    id: "wf5", name: "Post-Call Task Creation", trigger: "call_completed",
    status: "active", runCount: 312, lastRunAt: "30 min ago",
    steps: [
      { id: "s1", type: "create_task", label: "Auto-create follow-up task", icon: "✅" },
      { id: "s2", type: "add_tag", label: "Tag contact with outcome", icon: "🏷" },
    ],
    audience: "All contacts", createdBy: "System",
  },
];

const MOCK_RUNS = Array.from({ length: 20 }, (_, i) => ({
  id: `run${i + 1}`,
  workflowId: MOCK_WORKFLOWS[i % MOCK_WORKFLOWS.length].id,
  workflowName: MOCK_WORKFLOWS[i % MOCK_WORKFLOWS.length].name,
  contactName: ["Ahmed Hassan", "Sara Mohamed", "Karim Ali", "Nour Hassan"][i % 4],
  status: ["completed", "running", "failed", "waiting", "completed", "completed"][i % 6],
  startedAt: `2026-04-0${Math.min(i % 9 + 1, 9)} ${(9 + i % 8)}:00`,
  completedAt: i % 6 !== 1 ? `2026-04-0${Math.min(i % 9 + 1, 9)} ${(10 + i % 8)}:00` : null,
  currentStep: i % 6 === 1 ? "Wait 24 hours" : i % 6 === 3 ? "Waiting for approval" : null,
  errorMessage: i % 6 === 2 ? "WhatsApp provider not configured" : null,
  stepsCompleted: i % 4 + 1,
}));

// ─── Workflow Builder Modal ────────────────────────────────────────────────────
function WorkflowBuilderModal({ workflow, onClose }) {
  const [steps, setSteps] = useState(workflow?.steps || []);
  const [trigger, setTrigger] = useState(workflow?.trigger || "new_user_registered");
  const [name, setName] = useState(workflow?.name || "");

  const addStep = (action) => {
    setSteps(prev => [...prev, { id: `s${Date.now()}`, type: action.value, label: action.label, icon: action.icon }]);
  };

  const removeStep = (id) => setSteps(prev => prev.filter(s => s.id !== id));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
          <h2 className="text-base font-black text-gray-900">{workflow ? "Edit Workflow" : "Create Workflow"}</h2>
          <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
        </div>
        <div className="p-5 grid grid-cols-1 xl:grid-cols-3 gap-5">
          {/* Left: Builder canvas */}
          <div className="xl:col-span-2 space-y-4">
            <input placeholder="Workflow name..." value={name} onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-bold focus:outline-none focus:border-violet-400" />
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1.5">Trigger</label>
              <select value={trigger} onChange={e => setTrigger(e.target.value)}
                className="w-full border border-violet-300 bg-violet-50 text-violet-700 font-bold rounded-xl px-3 py-2.5 text-sm focus:outline-none">
                {TRIGGERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
              </select>
            </div>

            {/* Steps canvas */}
            <div>
              <label className="block text-[10px] font-black text-gray-500 uppercase mb-1.5">Steps</label>
              <div className="relative">
                <div className="absolute left-5 top-0 bottom-0 w-px bg-gray-200" />
                <div className="space-y-2">
                  {steps.map((step, i) => (
                    <div key={step.id} className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-white border-2 border-violet-200 flex items-center justify-center text-base z-10 flex-shrink-0">{step.icon}</div>
                      <div className="flex-1 bg-white border border-gray-100 rounded-xl px-3 py-2 text-xs font-semibold text-gray-800 flex items-center justify-between shadow-sm">
                        <span>{step.label}</span>
                        <button onClick={() => removeStep(step.id)} className="text-gray-300 hover:text-red-400 ml-2"><X size={11} /></button>
                      </div>
                    </div>
                  ))}
                  {steps.length === 0 && <div className="ml-14 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center text-xs text-gray-400">Add steps from the panel →</div>}
                  {steps.length > 0 && (
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-400 text-xs z-10 flex-shrink-0">END</div>
                      <div className="flex-1 bg-gray-50 border border-dashed border-gray-200 rounded-xl px-3 py-2 text-xs text-gray-400">Sequence ends</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Action palette */}
          <div>
            <label className="block text-[10px] font-black text-gray-500 uppercase mb-1.5">Add Steps</label>
            <div className="space-y-1 max-h-64 overflow-y-auto">
              {ACTIONS.map(a => (
                <button key={a.value} onClick={() => addStep(a)}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold text-gray-700 hover:bg-violet-50 hover:text-violet-700 border border-gray-100 hover:border-violet-200 transition-colors">
                  <span>{a.icon}</span> {a.label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div className="p-5 border-t border-gray-100 flex gap-3 justify-end sticky bottom-0 bg-white">
          <button onClick={onClose} className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs">Cancel</button>
          <button className="border border-gray-200 text-gray-600 font-bold px-4 py-2 rounded-xl text-xs">Save Draft</button>
          <button className="bg-violet-600 text-white font-black px-5 py-2 rounded-xl text-xs hover:bg-violet-700">Activate Workflow</button>
        </div>
      </div>
    </div>
  );
}

// ─── Run History Panel ────────────────────────────────────────────────────────
function RunHistoryPanel({ workflowId, onClose }) {
  const runs = workflowId ? MOCK_RUNS.filter(r => r.workflowId === workflowId) : MOCK_RUNS;
  const workflow = MOCK_WORKFLOWS.find(w => w.id === workflowId);

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      <div className="p-5 border-b border-gray-100 flex items-center justify-between">
        <div>
          <h2 className="text-base font-black text-gray-900">Run History</h2>
          {workflow && <p className="text-xs text-gray-400">{workflow.name}</p>}
        </div>
        <button onClick={onClose}><X size={16} className="text-gray-400" /></button>
      </div>
      <div className="flex-1 overflow-y-auto">
        {/* Stats */}
        <div className="p-4 grid grid-cols-4 gap-2 border-b border-gray-100">
          {[
            { label: "Total", value: runs.length, color: "text-gray-900" },
            { label: "Completed", value: runs.filter(r => r.status === "completed").length, color: "text-green-600" },
            { label: "Failed", value: runs.filter(r => r.status === "failed").length, color: "text-red-500" },
            { label: "Waiting", value: runs.filter(r => r.status === "waiting").length, color: "text-yellow-600" },
          ].map(s => <div key={s.label} className="text-center"><p className={`text-lg font-black ${s.color}`}>{s.value}</p><p className="text-[10px] text-gray-400">{s.label}</p></div>)}
        </div>

        <div className="divide-y divide-gray-50">
          {runs.map(run => (
            <div key={run.id} className="px-4 py-3 hover:bg-gray-50">
              <div className="flex items-center justify-between mb-1">
                <p className="text-xs font-bold text-gray-900">{run.contactName}</p>
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full capitalize ${RUN_STATUS_COLORS[run.status]}`}>{run.status}</span>
              </div>
              <p className="text-[10px] text-gray-500">Started: {run.startedAt} · Steps: {run.stepsCompleted}</p>
              {run.currentStep && <p className="text-[10px] text-blue-600 mt-0.5">⏳ {run.currentStep}</p>}
              {run.errorMessage && <p className="text-[10px] text-red-500 mt-0.5">✗ {run.errorMessage}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CRMAutomations() {
  const [workflows, setWorkflows] = useState(MOCK_WORKFLOWS);
  const [showBuilder, setShowBuilder] = useState(false);
  const [editingWf, setEditingWf] = useState(null);
  const [showRuns, setShowRuns] = useState(null);
  const [activeTab, setActiveTab] = useState("workflows");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search) return workflows;
    const q = search.toLowerCase();
    return workflows.filter(w => w.name.toLowerCase().includes(q));
  }, [workflows, search]);

  const toggleStatus = (id) => {
    setWorkflows(prev => prev.map(w => w.id === id
      ? { ...w, status: w.status === "active" ? "paused" : "active" }
      : w));
  };

  const stats = [
    { label: "Active", value: workflows.filter(w => w.status === "active").length, color: "text-green-600" },
    { label: "Total Runs", value: MOCK_RUNS.length, color: "text-gray-900" },
    { label: "Failed", value: MOCK_RUNS.filter(r => r.status === "failed").length, color: "text-red-500" },
    { label: "Waiting", value: MOCK_RUNS.filter(r => r.status === "waiting").length, color: "text-yellow-600" },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-black text-gray-900">Automations</h1><p className="text-gray-500 text-sm">CRM workflow automation engine</p></div>
        <button onClick={() => { setEditingWf(null); setShowBuilder(true); }}
          className="flex items-center gap-1.5 bg-violet-600 hover:bg-violet-700 text-white font-bold px-3 py-2 rounded-lg text-xs">
          <Plus size={12} /> Create Workflow
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {stats.map(s => <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm"><p className={`text-2xl font-black ${s.color}`}>{s.value}</p><p className="text-xs text-gray-400 mt-0.5">{s.label}</p></div>)}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {[["workflows", "Workflows"], ["runs", "Run History"], ["failed", "Failed Runs"]].map(([id, label]) => (
          <button key={id} onClick={() => setActiveTab(id)}
            className={`px-5 py-3 text-xs font-bold border-b-2 transition-colors ${activeTab === id ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {activeTab === "workflows" && (
        <>
          <div className="relative">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search workflows..."
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-violet-400" />
          </div>
          <div className="space-y-3">
            {filtered.map(wf => (
              <div key={wf.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-sm font-black text-gray-900 truncate">{wf.name}</h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLORS[wf.status]}`}>{wf.status}</span>
                    </div>
                    <div className="flex items-center gap-3 text-[11px] text-gray-500 flex-wrap">
                      <span>⚡ {TRIGGERS.find(t => t.value === wf.trigger)?.label}</span>
                      <span>· {wf.steps.length} steps</span>
                      <span>· {wf.runCount} runs</span>
                      <span>· Last: {wf.lastRunAt}</span>
                      <span>· Audience: {wf.audience}</span>
                    </div>
                    {/* Step preview */}
                    <div className="flex items-center gap-1.5 mt-2 overflow-x-auto no-scrollbar">
                      {wf.steps.map((step, i) => (
                        <div key={step.id} className="flex items-center gap-1 flex-shrink-0">
                          <div className="bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 text-[10px] font-semibold text-gray-600 flex items-center gap-1">
                            <span>{step.icon}</span> {step.label}
                          </div>
                          {i < wf.steps.length - 1 && <ChevronRight size={10} className="text-gray-300" />}
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button onClick={() => setShowRuns(wf.id)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400" title="Run history"><History size={13} /></button>
                    <button onClick={() => { setEditingWf(wf); setShowBuilder(true); }} className="p-1.5 hover:bg-violet-50 rounded-lg text-violet-500" title="Edit"><Eye size={13} /></button>
                    <button onClick={() => toggleStatus(wf.id)}
                      className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${wf.status === "active" ? "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100" : "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"}`}>
                      {wf.status === "active" ? <><Pause size={11} /> Pause</> : <><Play size={11} /> Activate</>}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === "runs" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Workflow", "Contact", "Started", "Steps", "Status", "Details"].map(h => <th key={h} className="px-3 py-3 text-left font-bold text-gray-500">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_RUNS.map(run => (
                <tr key={run.id} className="hover:bg-gray-50">
                  <td className="px-3 py-2.5 font-semibold text-gray-800 max-w-[160px] truncate">{run.workflowName}</td>
                  <td className="px-3 py-2.5 text-gray-600">{run.contactName}</td>
                  <td className="px-3 py-2.5 text-gray-500 whitespace-nowrap">{run.startedAt}</td>
                  <td className="px-3 py-2.5 text-center">{run.stepsCompleted}</td>
                  <td className="px-3 py-2.5"><span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${RUN_STATUS_COLORS[run.status]}`}>{run.status}</span></td>
                  <td className="px-3 py-2.5 text-[10px]">
                    {run.currentStep && <span className="text-blue-600">⏳ {run.currentStep}</span>}
                    {run.errorMessage && <span className="text-red-500">✗ {run.errorMessage}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === "failed" && (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b"><tr>{["Workflow", "Contact", "Error", "Time", ""].map(h => <th key={h} className="px-3 py-3 text-left font-bold text-gray-500">{h}</th>)}</tr></thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_RUNS.filter(r => r.status === "failed").map(run => (
                <tr key={run.id} className="hover:bg-red-50">
                  <td className="px-3 py-2.5 font-semibold text-gray-800 max-w-[160px] truncate">{run.workflowName}</td>
                  <td className="px-3 py-2.5 text-gray-600">{run.contactName}</td>
                  <td className="px-3 py-2.5 text-red-500 font-semibold">{run.errorMessage}</td>
                  <td className="px-3 py-2.5 text-gray-400">{run.startedAt}</td>
                  <td className="px-3 py-2.5"><button className="text-[10px] border border-orange-200 text-orange-600 font-bold px-2 py-1 rounded-lg hover:bg-orange-50">Retry</button></td>
                </tr>
              ))}
              {MOCK_RUNS.filter(r => r.status === "failed").length === 0 && (
                <tr><td colSpan={5} className="py-10 text-center text-gray-400"><p className="font-semibold">No failed runs</p></td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {showBuilder && <WorkflowBuilderModal workflow={editingWf} onClose={() => { setShowBuilder(false); setEditingWf(null); }} />}
      {showRuns !== null && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setShowRuns(null)} />
          <RunHistoryPanel workflowId={showRuns} onClose={() => setShowRuns(null)} />
        </>
      )}
    </div>
  );
}