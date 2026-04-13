import { Search, Download, Eye } from "lucide-react";
import { useState } from "react";

const mockJobs = [
  { id: "JOB-001", source: "Aqarmap", type: "Properties", records: 1250, status: "completed", started: "2024-03-21 09:00", completed: "2024-03-21 14:30", duration: "5h 30m", errors: 8 },
  { id: "JOB-002", source: "OLX", type: "Users", records: 567, status: "completed", started: "2024-03-20 10:00", completed: "2024-03-20 16:45", duration: "6h 45m", errors: 12 },
  { id: "JOB-003", source: "Property Finder", type: "Properties", records: 456, status: "partial", started: "2024-03-19 08:00", completed: "2024-03-19 13:20", duration: "5h 20m", errors: 78 },
];

export default function ScrapeJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ source: "all", type: "all", status: "all" });
  const [selectedJob, setSelectedJob] = useState(null);

  const filtered = mockJobs.filter(j =>
    (j.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
     j.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (filters.source === "all" || j.source === filters.source) &&
    (filters.type === "all" || j.type === filters.type) &&
    (filters.status === "all" || j.status === filters.status)
  );

  const getStatusColor = (status) => {
    const colors = {
      completed: "bg-green-100 text-green-700",
      partial: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
      running: "bg-blue-100 text-blue-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-black text-gray-900">Scrape Jobs</h1>
        <p className="text-sm text-gray-600 mt-1">View all scraping job history and logs</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 space-y-3">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search by job ID or source..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
            />
          </div>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:border-orange-500 focus:outline-none"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="partial">Partial</option>
            <option value="failed">Failed</option>
            <option value="running">Running</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Job ID</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Source</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Records</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Started</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Completed</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Duration</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Errors</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map(job => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-bold text-gray-900">{job.id}</td>
                  <td className="px-4 py-3 text-gray-600">{job.source}</td>
                  <td className="px-4 py-3 text-gray-600">{job.type}</td>
                  <td className="px-4 py-3 font-bold text-gray-900">{job.records.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${getStatusColor(job.status)}`}>
                      {job.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{job.started}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{job.completed}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{job.duration}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded text-xs font-bold ${job.errors > 0 ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
                      {job.errors}
                    </span>
                  </td>
                  <td className="px-4 py-3 flex gap-1">
                    <button onClick={() => setSelectedJob(job)} className="p-1 hover:bg-gray-200 rounded text-blue-600">
                      <Eye size={14} />
                    </button>
                    <button className="p-1 hover:bg-gray-200 rounded text-gray-600">
                      <Download size={14} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Job Details: {selectedJob.id}</h2>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-bold">Source</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedJob.source}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 font-bold">Records</p>
                  <p className="text-sm font-bold text-gray-900 mt-1">{selectedJob.records}</p>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-xs max-h-96 overflow-y-auto">
              <p>[2024-03-21 09:00:00] Starting scrape job...</p>
              <p>[2024-03-21 09:05:12] Connected to {selectedJob.source}</p>
              <p>[2024-03-21 09:15:45] Found 1250 records</p>
              <p>[2024-03-21 14:20:00] Processing complete</p>
              <p>[2024-03-21 14:30:00] {selectedJob.errors} errors encountered</p>
              <p className="text-green-400">[2024-03-21 14:30:15] ✅ Import successful</p>
            </div>

            <button onClick={() => setSelectedJob(null)} className="w-full mt-6 px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-bold text-sm hover:bg-gray-50">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}