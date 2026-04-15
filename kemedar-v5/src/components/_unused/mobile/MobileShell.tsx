"use client";
// @ts-nocheck
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Settings, Search, Plus, Tag, User, Bell } from "lucide-react";
import MobileAddSheet from "./MobileAddSheet";

const MODULES = [
  { id: "kemedar", label: "Kemedar®", emoji: "🏠" },
  { id: "kemework", label: "Kemework®", emoji: "🔧" },
  { id: "kemetro", label: "Kemetro®", emoji: "🛒" },
];

const BOTTOM_TABS = [
  { id: "settings", label: "Settings", icon: Settings, path: "/mobile/settings" },
  { id: "find", label: "Find", icon: Search, path: "/mobile/find" },
  { id: "add", label: "Add", icon: Plus, path: "/mobile/add", fab: true },
  { id: "buy", label: "Buy", icon: Tag, path: "/mobile/buy" },
  { id: "account", label: "Account", icon: User, path: "/mobile/account" },
];

const MODULE_HOME = {
  kemedar: "/mobile/home",
  kemework: "/mobile/kemework",
  kemetro: "/mobile/kemetro-home",
};

export default function MobileShell() {
  const [activeModule, setActiveModule] = useState("kemedar");
  const [addSheetOpen, setAddSheetOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const activeTab = BOTTOM_TABS.find(t => pathname.startsWith(t.path))?.id || "";

  const handleModuleSwitch = (mod) => {
    setActiveModule(mod);
    router.push(MODULE_HOME[mod] || "/mobile/home");
  };

  return (
    <div className="flex flex-col h-screen bg-[#F8FAFC] overflow-hidden max-w-md mx-auto relative">
      {/* TOP MODULE SWITCHER */}
      <div className="sticky top-0 z-50 bg-white shadow-sm flex items-center">
        <div className="flex flex-1">
          {MODULES.map((mod) => (
            <button
              key={mod.id}
              onClick={() => handleModuleSwitch(mod.id)}
              className={`flex-1 flex flex-col items-center justify-center py-3 text-xs transition-all border-b-[3px] ${
                activeModule === mod.id
                  ? "border-[#FF6B00] text-[#1F2937]"
                  : "border-transparent text-[#6B7280]"
              }`}
              style={{ minHeight: 52 }}
            >
              <span className="text-base leading-tight">{mod.emoji}</span>
              <span className={`mt-0.5 text-[11px] ${activeModule === mod.id ? "font-black" : "font-medium"}`}>
                {mod.label}
              </span>
            </button>
          ))}
        </div>

        {/* Notification Bell */}
        <button className="relative px-4 py-3 flex-shrink-0" style={{ minHeight: 52, minWidth: 44 }}>
          <Bell size={22} className="text-[#1F2937]" />
          <span className="absolute top-2 right-3 w-4 h-4 bg-[#FF6B00] rounded-full text-white text-[9px] font-black flex items-center justify-center">
            3
          </span>
        </button>
      </div>

      {/* SCROLLABLE CONTENT AREA */}
      <div className="flex-1 overflow-y-auto pb-20">
        <Outlet context={{ activeModule }} />
      </div>

      {/* BOTTOM NAVIGATION BAR */}
      <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md z-50 bg-white border-t border-[#E5E7EB] flex items-end"
        style={{ paddingBottom: "env(safe-area-inset-bottom, 16px)" }}
      >
        {BOTTOM_TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.fab) {
            return (
              <button
                key={tab.id}
                onClick={() => setAddSheetOpen(true)}
                className="flex-1 flex flex-col items-center justify-end pb-2"
                style={{ minHeight: 64 }}
              >
                <div
                  className="w-14 h-14 rounded-full bg-[#FF6B00] flex items-center justify-center -mt-6"
                  style={{ boxShadow: "0 4px 20px rgba(255,107,0,0.45)" }}
                >
                  <Icon size={26} color="white" strokeWidth={2.5} />
                </div>
                <span className="text-[10px] font-medium text-[#6B7280] mt-1">{tab.label}</span>
              </button>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className="flex-1 flex flex-col items-center justify-center py-2 transition-colors"
              style={{ minHeight: 64 }}
            >
              <Icon
                size={24}
                color={isActive ? "#FF6B00" : "#9CA3AF"}
                strokeWidth={isActive ? 2.5 : 1.8}
              />
              <span
                className={`text-[10px] mt-0.5 font-medium ${isActive ? "text-[#FF6B00]" : "text-[#9CA3AF]"}`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
      <MobileAddSheet open={addSheetOpen} onClose={() => setAddSheetOpen(false)} />
    </div>
  );
}