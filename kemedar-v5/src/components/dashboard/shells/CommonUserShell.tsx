"use client";
// @ts-nocheck
import { useState } from "react";
import { Outlet, useLocation } from "next/link";
import Link from "next/link";
import {
  LayoutDashboard, MapPin, HardHat, ShoppingCart, CreditCard,
  DollarSign, MessageCircle, HelpCircle, Search, Home, Plus,
  Heart, GitCompare, FileText, ClipboardList, ScanSearch,
  KanbanSquare, Users, Star, Bookmark, Bell, User, Settings,
  ChevronDown, ChevronRight, X, LogOut
} from "lucide-react";
import { useAuth } from "@/lib/auth-context";

const MENU = [
  { label: "Dashboard", icon: LayoutDashboard, to: "/cp/user" },
  {
    label: "🏙 Kemedar", icon: MapPin, children: [
      { heading: "PROPERTIES" },
      { label: "Find Property", icon: Search, to: "/search-properties" },
      { label: "My Properties", icon: Home, to: "/cp/user/my-properties" },
      { label: "Add New Property", icon: Plus, to: "/create/property" },
      { label: "My Favorites", icon: Heart, to: "/cp/user/favorites" },
      { label: "Compare Properties", icon: GitCompare, to: "/cp/user/compare" },
      { heading: "REQUESTS" },
      { label: "Add Buy Request", icon: FileText, to: "/create/buy-request" },
      { label: "My Buy Requests", icon: ClipboardList, to: "/cp/user/my-buy-requests" },
      { label: "Search Buy Requests", icon: ScanSearch, to: "/cp/user/search-requests" },
      { heading: "PROJECTS" },
      { label: "Find Project", icon: Search, to: "/search-projects" },
      { heading: "ORGANIZERS" },
      { label: "Buyer Organizer", icon: KanbanSquare, to: "/cp/user/buyer-organizer" },
      { label: "Seller Organizer", icon: KanbanSquare, to: "/cp/user/seller-organizer" },
    ]
  },
  {
    label: "🔧 Kemework", icon: HardHat, children: [
      { heading: "MY TASKS" },
      { label: "Post a Task", icon: Plus, to: "/kemework/post-task" },
      { label: "My Tasks", icon: FileText, to: "/cp/user/kemework/my-tasks" },
      { label: "My Task Orders", icon: ClipboardList, to: "/cp/user/kemework/orders" },
      { heading: "FIND & BROWSE" },
      { label: "Find Professionals", icon: Users, to: "/kemework/find-professionals" },
      { label: "Browse Services", icon: Star, to: "/kemework/services" },
      { label: "Browse Tasks", icon: Search, to: "/kemework/tasks" },
      { heading: "SAVED" },
      { label: "Bookmarked Pros & Services", icon: Bookmark, to: "/cp/user/kemework/bookmarks" },
    ]
  },
  {
    label: "🛒 Kemetro", icon: ShoppingCart, children: [
      { heading: "SHOPPING" },
      { label: "Find Product", icon: Search, to: "/m/kemetro/search" },
      { label: "My Cart", icon: ShoppingCart, to: "/m/kemetro/cart" },
      { heading: "MY ORDERS" },
      { label: "All Orders", icon: ClipboardList, to: "/cp/user/kemetro-orders" },
      { heading: "REQUESTS" },
      { label: "My RFQs", icon: FileText, to: "/cp/user/kemetro-rfqs" },
      { label: "Post New RFQ", icon: Plus, to: "/m/add/rfq" },
    ]
  },
  { label: "💎 Premium Services", icon: CreditCard, to: "/cp/user/subscription" },
  {
    label: "🔨 Auctions & Swap", icon: Star, children: [
      { heading: "AUCTIONS" },
      { label: "My Auctions", icon: Star, to: "/cp/user/auctions" },
      { heading: "SWAP" },
      { label: "Swap Hub", icon: GitCompare, to: "/cp/user/swap" },
    ]
  },
  {
    label: "🤖 AI & Smart Tools", icon: Star, children: [
      { heading: "PROPERTY TOOLS" },
      { label: "AI Negotiations", icon: MessageCircle, to: "/cp/user/negotiations" },
      { label: "Escrow & Payments", icon: CreditCard, to: "/cp/user/escrow" },
      { label: "Property Valuations", icon: Search, to: "/cp/user/valuations" },
      { label: "Advisor Report", icon: FileText, to: "/cp/user/advisor-report" },
      { heading: "MY PROFILE" },
      { label: "Kemedar Score", icon: Star, to: "/cp/user/score" },
      { label: "My DNA Profile", icon: User, to: "/cp/user/my-dna" },
      { label: "KYC Verification", icon: KanbanSquare, to: "/cp/user/kyc" },
    ]
  },
  {
    label: "💰 Money & Orders", icon: DollarSign, children: [
      { heading: "KEMEDAR" },
      { label: "Kemedar Orders", icon: ClipboardList, to: "/cp/user/kemedar-orders" },
      { heading: "KEMETRO" },
      { label: "Kemetro Orders", icon: ShoppingCart, to: "/cp/user/kemetro-orders" },
      { label: "My RFQs", icon: FileText, to: "/cp/user/kemetro-rfqs" },
      { heading: "KEMEWORK" },
      { label: "Kemework Orders", icon: ClipboardList, to: "/cp/user/kemework-orders" },
      { heading: "PAYMENTS" },
      { label: "Wallet", icon: CreditCard, to: "/cp/user/wallet" },
      { label: "Invoices", icon: FileText, to: "/cp/user/invoices" },
      { label: "Payment Methods", icon: CreditCard, to: "/cp/user/payment-methods" },
    ]
  },
  {
    label: "🗂 Tools & Communications", icon: MessageCircle, children: [
      { heading: "TOOLS" },
      { label: "📱 QR Code Manager", icon: ScanSearch, to: "/cp/user/qr-codes" },
      { heading: "COMMUNICATIONS" },
      { label: "Messages", icon: MessageCircle, to: "/cp/user/messages" },
      { label: "Notifications", icon: Bell, to: "/cp/user/notifications" },
      { heading: "ACCOUNT" },
      { label: "My Profile", icon: User, to: "/cp/user/profile" },
      { label: "Subscription & Billing", icon: CreditCard, to: "/cp/user/subscription" },
      { label: "Settings", icon: Settings, to: "/cp/user/settings" },
    ]
  },
  {
    label: "❓ Help", icon: HelpCircle, children: [
      { label: "Support Tickets", icon: Bell, to: "/cp/user/tickets" },
      { label: "Help Center & FAQ", icon: FileText, to: "/cp/user/knowledge" },
      { label: "Contact Us", icon: MessageCircle, to: "/cp/user/contact-kemedar" },
    ]
  },
];

function SubItem({ item, isActive }) {
  const ChildIcon = item.icon;
  const active = isActive(item.to);
  return (
    <Link
      href={item.to || "#"}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
        ${active ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
    >
      <ChildIcon size={14} className="flex-shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

function NavItem({ item, isActive }) {
  const pathname = usePathname();
  const hasActiveChild = item.children?.some(c => !c.heading && c.to && (pathname === c.to || pathname.startsWith(c.to)));
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
      href={item.to || "#"}
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

export default function CommonUserShell() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "U";

  const isActive = (to) => to && (pathname === to || (to !== "/cp/user" && pathname.startsWith(to)));

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
            <span className="text-xs font-bold text-white px-2.5 py-1 rounded-full bg-gray-500">Common User</span>
            <Link href="/cp/user/profile" className="text-xs text-gray-400 hover:text-gray-700 transition-colors">Edit Profile →</Link>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
          {MENU.map((item, idx) => (
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

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
}