// @ts-nocheck
export default function SafetyAlertBanner({ urgencyLevel, safetyWarning }) {
  if (urgencyLevel !== "high" && urgencyLevel !== "emergency") return null;

  const isEmergency = urgencyLevel === "emergency";

  return (
    <div
      className="w-full flex items-start gap-3"
      style={{
        background: "#EF4444",
        padding: "14px 20px",
        border: isEmergency ? "2px solid #FCA5A5" : "none",
      }}
    >
      {/* Pulsing warning icon */}
      <span
        className="text-2xl flex-shrink-0 mt-0.5"
        style={{ animation: "safety-pulse 1.5s ease-in-out infinite" }}
      >
        ⚠️
      </span>

      <div className="flex-1 min-w-0">
        <p className="text-white font-black text-[13px] uppercase tracking-wide mb-1">
          Safety First
        </p>
        {safetyWarning && (
          <p className="text-white text-[13px] leading-relaxed">
            {safetyWarning}
          </p>
        )}
        {isEmergency && (
          <p
            className="text-white font-black text-[13px] mt-2"
            style={{ animation: "safety-blink 1s step-end infinite" }}
          >
            Call a professional NOW
          </p>
        )}
      </div>

      <style>{`
        @keyframes safety-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.15); }
        }
        @keyframes safety-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}