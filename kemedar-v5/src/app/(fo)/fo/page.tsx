"use client";

import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { Building2, Users, DollarSign, MapPin, Loader2, ArrowRight } from "lucide-react";

export default function FODashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["fo-stats", user?.id],
    queryFn: () => apiClient.get<any>("/api/v1/fo/stats"),
    enabled: !!user,
  });
  const { data: activity } = useQuery({
    queryKey: ["fo-activity", user?.id],
    queryFn: () => apiClient.list<any>("/api/v1/fo/activity", { pageSize: 5 }),
    enabled: !!user,
  });

  const stats = [
    { icon: Building2, label: "Area Properties", value: data?.properties ?? 0, href: "/fo/properties", color: "text-blue-600 bg-blue-50" },
    { icon: Users, label: "Area Users", value: data?.users ?? 0, href: "/fo/users", color: "text-green-600 bg-green-50" },
    { icon: DollarSign, label: "Commissions", value: `${(data?.commissions ?? 0).toLocaleString()} EGP`, href: "/fo/wallet", color: "text-purple-600 bg-purple-50" },
    { icon: MapPin, label: "Coverage Area", value: data?.area || "Not Set", href: "#", color: "text-amber-600 bg-amber-50" },
  ];

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Franchise Owner Dashboard</h1>
      <div className="grid md:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white border rounded-xl p-4 hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </Link>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-white border rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-bold">Recent Activity</h2>
            <Link href="/fo/properties" className="text-xs text-blue-600 hover:underline flex items-center gap-1">View All <ArrowRight className="w-3 h-3" /></Link>
          </div>
          {activity?.data?.length ? (
            <div className="space-y-3">
              {activity.data.map((a: any) => (
                <div key={a.id} className="flex items-center gap-3 text-sm">
                  <div className="w-2 h-2 bg-blue-400 rounded-full shrink-0" />
                  <span className="flex-1 truncate">{a.description || a.type}</span>
                  <span className="text-xs text-slate-400">{a.createdAt ? new Date(a.createdAt).toLocaleDateString() : ""}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-slate-400">No recent activity in your area</p>
          )}
        </div>
        <div className="bg-white border rounded-xl p-6">
          <h2 className="font-bold mb-3">Quick Actions</h2>
          <div className="space-y-2">
            {[
              { label: "View Properties", href: "/fo/properties" },
              { label: "Manage Users", href: "/fo/users" },
              { label: "Wallet & Commissions", href: "/fo/wallet" },
            ].map((a) => (
              <Link key={a.label} href={a.href} className="flex items-center justify-between p-3 border rounded-lg hover:bg-slate-50 text-sm">
                <span>{a.label}</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
