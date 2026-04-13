import { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Edit, Eye, Trash2, CheckSquare, ChevronDown, ChevronUp } from "lucide-react";

const STATUS_COLORS = {
  "Under Construction": "bg-yellow-100 text-yellow-700",
  "Ready to Move": "bg-green-100 text-green-700",
  "Off-Plan": "bg-blue-100 text-blue-700",
  "Sold Out": "bg-gray-100 text-gray-600",
};

const MOCK_PROJECTS = [
  { id: 1, name: "Nile Towers Residences", location: "New Cairo, Cairo", units: 120, status: "Under Construction", views: 3420, inquiries: 45, date: "2024-06-01", image: "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=80&q=70", unitsSold: 38, unitsAvailable: 82, recentActivity: "New inquiry from Ahmed Hassan" },
  { id: 2, name: "Palm Hills Village", location: "Sheikh Zayed, Giza", units: 80, status: "Ready to Move", views: 2180, inquiries: 29, date: "2023-01-15", image: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=80&q=70", unitsSold: 72, unitsAvailable: 8, recentActivity: "Site visit scheduled" },
  { id: 3, name: "Marina Residences", location: "North Coast", units: 200, status: "Off-Plan", views: 1890, inquiries: 61, date: "2025-03-01", image: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=80&q=70", unitsSold: 15, unitsAvailable: 185, recentActivity: "5 new inquiries this week" },
  { id: 4, name: "Cairo Business Park", location: "Downtown Cairo", units: 50, status: "Sold Out", views: 980, inquiries: 12, date: "2022-08-10", image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=80&q=70", unitsSold: 50, unitsAvailable: 0, recentActivity: "—" },
];

export default function MyProjects() {
  const [expanded, setExpanded] = useState(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">My Projects</h1>
          <p className="text-gray-500 text-sm">{MOCK_PROJECTS.length} projects</p>
        </div>
        <Link to="/create/project" className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold px-4 py-2.5 rounded-lg text-sm transition-colors">
          <Plus size={16} /> Add New Project
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Project</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Location</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Units</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Views</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Inquiries</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Date</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {MOCK_PROJECTS.map((p, i) => (
                <>
                  <tr key={p.id} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/50"}`}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.image} alt="" className="w-12 h-9 object-cover rounded-lg flex-shrink-0" />
                        <span className="font-semibold text-gray-800">{p.name}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.location}</td>
                    <td className="px-4 py-3 font-bold text-gray-900">{p.units}</td>
                    <td className="px-4 py-3"><span className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_COLORS[p.status]}`}>{p.status}</span></td>
                    <td className="px-4 py-3 text-gray-700">{p.views.toLocaleString()}</td>
                    <td className="px-4 py-3 text-gray-700">{p.inquiries}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{p.date}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button title="Edit" className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Edit size={14} /></button>
                        <button title="View" className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center"><Eye size={14} /></button>
                        <button title="Verify" className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center"><CheckSquare size={14} /></button>
                        <button title="Delete" className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><Trash2 size={14} /></button>
                        <button onClick={() => setExpanded(expanded === p.id ? null : p.id)} className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center">
                          {expanded === p.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expanded === p.id && (
                    <tr key={`exp-${p.id}`} className="bg-blue-50/30">
                      <td colSpan={8} className="px-6 py-4">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: "Units Sold", value: p.unitsSold, color: "text-green-600" },
                            { label: "Units Available", value: p.unitsAvailable, color: "text-blue-600" },
                            { label: "Total Inquiries", value: p.inquiries, color: "text-orange-500" },
                            { label: "Recent Activity", value: p.recentActivity, color: "text-gray-700" },
                          ].map(s => (
                            <div key={s.label} className="bg-white rounded-lg p-3">
                              <p className="text-xs text-gray-400 mb-1">{s.label}</p>
                              <p className={`font-bold text-sm ${s.color}`}>{s.value}</p>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}