"use client";
import { useLiveEvents } from "@/hooks/use-live-events";
import { Eye } from "lucide-react";

export default function AdminLivePage() {
  const { data } = useLiveEvents();
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Live Events</h1>
        <p className="text-sm text-slate-500 mt-1">Manage live tours, webinars, open houses</p>
      </div>
      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white border rounded-xl p-5">
          <div className="text-2xl font-bold">{data?.data?.length || 0}</div>
          <div className="text-sm text-slate-500">Total Events</div>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-slate-500">Live Now</div>
        </div>
        <div className="bg-white border rounded-xl p-5">
          <div className="text-2xl font-bold">0</div>
          <div className="text-sm text-slate-500">Upcoming</div>
        </div>
      </div>
      <div className="bg-white border rounded-xl p-8 text-center text-slate-400">
        <Eye className="w-10 h-10 mx-auto mb-2 text-slate-300" />
        <p>Live event management — webinar, open house, property tour, Q&A, market update, panel</p>
      </div>
    </div>
  );
}
