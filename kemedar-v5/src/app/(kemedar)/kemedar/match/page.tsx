"use client";

import { useState } from "react";
import { Heart, X, Home, MapPin, BedDouble } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function MatchPage() {
  const [properties, setProperties] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [started, setStarted] = useState(false);
  const [loading, setLoading] = useState(false);

  const startMatching = async () => {
    setLoading(true);
    try {
      const res = await apiClient.get<any>("/api/v1/properties/recommended");
      setProperties(res.data || []);
      setStarted(true);
    } catch { /* handled */ } finally { setLoading(false); }
  };

  const handleSwipe = (liked: boolean) => {
    if (liked) {
      apiClient.post("/api/v1/properties/favorite", { propertyId: properties[current]?.id }).catch(() => {});
    }
    setCurrent((c) => c + 1);
  };

  const prop = properties[current];

  return (
    <div className="container mx-auto max-w-md py-8 px-4">
      <div className="text-center mb-8">
        <Heart className="w-12 h-12 text-pink-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">Property Match</h1>
        <p className="text-slate-500 mt-2">Swipe to find your perfect property match</p>
      </div>

      {!started ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <Home className="w-16 h-16 text-slate-300 mx-auto mb-4" />
          <p className="text-slate-500 mb-6">We will show you properties based on your preferences. Swipe right to like, left to pass.</p>
          <button onClick={startMatching} disabled={loading} className="bg-pink-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-pink-700 disabled:opacity-50">
            {loading ? "Loading..." : "Start Matching"}
          </button>
        </div>
      ) : !prop ? (
        <div className="bg-white rounded-xl border p-8 text-center">
          <h3 className="font-bold text-lg mb-2">All caught up!</h3>
          <p className="text-slate-500 mb-4">You have reviewed all recommended properties.</p>
          <button onClick={() => { setCurrent(0); startMatching(); }} className="bg-pink-600 text-white px-6 py-2 rounded-lg text-sm">Refresh</button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border overflow-hidden shadow-lg">
          <div className="h-48 bg-gradient-to-br from-slate-200 to-slate-300 flex items-center justify-center">
            {prop.imageUrl ? <img src={prop.imageUrl} alt="" className="w-full h-full object-cover" /> : <Home className="w-16 h-16 text-slate-400" />}
          </div>
          <div className="p-5">
            <h3 className="font-bold text-lg">{prop.title}</h3>
            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1"><MapPin className="w-3 h-3" />{prop.location || "Egypt"}</div>
            <div className="flex items-center gap-1 text-sm text-slate-500 mt-1"><BedDouble className="w-3 h-3" />{prop.bedrooms || "—"} bed</div>
            <div className="text-lg font-bold text-pink-600 mt-2">{prop.priceEGP ? `${prop.priceEGP.toLocaleString()} EGP` : "Price on request"}</div>
          </div>
          <div className="flex border-t">
            <button onClick={() => handleSwipe(false)} className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 hover:bg-red-50 hover:text-red-600 transition">
              <X className="w-6 h-6" />Pass
            </button>
            <button onClick={() => handleSwipe(true)} className="flex-1 py-4 flex items-center justify-center gap-2 text-slate-500 hover:bg-green-50 hover:text-green-600 transition border-l">
              <Heart className="w-6 h-6" />Like
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
