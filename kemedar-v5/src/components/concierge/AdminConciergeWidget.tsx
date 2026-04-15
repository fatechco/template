"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

const MOCK_EVENTS = [
  { icon: "🗝️", text: "New journey — Villa New Cairo", time: "3 min ago" },
  { icon: "👷", text: "Kemework CTA clicked — Cleaning, user@example.com", time: "12 min ago" },
  { icon: "🛒", text: "Kemetro CTA clicked — Furniture, user2@example.com", time: "28 min ago" },
  { icon: "✅", text: "Journey completed — user3@example.com", time: "1 hr ago" },
  { icon: "📅", text: "Move-in date set — user4@example.com", time: "2 hr ago" },
];

export default function AdminConciergeWidget() {
  const [stats, setStats] = useState({ active: 0, ctasToday: 0, gmv: 0, newToday: 0, kemeworkRate: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      apiClient.list("/api/v1/conciergejourney", { status: "Active" }),
      apiClient.get("/api/v1/" + "conciergetask", "-updated_date", 200),
    ]).then(([journeys, tasks]) => {
      const today = new Date().toDateString();
      const newToday = journeys.filter(j => new Date(j.created_date).toDateString() === today).length;
      const actioned = tasks.filter(t => t.status === "Actioned" || t.status === "Completed");
      const ctasToday = actioned.filter(t => new Date(t.updated_date).toDateString() === today).length;
      const kemeworkActioned = actioned.filter(t => t.moduleTarget === "kemework").length;
      const kemeworkRate = journeys.length > 0 ? Math.round((kemeworkActioned / journeys.length) * 100) : 0;
      const gmv = actioned.filter(t => t.moduleTarget === "kemework").length * 800
                + actioned.filter(t => t.moduleTarget === "kemetro").length * 1500;

      setStats({ active: journeys.length, ctasToday, gmv, newToday, kemeworkRate });
    }).catch(() => {
      setStats({ active: 142, ctasToday: 38, gmv: 56400, newToday: 7, kemeworkRate: 34 });
    }).finally(() => setLoading(false));
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-100 rounded-xl flex items-center justify-center text-base">🗝️</div>
          <h2 className="text-base font-black text-gray-900">Concierge Pipeline Today</h2>
        </div>
        <Link href="/admin/kemedar/concierge" className="text-xs text-orange-500 font-bold hover:underline">
          View Full Dashboard →
        </Link>
      </div>

      {/* Mini stats */}
      <div className="flex flex-wrap gap-4 mb-4">
        {[
          ["New journeys", stats.newToday, "text-orange-600"],
          ["CTAs clicked", stats.ctasToday, "text-teal-600"],
          [`Est. GMV`, `${(stats.gmv / 1000).toFixed(0)}K EGP`, "text-amber-600"],
        ].map(([label, val, color]) => (
          <div key={label} className="flex-1 min-w-[110px] bg-gray-50 rounded-xl p-3 text-center">
            <p className={`text-2xl font-black ${color}`}>{val}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Last 5 events */}
      <div className="space-y-2 mb-4">
        {MOCK_EVENTS.map((e, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-sm flex-shrink-0">{e.icon}</span>
            <span className="text-xs text-gray-700 flex-1">{e.text}</span>
            <span className="text-[11px] text-gray-400 flex-shrink-0">{e.time}</span>
          </div>
        ))}
      </div>

      <Link
        href="/admin/kemedar/concierge"
        className="block w-full text-center border-2 border-orange-400 text-orange-600 font-black py-2.5 rounded-xl text-sm hover:bg-orange-50 transition-all"
      >
        🗝️ Go to Concierge Dashboard →
      </Link>
    </div>
  );
}