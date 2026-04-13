import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Plus, Eye, Edit, Trash2, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_COLORS = {
  "Under Construction": "bg-yellow-100 text-yellow-700",
  "Ready to Move": "bg-green-100 text-green-700",
  "Off-Plan": "bg-blue-100 text-blue-700",
  "Sold Out": "bg-gray-100 text-gray-600",
};

const MOCK_PROJECTS = [
  {
    id: 1,
    name: "Nile Towers Residences",
    location: "New Cairo, Cairo",
    units: 120,
    status: "Under Construction",
    views: 3420,
    inquiries: 45,
    date: "2024-06-01",
    image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=80&q=70",
    unitsSold: 38,
    unitsAvailable: 82,
  },
  {
    id: 2,
    name: "Palm Hills Village",
    location: "Sheikh Zayed, Giza",
    units: 80,
    status: "Ready to Move",
    views: 2180,
    inquiries: 29,
    date: "2023-01-15",
    image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&q=70",
    unitsSold: 72,
    unitsAvailable: 8,
  },
  {
    id: 3,
    name: "Marina Residences",
    location: "North Coast",
    units: 200,
    status: "Off-Plan",
    views: 1890,
    inquiries: 61,
    date: "2025-03-01",
    image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=80&q=70",
    unitsSold: 15,
    unitsAvailable: 185,
  },
];

function ProjectCard({ project, onExpand, expanded }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start gap-3 mb-3">
          <img src={project.image} alt="" className="w-14 h-10 object-cover rounded-lg flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="font-bold text-gray-900 text-sm line-clamp-1">{project.name}</p>
            <p className="text-xs text-gray-400 mt-0.5">{project.location}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex gap-2 mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[project.status]}`}>
            {project.status}
          </span>
          <span className="text-xs font-bold bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full">
            {project.units} units
          </span>
        </div>

        {/* Metrics */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="bg-blue-50 rounded-lg px-2 py-1.5 text-center">
            <p className="text-sm font-black text-blue-700">{project.views}</p>
            <p className="text-[10px] text-blue-500 font-semibold">Views</p>
          </div>
          <div className="bg-orange-50 rounded-lg px-2 py-1.5 text-center">
            <p className="text-sm font-black text-orange-600">{project.inquiries}</p>
            <p className="text-[10px] text-orange-500 font-semibold">Inquiries</p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-1.5">
          <button className="flex-1 flex items-center justify-center gap-1 bg-blue-100 text-blue-700 py-2 rounded-lg font-bold text-xs hover:bg-blue-200">
            <Eye size={13} /> View
          </button>
          <button className="flex-1 flex items-center justify-center gap-1 bg-gray-100 text-gray-600 py-2 rounded-lg font-bold text-xs hover:bg-gray-200">
            <Edit size={13} /> Edit
          </button>
          <button className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold text-xs hover:bg-red-100">
            <Trash2 size={13} /> Delete
          </button>
          <button
            onClick={() => onExpand(project.id)}
            className="w-9 flex items-center justify-center bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200"
          >
            {expanded === project.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {expanded === project.id && (
        <div className="border-t border-gray-100 bg-gray-50 p-4 space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white rounded-lg p-2 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 mb-1">Sold</p>
              <p className="text-sm font-black text-gray-900">{project.unitsSold}</p>
            </div>
            <div className="bg-white rounded-lg p-2 border border-gray-100">
              <p className="text-[10px] font-bold text-gray-400 mb-1">Available</p>
              <p className="text-sm font-black text-gray-900">{project.unitsAvailable}</p>
            </div>
          </div>
          <p className="text-[10px] text-gray-400">Listed: {project.date}</p>
        </div>
      )}
    </div>
  );
}

export default function AgentMyProjectsPage() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="min-h-full bg-gray-50 pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
            <ChevronLeft size={22} className="text-gray-900" />
          </button>
          <h1 className="text-lg font-black text-gray-900">My Projects</h1>
        </div>
        <button onClick={() => {}} className="text-orange-600 hover:bg-orange-50 p-2 rounded-lg">
          <Plus size={20} />
        </button>
      </div>

      {/* Projects List */}
      <div className="px-4 py-4 space-y-3">
        {MOCK_PROJECTS.length > 0 ? (
          MOCK_PROJECTS.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onExpand={setExpanded}
              expanded={expanded}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-sm">No projects yet</p>
          </div>
        )}
      </div>
    </div>
  );
}