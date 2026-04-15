"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import {
  Users, Building2, Gavel, CreditCard, ShoppingBag, FileText,
  TrendingUp, AlertTriangle, Clock, CheckCircle, ArrowUpRight, Shield
} from "lucide-react";

function StatCard({ icon: Icon, label, value, change, href, color }: {
  icon: any; label: string; value: string | number; change?: string; href: string; color: string;
}) {
  return (
    <Link href={href} className="bg-white rounded-xl border p-5 hover:shadow-md transition group">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color}`}>
          <Icon className="w-5 h-5" />
        </div>
        <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-blue-500 transition" />
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold">{value}</div>
        <div className="text-sm text-slate-500">{label}</div>
      </div>
      {change && (
        <div className="mt-2 text-xs text-green-600 font-medium">{change}</div>
      )}
    </Link>
  );
}

export default function AdminDashboardPage() {
  // Fetch stats from APIs
  const { data: propertyStats } = useQuery({
    queryKey: ["admin", "property-stats"],
    queryFn: async () => {
      try {
        const res = await apiClient.list<any>("/api/v1/properties", { pageSize: 1 });
        return { total: res.pagination.total };
      } catch { return { total: 0 }; }
    },
  });

  const { data: userStats } = useQuery({
    queryKey: ["admin", "user-stats"],
    queryFn: async () => {
      // This would need an admin endpoint
      return { total: 0, newToday: 0 };
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Overview of your platform</p>
        </div>
        <div className="text-sm text-slate-500">
          {new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard icon={Users} label="Total Users" value={userStats?.total || 0} change="+12 today" href="/admin/users" color="bg-blue-50 text-blue-600" />
        <StatCard icon={Building2} label="Properties" value={propertyStats?.total || 0} change="+5 today" href="/admin/properties" color="bg-green-50 text-green-600" />
        <StatCard icon={Gavel} label="Active Auctions" value={0} href="/admin/kemedar/auctions" color="bg-orange-50 text-orange-600" />
        <StatCard icon={CreditCard} label="Revenue (EGP)" value="0" href="/admin/subscriptions/subscribers" color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-bold mb-4">Recent Activity</h2>
          <div className="space-y-3">
            {[
              { icon: Building2, text: "New property listed: Cairo Apartment 3BR", time: "2 min ago", color: "text-blue-500" },
              { icon: Users, text: "New user registered: Ahmed Mohamed", time: "15 min ago", color: "text-green-500" },
              { icon: Gavel, text: "Auction KAB-20260414 ended - Winner declared", time: "1 hour ago", color: "text-orange-500" },
              { icon: CreditCard, text: "Subscription upgrade: Agent Pro Plan", time: "2 hours ago", color: "text-purple-500" },
              { icon: FileText, text: "Escrow deal KED-20260413 completed", time: "3 hours ago", color: "text-emerald-500" },
            ].map((activity, i) => (
              <div key={i} className="flex items-start gap-3 py-2 border-b last:border-0">
                <activity.icon className={`w-4 h-4 mt-0.5 ${activity.color}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm truncate">{activity.text}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Actions */}
        <div className="bg-white rounded-xl border p-5">
          <h2 className="font-bold mb-4">Pending Actions</h2>
          <div className="space-y-2">
            {[
              { icon: AlertTriangle, label: "Properties pending approval", count: 0, href: "/admin/properties/pending", color: "bg-amber-50 text-amber-600" },
              { icon: Clock, label: "Auctions pending approval", count: 0, href: "/admin/kemedar/auctions", color: "bg-orange-50 text-orange-600" },
              { icon: FileText, label: "KemeFrac KYC reviews", count: 0, href: "/admin/kemedar/kemefrac/kyc", color: "bg-blue-50 text-blue-600" },
              { icon: AlertTriangle, label: "Escrow disputes", count: 0, href: "/admin/kemedar/escrow/disputes", color: "bg-red-50 text-red-600" },
              { icon: Users, label: "Users pending verification", count: 0, href: "/admin/users/pending-verification", color: "bg-purple-50 text-purple-600" },
              { icon: ShoppingBag, label: "Kemetro seller applications", count: 0, href: "/admin/kemetro/sellers", color: "bg-green-50 text-green-600" },
            ].map((action, i) => (
              <Link key={i} href={action.href} className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${action.color}`}>
                  <action.icon className="w-4 h-4" />
                </div>
                <span className="flex-1 text-sm">{action.label}</span>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2 py-0.5 rounded-full">{action.count}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-6">
        <h2 className="font-bold mb-3">Quick Links</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {[
            { label: "Import Users", href: "/admin/users/import", icon: Users },
            { label: "Seed RBAC", href: "/admin/rbac/seed", icon: Shield },
            { label: "Import Locations", href: "/admin/locations/import", icon: TrendingUp },
            { label: "Manage Modules", href: "/admin/modules", icon: CheckCircle },
            { label: "Translations", href: "/admin/translations", icon: CheckCircle },
            { label: "System Settings", href: "/admin/settings", icon: CheckCircle },
          ].map((link, i) => (
            <Link key={i} href={link.href} className="bg-white border rounded-lg p-3 text-center text-sm hover:shadow-sm transition">
              <link.icon className="w-5 h-5 mx-auto mb-1 text-slate-400" />
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
