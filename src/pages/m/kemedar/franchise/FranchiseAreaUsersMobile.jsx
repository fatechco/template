import { useState } from 'react';
import { ChevronLeft, Search, Settings, MoreVertical, Check, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const USERS_DATA = [
  { id: 1, name: "Ahmed Hassan", role: "Agent", phone: "+201234567890", properties: 12, verified: true, city: "Cairo", avatar: "AH" },
  { id: 2, name: "Sara Mohamed", role: "Developer", phone: "+201234567891", properties: 8, verified: true, city: "Giza", avatar: "SM" },
  { id: 3, name: "Karim Ali", role: "Professional", phone: "+201234567892", properties: 0, verified: false, city: "Cairo", avatar: "KA" },
  { id: 4, name: "Fatima Khalil", role: "Finishing Company", phone: "+201234567893", properties: 5, verified: false, city: "New Cairo", avatar: "FK" },
  { id: 5, name: "Hassan Ibrahim", role: "Agent", phone: "+201234567894", properties: 15, verified: true, city: "Cairo", avatar: "HI" },
  { id: 6, name: "Leila Ahmed", role: "Shop Owner", phone: "+201234567895", properties: 0, verified: true, city: "Maadi", avatar: "LA" },
];

const ROLE_COLORS = {
  Agent: "bg-purple-100 text-purple-700",
  Developer: "bg-orange-100 text-orange-700",
  Professional: "bg-blue-100 text-blue-700",
  "Finishing Company": "bg-pink-100 text-pink-700",
  "Shop Owner": "bg-green-100 text-green-700",
};

const STATS_CHIPS = [
  { label: "All", count: 6 },
  { label: "Agents", count: 2 },
  { label: "Developers", count: 1 },
  { label: "Professionals", count: 2 },
  { label: "Sellers", count: 1 },
];

export default function FranchiseAreaUsersMobile() {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showActionMenu, setShowActionMenu] = useState(null);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyingUser, setVerifyingUser] = useState(null);
  const [verifyChecklist, setVerifyChecklist] = useState({
    id: false, license: false, inPerson: false, background: false, contact: false, photo: false,
  });

  const filteredUsers = USERS_DATA.filter(u => {
    const roleMatch = selectedRole === "All" || u.role.toLowerCase().includes(selectedRole.toLowerCase());
    const searchMatch = searchQuery === "" || u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.phone.includes(searchQuery);
    return roleMatch && searchMatch;
  });

  const startVerify = (user) => {
    setVerifyingUser(user);
    setShowVerifyModal(true);
    setShowActionMenu(null);
  };

  const completeVerify = () => {
    console.log("User verified:", verifyingUser);
    setShowVerifyModal(false);
    setVerifyingUser(null);
  };

  return (
    <div className="min-h-full bg-gray-50 pb-24 max-w-[480px] mx-auto">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="p-1.5">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-base font-black text-gray-900">Area Users</h1>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Search size={20} className="text-gray-900" />
        </button>
      </div>

      {/* Stats Chips */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-100 px-4 py-3 flex gap-2 overflow-x-auto no-scrollbar">
        {STATS_CHIPS.map((chip, i) => (
          <button key={i} className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
            selectedRole === chip.label
              ? "bg-orange-100 text-orange-700"
              : "bg-gray-100 text-gray-700"
          }`}
            onClick={() => setSelectedRole(chip.label)}
          >
            {chip.label} ({chip.count})
          </button>
        ))}
      </div>

      {/* Search + Filter */}
      <div className="sticky top-28 z-20 bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search users..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
              className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
          <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50">
            <Settings size={16} className="text-gray-600" />
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="sticky top-44 z-20 bg-white border-b border-gray-100 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {["All", "Agents", "Developers", "Professionals", "Sellers", "Pending"].map(role => (
          <button key={role} onClick={() => setSelectedRole(role)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap ${
              selectedRole === role
                ? "bg-orange-600 text-white"
                : "bg-gray-100 text-gray-700"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* User Cards */}
      <div className="px-4 py-4 space-y-3">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-start gap-3">
            <div className="relative">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-700 font-bold text-sm flex-shrink-0">
                {user.avatar}
              </div>
              <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white ${user.verified ? "bg-green-500" : "bg-yellow-400"}`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <p className="font-bold text-gray-900 truncate">{user.name}</p>
                {user.verified && <Check size={14} className="text-green-600 flex-shrink-0" />}
              </div>
              <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mb-2 ${ROLE_COLORS[user.role]}`}>
                {user.role}
              </span>
              <p className="text-xs text-gray-500">📍 {user.city}</p>
              <p className="text-xs text-gray-500">📱 {user.phone}</p>
              <p className="text-xs text-blue-600 font-bold mt-1">Properties: {user.properties}</p>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              {!user.verified && (
                <button onClick={() => startVerify(user)} className="bg-orange-100 text-orange-700 px-2.5 py-1 rounded-lg text-xs font-bold hover:bg-orange-200">
                  ✅ Verify
                </button>
              )}
              <button onClick={() => setShowActionMenu(showActionMenu === user.id ? null : user.id)} className="p-1.5 hover:bg-gray-100 rounded">
                <MoreVertical size={16} className="text-gray-600" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Action Menu Bottom Sheet */}
      {showActionMenu !== null && (
        <div className="fixed inset-0 z-40">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowActionMenu(null)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 space-y-2">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-bold text-gray-900 flex items-center gap-3">
              👁 View Profile
            </button>
            <button onClick={() => { const user = USERS_DATA.find(u => u.id === showActionMenu); startVerify(user); }}
              className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-bold text-gray-900 flex items-center gap-3"
            >
              ✅ Verify User
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-bold text-gray-900 flex items-center gap-3">
              💬 WhatsApp
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-bold text-gray-900 flex items-center gap-3">
              📧 Email
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-bold text-gray-900 flex items-center gap-3">
              📱 SMS
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-gray-50 rounded-lg font-bold text-gray-900 flex items-center gap-3">
              ✏️ Edit
            </button>
            <button className="w-full text-left px-4 py-3 hover:bg-red-50 rounded-lg font-bold text-red-600 flex items-center gap-3">
              ⛔ Suspend
            </button>
          </div>
        </div>
      )}

      {/* Verify Modal */}
      {showVerifyModal && verifyingUser && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-5 max-h-[80vh] overflow-y-auto">
            <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mb-4" />
            <h2 className="text-xl font-black text-gray-900 mb-4">Verify User</h2>
            <div className="bg-gray-50 rounded-xl p-4 mb-5">
              <p className="font-bold text-gray-900">{verifyingUser.name}</p>
              <p className="text-xs text-gray-500 mt-1">{verifyingUser.role} • {verifyingUser.city}</p>
            </div>

            <p className="text-xs font-bold text-gray-500 uppercase mb-3">Verification Checklist</p>
            <div className="space-y-2 mb-5">
              {[
                { key: "id", label: "Valid ID document uploaded" },
                { key: "license", label: "Professional license" },
                { key: "inPerson", label: "In-person verification done" },
                { key: "background", label: "Background check cleared" },
                { key: "contact", label: "Contact verified" },
                { key: "photo", label: "Profile photo added" },
              ].map(item => (
                <label key={item.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer">
                  <input type="checkbox" checked={verifyChecklist[item.key]} onChange={e => setVerifyChecklist({...verifyChecklist, [item.key]: e.target.checked})} className="w-4 h-4" />
                  <span className="text-xs text-gray-700">{item.label}</span>
                </label>
              ))}
            </div>

            <div className="flex gap-2">
              <button onClick={() => setShowVerifyModal(false)} className="flex-1 border border-gray-200 text-gray-900 font-bold py-3 rounded-lg">
                Cancel
              </button>
              <button onClick={completeVerify} disabled={!Object.values(verifyChecklist).every(v => v)} className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg disabled:opacity-50">
                ✅ Verify
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAB */}
      <button className="fixed bottom-24 right-4 w-14 h-14 bg-orange-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-lg hover:bg-orange-700">
        ➕
      </button>
    </div>
  );
}