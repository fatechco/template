"use client";
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { BarChart3, Wallet, TrendingUp } from "lucide-react";
export default function KemeFracPortfolioPage() {
  return (<div className="container mx-auto max-w-5xl py-8 px-4">
    <h1 className="text-2xl font-bold mb-6">My KemeFrac Portfolio</h1>
    <div className="grid md:grid-cols-3 gap-4 mb-8"><div className="bg-white border rounded-xl p-5"><Wallet className="w-6 h-6 text-indigo-600 mb-2"/><div className="text-2xl font-bold">0 EGP</div><div className="text-sm text-slate-500">Total Value</div></div><div className="bg-white border rounded-xl p-5"><BarChart3 className="w-6 h-6 text-green-600 mb-2"/><div className="text-2xl font-bold">0</div><div className="text-sm text-slate-500">Tokens Held</div></div><div className="bg-white border rounded-xl p-5"><TrendingUp className="w-6 h-6 text-purple-600 mb-2"/><div className="text-2xl font-bold">0 EGP</div><div className="text-sm text-slate-500">Total Yield Earned</div></div></div>
    <div className="bg-white border rounded-xl p-12 text-center text-slate-400"><BarChart3 className="w-12 h-12 mx-auto mb-3 text-slate-300"/><h3 className="font-semibold text-slate-600">No holdings yet</h3><p className="text-sm mt-1">Purchase fractional tokens to start building your portfolio</p></div>
  </div>);
}
