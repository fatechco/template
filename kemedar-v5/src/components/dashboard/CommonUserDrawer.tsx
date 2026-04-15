"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ChevronDown, ChevronRight, LogOut, X } from "lucide-react";
import { apiClient } from "@/lib/api-client";

// ── UNIFIED MENU DEFINITION ──────────────────────────────────────────
const UNIFIED_MENU = [
  { label: "Dashboard", icon: "📊", path: "/m/dashboard" },
  {
    label: "Kemedar", icon: "🏙",
    key: "kemedar",
    sections: [
      { heading: "PROPERTIES", items: [
        { label: "Find Property", icon: "🔍", path: "/m/find/property" },
        { label: "My Properties", icon: "🏠", path: "/m/dashboard/my-properties" },
        { label: "Add New Property", icon: "➕", path: "/m/add/property" },
        { label: "My Favorites", icon: "❤️", path: "/m/dashboard/favorites" },
        { label: "Compare Properties", icon: "⚖️", path: "/m/dashboard/compare" },
      ]},
      { heading: "REQUESTS", items: [
        { label: "Add Buy Request", icon: "📋", path: "/m/add/request" },
        { label: "My Buy Requests", icon: "📋", path: "/m/dashboard/my-buy-requests" },
        { label: "Search Buy Requests", icon: "🔍", path: "/m/dashboard/search-requests" },
      ]},
      { heading: "PROJECTS", items: [
        { label: "Find Project", icon: "🏗", path: "/m/find/project" },
        { label: "My Projects", icon: "🏗", path: "/m/dashboard/my-projects" },
        { label: "Add New Project", icon: "➕", path: "/m/add/project" },
      ]},
      { heading: "ORGANIZERS", items: [
        { label: "Buyer Organizer (Kanban)", icon: "📊", path: "/m/dashboard/buyer-organizer" },
        { label: "Seller Organizer (Kanban)", icon: "📊", path: "/m/dashboard/seller-organizer" },
      ]},
    ]
  },
  {
    label: "Kemework", icon: "🔧",
    key: "kemework",
    sections: [
      { heading: "MY TASKS", items: [
        { label: "Post a Task", icon: "➕", path: "/m/kemework/post-task" },
        { label: "My Tasks", icon: "📋", path: "/m/dashboard/kemework-tasks" },
        { label: "My Task Orders", icon: "📦", path: "/m/dashboard/kemework/orders" },
      ]},
      { heading: "FIND & BROWSE", items: [
        { label: "Find Professionals", icon: "👷", path: "/m/find/professional" },
        { label: "Browse Services", icon: "🔧", path: "/m/kemework/find" },
        { label: "Browse Tasks", icon: "📋", path: "/m/kemework/tasks" },
      ]},
      { heading: "SAVED", items: [
        { label: "Bookmarked Pros & Services", icon: "🔖", path: "/m/dashboard/bookmarks" },
      ]},
    ]
  },
  {
    label: "Kemetro", icon: "🛒",
    key: "kemetro",
    sections: [
      { heading: "SHOPPING", items: [
        { label: "Browse Products", icon: "🛍", path: "/m/find/product" },
        { label: "My Wishlist", icon: "❤️", path: "/m/dashboard/wishlist" },
        { label: "My Cart", icon: "🛒", path: "/m/dashboard/cart" },
      ]},
      { heading: "MY ORDERS", items: [
        { label: "All Orders", icon: "📦", path: "/m/dashboard/kemetro-orders" },
        { label: "Pending Orders", icon: "📦", path: "/m/dashboard/kemetro-orders?status=pending" },
        { label: "In Transit", icon: "📦", path: "/m/dashboard/kemetro-orders?status=transit" },
        { label: "Delivered", icon: "✅", path: "/m/dashboard/kemetro-orders?status=delivered" },
        { label: "Returns", icon: "🔄", path: "/m/dashboard/kemetro-orders?status=returns" },
      ]},
      { heading: "REQUESTS", items: [
        { label: "My RFQs", icon: "📝", path: "/m/dashboard/rfqs" },
        { label: "Post New RFQ", icon: "➕", path: "/m/add/rfq" },
      ]},
    ]
  },
  { label: "Premium Services", icon: "💎", path: "/m/buy" },
  {
    label: "Money & Orders", icon: "💰",
    key: "money",
    sections: [
      { heading: "ALL ORDERS", items: [
        { label: "Kemedar Orders (services)", icon: "🏠", path: "/m/dashboard/kemedar-orders" },
        { label: "Kemework Orders", icon: "🔧", path: "/m/dashboard/kemework/orders" },
        { label: "Kemetro Orders", icon: "🛒", path: "/m/dashboard/kemetro-orders" },
      ]},
      { heading: "PAYMENTS", items: [
        { label: "My Wallet", icon: "👛", path: "/m/dashboard/wallet" },
        { label: "Payment Methods", icon: "💳", path: "/m/dashboard/payment-methods" },
        { label: "Invoices", icon: "🧾", path: "/m/dashboard/invoices" },
      ]},
    ]
  },
  {
    label: "Tools & Communications", icon: "🗂",
    key: "tools",
    sections: [
      { heading: "COMMUNICATIONS", items: [
        { label: "Messages", icon: "💬", path: "/m/dashboard/messages" },
        { label: "Notifications", icon: "🔔", path: "/m/dashboard/notifications" },
      ]},
      { heading: "ACCOUNT", items: [
        { label: "My Profile", icon: "👤", path: "/m/dashboard/profile" },
        { label: "Subscription & Billing", icon: "💳", path: "/m/dashboard/subscription" },
        { label: "Settings", icon: "⚙️", path: "/m/settings" },
      ]},
    ]
  },
  {
    label: "Help", icon: "❓",
    key: "help",
    sections: [
      { heading: null, items: [
        { label: "Support Tickets", icon: "🎫", path: "/m/dashboard/tickets" },
        { label: "Help Center & FAQ", icon: "📚", path: "/m/dashboard/knowledge" },
        { label: "Contact Us", icon: "📞", path: "/m/dashboard/contact-kemedar" },
      ]},
    ]
  },
];

const ALL_ROLES = [
  { value: "user", label: "Common User" },
  { value: "agent", label: "Agent" },
  { value: "agency", label: "Agency" },
  { value: "developer", label: "Developer" },
  { value: "franchise_owner_area", label: "Franchise Owner (Area)" },
  { value: "franchise_owner_country", label: "Franchise Owner (Country)" },
  { value: "admin", label: "Admin" },
  { value: "kemetro_seller", label: "Product Seller (Kemetro)" },
  { value: "kemework_customer", label: "Customer (Kemework)" },
  { value: "kemework_professional", label: "Professional (Kemework)" },
  { value: "kemework_company", label: "Finishing Company (Kemework)" },
];

// Roles that all map to the unified "Common User" menu
const COMMON_USER_ROLES = new Set(["user", "product_buyer", "customer_kemework"]);

function SectionItem({ item, onNavigate, location }) {
  const isActive = pathname === item.path;
  return (
    <button
      onClick={() => onNavigate(item.path)}
      className={`w-full flex items-center gap-3 pl-8 pr-4 py-2.5 text-sm transition-colors text-left rounded-lg ${
        isActive
          ? "bg-orange-50 text-orange-600 border-l-4 border-orange-500"
          : "text-gray-700 hover:bg-gray-50"
      }`}
    >
      <span className="text-base flex-shrink-0">{item.icon}</span>
      <span className="font-medium">{item.label}</span>
    </button>
  );
}

function ExpandableSection({ menuItem, onNavigate, location }) {
  const STORAGE_KEY = `drawer_open_${menuItem.key}`;

  // Auto-expand if current path matches any child
  const hasActiveChild = menuItem.sections?.some(s =>
    s.items.some(i => pathname.startsWith(i.path))
  );

  const [open, setOpen] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved !== null ? JSON.parse(saved) : hasActiveChild;
    } catch {
      return hasActiveChild;
    }
  });

  const toggle = () => {
    const next = !open;
    setOpen(next);
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)); } catch {}
  };

  return (
    <div>
      <button
        onClick={toggle}
        className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold transition-colors rounded-lg ${
          open || hasActiveChild
            ? "text-orange-600 bg-orange-50"
            : "text-gray-800 hover:bg-gray-50"
        }`}
      >
        <span className="text-lg flex-shrink-0">{menuItem.icon}</span>
        <span className="flex-1 text-left">{menuItem.label}</span>
        {open
          ? <ChevronDown size={16} className="opacity-50" />
          : <ChevronRight size={16} className="opacity-50" />
        }
      </button>

      {open && (
        <div className="mt-0.5 mb-1">
          {menuItem.sections.map((section, sIdx) => (
            <div key={sIdx}>
              {section.heading && (
                <p className="pl-8 pt-3 pb-1 text-[10px] font-black uppercase tracking-widest text-gray-400">
                  {section.heading}
                </p>
              )}
              {section.items.map((item, iIdx) => (
                <SectionItem key={iIdx} item={item} onNavigate={onNavigate} location={location} />
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function CommonUserDrawer({ isOpen, onClose, user }) {
  const router = useRouter();
  const pathname = usePathname();
  const [switching, setSwitching] = useState(false);

  const handleNavigation = (path) => {
    router.push(path);
    onClose();
  };

  const switchRole = async (role) => {
    setSwitching(true);
    await /* auth.updateMe TODO */ ({ role });
    window.location.reload();
  };

  if (!isOpen) return null;

  const initials = `${user?.full_name?.split(" ")[0]?.[0] || ""}${
    user?.full_name?.split(" ")[1]?.[0] || ""
  }`.toUpperCase() || "U";

  const isDashboardActive = pathname === "/m/dashboard" || pathname === "/m";

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40" onClick={onClose} />

      <div className="fixed left-0 top-0 h-full w-4/5 max-w-xs bg-white z-50 shadow-xl flex flex-col">
        {/* Close */}
        <button onClick={onClose} className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg z-50">
          <X size={18} className="text-gray-500" />
        </button>

        {/* Profile Card */}
        <div className="px-4 py-5 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-11 h-11 rounded-full bg-orange-600 flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate">{user?.full_name || "User"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold bg-gray-200 text-gray-600 px-2.5 py-1 rounded-full">
              Common User
            </span>
            <button
              onClick={() => handleNavigation("/m/dashboard/profile")}
              className="text-xs font-semibold text-orange-600 hover:text-orange-700"
            >
              Edit Profile →
            </button>
          </div>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-0.5">
          {/* Dashboard direct link */}
          <button
            onClick={() => handleNavigation("/m/dashboard")}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-colors border-l-4 ${
              isDashboardActive
                ? "bg-orange-50 text-orange-600 border-orange-500"
                : "text-gray-800 hover:bg-gray-50 border-transparent"
            }`}
          >
            <span className="text-lg">📊</span>
            <span>Dashboard</span>
          </button>

          {/* Expandable sections + direct links */}
          {UNIFIED_MENU.filter(item => item.key || item.path).filter(item => item.label !== "Dashboard").map((item) => {
            if (item.path) {
              const isActive = pathname === item.path;
              return (
                <button
                  key={item.label}
                  onClick={() => handleNavigation(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-bold rounded-lg transition-colors border-l-4 ${
                    isActive
                      ? "bg-orange-50 text-orange-600 border-orange-500"
                      : "text-gray-800 hover:bg-gray-50 border-transparent"
                  }`}
                >
                  <span className="text-lg flex-shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            }
            return (
              <ExpandableSection
                key={item.key}
                menuItem={item}
                onNavigate={handleNavigation}
                location={location}
              />
            );
          })}
        </nav>

        {/* Bottom: Role Switcher + Logout */}
        <div className="border-t border-gray-100 flex-shrink-0">
          <div className="px-4 py-3">
            <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1.5">🛠 Dev: Switch Role</p>
            <select
              value={user?.role || "user"}
              onChange={e => switchRole(e.target.value)}
              disabled={switching}
              className="w-full bg-gray-100 text-gray-700 text-xs rounded-lg px-2 py-1.5 border border-gray-200 focus:outline-none cursor-pointer"
            >
              {ALL_ROLES.map(r => (
                <option key={r.value} value={r.value}>{r.label}</option>
              ))}
            </select>
          </div>
          <div className="px-4 pb-4">
            <button
              onClick={() => /* auth.logout TODO */ ("/m/login")}
              className="w-full flex items-center justify-center gap-2 text-red-500 font-bold py-2.5 hover:bg-red-50 rounded-lg transition-colors text-sm"
            >
              <LogOut size={15} /> Sign Out
            </button>
          </div>
        </div>
      </div>
    </>
  );
}