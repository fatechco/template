"use client";
// @ts-nocheck
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function SurplusSuccessScreen({ item, onListAnother }) {
  const router = useRouter();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setVisible(true), 50);
  }, []);

  const weight = item?.estimatedWeightKg || 0;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center px-6"
      style={{ background: "linear-gradient(135deg, #14532D, #166534)" }}>
      <div className={`flex flex-col items-center text-center transition-all duration-700 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
        {/* Bouncing icon */}
        <div className="text-8xl mb-6" style={{ animation: "bounce 1s ease-in-out infinite" }}>♻️</div>

        <h2 className="text-3xl font-black text-white mb-3">✅ Listed!</h2>
        <p className="text-white/90 text-lg font-semibold mb-2">
          You just saved <span className="text-green-300 font-black">{weight} kg</span> of materials
        </p>
        <p className="text-white/80 text-base mb-8">from the landfill 🌍</p>

        {item?.estimatedCo2SavedKg && (
          <div className="bg-white/10 rounded-2xl px-6 py-3 mb-8 border border-white/20">
            <p className="text-green-300 font-bold text-sm">🌿 {item.estimatedCo2SavedKg} kg CO₂ saved</p>
          </div>
        )}

        <div className="flex flex-col gap-3 w-full max-w-xs">
          <button
            onClick={() => router.push(`/kemetro/surplus`)}
            className="w-full py-4 rounded-2xl font-black text-green-800 text-base"
            style={{ background: "white" }}
          >
            View My Listing
          </button>
          <button
            onClick={onListAnother}
            className="w-full py-3.5 rounded-2xl font-bold text-white text-base border-2 border-white/50 hover:bg-white/10 transition-colors"
          >
            List Another Item
          </button>
        </div>
      </div>

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-16px); }
        }
      `}</style>
    </div>
  );
}