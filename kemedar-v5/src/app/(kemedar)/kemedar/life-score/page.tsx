"use client";

import { useState } from "react";
import { MapPin, Star, Building, TreePine, GraduationCap, ShoppingCart, Heart } from "lucide-react";
import { apiClient } from "@/lib/api-client";

const CATEGORIES = [
  { key: "safety", label: "Safety", icon: Star, color: "text-yellow-600" },
  { key: "transport", label: "Transport", icon: MapPin, color: "text-blue-600" },
  { key: "amenities", label: "Amenities", icon: ShoppingCart, color: "text-green-600" },
  { key: "education", label: "Education", icon: GraduationCap, color: "text-purple-600" },
  { key: "healthcare", label: "Healthcare", icon: Heart, color: "text-red-600" },
  { key: "greenSpaces", label: "Green Spaces", icon: TreePine, color: "text-emerald-600" },
];

export default function LifeScorePage() {
  const [location, setLocation] = useState("");
  const [scores, setScores] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!location.trim()) return;
    setLoading(true);
    try {
      const res = await apiClient.get<any>(`/api/v1/locations/life-score?area=${encodeURIComponent(location)}`);
      setScores(res);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  return (
    <div className="container mx-auto max-w-4xl py-8 px-4">
      <div className="text-center mb-8">
        <Building className="w-12 h-12 text-teal-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">Neighborhood Life Score</h1>
        <p className="text-slate-500 mt-2">Compare neighborhoods across safety, transport, amenities, and more</p>
      </div>

      <div className="bg-white rounded-xl border p-6 mb-6">
        <div className="flex gap-3">
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder="Enter area name, e.g. New Cairo, Maadi, 6th of October..." className="flex-1 px-4 py-3 border rounded-lg text-sm" />
          <button onClick={handleSearch} disabled={loading} className="bg-teal-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-700 disabled:opacity-50">
            {loading ? "Analyzing..." : "Get Score"}
          </button>
        </div>
      </div>

      {scores ? (
        <div className="bg-white rounded-xl border p-6">
          <div className="text-center mb-6">
            <div className="text-5xl font-bold text-teal-600">{scores.overallScore || "—"}</div>
            <div className="text-sm text-slate-500 mt-1">Overall Life Score</div>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <div key={cat.key} className="border rounded-lg p-4 text-center">
                  <Icon className={`w-6 h-6 mx-auto mb-2 ${cat.color}`} />
                  <div className="text-lg font-bold">{scores[cat.key] ?? "—"}</div>
                  <div className="text-xs text-slate-500">{cat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border p-12 text-center text-slate-400">
          <MapPin className="w-12 h-12 mx-auto mb-3 text-slate-300" />
          <p className="text-sm">Enter a neighborhood to see its life score breakdown</p>
        </div>
      )}
    </div>
  );
}
