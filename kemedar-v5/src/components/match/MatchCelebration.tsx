"use client";
// @ts-nocheck
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function MatchCelebration({ match, property, onDismiss }) {
  const router = useRouter();
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 300),
      setTimeout(() => setPhase(2), 900),
      setTimeout(() => setPhase(3), 1800),
      setTimeout(() => setPhase(4), 2800),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  const images = property?.image_gallery?.[0] || property?.featured_image || "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&q=80";

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 via-orange-950 to-gray-900 overflow-hidden">
      {/* Confetti particles */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            className="absolute w-2 h-2 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              backgroundColor: ["#FF6B00", "#FFD700", "#FF4444", "#00FF88", "#6B4FFF"][i % 5],
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${1 + Math.random() * 2}s`
            }}
          />
        ))}
      </div>

      {/* Phase 2: Big emoji */}
      {phase >= 1 && (
        <div className="text-9xl mb-4 animate-bounce">🎉</div>
      )}

      {/* Phase 3: Text */}
      {phase >= 2 && (
        <h1 className="text-5xl font-black text-white mb-6 animate-pulse">It's a Match!</h1>
      )}

      {/* Phase 4: Property + heart + seller */}
      {phase >= 3 && (
        <div className="flex items-center gap-4 mb-6">
          <img src={images} alt="property" className="w-24 h-24 rounded-2xl object-cover border-4 border-orange-500 shadow-lg" />
          <span className="text-5xl animate-pulse">❤️</span>
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center border-4 border-white shadow-lg">
            <span className="text-3xl">🏠</span>
          </div>
        </div>
      )}

      {/* Phase 5: Actions */}
      {phase >= 4 && (
        <div className="w-full max-w-sm px-6 space-y-3">
          <p className="text-white/70 text-center text-sm italic mb-4">
            💡 This property checks your top priorities and is competitively priced in the area
          </p>
          <button
            onClick={() => router.push(`/kemedar/negotiate/${match?.negotiationSessionId || match?.id}`)}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl text-lg transition-all"
          >
            💬 Start Negotiation Now
          </button>
          <button
            onClick={onDismiss}
            className="w-full border-2 border-white/40 text-white font-bold py-3 rounded-2xl hover:bg-white/10 transition-all"
          >
            👁 Keep Swiping
          </button>
        </div>
      )}
    </div>
  );
}