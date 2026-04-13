import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Users, Clock, AlertCircle, MessageCircle, TrendingUp, RefreshCw,
  Bot, UserPlus, Phone, CheckCircle, XCircle, Calendar, Filter,
  ChevronRight, Flame, ArrowUp, ArrowDown, MoreHorizontal
} from "lucide-react";

// ─── Mock data ────────────────────────────────────────────────────────────────
const KPI_DATA = [
  { label: "Assigned to Me", value: 142, icon: Users, color: "text-blue-600 bg-blue-50", link: "/admin/crm/contacts" },
  { label: "New Today", value: 24, icon: UserPlus, color: "text-green-600 bg-green-50", link: "/admin/crm/contacts" },
  { label: "Overdue Tasks", value: 18, icon: AlertCircle, color: "text-red-600 bg-red-50", link: "/admin/crm/tasks", urgent: true },
  { label: "Due Today", value: 31, icon: Clock, color: "text-orange-600 bg-orange-50", link: "/admin/crm/tasks" },
  { label: "Unread Convos", value: 7, icon: MessageCircle, color: "text-purple-600 bg-purple-50", link: "/admin/crm/inbox" },
  { label: "Open Opportunities", value: 54, icon: TrendingUp, color: "text-teal-600 bg-teal-50", link: "/admin/crm/pipelines" },
  { label: "Renewals in 7d", value: 9, icon: Calendar, color: "text-yellow-600 bg-yellow-50", link: "/admin/crm/contacts" },
  { label: "Activation Queue", value: 47, icon: RefreshCw, color: "text-indigo-600 bg-indigo-50", link: "/admin/crm/queues/activation" },
  { label: "Awaiting Contact", value: 83, icon: Phone, color: "text-cyan-600 bg-cyan-50", link: "/admin/crm/queues/activation" },
  { label: "AI Approvals", value: 12, icon: Bot, color: "text-fuchsia-600 bg-fuchsia-50", link: "/admin/crm/approvals" },
];

const TODAY_QUEUE = [
  { name: "Ahmed Hassan", role: "Agent", task: "Follow-up call", due: "09:30", priority: "high", id: "c1" },
  { name: "Sara Mohamed", role: "Developer", task: "Contract renewal", due: "11:00", priority: "high", id: "c2" },
  { name: "Karim Ali", role: "Imported Owner", task: "First contact", due: "12:00", priority: "medium", id: "c3" },
  { name: "Nour Adel", role: "Buyer", task: "Send listing options", due: "14:00", priority: "medium", id: "c4" },
  { name: "Omar Rashid", role: "Agency", task: "Renewal discussion", due: "15:30", priority: "low", id: "c5" },
];

const OVERDUE = [
  { name: "Elite Realty", type: "Agency", overdueDays: 5, lastContact: "Mar 28", rep: "You" },
  { name: "Palm Hills Dev", type: "Developer", overdueDays: 3, lastContact: "Mar 30", rep: "You" },
  { name: "Walid Mansour", type: "Agent", overdueDays: 8, lastContact: "Mar 25", rep: "Adel M." },
  { name: "City Homes", type: "Agency", overdueDays: 12, lastContact: "Mar 21", rep: "Sara K." },
];

const ACTIVATION_QUEUE = [
  { name: "Mohamed Nasser", phone: "+20 100 123 4567", source: "Aqarmap", records: 5, status: "pending", id: "a1" },
  { name: "Fatima Hassan", phone: "+20 110 987 6543", source: "OLX", records: 2, status: "pending", id: "a2" },
  { name: "Ahmed Kamel", phone: "+20 120 456 7890", source: "Property Finder", records: 8, status: "interested", id: "a3" },
  { name: "Rania Samir", phone: "+20 100 321 0987", source: "Manual", records: 1, status: "callback", id: "a4" },
];

const NEW_SIGNUPS = [
  { role: "Agent", count: 8, trend: "up" },
  { role: "Common User", count: 14, trend: "up" },
  { role: "Developer", count: 1, trend: "neutral" },
  { role: "Professional", count: 5, trend: "up" },
  { role: "Seller", count: 3, trend: "down" },
];

const RENEWAL_RISK = [
  { name: "Star Realty", type: "Agency", expiresIn: 3, plan: "Pro", value: "EGP 2,400", risk: "high" },
  { name: "Hassan Group", type: "Developer", expiresIn: 5, plan: "Business", value: "EGP 8,000", risk: "high" },
  { name: "City Sellers", type: "Agency", expiresIn: 7, plan: "Basic", value: "EGP 600", risk: "medium" },
  { name: "Ahmed Pro", type: "Agent", expiresIn: 7, plan: "Pro", value: "EGP 1,200", risk: "medium" },
];

const PIPELINE_STAGES = [
  { stage: "New Lead", count: 84, value: "—" },
  { stage: "Contacted", count: 47, value: "—" },
  { stage: "Qualified", count: 28, value: "EGP 2.1M" },
  { stage: "Proposal", count: 14, value: "EGP 1.4M" },
  { stage: "Negotiation", count: 8, value: "EGP 980K" },
  { stage: "Won", count: 12, value: "EGP 1.8M" },
];

const NO_NEXT_ACTION = [
  { name: "Kemal Yilmaz", role: "Agent", lastActivity: "6 days ago", assigned: "You" },
  { name: "Dina Fahmy", role: "Buyer", lastActivity: "4 days ago", assigned: "You" },
  { name: "Gulf Properties", role: "Agency", lastActivity: "9 days ago", assigned: "Mona A." },
  { name: "Nile Designs", role: "Professional", lastActivity: "11 days ago", assigned: "Adel M." },
];

const PRIORITY_DOT = { high: "bg-red-500", medium: "bg-orange-400", low: "bg-gray-300" };
const OUTCOME_STYLE = {
  pending: "bg-gray-100 text-gray-600",
  interested: "bg-green-100 text-green-700",
  callback: "bg-orange-100 text-orange-700",
  "no-answer": "bg-red-100 text-red-600",
};

function KpiCard({ kpi }) {
  const Icon = kpi.icon;
  return (
    <Link to={kpi.link} className={`bg-white rounded-xl border shadow-sm p-4 hover:shadow-md transition-shadow ${kpi.urgent ? "border-red-200" : "border-gray-100"}`}>
      <div className="flex items-center justify-between mb-2">
        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${kpi.color}`}>
          <Icon size={16} />
        </div>
        {kpi.urgent && <span className="text-[9px] bg-red-500 text-white font-black px-1.5 py-0.5 rounded-full">URGENT</span>}
      </div>
      <p className="text-2xl font-black text-gray-900">{kpi.value}</p>
      <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
    </Link>
  );
}

function SectionHeader({ title, link, linkLabel = "View All" }) {
  return (
    <div className="flex items-center justify-between mb-3">
      <h2 className="text-sm font-black text-gray-900">{title}</h2>
      {link && <Link to={link} className="text-xs text-violet-600 font-bold hover:underline flex items-center gap-1">{linkLabel} <ChevronRight size={12} /></Link>}
    </div>
  );
}

export default function CRMDashboard() {
  const [ownerFilter, setOwnerFilter] = useState("me");

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">CRM Dashboard</h1>
          <p className="text-gray-500 text-sm">Operations overview — {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        <div className="flex items-center gap-2">
          <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs font-bold focus:outline-none focus:border-violet-400">
            <option value="me">Assigned to Me</option>
            <option value="team">My Team</option>
            <option value="all">All Reps</option>
          </select>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
            <Filter size={12} /> Filters
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {KPI_DATA.map((k, i) => <KpiCard key={i} kpi={k} />)}
      </div>

      {/* Row 1: Today Queue + Overdue */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {/* Today Queue */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <SectionHeader title="🗓 My Today Queue" link="/admin/crm/tasks" />
          <div className="space-y-2">
            {TODAY_QUEUE.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${PRIORITY_DOT[item.priority]}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-400">{item.task}</p>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full flex-shrink-0">{item.role}</span>
                <span className="text-xs font-black text-orange-600 flex-shrink-0">{item.due}</span>
                <Link to={`/admin/crm/contacts/${item.id}`} className="text-violet-500 hover:text-violet-700">
                  <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </div>
          {TODAY_QUEUE.length === 0 && <p className="text-center text-gray-400 text-sm py-6">🎉 All clear for today!</p>}
        </div>

        {/* Overdue Follow-ups */}
        <div className="bg-white rounded-xl border border-red-100 shadow-sm p-5">
          <SectionHeader title="⚠️ Overdue Follow-ups" link="/admin/crm/tasks" />
          <div className="space-y-2">
            {OVERDUE.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="w-8 h-8 rounded-full bg-red-100 text-red-600 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                  {item.overdueDays}d
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-400">Last contact: {item.lastContact} · {item.rep}</p>
                </div>
                <span className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-0.5 rounded-full">{item.type}</span>
                <button className="text-[10px] bg-red-500 text-white font-bold px-2 py-1 rounded-lg hover:bg-red-600">Contact</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Activation Queue + New Signups */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Activation Queue Preview */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <SectionHeader title="🔄 Activation Queue" link="/admin/crm/queues/activation" />
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Contact", "Phone", "Source", "Records", "Status", ""].map(h => (
                    <th key={h} className="text-left py-2 pr-3 font-bold text-gray-500">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ACTIVATION_QUEUE.map((item, i) => (
                  <tr key={i} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-2.5 pr-3 font-semibold text-gray-800">{item.name}</td>
                    <td className="py-2.5 pr-3 font-mono text-gray-600">{item.phone}</td>
                    <td className="py-2.5 pr-3 text-gray-500">{item.source}</td>
                    <td className="py-2.5 pr-3">
                      <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">{item.records}</span>
                    </td>
                    <td className="py-2.5 pr-3">
                      <span className={`font-bold px-2 py-0.5 rounded-full capitalize ${OUTCOME_STYLE[item.status]}`}>{item.status}</span>
                    </td>
                    <td className="py-2.5">
                      <div className="flex gap-1">
                        <button className="text-green-600 hover:bg-green-50 p-1 rounded"><Phone size={12} /></button>
                        <Link to={`/admin/crm/contacts/${item.id}`} className="text-violet-500 hover:bg-violet-50 p-1 rounded"><ChevronRight size={12} /></Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* New Signups */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <SectionHeader title="👥 New Signups Today" />
          <div className="space-y-3">
            {NEW_SIGNUPS.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="flex-1 text-xs font-semibold text-gray-700">{item.role}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-full" style={{ width: `${(item.count / 20) * 100}%` }} />
                </div>
                <span className="text-xs font-black text-gray-900 w-6 text-right">{item.count}</span>
                {item.trend === "up" && <ArrowUp size={11} className="text-green-500" />}
                {item.trend === "down" && <ArrowDown size={11} className="text-red-500" />}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Renewal Risk + Pipeline + No Next Action */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Renewal Risk */}
        <div className="bg-white rounded-xl border border-yellow-100 shadow-sm p-5">
          <SectionHeader title="🔔 Renewal Risk (7d)" link="/admin/crm/contacts" />
          <div className="space-y-2">
            {RENEWAL_RISK.map((item, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black flex-shrink-0 ${item.risk === "high" ? "bg-red-100 text-red-600" : "bg-yellow-100 text-yellow-700"}`}>
                  {item.expiresIn}d
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-400">{item.plan} · {item.value}</p>
                </div>
                <button className="text-[10px] bg-violet-100 text-violet-700 font-bold px-2 py-1 rounded-lg hover:bg-violet-200">Contact</button>
              </div>
            ))}
          </div>
        </div>

        {/* Pipeline Summary */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <SectionHeader title="📊 Pipeline Summary" link="/admin/crm/pipelines" />
          <div className="space-y-2">
            {PIPELINE_STAGES.map((s, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs text-gray-600 w-24 flex-shrink-0 truncate">{s.stage}</span>
                <div className="flex-1 h-5 bg-gray-100 rounded-lg overflow-hidden">
                  <div className="h-full bg-violet-500 rounded-lg flex items-center px-2"
                    style={{ width: `${Math.max(10, (s.count / 84) * 100)}%` }}>
                    <span className="text-[10px] text-white font-black">{s.count}</span>
                  </div>
                </div>
                <span className="text-[10px] text-gray-400 w-16 text-right flex-shrink-0">{s.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* No Next Action */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <SectionHeader title="❌ No Next Action" link="/admin/crm/contacts" />
          <div className="space-y-2">
            {NO_NEXT_ACTION.map((item, i) => (
              <div key={i} className="flex items-center gap-3 py-2 border-b border-gray-50 last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-gray-900 truncate">{item.name}</p>
                  <p className="text-[11px] text-gray-400">{item.role} · {item.lastActivity}</p>
                </div>
                <span className="text-[10px] text-gray-500">{item.assigned}</span>
                <button className="text-[10px] bg-gray-100 text-gray-600 font-bold px-2 py-1 rounded-lg hover:bg-gray-200">+ Task</button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 4: Team Workload + Channel Performance placeholders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <SectionHeader title="👥 Team Workload" />
          <div className="space-y-3">
            {[
              { rep: "Adel Mohamed", open: 28, overdue: 4, calls: 6 },
              { rep: "Sara Khaled", open: 19, overdue: 1, calls: 3 },
              { rep: "Mona Ahmed", open: 34, overdue: 7, calls: 9 },
              { rep: "You", open: 22, overdue: 2, calls: 5 },
            ].map((r, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-violet-100 text-violet-700 text-[10px] font-black flex items-center justify-center flex-shrink-0">
                  {r.rep.slice(0, 2).toUpperCase()}
                </div>
                <span className="flex-1 text-xs font-semibold text-gray-700">{r.rep}</span>
                <span className="text-[10px] bg-blue-100 text-blue-700 font-bold px-2 py-0.5 rounded-full">{r.open} open</span>
                {r.overdue > 0 && <span className="text-[10px] bg-red-100 text-red-600 font-bold px-2 py-0.5 rounded-full">{r.overdue} overdue</span>}
                <span className="text-[10px] text-gray-400">{r.calls} calls</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
          <SectionHeader title="📡 Channel Performance" />
          <div className="grid grid-cols-2 gap-3">
            {[
              { ch: "📞 Phone", sent: 48, answered: 31, rate: "65%" },
              { ch: "💬 WhatsApp", sent: 124, answered: 89, rate: "72%" },
              { ch: "📧 Email", sent: 67, answered: 24, rate: "36%" },
              { ch: "📱 SMS", sent: 43, answered: 18, rate: "42%" },
            ].map((c, i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-bold text-gray-700 mb-2">{c.ch}</p>
                <p className="text-lg font-black text-gray-900">{c.rate}</p>
                <p className="text-[11px] text-gray-400">Response rate</p>
                <p className="text-[10px] text-gray-400 mt-1">{c.answered}/{c.sent} responded</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}