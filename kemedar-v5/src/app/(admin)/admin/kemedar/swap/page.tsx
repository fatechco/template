"use client";
import { useSwapIntents } from "@/hooks/use-swap";
import Link from "next/link";
import { ArrowLeftRight } from "lucide-react";

export default function AdminSwapPage() {
  const { data, isLoading } = useSwapIntents();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Property Swap (KemedarSwap)</h1><p className="text-sm text-slate-500 mt-1">Manage swap intents and matches</p></div>
        <div className="flex gap-2">
          <Link href="/admin/kemedar/swap/matches" className="border bg-white px-3 py-2 rounded-lg text-sm hover:bg-slate-50">Matches</Link>
          <Link href="/admin/kemedar/swap/settings" className="border bg-white px-3 py-2 rounded-lg text-sm hover:bg-slate-50">Settings</Link>
        </div>
      </div>
      <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
        <ArrowLeftRight className="w-10 h-10 mx-auto mb-2 text-slate-300" />
        <p>Swap management — {data?.data?.length || 0} active intents</p>
        <p className="text-sm mt-1">Connect /api/v1/swap endpoint for full data</p>
      </div>
    </div>
  );
}
