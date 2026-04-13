import { useState } from "react";
import { CheckCircle, XCircle, Info, MessageCircle, Phone, Mail, ChevronDown, ChevronUp, AlertCircle, Trash2, UserCheck, Download, Search } from "lucide-react";

const STATUS_COLORS = {
  "Pending": "bg-yellow-100 text-yellow-700",
  "Contacted": "bg-blue-100 text-blue-700",
  "Interested": "bg-purple-100 text-purple-700",
  "Rejected": "bg-red-100 text-red-700",
  "Active": "bg-green-100 text-green-700",
};

const ROLE_TABS = ["All", "Common Users", "Agents", "Agencies", "Developers", "Professionals"];
const ROLE_MAP = {
  "All": null, "Common Users": "Common User", "Agents": "Agent",
  "Agencies": "Agency", "Developers": "Developer", "Professionals": "Professional",
};

const SOURCE_TABS = ["All", "Scraped / Imported", "Self-Registered"];

const MOCK_PENDING = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: ["Ahmed Hassan", "Fatima Mohamed", "Omar Rashid", "Sara Khaled", "Mohamed Nasser", "Nour Adel", "Karim Samir", "Rania Bassem"][i % 8],
  email: `pending${i + 1}@email.com`,
  phone: `+20 1${String(i).padStart(9, "0")}`,
  company: ["Elite Realty", "Property Finders", "Gulf Homes", "Desert Realty", "Cairo Properties"][i % 5],
  role: ["Common User", "Agent", "Agency", "Developer", "Professional"][i % 5],
  reason: ["Missing license", "Incomplete profile", "Pending document review", "Awaiting verification call", "Imported — awaiting activation"][i % 5],
  documents: [true, false, true, true, false][i % 5],
  date: `2026-03-${String((i % 18) + 1).padStart(2, "0")}`,
  status: "Pending",
  origin: i % 3 === 0 ? "self_registered" : "scraped",
  source: i % 3 === 0 ? null : ["Aqarmap", "OLX", "Property Finder", "Bayut"][i % 4],
  jobId: i % 3 === 0 ? null : `JOB-00${(i % 3) + 1}`,
  contacted: { whatsapp: false, email: false, sms: false, phone: false },
  notes: "",
  followUp: "",
  propertiesCount: [0, 3, 7, 12, 1, 5, 0, 2, 18, 4][i % 10],
  projectsCount: [0, 0, 1, 3, 0, 2, 0, 0, 5, 1][i % 10],
}));

const AVATARS_BG = ["bg-orange-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-teal-500", "bg-red-500"];

function ContactRow({ user, isSelected, onSelect }) {
  const [expanded, setExpanded] = useState(false);
  const [contacted, setContacted] = useState(user.contacted);
  const [notes, setNotes] = useState(user.notes || "");
  const [followUp, setFollowUp] = useState(user.followUp || "");
  const [status, setStatus] = useState(user.status);

  const toggleChannel = (ch) => setContacted(prev => ({ ...prev, [ch]: !prev[ch] }));

  return (
    <>
      <tr className={`border-b border-gray-50 hover:bg-gray-50/50 ${isSelected ? "bg-yellow-50" : ""}`}>
        <td className="px-4 py-3">
          <input type="checkbox" checked={isSelected} onChange={() => onSelect(user.id)} className="w-4 h-4 accent-yellow-600" />
        </td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full ${AVATARS_BG[user.id % AVATARS_BG.length]} text-white font-bold text-xs flex items-center justify-center flex-shrink-0`}>
              {user.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="font-semibold text-gray-800 text-sm">{user.name}</p>
              {user.origin === "scraped" && (
                <span className="text-[9px] bg-blue-100 text-blue-600 font-bold px-1.5 py-0.5 rounded-full">
                  📥 {user.source} · {user.jobId}
                </span>
              )}
            </div>
          </div>
        </td>
        <td className="px-4 py-3 text-gray-500 text-xs">{user.email}</td>
        <td className="px-4 py-3 text-gray-500 text-xs font-mono">{user.phone}</td>
        <td className="px-4 py-3 text-xs font-bold text-gray-700">{user.role}</td>
        <td className="px-4 py-3 text-xs text-gray-600 max-w-[160px] truncate">{user.reason}</td>
        <td className="px-4 py-3">
          {user.documents ? <span className="text-xs text-green-600 font-bold">✅</span> : <span className="text-xs text-red-500 font-bold">❌</span>}
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
        <td className="px-4 py-3">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[status]}`}>{status}</span>
        </td>
        <td className="px-4 py-3 text-gray-400 text-xs">{user.date}</td>
        <td className="px-4 py-3">
          <div className="flex items-center gap-1">
            <button className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center" title="Approve"><CheckCircle size={13} /></button>
            <button className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center" title="Request Info"><Info size={13} /></button>
            <button className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center" title="Reject"><XCircle size={13} /></button>
            <button onClick={() => setExpanded(!expanded)} className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center">
              {expanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
            </button>
          </div>
        </td>
      </tr>

      {/* Expanded mini-CRM row */}
      {expanded && (
        <tr className="bg-blue-50/20">
          <td colSpan={12} className="px-6 py-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Contact Channels */}
              <div>
                <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Contact Channels Used</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: "whatsapp", label: "WhatsApp", icon: MessageCircle, color: "text-green-600" },
                    { key: "email", label: "Email", icon: Mail, color: "text-blue-600" },
                    { key: "sms", label: "SMS", icon: MessageCircle, color: "text-purple-600" },
                    { key: "phone", label: "Phone", icon: Phone, color: "text-orange-600" },
                  ].map(({ key, label, icon: Icon, color }) => (
                    <label key={key} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 bg-white cursor-pointer hover:border-orange-300 transition-colors">
                      <input type="checkbox" checked={contacted[key]} onChange={() => toggleChannel(key)} className="accent-orange-500" />
                      <Icon size={13} className={color} />
                      <span className="text-xs font-semibold text-gray-700">{label}</span>
                    </label>
                  ))}
                </div>
                {user.origin === "scraped" && (
                  <div className="mt-3 bg-white border border-blue-200 rounded-lg p-3">
                    <p className="text-[10px] font-bold text-blue-700 mb-1">🔐 Default Credentials (scraped user):</p>
                    <p className="text-[10px] text-gray-600">Username: <span className="font-mono font-bold">{user.phone}</span></p>
                    <p className="text-[10px] text-gray-600">Temp password: <span className="font-mono font-bold">last 6 digits</span></p>
                  </div>
                )}
              </div>
              {/* Notes */}
              <div>
                <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Notes / Discussion Log</p>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Log what was discussed..."
                  rows={4} className="w-full text-xs border border-gray-200 rounded-lg p-2.5 resize-none focus:outline-none focus:border-orange-400" />
                <div className="mt-2">
                  <p className="text-xs font-bold text-gray-500 mb-1">Follow-up Date</p>
                  <input type="date" value={followUp} onChange={e => setFollowUp(e.target.value)}
                    className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-2 focus:outline-none focus:border-orange-400" />
                </div>
              </div>
              {/* Status + Actions */}
              <div>
                <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Update Status</p>
                <select value={status} onChange={e => setStatus(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 mb-3">
                  <option>Pending</option>
                  <option>Contacted</option>
                  <option>Interested</option>
                  <option>Active</option>
                  <option>Rejected</option>
                </select>
                <button className="w-full bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold py-2.5 rounded-lg transition-colors mb-2">
                  Save & Move to Next
                </button>
                <div className="flex gap-2">
                  <button className="flex-1 bg-green-500 hover:bg-green-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1">
                    <UserCheck size={12} /> Activate
                  </button>
                  <button className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-bold py-2 rounded-lg flex items-center justify-center gap-1">
                    <XCircle size={12} /> Reject
                  </button>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}

export default function AdminPendingUsers() {
  const [roleTab, setRoleTab] = useState("All");
  const [sourceTab, setSourceTab] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState([]);
  const [successMsg, setSuccessMsg] = useState("");

  const filtered = MOCK_PENDING.filter(u => {
    const roleMatch = ROLE_MAP[roleTab] === null || u.role === ROLE_MAP[roleTab];
    const sourceMatch = sourceTab === "All" || (sourceTab === "Scraped / Imported" ? u.origin === "scraped" : u.origin === "self_registered");
    const searchMatch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.phone.includes(search);
    return roleMatch && sourceMatch && searchMatch;
  });

  const contacted = filtered.filter(u => u.status !== "Pending").length;

  const toggleAll = () => setSelectedIds(selectedIds.length === filtered.length ? [] : filtered.map(u => u.id));
  const toggleOne = (id) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  const bulkAction = (action) => {
    setSuccessMsg(`${action} applied to ${selectedIds.length} user(s)`);
    setSelectedIds([]);
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  const roleCounts = ROLE_TABS.reduce((acc, tab) => {
    const rk = ROLE_MAP[tab];
    acc[tab] = rk ? MOCK_PENDING.filter(u => u.role === rk).length : MOCK_PENDING.length;
    return acc;
  }, {});

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Pending Users</h1>
          <p className="text-gray-500 text-sm">{filtered.length} users awaiting approval or activation</p>
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

      {/* Source filter */}
      <div className="flex gap-2">
        {SOURCE_TABS.map(tab => (
          <button key={tab} onClick={() => setSourceTab(tab)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${
              sourceTab === tab ? "bg-orange-500 text-white border-orange-500" : "bg-white text-gray-600 border-gray-200 hover:border-orange-300"
            }`}>
            {tab}
          </button>
        ))}
      </div>

      {/* Role Tabs */}
      <div className="flex gap-0 border-b border-gray-200 bg-white rounded-t-xl px-4 overflow-x-auto">
        {ROLE_TABS.map(tab => (
          <button key={tab} onClick={() => { setRoleTab(tab); setSelectedIds([]); }}
            className={`px-4 py-3 text-xs font-bold transition-colors whitespace-nowrap border-b-2 ${
              roleTab === tab ? "text-orange-600 border-orange-600" : "text-gray-500 border-transparent hover:text-gray-800"
            }`}>
            {tab}
            <span className="ml-1.5 bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded-full">{roleCounts[tab]}</span>
          </button>
        ))}
      </div>

      {/* Search + progress */}
      <div className="flex gap-3 items-center flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search name or phone..."
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-xs focus:outline-none focus:border-orange-400" />
        </div>
        <div className="flex-1 min-w-[200px] bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
          <div className="flex justify-between mb-1.5">
            <p className="text-xs font-bold text-gray-600">Contact Progress</p>
            <p className="text-xs font-bold text-orange-500">{contacted}/{filtered.length} contacted</p>
          </div>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-orange-500 rounded-full transition-all"
              style={{ width: filtered.length > 0 ? `${(contacted / filtered.length) * 100}%` : "0%" }} />
          </div>
        </div>
      </div>

      {/* Bulk actions */}
      {selectedIds.length > 0 && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-3 flex items-center justify-between flex-wrap gap-3">
          <span className="text-sm font-bold text-yellow-700">{selectedIds.length} selected</span>
          <div className="flex gap-2 flex-wrap">
            <button onClick={() => bulkAction("Activated")} className="bg-green-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 flex items-center gap-1">
              <UserCheck size={12} /> Activate All
            </button>
            <button onClick={() => bulkAction("Email sent")} className="bg-blue-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-blue-600 flex items-center gap-1">
              <Mail size={12} /> Send SMS/Email
            </button>
            <button onClick={() => bulkAction("Deleted")} className="bg-red-500 text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 flex items-center gap-1">
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
                  <input type="checkbox" checked={selectedIds.length === filtered.length && filtered.length > 0} onChange={toggleAll} className="w-4 h-4 accent-yellow-600" />
                </th>
                {["User", "Email", "Phone", "Role", "Pending Reason", "Docs", "Properties", "Projects", "Status", "Date", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-600 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => <ContactRow key={u.id} user={u} isSelected={selectedIds.includes(u.id)} onSelect={toggleOne} />)}
              {filtered.length === 0 && (
                <tr><td colSpan={12} className="px-4 py-12 text-center text-gray-400">
                  <p className="text-2xl mb-2">✅</p>
                  <p className="font-bold">No pending users in this filter</p>
                </td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}