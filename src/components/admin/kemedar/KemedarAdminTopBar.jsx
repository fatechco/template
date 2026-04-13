import { Menu, Search, Bell, MessageCircle, LogOut, User } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { useState } from "react";

export default function KemedarAdminTopBar({ onToggleSidebar }) {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
      {/* Left */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="p-1 hover:bg-gray-100 rounded-lg lg:hidden"
        >
          <Menu size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-white font-black text-sm">K</span>
          </div>
          <span className="font-black text-gray-900 text-base hidden sm:block">
            Kemedar Admin
          </span>
        </div>
      </div>

      {/* Center - Breadcrumb */}
      <div className="hidden md:flex text-gray-600 text-sm">
        <span>Admin</span>
        <span className="mx-2">/</span>
        <span>Kemedar</span>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Dashboard</span>
      </div>

      {/* Right */}
      <div className="flex items-center gap-4">
        <button className="p-1.5 hover:bg-gray-100 rounded-lg">
          <Search size={18} className="text-gray-600" />
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg relative">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <button className="p-1.5 hover:bg-gray-100 rounded-lg relative">
          <MessageCircle size={18} className="text-gray-600" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User Menu */}
        <div className="relative">
          <button
            onClick={() => setShowUserMenu(!showUserMenu)}
            className="flex items-center gap-2 pl-2 pr-1 py-1.5 hover:bg-gray-100 rounded-lg"
          >
            <div className="w-7 h-7 rounded-full bg-orange-500 text-white font-bold text-xs flex items-center justify-center">
              {initials}
            </div>
            <span className="text-sm font-medium text-gray-900 hidden sm:block">
              {user?.full_name}
            </span>
          </button>

          {showUserMenu && (
            <div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-lg shadow-lg z-50 w-48">
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2">
                <User size={16} /> My Profile
              </button>
              <button className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 border-t border-gray-100">
                Back to Site
              </button>
              <button
                onClick={() => logout()}
                className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 border-t border-gray-100 flex items-center gap-2"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}