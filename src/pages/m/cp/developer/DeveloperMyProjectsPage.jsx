import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Edit, Eye, Trash2, ChevronDown, ChevronUp, Building2, MapPin, Users } from "lucide-react";

const STATUS_COLORS = {
  "Under Construction": "bg-yellow-100 text-yellow-700",
  "Ready to Move": "bg-green-100 text-green-700",
  "Off-Plan": "bg-blue-100 text-blue-700",
  "Sold Out": "bg-gray-100 text-gray-600",
};

const MOCK_PROJECTS = [
  { id: 1, name: "Nile Towers Residences", location: "New Cairo, Cairo", units: 120, status: "Under Construction", views: 3420, inquiries: 45, date: "2024-06-01", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=80", unitsSold: 38, unitsAvailable: 82, recentActivity: "New inquiry from Ahmed Hassan" },
  { id: 2, name: "Palm Hills Village", location: "Sheikh Zayed, Giza", units: 80, status: "Ready to Move", views: 2180, inquiries: 29, date: "2023-01-15", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80", unitsSold: 72, unitsAvailable: 8, recentActivity: "Site visit scheduled" },
  { id: 3, name: "Marina Residences", location: "North Coast", units: 200, status: "Off-Plan", views: 1890, inquiries: 61, date: "2025-03-01", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80", unitsSold: 15, unitsAvailable: 185, recentActivity: "5 new inquiries this week" },
];

export default function DeveloperMyProjectsPage() {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-200 px-4 py-4 flex items-center justify-between">
        <div>
          <h1 className="text-lg font-black text-gray-900">My Projects</h1>
          <p className="text-xs text-gray-500">{MOCK_PROJECTS.length} projects</p>
        </div>
        <button
          onClick={() => navigate("/m/add/project")}
          className="flex items-center justify-center gap-1.5 bg-orange-600 hover:bg-orange-700 text-white font-bold px-3.5 py-2 rounded-lg text-sm transition-colors active:scale-95"
        >
          <Plus size={16} /> Add
        </button>
      </div>

      {/* Projects List */}
      <div className="px-4 py-4 space-y-3">
        {MOCK_PROJECTS.map(p => (
          <div key={p.id}>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Main Card */}
              <div
                onClick={() => setExpanded(expanded === p.id ? null : p.id)}
                className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              >
                {/* Image & Header */}
                <div className="flex gap-3 mb-3">
                  <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{p.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-xs mt-0.5">
                      <MapPin size={12} />
                      <span className="line-clamp-1">{p.location}</span>
                    </div>
                    <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded-full mt-1.5 ${STATUS_COLORS[p.status]}`}>
                      {p.status}
                    </span>
                  </div>
                  <button className="p-1 text-gray-400 hover:text-gray-600">
                    {expanded === p.id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </button>
                </div>

                {/* Stats Row */}
                <div className="grid grid-cols-3 gap-2 pt-2 border-t border-gray-100">
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Units</p>
                    <p className="font-bold text-gray-900">{p.units}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Views</p>
                    <p className="font-bold text-gray-900">{(p.views / 1000).toFixed(1)}k</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500 mb-0.5">Inquiries</p>
                    <p className="font-bold text-orange-600">{p.inquiries}</p>
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {expanded === p.id && (
                <div className="bg-gray-50 border-t border-gray-100 p-4 space-y-3">
                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Units Sold</p>
                      <p className="font-black text-green-600">{p.unitsSold}</p>
                    </div>
                    <div className="bg-white rounded-xl p-3">
                      <p className="text-xs text-gray-500 mb-1">Available</p>
                      <p className="font-black text-blue-600">{p.unitsAvailable}</p>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="bg-white rounded-xl p-3">
                    <p className="text-xs text-gray-500 mb-1">Recent Activity</p>
                    <p className="text-sm font-semibold text-gray-700">{p.recentActivity}</p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 pt-2">
                    <button className="flex-1 flex items-center justify-center gap-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 font-bold py-2.5 rounded-lg text-xs transition-colors">
                      <Edit size={14} /> Edit
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold py-2.5 rounded-lg text-xs transition-colors">
                      <Eye size={14} /> View
                    </button>
                    <button className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold py-2.5 rounded-lg text-xs transition-colors">
                      <Trash2 size={14} /> Delete
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {MOCK_PROJECTS.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <Building2 size={48} className="text-gray-300 mb-3" />
          <p className="text-gray-600 font-medium mb-4">No projects yet</p>
          <button
            onClick={() => navigate("/m/add/project")}
            className="bg-orange-600 hover:bg-orange-700 text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            Create First Project
          </button>
        </div>
      )}
    </div>
  );
}