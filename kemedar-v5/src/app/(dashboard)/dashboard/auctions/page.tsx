"use client";

import { Gavel } from "lucide-react";
import { useAuctions } from "@/hooks/use-auctions";

export default function AuctionsPage() {
  const { data: auctions } = useAuctions();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Auctions</h1>
      {auctions?.data?.length ? (
        <div className="space-y-3">
          {auctions.data.map((a: any) => (
            <div key={a.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
              <div>
                <h3 className="font-semibold">{a.title}</h3>
                <p className="text-sm text-slate-500">Current bid: {a.currentBid?.toLocaleString()} EGP</p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${a.status === "active" ? "bg-green-100 text-green-700" : "bg-slate-100 text-slate-600"}`}>
                {a.status}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <Gavel className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No auction activity</h3>
          <p className="text-sm mt-1">Your bids and auction participations will appear here</p>
        </div>
      )}
    </div>
  );
}
