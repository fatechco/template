import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import GuestWelcome from "@/components/mobile/account/GuestWelcome";
import ProfileCard from "@/components/mobile/account/ProfileCard";
import QuickActionsGrid from "@/components/mobile/account/QuickActionsGrid";
import MyListingsSection from "@/components/mobile/account/MyListingsSection";
import AccountMenuSection from "@/components/mobile/account/AccountMenuSection";

const MENU_SECTIONS = {
  common: [
    {
      title: "MY ACCOUNT",
      items: [
        { emoji: "👤", label: "My Profile", action: () => {} },
        { emoji: "📋", label: "My Buy Requests", action: () => {} },
        { emoji: "⚖️", label: "Compare Properties", action: () => {} },
        { emoji: "📅", label: "Appointments", action: () => {} },
        { emoji: "💳", label: "Subscription & Billing", action: () => {} },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        { emoji: "🎫", label: "Support Tickets", action: () => {} },
        { emoji: "📚", label: "Knowledge Base", action: () => {} },
        { emoji: "📞", label: "Contact Us", action: () => {} },
      ],
    },
    {
      title: "APP",
      items: [
        { emoji: "⭐", label: "Rate the App", action: () => {} },
        { emoji: "📤", label: "Share App", action: () => {} },
        { emoji: "ℹ️", label: "About Kemedar", action: () => {} },
      ],
    },
  ],
  agent_developer: [
    {
      title: "MY ACCOUNT",
      items: [
        { emoji: "👤", label: "My Profile", action: () => {} },
        { emoji: "📋", label: "My Buy Requests", action: () => {} },
        { emoji: "⚖️", label: "Compare Properties", action: () => {} },
        { emoji: "📊", label: "My Analytics", action: () => {} },
        { emoji: "📅", label: "Appointments", action: () => {} },
        { emoji: "💳", label: "Subscription & Billing", action: () => {} },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        { emoji: "🎫", label: "Support Tickets", action: () => {} },
        { emoji: "📚", label: "Knowledge Base", action: () => {} },
        { emoji: "📞", label: "Contact Us", action: () => {} },
      ],
    },
    {
      title: "APP",
      items: [
        { emoji: "⭐", label: "Rate the App", action: () => {} },
        { emoji: "📤", label: "Share App", action: () => {} },
        { emoji: "ℹ️", label: "About Kemedar", action: () => {} },
      ],
    },
  ],
  franchise_owner: [
    {
      title: "MY ACCOUNT",
      items: [
        { emoji: "👤", label: "My Profile", action: () => {} },
        { emoji: "📋", label: "My Buy Requests", action: () => {} },
        { emoji: "⚖️", label: "Compare Properties", action: () => {} },
        { emoji: "📊", label: "My Analytics", action: () => {} },
        { emoji: "📅", label: "Appointments", action: () => {} },
        { emoji: "💳", label: "Subscription & Billing", action: () => {} },
      ],
    },
    {
      title: "KEMETRO",
      items: [
        { emoji: "🏪", label: "My Store", action: () => {} },
        { emoji: "📦", label: "My Products", action: () => {} },
        { emoji: "🛍", label: "My Orders", action: () => {} },
      ],
    },
    {
      title: "KEMEWORK",
      items: [
        { emoji: "📋", label: "My Services", action: () => {} },
        { emoji: "🔧", label: "My Tasks", action: () => {} },
      ],
    },
    {
      title: "SUPPORT",
      items: [
        { emoji: "🎫", label: "Support Tickets", action: () => {} },
        { emoji: "📚", label: "Knowledge Base", action: () => {} },
        { emoji: "📞", label: "Contact Us", action: () => {} },
      ],
    },
    {
      title: "APP",
      items: [
        { emoji: "⭐", label: "Rate the App", action: () => {} },
        { emoji: "📤", label: "Share App", action: () => {} },
        { emoji: "ℹ️", label: "About Kemedar", action: () => {} },
      ],
    },
  ],
};

export default function MobileAccountPage() {
  const navigate = useNavigate();
  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => base44.auth.me(),
  });

  const isLoggedIn = !!user;

  if (!isLoggedIn) {
    return <GuestWelcome />;
  }

  let menuSections = MENU_SECTIONS.common;
  if (["agent", "agency", "developer"].includes(user?.role)) {
    menuSections = MENU_SECTIONS.agent_developer;
  } else if (user?.role === "franchise_owner") {
    menuSections = MENU_SECTIONS.franchise_owner;
  }

  const stats = { properties: 3, saved: 12, views: 1250 };

  return (
    <div className="bg-[#F3F4F6] min-h-screen pb-24">
      {/* Top app bar */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E7EB] px-4 py-3">
        <p className="text-lg font-black text-[#1F2937]">Account</p>
      </div>

      {/* Profile Card */}
      <div className="pt-4 pb-4">
        <ProfileCard user={user} stats={stats} />
      </div>

      {/* Quick Actions Grid */}
      <QuickActionsGrid />

      {/* My Listings Section */}
      <MyListingsSection />

      {/* Account Menu Sections */}
      <div className="px-4 space-y-4">
        {menuSections.map((section, i) => (
          <AccountMenuSection key={i} {...section} />
        ))}

        {/* Logout Button */}
        <button
          onClick={() => base44.auth.logout("/")}
          className="w-full bg-red-50 text-red-500 font-bold py-3.5 rounded-2xl text-sm flex items-center justify-center gap-2 active:bg-red-100 transition-colors border border-red-100"
        >
          🚪 Log Out
        </button>
      </div>
    </div>
  );
}