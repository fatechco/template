"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Heart, RefreshCw, Users, Zap } from "lucide-react";

export default function AdminMatchPage() {
  const qc = useQueryClient();
  const [regenerating, setRegenerating] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-match-stats"],
    queryFn: () => apiClient.get<{ activeProfiles: number; matchesGenerated: number; queueSize: number; avgMatchScore: number }>("/api/v1/admin/match/stats"),
  });

  const regenerate = useMutation({
    mutationFn: () => apiClient.post("/api/v1/admin/match/regenerate"),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-match-stats"] }); setRegenerating(false); },
    onError: () => setRegenerating(false),
  });

  const statCards = [
    { icon: Users, label: "Active Profiles", value: stats?.activeProfiles ?? 0, color: "text-blue-500" },
    { icon: Heart, label: "Matches Generated", value: stats?.matchesGenerated ?? 0, color: "text-pink-500" },
    { icon: Zap, label: "Queue Size", value: stats?.queueSize ?? 0, color: "text-amber-500" },
    { icon: Heart, label: "Avg Match Score", value: stats?.avgMatchScore ? `${stats.avgMatchScore}%` : "N/A", color: "text-green-500" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">Property Matching</h1><p className="text-sm text-slate-500 mt-1">AI-powered property matching engine</p></div>
        <button
          onClick={() => { setRegenerating(true); regenerate.mutate(); }}
          disabled={regenerating}
          className="border bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${regenerating ? "animate-spin" : ""}`} /> Regenerate Queue
        </button>
      </div>

      <div className="grid md:grid-cols-4 gap-4 mb-6">
        {statCards.map((s) => (
          <div key={s.label} className="bg-white border rounded-xl p-5 flex items-center gap-3">
            <s.icon className={`w-8 h-8 ${s.color}`} />
            <div>
              <div className="text-2xl font-bold">{isLoading ? <span className="inline-block w-8 h-6 bg-slate-100 rounded animate-pulse" /> : s.value}</div>
              <div className="text-sm text-slate-500">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border rounded-xl p-6">
        <h2 className="text-lg font-semibold mb-4">Match Factors</h2>
        <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
          {["DNA Compatibility", "Location Fit", "Budget Match", "Lifestyle Alignment", "Property Features"].map((f) => (
            <div key={f} className="border rounded-lg p-3 text-center">
              <Heart className="w-5 h-5 mx-auto text-pink-400 mb-1" />
              <div className="text-sm font-medium">{f}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
