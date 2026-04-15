"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { apiClient } from "@/lib/api-client";

export default function LifeScoreNearbyAreas({ cityId, currentAreaId }) {
  const [nearby, setNearby] = useState([]);

  useEffect(() => {
    const fetchNearby = async () => {
      try {
        const data = await apiClient.list("/api/v1/neighborhoodlifescore", 
          { cityId, isPublished: true },
          "-overallLifeScore",
          10
        );
        setNearby(data.filter(a => a.id !== currentAreaId).slice(0, 6));
      } catch (err) {
        console.error("Error fetching nearby areas:", err);
      }
    };
    if (cityId) fetchNearby();
  }, [cityId, currentAreaId]);

  if (nearby.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">📍 Nearby Neighborhoods</h2>
      <p className="text-gray-500 mb-6">How does this area compare to its neighbors?</p>

      <div className="flex overflow-x-auto gap-4 pb-4 no-scrollbar">
        {nearby.map(area => (
          <Link
            key={area.id}
            href={`/kemedar/life-score/${area.cityId}/${area.districtId || area.id}`}
            className="flex-shrink-0 w-40 bg-gray-50 hover:bg-orange-50 hover:border-orange-500 border border-gray-200 rounded-xl p-4 transition-all text-center"
          >
            <p className="font-bold text-sm text-gray-900 mb-1 truncate">{area.displayName}</p>
            <p className="text-3xl font-black text-orange-500">{Math.round(area.overallLifeScore)}</p>
            <p className="text-xs text-gray-400">Life Score</p>
            <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full block mt-2">
              Compare →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}