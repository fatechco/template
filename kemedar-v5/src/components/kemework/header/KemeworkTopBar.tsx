"use client";
// @ts-nocheck
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, DollarSign, ChevronDown, UserPlus, LogIn, Home, Wrench, ShoppingCart } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import CountrySwitcher from "@/components/ui/CountrySwitcher";

const LANGUAGES = ["English", "العربية", "Español", "Français", "Русский", "Türk", "Português"];
const CURRENCIES = ["USD", "EGP", "EUR", "AED", "SAR", "GBP", "QAR", "KWD"];
const COUNTRIES = [
  { name: "Egypt", flag: "🇪🇬" }, { name: "UAE", flag: "🇦🇪" }, { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Qatar", flag: "🇶🇦" }, { name: "Kuwait", flag: "🇰🇼" }, { name: "Jordan", flag: "🇯🇴" },
];

const APP_SWITCHERS = [
  { name: "Kemedar®", icon: Home, to: "/" },
  { name: "Kemework®", icon: Wrench, to: "/kemework" },
  { name: "Kemetro®", icon: ShoppingCart, to: "/kemetro" },
];

function TopBarDropdown({ icon: Icon, items, renderItem, renderLabel }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(items[0]);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-gray-300 hover:text-white text-xs px-2 py-1 rounded hover:bg-white/10 transition-colors">
        {Icon && <Icon size={13} />}
        <span>{renderLabel ? renderLabel(selected) : selected}</span>
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-[200] min-w-[160px]">
          {items.map((item, i) => (
            <button key={i} onClick={() => { setSelected(item); setOpen(false); }}
              className="w-full text-left px-4 py-2 text-sm hover:bg-red-50 hover:text-red-700 transition-colors text-gray-700">
              {renderItem ? renderItem(item) : item}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function KemeworkTopBar() {
  const pathname = usePathname();
  const activeApp = pathname.startsWith("/kemetro") ? "/kemetro" : pathname.startsWith("/kemework") ? "/kemework" : "/";

  return (
    <div className="w-full bg-[#1a1a2e] border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 h-9 flex items-center justify-between">
        {/* App Switchers */}
        <div className="flex items-center gap-0.5">
          {APP_SWITCHERS.map(({ name, icon: Icon, to }) => (
            <Link key={name} href={to || "#"}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all ${
                activeApp === to ? "bg-[#C41230] text-white" : "text-gray-400 hover:text-white hover:bg-white/10"
              }`}>
              <Icon size={12} />
              {name}
            </Link>
          ))}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1">
          <CountrySwitcher />
          <div className="w-px h-4 bg-white/20 mx-1" />
          <LanguageSwitcher variant="topbar" />
          <div className="w-px h-4 bg-white/20 mx-1" />
          <TopBarDropdown icon={DollarSign} items={CURRENCIES} />
          <div className="w-px h-4 bg-white/20 mx-1" />
          <button className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white border border-gray-500 hover:border-white rounded px-3 py-1 transition-colors ml-1">
            <UserPlus size={12} /> Sign Up
          </button>
          <button className="flex items-center gap-1.5 text-xs bg-[#C41230] hover:bg-[#a50f28] text-white rounded px-3 py-1 transition-colors font-medium ml-1">
            <LogIn size={12} /> Sign In
          </button>
          <div className="w-px h-4 bg-white/20 mx-1" />
          <a href="#" className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white border border-gray-500 hover:border-white rounded px-3 py-1 transition-colors ml-1">
            📱 Download App
          </a>
        </div>
      </div>
    </div>
  );
}