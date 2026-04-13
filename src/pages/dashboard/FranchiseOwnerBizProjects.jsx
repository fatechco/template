import { useState } from 'react';
import { Plus, Eye, Edit, Trash2, Download, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PROJECTS = [
  { id: 1, name: "Office Renovation", client: "Ahmed Hassan", status: "in_progress", budget: 50000, spent: 32000, progress: 64, startDate: "2026-01-15", endDate: "2026-06-15", team: 5 },
  { id: 2, name: "Store Expansion", client: "Fatima Ali", status: "planning", budget: 75000, spent: 0, progress: 15, startDate: "2026-03-20", endDate: "2026-09-20", team: 8 },
  { id: 3, name: "Website Development", client: "Mohamed Samir", status: "completed", budget: 25000, spent: 24500, progress: 100, startDate: "2025-12-01", endDate: "2026-02-28", team: 3 },
  { id: 4, name: "Marketing Campaign", client: "Leila Ahmed", status: "on_hold", budget: 15000, spent: 8000, progress: 53, startDate: "2026-02-01", endDate: "2026-05-01", team: 2 },
];

const STATUS_CONFIG = {
  planning: { badge: "bg-yellow-100 text-yellow-700", color: "#FCD34D", icon: "📋" },
  in_progress: { badge: "bg-blue-100 text-blue-700", color: "#3B82F6", icon: "🔨" },
  completed: { badge: "bg-green-100 text-green-700", color: "#10B981", icon: "✅" },
  on_hold: { badge: "bg-orange-100 text-orange-700", color: "#F97316", icon: "⏸️" },
};

export default function FranchiseOwnerBizProjects() {
  const [projects, setProjects] = useState(PROJECTS);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    budget: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
    team: '1',
  });

  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const inProgressProjects = projects.filter(p => p.status === 'in_progress').length;
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);

  const projectData = projects.map(p => ({
    name: p.name.slice(0, 10),
    budget: p.budget,
    spent: p.spent,
  }));

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">🏗️ Projects</h1>
          <p className="text-gray-500 text-sm mt-1">Manage and track all business projects</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-purple-700">
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Total Projects</p>
              <p className="text-3xl font-black text-gray-900 mt-2">{projects.length}</p>
            </div>
            <span className="text-3xl">📊</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">In Progress</p>
              <p className="text-3xl font-black text-blue-600 mt-2">{inProgressProjects}</p>
            </div>
            <span className="text-3xl">🔨</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Completed</p>
              <p className="text-3xl font-black text-green-600 mt-2">{completedProjects}</p>
            </div>
            <span className="text-3xl">✅</span>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-gray-600 font-medium">Total Budget</p>
              <p className="text-3xl font-black text-purple-600 mt-2">${totalBudget.toLocaleString()}</p>
            </div>
            <span className="text-3xl">💰</span>
          </div>
        </div>
      </div>

      {/* Budget Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Budget vs Spending</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={projectData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb' }} />
              <Bar dataKey="budget" fill="#A78BFA" radius={[8, 8, 0, 0]} />
              <Bar dataKey="spent" fill="#F97316" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Financial Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-lg font-black text-gray-900 mb-4">Financial Summary</h2>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="font-bold text-gray-900">${totalBudget.toLocaleString()}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-purple-600 h-2 rounded-full" style={{ width: '100%' }}></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-sm text-gray-600">Spent</p>
                <p className="font-bold text-orange-600">${totalSpent.toLocaleString()}</p>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(totalSpent / totalBudget) * 100}%` }}></div>
              </div>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <p className="text-sm text-gray-600">Remaining</p>
                <p className="font-bold text-green-600">${(totalBudget - totalSpent).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Projects Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Project Name</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Client</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Budget</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Progress</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Team</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {projects.map(project => (
              <tr key={project.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-bold text-gray-900">{project.name}</td>
                <td className="px-6 py-4 text-gray-700">{project.client}</td>
                <td className="px-6 py-4 font-bold text-gray-900">${project.budget.toLocaleString()}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-600 h-2 rounded-full" style={{ width: `${project.progress}%` }}></div>
                    </div>
                    <span className="text-xs font-bold text-gray-700">{project.progress}%</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_CONFIG[project.status].badge}`}>
                    {STATUS_CONFIG[project.status].icon} {project.status.replace('_', ' ').charAt(0).toUpperCase() + project.status.slice(1).replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-700">👥 {project.team}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedProject(project)} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Eye size={16} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-gray-600"><Edit size={16} /></button>
                    <button className="p-2 hover:bg-gray-100 rounded text-red-600"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      {selectedProject && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">{selectedProject.name}</h2>
              <button onClick={() => setSelectedProject(null)} className="text-gray-400 text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Client</p>
                  <p className="font-bold text-gray-900">{selectedProject.client}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_CONFIG[selectedProject.status].badge}`}>
                    {STATUS_CONFIG[selectedProject.status].icon} {selectedProject.status.replace('_', ' ')}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Budget</p>
                  <p className="font-bold text-gray-900 text-lg">${selectedProject.budget.toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Spent</p>
                  <p className="font-bold text-orange-600 text-lg">${selectedProject.spent.toLocaleString()}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs font-bold text-gray-700 mb-3">Project Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div className="bg-purple-600 h-3 rounded-full" style={{ width: `${selectedProject.progress}%` }}></div>
                </div>
                <p className="text-sm font-bold text-gray-900 mt-2">{selectedProject.progress}% Complete</p>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs font-bold text-gray-700 mb-3">Timeline</p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-medium mb-1">Start Date</p>
                    <p className="font-bold text-gray-900">{selectedProject.startDate}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <p className="text-xs text-gray-600 font-medium mb-1">End Date</p>
                    <p className="font-bold text-gray-900">{selectedProject.endDate}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs font-bold text-gray-700 mb-3">Team Size</p>
                <p className="text-2xl font-black text-purple-600">👥 {selectedProject.team} Members</p>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setSelectedProject(null)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Close</button>
                <button className="flex-1 bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700">Edit Project</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">New Project</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Project Name *</label>
                <input
                  type="text"
                  placeholder="Project name"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Client Name *</label>
                <input
                  type="text"
                  placeholder="Client name"
                  value={newProject.client}
                  onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Budget ($) *</label>
                <input
                  type="number"
                  placeholder="0"
                  value={newProject.budget}
                  onChange={(e) => setNewProject({ ...newProject, budget: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Start Date</label>
                <input
                  type="date"
                  value={newProject.startDate}
                  onChange={(e) => setNewProject({ ...newProject, startDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">End Date</label>
                <input
                  type="date"
                  value={newProject.endDate}
                  onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Team Size</label>
                <input
                  type="number"
                  min="1"
                  value={newProject.team}
                  onChange={(e) => setNewProject({ ...newProject, team: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => {
                    if (newProject.name && newProject.client && newProject.budget && newProject.endDate) {
                      setProjects([...projects, {
                        id: Math.max(...projects.map(p => p.id), 0) + 1,
                        budget: parseFloat(newProject.budget),
                        spent: 0,
                        progress: 10,
                        status: 'planning',
                        team: parseInt(newProject.team),
                        ...newProject,
                      }]);
                      setShowForm(false);
                      setNewProject({ name: '', client: '', budget: '', startDate: new Date().toISOString().split('T')[0], endDate: '', team: '1' });
                    }
                  }}
                  className="flex-1 bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700"
                >
                  Create Project
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}