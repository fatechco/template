import { useState, useEffect } from "react";
import { Sparkles, Camera, AlertTriangle, Layers } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const GRADE_COLORS = { excellent: "#16a34a", good: "#22c55e", fair: "#eab308", poor: "#f97316", reject: "#ef4444" };
const FINISHING_COLORS = ["#7c3aed", "#3b82f6", "#22c55e", "#eab308", "#f97316", "#ef4444"];

export default function VisionOverview() {
  const [reports, setReports] = useState([]);
  const [analyses, setAnalyses] = useState([]);
  const [stagingJobs, setStagingJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.PropertyVisionReport.list("-created_date", 500),
      base44.entities.PropertyPhotoAnalysis.list("-created_date", 500),
      base44.entities.VirtualStagingJob.list("-created_date", 200)
    ]).then(([r, a, s]) => { setReports(r); setAnalyses(a); setStagingJobs(s); setLoading(false); });
  }, []);

  const totalAnalyzed = analyses.filter(a => a.analysisStatus === 'completed').length;
  const propertiesCovered = new Set(reports.map(r => r.propertyId)).size;
  const criticalIssues = analyses.reduce((n, a) => n + (a.issues?.filter(i => i.severity === 'critical').length || 0), 0);
  const stagedDone = stagingJobs.filter(s => s.status === 'completed').length;

  // Grade distribution
  const gradeDist = { excellent: 0, good: 0, fair: 0, poor: 0, reject: 0 };
  analyses.forEach(a => { if (a.qualityGrade) gradeDist[a.qualityGrade] = (gradeDist[a.qualityGrade] || 0) + 1; });
  const gradeData = Object.entries(gradeDist).map(([name, value]) => ({ name, value }));

  // Finishing distribution
  const finishDist = {};
  analyses.forEach(a => { if (a.finishingGrade) finishDist[a.finishingGrade] = (finishDist[a.finishingGrade] || 0) + 1; });
  const finishData = Object.entries(finishDist).map(([name, value]) => ({ name: name.replace('_', ' '), value }));

  // Top issues
  const issueCounts = {};
  analyses.forEach(a => (a.issues || []).forEach(i => { issueCounts[i.issueType] = (issueCounts[i.issueType] || 0) + 1; }));
  const topIssues = Object.entries(issueCounts).sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([name, count]) => ({ name: name.replace(/_/g, ' '), count }));

  const avgScore = analyses.length > 0
    ? Math.round(analyses.filter(a => a.qualityScore).reduce((s, a) => s + a.qualityScore, 0) / analyses.filter(a => a.qualityScore).length)
    : 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Sparkles size={22} className="text-purple-500" /> Vision™ Overview</h1>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Photos Analyzed", val: totalAnalyzed.toLocaleString(), icon: Camera, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Properties Covered", val: propertiesCovered, icon: Layers, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Critical Issues Found", val: criticalIssues, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Staged Photos", val: stagedDone, icon: Sparkles, color: "text-green-600", bg: "bg-green-50" },
        ].map(k => (
          <div key={k.label} className={`${k.bg} rounded-2xl p-4 border border-white shadow-sm`}>
            <k.icon size={18} className={k.color} />
            <p className={`text-3xl font-black mt-2 ${k.color}`}>{loading ? "—" : k.val}</p>
            <p className="text-xs text-gray-500 font-semibold mt-0.5">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Quality distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-800 mb-1">Quality Distribution</p>
          <p className="text-xs text-gray-400 mb-4">Platform avg: <strong>{avgScore}/100</strong></p>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={gradeData} cx="50%" cy="50%" innerRadius={40} outerRadius={70} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`} labelLine={false} fontSize={10}>
                {gradeData.map((entry, i) => <Cell key={i} fill={GRADE_COLORS[entry.name] || '#ccc'} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Finishing distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-800 mb-4">Finishing Grade Distribution</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={finishData} layout="vertical">
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={80} />
              <Tooltip />
              <Bar dataKey="value" radius={4}>
                {finishData.map((_, i) => <Cell key={i} fill={FINISHING_COLORS[i % FINISHING_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top issues */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <p className="font-black text-gray-800 mb-4">Most Common Issues</p>
          <div className="space-y-2">
            {topIssues.length > 0 ? topIssues.map((issue, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-28 truncate capitalize">{issue.name}</span>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-orange-400 rounded-full" style={{ width: `${Math.min((issue.count / (topIssues[0]?.count || 1)) * 100, 100)}%` }} />
                </div>
                <span className="text-xs font-bold text-gray-600 w-6 text-right">{issue.count}</span>
              </div>
            )) : <p className="text-xs text-gray-400">No issues detected yet</p>}
          </div>
        </div>
      </div>
    </div>
  );
}