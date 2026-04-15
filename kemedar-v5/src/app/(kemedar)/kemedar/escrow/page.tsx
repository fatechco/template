"use client";

import { useEscrowDeals } from "@/hooks/use-escrow";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";
import { FileText } from "lucide-react";

export default function EscrowPage() {
  const { user } = useAuth();
  const { data } = useEscrowDeals({ buyerId: user?.id });

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">My Escrow Deals</h1>
        <p className="text-slate-500 mt-2">Secure property transactions with milestone-based payments</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border rounded-xl p-5">
          <div className="text-2xl font-bold">{data?.data?.length || 0}</div>
          <div className="text-sm text-slate-500">Total Deals</div>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-sm text-slate-500">Completed</div>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <div className="text-2xl font-bold text-blue-600">0</div>
          <div className="text-sm text-slate-500">In Progress</div>
        </div>
      </div>

      {data?.data?.length ? (
        <div className="space-y-3">
          {data.data.map((d: any) => (
            <Link
              key={d.id}
              href={`/kemedar/escrow/${d.id}`}
              className="block bg-white border rounded-xl p-5 hover:shadow-md transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold">{d.dealNumber}</div>
                  <div className="text-sm text-slate-500">{d.property?.title}</div>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700">
                  {d.status?.replace(/_/g, " ")}
                </span>
              </div>
              <div className="mt-3">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${d.completionPercent}%` }} />
                </div>
                <div className="text-xs text-slate-400 mt-1">{d.completionPercent}% complete</div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <FileText className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No escrow deals yet</h3>
          <p className="text-sm mt-1">Your secure property transactions will appear here</p>
        </div>
      )}
    </div>
  );
}
