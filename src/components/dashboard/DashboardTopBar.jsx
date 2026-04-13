import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Bell, MessageCircle, Globe, ChevronDown, Search, Menu, User, Settings, RefreshCw, LogOut } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { base44 } from "@/api/base44Client";

const ROLE_COLORS = {
  admin: "bg-red-500",
  agent: "bg-orange-500",
  agency: "bg-blue-500",
  developer: "bg-purple-500",
  franchise_owner: "bg-green-500",
  user: "bg-gray-500",
};

export default function DashboardTopBar({ onToggleSidebar, breadcrumb }) {
  const { user, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const roleLabel = user?.role ? user.role.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase()) : "User";
  const roleColor = ROLE_COLORS[user?.role] || "bg-gray-500";
  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  return (
    <header className="h-16 bg-white shadow-sm border-b border-gray-100 flex items-center px-4 gap-4 z-30 sticky top-0">
      {/* Left: Toggle + Logo + Breadcrumb */}
      <button onClick={onToggleSidebar} className="text-gray-500 hover:text-gray-800 transition-colors lg:hidden">
        <Menu size={22} />
      </button>

      <Link to="/" className="flex items-center gap-2 flex-shrink-0">
        <img
          src="https://media.base44.com/images/public/69b5eafc884b1597fb3ea66e/e6e0c34bc_kemedar-Logo-ar-6000.png"
          alt="Kemedar"
          className="h-7 w-auto object-contain"
        />
      </Link>

      {breadcrumb && (
        <nav className="hidden md:flex items-center gap-1 text-sm text-gray-500">
          <span className="text-gray-300">/</span>
          {breadcrumb.map((item, i) => (
            <span key={i} className="flex items-center gap-1">
              {item.to ? (
                <Link to={item.to} className="hover:text-gray-800 transition-colors">{item.label}</Link>
              ) : (
                <span className="text-gray-800 font-medium">{item.label}</span>
              )}
              {i < breadcrumb.length - 1 && <span className="text-gray-300">/</span>}
            </span>
          ))}
        </nav>
      )}

      {/* Center: Search */}
      <div className="flex-1 max-w-lg mx-4 hidden sm:block">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search properties, projects, users..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-400 transition-colors"
          />
        </div>
      </div>

      {/* Right: Icons */}
      <div className="flex items-center gap-1 ml-auto">
        {/* Notifications */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <Bell size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">3</span>
        </button>

        {/* Messages */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <MessageCircle size={18} className="text-gray-600" />
          <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-blue-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">7</span>
        </button>

        {/* Language */}
        <button className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors">
          <Globe size={18} className="text-gray-600" />
        </button>

        {/* User Dropdown */}
        <div className="relative ml-1">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-[#1a1a2e] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-gray-800 leading-none">{user?.full_name || "User"}</p>
              <span className={`text-[10px] font-bold text-white px-1.5 py-0.5 rounded-full ${roleColor}`}>{roleLabel}</span>
            </div>
            <ChevronDown size={14} className="text-gray-500 hidden md:block" />
          </button>

          {dropdownOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setDropdownOpen(false)} />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50">
                <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <User size={15} /> My Profile
                </Link>
                <Link to="/dashboard/settings" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <Settings size={15} /> Account Settings
                </Link>
                <Link to="/dashboard/switch-role" onClick={() => setDropdownOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                  <RefreshCw size={15} /> Switch Role
                </Link>
                <div className="border-t border-gray-100 my-1" />
                <button
                  onClick={() => { setDropdownOpen(false); logout(); }}
                  className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                >
                  <LogOut size={15} /> Logout
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}