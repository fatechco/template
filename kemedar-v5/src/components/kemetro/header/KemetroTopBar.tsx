// @ts-nocheck
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, DollarSign, User, LogIn, ShoppingCart, ChevronDown } from "lucide-react";
import LanguageSwitcher from "@/components/ui/LanguageSwitcher";
import CountrySwitcher from "@/components/ui/CountrySwitcher";

const APP_TABS = [
  { label: "Kemedar®", icon: "🏠", to: "/" },
  { label: "Kemework®", icon: "🔧", to: "/kemework" },
  { label: "Kemetro®", icon: "🛒", to: "/kemetro", active: true },
];

export default function KemetroTopBar({ cartCount = 0 }) {
  return (
    <div className="w-full bg-[#0d3b3b] text-white text-xs">
      <div className="max-w-[1400px] mx-auto px-4 h-9 flex items-center justify-between gap-4">
        {/* App Switcher */}
        <div className="flex items-center">
          {APP_TABS.map((tab) => (
            <Link
              key={tab.label}
              href={tab.to}
              className={`flex items-center gap-1.5 px-4 h-9 font-semibold transition-all whitespace-nowrap ${
                tab.active
                  ? "bg-[#0077B6] text-white"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </Link>
          ))}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-1">
          {/* Country */}
          <CountrySwitcher />

          <span className="text-white/20">|</span>

          {/* Language */}
          <LanguageSwitcher variant="topbar" />

          <span className="text-white/20">|</span>

          {/* Currency */}
          <button className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
            <DollarSign size={12} />
            <span>USD</span>
            <ChevronDown size={10} />
          </button>

          <span className="text-white/20">|</span>

          {/* Sign Up */}
          <Link href="/kemetro/register" className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
            <User size={12} />
            <span>Sign Up</span>
          </Link>

          {/* Sign In */}
          <Link href="/kemetro/login" className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
            <LogIn size={12} />
            <span>Sign In</span>
          </Link>

          <span className="text-white/20">|</span>

          {/* Download App */}
          <a href="#" className="flex items-center gap-1 px-2.5 py-1 rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white whitespace-nowrap">
            📱 Download App
          </a>

          <span className="text-white/20">|</span>

          {/* Cart */}
          <Link href="/kemetro/cart" className="relative flex items-center gap-1 px-2.5 py-1 rounded hover:bg-white/10 transition-colors text-gray-300 hover:text-white">
            <ShoppingCart size={14} />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-[#FF6B00] text-white text-[9px] font-black rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>
    </div>
  );
}