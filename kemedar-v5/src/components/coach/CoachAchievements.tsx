"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ACHIEVEMENT_DEFS } from "@/lib/coachJourneyData";

export default function CoachAchievements({ profile }) {
  const [earned, setEarned] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile?.id) {
      apiClient.list("/api/v1/coachachievement", { coachProfileId: profile.id })
        .then(data => { setEarned(data); setLoading(false); })
        .catch(() => setLoading(false));
    }
  }, [profile?.id]);

  const totalPoints = earned.reduce((s, a) => s + (a.pointsEarned || 0), 0);
  const earnedIds = new Set(earned.map(a => a.achievementName));

  return (
    <div className="p-6">
      <div className="bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl p-5 mb-6 text-center border border-orange-100">
        <p className="text-3xl font-black text-orange-600">{totalPoints}</p>
        <p className="text-sm text-gray-500 font-semibold">Total Coach Points</p>
        <p className="text-xs text-gray-400 mt-1">{earned.length} achievements earned</p>
      </div>

      <h3 className="font-black text-gray-900 mb-4">🏅 Achievements</h3>
      <div className="grid grid-cols-2 gap-3">
        {ACHIEVEMENT_DEFS.map(def => {
          const isEarned = earnedIds.has(def.name);
          return (
            <div key={def.id} className={`p-4 rounded-2xl border-2 text-center transition-all ${
              isEarned ? 'border-orange-200 bg-orange-50' : 'border-gray-100 bg-gray-50 opacity-50'
            }`}>
              <div className={`text-4xl mb-2 ${!isEarned ? 'grayscale' : ''}`}>{def.icon}</div>
              <p className="font-black text-gray-900 text-xs mb-1">{def.name}</p>
              <p className="text-[10px] text-orange-600 font-bold">{def.points} pts</p>
              {!isEarned && <p className="text-[10px] text-gray-400 mt-1">Locked</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}