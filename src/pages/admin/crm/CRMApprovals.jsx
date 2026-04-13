import { useState, useMemo } from "react";
import {
  CheckCircle, X, Eye, AlertCircle, Clock, ChevronRight,
  Bot, MessageCircle, FileText, Zap, Users, Filter, Search
} from "lucide-react";

// ─── Config ────────────────────────────────────────────────────────────────────
const REQUEST_TYPES = {
  template_publish: { icon: "📝", label: "Template Publish", color: "bg-blue-100 text-blue-700" },
  bulk_send: { icon: "📤", label: "Bulk Send", color: "bg-orange-100 text-orange-700" },
  ai_draft: { icon: "🤖", label: "AI Message Draft", color: "bg-purple-100 text-purple-700" },
  ai_call: { icon: "📞", label: "AI Call Trigger", color: "bg-red-100 text-red-700" },
  automation_activation: { icon: "⚡", label: "Automation Activation", color: "bg-yellow-100 text-yellow-700" },
  sensitive_action: { icon: "🛡", label: "Sensitive Action", color: "bg-gray-100 text-gray-700" },
};

const RISK_LEVEL = {
  low: { label: "Low", color: "bg-green-100 text-green-700" },
  medium: { label: "Medium", color: "bg-yellow-100 text-yellow-700" },
  high: { label: "High", color: "bg-orange-100 text-orange-700" },
  critical: { label: "Critical", color: "bg-red-100 text-red-700" },
};

const STATUS_COLOR = {
  pending: "bg-yellow-100 text-yellow-700",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-600",
};

const MOCK_APPROVALS = [
  {
    id: "ap1", type: "template_publish", title: "Publish: No Response Follow-up (AR)", requestedBy: "Sara K.",
    relatedEntity: "Template: No Response Follow-up", affectedCount: 0, riskLevel: "low",
    status: "pending", createdAt: "2 hrs ago",
    reason: "New WhatsApp template for contacts with no response after 5 days.",
    preview: "مرحباً {{first_name}}، لم نتمكن من الوصول إليك مؤخراً. هل يمكنك إخبارنا بالوقت المناسب للتواصل؟",
    audit: [{ action: "created", actor: "Sara K.", time: "2 hrs ago" }],
  },
  {
    id: "ap2", type: "bulk_send", title: "Bulk WhatsApp — Renewal Reminder (April cohort)", requestedBy: "Adel M.",
    relatedEntity: "Campaign: April Renewals", affectedCount: 142, riskLevel: "high",
    status: "pending", createdAt: "3 hrs ago",
    reason: "Sending renewal reminder to all agents with expiry in April. Using approved template renewal_offer_ar_v2.",
    preview: "Hello {{first_name}}, your {{subscription_plan}} plan expires on {{renewal_date}}. Renew today...",
    audit: [{ action: "created", actor: "Adel M.", time: "3 hrs ago" }],
  },
  {
    id: "ap3", type: "ai_draft", title: "AI Draft: Follow-up for Ahmed Hassan", requestedBy: "AI Agent",
    relatedEntity: "Contact: Ahmed Hassan", affectedCount: 1, riskLevel: "medium",
    status: "pending", createdAt: "30 min ago",
    reason: "AI agent suggests sending follow-up based on no response after 3 days. Message drafted and requires approval.",
    preview: "مرحباً أحمد، أودّ التذكير بعرض التجديد الذي أرسلناه. هل لديك أي استفسارات؟",
    audit: [{ action: "ai_generated", actor: "AI Agent", time: "30 min ago" }],
  },
  {
    id: "ap4", type: "automation_activation", title: "Activate: 7-day Onboarding Sequence", requestedBy: "You",
    relatedEntity: "Automation: Onboarding 7d", affectedCount: 38, riskLevel: "medium",
    status: "pending", createdAt: "1 day ago",
    reason: "Activating the 7-day onboarding sequence for newly activated agents. Contains 5 steps over 7 days.",
    preview: "Step 1: Welcome WhatsApp\nStep 2: Profile completion reminder (Day 2)\nStep 3: First listing guide (Day 4)...",
    audit: [{ action: "created", actor: "You", time: "1 day ago" }],
  },
  {
    id: "ap5", type: "template_publish", title: "Publish: Upsell — Featured Listings (AR)", requestedBy: "You",
    relatedEntity: "Template: Upsell Featured Listings", affectedCount: 0, riskLevel: "low",
    status: "approved", createdAt: "2 days ago",
    reason: "Upsell template for featured listings product. Language: Arabic.",
    preview: "هل تريد عرض عقاراتك لأكثر من 50,000 مشتري؟ جرّب خدمة الإعلانات المميزة من كيمدار.",
    audit: [
      { action: "created", actor: "You", time: "2 days ago" },
      { action: "approved", actor: "Admin", time: "1 day ago", comment: "Looks good. Language and tone approved." },
    ],
  },
  {
    id: "ap6", type: "bulk_send", title: "Bulk SMS — Profile Completion Reminder", requestedBy: "Sara K.",
    relatedEntity: "Segment: Incomplete Profiles", affectedCount: 312, riskLevel: "high",
    status: "rejected", createdAt: "3 days ago",
    reason: "Sending profile completion SMS to all users with < 60% profile completion.",
    preview: "أكمل بيانات ملفك الشخصي على كيمدار للحصول على عملاء أكثر. نسبة اكتمال ملفك: {{profile_completion}}%",
    audit: [
      { action: "created", actor: "Sara K.", time: "3 days ago" },
      { action: "rejected", actor: "Admin", time: "2 days ago", comment: "Too broad — filter to agents only, then resubmit." },
    ],
  },
];

// ─── Detail Slide Panel ────────────────────────────────────────────────────────
function ApprovalPanel({ item, onClose, onAction }) {
  const [comment, setComment] = useState("");
  const typeConf = REQUEST_TYPES[item.type];
  const riskConf = RISK_LEVEL[item.riskLevel];

  return (
    <div className="fixed inset-y-0 right-0 w-full max-w-lg bg-white shadow-2xl border-l border-gray-200 z-50 flex flex-col">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xl">{typeConf.icon}</span>
            <h2 className="text-base font-black text-gray-900 leading-tight">{item.title}</h2>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${typeConf.color}`}>{typeConf.label}</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${riskConf.color}`}>{riskConf.label} Risk</span>
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLOR[item.status]}`}>{item.status}</span>
          </div>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Request info */}
        <div className="p-5 border-b border-gray-100 space-y-2">
          <p className="text-[10px] font-black text-gray-500 uppercase">Request Info</p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 text-xs">
            <div className="text-gray-500">Requested by</div><div className="font-semibold text-gray-800">{item.requestedBy}</div>
            <div className="text-gray-500">Related to</div><div className="font-semibold text-gray-800 truncate">{item.relatedEntity}</div>
            <div className="text-gray-500">Affected records</div><div className="font-bold text-gray-900">{item.affectedCount > 0 ? <span className="text-orange-600">{item.affectedCount} records</span> : "—"}</div>
            <div className="text-gray-500">Created</div><div className="text-gray-600">{item.createdAt}</div>
          </div>
        </div>

        {/* Reason */}
        <div className="p-5 border-b border-gray-100">
          <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Reason / Description</p>
          <p className="text-xs text-gray-700 bg-gray-50 rounded-xl p-3 border border-gray-100">{item.reason}</p>
        </div>

        {/* Payload preview */}
        <div className="p-5 border-b border-gray-100">
          <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Payload Preview</p>
          <div className="bg-gray-900 rounded-xl p-4 text-green-400 text-[11px] font-mono whitespace-pre-wrap max-h-32 overflow-y-auto">{item.preview}</div>
        </div>

        {/* Risk warning */}
        {(item.riskLevel === "high" || item.riskLevel === "critical") && (
          <div className="p-5 border-b border-gray-100">
            <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex items-start gap-2">
              <AlertCircle size={14} className="text-orange-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs font-black text-orange-700">{riskConf.label} Risk Action</p>
                <p className="text-[11px] text-orange-600 mt-0.5">
                  {item.affectedCount > 0 ? `This will affect ${item.affectedCount} contacts/records.` : ""}
                  {" "}Ensure content and targeting are correct before approving.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Audit trail */}
        <div className="p-5 border-b border-gray-100">
          <p className="text-[10px] font-black text-gray-500 uppercase mb-2">Audit Trail</p>
          <div className="space-y-2">
            {item.audit.map((a, i) => (
              <div key={i} className="flex items-start gap-2 text-xs">
                <div className="w-2 h-2 rounded-full bg-violet-400 flex-shrink-0 mt-1.5" />
                <div>
                  <span className="font-bold text-gray-700 capitalize">{a.action.replace(/_/g, " ")}</span>
                  <span className="text-gray-400"> by {a.actor} · {a.time}</span>
                  {a.comment && <p className="text-gray-600 mt-0.5 bg-gray-50 rounded p-1.5">{a.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comment + Actions */}
        {item.status === "pending" && (
          <div className="p-5 space-y-3">
            <p className="text-[10px] font-black text-gray-500 uppercase">Add Comment</p>
            <textarea value={comment} onChange={e => setComment(e.target.value)} rows={2}
              placeholder="Optional comment..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none resize-none" />
            <div className="flex gap-3">
              <button onClick={() => onAction(item.id, "rejected", comment)}
                className="flex-1 flex items-center justify-center gap-1.5 border-2 border-red-300 text-red-600 font-black py-2.5 rounded-xl hover:bg-red-50 text-xs">
                <X size={14} /> Reject
              </button>
              <button onClick={() => onAction(item.id, "approved", comment)}
                className="flex-1 flex items-center justify-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-black py-2.5 rounded-xl text-xs">
                <CheckCircle size={14} /> Approve
              </button>
            </div>
          </div>
        )}
        {item.status !== "pending" && (
          <div className="p-5">
            <div className={`rounded-xl p-3 text-center font-black text-sm ${item.status === "approved" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
              {item.status === "approved" ? "✅ This request was approved" : "✗ This request was rejected"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function CRMApprovals() {
  const [approvals, setApprovals] = useState(MOCK_APPROVALS);
  const [activeTab, setActiveTab] = useState("pending");
  const [selectedItem, setSelectedItem] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = useMemo(() => {
    let data = [...approvals];
    if (activeTab !== "all") data = data.filter(a => a.status === activeTab);
    if (search) { const q = search.toLowerCase(); data = data.filter(a => a.title.toLowerCase().includes(q) || a.requestedBy.toLowerCase().includes(q)); }
    if (typeFilter) data = data.filter(a => a.type === typeFilter);
    return data;
  }, [approvals, activeTab, search, typeFilter]);

  const handleAction = (id, status, comment) => {
    setApprovals(prev => prev.map(a => a.id === id ? {
      ...a, status,
      audit: [...a.audit, { action: status, actor: "You", time: "Just now", comment }]
    } : a));
    setSelectedItem(null);
  };

  const TABS = [
    { id: "pending", label: "Pending", count: approvals.filter(a => a.status === "pending").length },
    { id: "approved", label: "Approved", count: approvals.filter(a => a.status === "approved").length },
    { id: "rejected", label: "Rejected", count: approvals.filter(a => a.status === "rejected").length },
    { id: "all", label: "All", count: approvals.length },
  ];

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-black text-gray-900">Approvals Queue</h1><p className="text-gray-500 text-sm">Review and approve sensitive CRM actions</p></div>
        {approvals.filter(a => a.status === "pending").length > 0 && (
          <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2">
            <AlertCircle size={14} className="text-orange-500" />
            <span className="text-xs font-bold text-orange-700">{approvals.filter(a => a.status === "pending").length} pending approval{approvals.filter(a => a.status === "pending").length !== 1 ? "s" : ""}</span>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: "Pending", value: approvals.filter(a => a.status === "pending").length, color: "text-yellow-600" },
          { label: "Approved (7d)", value: approvals.filter(a => a.status === "approved").length, color: "text-green-600" },
          { label: "Rejected (7d)", value: approvals.filter(a => a.status === "rejected").length, color: "text-red-500" },
          { label: "High Risk Pending", value: approvals.filter(a => a.status === "pending" && ["high", "critical"].includes(a.riskLevel)).length, color: "text-orange-600" },
        ].map(s => <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 text-center shadow-sm"><p className={`text-2xl font-black ${s.color}`}>{s.value}</p><p className="text-xs text-gray-400 mt-0.5">{s.label}</p></div>)}
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === tab.id ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-700"}`}>
            {tab.label}
            <span className="ml-1.5 bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{tab.count}</span>
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search requests..."
            className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-violet-400" />
        </div>
        <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none bg-white">
          <option value="">All Types</option>
          {Object.entries(REQUEST_TYPES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
        </select>
      </div>

      {/* Approvals list */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>{["Request", "Related To", "Requested By", "Affected", "Risk", "Created", "Status", ""].map(h => (
                <th key={h} className="px-3 py-3 text-left font-bold text-gray-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
              ))}</tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="py-16 text-center text-gray-400">
                  <CheckCircle size={30} className="mx-auto mb-2 opacity-20" />
                  <p className="font-semibold">No {activeTab} requests</p>
                </td></tr>
              )}
              {filtered.map(item => {
                const typeConf = REQUEST_TYPES[item.type];
                const riskConf = RISK_LEVEL[item.riskLevel];
                return (
                  <tr key={item.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => setSelectedItem(item)}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="text-base">{typeConf.icon}</span>
                        <div>
                          <p className="font-semibold text-gray-900 max-w-[180px] truncate">{item.title}</p>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${typeConf.color}`}>{typeConf.label}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-500 max-w-[140px] truncate">{item.relatedEntity}</td>
                    <td className="px-3 py-3 font-semibold text-gray-700">{item.requestedBy}</td>
                    <td className="px-3 py-3">
                      {item.affectedCount > 0
                        ? <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">{item.affectedCount}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${riskConf.color}`}>{riskConf.label}</span>
                    </td>
                    <td className="px-3 py-3 text-gray-400">{item.createdAt}</td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${STATUS_COLOR[item.status]}`}>{item.status}</span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-1" onClick={e => e.stopPropagation()}>
                        {item.status === "pending" && (
                          <>
                            <button onClick={() => handleAction(item.id, "approved", "")} className="p-1.5 hover:bg-green-50 rounded text-green-600" title="Approve"><CheckCircle size={13} /></button>
                            <button onClick={() => handleAction(item.id, "rejected", "")} className="p-1.5 hover:bg-red-50 rounded text-red-500" title="Reject"><X size={13} /></button>
                          </>
                        )}
                        <button onClick={() => setSelectedItem(item)} className="p-1.5 hover:bg-violet-50 rounded text-violet-500" title="View"><Eye size={13} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {selectedItem && (
        <>
          <div className="fixed inset-0 bg-black/20 z-40" onClick={() => setSelectedItem(null)} />
          <ApprovalPanel item={selectedItem} onClose={() => setSelectedItem(null)} onAction={handleAction} />
        </>
      )}
    </div>
  );
}