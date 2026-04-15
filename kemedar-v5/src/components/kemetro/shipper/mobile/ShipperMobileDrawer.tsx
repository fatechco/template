"use client";
// @ts-nocheck
import { useState } from "react";
import { useNavigate, useLocation } from "next/navigation";
import { X, ChevronDown, ChevronRight } from "lucide-react";
import { base44 } from "@/lib/api-client";

const MENU = [
  { label: "Overview", path: "/m/kemetro/shipper/dashboard", icon: "📊" },
  { sectionLabel: "SHIPPER CENTER", color: "#10B981" },
  { label: "Active Shipments", icon: "🚚", path: "/m/kemetro/shipper/active" },
  { label: "Shipment Requests", icon: "📋", path: "/m/kemetro/shipper/requests" },
  { label: "Completed", icon: "✓", path: "/m/kemetro/shipper/completed" },
  { label: "Earnings", icon: "💰", path: "/m/kemetro/shipper/earnings" },
  { label: "Payouts", icon: "💳", path: "/m/kemetro/shipper/payout" },
  { sectionLabel: "PROFILE", color: "#6B7280" },
  { label: "Setup", icon: "⚙️", path: "/m/kemetro/shipper/setup" },
  { label: "Documents", icon: "📄", path: "/m/kemetro/shipper/documents" },
  { label: "Reviews", icon: "⭐", path: "/m/kemetro/shipper/reviews" },
];

function MenuItem({ item, location, onNavigate }) {
  const isActive = (path) => path && pathname === path.split("?")[0];

  if (item.sectionLabel) {
    return (
      <div className="px-4 pt-4 pb-1">
        <p className="text-[10px] font-black uppercase tracking-wider" style={{ color: item.color || "#9CA3AF" }}>{item.sectionLabel}</p>
      </div>
    );
  }

  const active = isActive(item.path);
  return (
    <button onClick={() => onNavigate(item.path)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-l-[3px] ${
        active ? "bg-[#ECFDF5] text-[#10B981] border-[#10B981] font-bold" : "text-gray-800 hover:bg-gray-50 border-transparent"
      }`}>
      <span className="text-base w-5 text-center flex-shrink-0">{item.icon}</span>
      <span className="text-sm font-medium">{item.label}</span>
    </button>
  );
}

export default function ShipperMobileDrawer({ isOpen, onClose, user }) {
  const navigate = useNavigate();
  const pathname = usePathname();

  const handleNavigate = (path) => { navigate(path); onClose(); };

  const initials = user?.full_name?.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase() || "SH";

  if (!isOpen) return null;

  return (
    <>
      {isOpen && <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} />}
      <div className={`absolute left-0 top-0 h-full z-50 bg-white flex flex-col overflow-hidden transition-transform ${isOpen ? "translate-x-0" : "-translate-x-full"}`} style={{ width: "85%", maxWidth: 320 }}>
        <button onClick={onClose} className="absolute top-3 right-3 p-1.5 hover:bg-gray-100 rounded-lg z-10">
          <X size={18} className="text-gray-500" />
        </button>

        <div className="px-4 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0" style={{ background: "#10B981" }}>
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{user?.full_name || "Shipper"}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email}</p>
              <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-white text-[10px] font-bold" style={{ background: "#10B981" }}>Logistics Partner</span>
            </div>
          </div>
          <button className="text-xs font-bold text-[#10B981] hover:underline" onClick={() => handleNavigate("/m/kemetro/shipper/setup")}>
            Edit Setup →
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto">
          {MENU.map((item, idx) => (
            <MenuItem key={idx} item={item} location={location} onNavigate={handleNavigate} />
          ))}
        </nav>

        <div className="border-t border-gray-100 px-4 py-4 flex-shrink-0 bg-gray-50">
          <p className="text-[9px] font-black text-gray-400 uppercase tracking-wider mb-2">ACTIVE ROLE</p>
          <div className="w-full px-3 py-2.5 rounded-lg text-white text-sm font-bold flex items-center justify-between" style={{ background: "#10B981" }}>
            <span>🚚 Logistics Partner</span>
          </div>
          <button onClick={() => base44.auth.logout()} className="w-full mt-2 px-4 py-2.5 bg-red-600 text-white font-bold text-sm rounded-lg">
            Sign Out
          </button>
        </div>
      </div>
    </>
  );
}