"use client";
import { useSurplusItems } from "@/hooks/use-surplus";
import { Tag } from "lucide-react";

export default function AdminKemetroSurplusPage() {
  const { data } = useSurplusItems();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Surplus Market</h1>
        <p className="text-sm text-slate-500 mt-1">{data?.data?.length || 0} surplus items listed</p>
      </div>
      <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
        <Tag className="w-10 h-10 mx-auto mb-2 text-slate-300" />
        <p>Surplus management — listings, reservations, shipments, eco scoring</p>
      </div>
    </div>
  );
}
