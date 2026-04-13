import { Pause, Play, RotateCcw, Eye } from "lucide-react";
import { useState } from "react";

const mockJobs = [
  {
    id: 1,
    source: "Aqarmap Egypt",
    type: "properties",
    status: "running",
    progress: 65,
    usersFound: 234,
    propertiesFound: 1250,
    duplicatesSkipped: 89,
    errors: 5,
    totalProcessed: 650,
    totalToProcess: 1000
  },
  {
    id: 2,
    source: "OLX Egypt",
    type: "users",
    status: "completed",
    usersFound: 567,
    propertiesFound: 2340,
    duplicatesSkipped: 234,
    errors: 12,
  },
  {
    id: 3,
    source: "Property Finder UAE",
    type: "properties",
    status: "partial",
    usersFound: 89,
    propertiesFound: 456,
    duplicatesSkipped: 45,
    errors: 78,
  }
];

export default function ScrapeJobsPanel() {
  const getStatusBadge = (status) => {
    const badges = {
      running: "bg-blue-100 text-blue-700",
      completed: "bg-green-100 text-green-700",
      partial: "bg-yellow-100 text-yellow-700",
      failed: "bg-red-100 text-red-700",
    };
    return badges[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="space-y-4">
      <h3 className="font-bold text-gray-900">Active Scrape Jobs</h3>
      
      <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
        {mockJobs.map(job => (
          <div key={job.id} className="bg-white rounded-xl border border-gray-100 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-gray-900">{job.source}</h4>
              <span className={`px-2.5 py-1 rounded text-xs font-bold ${getStatusBadge(job.status)}`}>
                {job.status === "running" && "🔵 Running"}
                {job.status === "completed" && "✅ Completed"}
                {job.status === "partial" && "⚠️ Partial"}
                {job.status === "failed" && "❌ Failed"}
              </span>
            </div>

            {job.status === "running" && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-600">{job.totalProcessed}/{job.totalToProcess} records processed</span>
                  <span className="text-xs font-bold text-gray-900">{job.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-600 h-2 rounded-full transition-all" style={{ width: `${job.progress}%` }}></div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-600">Users found: <span className="font-bold text-gray-900">{job.usersFound}</span></p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-600">Properties: <span className="font-bold text-gray-900">{job.propertiesFound}</span></p>
              </div>
              <div className="bg-gray-50 rounded p-2">
                <p className="text-gray-600">Duplicates: <span className="font-bold text-gray-900">{job.duplicatesSkipped}</span></p>
              </div>
              <div className="bg-red-50 rounded p-2">
                <p className="text-red-600">Errors: <span className="font-bold">{job.errors}</span></p>
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t border-gray-100">
              <button className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-gray-700 hover:bg-gray-100 py-1.5 rounded">
                <Eye size={12} /> Log
              </button>
              {job.status === "running" && (
                <>
                  <button className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-gray-700 hover:bg-gray-100 py-1.5 rounded">
                    <Pause size={12} /> Pause
                  </button>
                  <button className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-red-700 hover:bg-red-50 py-1.5 rounded">
                    ⏹ Stop
                  </button>
                </>
              )}
              {(job.status === "partial" || job.status === "failed") && (
                <button className="flex-1 flex items-center justify-center gap-1 text-xs font-bold text-orange-700 hover:bg-orange-50 py-1.5 rounded">
                  <RotateCcw size={12} /> Retry
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}