"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import { Brain, RefreshCw, Users, Activity } from "lucide-react";

export default function AdminDNAPage() {
  const qc = useQueryClient();
  const [recalculating, setRecalculating] = useState(false);

  const { data: stats, isLoading } = useQuery({
    queryKey: ["admin-dna-stats"],
    queryFn: () => apiClient.get<{ totalProfiles: number; calculatedToday: number; pendingRecalc: number; avgSignals: number }>("/api/v1/admin/dna/stats"),
  });

  const recalcAll = useMutation({
    mutationFn: () => apiClient.post("/api/v1/admin/dna/recalculate-all"),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ["admin-dna-stats"] }); setRecalculating(false); },
    onError: () => setRecalculating(false),
  });

  const statCards = [
    { icon: Users, label: "Total Profiles", value: stats?.totalProfiles ?? 0, color: "text-blue-500" },
    { icon: Brain, label: "Calculated Today", value: stats?.calculatedToday ?? 0, color: "text-purple-500" },
    { icon: Activity, label: "Pending Recalc", value: stats?.pendingRecalc ?? 0, color: "text-amber-500" },
    { icon: Brain, label: "Avg Signals/User", value: stats?.avgSignals ?? 0, color: "text-green-500" },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div><h1 className="text-2xl font-bold">User DNA</h1><p className="text-sm text-slate-500 mt-1">Behavioral profiling and preference analysis</p></div>
        <button
          onClick={() => { setRecalculating(true); recalcAll.mutate(); }}
          disabled={recalculating}
          className="border bg-white px-4 py-2 rounded-lg text-sm hover:bg-slate-50 flex items-center gap-2 disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${recalculating ? "animate-spin" : ""}`} /> Recalculate All
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
        <h2 className="text-lg font-semibold mb-4">DNA Signal Categories</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
          {["Search Behavior", "Property Views", "Saved Preferences", "Budget Signals", "Location Affinity", "Style Preferences", "Lifestyle Indicators", "Transaction History"].map((cat) => (
            <div key={cat} className="border rounded-lg p-3 text-center">
              <Brain className="w-5 h-5 mx-auto text-purple-400 mb-1" />
              <div className="text-sm font-medium">{cat}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
