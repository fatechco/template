import { useState } from "react";
import { Outlet } from "react-router-dom";
import DashboardTopBar from "./DashboardTopBar";
import DashboardSidebar from "./DashboardSidebar";
import { useLocation } from "react-router-dom";

const BREADCRUMB_MAP = {
  "/dashboard": [{ label: "Dashboard" }],
  "/dashboard/listings": [{ label: "Dashboard", to: "/dashboard" }, { label: "My Listings" }],
  "/dashboard/projects": [{ label: "Dashboard", to: "/dashboard" }, { label: "My Projects" }],
  "/dashboard/buy-requests": [{ label: "Dashboard", to: "/dashboard" }, { label: "Buy Requests" }],
  "/dashboard/clients": [{ label: "Dashboard", to: "/dashboard" }, { label: "My Clients" }],
  "/dashboard/agents": [{ label: "Dashboard", to: "/dashboard" }, { label: "Agents" }],
  "/dashboard/analytics": [{ label: "Dashboard", to: "/dashboard" }, { label: "Analytics" }],
  "/dashboard/earnings": [{ label: "Dashboard", to: "/dashboard" }, { label: "Earnings" }],
  "/dashboard/reviews": [{ label: "Dashboard", to: "/dashboard" }, { label: "Reviews" }],
  "/dashboard/promotions": [{ label: "Dashboard", to: "/dashboard" }, { label: "Promotions" }],
  "/dashboard/profile": [{ label: "Dashboard", to: "/dashboard" }, { label: "My Profile" }],
  "/dashboard/settings": [{ label: "Dashboard", to: "/dashboard" }, { label: "Settings" }],
  "/dashboard/messages": [{ label: "Dashboard", to: "/dashboard" }, { label: "Messages" }],
  "/dashboard/notifications": [{ label: "Dashboard", to: "/dashboard" }, { label: "Notifications" }],
  "/dashboard/wishlist": [{ label: "Dashboard", to: "/dashboard" }, { label: "Wishlist" }],
  "/dashboard/support": [{ label: "Dashboard", to: "/dashboard" }, { label: "Help & Support" }],
  "/dashboard/territory": [{ label: "Dashboard", to: "/dashboard" }, { label: "Territory Map" }],
  "/dashboard/users": [{ label: "Dashboard", to: "/dashboard" }, { label: "Users" }],
  "/dashboard/my-properties": [{ label: "Dashboard", to: "/dashboard" }, { label: "My Properties" }],
  "/dashboard/favorites": [{ label: "Dashboard", to: "/dashboard" }, { label: "My Favorites" }],
  "/dashboard/compare": [{ label: "Dashboard", to: "/dashboard" }, { label: "Compare Properties" }],
  "/dashboard/my-buy-requests": [{ label: "Dashboard", to: "/dashboard" }, { label: "My Buy Requests" }],
  "/dashboard/search-requests": [{ label: "Dashboard", to: "/dashboard" }, { label: "Search Buy Requests" }],
  "/dashboard/buyer-organizer": [{ label: "Dashboard", to: "/dashboard" }, { label: "Buyer Organizer" }],
  "/dashboard/seller-organizer": [{ label: "Dashboard", to: "/dashboard" }, { label: "Seller Organizer" }],
  "/dashboard/subscription": [{ label: "Dashboard", to: "/dashboard" }, { label: "Subscription" }],
};

export default function DashboardShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();

  const breadcrumb = BREADCRUMB_MAP[pathname] || [{ label: "Dashboard", to: "/dashboard" }];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <DashboardSidebar
        collapsed={!sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={breadcrumb}
        />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}