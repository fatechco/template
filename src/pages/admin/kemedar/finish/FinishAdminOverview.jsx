import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Link } from "react-router-dom";

const PHASE_COLORS = ["#f97316", "#3b82f6", "#22c55e", "#eab308", "#a855f7", "#ef4444"];
const STATUS_STYLES = {
  planning: "bg-gray-100 text-gray-600",
  in_progress: "bg-orange-100 text-orange-700",
  completed: "bg-green-100 text-green-700",
  snagging: "bg-yellow-100 text-yellow-700",
  on_hold: "bg-red-100 text-red-600",
};

function fmt(n) { return new Intl.NumberFormat("en-EG").format(Math.round(n || 0)); }

export default function FinishAdminOverview() {
  const [projects, setProjects] = useState([]);
  const [phases, setPhases] = useState([]);
  const [snags, setSnags] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.FinishProject.list("-created_date", 100),
      base44.entities.FinishPhase.list("-created_date", 500),
      base44.entities.FinishSnaggingItem.list("-created_date", 200),
    ]).then(([p, ph, s]) => {
      setProjects(p);
      setPhases(ph);
      setSnags(s);
      setLoading(false);
    });
  }, []);

  const active = projects.filter(p => p.status === "in_progress").length;
  const totalValue = projects.reduce((s, p) => s + (p.estimatedBudget || 0), 0);
  const openSnags = snags.filter(s => !["resolved", "accepted_as_is"].includes(s.status)).length;
  const avgCompletion = projects.length > 0 ? Math.round(projects.reduce((s, p) => s + (p.completionPercent || 0), 0) / projects.length) : 0;

  // Phase distribution
  const phaseDist = {};
  phases.forEach(ph => { phaseDist[ph.phaseName] = (phaseDist[ph.phaseName] || 0) + 1; });
  const phaseChartData = Object.entries(phaseDist).slice(0, 8).map(([name, count]) => ({ name: name.substring(0, 12), count }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2">🏗️ Kemedar Finish™ Admin</h1>
        <Link to="/kemedar/finish/new" className="bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-orange-600 transition-colors">
          + New Project
        </Link>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        {[
          { label: "Active Projects", val: loading ? "—" : active, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Total Projects", val: loading ? "—" : projects.length, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Value (EGP)", val: loading ? "—" : fmt(totalValue), color: "text-green-600", bg: "bg-green-50" },
          { label: "Avg Completion", val: loading ? "—" : `${avgCompletion}%`, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Open Snags", val: loading ? "—" : openSnags, color: "text-red-600", bg: "bg-red-50" },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-4 border border-white shadow-sm`}>
            <p className={`text-3xl font-black ${k.color}`}>{k.val}</p>
            <p className="text-xs text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Phase distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="font-black text-gray-800 mb-4">Active Phases Distribution</p>
          {phaseChartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={phaseChartData} layout="vertical">
                <XAxis type="number" tick={{ fontSize: 10 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={90} />
                <Tooltip />
                <Bar dataKey="count" radius={4}>
                  {phaseChartData.map((_, i) => <Cell key={i} fill={PHASE_COLORS[i % PHASE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : <p className="text-sm text-gray-400 text-center py-8">No phase data yet</p>}
        </div>

        {/* Status breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <p className="font-black text-gray-800 mb-4">Projects by Status</p>
          {["planning", "design_approved", "materials_ordered", "in_progress", "snagging", "completed"].map(status => {
            const count = projects.filter(p => p.status === status).length;
            const pct = projects.length ? (count / projects.length) * 100 : 0;
            return (
              <div key={status} className="flex items-center gap-3 mb-2">
                <span className="text-xs text-gray-500 w-32 truncate capitalize">{status.replace(/_/g, " ")}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full" style={{ width: `${pct}%` }} />
                </div>
                <span className="text-xs font-bold text-gray-600 w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Projects table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="font-black text-gray-900">All Projects</p>
          <span className="text-xs text-gray-400">{projects.length} total</span>
        </div>
        {projects.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-4xl mb-2">🏗️</p>
            <p className="font-bold text-gray-600">No projects yet</p>
            <p className="text-sm text-gray-400 mt-1">Projects created by users will appear here</p>
            <Link to="/kemedar/finish/new" className="inline-block mt-4 bg-orange-500 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-orange-600 transition-colors">
              Create Test Project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-bold text-gray-500">
                <tr>
                  <th className="text-left px-4 py-3">Project</th>
                  <th className="text-left px-4 py-3">Type</th>
                  <th className="text-left px-4 py-3">Phase</th>
                  <th className="text-left px-4 py-3">Progress</th>
                  <th className="text-left px-4 py-3">Budget</th>
                  <th className="text-left px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {projects.map(p => (
                  <tr key={p.id} className="border-t border-gray-50 hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <p className="font-bold text-gray-900">{p.projectName}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{p.projectNumber}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-xs capitalize">{p.projectType?.replace(/_/g, " ")}</td>
                    <td className="px-4 py-3 text-gray-600 text-xs">Phase {p.currentPhase || 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${p.completionPercent || 0}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{p.completionPercent || 0}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs font-bold text-gray-700">{fmt(p.estimatedBudget)} EGP</td>
                    <td className="px-4 py-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_STYLES[p.status] || "bg-gray-100 text-gray-600"}`}>
                        {p.status?.replace(/_/g, " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Link to={`/kemedar/finish/${p.id}`} className="text-xs text-orange-600 font-bold hover:underline">View →</Link>
                    </td>
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