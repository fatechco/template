import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { JOURNEY_META } from "@/lib/coachJourneyData";
import { isMobileSession } from "@/lib/mobile-detect";

export default function CoachDashboardWidget() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const coachPath = isMobileSession() ? '/m/kemedar/coach' : '/kemedar/coach';

  useEffect(() => {
    base44.auth.me()
      .then(u => u ? base44.entities.CoachProfile.filter({ userId: u.id }) : [])
      .then(profiles => setProfile(profiles[0] || null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  const meta = profile ? JOURNEY_META[profile.journeyType] : null;

  if (!profile) {
    return (
      <div className="bg-gradient-to-br from-teal-500 to-orange-500 rounded-2xl p-5 text-white">
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🎓</span>
          <div>
            <p className="font-black text-white">Kemedar Coach™</p>
            <p className="text-white/70 text-xs">Your personal property guide</p>
          </div>
        </div>
        <p className="text-white/80 text-sm mb-4">Let Kemedar Coach guide you step-by-step through your property journey.</p>
        <Link to={coachPath} className="block w-full text-center bg-white text-orange-600 font-black py-2.5 rounded-xl hover:bg-orange-50 transition-colors text-sm">
          🚀 Start My Journey
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border-l-4 border-l-teal-500 border border-gray-100 shadow-sm p-5">
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xl">🎓</span>
        <p className="font-black text-gray-900 text-sm">Kemedar Coach™</p>
        {profile.streakDays > 0 && (
          <span className="ml-auto text-xs bg-orange-100 text-orange-700 font-bold px-2 py-0.5 rounded-full">
            🔥 {profile.streakDays}d streak
          </span>
        )}
      </div>
      {meta && (
        <p className="text-xs font-semibold text-gray-500 mb-2">{meta.icon} {meta.name}</p>
      )}
      <div className="mb-1 flex items-center justify-between">
        <p className="text-xs text-gray-500">Stage {(profile.completedStageIds?.length || 0) + 1} • {profile.overallProgress}% complete</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
        <div className="bg-teal-500 h-2 rounded-full transition-all" style={{ width: `${profile.overallProgress}%` }}/>
      </div>
      {profile.currentStepId && (
        <p className="text-xs text-gray-600 mb-3">
          📍 Next: <span className="font-semibold capitalize">{profile.currentStepId?.replace(/_/g, ' ')}</span>
        </p>
      )}
      {profile.coachStatus === 'completed' && (
        <p className="text-xs text-teal-600 font-bold mb-3">🏆 Journey Complete! Start your next one.</p>
      )}
      <div className="flex gap-2">
        <Link to={coachPath} className="flex-1 text-center bg-orange-500 hover:bg-orange-600 text-white font-black py-2 rounded-xl text-xs transition-colors">
          ▶️ Continue
        </Link>
        <Link to={coachPath + '?tab=chat'} className="flex-1 text-center border border-gray-200 text-gray-600 font-bold py-2 rounded-xl text-xs hover:border-teal-300 transition-colors">
          💬 Ask Coach
        </Link>
      </div>
    </div>
  );
}