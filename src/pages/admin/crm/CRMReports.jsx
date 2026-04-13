import { useState } from "react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from "recharts";
import { Download, Filter, RefreshCw } from "lucide-react";

// ─── Mock data per report family ──────────────────────────────────────────────
const DAILY_ACTIVITY = Array.from({ length: 14 }, (_, i) => ({
  date: `Apr ${i + 1}`,
  calls: 8 + Math.floor(Math.random() * 12),
  messages: 20 + Math.floor(Math.random() * 25),
  tasks: 6 + Math.floor(Math.random() * 10),
  opps: 1 + Math.floor(Math.random() * 4),
}));

const PIPELINE_FUNNEL = [
  { stage: "New Lead", value: 84 }, { stage: "Contacted", value: 61 },
  { stage: "Qualified", value: 38 }, { stage: "Proposal", value: 22 },
  { stage: "Won", value: 14 }, { stage: "Lost", value: 8 },
];

const CALL_OUTCOMES = [
  { name: "Connected", value: 38, fill: "#22C55E" }, { name: "No Answer", value: 28, fill: "#EF4444" },
  { name: "Voicemail", value: 15, fill: "#3B82F6" }, { name: "Callback Req.", value: 12, fill: "#F59E0B" },
  { name: "Wrong Number", value: 7, fill: "#9CA3AF" },
];

const CHANNEL_PERFORMANCE = [
  { channel: "WhatsApp", sent: 248, replied: 178, rate: 72 },
  { channel: "Email", sent: 186, replied: 67, rate: 36 },
  { channel: "SMS", sent: 124, replied: 52, rate: 42 },
  { channel: "Phone", sent: 98, replied: 62, rate: 63 },
];

const TEMPLATE_PERF = [
  { name: "Agent Welcome AR", channel: "WA", used: 142, replied: 98, rate: 69 },
  { name: "Renewal Reminder EN", channel: "WA", used: 89, replied: 71, rate: 80 },
  { name: "Profile Completion AR", channel: "SMS", used: 214, replied: 72, rate: 34 },
  { name: "Listing Activation AR", channel: "SMS", used: 178, replied: 64, rate: 36 },
  { name: "Reactivation — Churned", channel: "WA", used: 52, replied: 31, rate: 60 },
];

const RENEWAL_DATA = [
  { month: "Jan", won: 14, lost: 4 }, { month: "Feb", won: 18, lost: 6 },
  { month: "Mar", won: 22, lost: 3 }, { month: "Apr", won: 11, lost: 5 },
];

const REP_PRODUCTIVITY = [
  { name: "You", calls: 42, tasks: 38, messages: 87, opps_moved: 8, conv_rate: "28%" },
  { name: "Adel M.", calls: 31, tasks: 29, messages: 64, opps_moved: 5, conv_rate: "22%" },
  { name: "Sara K.", calls: 28, tasks: 35, messages: 72, opps_moved: 6, conv_rate: "25%" },
  { name: "Mona A.", calls: 19, tasks: 22, messages: 41, opps_moved: 3, conv_rate: "18%" },
];

const SLA_DATA = [
  { label: "Avg First Response", value: "1h 42min", benchmark: "< 2h", ok: true },
  { label: "Avg Follow-up Time", value: "18.4h", benchmark: "< 24h", ok: true },
  { label: "Overdue Tasks %", value: "14%", benchmark: "< 10%", ok: false },
  { label: "Call Connect Rate", value: "62%", benchmark: "> 60%", ok: true },
  { label: "WhatsApp Reply Rate", value: "72%", benchmark: "> 65%", ok: true },
  { label: "Renewals Win Rate", value: "71%", benchmark: "> 70%", ok: true },
];

const REPORT_FAMILIES = [
  { id: "rep_productivity", label: "Rep Productivity" },
  { id: "sla", label: "SLA & Response Time" },
  { id: "pipeline", label: "Pipeline Conversion" },
  { id: "channel", label: "Channel Performance" },
  { id: "templates", label: "Template Performance" },
  { id: "renewal", label: "Renewal Outcomes" },
  { id: "call_outcomes", label: "Call Outcomes" },
  { id: "activation", label: "Activation Performance" },
  { id: "ai", label: "AI Effectiveness" },
];

const DATE_RANGES = ["Last 7 Days", "Last 30 Days", "Last 3 Months", "This Year"];

// ─── Chart section wrapper ────────────────────────────────────────────────────
function ReportSection({ title, children }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
      <h3 className="text-sm font-black text-gray-900 mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function CRMReports() {
  const [activeFamily, setActiveFamily] = useState("rep_productivity");
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [ownerFilter, setOwnerFilter] = useState("");

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div><h1 className="text-2xl font-black text-gray-900">CRM Reports</h1><p className="text-gray-500 text-sm">Operational analytics and performance insights</p></div>
        <div className="flex gap-2">
          <select value={dateRange} onChange={e => setDateRange(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
            {DATE_RANGES.map(r => <option key={r}>{r}</option>)}
          </select>
          <select value={ownerFilter} onChange={e => setOwnerFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none">
            <option value="">All Reps</option>
            {["You", "Adel M.", "Sara K.", "Mona A."].map(r => <option key={r}>{r}</option>)}
          </select>
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50"><Download size={12} /> Export</button>
        </div>
      </div>

      {/* Report family nav */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
        {REPORT_FAMILIES.map(f => (
          <button key={f.id} onClick={() => setActiveFamily(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border whitespace-nowrap flex-shrink-0 transition-all ${activeFamily === f.id ? "bg-violet-600 text-white border-violet-600" : "bg-white text-gray-600 border-gray-200 hover:border-violet-300"}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* ── Rep Productivity ── */}
      {activeFamily === "rep_productivity" && (
        <div className="space-y-5">
          <ReportSection title="Daily Activity — All Reps">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={DAILY_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={1} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="calls" fill="#22C55E" name="Calls" radius={[2, 2, 0, 0]} />
                <Bar dataKey="messages" fill="#3B82F6" name="Messages" radius={[2, 2, 0, 0]} />
                <Bar dataKey="tasks" fill="#F59E0B" name="Tasks" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ReportSection>
          <ReportSection title="Rep Leaderboard">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-gray-50 border-b"><tr>{["Rep", "Calls", "Tasks Done", "Messages", "Opps Moved", "Conv Rate"].map(h => <th key={h} className="px-3 py-2 text-left font-bold text-gray-500">{h}</th>)}</tr></thead>
                <tbody className="divide-y divide-gray-50">
                  {REP_PRODUCTIVITY.map(r => (
                    <tr key={r.name} className="hover:bg-gray-50">
                      <td className="px-3 py-2.5 font-bold text-gray-900">{r.name}</td>
                      <td className="px-3 py-2.5 text-gray-600">{r.calls}</td>
                      <td className="px-3 py-2.5 text-gray-600">{r.tasks}</td>
                      <td className="px-3 py-2.5 text-gray-600">{r.messages}</td>
                      <td className="px-3 py-2.5 text-gray-600">{r.opps_moved}</td>
                      <td className="px-3 py-2.5 font-black text-violet-600">{r.conv_rate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ReportSection>
        </div>
      )}

      {/* ── SLA ── */}
      {activeFamily === "sla" && (
        <div className="space-y-5">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {SLA_DATA.map(s => (
              <div key={s.label} className={`bg-white rounded-xl border shadow-sm p-4 ${s.ok ? "border-green-200" : "border-red-200"}`}>
                <p className={`text-2xl font-black ${s.ok ? "text-green-600" : "text-red-500"}`}>{s.value}</p>
                <p className="text-xs font-bold text-gray-700 mt-0.5">{s.label}</p>
                <p className={`text-[10px] mt-1 ${s.ok ? "text-green-500" : "text-red-400"}`}>{s.ok ? "✅" : "⚠️"} Benchmark: {s.benchmark}</p>
              </div>
            ))}
          </div>
          <ReportSection title="Response Time Trend">
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={DAILY_ACTIVITY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="date" tick={{ fontSize: 10 }} interval={1} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Line type="monotone" dataKey="tasks" stroke="#7C3AED" dot={false} strokeWidth={2} name="Tasks Completed" />
                <Line type="monotone" dataKey="calls" stroke="#F59E0B" dot={false} strokeWidth={2} name="Calls Made" />
              </LineChart>
            </ResponsiveContainer>
          </ReportSection>
        </div>
      )}

      {/* ── Pipeline ── */}
      {activeFamily === "pipeline" && (
        <div className="space-y-5">
          <ReportSection title="Pipeline Conversion Funnel">
            <div className="space-y-2">
              {PIPELINE_FUNNEL.map((s, i) => (
                <div key={s.stage} className="flex items-center gap-3">
                  <div className="w-28 text-xs font-semibold text-gray-700 flex-shrink-0">{s.stage}</div>
                  <div className="w-10 text-xs font-bold text-right flex-shrink-0 text-gray-800">{s.value}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <div className="h-full bg-violet-500 rounded-lg" style={{ width: `${(s.value / PIPELINE_FUNNEL[0].value) * 100}%` }} />
                  </div>
                  <div className="w-10 text-xs text-gray-400 flex-shrink-0">{Math.round((s.value / PIPELINE_FUNNEL[0].value) * 100)}%</div>
                  {i > 0 && <div className="w-16 text-[10px] text-red-500 font-bold">-{PIPELINE_FUNNEL[i - 1].value - s.value}</div>}
                </div>
              ))}
            </div>
          </ReportSection>
          <ReportSection title="Renewal Win/Loss Trend">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={RENEWAL_DATA}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="month" tick={{ fontSize: 10 }} />
                <YAxis tick={{ fontSize: 10 }} />
                <Tooltip />
                <Bar dataKey="won" fill="#22C55E" name="Won" radius={[2, 2, 0, 0]} />
                <Bar dataKey="lost" fill="#EF4444" name="Lost" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ReportSection>
        </div>
      )}

      {/* ── Channel ── */}
      {activeFamily === "channel" && (
        <div className="space-y-5">
          <ReportSection title="Channel Reply Rates">
            <div className="space-y-3">
              {CHANNEL_PERFORMANCE.map(c => (
                <div key={c.channel} className="flex items-center gap-3">
                  <div className="w-20 text-xs font-bold text-gray-700 flex-shrink-0">{c.channel}</div>
                  <div className="flex-1 h-6 bg-gray-100 rounded-lg overflow-hidden">
                    <div className={`h-full rounded-lg ${c.rate >= 60 ? "bg-green-500" : c.rate >= 40 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${c.rate}%` }} />
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="font-black text-gray-800 text-xs">{c.rate}%</span>
                    <span className="text-[10px] text-gray-400">{c.replied}/{c.sent}</span>
                  </div>
                </div>
              ))}
            </div>
          </ReportSection>
        </div>
      )}

      {/* ── Templates ── */}
      {activeFamily === "templates" && (
        <ReportSection title="Template Performance">
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 border-b"><tr>{["Template", "Channel", "Used", "Replied", "Reply Rate"].map(h => <th key={h} className="px-3 py-2 text-left font-bold text-gray-500">{h}</th>)}</tr></thead>
              <tbody className="divide-y divide-gray-50">
                {TEMPLATE_PERF.map(t => (
                  <tr key={t.name} className="hover:bg-gray-50">
                    <td className="px-3 py-2.5 font-semibold text-gray-800 max-w-[180px] truncate">{t.name}</td>
                    <td className="px-3 py-2.5 text-gray-500">{t.channel}</td>
                    <td className="px-3 py-2.5">{t.used}</td>
                    <td className="px-3 py-2.5">{t.replied}</td>
                    <td className="px-3 py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-12 h-1.5 bg-gray-100 rounded-full overflow-hidden"><div className={`h-full rounded-full ${t.rate >= 60 ? "bg-green-500" : t.rate >= 40 ? "bg-yellow-400" : "bg-red-400"}`} style={{ width: `${t.rate}%` }} /></div>
                        <span className="font-black text-gray-800">{t.rate}%</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ReportSection>
      )}

      {/* ── Call Outcomes ── */}
      {activeFamily === "call_outcomes" && (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
          <ReportSection title="Call Outcome Distribution">
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={CALL_OUTCOMES} cx="50%" cy="50%" outerRadius={80} dataKey="value" label={({ name, value }) => `${name}: ${value}`} labelLine={false}>
                  {CALL_OUTCOMES.map((e, i) => <Cell key={i} fill={e.fill} />)}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </ReportSection>
          <ReportSection title="Outcome Breakdown">
            <div className="space-y-3">
              {CALL_OUTCOMES.map(o => (
                <div key={o.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: o.fill }} />
                  <div className="flex-1 text-xs font-semibold text-gray-700">{o.name}</div>
                  <div className="flex-1 h-4 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${(o.value / 100) * 100}%`, backgroundColor: o.fill }} />
                  </div>
                  <span className="text-xs font-black text-gray-800 w-8 text-right">{o.value}</span>
                </div>
              ))}
            </div>
          </ReportSection>
        </div>
      )}

      {/* ── AI placeholder ── */}
      {activeFamily === "ai" && (
        <div className="bg-gradient-to-br from-violet-50 to-purple-50 border border-violet-200 rounded-xl p-8 text-center">
          <p className="text-4xl mb-3">🤖</p>
          <h3 className="text-lg font-black text-violet-700">AI Effectiveness Report</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">AI calls, message drafts, and automation performance metrics will appear here once the AI engine is configured.</p>
          <p className="text-[11px] text-violet-400 mt-3 font-bold">PLACEHOLDER — Phase 6</p>
        </div>
      )}

      {/* Other placeholder families */}
      {["renewal", "activation"].includes(activeFamily) && (
        <ReportSection title={REPORT_FAMILIES.find(f => f.id === activeFamily)?.label + " Report"}>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={RENEWAL_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} />
              <YAxis tick={{ fontSize: 10 }} />
              <Tooltip />
              <Bar dataKey="won" fill="#22C55E" name="Won" radius={[2, 2, 0, 0]} />
              <Bar dataKey="lost" fill="#EF4444" name="Lost" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ReportSection>
      )}
    </div>
  );
}