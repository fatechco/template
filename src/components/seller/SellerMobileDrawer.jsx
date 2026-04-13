import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { base44 } from "@/api/base44Client";

const MENU = [
  { label: "Overview", path: "/m/dashboard/seller-dashboard", icon: "📊" },
  { sectionLabel: "KEMETRO SELLING", color: "#0077B6" },
  { label: "My Store", icon: "🏪", path: "/m/dashboard/seller-dashboard" },
  { label: "Edit Store", icon: "✏️", path: "/m/dashboard/seller-edit-store" },
  { label: "Store Overview", icon: "📊", path: "/m/dashboard/seller-store-overview" },
  { label: "My Products", icon: "📦", path: "/m/dashboard/seller-products" },
  { label: "Orders", icon: "🛍", path: "/m/dashboard/seller-orders" },
  { label: "Shipments", icon: "🚚", path: "/m/dashboard/seller-shipments" },
  { label: "Earnings", icon: "💰", path: "/m/dashboard/seller-earnings" },
  { label: "Reviews", icon: "⭐", path: "/m/dashboard/seller-reviews" },
  { label: "Analytics", icon: "📊", path: "/m/dashboard/seller-analytics" },
  { label: "Promotions", icon: "📢", path: "/m/dashboard/seller-promotions" },
  { label: "Coupons", icon: "🎫", path: "/m/dashboard/seller-coupons" },
  { label: "Shipping", icon: "🚚", path: "/m/dashboard/shipping-settings" },
  { label: "Store Settings", icon: "⚙️", path: "/m/dashboard/seller-store-settings" },
  { sectionLabel: "ACCOUNT", color: "#6B7280" },
  { label: "My Profile", icon: "👤", path: "/m/dashboard/profile" },
  { label: "Payment Methods", icon: "💰", path: "/m/dashboard/payment-methods" },
  { label: "Settings", icon: "⚙️", path: "/m/settings" },
];

function MenuItem({ item, location, onNavigate }) {
  const [open, setOpen] = useState(false);
  const isActive = (path) => path && location.pathname === path.split("?")[0];

  if (item.sectionLabel) {
    return (
      <div className="px-4 pt-4 pb-1">
        <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: item.color || "#9CA3AF" }}>{item.sectionLabel}</p>
      </div>
    );
  }

  if (item.children) {
    const hasActive = item.children.some(c => isActive(c.path));
    return (
      <div>
        <button
          onClick={() => { if (item.path) onNavigate(item.path); else setOpen(o => !o); }}
          className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-[3px] ${
            hasActive ? "bg-[#FFF3E8] text-[#FF6B00] border-[#FF6B00]" : "text-gray-800 hover:bg-gray-50 border-transparent"
          }`}>
          <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
          <span className="flex-1 text-sm font-medium">{item.label}</span>
          <span onClick={e => { e.stopPropagation(); setOpen(o => !o); }} className="p-1">
            {open ? <ChevronDown size={15} className="text-gray-400" /> : <ChevronRight size={15} className="text-gray-400" />}
          </span>
        </button>
        {open && (
          <div style={{ background: "#FAFAFA" }}>
            {item.children.map(child => (
              <button key={child.path} onClick={() => onNavigate(child.path)}
                className={`w-full text-left px-4 py-2.5 text-xs pl-11 transition-colors ${
                  isActive(child.path) ? "bg-[#FFF3E8] text-[#FF6B00] font-bold" : "text-gray-600 hover:bg-gray-100"
                }`}>
                {child.label}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  const active = isActive(item.path);
  return (
    <button onClick={() => onNavigate(item.path)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-[3px] ${
        active ? "bg-[#FFF3E8] text-[#FF6B00] border-[#FF6B00] font-bold" : "text-gray-800 hover:bg-gray-50 border-transparent"
      }`}>
      <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
      <span className="text-sm font-medium">{item.label}</span>
    </button>
  );
}

export default function SellerMobileDrawer({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (path) => { navigate(path); onClose(); };

  const initials = user?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "PS";

  if (!isOpen) return null;

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}
      <div className={`absolute left-0 top-0 h-full z-50 bg-white flex flex-col overflow-hidden transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ width: "85%", maxWidth: 320 }}>
        {/* Close */}
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-lg z-10">
          <X size={18} className="text-gray-500" />
        </button>

        {/* Profile Header */}
        <div className="px-4 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "#0077B6" }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{user?.full_name || "Seller"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ background: "#0077B6" }}>Product Seller</span>
            </div>
          </div>
          <button className="text-xs font-bold text-[#FF6B00] hover:underline" onClick={() => handleNavigate("/m/dashboard/profile")}>
            Manage Profile →
          </button>
        </div>

        {/* Menu */}
        <nav className="flex-1 overflow-y-auto">
          {MENU.map((item, idx) => (
            <MenuItem key={idx} item={item} location={location} onNavigate={handleNavigate} />
          ))}
        </nav>

        {/* Footer */}
        <div className="border-t border-gray-100 px-4 py-4 flex-shrink-0 bg-gray-50">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-2">ACTIVE ROLE</p>
          <div className="w-full px-3 py-2.5 rounded-lg text-white text-sm font-bold flex items-center justify-between" style={{ background: "#0077B6" }}>
            <span>🏪 Product Seller</span>
          </div>
          <button onClick={() => base44.auth.logout()} className="w-full mt-2 px-4 py-2.5 bg-red-600 text-white font-bold text-sm rounded-lg">
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}