import { useState } from "react";
import { Edit, X, Check, Shield } from "lucide-react";

const ALL_PERMISSIONS = [
  { key: "list_properties", label: "List Properties" },
  { key: "add_projects", label: "Add Projects" },
  { key: "buyer_organizer", label: "Access Buyer Organizer" },
  { key: "seller_organizer", label: "Access Seller Organizer" },
  { key: "manage_team", label: "Manage Team (Agency)" },
  { key: "access_crm", label: "Access CRM" },
  { key: "view_analytics", label: "View Analytics" },
  { key: "manage_franchise", label: "Manage Franchise Area" },
  { key: "access_admin", label: "Access Admin Panel" },
  { key: "manage_users", label: "Manage Users" },
  { key: "manage_properties", label: "Manage Properties" },
  { key: "manage_marketing", label: "Manage Marketing" },
  { key: "manage_locations", label: "Manage Locations" },
  { key: "import_data", label: "Import Data" },
  { key: "send_notifications", label: "Send Notifications" },
];

const INITIAL_ROLES = [
  {
    id: 1, name: "admin", display: "Admin", users: 5,
    permissions: ALL_PERMISSIONS.map((p) => p.key),
  },
  {
    id: 2, name: "agent", display: "Agent", users: 342,
    permissions: ["list_properties", "buyer_organizer", "seller_organizer", "access_crm", "view_analytics"],
  },
  {
    id: 3, name: "agency", display: "Agency", users: 87,
    permissions: ["list_properties", "add_projects", "buyer_organizer", "seller_organizer", "manage_team", "access_crm", "view_analytics"],
  },
  {
    id: 4, name: "developer", display: "Developer", users: 64,
    permissions: ["list_properties", "add_projects", "seller_organizer", "view_analytics"],
  },
  {
    id: 5, name: "franchise_owner", display: "Franchise Owner Area", users: 23,
    permissions: ["manage_franchise", "access_crm", "view_analytics", "manage_users", "manage_properties", "manage_marketing"],
  },
  {
    id: 6, name: "user", display: "Regular User", users: 1820,
    permissions: ["buyer_organizer"],
  },
];

const PERM_COLORS = [
  "bg-blue-100 text-blue-700", "bg-purple-100 text-purple-700", "bg-green-100 text-green-700",
  "bg-orange-100 text-orange-700", "bg-teal-100 text-teal-700", "bg-red-100 text-red-700",
];

function EditModal({ role, onClose }) {
  const [perms, setPerms] = useState(new Set(role.permissions));

  const toggle = (key) => setPerms((prev) => {
    const next = new Set(prev);
    next.has(key) ? next.delete(key) : next.add(key);
    return next;
  });

  return (
    <>
      <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-black text-gray-900">Edit Role: {role.display}</h3>
              <p className="text-xs text-gray-400">{role.users} users with this role</p>
            </div>
            <button onClick={onClose}><X size={18} className="text-gray-400" /></button>
          </div>
          <div>
            <p className="text-xs font-bold text-gray-500 mb-3 uppercase tracking-wide">Permissions</p>
            <div className="grid grid-cols-1 gap-2">
              {ALL_PERMISSIONS.map(({ key, label }) => (
                <label key={key} className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${perms.has(key) ? "border-orange-400 bg-orange-50" : "border-gray-100 hover:border-gray-200"}`}>
                  <input type="checkbox" checked={perms.has(key)} onChange={() => toggle(key)} className="accent-orange-500 w-4 h-4" />
                  <span className="text-sm font-semibold text-gray-700">{label}</span>
                  {perms.has(key) && <Check size={14} className="text-orange-500 ml-auto" />}
                </label>
              ))}
            </div>
          </div>
          <button onClick={onClose} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition-colors">
            Save Permissions
          </button>
        </div>
      </div>
    </>
  );
}

export default function AdminRoles() {
  const [roles] = useState(INITIAL_ROLES);
  const [editing, setEditing] = useState(null);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-black text-gray-900">User Roles & Permissions</h1>
        <p className="text-gray-500 text-sm">Manage what each role can access and do</p>
      </div>

      <div className="space-y-4">
        {roles.map((role, ri) => (
          <div key={role.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Shield size={18} className="text-white" />
                </div>
                <div>
                  <p className="font-black text-gray-900">{role.display}</p>
                  <p className="text-xs text-gray-400">{role.users.toLocaleString()} users · <span className="font-mono text-gray-500">{role.name}</span></p>
                </div>
              </div>
              <button onClick={() => setEditing(role)} className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold px-4 py-2 rounded-lg text-sm transition-colors">
                <Edit size={13} /> Edit Permissions
              </button>
            </div>
            <div className="mt-4 flex flex-wrap gap-1.5">
              {role.permissions.map((pk, i) => {
                const perm = ALL_PERMISSIONS.find((p) => p.key === pk);
                return perm ? (
                  <span key={pk} className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PERM_COLORS[i % PERM_COLORS.length]}`}>
                    {perm.label}
                  </span>
                ) : null;
              })}
            </div>
          </div>
        ))}
      </div>

      {editing && <EditModal role={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}