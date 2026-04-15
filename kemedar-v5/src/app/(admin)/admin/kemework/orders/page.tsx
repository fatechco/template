"use client";
import { useServiceOrders } from "@/hooks/use-kemework";
import { Hammer } from "lucide-react";

export default function AdminKemeworkOrdersPage() {
  const { data } = useServiceOrders();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Kemework Service Orders</h1>
        <p className="text-sm text-slate-500 mt-1">{data?.data?.length || 0} service orders</p>
      </div>
      <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
        <Hammer className="w-10 h-10 mx-auto mb-2 text-slate-300" />
        <p>Service order management — assignments, progress, ratings</p>
      </div>
    </div>
  );
}
