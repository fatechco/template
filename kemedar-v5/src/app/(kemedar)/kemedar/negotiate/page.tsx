"use client";

import { useNegotiations } from "@/hooks/use-negotiations";
import Link from "next/link";
import { MessageSquare, Clock, CheckCircle, AlertCircle } from "lucide-react";

const STATUS_MAP: Record<string, { color: string; icon: any }> = {
  active: { color: "bg-blue-100 text-blue-700", icon: MessageSquare },
  pending: { color: "bg-yellow-100 text-yellow-700", icon: Clock },
  accepted: { color: "bg-green-100 text-green-700", icon: CheckCircle },
  rejected: { color: "bg-red-100 text-red-700", icon: AlertCircle },
};

export default function NegotiatePage() {
  const { data, isLoading } = useNegotiations();

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Negotiations</h1>
        <p className="text-slate-500 mt-2">Manage your property negotiation sessions and offers</p>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (data?.data || []).length > 0 ? (
        <div className="space-y-3">
          {(data?.data || []).map((n: any) => {
            const st = STATUS_MAP[n.status] || STATUS_MAP.pending;
            return (
              <Link key={n.id} href={`/kemedar/negotiate/${n.id}`} className="block bg-white border rounded-xl p-5 hover:shadow-md transition">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-bold">{n.property?.title || `Session #${n.id.slice(0, 8)}`}</div>
                    <div className="text-sm text-slate-500 mt-1">
                      {n.lastOffer ? `Last offer: ${n.lastOffer.toLocaleString()} EGP` : "No offers yet"}
                    </div>
                  </div>
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${st.color}`}>
                    {n.status}
                  </span>
                </div>
                <div className="text-xs text-slate-400 mt-2">
                  {n.updatedAt ? `Updated ${new Date(n.updatedAt).toLocaleDateString()}` : ""}
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <MessageSquare className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No negotiations yet</h3>
          <p className="text-sm mt-1">Start a negotiation from any property listing</p>
        </div>
      )}
    </div>
  );
}
