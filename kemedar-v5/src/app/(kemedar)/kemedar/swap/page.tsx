"use client";

import { useSwapIntents } from "@/hooks/use-swap";
import Link from "next/link";
import { ArrowLeftRight, Home, MapPin, Plus } from "lucide-react";

export default function SwapPage() {
  const { data, isLoading } = useSwapIntents();

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Property Swap</h1>
          <p className="text-slate-500 mt-2">Exchange your property with another owner</p>
        </div>
        <Link href="/kemedar/swap/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-blue-700">
          <Plus className="w-4 h-4" />Post Swap Intent
        </Link>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-40 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (data?.data || []).length > 0 ? (
        <div className="grid md:grid-cols-2 gap-4">
          {(data?.data || []).map((s: any) => (
            <Link key={s.id} href={`/kemedar/swap/${s.id}`} className="bg-white border rounded-xl p-5 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="text-xs text-slate-400 mb-1">I have</div>
                  <div className="flex items-center gap-1 text-sm font-medium"><Home className="w-3 h-3" />{s.myProperty?.title || "My property"}</div>
                  <div className="text-xs text-slate-500"><MapPin className="w-3 h-3 inline" /> {s.myProperty?.location || "—"}</div>
                </div>
                <ArrowLeftRight className="w-6 h-6 text-blue-600 flex-shrink-0" />
                <div className="flex-1 text-right">
                  <div className="text-xs text-slate-400 mb-1">I want</div>
                  <div className="text-sm font-medium">{s.desiredType || "Any property"}</div>
                  <div className="text-xs text-slate-500">{s.desiredLocation || "Any location"}</div>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t">
                <span className={`text-xs px-2 py-1 rounded-full ${s.status === "matched" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                  {s.status || "active"}
                </span>
                <span className="text-xs text-slate-400">{s.matchesCount || 0} matches</span>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No swap intents yet</h3>
          <p className="text-sm mt-1">Post your first swap intent to find matching properties</p>
        </div>
      )}
    </div>
  );
}
