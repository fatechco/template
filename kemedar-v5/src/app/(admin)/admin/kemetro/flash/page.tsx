"use client";
import { useFlashDeals } from "@/hooks/use-marketplace";
import { Zap } from "lucide-react";

export default function AdminKemetroFlashPage() {
  const { data } = useFlashDeals();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Flash Deals</h1>
        <p className="text-sm text-slate-500 mt-1">{data?.data?.length || 0} active flash deals</p>
      </div>
      <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
        <Zap className="w-10 h-10 mx-auto mb-2 text-slate-300" />
        <p>Flash deal management — time-limited deals, notifications, analytics</p>
      </div>
    </div>
  );
}
