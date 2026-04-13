import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { X, ChevronDown, ChevronRight } from "lucide-react";

const NAV = [
  { icon: "📊", label: "Dashboard", path: "/dashboard" },
  { icon: "🔍", label: "Find Services", path: "/kemework/services" },
  {
    icon: "📋", label: "My Tasks", children: [
      { label: "All My Tasks", path: "/dashboard/kemework/my-tasks" },
      { label: "Post New Task", path: "/kemework/post-task" },
      { label: "Open Tasks", path: "/dashboard/kemework/my-tasks?status=Open" },
      { label: "In Progress", path: "/dashboard/kemework/my-tasks?status=In Progress" },
      { label: "Completed", path: "/dashboard/kemework/my-tasks?status=Completed" },
      { label: "Cancelled", path: "/dashboard/kemework/my-tasks?status=Cancelled" },
    ]
  },
  {
    icon: "🛍", label: "My Orders", children: [
      { label: "All Orders", path: "/dashboard/kemework/orders" },
      { label: "Track Active Orders", path: "/dashboard/kemework/orders?status=In Progress" },
      { label: "Order History", path: "/dashboard/kemework/orders?status=Completed" },
      { label: "Disputes", path: "/dashboard/kemework/orders?status=Disputed" },
    ]
  },
  {
    icon: "🔖", label: "Bookmarked", children: [
      { label: "Saved Tasks", path: "/dashboard/kemework/bookmarks?type=tasks" },
      { label: "Saved Services", path: "/dashboard/kemework/bookmarks?type=services" },
      { label: "Saved Professionals", path: "/dashboard/kemework/bookmarks?type=professionals" },
    ]
  },
  { icon: "⭐", label: "My Reviews", path: "/dashboard/kemework/reviews" },
  { icon: "💬", label: "Messages", path: "/dashboard/messages" },
  { icon: "💳", label: "Payment Methods", path: "/dashboard/payment-methods" },
  {
    icon: "👤", label: "Account", children: [
      { label: "My Profile", path: "/dashboard/profile" },
      { label: "Notifications", path: "/dashboard/notifications" },
      { label: "Settings", path: "/dashboard/settings" },
    ]
  },
];

function NavItem({ item, onClose }) {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const isActive = item.path && location.pathname === item.path;

  if (item.children) {
    return (
      <div>
        <button
          onClick={() => setOpen(o => !o)}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-gray-100 transition-colors"
        >
          <span className="text-lg w-6 flex-shrink-0">{item.icon}</span>
          <span className="flex-1 text-left text-sm font-semibold text-gray-800">{item.label}</span>
          {open ? <ChevronDown size={14} className="text-gray-400" /> : <ChevronRight size={14} className="text-gray-400" />}
        </button>
        {open && (
          <div className="ml-9 mt-1 flex flex-col gap-0.5">
            {item.children.map(c => (
              <Link key={c.path} to={c.path} onClick={onClose}
                className="text-sm text-gray-600 px-3 py-2 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors">
                {c.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link to={item.path} onClick={onClose}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-colors ${isActive ? "bg-teal-50 text-teal-700" : "hover:bg-gray-100 text-gray-800"}`}>
      <span className="text-lg w-6 flex-shrink-0">{item.icon}</span>
      <span className="text-sm font-semibold">{item.label}</span>
    </Link>
  );
}

export default function KemeworkCustomerDrawer({ isOpen, onClose, user }) {
  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 shadow-2xl flex flex-col transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center text-lg">🔧</div>
            <div>
              <p className="font-black text-gray-900 text-sm">{user?.full_name || "Guest"}</p>
              <p className="text-xs text-teal-600 font-semibold">Kemework Customer</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg"><X size={18} className="text-gray-500" /></button>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto py-3 px-3">
          <p className="text-[10px] font-black text-teal-600 uppercase tracking-widest px-4 mb-2">🔧 KEMEWORK</p>
          <div className="flex flex-col gap-0.5">
            {NAV.map((item, i) => <NavItem key={i} item={item} onClose={onClose} />)}
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-100 p-4">
          <Link to="/kemework" onClick={onClose} className="block text-center text-xs font-bold text-teal-600 hover:text-teal-700">
            Go to Kemework Marketplace →
          </Link>
        </div>
      </div>
    </>
  );
}