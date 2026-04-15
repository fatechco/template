"use client";
// @ts-nocheck

import Link from "next/link";
import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useModules } from "@/lib/module-context";
import { Menu, X, ChevronDown, Plus, Search, Globe, User, LogOut, Bell, Building2, Hammer, ShoppingBag } from "lucide-react";

const MODULE_LINKS = [
  { id: "kemedar", label: "Kemedar", labelAr: "\u0643\u064A\u0645\u064A\u062F\u0627\u0631", href: "/", icon: Building2, color: "text-blue-600" },
  { id: "kemework", label: "Kemework", labelAr: "\u0643\u064A\u0645\u064A\u0648\u0631\u0643", href: "/kemework", icon: Hammer, color: "text-orange-600" },
  { id: "kemetro", label: "Kemetro", labelAr: "\u0643\u064A\u0645\u064A\u062A\u0631\u0648", href: "/kemetro", icon: ShoppingBag, color: "text-green-600" },
];

const NAV_ITEMS = [
  {
    label: "Properties",
    href: "/search/properties",
    children: [
      { label: "Buy Property", href: "/search/properties?purpose=sale" },
      { label: "Rent Property", href: "/search/properties?purpose=rent" },
      { label: "New Projects", href: "/search/projects" },
      { label: "Auctions", href: "/kemedar/auctions" },
      { label: "KemeFrac Investment", href: "/kemefrac" },
    ],
  },
  {
    label: "AI Tools",
    href: "#",
    children: [
      { label: "AI Property Search", href: "/kemedar/ai-search" },
      { label: "Price Prediction", href: "/kemedar/predict" },
      { label: "Property Match", href: "/kemedar/match" },
      { label: "Life Score", href: "/kemedar/life-score" },
      { label: "KemeAdvisor", href: "/kemedar/advisor" },
      { label: "Vision Analysis", href: "/kemedar/vision" },
    ],
  },
  {
    label: "Services",
    href: "/kemework",
    children: [
      { label: "Find Professionals", href: "/kemework/professionals" },
      { label: "Post a Task", href: "/kemework/post-task" },
      { label: "Snap & Fix", href: "/kemework/snap-fix" },
      { label: "Finishing Projects", href: "/kemedar/finish" },
    ],
  },
  {
    label: "Marketplace",
    href: "/kemetro",
    children: [
      { label: "Building Materials", href: "/kemetro/search" },
      { label: "Flash Deals", href: "/kemetro/flash" },
      { label: "KemeKits", href: "/kemetro/kemekits" },
      { label: "Surplus Market", href: "/kemetro/surplus" },
      { label: "Shop the Look", href: "/kemetro/shop-the-look" },
    ],
  },
  {
    label: "Find",
    href: "#",
    children: [
      { label: "Agents", href: "/find/agents" },
      { label: "Agencies", href: "/find/agencies" },
      { label: "Developers", href: "/find/developers" },
      { label: "Franchise Owners", href: "/find/franchise-owners" },
    ],
  },
];

export function SiteHeader() {
  const { user, isAuthenticated, logout } = useAuth();
  const { isModuleEnabled } = useModules();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white border-b shadow-sm">
      {/* Top Bar */}
      <div className="bg-slate-900 text-white">
        <div className="container mx-auto max-w-7xl px-4 py-1.5 flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {MODULE_LINKS.filter((m) => isModuleEnabled(m.id)).map((mod) => (
              <Link key={mod.id} href={mod.href} className={`flex items-center gap-1 hover:opacity-80 ${mod.color}`}>
                <mod.icon className="w-3.5 h-3.5" />
                <span>{mod.label}</span>
              </Link>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1 hover:text-blue-300">
              <Globe className="w-3.5 h-3.5" />
              <span>EN</span>
            </button>
            {isAuthenticated ? (
              <div className="flex items-center gap-2">
                <Link href="/dashboard/notifications" className="relative">
                  <Bell className="w-4 h-4" />
                </Link>
                <Link href="/dashboard" className="flex items-center gap-1 hover:text-blue-300">
                  <User className="w-3.5 h-3.5" />
                  <span>{user?.name || "Dashboard"}</span>
                </Link>
                <button onClick={logout} className="hover:text-red-300">
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login" className="hover:text-blue-300">Sign In</Link>
                <Link href="/register" className="bg-blue-600 px-3 py-0.5 rounded text-xs hover:bg-blue-700">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Nav */}
      <div className="container mx-auto max-w-7xl px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">K</div>
            <span className="text-xl font-bold text-slate-900">Kemedar</span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div
                key={item.label}
                className="relative"
                onMouseEnter={() => setActiveDropdown(item.label)}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <Link
                  href={item.href}
                  className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-700 hover:text-blue-600 rounded-md hover:bg-slate-50"
                >
                  {item.label}
                  {item.children && <ChevronDown className="w-3.5 h-3.5" />}
                </Link>
                {item.children && activeDropdown === item.label && (
                  <div className="absolute top-full left-0 w-56 bg-white border rounded-lg shadow-xl py-2 z-50">
                    {item.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-600"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="hidden lg:flex items-center gap-2">
            <Link href="/search/properties" className="p-2 text-slate-500 hover:text-blue-600">
              <Search className="w-5 h-5" />
            </Link>
            {isAuthenticated && (
              <div className="relative group">
                <button className="flex items-center gap-1 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                  Add
                </button>
                <div className="absolute right-0 top-full hidden group-hover:block w-48 bg-white border rounded-lg shadow-xl py-2 z-50">
                  <Link href="/create-property" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50">List Property</Link>
                  <Link href="/create-project" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50">Add Project</Link>
                  <Link href="/create-buy-request" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50">Post Buy Request</Link>
                  <Link href="/kemework/post-task" className="block px-4 py-2 text-sm text-slate-700 hover:bg-blue-50">Post Task</Link>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="lg:hidden p-2" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="lg:hidden border-t py-4 space-y-2">
            {NAV_ITEMS.map((item) => (
              <div key={item.label}>
                <Link href={item.href} className="block px-4 py-2 font-medium text-slate-800" onClick={() => setMobileOpen(false)}>
                  {item.label}
                </Link>
                {item.children?.map((child) => (
                  <Link key={child.label} href={child.href} className="block px-8 py-1.5 text-sm text-slate-600" onClick={() => setMobileOpen(false)}>
                    {child.label}
                  </Link>
                ))}
              </div>
            ))}
            {!isAuthenticated && (
              <div className="px-4 pt-4 flex gap-2">
                <Link href="/login" className="flex-1 text-center border border-blue-600 text-blue-600 py-2 rounded-lg" onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/register" className="flex-1 text-center bg-blue-600 text-white py-2 rounded-lg" onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
