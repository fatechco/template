import { useState } from 'react';
import { Plus, Edit, Trash2, Eye, Mail, Phone } from 'lucide-react';

const TEAM_MEMBERS = [
  { id: 1, name: 'Ahmed Hassan', role: 'Lead Designer', specialization: 'Interior Design', phone: '+20 100 1234567', email: 'ahmed@company.com', status: 'active', joinDate: '2024-01-15' },
  { id: 2, name: 'Fatima Ali', role: 'Project Manager', specialization: 'Project Management', phone: '+20 100 1234568', email: 'fatima@company.com', status: 'active', joinDate: '2024-02-20' },
  { id: 3, name: 'Mohamed Samir', role: 'Contractor', specialization: 'Carpentry', phone: '+20 100 1234569', email: 'salem@company.com', status: 'active', joinDate: '2024-03-10' },
  { id: 4, name: 'Layla Ahmed', role: 'Designer', specialization: 'Graphics & Branding', phone: '+20 100 1234570', email: 'layla@company.com', status: 'active', joinDate: '2024-01-25' },
];

export default function CompanyTeamMembers() {
  const [members, setMembers] = useState(TEAM_MEMBERS);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    role: 'Contractor',
    specialization: '',
    phone: '',
    email: '',
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-gray-900">👥 Team Members</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your finishing company team</p>
        </div>
        <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-purple-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-purple-700">
          <Plus size={18} /> Add Member
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-600 font-medium">Total Members</p>
          <p className="text-3xl font-black text-gray-900 mt-2">{members.length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-600 font-medium">Active</p>
          <p className="text-3xl font-black text-green-600 mt-2">{members.filter(m => m.status === 'active').length}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
          <p className="text-xs text-gray-600 font-medium">Specializations</p>
          <p className="text-3xl font-black text-blue-600 mt-2">{new Set(members.map(m => m.specialization)).size}</p>
        </div>
      </div>

      {/* Team Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Role</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Specialization</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Status</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Join Date</th>
              <th className="px-6 py-4 text-left font-bold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {members.map(member => (
              <tr key={member.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <p className="font-bold text-gray-900">{member.name}</p>
                  <p className="text-xs text-gray-600">{member.email}</p>
                </td>
                <td className="px-6 py-4 text-gray-700">{member.role}</td>
                <td className="px-6 py-4 text-gray-700">{member.specialization}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                    {member.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-600">{member.joinDate}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button onClick={() => setSelectedMember(member)} className="p-2 hover:bg-gray-100 rounded text-blue-600"><Eye size={16} /></button>
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
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-gray-900">{selectedMember.name}</h2>
              <button onClick={() => setSelectedMember(null)} className="text-gray-400 text-2xl">×</button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Role</p>
                  <p className="font-bold text-gray-900">{selectedMember.role}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Status</p>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-green-100 text-green-700">
                    {selectedMember.status}
                  </span>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Specialization</p>
                  <p className="font-bold text-gray-900">{selectedMember.specialization}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-600 font-medium mb-1">Join Date</p>
                  <p className="font-bold text-gray-900">{selectedMember.joinDate}</p>
                </div>
              </div>

              <div className="border-t pt-6">
                <p className="text-xs font-bold text-gray-700 mb-3">Contact Information</p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone size={16} className="text-gray-600" />
                    <p className="font-bold text-gray-900">{selectedMember.phone}</p>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={16} className="text-gray-600" />
                    <p className="font-bold text-gray-900">{selectedMember.email}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setSelectedMember(null)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Close</button>
                <button className="flex-1 bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700">Edit Member</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-6">Add Team Member</h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Name *</label>
                <input
                  type="text"
                  placeholder="Full name"
                  value={newMember.name}
                  onChange={(e) => setNewMember({ ...newMember, name: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Email *</label>
                <input
                  type="email"
                  placeholder="email@company.com"
                  value={newMember.email}
                  onChange={(e) => setNewMember({ ...newMember, email: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Phone *</label>
                <input
                  type="tel"
                  placeholder="+20 100 1234567"
                  value={newMember.phone}
                  onChange={(e) => setNewMember({ ...newMember, phone: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Role *</label>
                <select
                  value={newMember.role}
                  onChange={(e) => setNewMember({ ...newMember, role: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                >
                  <option>Contractor</option>
                  <option>Designer</option>
                  <option>Project Manager</option>
                  <option>Supervisor</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-bold text-gray-700 block mb-2">Specialization *</label>
                <input
                  type="text"
                  placeholder="e.g., Carpentry, Interior Design"
                  value={newMember.specialization}
                  onChange={(e) => setNewMember({ ...newMember, specialization: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-400"
                />
              </div>
              <div className="flex gap-3 pt-4 border-t">
                <button onClick={() => setShowForm(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">Cancel</button>
                <button
                  onClick={() => {
                    if (newMember.name && newMember.email && newMember.phone && newMember.specialization) {
                      setMembers([...members, {
                        id: Math.max(...members.map(m => m.id), 0) + 1,
                        status: 'active',
                        joinDate: new Date().toISOString().split('T')[0],
                        ...newMember,
                      }]);
                      setShowForm(false);
                      setNewMember({ name: '', role: 'Contractor', specialization: '', phone: '', email: '' });
                    }
                  }}
                  className="flex-1 bg-purple-600 text-white font-bold py-2.5 rounded-lg hover:bg-purple-700"
                >
                  Add Member
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}