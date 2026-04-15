"use client";
// @ts-nocheck
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import AdminSidebarNew from "./AdminSidebarNew";
import AdminTopBar from "./AdminTopBar";
import { useAuth } from "@/lib/auth-context";

const BREADCRUMB_MAP = {
  "/admin": [{ label: "Admin" }, { label: "Dashboard" }],
  "/admin/users": [{ label: "Admin", to: "/admin" }, { label: "Users" }],
  "/admin/users/pending": [{ label: "Admin", to: "/admin" }, { label: "Users", to: "/admin/users" }, { label: "Pending" }],
  "/admin/users/imported": [{ label: "Admin", to: "/admin" }, { label: "Users", to: "/admin/users" }, { label: "Imported" }],
  "/admin/users/verified": [{ label: "Admin", to: "/admin" }, { label: "Users", to: "/admin/users" }, { label: "Verified" }],
  "/admin/users/agents": [{ label: "Admin", to: "/admin" }, { label: "Users", to: "/admin/users" }, { label: "Agents" }],
  "/admin/users/agencies": [{ label: "Admin", to: "/admin" }, { label: "Users", to: "/admin/users" }, { label: "Agencies" }],
  "/admin/users/developers": [{ label: "Admin", to: "/admin" }, { label: "Users", to: "/admin/users" }, { label: "Developers" }],
  "/admin/users/franchise-owners": [{ label: "Admin", to: "/admin" }, { label: "Users", to: "/admin/users" }, { label: "Franchise Owners" }],
  "/admin/users/common": [{ label: "Admin", to: "/admin" }, { label: "Users", to: "/admin/users" }, { label: "Common Users" }],
  "/admin/properties": [{ label: "Admin", to: "/admin" }, { label: "Properties" }],
  "/admin/projects": [{ label: "Admin", to: "/admin" }, { label: "Projects" }],
  "/admin/buy-requests": [{ label: "Admin", to: "/admin" }, { label: "Buy Requests" }],
  "/admin/properties/crm": [{ label: "Admin", to: "/admin" }, { label: "Properties", to: "/admin/properties" }, { label: "Contact CRM" }],
  "/admin/crm": [{ label: "Admin", to: "/admin" }, { label: "CRM" }, { label: "Dashboard" }],
  "/admin/crm/contacts": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Contacts" }],
  "/admin/crm/accounts": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Accounts" }],
  "/admin/crm/queues/activation": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Activation Queue" }],
  "/admin/crm/inbox": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Inbox" }],
  "/admin/crm/calls": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Calls" }],
  "/admin/crm/tasks": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Tasks" }],
  "/admin/crm/pipelines": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Pipelines" }],
  "/admin/crm/templates": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Templates" }],
  "/admin/crm/automations": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Automations" }],
  "/admin/crm/ai-agents": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "AI Agents" }],
  "/admin/crm/approvals": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Approvals" }],
  "/admin/crm/reports": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Reports" }],
  "/admin/crm/integrations": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Integrations" }],
  "/admin/crm/settings": [{ label: "Admin", to: "/admin" }, { label: "CRM", to: "/admin/crm" }, { label: "Settings" }],
};

export default function AdminShell({ children }: { children?: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, isLoadingAuth } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  if (isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-[#0f172a]">
        <div className="w-8 h-8 border-4 border-white/20 border-t-orange-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    router.push("/dashboard");
    return null;
  }

  if (user.role !== 'admin' && user.role !== 'super_user') {
    router.push("/dashboard");
    return null;
  }

  const breadcrumb = BREADCRUMB_MAP[pathname] || [{ label: "Admin", to: "/admin" }];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <AdminSidebarNew
        collapsed={!sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminTopBar
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          breadcrumb={breadcrumb}
        />
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}