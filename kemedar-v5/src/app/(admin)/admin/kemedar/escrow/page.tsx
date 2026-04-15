"use client";

import { useEscrowDeals } from "@/hooks/use-escrow";
import Link from "next/link";
import { FileText } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600", awaiting_deposit: "bg-amber-100 text-amber-700",
  in_progress: "bg-blue-100 text-blue-700", completed: "bg-green-100 text-green-700",
  disputed: "bg-red-100 text-red-700", cancelled: "bg-slate-100 text-slate-500",
};

export default function AdminEscrowPage() {
  const { data, isLoading } = useEscrowDeals();
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Escrow Deals</h1><p className="text-sm text-slate-500 mt-1">Manage property transactions</p></div>
        <Link href="/admin/kemedar/escrow/disputes" className="border bg-white px-3 py-2 rounded-lg text-sm hover:bg-slate-50">View Disputes</Link>
      </div>
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b"><tr>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Deal #</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Property</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 hidden lg:table-cell">Price</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
            <th className="text-left px-4 py-3 font-medium text-slate-500 hidden lg:table-cell">Progress</th>
            <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
          </tr></thead>
          <tbody>
            {isLoading ? <tr><td colSpan={6} className="px-4 py-8 text-center">Loading...</td></tr> :
            !data?.data?.length ? <tr><td colSpan={6} className="px-4 py-8 text-center text-slate-400"><FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />No escrow deals</td></tr> :
            data.data.map((d: any) => (
              <tr key={d.id} className="border-b hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">{d.dealNumber}</td>
                <td className="px-4 py-3 hidden md:table-cell truncate max-w-[180px]">{d.property?.title || "—"}</td>
                <td className="px-4 py-3 hidden lg:table-cell font-medium">{d.agreedPrice?.toLocaleString()} EGP</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[d.status] || "bg-slate-100"}`}>{d.status?.replace(/_/g, " ")}</span></td>
                <td className="px-4 py-3 hidden lg:table-cell"><div className="w-full bg-slate-200 rounded-full h-2"><div className="bg-blue-600 h-2 rounded-full" style={{ width: `${d.completionPercent}%` }} /></div></td>
                <td className="px-4 py-3 text-right"><Link href={`/admin/kemedar/escrow/${d.id}`} className="text-blue-600 hover:underline text-sm">View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
