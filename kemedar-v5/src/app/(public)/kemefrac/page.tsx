"use client";
import { useFracOfferings } from "@/hooks/use-frac";
import { useCurrency } from "@/lib/currency-context";
import Link from "next/link";
import { BarChart3, TrendingUp, Shield, Coins } from "lucide-react";
export default function KemeFracPage() {
  const { data, isLoading } = useFracOfferings({ status: "live" });
  const { formatPrice } = useCurrency();
  return (<div className="container mx-auto max-w-7xl py-8 px-4">
    <div className="text-center mb-10"><BarChart3 className="w-12 h-12 text-indigo-600 mx-auto mb-3"/><h1 className="text-4xl font-bold">KemeFrac</h1><p className="text-slate-500 mt-2 max-w-xl mx-auto">Invest in premium Egyptian real estate from as little as 100 EGP per token</p></div>
    <div className="grid md:grid-cols-3 gap-4 mb-10">{[{icon:Coins,label:"Total Token Value",value:"0 EGP",color:"bg-indigo-50 text-indigo-600"},{icon:TrendingUp,label:"Avg. Annual Yield",value:"8.5%",color:"bg-green-50 text-green-600"},{icon:Shield,label:"Verified Properties",value:"100%",color:"bg-blue-50 text-blue-600"}].map(s=>(<div key={s.label} className="bg-white border rounded-xl p-5 text-center"><s.icon className={`w-8 h-8 mx-auto mb-2 ${s.color.split(" ")[1]}`}/><div className="text-2xl font-bold">{s.value}</div><div className="text-sm text-slate-500">{s.label}</div></div>))}</div>
    <h2 className="text-2xl font-bold mb-4">Live Offerings</h2>
    {isLoading?<div className="grid md:grid-cols-3 gap-4">{Array.from({length:3}).map((_,i)=><div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse"/>)}</div>:
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">{(data?.data||[]).map((o:any)=>(<Link key={o.id} href={`/kemefrac/${o.id}`} className="bg-white rounded-xl border overflow-hidden hover:shadow-lg transition"><div className="h-40 bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center"><BarChart3 className="w-16 h-16 text-indigo-300"/></div><div className="p-4"><h3 className="font-bold">{o.offeringTitle}</h3><div className="flex items-center gap-2 mt-2"><span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">{o.status}</span>{o.isVerified&&<span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">Verified</span>}</div><div className="grid grid-cols-2 gap-2 mt-3 text-sm"><div><div className="text-slate-500">Token Price</div><div className="font-bold">{o.tokenPriceEGP} EGP</div></div><div><div className="text-slate-500">Yield</div><div className="font-bold text-green-600">{o.expectedAnnualYieldPercent||"—"}%</div></div><div><div className="text-slate-500">Sold</div><div className="font-bold">{o.tokensSold}/{o.tokensForSale}</div></div><div><div className="text-slate-500">Type</div><div className="font-bold capitalize">{o.offeringType?.replace(/_/g," ")}</div></div></div></div></Link>))}</div>}
  </div>);
}
