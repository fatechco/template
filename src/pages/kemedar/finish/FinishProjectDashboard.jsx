import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import FinishTabTimeline from "@/components/finish/dashboard/FinishTabTimeline";
import FinishTabMaterials from "@/components/finish/dashboard/FinishTabMaterials";
import FinishTabProfessionals from "@/components/finish/dashboard/FinishTabProfessionals";
import FinishTabProgress from "@/components/finish/dashboard/FinishTabProgress";
import FinishTabSnagging from "@/components/finish/dashboard/FinishTabSnagging";
import FinishTabPayments from "@/components/finish/dashboard/FinishTabPayments";
import FinishTabValuation from "@/components/finish/dashboard/FinishTabValuation";
import KemedarPostRenovationNudge from "@/components/surplus/KemedarPostRenovationNudge";

const TABS = [
  { id: "timeline", label: "📅 Timeline" },
  { id: "materials", label: "🛒 Materials" },
  { id: "professionals", label: "👷 Pros" },
  { id: "progress", label: "📸 Progress" },
  { id: "snagging", label: "📋 Snag" },
  { id: "payments", label: "💰 Payments" },
  { id: "valuation", label: "📈 Valuation" },
];

const STATUS_COLORS = {
  planning: "bg-gray-100 text-gray-600",
  design_approved: "bg-blue-100 text-blue-600",
  materials_ordered: "bg-cyan-100 text-cyan-700",
  in_progress: "bg-orange-100 text-orange-700",
  snagging: "bg-yellow-100 text-yellow-700",
  completed: "bg-green-100 text-green-700",
  on_hold: "bg-red-100 text-red-600",
};

function fmt(n) { return new Intl.NumberFormat("en-EG").format(Math.round(n || 0)); }

export default function FinishProjectDashboard() {
  const { projectId } = useParams();
  const [project, setProject] = useState(null);
  const [phases, setPhases] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [snags, setSnags] = useState([]);
  const [tab, setTab] = useState("timeline");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      base44.entities.FinishProject.filter({ id: projectId }),
      base44.entities.FinishPhase.filter({ projectId }),
      base44.entities.FinishProgressUpdate.filter({ projectId }),
      base44.entities.FinishSnaggingItem.filter({ projectId }),
    ]).then(([ps, ph, up, sn]) => {
      setProject(ps[0]);
      setPhases(ph.sort((a, b) => a.phaseNumber - b.phaseNumber));
      setUpdates(up);
      setSnags(sn);
      setLoading(false);
    });
  }, [projectId]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-500 border-t-transparent rounded-full animate-spin" /></div>;
  if (!project) return <div className="p-8 text-center text-gray-500">Project not found</div>;

  const completion = project.completionPercent || 0;
  const totalWeeks = project.estimatedDurationWeeks || 10;
  const activePhase = phases.find(p => p.status === "in_progress") || phases[0];
  const openSnags = snags.filter(s => s.status !== "resolved" && s.status !== "accepted_as_is");

  // Circumference for ring
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (completion / 100) * circumference;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white" style={{ minHeight: 200 }}>
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-start gap-3 mb-1">
            <p className="text-orange-400 text-xs font-bold">🏗️ Kemedar Finish™</p>
            <p className="text-gray-500 text-xs font-mono ml-auto">{project.projectNumber}</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h1 className="text-2xl font-black mb-1">{project.projectName}</h1>
              <p className="text-gray-400 text-sm mb-2">{project.propertyAddress}</p>
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${STATUS_COLORS[project.status] || "bg-gray-100 text-gray-600"}`}>
                {project.status?.replace(/_/g, " ").toUpperCase()}
              </span>
            </div>
            {/* Progress ring */}
            <div className="w-20 h-20 flex-shrink-0 relative">
              <svg width="80" height="80" className="-rotate-90">
                <circle cx="40" cy="40" r={radius} fill="none" stroke="#ffffff20" strokeWidth="6" />
                <circle cx="40" cy="40" r={radius} fill="none" stroke="#f97316" strokeWidth="6"
                  strokeDasharray={circumference} strokeDashoffset={dashOffset}
                  strokeLinecap="round" style={{ transition: "stroke-dashoffset 1s ease" }} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-black text-white">{completion}%</span>
                <span className="text-[9px] text-gray-400">Complete</span>
              </div>
            </div>
          </div>

          {/* Stats row */}
          <div className="flex gap-4 mt-4 text-xs flex-wrap">
            <span className="text-gray-300">📅 Week {Math.max(1, Math.ceil((Date.now() - new Date(project.created_date).getTime()) / (7 * 24 * 60 * 60 * 1000)))} of {totalWeeks}</span>
            <span className="text-gray-300">💰 {fmt(project.actualSpent || 0)} / {fmt(project.estimatedBudget)} EGP</span>
            {openSnags.length > 0 && <span className="text-yellow-400">⚠️ {openSnags.length} issues open</span>}
            <span className="text-gray-300">👷 {phases.filter(p => p.status === "in_progress").length} active phases</span>
            {project.requiresFOSupervision && <span className="text-blue-300">🗺️ FO Supervised</span>}
          </div>

          {/* Module badges */}
          <div className="flex gap-2 mt-3 flex-wrap">
            {[
              { label: "🛒 Kemetro", hint: "Materials" },
              { label: "👷 Kemework", hint: "Professionals" },
              { label: "🔒 Escrow™", hint: "Payments" },
              { label: "✨ Vision™", hint: "AI Photos" },
              { label: "📈 Predict™", hint: "Valuation" },
            ].map(b => (
              <span key={b.label} className="text-[10px] bg-white/10 text-gray-300 px-2 py-0.5 rounded-full font-bold">{b.label}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Phase pills */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {phases.map(ph => (
              <div key={ph.id} className={`flex-shrink-0 rounded-2xl px-3 py-2 border-2 text-center min-w-20 transition-all ${ph.status === "in_progress" ? "border-orange-500 bg-orange-50 shadow-sm" : ph.status === "completed" ? "border-green-500 bg-green-50" : "border-gray-200 bg-white"}`}>
                <p className="text-xs font-black text-gray-800">{ph.phaseName?.substring(0, 10)}</p>
                <p className="text-lg">{ph.status === "completed" ? "✅" : ph.status === "in_progress" ? "🔄" : "⏳"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-5xl mx-auto px-4 flex gap-0 overflow-x-auto no-scrollbar">
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-3 text-xs font-bold whitespace-nowrap border-b-2 transition-all ${tab === t.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Post-renovation nudge on completed projects */}
      {project.status === "completed" && (
        <div className="max-w-5xl mx-auto px-4 pt-6">
          <KemedarPostRenovationNudge context="finish" />
        </div>
      )}

      {/* Tab content */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        {tab === "timeline" && <FinishTabTimeline project={project} phases={phases} setPhases={setPhases} />}
        {tab === "materials" && <FinishTabMaterials project={project} phases={phases} />}
        {tab === "professionals" && <FinishTabProfessionals project={project} phases={phases} />}
        {tab === "progress" && <FinishTabProgress project={project} phases={phases} updates={updates} setUpdates={setUpdates} />}
        {tab === "snagging" && <FinishTabSnagging project={project} snags={snags} setSnags={setSnags} phases={phases} />}
        {tab === "payments" && <FinishTabPayments project={project} phases={phases} />}
        {tab === "valuation" && <FinishTabValuation project={project} />}
      </div>
    </div>
  );
}