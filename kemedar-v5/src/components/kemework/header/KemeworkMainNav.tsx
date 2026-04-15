"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, MessageSquare, Bell, ChevronDown } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import KemeworkCategoriesMega from "./KemeworkCategoriesMega";
import KemeworkUserDropdown from "./KemeworkUserDropdown";
import KemeworkSearchOverlay from "./KemeworkSearchOverlay";
import InnovativeMenu from "@/components/header/InnovativeMenu";

export default function KemeworkMainNav() {
  const [user, setUser] = useState(null);
  const [showCategories, setShowCategories] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showInnovative, setShowInnovative] = useState(false);
  const router = useRouter();

  useEffect(() => {
    apiClient.get("/api/auth/session").then(setUser).catch(() => setUser(null));
  }, []);

  const initials = user?.full_name?.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <>
      {showSearch && <KemeworkSearchOverlay onClose={() => setShowSearch(false)} />}

      <div className="w-full bg-white h-16 flex items-center px-4" style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
        <div className="max-w-[1400px] mx-auto w-full flex items-center gap-6">

          {/* Logo */}
          <Link href="/kemework" className="flex-shrink-0">
            <img
              src="https://media.base44.com/images/public/69b5eafc884b1597fb3ea66e/2bde78c0d_final-logo.png"
              alt="Kemework"
              className="h-10 w-auto object-contain"
            />
          </Link>

          {/* Nav items */}
          <nav className="flex items-center gap-1 flex-1">
            {/* Categories dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowCategories(true)}
              onMouseLeave={() => setShowCategories(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#C41230] rounded-lg hover:bg-red-50 transition-colors">
                Categories <ChevronDown size={14} className={`transition-transform ${showCategories ? "rotate-180" : ""}`} />
              </button>
              {showCategories && <KemeworkCategoriesMega onClose={() => setShowCategories(false)} />}
            </div>

            <Link href="/kemework/find-professionals" className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#C41230] rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
              Find Professionals
            </Link>
            <Link href="/kemework/find-marketer" className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#C41230] rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
              Find Marketer
            </Link>
            <Link href="/kemework/service-companies" className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#C41230] rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
              Service Companies
            </Link>

            <Link
              href="/kemework/tasks"
              className="px-3 py-1.5 text-sm font-bold rounded-lg border-2 transition-colors whitespace-nowrap"
              style={{ borderColor: "#C41230", color: "#C41230" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#C41230"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#C41230"; }}
            >
              Tasks
            </Link>

            <Link
              href="/kemework/services"
              className="px-3 py-1.5 text-sm font-bold rounded-lg transition-colors whitespace-nowrap text-white"
              style={{ background: "#C41230" }}
              onMouseEnter={e => { e.currentTarget.style.background = "#a01026"; }}
              onMouseLeave={e => { e.currentTarget.style.background = "#C41230"; }}
            >
              Services
            </Link>

            <Link href="/kemework/how-it-works" className="px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#C41230] rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
              How It Works
            </Link>

            {/* Innovative dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setShowInnovative(true)}
              onMouseLeave={() => setShowInnovative(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 text-sm font-semibold text-gray-700 hover:text-[#C41230] rounded-lg hover:bg-red-50 transition-colors whitespace-nowrap">
                🧠 ThinkDar™ AI <ChevronDown size={14} className={`transition-transform ${showInnovative ? "rotate-180" : ""}`} />
              </button>
              {showInnovative && <InnovativeMenu />}
            </div>
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Search */}
            <button onClick={() => setShowSearch(true)} className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Search size={20} className="text-gray-600" />
            </button>

            {/* Messages */}
            <button onClick={() => router.push("/kemework/messages")} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <MessageSquare size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center" style={{ background: "#C41230" }}>3</span>
            </button>

            {/* Notifications */}
            <button onClick={() => router.push("/kemework/notifications")} className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell size={20} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-4 h-4 rounded-full text-white text-[9px] font-black flex items-center justify-center" style={{ background: "#C41230" }}>2</span>
            </button>

            {/* Auth */}
            {!user ? (
              <div className="flex items-center gap-2">
                <Link
                  href="/m/login"
                  className="px-4 py-1.5 text-sm font-bold rounded-lg border-2 transition-colors"
                  style={{ borderColor: "#C41230", color: "#C41230" }}
                >
                  Sign In
                </Link>
                <Link
                  href="/m/register"
                  className="px-4 py-1.5 text-sm font-bold rounded-lg text-white transition-colors"
                  style={{ background: "#C41230" }}
                >
                  Register
                </Link>
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(s => !s)}
                  className="flex items-center gap-2 px-2 py-1 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: "#C41230" }}>
                    {initials}
                  </div>
                  <ChevronDown size={14} className="text-gray-500" />
                </button>
                {showUserMenu && (
                  <KemeworkUserDropdown user={user} onClose={() => setShowUserMenu(false)} />
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}