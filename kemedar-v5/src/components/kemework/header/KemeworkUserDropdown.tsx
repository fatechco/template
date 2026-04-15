// @ts-nocheck
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

const MENU_ITEMS = [
  { icon: "👤", label: "My Profile", path: "/kemework/profile" },
  { icon: "🔍", label: "Find Task", path: "/kemework/tasks" },
  { icon: "👥", label: "Following Clients", path: "/kemework/following" },
  { icon: "📦", label: "My Packages", path: "/kemework/my-packages" },
  { icon: "🏅", label: "Be Accredited by Kemedar", path: "/kemework/accreditation" },
  { icon: "⚙️", label: "Settings", path: "/kemework/settings" },
  { icon: "📋", label: "Request History", path: "/kemework/history" },
];

export default function KemeworkUserDropdown({ user, onClose }) {
  const initials = user?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  const handleSignOut = () => {
    /* TODO: logout */;
    onClose();
  };

  return (
    <div
      className="absolute top-full right-0 z-50 bg-white rounded-xl shadow-2xl border border-gray-100 py-2 min-w-[220px]"
      style={{ marginTop: 6 }}
    >
      {/* Profile header */}
      <div className="px-4 py-3 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold" style={{ background: "#C41230" }}>
            {initials}
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">{user?.full_name}</p>
            <p className="text-xs text-gray-500 truncate max-w-[150px]">{user?.email}</p>
          </div>
        </div>
      </div>

      {/* Menu items */}
      <div className="py-1">
        {MENU_ITEMS.map(item => (
          <Link
            key={item.path}
            href={item.path}
            onClick={onClose}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-red-50 hover:text-[#C41230] transition-colors"
          >
            <span className="text-base w-5 text-center">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </div>

      {/* Sign out */}
      <div className="border-t border-gray-100 pt-1 px-2">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center gap-3 px-2 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
        >
          <span className="text-base w-5 text-center">🚪</span>
          Sign Out
        </button>
      </div>
    </div>
  );
}