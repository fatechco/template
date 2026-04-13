import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  ChevronLeft, Phone, Mail, MessageCircle, Plus, Pencil, Download,
  CheckCircle, Users, Building2, TrendingUp, Bot, Shield, Clock, FileText
} from "lucide-react";

// ─── Mock account data ─────────────────────────────────────────────────────────
const MOCK_ACCOUNTS = {
  acc1: {
    id: "acc1",
    name: "Elite Realty",
    type: "agency",
    owner: "You",
    team: "Sales",
    mainContact: "Ahmed Hassan",
    mainContactId: "c1",
    city: "New Cairo",
    country: "Egypt",
    phone: "+20 100 123 4567",
    email: "info@eliterealty.com",
    website: "eliterealty.com",
    plan: "Business",
    renewalDate: "2026-06-01",
    contractStatus: "active",
    healthScore: 78,
    score: 78,
    lifecycleStage: "active",
    lastActivity: "2 days ago",
    openOpportunities: 2,
    contacts: [
      { id: "c1", name: "Ahmed Hassan", role: "Branch Manager", phone: "+20 100 123 4567" },
      { id: "c3", name: "Karim Ali", role: "Agent", phone: "+20 120 456 7890" },
    ],
    tags: ["vip"],
    notes: "Key account — handle renewals with care. 6 agents under this agency.",
    linkedRecords: { properties: 48, projects: 1, orders: 12 },
  },
};

const FALLBACK = {
  id: "acc0", name: "Account Not Found", type: "individual",
  owner: "—", team: "—", mainContact: "—", city: "—", country: "—",
  phone: "—", email: "—", website: "—", plan: "Free",
  renewalDate: "—", contractStatus: "—", healthScore: 0, score: 0,
  lifecycleStage: "prospect", lastActivity: "—", openOpportunities: 0,
  contacts: [], tags: [], notes: "", linkedRecords: {},
};

const TABS = [
  { id: "overview", label: "Overview", icon: TrendingUp },
  { id: "contacts", label: "Contacts", icon: Users },
  { id: "opportunities", label: "Opportunities", icon: TrendingUp },
  { id: "records", label: "Related Records", icon: FileText },
  { id: "notes", label: "Notes & Timeline", icon: Clock },
  { id: "audit", label: "Audit Log", icon: Shield },
];

const TYPE_COLORS = {
  agency: "bg-indigo-100 text-indigo-700",
  developer: "bg-purple-100 text-purple-700",
  store: "bg-orange-100 text-orange-700",
  finishing_company: "bg-teal-100 text-teal-700",
  enterprise: "bg-blue-100 text-blue-700",
  partner: "bg-green-100 text-green-700",
  individual: "bg-gray-100 text-gray-600",
};

// ─── Sub-tabs ─────────────────────────────────────────────────────────────────
function OverviewTab({ account }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
      <div className="xl:col-span-2 space-y-5">
        {/* Basic Info */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 mb-3">Account Information</h3>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1">
            {[
              ["Type", account.type.replace(/_/g, " ")],
              ["Phone", account.phone],
              ["Email", account.email],
              ["Website", account.website],
              ["City", account.city],
              ["Owner", account.owner],
              ["Team", account.team],
              ["Stage", account.lifecycleStage],
              ["Last Activity", account.lastActivity],
              ["Main Contact", account.mainContact],
            ].map(([label, value]) => (
              <div key={label} className="flex items-center py-1.5 border-b border-gray-50 last:border-0">
                <span className="text-xs text-gray-500 w-28 flex-shrink-0">{label}</span>
                <span className="text-xs font-semibold text-gray-800">{value || "—"}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Package / Contract */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 mb-3">💳 Package & Contract</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { label: "Plan", value: account.plan, color: "text-blue-600" },
              { label: "Status", value: account.contractStatus, color: "text-green-600" },
              { label: "Renewal", value: account.renewalDate, color: "text-orange-600" },
              { label: "Health", value: `${account.healthScore}%`, color: "text-violet-600" },
            ].map(({ label, value, color }) => (
              <div key={label} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className={`text-lg font-black ${color}`}>{value}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Linked Records Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <h3 className="text-sm font-black text-gray-900 mb-3">📊 Linked Records Summary</h3>
          <div className="grid grid-cols-3 gap-3">
            {Object.entries(account.linkedRecords).map(([key, count]) => (
              <div key={key} className="bg-gray-50 rounded-xl p-3 text-center">
                <p className="text-xl font-black text-gray-900">{count}</p>
                <p className="text-[11px] text-gray-400 capitalize mt-0.5">{key}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right column */}
      <div className="space-y-5">
        {/* Health Score */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 text-center">
          <h3 className="text-sm font-black text-gray-900 mb-3">Account Health</h3>
          <div className="relative w-20 h-20 mx-auto">
            <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="15" fill="none" stroke="#f0f0f0" strokeWidth="3" />
              <circle cx="18" cy="18" r="15" fill="none"
                stroke={account.healthScore >= 70 ? "#22C55E" : account.healthScore >= 40 ? "#F59E0B" : "#EF4444"}
                strokeWidth="3" strokeDasharray={`${account.healthScore * 0.942} 94.2`} strokeLinecap="round" />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-black text-gray-800">{account.healthScore}</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 mt-2">out of 100</p>
        </div>

        {/* Notes */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-black text-gray-900">Notes</h3>
            <button className="text-xs text-violet-600 font-bold hover:underline"><Pencil size={11} /></button>
          </div>
          <p className="text-xs text-gray-600 bg-yellow-50 border border-yellow-200 rounded-xl p-3">{account.notes || "No notes yet."}</p>
        </div>

        {/* AI Summary Placeholder */}
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Bot size={14} className="text-violet-600" />
            <span className="text-xs font-black text-violet-700">AI Account Summary</span>
            <span className="text-[9px] bg-violet-200 text-violet-600 font-bold px-1 rounded">PLACEHOLDER</span>
          </div>
          <p className="text-xs text-gray-600">{account.name} is a {account.type} account in {account.city} with {account.contacts.length} linked contacts. Health score: {account.healthScore}. Renewal approaching on {account.renewalDate}.</p>
        </div>
      </div>
    </div>
  );
}

function ContactsTab({ account }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900">Linked Contacts ({account.contacts.length})</h3>
        <button className="flex items-center gap-1.5 bg-violet-600 text-white font-bold px-3 py-2 rounded-lg text-xs hover:bg-violet-700">
          <Plus size={12} /> Add Contact
        </button>
      </div>
      {account.contacts.length === 0 && (
        <div className="text-center py-12 text-gray-400"><Users size={32} className="mx-auto mb-3 opacity-30" /><p>No contacts linked</p></div>
      )}
      {account.contacts.map(c => (
        <div key={c.id} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center gap-3 shadow-sm">
          <div className="w-9 h-9 rounded-full bg-violet-100 text-violet-700 text-sm font-black flex items-center justify-center flex-shrink-0">
            {c.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-gray-900">{c.name}</p>
            <p className="text-xs text-gray-500">{c.role} · {c.phone}</p>
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-green-50 rounded text-green-600"><Phone size={12} /></button>
            <button className="p-1.5 hover:bg-blue-50 rounded text-blue-500"><Mail size={12} /></button>
            <Link to={`/admin/crm/contacts/${c.id}`} className="p-1.5 hover:bg-violet-50 rounded text-violet-500 text-xs font-bold">View →</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function OpportunitiesTab({ account }) {
  const OPPS = [
    { id: "op1", title: "Agency Business Renewal", stage: "Proposal", value: "EGP 8,000", probability: 75, close: "Jun 1, 2026" },
    { id: "op2", title: "Featured Agency Upgrade", stage: "Contacted", value: "EGP 1,200", probability: 40, close: "Apr 15, 2026" },
  ];
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-black text-gray-900">Opportunities</h3>
        <button className="flex items-center gap-1.5 bg-violet-600 text-white font-bold px-3 py-2 rounded-lg text-xs hover:bg-violet-700">
          <Plus size={12} /> New Opp
        </button>
      </div>
      {OPPS.map(o => (
        <div key={o.id} className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-bold text-gray-900">{o.title}</p>
              <p className="text-xs text-gray-500 mt-0.5">{o.stage} · Close: {o.close}</p>
            </div>
            <p className="text-sm font-black text-violet-600">{o.value}</p>
          </div>
          <div className="mt-3 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-violet-500 rounded-full" style={{ width: `${o.probability}%` }} />
          </div>
          <p className="text-[11px] text-gray-400 mt-1">{o.probability}% probability</p>
        </div>
      ))}
    </div>
  );
}

function RecordsTab({ account }) {
  return (
    <div className="space-y-3">
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 text-xs text-blue-700">
        Read-only summary. Use "Open in module" to make changes in the source module.
      </div>
      {[
        { icon: "🏠", label: "Properties", count: account.linkedRecords.properties || 0 },
        { icon: "🏗", label: "Projects", count: account.linkedRecords.projects || 0 },
        { icon: "🛒", label: "Orders", count: account.linkedRecords.orders || 0 },
      ].map(s => (
        <div key={s.label} className="bg-white border border-gray-100 rounded-xl p-4 flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-xl">{s.icon}</span>
            <span className="text-sm font-bold text-gray-900">{s.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gray-100 text-gray-700 font-black text-xs px-2 py-1 rounded-full">{s.count}</span>
            <button className="text-xs text-violet-600 font-bold hover:underline">View All →</button>
          </div>
        </div>
      ))}
    </div>
  );
}

function NotesTimelineTab({ account }) {
  const EVENTS = [
    { icon: "📞", text: "Called Ahmed Hassan — discussed renewal", time: "2 days ago", actor: "You" },
    { icon: "📝", text: "Note added — key account flag", time: "1 week ago", actor: "You" },
    { icon: "🔄", text: "Stage changed: prospect → active", time: "2 months ago", actor: "System" },
    { icon: "📥", text: "Account linked from import — JOB-002", time: "3 months ago", actor: "System" },
  ];
  return (
    <div className="space-y-2">
      {EVENTS.map((e, i) => (
        <div key={i} className="bg-white border border-gray-100 rounded-xl p-4 flex items-start gap-3 shadow-sm">
          <span className="text-xl">{e.icon}</span>
          <div className="flex-1">
            <p className="text-xs font-semibold text-gray-800">{e.text}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{e.actor} · {e.time}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function AuditTab({ account }) {
  const ENTRIES = [
    { action: "field_update", detail: "healthScore: 65 → 78", actor: "System", time: "1 week ago" },
    { action: "owner_change", detail: "Adel M. → You", actor: "Sara K.", time: "2 weeks ago" },
    { action: "note_created", detail: "Key account note added", actor: "You", time: "1 week ago" },
    { action: "contact_linked", detail: "Karim Ali linked to account", actor: "You", time: "3 weeks ago" },
  ];
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
      <table className="w-full text-xs">
        <thead className="bg-gray-50 border-b">
          <tr>{["Action", "Detail", "Actor", "Time"].map(h => <th key={h} className="px-4 py-3 text-left font-bold text-gray-500">{h}</th>)}</tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {ENTRIES.map((e, i) => (
            <tr key={i} className="hover:bg-gray-50">
              <td className="px-4 py-3"><span className="bg-violet-100 text-violet-700 font-bold px-2 py-0.5 rounded-full text-[10px] capitalize">{e.action.replace(/_/g, " ")}</span></td>
              <td className="px-4 py-3 text-gray-600">{e.detail}</td>
              <td className="px-4 py-3 font-semibold text-gray-700">{e.actor}</td>
              <td className="px-4 py-3 text-gray-400">{e.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function CRMAccountDetail() {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("overview");
  const account = MOCK_ACCOUNTS[id] || { ...FALLBACK, id };

  return (
    <div className="space-y-0">
      <div className="mb-4">
        <Link to="/admin/crm/accounts" className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-violet-600 font-semibold">
          <ChevronLeft size={14} /> Back to Accounts
        </Link>
      </div>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-start gap-4 flex-wrap">
          <div className="w-14 h-14 rounded-2xl bg-violet-600 text-white text-xl font-black flex items-center justify-center flex-shrink-0">
            {account.name.slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black text-gray-900">{account.name}</h1>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full capitalize ${TYPE_COLORS[account.type] || "bg-gray-100 text-gray-600"}`}>{account.type.replace(/_/g, " ")}</span>
              {account.tags.map(t => <span key={t} className="text-[10px] bg-yellow-100 text-yellow-700 font-bold px-1.5 py-0.5 rounded-full">{t}</span>)}
            </div>
            <div className="flex items-center gap-4 mt-1 text-xs text-gray-500 flex-wrap">
              <span>📍 {account.city}</span>
              <span>👤 {account.owner}</span>
              <span>🕒 {account.lastActivity}</span>
              <span className={`font-semibold ${account.contractStatus === "active" ? "text-green-600" : "text-red-500"}`}>
                {account.contractStatus}
              </span>
            </div>
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <p className="text-2xl font-black text-violet-600">{account.healthScore}</p>
              <p className="text-[10px] text-gray-400">Health Score</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-100 flex-wrap">
          <button className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-bold px-3 py-2 rounded-lg text-xs"><Phone size={12} /> Call</button>
          <button className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-2 rounded-lg text-xs"><Mail size={12} /> Email</button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50"><Pencil size={12} /> Note</button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50"><CheckCircle size={12} /> Task</button>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-700 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50"><TrendingUp size={12} /> Opportunity</button>
          <button className="flex items-center gap-1.5 border border-dashed border-violet-300 text-violet-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-violet-50"><Bot size={12} /> Ask AI</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 bg-white mt-5 overflow-x-auto no-scrollbar">
        {TABS.map(tab => {
          const Icon = tab.icon;
          return (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-4 py-3 text-xs font-bold border-b-2 transition-colors whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id ? "text-violet-600 border-violet-600" : "text-gray-500 border-transparent hover:text-gray-700"
              }`}>
              <Icon size={12} /> {tab.label}
            </button>
          );
        })}
      </div>

      <div className="mt-5">
        {activeTab === "overview" && <OverviewTab account={account} />}
        {activeTab === "contacts" && <ContactsTab account={account} />}
        {activeTab === "opportunities" && <OpportunitiesTab account={account} />}
        {activeTab === "records" && <RecordsTab account={account} />}
        {activeTab === "notes" && <NotesTimelineTab account={account} />}
        {activeTab === "audit" && <AuditTab account={account} />}
      </div>
    </div>
  );
}