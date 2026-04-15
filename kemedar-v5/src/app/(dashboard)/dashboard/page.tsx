"use client";

import { useAuth } from "@/lib/auth-context";
import { useProperties } from "@/hooks/use-properties";
import { useMyScore } from "@/hooks/use-scoring";
import Link from "next/link";
import { Building2, Heart, Eye, TrendingUp, Plus, Star, BarChart3, Gavel, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const { user } = useAuth();
  const { data: myProperties } = useProperties({ userId: user?.id, pageSize: 5 } as any);
  const { data: scoreData } = useMyScore();

  const totalViews = myProperties?.data?.reduce((sum: number, p: any) => sum + (p.viewCount || 0), 0) || 0;

  const stats = [
    { icon: Building2, label: "My Properties", value: myProperties?.pagination?.total || 0, href: "/dashboard/my-properties", color: "text-blue-600 bg-blue-50" },
    { icon: Heart, label: "Favorites", value: 0, href: "/dashboard/favorites", color: "text-red-500 bg-red-50" },
    { icon: Eye, label: "Total Views", value: totalViews, href: "#", color: "text-green-600 bg-green-50" },
    { icon: TrendingUp, label: "Kemedar Score", value: scoreData?.score ?? "—", href: "/dashboard/score", color: "text-purple-600 bg-purple-50" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Welcome back, {user?.name || "User"}</h1>
          <p className="text-slate-500 text-sm mt-1 capitalize">{user?.role?.replace(/_/g, " ")} Dashboard</p>
        </div>
        <Link href="/create-property" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-blue-700">
          <Plus className="w-4 h-4" /> List Property
        </Link>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <Link key={s.label} href={s.href} className="bg-white border rounded-xl p-4 hover:shadow-md transition">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}>
              <s.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <h2 className="text-lg font-bold mb-3">Quick Actions</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          { icon: Building2, label: "List Property", href: "/create-property", color: "bg-blue-50 text-blue-700" },
          { icon: Gavel, label: "Auctions", href: "/kemedar/auctions", color: "bg-orange-50 text-orange-700" },
          { icon: BarChart3, label: "KemeFrac", href: "/kemefrac", color: "bg-purple-50 text-purple-700" },
          { icon: Star, label: "My Score", href: "/dashboard/score", color: "bg-amber-50 text-amber-700" },
        ].map((action) => (
          <Link key={action.label} href={action.href} className={`flex items-center gap-3 p-4 rounded-xl border hover:shadow-sm transition ${action.color}`}>
            <action.icon className="w-5 h-5" />
            <span className="text-sm font-medium">{action.label}</span>
          </Link>
        ))}
      </div>

      {/* Recent Properties */}
      {myProperties && myProperties.data.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-bold">My Properties</h2>
            <Link href="/dashboard/my-properties" className="text-sm text-blue-600 hover:underline flex items-center gap-1">View All <ArrowRight className="w-3.5 h-3.5" /></Link>
          </div>
          <div className="bg-white border rounded-xl overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Property</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Price</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Views</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
                </tr>
              </thead>
              <tbody>
                {myProperties.data.slice(0, 5).map((p: any) => (
                  <tr key={p.id} className="border-b last:border-0 hover:bg-slate-50">
                    <td className="px-4 py-3">
                      <Link href={`/property/${p.id}`} className="font-medium hover:text-blue-600 truncate block max-w-xs">{p.title}</Link>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-600">{p.priceAmount?.toLocaleString() || "—"} EGP</td>
                    <td className="px-4 py-3 hidden md:table-cell text-slate-600">{p.viewCount || 0}</td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.isActive ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-500"}`}>
                        {p.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
