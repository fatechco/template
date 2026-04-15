"use client";
import { use } from "react";
import { useQuery } from "@tanstack/react-query";
import { usePurchaseTokens } from "@/hooks/use-frac";
import { apiClient } from "@/lib/api-client";
import Link from "next/link";
import { BarChart3, ChevronLeft, Shield, TrendingUp, Coins } from "lucide-react";
export default function KemeFracDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: offering, isLoading } = useQuery({ queryKey: ["frac-offering", id], queryFn: () => apiClient.get<any>(`/api/v1/frac?id=${id}`) });
  const purchaseMutation = usePurchaseTokens(id);
  if (isLoading) return <div className="container mx-auto max-w-5xl py-8 px-4"><div className="h-96 bg-slate-100 rounded-xl animate-pulse"/></div>;
  return (<div className="container mx-auto max-w-5xl py-8 px-4">
    <Link href="/kemefrac" className="text-sm text-blue-600 flex items-center gap-1 mb-4"><ChevronLeft className="w-4 h-4"/>Back to Offerings</Link>
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6"><div className="bg-white border rounded-xl p-6"><h1 className="text-2xl font-bold">KemeFrac Offering</h1><p className="text-slate-500 mt-1">Offering ID: {id}</p></div>
      <div className="bg-white border rounded-xl p-6"><h2 className="font-bold mb-3">Token Economics</h2><div className="grid grid-cols-2 gap-4 text-sm"><div><span className="text-slate-500">Total Supply:</span> <span className="font-bold">1,000 tokens</span></div><div><span className="text-slate-500">Price/Token:</span> <span className="font-bold">500 EGP</span></div><div><span className="text-slate-500">For Sale:</span> <span className="font-bold">700 tokens</span></div><div><span className="text-slate-500">Expected Yield:</span> <span className="font-bold text-green-600">8.5%</span></div></div></div></div>
      <div className="space-y-4"><div className="bg-white border rounded-xl p-6 sticky top-24"><h3 className="font-bold mb-4">Purchase Tokens</h3><div className="space-y-3"><div><label className="text-sm text-slate-500">Amount (tokens)</label><input type="number" min={1} placeholder="1" className="w-full px-4 py-2.5 border rounded-lg mt-1"/></div><div><label className="text-sm text-slate-500">Payment Method</label><select className="w-full px-4 py-2.5 border rounded-lg mt-1"><option>Credit Card</option><option>Bank Transfer</option><option>Kemecoins</option></select></div><button className="w-full bg-indigo-600 text-white py-3 rounded-lg font-medium hover:bg-indigo-700 mt-2">Purchase Tokens</button></div><div className="text-xs text-slate-400 mt-3 text-center">By purchasing, you agree to our investment terms</div></div></div>
    </div>
  </div>);
}
