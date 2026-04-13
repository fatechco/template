import { useState } from "react";
import { CheckCircle, XCircle, Mail, Eye, Trash2, Search } from "lucide-react";

const STATUS_COLORS = {
  "Pending": "bg-yellow-100 text-yellow-700",
  "In Review": "bg-blue-100 text-blue-700",
  "Verified": "bg-green-100 text-green-700",
  "Rejected": "bg-red-100 text-red-700",
};

const MOCK_PENDING_VERIFICATION = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: ["Ahmed Hassan", "Fatima Mohamed", "Omar Rashid", "Sara Khaled", "Mohamed Nasser", "Nour Adel", "Karim Samir", "Layla Ahmed"][i % 8],
  email: `user${i + 1}@email.com`,
  phone: `+20 1${String(i).padStart(9, "0")}`,
  role: ["Agent", "Agency", "Developer", "Franchise Owner"][i % 4],
  country: ["Egypt", "UAE", "Saudi Arabia"][i % 3],
  documents: i % 3 !== 0,
  submittedDate: `2026-03-${String((i % 20) + 1).padStart(2, "0")}`,
  status: ["Pending", "In Review", "Verified"][i % 3],
  verified: i % 5 === 0,
}));

const AVATARS_BG = ["bg-orange-500", "bg-blue-500", "bg-green-500", "bg-purple-500", "bg-teal-500", "bg-red-500"];

export default function AdminPendingVerification() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = MOCK_PENDING_VERIFICATION.filter(u => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "All" || u.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const verifiedCount = MOCK_PENDING_VERIFICATION.filter(u => u.status === "Verified").length;

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-black text-gray-900">Pending Verification Users</h1>
          <p className="text-gray-500 text-sm">{filtered.length} users • {verifiedCount} verified</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search name or email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-orange-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none cursor-pointer"
        >
          {["All", "Pending", "In Review", "Verified", "Rejected"].map(s => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4">
          <p className="text-xs font-bold text-yellow-600 uppercase tracking-wide">Pending</p>
          <p className="text-2xl font-black text-yellow-700 mt-1">
            {MOCK_PENDING_VERIFICATION.filter(u => u.status === "Pending").length}
          </p>
        </div>
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wide">In Review</p>
          <p className="text-2xl font-black text-blue-700 mt-1">
            {MOCK_PENDING_VERIFICATION.filter(u => u.status === "In Review").length}
          </p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-xs font-bold text-green-600 uppercase tracking-wide">Verified</p>
          <p className="text-2xl font-black text-green-700 mt-1">{verifiedCount}</p>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="px-4 py-3 text-left font-bold text-gray-700">User</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Email</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Role</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Country</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Documents</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Submitted</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Status</th>
                <th className="px-4 py-3 text-left font-bold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, idx) => (
                <tr key={u.id} className={`border-b border-gray-50 hover:bg-gray-50/50 ${idx % 2 === 1 ? "bg-gray-50/30" : ""}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-8 h-8 rounded-full ${AVATARS_BG[u.id % AVATARS_BG.length]} text-white font-bold text-xs flex items-center justify-center flex-shrink-0`}>
                        {u.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-semibold text-gray-800 text-sm">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700">{u.role}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{u.country}</td>
                  <td className="px-4 py-3">
                    {u.documents
                      ? <span className="text-xs text-green-600 font-bold">✅ Uploaded</span>
                      : <span className="text-xs text-red-500 font-bold">❌ Missing</span>}
                  </td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{u.submittedDate}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[u.status]}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title="View Details" className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center">
                        <Eye size={13} />
                      </button>
                      <button title="Verify" className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center">
                        <CheckCircle size={13} />
                      </button>
                      <button title="Send Email" className="w-7 h-7 rounded-lg hover:bg-purple-50 text-purple-600 flex items-center justify-center">
                        <Mail size={13} />
                      </button>
                      <button title="Reject" className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center">
                        <XCircle size={13} />
                      </button>
                      <button title="Delete" className="w-7 h-7 rounded-lg hover:bg-gray-100 text-gray-600 flex items-center justify-center">
                        <Trash2 size={13} />
                      </button>
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