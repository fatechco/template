import { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import AdminSidebarNew from "../AdminSidebarNew";
import KemedarAdminTopBar from "./KemedarAdminTopBar";
import { useAuth } from "@/lib/AuthContext";

export default function KemedarAdminShell() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoadingAuth } = useAuth();
  const { pathname } = useLocation();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-orange-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user || user.role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <AdminSidebarNew
        collapsed={!sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <KemedarAdminTopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}