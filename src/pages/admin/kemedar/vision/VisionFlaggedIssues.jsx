import { useState, useEffect } from "react";
import { AlertTriangle, RefreshCw, Eye } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

export default function VisionFlaggedIssues() {
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [severityFilter, setSeverityFilter] = useState("all");

  const load = () => {
    setLoading(true);
    base44.entities.PropertyPhotoAnalysis.filter({ hasIssues: true, analysisStatus: 'completed' })
      .then(setAnalyses).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  // Flatten all issues with photo context
  const allIssues = analyses.flatMap(a =>
    (a.issues || []).map(issue => ({ ...issue, photoUrl: a.photoUrl, propertyId: a.propertyId, analysisId: a.id }))
  ).filter(i => severityFilter === 'all' || i.severity === severityFilter);

  const criticalCount = analyses.reduce((n, a) => n + (a.issues?.filter(i => i.severity === 'critical').length || 0), 0);
  const disclosureCount = analyses.reduce((n, a) => n + (a.issues?.filter(i => i.disclosureRequired).length || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black text-gray-900">⚠️ Flagged Issues</h1>
        <button onClick={load} className="border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1.5">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-red-50 rounded-2xl p-4 border border-red-100">
          <p className="text-2xl font-black text-red-600">{criticalCount}</p>
          <p className="text-xs text-gray-500">Critical Issues</p>
        </div>
        <div className="bg-orange-50 rounded-2xl p-4 border border-orange-100">
          <p className="text-2xl font-black text-orange-600">{allIssues.length}</p>
          <p className="text-xs text-gray-500">Total Issues</p>
        </div>
        <div className="bg-yellow-50 rounded-2xl p-4 border border-yellow-100">
          <p className="text-2xl font-black text-yellow-600">{disclosureCount}</p>
          <p className="text-xs text-gray-500">Require Disclosure</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", "critical", "high", "medium", "low"].map(s => (
          <button key={s} onClick={() => setSeverityFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors capitalize ${
              severityFilter === s ? 'bg-gray-800 text-white border-gray-800' : 'border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}>{s}</button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Photo", "Property", "Issue Type", "Severity", "Location", "Description", "Disclosure", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={8} className="py-12 text-center text-gray-400">Loading...</td></tr>
            ) : allIssues.length === 0 ? (
              <tr><td colSpan={8} className="py-12 text-center text-gray-400">No flagged issues found</td></tr>
            ) : allIssues.map((issue, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img src={issue.photoUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                </td>
                <td className="px-4 py-3 font-mono text-[10px] text-gray-500">{issue.propertyId?.slice(-8)}</td>
                <td className="px-4 py-3 capitalize font-semibold text-gray-700">{issue.issueType?.replace(/_/g, ' ')}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    issue.severity === 'critical' ? 'bg-red-100 text-red-700' :
                    issue.severity === 'high' ? 'bg-orange-100 text-orange-700' :
                    issue.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-600'
                  }`}>{issue.severity}</span>
                </td>
                <td className="px-4 py-3 text-gray-500 capitalize">{issue.location || '—'}</td>
                <td className="px-4 py-3 text-gray-600 max-w-xs truncate">{issue.description}</td>
                <td className="px-4 py-3">
                  {issue.disclosureRequired ? (
                    <span className="text-orange-600 font-bold text-[10px]">⚠️ Required</span>
                  ) : <span className="text-gray-400">—</span>}
                </td>
                <td className="px-4 py-3">
                  <Link to={`/kemedar/property/${issue.propertyId}/vision`}
                    className="flex items-center gap-1 text-purple-500 hover:text-purple-700 font-bold text-[10px]">
                    <Eye size={11} /> View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}