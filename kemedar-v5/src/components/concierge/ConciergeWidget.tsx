"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiClient } from "@/lib/api-client";
import { differenceInDays, parseISO, isToday, isPast } from "date-fns";

function dueDateLabel(dueDate) {
  if (!dueDate) return null;
  try {
    const d = parseISO(dueDate);
    const diff = differenceInDays(d, new Date());
    if (isToday(d)) return { text: "Due today", color: "text-orange-500 font-bold" };
    if (isPast(d)) return { text: `Overdue ${Math.abs(diff)}d`, color: "text-red-500 font-bold" };
    if (diff <= 3) return { text: `Due in ${diff} day${diff !== 1 ? "s" : ""}`, color: "text-orange-400" };
    return { text: `Due in ${diff} days`, color: "text-gray-400" };
  } catch { return null; }
}

export default function ConciergeWidget({ userId }) {
  const router = useRouter();
  const [journey, setJourney] = useState(null);
  const [property, setProperty] = useState(null);
  const [nextTask, setNextTask] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) { setLoading(false); return; }
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      const journeys = await apiClient.list("/api/v1/conciergejourney", 
        { userId, status: "Active" }, "-created_date", 1
      );
      if (!journeys || journeys.length === 0) { setLoading(false); return; }
      const j = journeys[0];
      setJourney(j);

      const [props, tasks] = await Promise.all([
        j.propertyId ? apiClient.list("/api/v1/property", { id: j.propertyId }) : Promise.resolve([]),
        apiClient.list("/api/v1/conciergetask", { journeyId: j.id }, "sortOrder", 50),
      ]);

      setProperty(props[0] || null);

      const pending = tasks.filter(t => t.status !== "Completed" && t.status !== "Skipped");
      if (pending.length > 0) {
        const due = pending.find(t => t.status === "Due") || pending[0];
        setNextTask(due);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (loading || !journey) return null;

  const pct = Math.round(journey.completionPercentage || 0);
  const isComplete = journey.status === "Completed" || pct === 100;

  // Completed state
  if (isComplete) {
    return (
      <div className="rounded-2xl border-l-4 bg-green-50 border border-green-100 p-5" style={{ borderLeftColor: "#22c55e" }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl">✅</span>
          <div>
            <p className="font-black text-green-800 text-base">Move-in complete for {property?.title || "your property"}!</p>
            <p className="text-green-600 text-sm mt-0.5">Congratulations on your new home! 🎉</p>
          </div>
        </div>
      </div>
    );
  }

  const dl = nextTask ? dueDateLabel(nextTask.dueDate) : null;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden" style={{ borderLeft: "4px solid #FF6B00" }}>
      <div className="p-5">
        {/* Top row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🗝️</span>
            <p className="font-black text-gray-900 text-base">My Move-In Concierge</p>
          </div>
          <Link href={`/dashboard/concierge/${journey.id}`} className="text-sm text-orange-500 font-bold hover:text-orange-600">
            View all →
          </Link>
        </div>

        {/* Property row */}
        {property && (
          <div className="flex items-center gap-3 mb-4">
            <img
              src={property.featured_image || property.avatar_image || "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=80&q=70"}
              alt={property.title}
              className="w-10 h-10 rounded-lg object-cover flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{property.title}</p>
              <p className="text-xs text-gray-400 mt-0.5">
                📍 {[property.city_name, property.district_name].filter(Boolean).join(", ")}
              </p>
            </div>
          </div>
        )}

        {/* Progress row */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs text-gray-500 mb-1.5">
            <span>{pct}% complete — {journey.completedTasks || 0} of {journey.totalTasks || 0} tasks done</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-1.5">
            <div
              className="h-1.5 rounded-full bg-orange-500 transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>

        {/* Next task preview */}
        {nextTask && (
          <div className="bg-orange-50 rounded-xl p-3 flex items-center gap-3">
            <span className="text-xl flex-shrink-0">{nextTask.icon || "📋"}</span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 text-sm truncate">{nextTask.title}</p>
              {dl && <p className={`text-xs mt-0.5 ${dl.color}`}>{dl.text}</p>}
            </div>
            <Link
              href={`/dashboard/concierge/${journey.id}`}
              className="flex-shrink-0 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
            >
              → Take Action
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}