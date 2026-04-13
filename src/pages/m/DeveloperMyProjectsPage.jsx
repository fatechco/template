import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, ChevronRight } from "lucide-react";

const PROJECTS = [
  { id: 1, name: "New Cairo Tower", location: "New Cairo", status: "active", delivery: "Q3 2024", image: "bg-blue-300", totalUnits: 120, soldUnits: 45, availUnits: 75 },
  { id: 2, name: "Downtown Residences", location: "Downtown", status: "active", delivery: "Q2 2024", image: "bg-green-300", totalUnits: 80, soldUnits: 62, availUnits: 18 },
  { id: 3, name: "Sheikh Zayed City", location: "6th of October", status: "upcoming", delivery: "Q1 2025", image: "bg-purple-300", totalUnits: 250, soldUnits: 0, availUnits: 250 },
];

const PROJECT_STATUSES = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "upcoming", label: "Upcoming" },
];

export default function DeveloperMyProjectsPage() {
  const navigate = useNavigate();
  const [activeStatus, setActiveStatus] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);

  const filteredProjects = PROJECTS.filter(p => activeStatus === "all" || p.status === activeStatus);

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900">My Projects</h1>
        <button className="ml-auto text-blue-600 hover:bg-blue-50 p-2 rounded-lg">
          <Plus size={20} />
        </button>
      </div>

      {/* Status Filter */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {PROJECT_STATUSES.map(status => (
          <button
            key={status.id}
            onClick={() => setActiveStatus(status.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeStatus === status.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Project Cards */}
      <div className="px-4 py-4 pb-24 space-y-4">
        {filteredProjects.map(project => (
          <div key={project.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Cover Image */}
            <div className={`w-full h-40 ${project.image}`} />

            {/* Content */}
            <div className="p-4 space-y-3">
              <div>
                <p className="font-bold text-base text-gray-900">{project.name}</p>
                <p className="text-xs text-gray-500 mt-1">📍 {project.location}</p>
              </div>

              {/* Status & Delivery */}
              <div className="flex gap-2">
                <span className={`text-[10px] font-bold px-2 py-1 rounded ${
                  project.status === "active" 
                    ? "bg-green-100 text-green-700" 
                    : "bg-yellow-100 text-yellow-700"
                }`}>
                  {project.status === "active" ? "Active" : "Upcoming"}
                </span>
                <span className="text-[10px] font-bold px-2 py-1 rounded bg-gray-100 text-gray-700">
                  🚀 {project.delivery}
                </span>
              </div>

              {/* Units Stats */}
              <div className="bg-gray-50 rounded-xl p-3 space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Units Progress</span>
                  <span className="text-gray-600">{project.soldUnits} / {project.totalUnits}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600"
                    style={{ width: `${(project.soldUnits / project.totalUnits) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-3 gap-2 text-[10px] mt-2">
                  <div className="text-center">
                    <p className="font-bold text-gray-900">{project.totalUnits}</p>
                    <p className="text-gray-600">Total</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-green-600">{project.soldUnits}</p>
                    <p className="text-gray-600">Sold</p>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-blue-600">{project.availUnits}</p>
                    <p className="text-gray-600">Available</p>
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setSelectedProject(project)}
                  className="text-xs font-bold border border-blue-600 text-blue-600 py-2.5 rounded-lg hover:bg-blue-50 transition-colors"
                >
                  View Project
                </button>
                <button className="text-xs font-bold bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700">
                  Manage Units
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Project Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-start">
              <h2 className="text-lg font-black text-gray-900">{selectedProject.name}</h2>
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 text-2xl">✕</button>
            </div>

            <div className={`w-full h-32 rounded-lg ${selectedProject.image}`} />

            <div className="space-y-2">
              <p className="text-sm text-gray-600"><strong>Location:</strong> {selectedProject.location}</p>
              <p className="text-sm text-gray-600"><strong>Status:</strong> {selectedProject.status}</p>
              <p className="text-sm text-gray-600"><strong>Delivery:</strong> {selectedProject.delivery}</p>
              <p className="text-sm text-gray-600"><strong>Total Units:</strong> {selectedProject.totalUnits}</p>
            </div>

            <div className="space-y-2">
              <button className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-lg">Manage Units</button>
              <button className="w-full border border-blue-600 text-blue-600 font-bold py-2.5 rounded-lg hover:bg-blue-50">Edit Project</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}