import { X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { saveSnapSessionToken } from "@/lib/snapSessionRecovery";

export default function LoginPromptModal({ onClose, sessionId, session }) {
  // Save token so we can recover after login
  if (session?.sessionToken) {
    saveSnapSessionToken(session.sessionToken);
  }

  const handleLogin = () => {
    base44.auth.redirectToLogin(`/kemework/snap/review/${sessionId}`);
  };

  const diagnosedIssue = session?.diagnosedIssue || "Home repair issue diagnosed";
  const materialsCount = session?.requiredMaterials?.length || 0;
  const hoursMin = session?.estimatedLaborHoursMin;
  const hoursMax = session?.estimatedLaborHoursMax;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        style={{ background: "rgba(10,22,40,0.85)", backdropFilter: "blur(4px)" }}
      />

      {/* Card */}
      <div
        className="relative bg-white w-full rounded-3xl z-10 overflow-hidden"
        style={{ maxWidth: 480, boxShadow: "0 24px 80px rgba(0,0,0,0.35)" }}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-700 rounded-full bg-gray-100 z-10"
        >
          <X size={16} />
        </button>

        <div className="px-8 pt-8 pb-8 text-center">
          {/* Animated sparkle */}
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-4xl mx-auto mb-5"
            style={{
              background: "linear-gradient(135deg, #99F6E4, #5EEAD4)",
              animation: "pulse 2s ease-in-out infinite",
            }}
          >
            ✨
          </div>

          <h3 className="text-[22px] font-black text-gray-900 mb-4">
            Your diagnosis is ready!
          </h3>

          {/* AI Summary preview — urgency-creating */}
          <div
            className="rounded-2xl p-4 mb-5 text-left space-y-1.5"
            style={{ background: "#F0FDFA" }}
          >
            <p className="text-[15px] font-black text-teal-800">🩺 {diagnosedIssue}</p>
            {materialsCount > 0 && (
              <p className="text-[13px] text-teal-700">📋 {materialsCount} material{materialsCount !== 1 ? "s" : ""} identified</p>
            )}
            {(hoursMin || hoursMax) && (
              <p className="text-[13px] text-teal-700">
                ⏱️ Est. {hoursMin}–{hoursMax} hours of work
              </p>
            )}
          </div>

          {/* Body text */}
          <p className="text-[14px] text-gray-500 leading-relaxed mb-6">
            Create a free account to instantly send this diagnosis to top-rated professionals in your area and get quotes within minutes.
          </p>

          {/* CTA */}
          <button
            onClick={handleLogin}
            className="w-full flex items-center justify-center gap-2 font-black text-white rounded-2xl text-[16px] mb-4 transition-all active:scale-[0.98]"
            style={{
              height: 52,
              background: "linear-gradient(135deg, #14B8A6, #0A6EBD)",
              boxShadow: "0 4px 20px rgba(20,184,166,0.4)",
            }}
          >
            🚀 Sign In / Register
          </button>

          {/* Secondary */}
          <button
            onClick={onClose}
            className="text-[14px] text-gray-400 hover:text-gray-600 transition-colors flex items-center justify-center gap-1 w-full mb-4"
          >
            👁️ View diagnosis again
          </button>

          {/* Privacy note */}
          <p className="text-[11px] text-gray-400">
            Free account · No credit card required
          </p>
        </div>

        <style>{`
          @keyframes pulse {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.08); }
          }
        `}</style>
      </div>
    </div>
  );
}