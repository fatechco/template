"use client";
// @ts-nocheck
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X, ChevronDown, ChevronRight } from "lucide-react";

const NAV = [
  { icon: "📊", label: "Dashboard Home", path: "/cp/pro" },
  { icon: "👤", label: "My Professional Profile", path: "/cp/pro/profile" },
  {
    icon: "🔍", label: "Browse Tasks", children: [
      { label: "All Available Tasks", path: "/kemework/tasks" },
      { label: "My Bids", path: "/dashboard/pro/my-bids" },
      { label: "Bookmarked Tasks", path: "/dashboard/pro/bookmarks" },
    ]
  },
  {
    icon: "📦", label: "My Services", children: [
      { label: "All My Services", path: "/dashboard/pro/services" },
      { label: "Add New Service", path: "/kemework/add-service" },
      { label: "Pending Approval", path: "/dashboard/pro/services?status=Pending" },
      { label: "Active Services", path: "/dashboard/pro/services?status=Active" },
      { label: "Draft Services", path: "/dashboard/pro/services?status=Draft" },
      { label: "Search Tasks", path: "/cp/pro/search-tasks" },
      { label: "Tasks in my Category", path: "/cp/pro/tasks-in-category" },
    ]
  },
  {
    icon: "📋", label: "Active Orders", children: [
      { label: "All Orders", path: "/dashboard/pro/orders" },
      { label: "New Orders", path: "/dashboard/pro/orders?status=Pending" },
      { label: "In Progress", path: "/dashboard/pro/orders?status=In Progress" },
      { label: "Delivered", path: "/dashboard/pro/orders?status=Under Review" },
      { label: "Completed", path: "/dashboard/pro/orders?status=Completed" },
    ]
  },
  { icon: "💰", label: "Earnings", path: "/dashboard/pro/earnings" },
  { icon: "🧾", label: "Invoices", path: "/dashboard/invoices" },
  { icon: "⭐", label: "My Reviews", path: "/dashboard/pro/reviews" },
  { icon: "🖼", label: "My Portfolio", path: "/dashboard/pro/portfolio" },
  { icon: "🏅", label: "Accreditation", path: "/dashboard/pro/accreditation" },
  { icon: "📊", label: "Analytics", path: "/dashboard/pro/analytics" },
  { icon: "💬", label: "Messages", path: "/dashboard/messages" },
  { icon: "💳", label: "Subscription", path: "/dashboard/subscription" },
  {
    icon: "👤", label: "Account", children: [
      { label: "My Profile", path: "/dashboard/profile" },
      { label: "Payout Settings", path: "/dashboard/pro/earnings" },
      { label: "Notifications", path: "/dashboard/notifications" },
      { label: "Settings", path: "/dashboard/settings" },
    ]
  },
];

function NavItem({ item, onClose }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isActive = item.path && pathname === item.path;

  if (item.children) {
    return (
      <div>
        <button onClick={() => setOpen(o => !o)} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors">
          <span className="text-lg w-6 flex-shrink-0">{item.icon}</span>
          <span className="flex-1 text-left text-sm font-semibold text-gray-800">{item.label}</span>
          {open ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
        </button>
        {open && (
          <div className="ml-9 mt-1 flex flex-col gap-0.5">
            {item.children.map(c => (
              <Link key={c.path} href={c.path || "#"} onClick={onClose} className="text-sm text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">{c.label}</Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link href={item.path} onClick={onClose} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${isActive ? "bg-teal-50 text-teal-700" : "hover:bg-gray-100 text-gray-800"}`}>
      <span className="text-lg w-6 flex-shrink-0">{item.icon}</span>
      <span className="text-sm font-semibold">{item.label}</span>
    </Link>
  );
}

export default function KemeworkProfessionalDrawer({ isOpen, onClose, user }) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-teal-100 flex items-center justify-center text-sm font-black text-teal-600 flex-shrink-0">
              {(user?.full_name || "P")[0]}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-black text-gray-900 text-xs truncate">{user?.full_name || "Professional"}</p>
              <p className="text-[10px] text-gray-500">{user?.email}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg flex-shrink-0"><X size={18} className="text-gray-500" /></button>
        </div>
        <div className="flex-1 overflow-y-auto py-3 px-3">
          <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest px-4 mb-2">🔧 KEMEWORK PRO</p>
          <div className="flex flex-col gap-0.5">
            {NAV.map((item, i) => <NavItem key={i} item={item} onClose={onClose} />)}
          </div>
        </div>
        <div className="border-t border-gray-100 p-4">
          <Link href="/kemework" onClick={onClose} className="block text-center text-xs font-bold text-teal-600 hover:text-teal-700">Go to Kemework Marketplace →</Link>
        </div>
      </div>
    </>
  );
}