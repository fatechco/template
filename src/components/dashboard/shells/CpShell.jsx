import { useState } from "react";
import { Outlet, useLocation, Link } from "react-router-dom";
import {
  ChevronDown, ChevronRight, LogOut, X, Menu
} from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

function SubItem({ item, isActive }) {
  const ChildIcon = item.icon;
  const active = isActive(item.to);
  return (
    <Link
      to={item.to}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
        ${active ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
    >
      <ChildIcon size={14} className="flex-shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

function NavItem({ item, isActive }) {
  const location = useLocation();
  const hasActiveChild = item.children?.some(
    c => !c.heading && c.to && (location.pathname === c.to || location.pathname.startsWith(c.to))
  );
  const [open, setOpen] = useState(hasActiveChild);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-4
            ${hasActiveChild
              ? "bg-orange-50 text-orange-600 border-orange-500"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"}`}
        >
          <Icon size={17} className="flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {open ? <ChevronDown size={13} className="opacity-40" /> : <ChevronRight size={13} className="opacity-40" />}
        </button>
        {open && (
          <div className="ml-4 pl-3 border-l border-gray-200 mt-0.5 space-y-0.5">
            {item.children.map((child, ci) => {
              if (child.heading) {
                return (
                  <p key={`h-${ci}`} className="px-3 pt-3 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {child.heading}
                  </p>
                );
              }
              return <SubItem key={child.to} item={child} isActive={isActive} />;
            })}
          </div>
        )}
      </div>
    );
  }

  const active = isActive(item.to);
  return (
    <Link
      to={item.to}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-4
        ${active
          ? "bg-orange-50 text-orange-600 border-orange-500"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"}`}
    >
      <Icon size={17} className="flex-shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

export default function CpShell({ menuItems, badgeLabel, badgeColor = "bg-gray-500", profileTo }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const isActive = (to) => to && (pathname === to || (to !== "/" && pathname.startsWith(to + "/")));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-[260px]" : "w-0 overflow-hidden"} flex-shrink-0 bg-white border-r border-gray-200 flex flex-col transition-all duration-300`}>
        {/* User Card */}
        <div className="px-5 py-5 border-b border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-gray-100 border-2 border-gray-200 flex items-center justify-center text-gray-700 font-bold text-base flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-gray-900 text-sm leading-tight truncate">{user?.full_name || "User"}</p>
              <p className="text-gray-400 text-xs truncate">{user?.email || ""}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${badgeColor}`}>{badgeLabel}</span>
            <Link to={profileTo} className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Edit Profile →</Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {menuItems.map((item, idx) => (
            <NavItem key={idx} item={item} isActive={isActive} />
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-100 px-3 py-3 space-y-1">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Sidebar toggle button (collapsed state) */}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="fixed top-4 left-4 z-50 bg-white border border-gray-200 rounded-lg p-2 shadow-sm"
        >
          <Menu size={18} className="text-gray-700" />
        </button>
      )}

      {/* Collapse button inside sidebar */}
      {sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(false)}
          className="absolute top-4 left-[228px] z-50 bg-white border border-gray-200 rounded-full p-1 shadow-sm hidden lg:flex items-center justify-center"
        >
          <X size={14} className="text-gray-500" />
        </button>
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}