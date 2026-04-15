"use client";
import { useFlashDeals } from "@/hooks/use-marketplace";
import Link from "next/link";
import { Zap, Clock } from "lucide-react";
export default function KemetroFlashPage() {
  const { data, isLoading } = useFlashDeals();
  return (<div className="container mx-auto max-w-7xl py-8 px-4">
    <div className="flex items-center gap-2 mb-6"><Zap className="w-8 h-8 text-orange-600"/><div><h1 className="text-2xl font-bold">Flash Deals</h1><p className="text-sm text-slate-500">Limited-time offers on building materials</p></div></div>
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">{isLoading?Array.from({length:4}).map((_,i)=><div key={i} className="h-48 bg-slate-100 rounded-xl animate-pulse"/>):(data?.data||[]).map((d:any)=>(<div key={d.id} className="bg-white rounded-xl border p-4 hover:shadow-md transition"><div className="flex items-center justify-between mb-2"><span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-bold">{d.discountPercent}% OFF</span><span className="text-xs text-slate-400 flex items-center gap-0.5"><Clock className="w-3 h-3"/>Ends {new Date(d.endsAt).toLocaleDateString()}</span></div><h3 className="font-medium truncate">{d.title}</h3><div className="mt-2 flex items-baseline gap-2"><span className="text-xl font-bold text-orange-600">{d.flashPriceEGP} EGP</span>{d.originalPriceEGP&&<span className="text-sm text-slate-400 line-through">{d.originalPriceEGP}</span>}</div><div className="text-xs text-slate-500 mt-1">{d.soldCount}/{d.quantity} sold</div></div>))}</div>
  </div>);
}
