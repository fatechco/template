"use client";

import { useFracOfferings } from "@/hooks/use-frac";
import Link from "next/link";
import { BarChart3, Search, Eye, Check, X, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600", under_review: "bg-amber-100 text-amber-700",
  approved: "bg-blue-100 text-blue-700", live: "bg-green-100 text-green-700",
  sold_out: "bg-purple-100 text-purple-700", closed: "bg-slate-100 text-slate-500",
  rejected: "bg-red-100 text-red-700", suspended: "bg-red-100 text-red-600",
};

export default function AdminKemeFracPage() {
  const { data, isLoading } = useFracOfferings();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">KemeFrac Offerings</h1><p className="text-sm text-slate-500 mt-1">Manage fractional property offerings</p></div>
        <div className="flex gap-2">
          <Link href="/admin/kemedar/kemefrac/kyc" className="border bg-white px-3 py-2 rounded-lg text-sm hover:bg-slate-50">KYC Reviews</Link>
          <Link href="/admin/kemedar/kemefrac/settings" className="border bg-white px-3 py-2 rounded-lg text-sm hover:bg-slate-50">Settings</Link>
        </div>
      </div>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Offering</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Token</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 hidden lg:table-cell">Price/Token</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 hidden lg:table-cell">Sold</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
              <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400">Loading...</td></tr> :
            !data?.data?.length ? <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400"><BarChart3 className="w-8 h-8 mx-auto mb-2 text-slate-300" />No offerings yet</td></tr> :
            data.data.map((o: any) => (
              <tr key={o.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3"><div className="font-medium truncate max-w-[200px]">{o.offeringTitle}</div><div className="text-xs text-slate-400">{o.offeringSlug}</div></td>
                <td className="px-4 py-3 hidden md:table-cell text-slate-600">{o.tokenSymbol || "—"}</td>
                <td className="px-4 py-3 hidden lg:table-cell font-medium">{o.tokenPriceEGP?.toLocaleString()} EGP</td>
                <td className="px-4 py-3 hidden lg:table-cell">{o.tokensSold}/{o.tokensForSale}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[o.status] || "bg-slate-100"}`}>{o.status?.replace(/_/g, " ")}</span></td>
                <td className="px-4 py-3 text-right"><Link href={`/admin/kemedar/kemefrac/${o.id}`} className="text-blue-600 hover:underline text-sm">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
