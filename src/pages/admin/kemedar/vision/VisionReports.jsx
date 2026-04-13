import { useState, useEffect } from "react";
import { Search, RefreshCw, Eye } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";

const GRADE_COLORS = {
  premium: "bg-purple-100 text-purple-700", good: "bg-green-100 text-green-700",
  average: "bg-yellow-100 text-yellow-700", needs_work: "bg-orange-100 text-orange-700",
  poor: "bg-red-100 text-red-700"
};

export default function VisionReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    base44.entities.PropertyVisionReport.list("-created_date", 200)
      .then(setReports).finally(() => setLoading(false));
  }, []);

  const filtered = reports.filter(r =>
    !search || (r.propertyId || '').toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black text-gray-900">📊 Photo Reports</h1>
        <button onClick={() => { setLoading(true); base44.entities.PropertyVisionReport.list("-created_date", 200).then(setReports).finally(() => setLoading(false)); }}
          className="border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1.5">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
      </div>
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by property ID..."
          className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none" />
      </div>
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Property ID", "Photos", "Quality Score", "Grade", "Finishing", "Issues", "Price Aligned", "Generated", "Actions"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={9} className="py-12 text-center text-gray-400">Loading...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan={9} className="py-12 text-center text-gray-400">No reports yet</td></tr>
            ) : filtered.map(r => (
              <tr key={r.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-mono text-[10px] text-gray-600">{r.propertyId?.slice(-8)}</td>
                <td className="px-4 py-3 font-bold text-gray-800">{r.photoCount || 0}</td>
                <td className="px-4 py-3">
                  <span className={`font-black ${(r.listingQualityScore || 0) >= 70 ? 'text-green-600' : (r.listingQualityScore || 0) >= 50 ? 'text-yellow-600' : 'text-red-600'}`}>
                    {r.listingQualityScore || 0}/100
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${GRADE_COLORS[r.listingQualityGrade] || 'bg-gray-100 text-gray-500'}`}>
                    {r.listingQualityGrade?.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-4 py-3 capitalize text-gray-600">{r.overallFinishingGrade?.replace('_', ' ') || '—'}</td>
                <td className="px-4 py-3">
                  {(r.criticalIssuesCount || 0) > 0 ? (
                    <span className="text-red-600 font-bold">🔴 {r.criticalIssuesCount} critical</span>
                  ) : <span className="text-green-500">✅ None</span>}
                </td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold ${r.priceAlignmentStatus === 'fair' ? 'text-green-600' : 'text-orange-600'}`}>
                    {r.priceAlignmentStatus || '—'}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400">{r.completedAt ? new Date(r.completedAt).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3">
                  <Link to={`/kemedar/property/${r.propertyId}/vision`}
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