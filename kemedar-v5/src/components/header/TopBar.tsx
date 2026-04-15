"use client";
// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Globe, DollarSign, ChevronDown, UserPlus, LogIn, Home, Wrench, ShoppingCart } from "lucide-react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import CountrySwitcher from "@/components/ui/CountrySwitcher";
import { useCurrency } from "@/lib/currency-context";
import { useIsMobile } from "@/hooks/use-mobile";
import { toast } from "sonner";

const CURRENCIES = ["EGP", "USD", "EUR", "AED", "SAR", "GBP", "QAR", "KWD"];
const COUNTRIES = [
  { name: "Egypt", flag: "🇪🇬" },
  { name: "UAE", flag: "🇦🇪" },
  { name: "Saudi Arabia", flag: "🇸🇦" },
  { name: "Qatar", flag: "🇶🇦" },
  { name: "Kuwait", flag: "🇰🇼" },
  { name: "Bahrain", flag: "🇧🇭" },
  { name: "Oman", flag: "🇴🇲" },
  { name: "Jordan", flag: "🇯🇴" },
  { name: "USA", flag: "🇺🇸" },
  { name: "UK", flag: "🇬🇧" },
];

function DropdownMenu({ items, onSelect, selected, renderItem }) {
  return (
    <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-[200] min-w-[160px] animate-in fade-in slide-in-from-top-2 duration-150">
      {items.map((item, i) => (
        <button
          key={i}
          onClick={() => onSelect(item)}
          className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors ${
            (renderItem ? renderItem(item) : item) === (renderItem ? renderItem(selected) : selected)
              ? "text-orange-600 bg-orange-50 font-medium"
              : "text-gray-700"
          }`}
        >
          {renderItem ? renderItem(item) : item}
        </button>
      ))}
    </div>
  );
}

function TopBarDropdown({ label, icon: Icon, items, renderItem, renderLabel }) {
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
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-xs px-2 py-1 rounded hover:bg-white/10"
      >
        {Icon && <Icon size={13} />}
        <span>{renderLabel ? renderLabel(selected) : selected}</span>
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <DropdownMenu
          items={items}
          selected={selected}
          onSelect={(v) => { setSelected(v); setOpen(false); }}
          renderItem={renderItem}
        />
      )}
    </div>
  );
}

function CurrencyDropdown() {
  const { selectedCurrency, setCurrency, currencySymbol, currencies } = useCurrency();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const availableCurrencies = currencies.length > 0
    ? currencies.map(c => c.code).filter(Boolean)
    : CURRENCIES;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (code) => {
    setCurrency(code);
    setOpen(false);
    toast.success(`✓ Prices updated to ${code}`, { duration: 1500 });
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-gray-300 hover:text-white transition-colors text-xs px-2 py-1 rounded hover:bg-white/10"
      >
        <DollarSign size={13} />
        <span>{currencySymbol} {selectedCurrency}</span>
        <ChevronDown size={11} className={`transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <div className="absolute top-full right-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-[200] min-w-[140px]">
          {availableCurrencies.map((code) => (
            <button
              key={code}
              onClick={() => handleSelect(code)}
              className={`w-full text-left px-4 py-2 text-sm hover:bg-orange-50 hover:text-orange-600 transition-colors ${
                code === selectedCurrency ? "text-orange-600 bg-orange-50 font-medium" : "text-gray-700"
              }`}
            >
              {code}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

const APP_SWITCHERS = [
  {
    name: "Kemedar®",
    icon: Home,
    desktopTo: "/",
    mobileTo: "/m",
    isActive: (p) => p === "/" || p === "/m" || p.startsWith("/kemedar") || p.startsWith("/m/kemedar") || p === "/m/",
  },
  {
    name: "Kemework®",
    icon: Wrench,
    desktopTo: "/kemework",
    mobileTo: "/m/kemework",
    isActive: (p) => p.startsWith("/kemework") || p.startsWith("/m/kemework"),
  },
  {
    name: "Kemetro®",
    icon: ShoppingCart,
    desktopTo: "/kemetro",
    mobileTo: "/m/kemetro",
    isActive: (p) => p.startsWith("/kemetro") || p.startsWith("/m/kemetro"),
  },
];

export default function TopBar() {
  const pathname = usePathname();
  const isMobile = useIsMobile();

  return (
    <div className="w-full bg-[#1a1a2e] border-b border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 h-9 flex items-center justify-between">
        {/* App Switchers */}
        <div className="flex items-center gap-0.5">
          {APP_SWITCHERS.map(({ name, icon: Icon, desktopTo, mobileTo, isActive }) => {
            const to = isMobile ? mobileTo : desktopTo;
            const active = isActive(pathname);
            return (
              <Link
                key={name}
                href={to || "#"}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded transition-all ${
                  active
                    ? "bg-[#FF6B00] text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/10"
                }`}
              >
                <Icon size={12} />
                {name}
              </Link>
            );
          })}
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-1">
          <CountrySwitcher />
          <div className="w-px h-4 bg-white/20 mx-1" />
          <LanguageSwitcher variant="topbar" />
          <div className="w-px h-4 bg-white/20 mx-1" />
          <CurrencyDropdown />
          <div className="w-px h-4 bg-white/20 mx-1" />
          <button className="flex items-center gap-1.5 text-xs text-gray-300 hover:text-white border border-gray-500 hover:border-white rounded px-3 py-1 transition-colors ml-1">
            <UserPlus size={12} />
            Sign Up
          </button>
          <button className="flex items-center gap-1.5 text-xs bg-[#FF6B00] hover:bg-[#e55f00] text-white rounded px-3 py-1 transition-colors font-medium ml-1">
            <LogIn size={12} />
            Sign In
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