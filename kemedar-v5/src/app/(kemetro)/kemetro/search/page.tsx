"use client";
import { useState } from "react";
import { useMarketplaceProducts } from "@/hooks/use-marketplace";
import Link from "next/link";
import { Search, SlidersHorizontal } from "lucide-react";
export default function KemetroSearchPage() {
  const [query, setQuery] = useState(""); const [page, setPage] = useState(1);
  const { data, isLoading } = useMarketplaceProducts({ query: query||undefined, page });
  return (<div className="container mx-auto max-w-7xl py-8 px-4">
    <h1 className="text-2xl font-bold mb-6">Search Products</h1>
    <div className="bg-white border rounded-xl p-4 mb-6"><div className="relative"><Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/><input type="text" placeholder="Search building materials..." value={query} onChange={e=>{setQuery(e.target.value);setPage(1);}} className="w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm"/></div></div>
    <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-4">{isLoading?Array.from({length:8}).map((_,i)=><div key={i} className="h-52 bg-slate-100 rounded-xl animate-pulse"/>):(data?.data||[]).map((p:any)=>(<Link key={p.id} href={`/kemetro/product/${p.id}`} className="bg-white rounded-xl border overflow-hidden hover:shadow-md transition">{p.imageUrls?.[0]?<img src={p.imageUrls[0]} alt="" className="w-full h-40 object-cover"/>:<div className="w-full h-40 bg-slate-100 flex items-center justify-center text-3xl">📦</div>}<div className="p-3"><h3 className="font-medium text-sm truncate">{p.title}</h3><div className="text-xs text-slate-500 mt-0.5">{p.category}</div><div className="font-bold text-green-600 mt-1">{p.priceEGP?.toLocaleString()||"Contact"} EGP</div></div></Link>))}</div>
  </div>);
}
