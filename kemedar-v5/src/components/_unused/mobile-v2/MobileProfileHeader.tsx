"use client";
// @ts-nocheck
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Bell, Menu, LogOut, Plus } from "lucide-react";
import { useModule } from "@/lib/module-context";

const ROLE_CONFIG = {
  user: { label: "Common User", color: "#9CA3AF", icon: "👤" },
  agent: { label: "Real Estate Agent", color: "#3B82F6", icon: "🤝" },
  agency: { label: "Real Estate Agency", color: "#8B5CF6", icon: "🏢" },
  developer: { label: "Developer", color: "#1a1a2e", icon: "🏗" },
  franchise_owner: { label: "Franchise Owner", color: "#FF6B00", icon: "🗺" },
  product_buyer: { label: "Product Buyer", color: "#06B6D4", icon: "🛍" },
  product_seller: { label: "Product Seller", color: "#0D9488", icon: "🏪" },
  customer: { label: "Customer", color: "#6B7280", icon: "👤" },
  professional: { label: "Professional", color: "#0F766E", icon: "👷" },
  finishing_company: { label: "Finishing Company", color: "#92400E", icon: "🏢" },
};

export default function MobileProfileHeader() {
  const router = useRouter();
  const { activeModule } = useModules();
  const [showDrawer, setShowDrawer] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const { data: user } = useQuery({
    queryKey: ["me"],
    queryFn: () => apiClient.get("/api/auth/session"),
  });

  if (!user) return null;

  const userRoles = user.roles || [user.role || "user"];
  const currentRole = userRoles[0];
  const roleConfig = ROLE_CONFIG[currentRole] || ROLE_CONFIG.user;

  const handleLogout = () => {
    /* auth.logout TODO */ ("/m/login");
  };

  const initials = `${user.full_name?.split(" ")[0]?.[0] || ""}${
    user.full_name?.split(" ")[1]?.[0] || ""
  }`.toUpperCase();

  return (
    <>
      {/* Header Bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3" style={{ height: 56 }}>
        
        {/* LEFT: Profile Section */}
        <button
          onClick={() => setShowDrawer(true)}
          className="flex items-center gap-2 flex-1 min-w-0 hover:opacity-80 transition-opacity"
        >
          {/* Avatar */}
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-white font-bold text-xs"
            style={{ backgroundColor: roleConfig.color }}
          >
            {user.profile_photo ? (
              <img src={user.profile_photo} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>

          {/* Name & Role */}
          <div className="min-w-0">
            <p className="text-xs font-bold text-gray-900 truncate">{user.full_name}</p>
            <div
              className="inline-block px-2 py-0.5 rounded-full text-[10px] font-bold text-white truncate"
              style={{ backgroundColor: roleConfig.color }}
            >
              {roleConfig.label}
            </div>
          </div>
        </button>

        {/* CENTER: Module Switcher (compact) */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => {}}
            className={`px-2 py-1 text-xs font-black rounded-md transition-colors ${
              activeModule === "kemedar"
                ? "bg-orange-100 text-orange-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            K
          </button>
          <button
            onClick={() => {}}
            className={`px-2 py-1 text-xs font-black rounded-md transition-colors ${
              activeModule === "kemework"
                ? "bg-green-100 text-green-700"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            KW
          </button>
          <button
            onClick={() => {}}
            className={`px-2 py-1 text-xs font-black rounded-md transition-colors ${
              activeModule === "kemetro"
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            KT
          </button>
        </div>

        {/* RIGHT: Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {/* Notifications */}
          <button
            onClick={() => router.push("/m/dashboard/notifications")}
            className="relative p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Bell size={18} className="text-gray-700" />
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
              3
            </div>
          </button>

          {/* Menu */}
          <button
            onClick={() => setShowMenu(true)}
            className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <Menu size={18} className="text-gray-700" />
          </button>
        </div>
      </div>

      {/* ROLE SWITCHER DRAWER */}
      {showDrawer && (
        <div className="fixed inset-0 z-50 bg-black/40">
          <div className="bg-white h-full w-64 shadow-xl animate-in slide-in-from-left">
            {/* Drawer Content */}
            <div className="p-6 h-full overflow-y-auto flex flex-col">
              {/* Header */}
              <button
                onClick={() => setShowDrawer(false)}
                className="absolute top-4 right-4 p-1 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>

              {/* Profile Section */}
              <div className="mb-6">
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-3"
                  style={{ backgroundColor: roleConfig.color }}
                >
                  {user.profile_photo ? (
                    <img src={user.profile_photo} alt="" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    initials
                  )}
                </div>
                <h3 className="text-center font-black text-lg text-gray-900">{user.full_name}</h3>
                <p className="text-center text-gray-500 text-xs mt-1">{user.email}</p>
                <button
                  onClick={() => {
                    router.push("/m/dashboard/profile");
                    setShowDrawer(false);
                  }}
                  className="text-orange-600 font-semibold text-xs mt-3 w-full text-center hover:text-orange-700"
                >
                  Edit Profile
                </button>
              </div>

              <div className="border-b border-gray-200 pb-4 mb-4" />

              {/* Current Role */}
              <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">You are signed in as:</p>
                <div
                  className="px-4 py-2.5 rounded-full text-sm font-bold text-white text-center"
                  style={{ backgroundColor: roleConfig.color }}
                >
                  {roleConfig.icon} {roleConfig.label}
                </div>
              </div>

              {/* Switch Roles (if multiple) */}
              {userRoles.length > 1 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-2">Switch to:</p>
                  <div className="space-y-2">
                    {userRoles.slice(1).map((role) => {
                      const cfg = ROLE_CONFIG[role] || ROLE_CONFIG.user;
                      return (
                        <button
                          key={role}
                          onClick={() => {
                            // Switch role logic here
                            setShowDrawer(false);
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                          <span>{cfg.icon}</span>
                          <span className="text-sm font-semibold text-gray-700">{cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="border-b border-gray-200 my-4" />
                </div>
              )}

              {/* Add Role Button */}
              <button className="w-full flex items-center justify-center gap-2 border-2 border-orange-600 text-orange-600 font-bold py-2.5 rounded-lg hover:bg-orange-50 transition-colors mb-auto">
                <Plus size={16} /> Add New Role
              </button>

              {/* Sign Out */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 text-red-600 font-bold py-2.5 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} /> Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MENU DRAWER - Placeholder */}
      {showMenu && (
        <div className="fixed inset-0 z-50 bg-black/40" onClick={() => setShowMenu(false)}>
          <div className="bg-white h-full w-56 ml-auto shadow-xl animate-in slide-in-from-right">
            <div className="p-4">
              <button
                onClick={() => setShowMenu(false)}
                className="float-right p-1 hover:bg-gray-100 rounded-lg"
              >
                ✕
              </button>
              <p className="text-sm text-gray-500 mt-8">Dashboard menu options here</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}