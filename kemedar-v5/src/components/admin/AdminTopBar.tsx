// @ts-nocheck
import { Menu, Bell, Search, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function AdminTopBar({ onToggleSidebar, breadcrumb = [] }) {
  return (
    <header className="h-14 bg-white border-b border-gray-100 flex items-center px-4 gap-3 flex-shrink-0 shadow-sm">
      <button
        onClick={onToggleSidebar}
        className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors lg:hidden"
      >
        <Menu size={18} className="text-gray-600" />
      </button>

      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm flex-1 min-w-0">
        {breadcrumb.map((crumb, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <ChevronRight size={13} className="text-gray-300" />}
            {crumb.to ? (
              <Link href={crumb.to} className="text-gray-500 hover:text-gray-800 font-medium transition-colors">{crumb.label}</Link>
            ) : (
              <span className="text-gray-800 font-bold">{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>

      {/* Search */}
      <div className="hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 w-56">
        <Search size={14} className="text-gray-400" />
        <input type="text" placeholder="Search..." className="bg-transparent text-sm text-gray-700 placeholder-gray-400 focus:outline-none flex-1" />
      </div>

      {/* Notifications */}
      <button className="relative w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
        <Bell size={16} className="text-gray-600" />
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
      </button>
    </header>
  );
}