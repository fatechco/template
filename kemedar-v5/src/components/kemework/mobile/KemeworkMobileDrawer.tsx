"use client";
// @ts-nocheck
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { X, ChevronDown } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const MENU = [
  { icon: "🏠", label: "Home", path: "/kemework" },
  { icon: "🔍", label: "Find Professionals", path: "/kemework/find-professionals" },
  { icon: "📋", label: "Browse Tasks", path: "/kemework/tasks" },
  { icon: "🔧", label: "Browse Services", path: "/kemework/services" },
  { icon: "🏢", label: "Service Companies", path: "/kemework/service-companies" },
  { icon: "📢", label: "Find Marketer", path: "/kemework/find-marketer" },
  { icon: "ℹ️", label: "How It Works", path: "/kemework/how-it-works" },
  { icon: "🏅", label: "Preferred Program", path: "/kemework/accreditation" },
  { divider: true },
  { icon: "👤", label: "My Profile", path: "/kemework/profile", authRequired: true },
  { icon: "📦", label: "My Orders", path: "/kemework/orders", authRequired: true },
  { icon: "💬", label: "Messages", path: "/kemework/messages", authRequired: true },
];

const MODULES = [
  { label: "🏠 Kemedar®", path: "/" },
  { label: "🔧 Kemework®", path: "/kemework", active: true },
  { label: "🛒 Kemetro®", path: "/kemetro" },
];

export default function KemeworkMobileDrawer({ isOpen, onClose, user }) {
  const router = useRouter();
  const pathname = usePathname();

  if (!isOpen) return null;

  const handleNav = (path) => {
    router.push(path);
    onClose();
  };

  const handleSignOut = () => {
    /* TODO: logout */;
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] overflow-hidden">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="absolute left-0 top-0 h-full w-[280px] bg-white flex flex-col overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b" style={{ borderColor: "#f0e8e8" }}>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: "#C41230" }}>K</div>
            <span className="font-black text-sm" style={{ color: "#1a1a2e" }}>Kemework®</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-gray-100">
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        {/* User info */}
        {user && (
          <div className="px-4 py-3 border-b" style={{ borderColor: "#f0e8e8", background: "#FFF5F5" }}>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#C41230" }}>
                {user.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U"}
              </div>
              <div>
                <p className="font-bold text-sm text-gray-900">{user.full_name}</p>
                <p className="text-xs text-gray-500">{user.email}</p>
              </div>
            </div>
          </div>
        )}

        {/* Menu items */}
        <div className="flex-1 py-2">
          {MENU.map((item, idx) => {
            if (item.divider) return <div key={idx} className="mx-4 my-2 border-t border-gray-100" />;
            if (item.authRequired && !user) return null;
            const isActive = pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => handleNav(item.path)}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors"
                style={{ color: isActive ? "#C41230" : "#374151", background: isActive ? "#FFF5F5" : "transparent" }}
              >
                <span className="text-base w-5 text-center">{item.icon}</span>
                <span className={`text-sm ${isActive ? "font-bold" : "font-medium"}`}>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Sign out */}
        {user && (
          <div className="px-4 py-3 border-t border-gray-100">
            <button onClick={handleSignOut} className="w-full py-2.5 rounded-lg text-sm font-bold text-white transition-colors" style={{ background: "#C41230" }}>
              🚪 Sign Out
            </button>
          </div>
        )}

        {/* Module switcher */}
        <div className="px-4 py-3 border-t" style={{ borderColor: "#f0e8e8", background: "#1a1a2e" }}>
          <p className="text-[10px] font-black uppercase tracking-wider text-white/40 mb-2">Switch Module</p>
          <div className="flex flex-col gap-1">
            {MODULES.map(mod => (
              <button
                key={mod.label}
                onClick={() => { router.push(mod.path); onClose(); }}
                className="text-left px-3 py-2 rounded-lg text-xs font-bold transition-colors"
                style={{ background: mod.active ? "#C41230" : "rgba(255,255,255,0.08)", color: "#fff" }}
              >
                {mod.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}