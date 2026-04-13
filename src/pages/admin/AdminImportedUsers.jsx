import { useState } from "react";
import { Trash2, Mail, Eye, CheckCircle, AlertCircle, Download, Search, Filter, UserCheck } from "lucide-react";

const ROLE_TABS = ["All", "Common Users", "Agents", "Agencies", "Developers", "Professionals"];

const ROLE_COLORS = {
  "Common User": "bg-gray-100 text-gray-700",
  "Agent": "bg-teal-100 text-teal-700",
  "Agency": "bg-blue-100 text-blue-700",
  "Developer": "bg-purple-100 text-purple-700",
  "Professional": "bg-orange-100 text-orange-700",
};

const MOCK_IMPORTED = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: ["Ahmed Hassan", "Sara Mohamed", "Karim Ali", "Layla Nour", "Omar Khalid", "Noor Hassan", "Mohamed Samir", "Rana Adel"][i % 8],
  email: `user${i + 1}@imported.com`,
  phone: `+20 1${String(i).padStart(9, "0")}`,
  company: ["Elite Realty", "Property Finders", "Gulf Properties", "Desert Realty", "Cairo Homes", "Nile Realty", "Sky Properties", "Golden Gate"][i % 8],
  role: ["Common User", "Agent", "Agency", "Developer", "Professional"][i % 5],
  source: ["Aqarmap", "OLX", "Property Finder", "Bayut"][i % 4],
  jobId: `JOB-00${(i % 3) + 1}`,
  category: ["Apartment", "Villa", "Land"][i % 3],
  importDate: `2026-03-${String((i % 20) + 1).padStart(2, "0")}`,
  status: ["Imported", "Pending Activation", "Active"][i % 3],
  activatedAt: i % 3 === 2 ? `2026-03-${String((i % 20) + 1).padStart(2, "0")}` : null,
  propertiesCount: [0, 3, 7, 12, 1, 5, 0, 2, 18, 4][i % 10],
  projectsCount: [0, 0, 1, 3, 0, 2, 0, 0, 5, 1][i % 10],
}));

const STATUS_COLORS = {
  "Imported": "bg-blue-100 text-blue-700",
  "Pending Activation": "bg-yellow-100 text-yellow-700",
  "Active": "bg-green-100 text-green-700",
};

export default function AdminImportedUsers() {
  const [roleTab, setRoleTab] = useState("All");
  const [search, setSearch] = useState("");
  const [filterSource, setFilterSource] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedIds, setSelectedIds] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const SOURCES = ["All", "Aqarmap", "OLX", "Property Finder", "Bayut"];
  const STATUSES = ["All", "Imported", "Pending Activation", "Active"];

  const ROLE_MAP = {
    "All": null, "Common Users": "Common User", "Agents": "Agent",
    "Agencies": "Agency", "Developers": "Developer", "Professionals": "Professional",
  };

  const filtered = MOCK_IMPORTED.filter(u => {
    const roleMatch = ROLE_MAP[roleTab] === null || u.role === ROLE_MAP[roleTab];
    const searchMatch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search) || u.email.includes(search);
    const sourceMatch = filterSource === "All" || u.source === filterSource;
    const statusMatch = filterStatus === "All" || u.status === filterStatus;
    return roleMatch && searchMatch && sourceMatch && statusMatch;
  });

  const toggleAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(u => u.id));
  const toggleOne = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const bulkAction = (action) => {
    setSuccessMsg(`${action} applied to ${selectedIds.length} user(s)`);
    setSelectedIds([]);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const roleCounts = ROLE_TABS.reduce((acc, tab) => {
    const roleKey = ROLE_MAP[tab];
    acc[tab] = roleKey ? MOCK_IMPORTED.filter(u => u.role === roleKey).length : MOCK_IMPORTED.length;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Imported Users</h1>
          <p className="text-gray-500 text-sm">Users imported via scraping jobs from external sources</p>
        </div>
        <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 font-bold px-3 py-2 rounded-lg text-xs hover:bg-gray-50">
          <Download size={13} /> Export CSV
        </button>
      </div>

      {successMsg && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
          <CheckCircle size={16} className="text-green-600" />
          <p className="text-sm font-semibold text-green-700">{successMsg}</p>
        </div>
      )}

      {/* Role Tabs */}
      <div className="flex gap-0 border-b border-gray-200 bg-white rounded-t-xl px-4 overflow-x-auto">
        {ROLE_TABS.map(tab => (
          <button key={tab} onClick={() => { setRoleTab(tab); setSelectedIds([]); }}
            className={`px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
              roleTab === tab ? "text-blue-600 border-blue-600" : "text-gray-500 border-transparent hover:text-gray-800"
            }`}>
            {tab}
            <span className="ml-1.5 bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{roleCounts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name, phone, email..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-blue-400" />
        </div>
        <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400">
          {SOURCES.map(s => <option key={s}>{s === "All" ? "All Sources" : s}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-blue-400">
          {STATUSES.map(s => <option key={s}>{s === "All" ? "All Statuses" : s}</option>)}
        </select>
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} users</span>
      </div>

      {/* Bulk Actions */}
      {selectedIds.length > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between flex-wrap gap-3">
          <span className="text-sm font-bold text-blue-700">{selectedIds.length} selected</span>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => bulkAction("Activated")} className="flex items-center gap-1 bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-600">
              <UserCheck size={12} /> Activate
            </button>
            <button onClick={() => bulkAction("Email sent")} className="flex items-center gap-1 bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-600">
              <Mail size={12} /> Send Activation Email
            </button>
            <button onClick={() => bulkAction("Deleted")} className="flex items-center gap-1 bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600">
              <Trash2 size={12} /> Delete
            </button>
            <button onClick={() => setSelectedIds([])} className="text-xs text-gray-500 font-bold px-2">Clear</button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left w-8">
                  <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="accent-blue-500" />
                </th>
                {["Name", "Phone", "Email", "Role", "Source", "Job", "Properties", "Projects", "Import Date", "Status", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(user => (
                <tr key={user.id} className={`hover:bg-gray-50 ${selectedIds.includes(user.id) ? "bg-blue-50/40" : ""}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selectedIds.includes(user.id)} onChange={() => toggleOne(user.id)} className="accent-blue-500" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gray-200 text-gray-600 font-bold text-[10px] flex items-center justify-center flex-shrink-0">
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-[10px] text-gray-400">{user.company}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 font-mono">{user.phone}</td>
                  <td className="px-4 py-3 text-gray-500">{user.email}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-600"}`}>{user.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{user.source}</td>
                  <td className="px-4 py-3">
                    <span className="bg-gray-100 text-gray-600 font-mono font-bold px-2 py-0.5 rounded-full">{user.jobId}</span>
                  </td>
                  <td className="px-4 py-3">
                    {user.propertiesCount > 0
                      ? <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">{user.propertiesCount}</span>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {user.projectsCount > 0
                      ? <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full">{user.projectsCount}</span>
                      : <span className="text-gray-300">—</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400">{user.importDate}</td>
                  <td className="px-4 py-3">
                    <span className={`font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[user.status]}`}>{user.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center" title="Activate now">
                        <UserCheck size={13} />
                      </button>
                      <button className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center" title="View profile">
                        <Eye size={13} />
                      </button>
                      <button className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center" title="Delete">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={12} className="px-4 py-12 text-center text-gray-400">
                  <p className="text-2xl mb-2">👤</p>
                  <p className="font-bold">No imported users match this filter</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="text-xs text-gray-400">Total: {filtered.length} of {MOCK_IMPORTED.length} imported users</p>
    </div>
  );
}