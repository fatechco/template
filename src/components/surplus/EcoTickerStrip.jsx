import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";

export default function EcoTickerStrip() {
  const [stats, setStats] = useState({ weightKg: 0, co2Kg: 0 });

  const loadStats = async () => {
    try {
      const sold = await base44.entities.SurplusItem.filter({ status: "sold" }, "-created_date", 1000);
      const weightKg = (sold || []).reduce((s, i) => s + (i.estimatedWeightKg || 0), 0);
      const co2Kg = (sold || []).reduce((s, i) => s + (i.estimatedCo2SavedKg || 0), 0);
      setStats({ weightKg: Math.round(weightKg), co2Kg: Math.round(co2Kg) });
    } catch { /* fail silently */ }
  };

  useEffect(() => {
    loadStats();
    const interval = setInterval(loadStats, 60000);
    return () => clearInterval(interval);
  }, []);

  const weightTons = (stats.co2Kg / 1000).toFixed(1);

  return (
    <div className="bg-[#14532d] overflow-hidden py-2.5 px-4">
      <div className="flex items-center justify-center gap-1">
        <div
          className="flex items-center gap-1 whitespace-nowrap text-white text-xs font-bold"
          style={{ animation: "ticker 20s linear infinite" }}
        >
          <span className="mr-3">🌍</span>
          <span>
            Kemedar users have saved{" "}
            <span className="text-green-300">{Number(stats.weightKg).toLocaleString()} kg</span>{" "}
            of building materials from landfills this year — equal to{" "}
            <span className="text-green-300">{weightTons} tons</span>{" "}
            of CO₂ avoided.
          </span>
          <span className="mx-6">♻️</span>
          <span>
            Kemedar users have saved{" "}
            <span className="text-green-300">{Number(stats.weightKg).toLocaleString()} kg</span>{" "}
            of building materials from landfills this year — equal to{" "}
            <span className="text-green-300">{weightTons} tons</span>{" "}
            of CO₂ avoided.
          </span>
          <span className="ml-6">♻️</span>
        </div>
      </div>
      <style>{`
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}