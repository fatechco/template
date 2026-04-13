import { useState } from "react";
import { Eye, Mail, CheckCircle, Flag, X } from "lucide-react";

const TABS = ["All", "Agents", "Developers", "Professionals", "Finishing Companies", "Marketers & Freelancers", "Shop Owners"];

const MOCK_USERS = Array.from({ length: 8 }, (_, i) => ({
  id: i + 1,
  avatar: ["AH", "FM", "OR", "SK", "MN", "KT", "RS", "NM"][i],
  name: ["Ahmed Hassan", "Fatima Mohamed", "Omar Rashid", "Sara Khaled", "Mohamed Nasser", "Khaled Tarek", "Rania Samir", "Nour Mohamed"][i],
  role: ["Agent", "Developer", "Professional", "Agent", "Finishing Company", "Marketer", "Shop Owner", "Developer"][i],
  phone: `+20 1${i}0 ${100 + i * 111} ${200 + i * 22}`,
  email: `user${i + 1}@email.com`,
  city: ["New Cairo", "Sheikh Zayed", "Maadi", "6th October", "Heliopolis", "Zamalek", "Nasr City", "Katameya"][i],
  listings: [12, 5, 0, 8, 3, 1, 20, 6][i],
  status: ["Active", "Active", "Pending", "Active", "Active", "Suspended", "Active", "Active"][i],
  verified: [true, false, false, true, true, false, true, false][i],
  joined: ["Jan 2024", "Mar 2024", "Feb 2026", "Jun 2023", "Nov 2023", "Aug 2025", "Apr 2024", "Dec 2023"][i],
}));

const STATUS_COLORS = { Active: "bg-green-100 text-green-700", Pending: "bg-yellow-100 text-yellow-700", Suspended: "bg-red-100 text-red-700" };

function VerifyModal({ user, onClose }) {
  const [checks, setChecks] = useState({ identity: false, license: false, contact: false, area: false });
  const [notes, setNotes] = useState("");
  const toggle = k => setChecks(c => ({ ...c, [k]: !c[k] }));

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-black text-gray-900">Verify User</h3>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="font-bold text-gray-900">{user.name}</p>
            <p className="text-sm text-gray-500">{user.role} · {user.city}</p>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Verification Checklist</p>
            {[
              { key: "identity", label: "Identity confirmed" },
              { key: "license", label: "License/credentials valid" },
              { key: "contact", label: "Contact verified" },
              { key: "area", label: "Area coverage confirmed" },
            ].map(c => (
              <label key={c.key} className="flex items-center gap-3 py-1.5 cursor-pointer">
                <input type="checkbox" checked={checks[c.key]} onChange={() => toggle(c.key)} className="w-4 h-4 accent-orange-500" />
                <span className="text-sm text-gray-700">{c.label}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 mb-1.5">Verification Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400 resize-none" />
          </div>
          <div className="flex gap-2">
            <button onClick={onClose} className="flex-1 bg-green-500 hover:bg-green-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">✅ Approve</button>
            <button onClick={onClose} className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">📋 Request Docs</button>
            <button onClick={onClose} className="flex-1 bg-red-500 hover:bg-red-600 text-white font-bold py-2.5 rounded-xl text-sm transition-colors">❌ Reject</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default function AreaUsers() {
  const [activeTab, setActiveTab] = useState("All");
  const [verifyUser, setVerifyUser] = useState(null);
  const [search, setSearch] = useState("");

  const filtered = MOCK_USERS.filter(u => {
    const matchTab = activeTab === "All" || u.role.toLowerCase().includes(activeTab.toLowerCase().replace(" companies", "").replace("s", ""));
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">👥 Users in My Area</h1>
        <p className="text-gray-500 text-sm mt-0.5">{MOCK_USERS.length} registered users in your coverage area</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 flex-wrap">
        {TABS.map(t => (
          <button key={t} onClick={() => setActiveTab(t)}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${activeTab === t ? "bg-[#1a1a2e] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {t}
          </button>
        ))}
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 bg-white rounded-xl border border-gray-100 shadow-sm p-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name, phone or email..." className="flex-1 min-w-[200px] border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
        {["Role", "Status", "Verified", "Subscription"].map(f => (
          <select key={f} className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none text-gray-600 cursor-pointer">
            <option>{f}: All</option>
          </select>
        ))}
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold px-4 py-2 rounded-lg text-sm transition-colors">Export CSV</button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {["Name", "Role", "Phone", "Email", "City", "Listings", "Status", "Verified", "Joined", "Actions"].map(h => (
                  <th key={h} className="px-4 py-3 text-left font-bold text-gray-700">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} className={`border-b border-gray-50 ${i % 2 === 0 ? "" : "bg-gray-50/30"}`}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#1a1a2e] text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{u.avatar}</div>
                      <span className="font-semibold text-gray-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{u.role}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{u.phone}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{u.email}</td>
                  <td className="px-4 py-3 text-gray-600 text-xs">{u.city}</td>
                  <td className="px-4 py-3 font-bold text-gray-900 text-center">{u.listings}</td>
                  <td className="px-4 py-3"><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLORS[u.status]}`}>{u.status}</span></td>
                  <td className="px-4 py-3 text-center">{u.verified ? <CheckCircle size={16} className="text-green-500 mx-auto" /> : <span className="text-gray-300">—</span>}</td>
                  <td className="px-4 py-3 text-gray-400 text-xs">{u.joined}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1">
                      <button title="View Profile" className="w-7 h-7 rounded-lg hover:bg-blue-50 text-blue-600 flex items-center justify-center"><Eye size={13} /></button>
                      <button title="Message" className="w-7 h-7 rounded-lg hover:bg-green-50 text-green-600 flex items-center justify-center"><Mail size={13} /></button>
                      <button title="Verify" onClick={() => setVerifyUser(u)} className="w-7 h-7 rounded-lg hover:bg-orange-50 text-orange-500 flex items-center justify-center"><CheckCircle size={13} /></button>
                      <button title="Report" className="w-7 h-7 rounded-lg hover:bg-red-50 text-red-500 flex items-center justify-center"><Flag size={13} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {verifyUser && <VerifyModal user={verifyUser} onClose={() => setVerifyUser(null)} />}
    </div>
  );
}