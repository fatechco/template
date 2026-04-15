"use client";

import { useLiveEvents } from "@/hooks/use-live-events";
import Link from "next/link";
import { Video, Calendar, Users, Clock } from "lucide-react";

export default function LivePage() {
  const { data, isLoading } = useLiveEvents({ status: "upcoming" });

  return (
    <div className="container mx-auto max-w-7xl py-8 px-4">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Live Events</h1>
        <p className="text-slate-500 mt-2">Join live property tours, webinars, and Q&A sessions</p>
      </div>

      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-56 bg-slate-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (data?.data || []).length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(data?.data || []).map((ev: any) => (
            <div key={ev.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition">
              <div className="bg-gradient-to-r from-red-500 to-pink-500 p-4 text-white">
                <Video className="w-6 h-6 mb-2" />
                <h3 className="font-bold">{ev.title}</h3>
                <p className="text-sm opacity-90">{ev.type}</p>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  {ev.scheduledAt ? new Date(ev.scheduledAt).toLocaleDateString() : "TBA"}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Clock className="w-4 h-4" />
                  {ev.durationMinutes ? `${ev.durationMinutes} min` : "TBA"}
                </div>
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Users className="w-4 h-4" />
                  {ev.registeredCount || 0} registered
                </div>
                <button className="w-full mt-3 bg-red-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-red-700">
                  Register
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white border rounded-xl p-12 text-center text-slate-400">
          <Video className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <h3 className="font-semibold text-slate-600">No upcoming events</h3>
          <p className="text-sm mt-1">Check back soon for live property tours and webinars</p>
        </div>
      )}
    </div>
  );
}
