"use client";
import { useConciergeJourneys } from "@/hooks/use-concierge";
import { Home } from "lucide-react";

export default function AdminConciergePage() {
  const { data } = useConciergeJourneys();
  return (
    <div>
      <div className="mb-6"><h1 className="text-2xl font-bold">Concierge Journeys</h1><p className="text-sm text-slate-500 mt-1">Post-purchase move-in assistance</p></div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-5"><div className="text-2xl font-bold">{data?.data?.length || 0}</div><div className="text-sm text-slate-500">Active Journeys</div></div>
        <div className="bg-white border rounded-xl p-5"><div className="text-2xl font-bold">7</div><div className="text-sm text-slate-500">Default Tasks</div></div>
        <div className="bg-white border rounded-xl p-5"><div className="text-2xl font-bold">0</div><div className="text-sm text-slate-500">Completed</div></div>
      </div>
      <div className="bg-white border rounded-xl p-8 text-center text-slate-400"><Home className="w-10 h-10 mx-auto mb-2 text-slate-300" /><p>Concierge journey management — move-in tasks, utilities, security, community</p></div>
    </div>
  );
}
