import { useState } from 'react';
import { ChevronRight, Search, Filter, RotateCcw, Download, MessageCircle, Mail, Phone, Eye, Edit, MoreVertical, Check, Shield, AlertCircle, CheckCircle2 } from 'lucide-react';

const USERS_DATA = [
  { id: 1, name: "Ahmed Hassan", role: "Agent", phone: "+201234567890", email: "ahmed@example.com", properties: 12, status: "active", verified: true, joined: "2025-01-15", avatar: "AH", city: "Cairo" },
  { id: 2, name: "Sara Mohamed", role: "Developer", phone: "+201234567891", email: "sara@example.com", properties: 8, status: "active", verified: true, joined: "2025-02-10", avatar: "SM", city: "Giza" },
  { id: 3, name: "Karim Ali", role: "Professional", phone: "+201234567892", email: "karim@example.com", properties: 0, status: "active", verified: false, joined: "2025-03-01", avatar: "KA", city: "Cairo" },
  { id: 4, name: "Fatima Khalil", role: "Finishing Company", phone: "+201234567893", email: "fatima@example.com", properties: 5, status: "pending", verified: false, joined: "2025-03-15", avatar: "FK", city: "New Cairo" },
  { id: 5, name: "Hassan Ibrahim", role: "Agent", phone: "+201234567894", email: "hassan@example.com", properties: 15, status: "active", verified: true, joined: "2025-01-05", avatar: "HI", city: "Cairo" },
  { id: 6, name: "Leila Ahmed", role: "Shop Owner", phone: "+201234567895", email: "leila@example.com", properties: 0, status: "active", verified: true, joined: "2025-02-20", avatar: "LA", city: "Maadi" },
  { id: 7, name: "Omar Khalid", role: "Developer", phone: "+201234567896", email: "omar@example.com", properties: 3, status: "suspended", verified: true, joined: "2025-01-20", avatar: "OK", city: "6th October" },
  { id: 8, name: "Noor Hamad", role: "Professional", phone: "+201234567897", email: "noor@example.com", properties: 0, status: "active", verified: false, joined: "2025-03-10", avatar: "NH", city: "Heliopolis" },
];

const ROLE_COLORS = {
  Agent: "bg-purple-100 text-purple-700",
  Developer: "bg-orange-100 text-orange-700",
  Professional: "bg-blue-100 text-blue-700",
  "Finishing Company": "bg-pink-100 text-pink-700",
  "Shop Owner": "bg-green-100 text-green-700",
  Marketer: "bg-red-100 text-red-700",
};

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  suspended: "bg-red-100 text-red-700",
};

const ROLE_FILTERS = ["All", "Agents", "Developers", "Professionals", "Finishing Companies", "Marketers", "Shop Owners", "Common Users", "Pending"];

export default function FranchiseAreaUsers() {
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [verifiedFilter, setVerifiedFilter] = useState("All");
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingUser, setVerifyingUser] = useState(null);
  const [verifyChecklist, setVerifyChecklist] = useState({
    id: false, license: false, inPerson: false, background: false, contact: false, photo: false,
  });

  const filteredUsers = USERS_DATA.filter(u => {
    const roleMatch = selectedRole === "All" || u.role.includes(selectedRole.slice(0, -1));
    const searchMatch = searchQuery === "" || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone.includes(searchQuery) || u.email.includes(searchQuery);
    const statusMatch = statusFilter === "All" || u.status === statusFilter.toLowerCase();
    const verifyMatch = verifiedFilter === "All" || (verifiedFilter === "Verified" ? u.verified : !u.verified);
    return roleMatch && searchMatch && statusMatch && verifyMatch;
  });

  const roleCounts = {
    All: USERS_DATA.length,
    Agents: USERS_DATA.filter(u => u.role === "Agent").length,
    Developers: USERS_DATA.filter(u => u.role === "Developer").length,
    Professionals: USERS_DATA.filter(u => u.role === "Professional").length,
    "Finishing Companies": USERS_DATA.filter(u => u.role === "Finishing Company").length,
    Marketers: 0,
    "Shop Owners": USERS_DATA.filter(u => u.role === "Shop Owner").length,
    "Common Users": 0,
    Pending: USERS_DATA.filter(u => u.status === "pending").length,
  };

  const statCards = [
    { label: "All Users", value: USERS_DATA.length, trend: "+12 this month" },
    { label: "Owners/Buyers", value: 234, trend: "+23 this month" },
    { label: "Agents", value: roleCounts.Agents, trend: "+5 this month" },
    { label: "Developers", value: roleCounts.Developers, trend: "+2 this month" },
    { label: "Professionals", value: roleCounts.Professionals, trend: "+8 this month" },
    { label: "Finishing Cos", value: roleCounts["Finishing Companies"], trend: "+3 this month" },
    { label: "Kemetro Sellers", value: roleCounts["Shop Owners"], trend: "+4 this month" },
  ];

  const handleSelectUser = (id) => {
    setSelectedUsers(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleSelectAll = () => {
    setSelectedUsers(selectedUsers.length === filteredUsers.length ? [] : filteredUsers.map(u => u.id));
  };

  const startVerify = (user) => {
    setVerifyingUser(user);
    setShowVerifyModal(true);
    setVerifyChecklist({ id: false, license: false, inPerson: false, background: false, contact: false, photo: false });
  };

  const completeVerify = () => {
    console.log("User verified:", verifyingUser);
    setShowVerifyModal(false);
    setVerifyingUser(null);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <p className="text-xs text-gray-500 mb-1">Dashboard {">"} My Area {">"} Users</p>
        <h1 className="text-3xl font-black text-gray-900">Users in My Area</h1>
      </div>

      {/* Stats Row */}
      <div className="flex gap-3 overflow-x-auto no-scrollbar pb-2">
        {statCards.map((stat, i) => (
          <div key={i} className="flex-shrink-0 bg-white rounded-2xl shadow-sm p-4 border border-gray-100 min-w-max">
            <p className="text-sm font-black text-gray-900">{stat.value}</p>
            <p className="text-xs text-gray-600">{stat.label}</p>
            <p className="text-xs text-green-600 font-bold mt-1">{stat.trend}</p>
          </div>
        ))}
      </div>

      {/* Role Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
        {ROLE_FILTERS.map(role => (
          <button key={role} onClick={() => setSelectedRole(role)}
            className={`flex-shrink-0 px-4 py-2 rounded-full font-bold text-xs transition-all border-b-2 ${
              selectedRole === role
                ? "bg-orange-50 text-orange-600 border-orange-600"
                : "bg-gray-100 text-gray-700 border-transparent hover:bg-gray-200"
            }`}
          >
            {role} ({roleCounts[role] || 0})
          </button>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by name, phone, email..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 cursor-pointer"
          >
            <option>All Status</option>
            <option>Active</option>
            <option>Pending</option>
            <option>Suspended</option>
          </select>
          <select value={verifiedFilter} onChange={e => setVerifiedFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 cursor-pointer"
          >
            <option>All Verified</option>
            <option>Verified</option>
            <option>Unverified</option>
          </select>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold">
            <Filter size={14} /> Filter
          </button>
          <button onClick={() => { setSearchQuery(""); setStatusFilter("All"); setVerifiedFilter("All"); }}
            className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold"
          >
            <RotateCcw size={14} /> Reset
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 text-xs font-bold ml-auto">
            <Download size={14} /> Export
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-green-200 text-green-700 hover:bg-green-50 text-xs font-bold">
            <MessageCircle size={14} /> Bulk WhatsApp
          </button>
          <button className="flex items-center gap-2 px-3 py-2 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 text-xs font-bold">
            <Mail size={14} /> Bulk Email
          </button>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedUsers.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
          <p className="font-bold text-gray-900 text-sm">{selectedUsers.length} users selected</p>
          <div className="flex gap-2 ml-auto">
            <button className="px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700">✅ Activate</button>
            <button className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-bold hover:bg-green-600">💬 WhatsApp</button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700">📧 Email</button>
            <button className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-bold hover:bg-blue-600">📱 SMS</button>
            <button className="px-3 py-1.5 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700">🏆 Verify</button>
            <button className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold hover:bg-red-700">❌ Suspend</button>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left"><input type="checkbox" checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                  onChange={handleSelectAll} className="rounded w-4 h-4" /></th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Name & Role</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Phone</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Email</th>
                <th className="px-4 py-3 text-center font-bold text-gray-900">Properties</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Verified</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Joined</th>
                <th className="px-4 py-3 text-left font-bold text-gray-900">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredUsers.map(user => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3"><input type="checkbox" checked={selectedUsers.includes(user.id)} onChange={() => handleSelectUser(user.id)} className="rounded w-4 h-4" /></td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 cursor-pointer" onClick={() => setSelectedUser(user)}>
                      <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-xs flex-shrink-0">
                        {user.avatar}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1 ${ROLE_COLORS[user.role]}`}>{user.role}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{user.phone}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{user.email}</td>
                  <td className="px-4 py-3 text-center font-bold">{user.properties}</td>
                  <td className="px-4 py-3">
                    <span className={`inline-block text-[10px] font-bold px-2 py-1 rounded ${STATUS_COLORS[user.status]}`}>
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    {user.verified ? <Check size={18} className="text-green-600" /> : <AlertCircle size={18} className="text-yellow-500" />}
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{user.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => setSelectedUser(user)} className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                        <Eye size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                        <Edit size={16} />
                      </button>
                      <button className="p-1.5 hover:bg-gray-100 rounded text-gray-600">
                        <MoreVertical size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Panel */}
      {selectedUser && (
        <div className="fixed right-0 top-0 bottom-0 w-[420px] bg-white shadow-2xl border-l border-gray-200 z-40 overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white border-b border-gray-100 p-5 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-black text-xl">
                  {selectedUser.avatar}
                </div>
                <div>
                  <p className="text-xl font-black text-gray-900">{selectedUser.name}</p>
                  <span className={`inline-block text-xs font-bold px-2 py-0.5 rounded mt-1 ${ROLE_COLORS[selectedUser.role]}`}>{selectedUser.role}</span>
                </div>
              </div>
              <button className="text-sm font-bold text-orange-600 hover:underline">View Full Profile →</button>
            </div>
            <button onClick={() => setSelectedUser(null)} className="text-gray-400 text-2xl">×</button>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-100 flex">
            {["Info", "Properties", "Activity", "CRM"].map(tab => (
              <button key={tab} className={`flex-1 py-3 font-bold text-xs border-b-2 ${tab === "Info" ? "text-orange-600 border-orange-600" : "text-gray-600 border-transparent"}`}>
                {tab}
              </button>
            ))}
          </div>

          {/* Info Tab */}
          <div className="p-5 space-y-5">
            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-3">Contact Information</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Phone</p>
                  <p className="font-bold text-gray-900">{selectedUser.phone}</p>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Email</p>
                  <p className="font-bold text-gray-900 truncate">{selectedUser.email}</p>
                </div>
              </div>
            </div>

            <div>
              <p className="text-xs font-bold text-gray-500 uppercase mb-3">Account Status</p>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500 mb-1">Status</p>
                  <span className={`inline-block text-xs font-bold px-2 py-1 rounded ${STATUS_COLORS[selectedUser.status]}`}>
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </span>
                </div>
                <div>
                  <p className="text-gray-500 mb-1">Verification</p>
                  {selectedUser.verified ? (
                    <span className="text-xs font-bold text-green-600">✓ Verified</span>
                  ) : (
                    <button onClick={() => startVerify(selectedUser)} className="text-xs font-bold text-orange-600 hover:underline">
                      Verify →
                    </button>
                  )}
                </div>
              </div>
            </div>

            {!selectedUser.verified && (
              <button onClick={() => startVerify(selectedUser)} className="w-full bg-orange-600 text-white font-bold py-2.5 rounded-lg hover:bg-orange-700 text-sm">
                ✅ Verify User
              </button>
            )}
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && verifyingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-black text-gray-900 mb-4">Verify User</h2>
            <div className="bg-gray-50 rounded-xl p-4 mb-4">
              <p className="font-bold text-gray-900">{verifyingUser.name}</p>
              <p className="text-sm text-gray-500">{verifyingUser.role} • {verifyingUser.city}</p>
            </div>

            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Verification Checklist</p>
            <div className="space-y-2 mb-5">
              {[
                { key: "id", label: "Valid ID document uploaded" },
                { key: "license", label: "Professional license (if applicable)" },
                { key: "inPerson", label: "In-person verification done" },
                { key: "background", label: "Background check cleared" },
                { key: "contact", label: "Contact verified" },
                { key: "photo", label: "Profile photo added" },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 p-2 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input type="checkbox" checked={verifyChecklist[item.key]} onChange={e => setVerifyChecklist({...verifyChecklist, [item.key]: e.target.checked})} className="w-4 h-4 rounded" />
                  <span className="text-sm text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowVerifyModal(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-2.5 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={completeVerify} disabled={!Object.values(verifyChecklist).every(v => v)} className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700 disabled:opacity-50">
                ✅ Grant Verification
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}