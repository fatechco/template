import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, Search } from "lucide-react";

const USERS = [
  { id: 1, name: "Ahmed Hassan", role: "Agent", phone: "+201234567890", verified: true, status: "active" },
  { id: 2, name: "Sara Mohamed", role: "Developer", phone: "+201234567891", verified: true, status: "active" },
  { id: 3, name: "Karim Ali", role: "Professional", phone: "+201234567892", verified: false, status: "active" },
  { id: 4, name: "Fatima Khalil", role: "Finishing Company", phone: "+201234567893", verified: false, status: "pending" },
  { id: 5, name: "Hassan Ibrahim", role: "Agent", phone: "+201234567894", verified: true, status: "active" },
  { id: 6, name: "Leila Ahmed", role: "Seller", phone: "+201234567895", verified: true, status: "active" },
];

const ROLE_FILTERS = ["All", "Agents", "Developers", "Professionals", "Finishing Companies", "Sellers", "Common"];

const ROLE_BADGES = {
  Agent: "bg-purple-100 text-purple-700",
  Developer: "bg-orange-100 text-orange-700",
  Professional: "bg-blue-100 text-blue-700",
  "Finishing Company": "bg-pink-100 text-pink-700",
  Seller: "bg-green-100 text-green-700",
  Common: "bg-gray-100 text-gray-700",
};

export default function FranchiseOwnerAreaUsers() {
  const navigate = useNavigate();
  const [activeRole, setActiveRole] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [verifyUser, setVerifyUser] = useState(null);
  const [documents, setDocuments] = useState({
    idVerified: false,
    businessLicense: false,
    bankStatement: false,
  });

  const filteredUsers = USERS.filter(user => {
    const matchesRole = activeRole === "All" || user.role === activeRole.slice(0, -1);
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.phone.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  const handleVerify = () => {
    console.log("User verified:", verifyUser);
    setVerifyUser(null);
    setDocuments({ idVerified: false, businessLicense: false, bankStatement: false });
  };

  return (
    <div className="min-h-full bg-gray-50">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3" style={{ height: 56 }}>
        <button onClick={() => navigate(-1)} className="p-1.5 hover:bg-gray-100 rounded-lg">
          <ChevronLeft size={22} className="text-gray-900" />
        </button>
        <h1 className="text-lg font-black text-gray-900 flex-1">Area Users</h1>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Search size={22} className="text-gray-900" />
        </button>
      </div>

      {/* Role Filters */}
      <div className="sticky top-14 z-20 bg-white border-b border-gray-200 px-4 py-2 flex gap-2 overflow-x-auto no-scrollbar">
        {ROLE_FILTERS.map(role => (
          <button
            key={role}
            onClick={() => setActiveRole(role)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${
              activeRole === role
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {role}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="sticky top-28 z-20 bg-white px-4 py-3 border-b border-gray-200">
        <input
          type="text"
          placeholder="Search by name, phone..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
        />
      </div>

      {/* User Cards */}
      <div className="px-4 py-4 pb-24 space-y-2">
        {filteredUsers.map(user => (
          <div key={user.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-3">
            {/* Avatar */}
            <div className="w-12 h-12 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center text-xl flex-shrink-0">
              👤
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-bold text-sm text-gray-900 truncate">{user.name}</p>
                {user.verified && <span className="text-xs">✅</span>}
              </div>
              <p className={`text-[10px] font-bold px-2 py-0.5 rounded inline-block mt-1 ${ROLE_BADGES[user.role]}`}>
                {user.role}
              </p>
              <p className="text-xs text-gray-500 mt-1">{user.phone}</p>
            </div>

            {/* Status */}
            <div className="flex-shrink-0 flex flex-col gap-2">
              <span className={`text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap ${
                user.status === "active"
                  ? "bg-green-100 text-green-700"
                  : "bg-yellow-100 text-yellow-700"
              }`}>
                {user.status === "active" ? "Active" : "Pending"}
              </span>
              {!user.verified && (
                <button
                  onClick={() => setVerifyUser(user)}
                  className="text-blue-600 text-xs font-bold hover:underline"
                >
                  Verify
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Verify User Modal */}
      {verifyUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-end">
          <div className="w-full bg-white rounded-t-3xl p-4 max-h-[80vh] overflow-y-auto">
            <div className="mb-4">
              <h2 className="text-lg font-black text-gray-900">Verify User</h2>
              <p className="text-sm text-gray-600 mt-1">{verifyUser.name}</p>
            </div>

            {/* User Info */}
            <div className="bg-gray-50 rounded-xl p-3 mb-4 space-y-2">
              <p className="text-sm text-gray-700"><strong>Name:</strong> {verifyUser.name}</p>
              <p className="text-sm text-gray-700"><strong>Role:</strong> {verifyUser.role}</p>
              <p className="text-sm text-gray-700"><strong>Phone:</strong> {verifyUser.phone}</p>
            </div>

            {/* Documents Checklist */}
            <div className="mb-6">
              <p className="text-xs font-black text-gray-900 mb-3">Required Documents</p>
              <div className="space-y-2">
                {[
                  { key: "idVerified", label: "ID Verification" },
                  { key: "businessLicense", label: "Business License" },
                  { key: "bankStatement", label: "Bank Statement" },
                ].map(doc => (
                  <label key={doc.key} className="flex items-center gap-3 p-2.5 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="checkbox"
                      checked={documents[doc.key]}
                      onChange={(e) => setDocuments({ ...documents, [doc.key]: e.target.checked })}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span className="text-sm text-gray-700">{doc.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 pb-4">
              <button
                onClick={() => setVerifyUser(null)}
                className="flex-1 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700"
              >
                ✅ Verify User
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}