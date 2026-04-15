"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

const RECENT = [
  { icon: "🔄", text: "New swap intent — Luxury Apartment, New Cairo", time: "2 min ago" },
  { icon: "🤝", text: "New AI match — Score: 92% — Villa A ⇄ Apt B", time: "15 min ago" },
  { icon: "💚", text: "Interest expressed — Ahmed Hassan on Sheikh Zayed Villa", time: "34 min ago" },
  { icon: "🎉", text: "MATCH! — Nour M. ⇄ Khaled A.", time: "1 hr ago" },
  { icon: "✅", text: "Swap completed — Twin House ⇄ Apartment, New Cairo", time: "Yesterday" },
];

export default function AdminSwapWidget() {
  const [stats, setStats] = useState({ intents: 0, matches: 0, negotiations: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [intents, matches, negs] = await Promise.all([
          apiClient.list("/api/v1/swapintent", { status: "active" }, "-created_date", 100),
          apiClient.get("/api/v1/" + "swapmatch", "-created_date", 50),
          apiClient.list("/api/v1/swapmatch", { status: "negotiating" }, "-created_date", 20),
        ]);
        setStats({
          intents: intents?.length || 0,
          matches: matches?.length || 0,
          negotiations: negs?.length || 0,
        });
      } catch (_) {}
      setLoading(false);
    };
    load();
  }, []);

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-xl flex items-center justify-center text-base">🔄</div>
          <h2 className="text-base font-black text-gray-900">Kemedar Swap™ Today</h2>
        </div>
        <Link href="/admin/kemedar/swaps" className="text-xs text-[#7C3AED] font-bold hover:underline">View Full Dashboard →</Link>
      </div>

      {/* Stats row */}
      <div className="flex flex-wrap gap-4 mb-4">
        {[
          ["New Intents", loading ? "…" : stats.intents, "text-purple-600"],
          ["New Matches", loading ? "…" : stats.matches, "text-orange-600"],
          ["Active Negotiations", loading ? "…" : stats.negotiations, "text-green-600"],
        ].map(([label, val, color]) => (
          <div key={label} className="flex-1 min-w-[110px] bg-gray-50 rounded-xl p-3 text-center">
            <p className={`text-2xl font-black ${color}`}>{val}</p>
            <p className="text-[11px] text-gray-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Recent events */}
      <div className="space-y-2 mb-4">
        {RECENT.map(({ icon, text, time }, i) => (
          <div key={i} className="flex items-start gap-2 py-1.5 border-b border-gray-50 last:border-0">
            <span className="text-sm flex-shrink-0">{icon}</span>
            <span className="text-xs text-gray-700 flex-1">{text}</span>
            <span className="text-[11px] text-gray-400 flex-shrink-0">{time}</span>
          </div>
        ))}
      </div>

      <Link
        href="/admin/kemedar/swaps"
        className="block w-full text-center border-2 border-[#7C3AED] text-[#7C3AED] font-black py-2.5 rounded-xl text-sm hover:bg-purple-50 transition-all"
      >
        🔄 Go to Swap™ Dashboard →
      </Link>
    </div>
  );
}