import { useState, useRef } from "react";
import { Eye, Edit, CheckCircle, XCircle, Trash2, Download, Upload, MessageCircle, Phone, Mail, Shield, ChevronDown } from "lucide-react";
import { useLocation } from "react-router-dom";

const ROLES = ["All", "Common Users", "Agents", "Agencies", "Developers", "Franchise Owners", "Admins"];
const STATUS_COLORS = { Active: "bg-green-100 text-green-700", Suspended: "bg-red-100 text-red-700", Pending: "bg-yellow-100 text-yellow-700" };
const ROLE_COLORS = { "Agent": "bg-orange-100 text-orange-700", "Agency": "bg-blue-100 text-blue-700", "Developer": "bg-purple-100 text-purple-700", "Franchise Owner": "bg-teal-100 text-teal-700", "Admin": "bg-red-100 text-red-700", "User": "bg-gray-100 text-gray-600" };

const MOCK_USERS = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: ["Ahmed Hassan", "Fatima Mohamed", "Omar Rashid", "Sara Khaled", "Mohamed Nasser", "Nour Adel", "Karim Samir", "Layla Ahmed", "Youssef Ali", "Rana Tarek"][i % 10],
  email: `user${i + 1}@email.com`,
  phone: `+20 1${String(i).padStart(9, "0")}`,
  role: ["User", "Agent", "Agency", "Developer", "Franchise Owner", "Admin"][i % 6],
  country: ["Egypt", "UAE", "Saudi Arabia", "Kuwait"][i % 4],
  properties: [0, 3, 12, 7, 45, 2][i % 6],
  projects: [0, 0, 1, 3, 8, 0][i % 6],
  subscription: ["Free", "Basic", "Pro", "Business"][i % 4],
  status: ["Active", "Active", "Active", "Pending", "Suspended"][i % 5],
  verified: i % 3 === 0,
  joined: `2024-0${(i % 9) + 1}-${String((i % 28) + 1).padStart(2, "0")}`,
  avatar: ["AH", "FM", "OR", "SK", "MN", "NA", "KS", "LA", "YA", "RT"][i % 10],
}));

const ROUTE_ROLE_MAP = {
  "/admin/users/agents": "Agent",
  "/admin/users/agencies": "Agency",
  "/admin/users/developers": "Developer",
  "/admin/users/franchise-owners": "Franchise Owner",
  "/admin/users/common": "User",
  "/admin/users/admins": "Admin",
};

const AVATARS_BG = ["bg-orange-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-teal-500", "bg-red-500"];

export default function AdminUsers({ filterStatus }) {
  const { pathname } = useLocation();
  const routeRole = ROUTE_ROLE_MAP[pathname];
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState(routeRole || "All");
  const [statusFilter, setStatusFilter] = useState(filterStatus || "All");
  const [selected, setSelected] = useState([]);
  const fileInputRef = useRef(null);
  const [uploadMsg, setUploadMsg] = useState("");

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.match(/\.(xlsx?|csv)$/i)) {
      setUploadMsg("Please upload an Excel (.xls, .xlsx) or CSV file");
      setTimeout(() => setUploadMsg(""), 3000);
      return;
    }

    setUploadMsg(`Uploading ${file.name}...`);
    setTimeout(() => {
      setUploadMsg(`✓ Successfully imported users from ${file.name}`);
      setTimeout(() => setUploadMsg(""), 3000);
    }, 1500);
    e.target.value = "";
  };

  const filtered = MOCK_USERS.filter(u => {
    const matchRole = roleFilter === "All" || u.role === roleFilter || (roleFilter === "Common Users" && u.role === "User");
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchRole && matchStatus && matchSearch;
  });

  const toggleSelect = (id) => setSelected(s => s.includes(id) ? s.filter(x => x !== id) : [...s, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(u => u.id));

  const pageTitle = routeRole ? `${routeRole}s` : filterStatus === "Pending" ? "Pending Users" : filterStatus === "Verified" ? "Verified Users" : "All Users";

  return (
    <div className="space-y-5">
      {uploadMsg && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-sm font-semibold text-blue-700">
          {uploadMsg}
        </div>
      )}

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">{pageTitle}</h1>
          <p className="text-gray-500 text-sm">{filtered.length} users</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 bg-blue-500 hover:bg-blue-600 text-white font-bold px-3 py-2 rounded-lg text-xs transition-colors"
          >
            <Upload size={13} /> Upload Users
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileUpload}
            className="hidden"
          />
          <button className="flex items-center gap-1.5 border border-gray-200 text-gray-600 hover:bg-gray-50 font-bold px-3 py-2 rounded-lg text-xs transition-colors">
            <Download size={13} /> Export CSV
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <input
          type="text"
          placeholder="Search name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 w-56"
        />
        {!routeRole && (
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        )}
        <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          {["All", "Active", "Pending", "Suspended"].map(s => <option key={s}>{s}</option>)}
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option>All Countries</option>
          <option>Egypt</option>
          <option>UAE</option>
          <option>Saudi Arabia</option>
        </select>
        <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer">
          <option>All Subscriptions</option>
          <option>Free</option>
          <option>Basic</option>
          <option>Pro</option>
          <option>Business</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selected.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap">
          <span className="text-sm font-bold text-orange-700">{selected.length} selected</span>
          <button className="text-xs bg-green-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors">Approve Selected</button>
          <button className="text-xs bg-red-500 text-white font-bold px-3 py-1.5 rounded-lg hover:bg-red-600 transition-colors">Suspend Selected</button>
          <button className="text-xs border border-gray-300 text-gray-700 font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">Change Role</button>
          <button className="text-xs border border-gray-300 text-gray-700 font-bold px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors">Export CSV</button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left w-10">
                  <input type="checkbox" onChange={toggleAll} checked={selected.length === filtered.length && filtered.length > 0} className="accent-orange-500" />
                </th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">User</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Country</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Properties</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Projects</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Plan</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Verified</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Joined</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${i % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3">
                    <input type="checkbox" checked={selected.includes(u.id)} onChange={() => toggleSelect(u.id)} className="accent-orange-500" />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${AVATARS_BG[u.id % AVATARS_BG.length]} text-white font-bold text-xs flex items-center justify-center flex-shrink-0`}>{u.avatar}</div>
                      <span className="font-semibold text-gray-800 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${ROLE_COLORS[u.role] || "bg-gray-100 text-gray-600"}`}>{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{u.country}</td>
                  <td className="px-4 py-3">
                    {u.properties > 0
                      ? <span className="bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full text-xs">{u.properties}</span>
                      : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    {u.projects > 0
                      ? <span className="bg-purple-100 text-purple-700 font-bold px-2 py-0.5 rounded-full text-xs">{u.projects}</span>
                      : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-600">{u.subscription}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[u.status]}`}>{u.status}</span>
                  </td>
                  <td className="px-4 py-3">
                    {u.verified
                      ? <span className="flex items-center gap-1 text-green-600 text-xs font-bold"><CheckCircle size={12} /> Yes</span>
                      : <span className="text-gray-400 text-xs">No</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{u.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title="View" className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Eye size={12} /></button>
                      <button title="Edit Role" className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center"><Edit size={12} /></button>
                      <button title="Verify" className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center"><Shield size={12} /></button>
                      <button title="Suspend" className="w-7 h-7 rounded-lg hover:bg-yellow-50 text-yellow-600 flex items-center justify-center"><XCircle size={12} /></button>
                      <button title="Delete" className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><Trash2 size={12} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}