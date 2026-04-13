import { useState, useEffect } from "react";

const MESSAGES = [
  "🔍 Scanning image for damage...",
  "🧠 Diagnosing the root cause...",
  "📋 Writing contractor scope of work...",
  "🛒 Identifying Kemetro replacement parts...",
  "⚙️ Estimating labor and materials cost...",
];

export default function SnapLoadingOverlay({ imagePreviewUrl, onCancel }) {
  const [msgIndex, setMsgIndex] = useState(0);
  const [scanPos, setScanPos] = useState(20);
  const [scanDir, setScanDir] = useState(1);

  // Rotate messages
  useEffect(() => {
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  // Animate scan line
  useEffect(() => {
    const frame = setInterval(() => {
      setScanPos((pos) => {
        const next = pos + scanDir * 1.2;
        if (next >= 78) setScanDir(-1);
        if (next <= 12) setScanDir(1);
        return next;
      });
    }, 20);
    return () => clearInterval(frame);
  }, [scanDir]);

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center"
      style={{ background: "rgba(0,0,0,0.75)" }}
    >
      {/* Blurred bg image */}
      {imagePreviewUrl && (
        <img
          src={imagePreviewUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          style={{ filter: "brightness(0.35) blur(3px)", zIndex: 0 }}
        />
      )}

      {/* Cancel */}
      <div className="absolute top-safe top-4 w-full flex justify-center z-10" style={{ paddingTop: "env(safe-area-inset-top,12px)" }}>
        <button
          onClick={onCancel}
          className="text-white text-xs opacity-70 hover:opacity-100 transition-opacity"
        >
          Cancel
        </button>
      </div>

      {/* Center content */}
      <div className="relative z-10 w-full max-w-sm px-6 flex flex-col items-center">
        {/* Image with scanning line */}
        {imagePreviewUrl && (
          <div className="w-full relative mb-8" style={{ borderRadius: 16, overflow: "hidden", maxHeight: 260 }}>
            <img
              src={imagePreviewUrl}
              alt=""
              className="w-full object-cover"
              style={{ maxHeight: 260, filter: "brightness(0.6)" }}
            />
            {/* Scanning line */}
            <div
              className="absolute left-[5%] right-[5%] pointer-events-none"
              style={{
                top: `${scanPos}%`,
                height: 3,
                background: "linear-gradient(90deg, transparent, #00C896, transparent)",
                boxShadow: "0 0 12px 3px rgba(0,200,150,0.7)",
                transition: "top 0.02s linear",
              }}
            />
          </div>
        )}

        {/* Message */}
        <p
          className="text-white font-bold text-center mb-4"
          style={{ fontSize: 15, minHeight: 24 }}
          key={msgIndex}
        >
          {MESSAGES[msgIndex]}
        </p>

        {/* Progress dots */}
        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: "#00C896",
                opacity: msgIndex % 3 === i ? 1 : 0.35,
                transition: "opacity 0.3s",
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}