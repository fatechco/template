import { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, X, LogOut, HelpCircle, ChevronDown, ChevronRight } from 'lucide-react';
import { useAuth } from '@/lib/AuthContext';

function NavItem({ item, isActive }) {
  const location = useLocation();
  const hasActiveChild = item.children?.some(c => !c.heading && c.to && location.pathname.startsWith(c.to));
  const [open, setOpen] = useState(hasActiveChild);
  const Icon = item.icon;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
            ${hasActiveChild ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
        >
          <Icon size={17} className="flex-shrink-0" />
          <span className="flex-1 text-left truncate">{item.label}</span>
          {open ? <ChevronDown size={13} className="opacity-40" /> : <ChevronRight size={13} className="opacity-40" />}
        </button>
        {open && (
          <div className="ml-4 pl-3 border-l border-gray-200 mt-0.5 space-y-0.5">
            {item.children.map((child, ci) => {
              if (child.heading) {
                return <p key={`h-${ci}`} className="px-3 pt-3 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400">{child.heading}</p>;
              }
              const ChildIcon = child.icon;
              const active = child.to && location.pathname === child.to;
              return (
                <Link
                  key={child.to}
                  to={child.to}
                  className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
                    ${active ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'}`}
                >
                  <ChildIcon size={14} className="flex-shrink-0" />
                  <span className="truncate">{child.label}</span>
                </Link>
              );
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
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
        ${active ? 'bg-orange-50 text-orange-600' : 'text-gray-600 hover:bg-gray-100'}`}
    >
      <Icon size={17} className="flex-shrink-0" />
      <span className="truncate">{item.label}</span>
    </Link>
  );
}

export default function RoleDashboardShell({ menuItems, badgeLabel, badgeColor = 'bg-gray-500', logoText, logoImg }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();

  const initials = user?.full_name
    ? user.full_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    : 'U';

  const isActive = (to) => to && (pathname === to || (to !== '/' && pathname.startsWith(to)));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? 'w-64' : 'w-16'} bg-white border-r border-gray-200 transition-all duration-300 overflow-y-auto flex flex-col flex-shrink-0`}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
          {sidebarOpen && (
            logoImg
              ? <img src={logoImg} alt={logoText || 'Logo'} className="h-8 object-contain" />
              : <span className="text-lg font-black text-gray-900">{logoText}</span>
          )}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-1 hover:bg-gray-100 rounded-lg flex-shrink-0">
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* User Card */}
        {sidebarOpen && (
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">{user?.full_name || 'User'}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email || ''}</p>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className={`text-xs font-bold text-white px-2.5 py-1 rounded-full ${badgeColor}`}>{badgeLabel}</span>
              <Link to="/dashboard/profile" className="text-xs text-gray-400 hover:text-gray-700">Edit Profile →</Link>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
          {menuItems.map((item, idx) => (
            <NavItem key={idx} item={item} isActive={isActive} />
          ))}
        </nav>

        {/* Bottom */}
        {sidebarOpen && (
          <div className="border-t border-gray-100 p-3 space-y-1">
            <Link
              to="/dashboard/tickets"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all"
            >
              <HelpCircle size={17} />
              <span>Help & Support</span>
            </Link>
            <button
              onClick={logout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
            >
              <LogOut size={17} />
              <span>Logout</span>
            </button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}