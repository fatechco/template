import { useState, useEffect } from "react";
import { Sparkles, RefreshCw } from "lucide-react";
import { base44 } from "@/api/base44Client";

const STATUS_COLORS = {
  queued: "bg-gray-100 text-gray-600", processing: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700", failed: "bg-red-100 text-red-600"
};

export default function VisionStagingJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    base44.entities.VirtualStagingJob.list("-created_date", 200)
      .then(setJobs).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const completed = jobs.filter(j => j.status === 'completed').length;
  const failed = jobs.filter(j => j.status === 'failed').length;
  const totalCredits = jobs.reduce((n, j) => n + (j.creditsUsed || 0), 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-black text-gray-900 flex items-center gap-2"><Sparkles className="text-purple-500" size={20} /> Staging Jobs</h1>
        <button onClick={load} className="border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50 flex items-center gap-1.5">
          <RefreshCw size={12} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: "Total Jobs", val: jobs.length, color: "text-gray-900" },
          { label: "Completed", val: completed, color: "text-green-600" },
          { label: "Failed", val: failed, color: "text-red-600" },
          { label: "Credits Used", val: totalCredits, color: "text-purple-600" },
        ].map(k => (
          <div key={k.label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className={`text-3xl font-black ${k.color}`}>{k.val}</p>
            <p className="text-xs text-gray-500 mt-1">{k.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full text-xs">
          <thead className="bg-gray-50 border-b border-gray-100">
            <tr>
              {["Original", "Staged Result", "Style", "Property", "Status", "Credits", "Requested", "Completed"].map(h => (
                <th key={h} className="px-4 py-3 text-left font-bold text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {loading ? (
              <tr><td colSpan={8} className="py-12 text-center text-gray-400">Loading...</td></tr>
            ) : jobs.length === 0 ? (
              <tr><td colSpan={8} className="py-12 text-center text-gray-400">No staging jobs yet</td></tr>
            ) : jobs.map(job => (
              <tr key={job.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <img src={job.originalPhotoUrl} alt="" className="w-12 h-12 rounded-lg object-cover" />
                </td>
                <td className="px-4 py-3">
                  {job.resultPhotoUrl ? (
                    <img src={job.resultPhotoUrl} alt="staged" className="w-12 h-12 rounded-lg object-cover" />
                  ) : <span className="text-gray-300">—</span>}
                </td>
                <td className="px-4 py-3 capitalize font-semibold text-gray-700">{job.stagingStyle || '—'}</td>
                <td className="px-4 py-3 font-mono text-[10px] text-gray-500">{job.propertyId?.slice(-8)}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[job.status] || 'bg-gray-100 text-gray-500'}`}>
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600 font-bold">{job.creditsUsed || 1}</td>
                <td className="px-4 py-3 text-gray-400">{job.created_date ? new Date(job.created_date).toLocaleDateString() : '—'}</td>
                <td className="px-4 py-3 text-gray-400">{job.processingCompleted ? new Date(job.processingCompleted).toLocaleDateString() : '—'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}