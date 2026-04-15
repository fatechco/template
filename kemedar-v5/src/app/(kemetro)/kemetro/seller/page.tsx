"use client";

import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { Store, Package, DollarSign, TrendingUp, Star, Plus, Loader2 } from "lucide-react";

export default function SellerDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["seller-stats", user?.id],
    queryFn: () => apiClient.get<any>("/api/v1/marketplace/seller/stats"),
    enabled: !!user,
  });
  const { data: orders } = useQuery({
    queryKey: ["seller-orders", user?.id],
    queryFn: () => apiClient.list<any>("/api/v1/marketplace/seller/orders", { pageSize: 5 }),
    enabled: !!user,
  });

  const stats = [
    { icon: Package, label: "Active Listings", value: data?.products ?? 0, color: "text-blue-600 bg-blue-50" },
    { icon: DollarSign, label: "Total Revenue", value: `${(data?.revenue ?? 0).toLocaleString()} EGP`, color: "text-green-600 bg-green-50" },
    { icon: TrendingUp, label: "This Month", value: `${(data?.monthlyRevenue ?? 0).toLocaleString()} EGP`, color: "text-purple-600 bg-purple-50" },
    { icon: Star, label: "Rating", value: data?.rating ? `${data.rating}/5` : "N/A", color: "text-amber-600 bg-amber-50" },
  ];

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Store className="w-8 h-8 text-orange-600" />
          <h1 className="text-2xl font-bold">Seller Dashboard</h1>
        </div>
        <Link href="/kemetro/seller/add-product" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-green-700">
          <Plus className="w-4 h-4" /> Add Product
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-3">Recent Orders</h2>
      {orders?.data?.length ? (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Order</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Buyer</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Amount</th>
                <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.data.map((o: any) => (
                <tr key={o.id} className="border-b last:border-0 hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium">#{o.id?.slice(-6)}</td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-600">{o.buyerName || "N/A"}</td>
                  <td className="px-4 py-3">{o.total?.toLocaleString() || 0} EGP</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${o.status === "delivered" ? "bg-green-100 text-green-700" : o.status === "shipped" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
          <Package className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No recent orders</h3>
          <p className="text-sm mt-1">Orders from buyers will appear here</p>
        </div>
      )}
    </div>
  );
}
