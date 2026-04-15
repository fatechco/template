"use client";
import { useSurplusItems } from "@/hooks/use-surplus";
import Link from "next/link";
import { Tag, MapPin, Plus } from "lucide-react";
export default function KemetroSurplusPage() {
  const { data, isLoading } = useSurplusItems();
  return (<div className="container mx-auto max-w-7xl py-8 px-4">
    <div className="flex items-center justify-between mb-6"><div><h1 className="text-2xl font-bold">Surplus Market</h1><p className="text-sm text-slate-500">Buy and sell leftover building materials</p></div><Link href="/kemetro/surplus/add" className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 hover:bg-green-700"><Plus className="w-4 h-4"/>List Item</Link></div>
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">{isLoading?Array.from({length:8}).map((_,i)=><div key={i} className="h-52 bg-slate-100 rounded-xl animate-pulse"/>):(data?.data||[]).map((item:any)=>(<div key={item.id} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition">{item.imageUrls?.[0]?<img src={item.imageUrls[0]} alt="" className="w-full h-36 object-cover"/>:<div className="w-full h-36 bg-slate-100 flex items-center justify-center text-3xl">♻️</div>}<div className="p-3"><h3 className="font-medium text-sm truncate">{item.title}</h3><div className="flex items-center gap-1 text-xs text-slate-500 mt-0.5"><MapPin className="w-3 h-3"/>{item.location||"Egypt"}</div><div className="flex items-baseline gap-2 mt-1"><span className="font-bold text-green-600">{item.priceEGP?.toLocaleString()} EGP</span>{item.originalPriceEGP&&<span className="text-xs text-slate-400 line-through">{item.originalPriceEGP?.toLocaleString()}</span>}</div></div></div>))}</div>
  </div>);
}
