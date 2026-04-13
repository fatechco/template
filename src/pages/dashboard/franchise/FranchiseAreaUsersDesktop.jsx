import { useState } from 'react';
import { Search, Shield, AlertCircle } from 'lucide-react';

const USERS = [
  { id: 1, name: "Ahmed Hassan", role: "Agent", phone: "+201234567890", verified: true, status: "active", joinDate: "2024-01-15" },
  { id: 2, name: "Sara Mohamed", role: "Developer", phone: "+201234567891", verified: true, status: "active", joinDate: "2024-02-20" },
  { id: 3, name: "Karim Ali", role: "Professional", phone: "+201234567892", verified: false, status: "active", joinDate: "2024-03-10" },
  { id: 4, name: "Fatima Khalil", role: "Finishing Company", phone: "+201234567893", verified: false, status: "pending", joinDate: "2024-03-15" },
  { id: 5, name: "Hassan Ibrahim", role: "Agent", phone: "+201234567894", verified: true, status: "active", joinDate: "2024-01-25" },
  { id: 6, name: "Leila Ahmed", role: "Seller", phone: "+201234567895", verified: true, status: "active", joinDate: "2024-02-10" },
];

const ROLE_COLORS = {
  Agent: "bg-purple-100 text-purple-700",
  Developer: "bg-orange-100 text-orange-700",
  Professional: "bg-blue-100 text-blue-700",
  "Finishing Company": "bg-pink-100 text-pink-700",
  Seller: "bg-green-100 text-green-700",
  Common: "bg-gray-100 text-gray-700",
};

const STATUS_COLORS = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
};

export default function FranchiseAreaUsersDesktop() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [verifyUser, setVerifyUser] = useState(null);
  const [documents, setDocuments] = useState({
    idVerified: false,
    businessLicense: false,
    bankStatement: false,
  });

  const roles = ["All", "Agent", "Developer", "Professional", "Finishing Company", "Seller"];

  const filteredUsers = USERS.filter(user => {
    const matchesRole = selectedRole === "All" || user.role === selectedRole;
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) || user.phone.includes(searchQuery);
    return matchesRole && matchesSearch;
  });

  const handleVerify = () => {
    console.log("User verified:", verifyUser);
    setVerifyUser(null);
    setDocuments({ idVerified: false, businessLicense: false, bankStatement: false });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-black text-gray-900">Area Users</h1>
        <p className="text-gray-500 text-sm mt-1">Manage and verify users in your area</p>
      </div>

      {/* Controls */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative flex-1 max-w-md">
          <Search size={18} className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-orange-200"
          />
        </div>

        <div className="flex gap-2 flex-wrap">
          {roles.map((role) => (
            <button
              key={role}
              onClick={() => setSelectedRole(role)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                selectedRole === role
                  ? "bg-orange-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full">
          <thead className="border-b border-gray-100 bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-700">User</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-700">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-xs font-black text-gray-700">Join Date</th>
              <th className="px-6 py-3 text-right text-xs font-black text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user) => (
              <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full flex items-center justify-center text-sm font-bold text-blue-700">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{user.name}</p>
                      {user.verified && <span className="text-xs text-green-600 font-semibold">✅ Verified</span>}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${ROLE_COLORS[user.role]}`}>
                    {user.role}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <p className="text-sm text-gray-600">{user.phone}</p>
                </td>
                <td className="px-6 py-3">
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[user.status]}`}>
                    {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <p className="text-sm text-gray-600">{new Date(user.joinDate).toLocaleDateString()}</p>
                </td>
                <td className="px-6 py-3 text-right">
                  {!user.verified && (
                    <button
                      onClick={() => setVerifyUser(user)}
                      className="text-blue-600 hover:text-blue-700 font-bold text-sm"
                    >
                      Verify
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Verify User Modal */}
      {verifyUser && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6">
            <h2 className="text-xl font-black text-gray-900 mb-4">Verify User</h2>

            {/* User Info */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-3">
              <p className="text-sm text-gray-700"><strong>Name:</strong> {verifyUser.name}</p>
              <p className="text-sm text-gray-700"><strong>Role:</strong> {verifyUser.role}</p>
              <p className="text-sm text-gray-700"><strong>Phone:</strong> {verifyUser.phone}</p>
              <p className="text-sm text-gray-700"><strong>Join Date:</strong> {new Date(verifyUser.joinDate).toLocaleDateString()}</p>
            </div>

            {/* Documents Checklist */}
            <div className="mb-6">
              <p className="text-sm font-black text-gray-900 mb-3">Required Documents</p>
              <div className="space-y-2">
                {[
                  { key: "idVerified", label: "ID Verification" },
                  { key: "businessLicense", label: "Business License" },
                  { key: "bankStatement", label: "Bank Statement" },
                ].map(doc => (
                  <label key={doc.key} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50">
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
            <div className="flex gap-3">
              <button
                onClick={() => setVerifyUser(null)}
                className="flex-1 border border-gray-300 text-gray-900 font-bold py-2.5 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleVerify}
                className="flex-1 bg-green-600 text-white font-bold py-2.5 rounded-lg hover:bg-green-700"
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