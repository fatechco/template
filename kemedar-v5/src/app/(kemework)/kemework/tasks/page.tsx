"use client";

import { ClipboardList } from "lucide-react";
import { useServiceOrders } from "@/hooks/use-kemework";

export default function TasksPage() {
  const { data: orders } = useServiceOrders();

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <h1 className="text-3xl font-bold mb-6">My Tasks</h1>
      {orders?.data?.length ? (
        <div className="space-y-3">
          {orders.data.map((o: any) => (
            <div key={o.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{o.title || o.serviceType}</h3>
                <p className="text-sm text-slate-500">{o.address || "No address"}</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${o.status === "completed" ? "bg-green-100 text-green-700" : o.status === "in_progress" ? "bg-blue-100 text-blue-700" : "bg-yellow-100 text-yellow-700"}`}>
                {o.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No tasks yet</h3>
          <p className="text-sm mt-1">Service requests and tasks will appear here</p>
        </div>
      )}
    </div>
  );
}
