"use client";
// @ts-nocheck
import { useRouter, usePathname } from "next/navigation";
import { Settings, Search, Plus, ClipboardList, User, Award } from "lucide-react";

const TABS = [
  { id: "settings", label: "Settings", icon: Settings, path: "/kemework/settings" },
  { id: "find",     label: "Find",     icon: Search,        path: "/kemework/find-professionals" },
  { id: "post",     label: "Post Task", icon: Plus,         path: "/kemework/post-task", fab: true },
  { id: "tasks",    label: "Tasks",    icon: ClipboardList, path: "/kemework/tasks" },
  { id: "accredit", label: "Be Accredited", icon: Award,    path: "/m/kemework/be-accredited" },
  { id: "account",  label: "Account",  icon: User,          path: "/kemework/profile" },
];

export default function KemeworkMobileBottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = (tab) => pathname.startsWith(tab.path);

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 flex items-end"
      style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)", minHeight: 64 }}
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const active = isActive(tab);

        if (tab.fab) {
          return (
            <button
              key={tab.id}
              onClick={() => router.push(tab.path)}
              className="flex-1 flex flex-col items-center justify-end pb-2"
              style={{ minHeight: 64 }}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center -mt-5"
                style={{ background: "#C41230", boxShadow: "0 4px 20px rgba(196,18,48,0.45)" }}
              >
                <Icon size={26} color="white" strokeWidth={2.5} />
              </div>
              <span className="text-[10px] font-medium text-gray-500 mt-1">{tab.label}</span>
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
            <Icon size={24} color={active ? "#C41230" : "#9CA3AF"} strokeWidth={active ? 2.5 : 1.8} />
            <span className="text-[10px] mt-0.5 font-medium" style={{ color: active ? "#C41230" : "#9CA3AF" }}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}