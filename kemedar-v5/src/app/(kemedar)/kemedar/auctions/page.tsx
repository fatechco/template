"use client";

import { useAuctions } from "@/hooks/use-auctions";
import Link from "next/link";
import { Gavel, Clock, Users, TrendingUp } from "lucide-react";

export default function AuctionsPage() {
  const { data, isLoading } = useAuctions({ status: "active" });

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Property Auctions</h1>
        <p className="text-slate-500 mt-2">Bid on exclusive properties in real-time auctions</p>
      </div>

      <div className="flex gap-2 mb-6">
        {["active", "upcoming", "ended"].map((status) => (
          <button key={status} className="px-4 py-2 rounded-lg text-sm font-medium border bg-white hover:bg-slate-50 capitalize">
            {status}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (data?.data || []).length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.data || []).map((a: any) => (
            <Link key={a.id} href={`/kemedar/auctions/${a.id}`} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition">
              <div className="h-32 bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center">
                <Gavel className="w-10 h-10 text-amber-600" />
              </div>
              <div className="p-4">
                <h3 className="font-bold mb-1">{a.title || a.property?.title}</h3>
                <div className="text-lg font-bold text-amber-600 mb-2">
                  {a.currentBidEGP?.toLocaleString() || a.startingPriceEGP?.toLocaleString() || "—"} EGP
                </div>
                <div className="space-y-1 text-sm text-slate-500">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-3 h-3" />
                    {a.bidsCount || 0} bids
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-3 h-3" />
                    {a.biddersCount || 0} bidders
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3 h-3" />
                    {a.endsAt ? `Ends ${new Date(a.endsAt).toLocaleDateString()}` : "TBA"}
                  </div>
                </div>
                <button className="w-full mt-3 bg-amber-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-amber-700">
                  Place Bid
                </button>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <Gavel className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No active auctions</h3>
          <p className="text-sm mt-1">Check back soon for upcoming property auctions</p>
        </div>
      )}
    </div>
  );
}
