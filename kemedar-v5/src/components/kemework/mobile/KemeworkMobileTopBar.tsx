"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, Search, MessageSquare, Bell } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import KemeworkMobileDrawer from "./KemeworkMobileDrawer";

export default function KemeworkMobileTopBar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    apiClient.get("/api/auth/session").then(setUser).catch(() => setUser(null));
  }, []);

  return (
    <>
      <KemeworkMobileDrawer isOpen={drawerOpen} onClose={() => setDrawerOpen(false)} user={user} />

      <div className="sticky top-0 z-50 bg-white flex items-center px-4 h-14" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        {/* Hamburger */}
        <button onClick={() => setDrawerOpen(true)} className="p-1 -ml-1 mr-2">
          <Menu size={24} className="text-gray-700" />
        </button>

        {/* Logo */}
        <button onClick={() => router.push("/kemework")} className="flex items-center gap-2 flex-1 justify-center">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-white font-black text-sm" style={{ background: "#C41230" }}>K</div>
          <span className="font-black text-sm" style={{ color: "#1a1a2e" }}>Kemework®</span>
        </button>

        {/* Right icons */}
        <div className="flex items-center gap-1">
          <button onClick={() => router.push("/kemework/search")} className="p-2 rounded-lg">
            <Search size={20} className="text-gray-600" />
          </button>
          <button onClick={() => router.push("/kemework/messages")} className="relative p-2 rounded-lg">
            <MessageSquare size={20} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full text-white text-[8px] font-black flex items-center justify-center" style={{ background: "#C41230" }}>3</span>
          </button>
          <button onClick={() => router.push("/kemework/notifications")} className="relative p-2 rounded-lg">
            <Bell size={20} className="text-gray-600" />
            <span className="absolute top-1.5 right-1.5 w-3.5 h-3.5 rounded-full text-white text-[8px] font-black flex items-center justify-center" style={{ background: "#C41230" }}>2</span>
          </button>
        </div>
      </div>
    </>
  );
}