"use client";
// @ts-nocheck
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Users, Home, Building2, FileText, Tag, Star,
  Clock, Upload, Bell, Download, MapPin, Trash2, BarChart3,
  ChevronDown, ChevronRight, X, Shield, Settings, Target,
  Wrench, Hash, Ruler, LogOut, HelpCircle
} from "lucide-react";
import { apiClient } from "@/lib/api-client";
import { useAuth } from "@/lib/auth-context";

const MENU = [
  {
    section: "MAIN",
    items: [
      { label: "Dashboard", icon: LayoutDashboard, to: "/admin" },
    ]
  },
  {
    section: "USERS",
    items: [
      {
        label: "All Users", icon: Users, to: "/admin/users",
        children: [
          { label: "Common Users", to: "/admin/users/common" },
          { label: "Agents (Individual)", to: "/admin/users/agents" },
          { label: "Agencies (Companies)", to: "/admin/users/agencies" },
          { label: "Developers", to: "/admin/users/developers" },
          { label: "Franchise Owner Areas", to: "/admin/users/franchise-owners" },
          { label: "Admins", to: "/admin/users/admins" },
        ]
      },
      { label: "Pending Users", icon: Clock, to: "/admin/users/pending" },
      { label: "Imported Users", icon: Download, to: "/admin/users/imported" },
      { label: "Verified Users", icon: Shield, to: "/admin/users/verified" },
      { label: "User Roles", icon: Tag, to: "/admin/roles" },
    ]
  },
  {
    section: "PROPERTIES & PROJECTS",
    items: [
      { label: "All Properties", icon: Home, to: "/admin/properties" },
      { label: "All Projects", icon: Building2, to: "/admin/projects" },
      { label: "Buy Requests", icon: FileText, to: "/admin/buy-requests" },
      { label: "Property Categories", icon: Tag, to: "/admin/property-categories" },
      { label: "Property Purposes", icon: Target, to: "/admin/property-purposes" },
      { label: "Suitable For", icon: Tag, to: "/admin/suitable-for" },
      { label: "Amenities", icon: Wrench, to: "/admin/amenities" },
      { label: "Tags", icon: Hash, to: "/admin/tags" },
      { label: "Distance Fields", icon: Ruler, to: "/admin/distance-fields" },
    ]
  },
  {
    section: "MARKETING & COMMS",
    items: [
      { label: "Featured Properties", icon: Star, to: "/admin/featured/properties" },
      { label: "Featured Projects", icon: Star, to: "/admin/featured/projects" },
      { label: "Featured Agents", icon: Star, to: "/admin/featured/agents" },
      { label: "Featured Developers", icon: Star, to: "/admin/featured/developers" },
      { label: "Featured Agencies", icon: Star, to: "/admin/featured/agencies" },
      { label: "Recent Properties", icon: Clock, to: "/admin/recent/properties" },
      { label: "Recent Projects", icon: Clock, to: "/admin/recent/projects" },
      { label: "Upload Media", icon: Upload, to: "/admin/media" },
    ]
  },
  {
    section: "TOOLS",
    items: [
      { label: "Notifications", icon: Bell, to: "/admin/notifications" },
      { label: "Import Data", icon: Download, to: "/admin/import" },
      { label: "Locations", icon: MapPin, to: "/admin/locations" },
      { label: "Cache Clear", icon: Trash2, to: "/admin/cache" },
      { label: "Reports", icon: BarChart3, to: "/admin/reports" },
    ]
  }
];

const KEMEWORK_MENU = {
  section: "🔧 KEMEWORK",
  items: [
    { label: "Kemework Overview", icon: LayoutDashboard, to: "/admin/kemework" },
    {
      label: "Professionals", icon: Users, to: "/admin/kemework/professionals",
      children: [
        { label: "All Professionals", to: "/admin/kemework/professionals" },
        { label: "Pending Verification", to: "/admin/kemework/professionals?status=pending" },
        { label: "Accreditation Requests", to: "/admin/kemework/accreditation" },
        { label: "Verified Professionals", to: "/admin/kemework/professionals?status=verified" },
        { label: "Suspended", to: "/admin/kemework/professionals?status=suspended" },
      ]
    },
    {
      label: "Tasks", icon: FileText, to: "/admin/kemework/tasks",
      children: [
        { label: "All Tasks", to: "/admin/kemework/tasks" },
        { label: "Open Tasks", to: "/admin/kemework/tasks?status=Open" },
        { label: "In Progress", to: "/admin/kemework/tasks?status=In Progress" },
        { label: "Completed", to: "/admin/kemework/tasks?status=Completed" },
        { label: "Reported Tasks", to: "/admin/kemework/tasks?status=Reported" },
      ]
    },
    {
      label: "Services", icon: Wrench, to: "/admin/kemework/services",
      children: [
        { label: "All Services", to: "/admin/kemework/services" },
        { label: "⚠️ Pending Approval", to: "/admin/kemework/services/pending" },
        { label: "Active Services", to: "/admin/kemework/services?status=Active" },
        { label: "Rejected", to: "/admin/kemework/services?status=Rejected" },
      ]
    },
    {
      label: "Orders", icon: Tag, to: "/admin/kemework/orders",
      children: [
        { label: "All Orders", to: "/admin/kemework/orders" },
        { label: "Active Orders", to: "/admin/kemework/orders?status=active" },
        { label: "Disputes", to: "/admin/kemework/orders?status=disputes" },
        { label: "Completed Orders", to: "/admin/kemework/orders?status=completed" },
      ]
    },
    {
      label: "Accreditation Program", icon: Star, to: "/admin/kemework/accreditation",
      children: [
        { label: "Applications", to: "/admin/kemework/accreditation" },
        { label: "Scheduled Interviews", to: "/admin/kemework/accreditation?tab=interviews" },
        { label: "Accredited Professionals", to: "/admin/kemework/accreditation?tab=accredited" },
        { label: "ID Card Management", to: "/admin/kemework/accreditation?tab=id-cards" },
      ]
    },
    { label: "Categories", icon: Hash, to: "/admin/kemework/categories" },
    { label: "Revenue & Commissions", icon: BarChart3, to: "/admin/kemework/revenue" },
    { label: "Reviews Management", icon: Star, to: "/admin/kemework/reviews" },
    { label: "Subscription Plans", icon: Tag, to: "/admin/kemework/plans" },
  ]
};

const MODULE_SWITCHER = [
  { label: "Kemedar Admin", value: "kemedar", color: "bg-orange-500" },
  { label: "Kemetro Admin", value: "kemetro", color: "bg-blue-500" },
  { label: "Kemework Admin", value: "kemework", color: "bg-green-500" },
];

function SubMenu({ item, isActive }) {
  const pathname = usePathname();
  const hasActiveChild = item.children?.some(c => pathname === c.to || pathname.startsWith(c.to));
  const [open, setOpen] = useState(hasActiveChild);
  const Icon = item.icon;

  return (
    <div>
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
          ${hasActiveChild ? "bg-orange-50 text-orange-600" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
      >
        <Icon size={15} className="flex-shrink-0" />
        <span className="flex-1 text-left">{item.label}</span>
        {open ? <ChevronDown size={11} /> : <ChevronRight size={11} />}
      </button>
      {open && (
        <div className="ml-4 pl-3 border-l border-gray-200 mt-0.5 space-y-0.5">
          {item.children.map(child => (
            <Link
              key={child.to}
              href={child.to || "#"}
              className={`flex items-center px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all
                ${pathname === child.to ? "bg-orange-50 text-orange-600" : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function AdminSidebar({ collapsed, onClose, module, setModule }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isActive = (to) => to === "/admin" ? pathname === "/admin" : pathname.startsWith(to);

  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "A";

  const activeModule = MODULE_SWITCHER.find(m => m.value === module) || MODULE_SWITCHER[0];

  return (
    <>
      {!collapsed && (
        <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={onClose} />
      )}
      <aside className={`
        fixed top-0 left-0 h-full z-50 flex flex-col
        bg-white border-r border-gray-200 text-gray-800 transition-transform duration-300
        w-[250px]
        ${collapsed ? "-translate-x-full" : "translate-x-0"}
        lg:translate-x-0 lg:static lg:z-auto
      `}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 lg:hidden">
          <X size={16} />
        </button>

        {/* Logo */}
        <div className="px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
              <Shield size={16} className="text-white" />
            </div>
            <div>
              <p className="font-black text-gray-900 text-sm">Kemedar</p>
              <p className="text-gray-400 text-[10px]">Admin Panel</p>
            </div>
          </div>

          {/* Module Switcher */}
          <div className="space-y-1">
            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-2">Module</p>
            {MODULE_SWITCHER.map(m => (
              <button
                key={m.value}
                onClick={() => {
                  setModule(m.value);
                  if (m.value === "kemetro") window.location.href = "/kemetro/admin";
                }}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-bold transition-all
                  ${module === m.value ? `${m.color} text-white` : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"}`}
              >
                <div className={`w-2 h-2 rounded-full ${m.color}`} />
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Admin User Card */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-red-500 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-gray-900 font-bold text-xs truncate">{user?.full_name || "Admin"}</p>
              <p className="text-gray-400 text-[10px] truncate">{user?.email}</p>
            </div>
            <span className="ml-auto text-[9px] font-black bg-red-500 text-white px-1.5 py-0.5 rounded-full flex-shrink-0">ADMIN</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto py-3 px-3 space-y-4">
          {MENU.map((section, si) => (
            <div key={si}>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-1.5">{section.section}</p>
              <div className="space-y-0.5">
                {section.items.map((item, ii) => {
                  if (item.children) {
                    return <SubMenu key={ii} item={item} isActive={isActive} />;
                  }
                  const Icon = item.icon;
                  const active = isActive(item.to);
                  return (
                    <Link
                      key={item.to}
                      href={item.to || "#"}
                      onClick={onClose}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
                        ${active ? "bg-orange-50 text-orange-600 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}
                    >
                      <Icon size={15} className="flex-shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Kemework Section */}
          <div>
            <p className="text-[9px] font-bold text-teal-500 uppercase tracking-widest px-3 mb-1.5">{KEMEWORK_MENU.section}</p>
            <div className="space-y-0.5">
              {KEMEWORK_MENU.items.map((item, ii) => {
                if (item.children) return <SubMenu key={ii} item={item} isActive={isActive} />;
                const Icon = item.icon;
                const active = isActive(item.to);
                return (
                  <Link key={item.to} href={item.to || "#"} onClick={onClose}
                    className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-all
                      ${active ? "bg-teal-50 text-teal-600 font-semibold" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
                    <Icon size={15} className="flex-shrink-0" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </nav>

        {/* Bottom */}
        <div className="border-t border-gray-100 p-3 space-y-1">
          <Link href="/dashboard" className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-gray-500 hover:bg-gray-50 hover:text-gray-800 transition-all">
            <HelpCircle size={14} /> Back to Dashboard
          </Link>
          <button onClick={logout} className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-red-500 hover:bg-red-50 transition-all w-full text-left">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>
    </>
  );
}