"use client";

import { useAuth } from "@/lib/auth-context";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Truck, Package, DollarSign, MapPin, Clock, Loader2 } from "lucide-react";

export default function ShipperDashboardPage() {
  const { user } = useAuth();
  const { data, isLoading } = useQuery({
    queryKey: ["shipper-stats", user?.id],
    queryFn: () => apiClient.get<any>("/api/v1/marketplace/shipper/stats"),
    enabled: !!user,
  });
  const { data: shipments } = useQuery({
    queryKey: ["shipper-active", user?.id],
    queryFn: () => apiClient.list<any>("/api/v1/marketplace/shipper/shipments", { status: "active" }),
    enabled: !!user,
  });

  const stats = [
    { icon: Clock, label: "Active Deliveries", value: data?.active ?? 0, color: "text-blue-600 bg-blue-50" },
    { icon: Package, label: "Completed", value: data?.completed ?? 0, color: "text-green-600 bg-green-50" },
    { icon: DollarSign, label: "Earnings", value: `${(data?.earnings ?? 0).toLocaleString()} EGP`, color: "text-purple-600 bg-purple-50" },
  ];

  if (isLoading) return <div className="flex items-center justify-center py-20"><Loader2 className="w-6 h-6 animate-spin text-slate-400" /></div>;

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="flex items-center gap-3 mb-6">
        <Truck className="w-8 h-8 text-green-600" />
        <h1 className="text-2xl font-bold">Shipper Dashboard</h1>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="bg-white border rounded-xl p-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${s.color}`}><s.icon className="w-5 h-5" /></div>
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <h2 className="text-lg font-bold mb-3">Active Shipments</h2>
      {shipments?.data?.length ? (
        <div className="space-y-3">
          {shipments.data.map((s: any) => (
            <div key={s.id} className="bg-white border rounded-xl p-4 flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center"><Truck className="w-5 h-5 text-blue-600" /></div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm">Order #{s.orderId?.slice(-6)}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{s.destination || "Pickup pending"}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${s.status === "in_transit" ? "bg-blue-100 text-blue-700" : s.status === "picked_up" ? "bg-amber-100 text-amber-700" : "bg-slate-100 text-slate-600"}`}>
                {s.status?.replace(/_/g, " ")}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No active deliveries</h3>
          <p className="text-sm mt-1">Delivery requests will appear here when assigned</p>
        </div>
      )}
    </div>
  );
}
