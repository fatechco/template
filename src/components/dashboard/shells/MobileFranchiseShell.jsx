import { useState } from "react";
import { Outlet, useLocation, Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { Menu, X, User, FileText, DollarSign, HelpCircle, CreditCard, ClipboardList, BarChart3, Users, Calendar, MessageCircle, Bell, Settings, MapPin, HardHat, Plus, Star, Bookmark, ShoppingCart, LogOut, Search, Tag, Heart, GitCompare, ScanSearch, KanbanSquare, ChevronDown, ChevronRight, Store, Truck } from "lucide-react";

const MENU = [
  { label: "Dashboard", icon: BarChart3, to: "/m/cp/franchise" },
  {
    label: "🏙 Area Management", icon: MapPin, children: [
      { heading: "OVERVIEW" },
      { label: "Area Overview", icon: BarChart3, to: "/m/cp/franchise/area-overview" },
      { label: "Area Users", icon: Users, to: "/m/cp/franchise/area-users" },
      { label: "Area Properties", icon: FileText, to: "/m/cp/franchise/area-properties" },
      { label: "Area Projects", icon: MapPin, to: "/m/cp/franchise/area-projects" },
      { label: "Buy Requests", icon: ClipboardList, to: "/m/cp/franchise/area-buy-requests" },
    ]
  },
  {
    label: "🔧 Kemework", icon: HardHat, children: [
      { heading: "TASKS" },
      { label: "Kemework Tasks", icon: ClipboardList, to: "/m/cp/franchise/kemework-tasks" },
      { label: "Accredit Handyman", icon: Star, to: "/m/cp/franchise/accredit-handyman" },
      { label: "Accredited Handymen", icon: Users, to: "/m/cp/franchise/accredited-handymen" },
    ]
  },
  {
    label: "🛒 Kemetro", icon: ShoppingCart, children: [
      { heading: "SELLERS" },
      { label: "Kemetro Sellers", icon: Store, to: "/m/cp/franchise/kemetro-sellers" },
      { heading: "ORDERS" },
      { label: "All Orders", icon: ClipboardList, to: "/m/cp/franchise/orders" },
    ]
  },
  {
    label: "💼 Business", icon: DollarSign, children: [
      { heading: "SETUP" },
      { label: "Business Setup", icon: FileText, to: "/m/cp/franchise/biz/setup" },
      { label: "Files & Documents", icon: FileText, to: "/m/cp/franchise/files" },
      { heading: "SALES & CUSTOMERS" },
      { label: "Leads", icon: Users, to: "/m/cp/franchise/biz/leads" },
      { label: "Customers", icon: Users, to: "/m/cp/franchise/biz/customers" },
      { label: "Sales", icon: DollarSign, to: "/m/cp/franchise/biz/sales" },
      { heading: "FINANCIAL" },
      { label: "Expenses", icon: DollarSign, to: "/m/cp/franchise/biz/expenses" },
      { label: "Revenue", icon: DollarSign, to: "/m/cp/franchise/revenue" },
    ]
  },
  {
    label: "🤖 AI & Smart Tools", icon: Star, children: [
      { heading: "KEMEDAR AI MODULES" },
      { label: "Negotiate™ — Deal Room", icon: MessageCircle, to: "/m/cp/franchise/negotiations" },
      { label: "Escrow™", icon: CreditCard, to: "/m/cp/franchise/escrow" },
      { label: "Vision™ — Photo AI", icon: Star, to: "/m/cp/franchise/vision" },
      { label: "Kemedar Live™", icon: BarChart3, to: "/m/cp/franchise/live" },
      { heading: "BUILD & FINISH" },
      { label: "Kemetro Build™ — BOQ", icon: ShoppingCart, to: "/m/cp/franchise/build" },
      { label: "Finish™ — Renovation", icon: ClipboardList, to: "/m/cp/franchise/finish/new" },
      { label: "Flash Deals™", icon: Star, to: "/m/cp/franchise/flash" },
      { heading: "INSIGHTS" },
      { label: "Kemedar Score", icon: Star, to: "/m/cp/franchise/score" },
      { label: "My DNA Profile", icon: User, to: "/m/cp/franchise/my-dna" },
      { label: "Life Score™", icon: MapPin, to: "/m/cp/franchise/life-score" },
    ]
  },
  {
    label: "💰 Money & Orders", icon: DollarSign, children: [
      { heading: "KEMEDAR" },
      { label: "Kemedar Orders", icon: ClipboardList, to: "/m/cp/franchise/kemedar-orders" },
      { heading: "KEMETRO" },
      { label: "Kemetro Orders", icon: ShoppingCart, to: "/m/cp/franchise/kemetro-orders" },
      { heading: "PAYMENTS" },
      { label: "Wallet", icon: CreditCard, to: "/m/cp/franchise/wallet" },
      { label: "Payment Methods", icon: CreditCard, to: "/m/cp/franchise/payment-methods" },
      { label: "Withdrawals", icon: DollarSign, to: "/m/cp/franchise/withdrawals" },
      { label: "Deposits", icon: DollarSign, to: "/m/cp/franchise/deposits" },
    ]
  },
  {
    label: "🗂 Tools & Communications", icon: MessageCircle, children: [
      { heading: "COMMUNICATIONS" },
      { label: "Email", icon: MessageCircle, to: "/m/cp/franchise/email" },
      { label: "Bulk Communications", icon: MessageCircle, to: "/m/cp/franchise/bulk-comms" },
      { label: "Messages", icon: MessageCircle, to: "/m/cp/franchise/messages" },
      { label: "Notifications", icon: Bell, to: "/m/cp/franchise/notifications" },
      { heading: "ACCOUNT" },
      { label: "My Profile", icon: User, to: "/m/cp/franchise/profile" },
      { label: "Settings", icon: Settings, to: "/m/cp/franchise/settings" },
    ]
  },
  {
    label: "❓ Help", icon: HelpCircle, children: [
      { label: "Support Tickets", icon: Bell, to: "/m/cp/franchise/support" },
      { label: "Contact Kemedar", icon: MessageCircle, to: "/m/cp/franchise/contact-kemedar" },
      { label: "Knowledge Base", icon: FileText, to: "/m/cp/franchise/knowledge" },
    ]
  },
];

const BOTTOM_TABS = [
  { id: 'settings', label: 'Settings', icon: Settings, path: '/m/cp/franchise/settings' },
  { id: 'find',     label: 'Find',     icon: Search,   path: '/m/find' },
  { id: 'add',      label: 'Add',      icon: Plus,     path: '/m/add', fab: true },
  { id: 'buy',      label: 'Buy',      icon: Tag,      path: '/m/buy' },
  { id: 'account',  label: 'Account',  icon: User,     path: '/m/account' },
];

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

function NavItem({ item, isOpen, onToggle, isActive }) {
  const hasChildren = item.children && item.children.length > 0;
  const Icon = item.icon;

  if (hasChildren) {
    const hasActiveChild = item.children.some(c => !c.heading && c.to && isActive(c.to));
    
    return (
      <div>
        <button
          onClick={onToggle}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-4
            ${hasActiveChild
              ? "bg-orange-50 text-orange-600 border-orange-500"
              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"}`}
        >
          <Icon size={17} className="flex-shrink-0" />
          <span className="flex-1 text-left">{item.label}</span>
          {isOpen ? <ChevronDown size={13} className="opacity-40" /> : <ChevronRight size={13} className="opacity-40" />}
        </button>
        {isOpen && (
          <div className="ml-4 pl-3 border-l border-gray-200 mt-0.5 space-y-0.5">
            {item.children.map((child, ci) => {
              if (child.heading) {
                return <p key={`h-${ci}`} className="px-3 pt-3 pb-1 text-[9px] font-black uppercase tracking-widest text-gray-400">{child.heading}</p>;
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

export default function MobileFranchiseShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const { user, isLoadingAuth, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/dashboard" replace />;
  }

  const toggleMenu = (label) => {
    setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
  };

  const isActive = (to) => to && (pathname === to || (to !== "/m/cp/franchise" && pathname.startsWith(to)));

  const hideTopBar = pathname.includes("/knowledge/") && pathname !== "/m/cp/franchise/knowledge";

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${
          sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div
        className={`fixed left-0 top-0 bottom-0 w-72 bg-white shadow-lg z-50 transition-transform flex flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Sidebar Header */}
        <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-sm">
              {user.full_name?.charAt(0).toUpperCase() || "F"}
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm">{user.full_name}</p>
              <p className="text-xs text-gray-500">{user.email}</p>
            </div>
          </div>
          <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-gray-100 rounded">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {MENU.map((item, idx) => (
            <NavItem
              key={idx}
              item={item}
              isOpen={expandedMenus[item.label]}
              onToggle={() => toggleMenu(item.label)}
              isActive={isActive}
            />
          ))}
        </nav>

        {/* Logout */}
        <div className="border-t border-gray-100 px-3 py-3 space-y-1">
          <button
            onClick={() => {
              logout();
              setSidebarOpen(false);
            }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Bar */}
        {!hideTopBar && (
          <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <Menu size={22} className="text-gray-600" />
            </button>
            <h2 className="font-bold text-gray-900 text-sm flex-1 text-center">Franchise Owner</h2>
            <div className="w-8" />
          </div>
        )}

        {/* Content */}
        <main className="flex-1 overflow-auto pb-16">
          <Outlet />
        </main>
      </div>

      {/* ─── Mobile Bottom Nav ─── */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-end z-50"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)', minHeight: 64 }}
      >
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = pathname.startsWith(tab.path) && tab.id !== 'account';

          if (tab.fab) {
            return (
              <button
                key={tab.id}
                onClick={() => navigate(tab.path)}
                className="flex-1 flex flex-col items-center justify-end pb-2"
                style={{ minHeight: 64 }}
              >
                <div
                  className="w-14 h-14 rounded-full bg-[#FF6B00] flex items-center justify-center -mt-5"
                  style={{ boxShadow: '0 4px 20px rgba(255,107,0,0.45)' }}
                >
                  <Icon size={26} color="white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-[#6B7280] mt-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className="flex-1 flex flex-col items-center justify-center py-2 transition-colors"
              style={{ minHeight: 64 }}
            >
              <Icon size={24} color={active ? '#FF6B00' : '#9CA3AF'} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] mt-0.5 font-medium ${active ? 'text-[#FF6B00]' : 'text-[#9CA3AF]'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}