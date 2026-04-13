import { useState, useEffect } from "react";
import { Search, CheckCircle } from "lucide-react";
import { base44 } from "@/api/base44Client";

const ROLE_COLORS = {
  agent: "bg-blue-100 text-blue-700",
  agency: "bg-indigo-100 text-indigo-700",
  developer: "bg-purple-100 text-purple-700",
  user: "bg-gray-100 text-gray-600",
  franchise_owner: "bg-red-100 text-red-700",
  professional: "bg-teal-100 text-teal-700",
};

const avatarBg = ["bg-orange-500","bg-blue-500","bg-teal-500","bg-purple-500","bg-red-500"];
const colorFor = (id) => avatarBg[(id?.charCodeAt(0) || 0) % avatarBg.length];
const initials = (name) => (name || "?").split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

export default function SOStepSelectBuyer({ selectedBuyer, onSelect }) {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (search.length < 2) { setUsers([]); return; }
    setLoading(true);
    base44.entities.User.list().then(all => {
      const q = search.toLowerCase();
      setUsers(all.filter(u =>
        (u.full_name || "").toLowerCase().includes(q) ||
        (u.email || "").toLowerCase().includes(q)
      ).slice(0, 10));
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [search]);

  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-500">Search for the user who is purchasing this service.</p>
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or email…"
          className="w-full pl-9 pr-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
          autoFocus
        />
      </div>

      {loading && <p className="text-xs text-gray-400 text-center py-4">Searching…</p>}
      {!loading && search.length >= 2 && users.length === 0 && (
        <p className="text-xs text-gray-400 text-center py-4">No users found</p>
      )}
      {users.length > 0 && (
        <div className="border border-gray-200 rounded-xl overflow-hidden divide-y divide-gray-100">
          {users.map(user => {
            const isSelected = selectedBuyer?.id === user.id;
            return (
              <button key={user.id} onClick={() => onSelect(user)}
                className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left ${isSelected ? "bg-orange-50" : ""}`}>
                <div className={`w-9 h-9 rounded-full ${colorFor(user.id)} text-white text-xs font-black flex items-center justify-center flex-shrink-0`}>
                  {initials(user.full_name)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{user.full_name}</p>
                  <p className="text-xs text-gray-400 truncate">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ROLE_COLORS[user.role] || "bg-gray-100 text-gray-600"}`}>
                    {user.role}
                  </span>
                  {isSelected && <CheckCircle size={14} className="text-orange-500" />}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {selectedBuyer && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
          <p className="text-[10px] font-black text-orange-600 uppercase mb-2">✅ Selected Buyer</p>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full ${colorFor(selectedBuyer.id)} text-white text-sm font-black flex items-center justify-center flex-shrink-0`}>
              {initials(selectedBuyer.full_name)}
            </div>
            <div>
              <p className="font-black text-gray-900">{selectedBuyer.full_name}</p>
              <p className="text-xs text-gray-500">{selectedBuyer.email}</p>
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${ROLE_COLORS[selectedBuyer.role] || "bg-gray-100 text-gray-600"}`}>
                {selectedBuyer.role}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}