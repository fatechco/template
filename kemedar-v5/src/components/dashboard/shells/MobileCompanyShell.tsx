"use client";
// @ts-nocheck
import { useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import {
  Menu, X, User, FileText, DollarSign, HelpCircle, CreditCard,
  ClipboardList, BarChart3, Users, Star, Bookmark, ShoppingCart,
  LogOut, Search, Tag, Briefcase, Building2, Calendar, MessageCircle, Bell, Settings, Plus,
  ChevronDown, ChevronRight
} from "lucide-react";

const MENU = [
  { label: "Dashboard", icon: BarChart3, to: "/m/cp/company" },
  {
    label: "My Business", icon: Briefcase, children: [
      { label: "Business Profile", icon: User, to: "/m/cp/company/business-profile" },
      { label: "Performance Stats", icon: BarChart3, to: "/m/cp/company/performance" },
      { label: "Clients", icon: Users, to: "/m/cp/company/customers" },
      { label: "Appointments", icon: Calendar, to: "/m/cp/company/appointments" },
    ]
  },
  {
    label: "Services & Tasks", icon: Briefcase, children: [
      { label: "All Services", icon: Briefcase, to: "/m/cp/company/services" },
      { label: "Search Tasks", icon: Search, to: "/m/cp/company/search-tasks" },
      { label: "Tasks in my Category", icon: FileText, to: "/m/cp/company/tasks-in-category" },
    ]
  },
  {
    label: "My Work", icon: ClipboardList, children: [
      { label: "My Orders", icon: ClipboardList, to: "/m/cp/company/orders" },
      { label: "My Bids", icon: FileText, to: "/m/cp/company/bids" },
      { label: "Portfolio", icon: Star, to: "/m/cp/company/portfolio" },
    ]
  },
  {
    label: "Team & Customers", icon: Users, children: [
      { label: "Team Members", icon: Users, to: "/m/cp/company/team" },
      { label: "My Customers", icon: Users, to: "/m/cp/company/customers" },
    ]
  },
  {
    label: "💰 Earnings", icon: DollarSign, children: [
      { label: "Earnings", icon: DollarSign, to: "/m/cp/company/earnings" },
      { label: "Invoices", icon: FileText, to: "/m/cp/company/invoices" },
    ]
  },
  {
    label: "🤖 AI & Smart Tools", icon: Star, children: [
      { heading: "BUILD & FINISH" },
      { label: "Kemetro Build™ — BOQ", icon: Briefcase, to: "/m/cp/company/build" },
      { label: "Finish™ — Projects", icon: ClipboardList, to: "/m/cp/company/finish/new" },
      { heading: "MY PROFILE" },
      { label: "Kemedar Score", icon: Star, to: "/m/cp/company/score" },
    ]
  },
  {
    label: "🗂 Tools", icon: MessageCircle, children: [
      { heading: "COMMUNICATIONS" },
      { label: "Messages", icon: MessageCircle, to: "/m/cp/company/messages" },
      { label: "Notifications", icon: Bell, to: "/m/cp/company/notifications" },
      { heading: "ACCOUNT" },
      { label: "My Profile", icon: User, to: "/m/cp/company/profile" },
      { label: "Subscription", icon: CreditCard, to: "/m/cp/company/subscription" },
      { label: "Settings", icon: Settings, to: "/m/cp/company/settings" },
    ]
  },
  {
    label: "❓ Help", icon: HelpCircle, children: [
      { label: "Support Tickets", icon: Bell, to: "/m/cp/company/tickets" },
      { label: "Help Center", icon: FileText, to: "/m/cp/company/knowledge" },
      { label: "Contact Us", icon: MessageCircle, to: "/m/cp/company/contact-kemedar" },
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
        ${active ? "bg-pink-50 text-pink-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
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
              ? "bg-pink-50 text-pink-600 border-pink-500"
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
      href={item.to || "#"}
      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all border-l-4
        ${active
          ? "bg-pink-50 text-pink-600 border-pink-500"
          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border-transparent"}`}
    >
      <Icon size={17} className="flex-shrink-0" />
      <span>{item.label}</span>
    </Link>
  );
}

const BOTTOM_TABS = [
  { id: "settings", label: "Settings", icon: Settings, path: "/m/cp/company/settings" },
  { id: "search",   label: "Search",   icon: Search,   path: "/m/cp/company/search-tasks" },
  { id: "add",      label: "Add",      icon: Plus,     path: "/kemework/add-service", fab: true },
  { id: "messages", label: "Messages", icon: MessageCircle, path: "/m/cp/company/messages" },
  { id: "account",  label: "Account",  icon: User,     path: "/m/cp/company/profile" },
];

export default function MobileCompanyShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState({});
  const { user, isLoadingAuth, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-pink-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return <Navigate href="/dashboard" replace />;

  const toggleMenu = (label) => setExpandedMenus(prev => ({ ...prev, [label]: !prev[label] }));
  const isActive = (to) => to && (pathname === to || (to !== "/m/cp/company" && pathname.startsWith(to)));

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-opacity ${sidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Sidebar */}
      <div className={`fixed left-0 top-0 bottom-0 w-72 bg-white shadow-lg z-50 transition-transform flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="px-4 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-pink-100 flex items-center justify-center text-pink-600 font-bold text-sm">
              {user.full_name?.charAt(0).toUpperCase() || "C"}
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

        <div className="border-t border-gray-100 px-3 py-3">
          <button
            onClick={() => { logout(); setSidebarOpen(false); }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-all w-full text-left"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button onClick={() => setSidebarOpen(true)} className="p-2 hover:bg-gray-100 rounded-lg">
            <Menu size={22} className="text-gray-600" />
          </button>
          <h2 className="font-bold text-gray-900 text-sm flex-1 text-center">Finishing Company</h2>
          <div className="w-8" />
        </div>

        <main className="flex-1 overflow-auto pb-16">
          <Outlet />
        </main>
      </div>

      {/* Bottom Nav */}
      <div
        className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex items-end z-50"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", minHeight: 64 }}
      >
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = pathname.startsWith(tab.path) && tab.id !== "account";

          if (tab.fab) {
            return (
              <button key={tab.id} onClick={() => router.push(tab.path)} className="flex-1 flex flex-col items-center justify-end pb-2" style={{ minHeight: 64 }}>
                <div className="w-14 h-14 rounded-full bg-[#FF6B00] flex items-center justify-center -mt-5" style={{ boxShadow: "0 4px 20px rgba(255,107,0,0.45)" }}>
                  <Icon size={26} color="white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-[#6B7280] mt-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button key={tab.id} onClick={() => router.push(tab.path)} className="flex-1 flex flex-col items-center justify-center py-2 transition-colors" style={{ minHeight: 64 }}>
              <Icon size={24} color={active ? "#FF6B00" : "#9CA3AF"} strokeWidth={active ? 2.5 : 1.8} />
              <span className={`text-[10px] mt-0.5 font-medium ${active ? "text-[#FF6B00]" : "text-[#9CA3AF]"}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}