import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, X } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

const ALL_ITEMS = [
  {
    id: "property",
    emoji: "🏠",
    iconBg: "#FF6B00",
    title: "Property",
    sub: "List a property for sale or rent",
    path: "/mobile/add-property",
    roles: ["admin", "agent", "agency", "developer", "franchise_owner", "user"],
  },
  {
    id: "buy-request",
    emoji: "📋",
    iconBg: "#3B82F6",
    title: "Property Buy Request",
    sub: "Tell sellers what you're looking for",
    path: "/mobile/add-buy-request",
    roles: ["admin", "agent", "agency", "developer", "franchise_owner", "user"],
  },
  {
    id: "project",
    emoji: "🏗",
    iconBg: "#1a1a2e",
    title: "Project",
    sub: "Add a new real estate project",
    path: "/mobile/add-project",
    roles: ["admin", "agent", "agency", "developer", "franchise_owner", "user"],
  },
  {
    id: "service",
    emoji: "🔧",
    iconBg: "#0D9488",
    title: "Service",
    sub: "Offer a professional service",
    path: "/dashboard/kemework",
    roles: ["admin", "agent", "agency", "developer", "franchise_owner", "user"],
  },
  {
    id: "task",
    emoji: "📋",
    iconBg: "#7C3AED",
    title: "Task",
    sub: "Post a task for handymen",
    path: "/dashboard/kemedar-tasks",
    roles: ["admin", "agent", "agency", "developer", "franchise_owner", "user"],
  },
  {
    id: "product",
    emoji: "📦",
    iconBg: "#1D4ED8",
    title: "Product",
    sub: "Add a product to Kemetro store",
    path: "/kemetro/seller/add-product",
    roles: ["admin", "franchise_owner"],
  },
  {
    id: "rfq",
    emoji: "📝",
    iconBg: "#16A34A",
    title: "RFQ",
    sub: "Request for quotation on products",
    path: "/kemetro/search",
    roles: ["admin", "agent", "agency", "developer", "franchise_owner", "user"],
  },
];

function AddItem({ item, onSelect }) {
  return (
    <button
      onClick={() => onSelect(item.path)}
      className="w-full flex items-center gap-4 px-5 py-0 hover:bg-[#F9FAFB] active:bg-[#F3F4F6] transition-colors"
      style={{ minHeight: 64 }}
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-xl"
        style={{ backgroundColor: item.iconBg + "22" }}
      >
        <span style={{ fontSize: 22 }}>{item.emoji}</span>
      </div>
      <div className="flex-1 text-left">
        <p className="text-sm font-bold text-[#1F2937] leading-tight">{item.title}</p>
        <p className="text-xs text-[#6B7280] leading-tight mt-0.5">{item.sub}</p>
      </div>
      <ChevronRight size={16} className="text-[#9CA3AF] flex-shrink-0" />
    </button>
  );
}

export default function MobileAddSheet({ open, onClose }) {
  const navigate = useNavigate();
  const sheetRef = useRef(null);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  // Close on backdrop click
  const handleBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  // Prevent body scroll when open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const handleSelect = (path) => {
    onClose();
    navigate(path);
  };

  const role = user?.role || "user";
  const isLoggedIn = !!user;

  const visibleItems = ALL_ITEMS.filter((item) => item.roles.includes(role));

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-[200] flex items-end"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleBackdrop}
    >
      <div
        ref={sheetRef}
        className="w-full bg-white flex flex-col"
        style={{
          borderTopLeftRadius: 24,
          borderTopRightRadius: 24,
          maxHeight: "75vh",
          animation: "slideUp 0.25s ease-out",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-1 flex-shrink-0">
          <div className="w-10 h-1 bg-[#D1D5DB] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-start justify-between px-5 pt-3 pb-4 flex-shrink-0">
          <div>
            <p className="text-lg font-black text-[#1F2937]">What would you like to add?</p>
            <p className="text-sm text-[#6B7280] mt-0.5">Choose a listing type</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F3F4F6] flex items-center justify-center mt-0.5 flex-shrink-0"
          >
            <X size={16} className="text-[#6B7280]" />
          </button>
        </div>

        {/* Divider */}
        <div className="h-px bg-[#F3F4F6] mx-5 flex-shrink-0" />

        {/* Items list */}
        <div className="flex-1 overflow-y-auto divide-y divide-[#F3F4F6]">
          {(isLoggedIn ? visibleItems : ALL_ITEMS.slice(0, 4)).map((item) => (
            <AddItem key={item.id} item={item} onSelect={handleSelect} />
          ))}
        </div>

        {/* Footer: not logged in banner */}
        {!isLoggedIn && (
          <div className="flex-shrink-0 mx-4 mb-4 mt-3 bg-orange-50 border border-orange-200 rounded-2xl px-4 py-3">
            <p className="text-sm font-bold text-[#1F2937] mb-2">Sign in to add listings</p>
            <div className="flex gap-2">
              <button
                onClick={() => { onClose(); base44.auth.redirectToLogin(); }}
                className="flex-1 bg-[#FF6B00] text-white font-bold py-2 rounded-xl text-sm"
              >
                Sign In
              </button>
              <button
                onClick={() => { onClose(); base44.auth.redirectToLogin(); }}
                className="flex-1 border border-[#FF6B00] text-[#FF6B00] font-bold py-2 rounded-xl text-sm"
              >
                Create Account
              </button>
            </div>
          </div>
        )}

        {/* Safe area */}
        <div style={{ height: "env(safe-area-inset-bottom, 12px)" }} className="flex-shrink-0" />
      </div>

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}