"use client";
// @ts-nocheck
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ChevronDown, Plus } from "lucide-react";

function LiveNavBadge() {
  const [hasLive, setHasLive] = useState(false);
  useEffect(() => {
    fetch('/api/v1/live-events?status=live')
      .then(r => r.json())
      .then(res => setHasLive(res.data?.length > 0))
      .catch(() => {});
  }, []);
  return (
    <Link href="/kemedar/live" className="flex items-center gap-1.5 text-sm font-semibold text-red-600 hover:bg-red-50 rounded-lg px-3 py-2 transition-colors whitespace-nowrap border border-red-200">
      {hasLive && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
      📺 Live
    </Link>
  );
}
import PropertiesMenu from "./PropertiesMenu";
import ProjectsMenu from "./ProjectsMenu";
import AgentsMenu from "./AgentsMenu";
import UserBenefitsMenu from "./UserBenefitsMenu";
import OtherMenu from "./OtherMenu";
import AddMenu from "./AddMenu";
import InnovativeMenu from "./InnovativeMenu";
import { useModules } from "@/lib/module-context";

const NAV_ITEMS = [
  { label: "Properties", menu: PropertiesMenu, wide: true },
  { label: "Projects & Compounds", menu: ProjectsMenu, wide: true },
  { label: "Agents & Partners", menu: AgentsMenu },
  { label: "🧠 ThinkDar™ AI", menu: InnovativeMenu, wide: true },
  { label: "User Benefits", menu: UserBenefitsMenu },
  { label: "Add", menu: AddMenu },
  { label: "Other", menu: OtherMenu, alignRight: true },
];

function KemedarLogo() {
  return (
    <div className="select-none cursor-pointer">
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b5eafc884b1597fb3ea66e/0687980a4_kemedar-Logo-ar-6000.png"
        alt="Kemedar"
        className="h-10 w-auto object-contain"
      />
    </div>
  );
}

function NavItem({ label, MenuComponent, alignRight }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const timeoutRef = useRef(null);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  };

  useEffect(() => () => clearTimeout(timeoutRef.current), []);

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded transition-colors whitespace-nowrap ${
          open
            ? "text-[#FF6B00] bg-orange-50"
            : "text-gray-700 hover:text-[#FF6B00] hover:bg-orange-50"
        }`}
      >
        {label}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? "rotate-180 text-[#FF6B00]" : ""}`}
        />
      </button>
      {open && (
        <div className={alignRight ? "" : ""}>
          <MenuComponent />
        </div>
      )}
    </div>
  );
}

export default function MainNav() {
  const { isModuleActive } = useModules();
  return (
    <div className="w-full bg-white shadow-md border-b border-gray-100">
      <div className="max-w-[1400px] mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/"><KemedarLogo /></Link>

        {/* Nav Items */}
        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <NavItem
              key={item.label}
              label={item.label}
              MenuComponent={item.menu}
              alignRight={item.alignRight}
            />
          ))}
        </nav>

        {/* KemeFrac Tab */}
        <div className="relative hidden lg:block group">
          <Link href="/kemefrac"
            className="flex items-center gap-1.5 text-sm font-black px-3 py-2 rounded-xl transition-all whitespace-nowrap"
            style={{ background: "#0A1628", color: "#00C896" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#00C896] animate-pulse" />
            KemeFrac™ ▾
          </Link>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-xl border border-gray-100 shadow-xl z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-150">
            <Link href="/kemefrac" className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-t-xl">
              🏗️ All Offerings
            </Link>
            <Link href="/kemefrac/portfolio" className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50">
              💼 My Portfolio
            </Link>
            <Link href="/kemefrac/kyc" className="flex items-center gap-2 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-b-xl">
              🪪 KYC Verification
            </Link>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex items-center gap-2">
          {isModuleActive('kemework') && (
            <Link href="/kemework/post-task" className="flex items-center gap-1.5 text-sm font-medium border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 rounded-lg px-4 py-2 transition-colors whitespace-nowrap">
              <Plus size={15} />
              Post Task
            </Link>
          )}
          {isModuleActive('kemetro') && (
            <Link href="/kemetro/seller/products/add" className="flex items-center gap-1.5 text-sm font-medium border-2 border-blue-600 text-blue-700 hover:bg-blue-50 rounded-lg px-4 py-2 transition-colors whitespace-nowrap">
              <Plus size={15} />
              Sell Product
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}