"use client";

import { useState } from "react";
import { useAuctions } from "@/hooks/use-auctions";
import Link from "next/link";
import { Gavel, Search, Eye, Check, X, Clock, ChevronLeft, ChevronRight } from "lucide-react";

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-slate-100 text-slate-600",
  pending_approval: "bg-amber-100 text-amber-700",
  approved: "bg-blue-100 text-blue-700",
  live: "bg-green-100 text-green-700",
  ended_winner: "bg-purple-100 text-purple-700",
  ended_no_bids: "bg-slate-100 text-slate-500",
  completed: "bg-emerald-100 text-emerald-700",
  failed: "bg-red-100 text-red-700",
  cancelled: "bg-red-100 text-red-600",
};

export default function AdminAuctionsPage() {
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const { data, isLoading } = useAuctions({ status: statusFilter || undefined, page });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Auctions (KemedarBid)</h1>
          <p className="text-sm text-slate-500 mt-1">Manage property auctions</p>
        </div>
        <Link href="/admin/kemedar/auctions/settings" className="border bg-white px-3 py-2 rounded-lg text-sm hover:bg-slate-50">
          Settings
        </Link>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {["", "pending_approval", "live", "ended_winner", "completed", "failed"].map((s) => (
          <button
            key={s}
            onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
              statusFilter === s ? "bg-blue-600 text-white" : "bg-white border text-slate-600 hover:bg-slate-50"
            }`}
          >
            {s === "" ? "All" : s.replace(/_/g, " ")}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Auction</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Property</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 hidden lg:table-cell">Starting Price</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 hidden lg:table-cell">Current Bid</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500">Status</th>
              <th className="text-left px-4 py-3 font-medium text-slate-500 hidden md:table-cell">Bids</th>
              <th className="text-right px-4 py-3 font-medium text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-b"><td colSpan={7} className="px-4 py-4"><div className="h-4 bg-slate-100 rounded animate-pulse" /></td></tr>
              ))
            ) : !data?.data?.length ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-slate-400">
                  <Gavel className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                  No auctions found
                </td>
              </tr>
            ) : (
              data.data.map((auction: any) => (
                <tr key={auction.id} className="border-b hover:bg-slate-50">
                  <td className="px-4 py-3">
                    <div className="font-medium">{auction.auctionCode}</div>
                    <div className="text-xs text-slate-400">{new Date(auction.createdAt).toLocaleDateString()}</div>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-600 truncate max-w-[200px]">
                    {auction.property?.title || "—"}
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell font-medium">
                    {auction.startingPriceEGP?.toLocaleString()} EGP
                  </td>
                  <td className="px-4 py-3 hidden lg:table-cell font-bold text-blue-600">
                    {auction.currentHighestBidEGP?.toLocaleString() || "—"} {auction.currentHighestBidEGP ? "EGP" : ""}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_COLORS[auction.status] || "bg-slate-100 text-slate-600"}`}>
                      {auction.status.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-4 py-3 hidden md:table-cell text-slate-600">
                    {auction.totalBidsCount} ({auction.uniqueBiddersCount} bidders)
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link href={`/admin/kemedar/auctions/${auction.id}`} className="text-blue-600 hover:underline text-sm">
                      View
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
