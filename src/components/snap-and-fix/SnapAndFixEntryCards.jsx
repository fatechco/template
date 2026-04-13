import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export default function SnapAndFixEntryCards() {
  return (
    <div className="space-y-3 px-4 py-4">
      {/* CARD 1 — Snap & Fix */}
      <div
        style={{
          background: "linear-gradient(180deg, #0F766E 0%, #134E4A 100%)",
          borderRadius: 20,
          padding: "24px 20px",
          boxShadow: "0 8px 32px rgba(15,118,110,0.3)",
        }}
      >
        {/* Top row */}
        <div className="flex items-center justify-between mb-3">
          <span style={{ fontSize: 48, lineHeight: 1 }}>📷✨</span>
          <span
            className="font-black"
            style={{
              background: "white",
              color: "#0F766E",
              borderRadius: 20,
              padding: "4px 10px",
              fontSize: 10,
            }}
          >
            AI Powered
          </span>
        </div>

        <h2 className="text-white font-black mb-2" style={{ fontSize: 22 }}>
          Fix it in a Snap
        </h2>
        <p className="text-white mb-5" style={{ fontSize: 14, opacity: 0.85, lineHeight: 1.6 }}>
          Don't know what it's called? Just take a photo. Our AI diagnoses the problem and finds the right professional — automatically.
        </p>

        <Link
          to="/kemework/snap"
          className="flex items-center justify-center w-full font-bold transition-all hover:opacity-90 active:scale-98"
          style={{
            background: "white",
            color: "#0F766E",
            borderRadius: 14,
            height: 52,
            fontSize: 15,
          }}
        >
          📸 Open Camera to Diagnose
        </Link>

        <div className="text-center mt-3">
          <Link
            to="/kemework/post-task"
            style={{ color: "rgba(255,255,255,0.7)", fontSize: 13 }}
          >
            ✏️ Describe it manually instead
          </Link>
        </div>
      </div>

      {/* CARD 2 — Standard Post Task */}
      <Link
        to="/kemework/post-task"
        className="flex items-center gap-3 w-full text-left transition-all hover:bg-gray-50 active:scale-98"
        style={{
          background: "white",
          border: "1px solid #E5E7EB",
          borderRadius: 16,
          padding: "16px 20px",
        }}
      >
        <span style={{ fontSize: 24, flexShrink: 0 }}>✏️</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900" style={{ fontSize: 15 }}>
            Describe your task manually
          </p>
          <p className="text-gray-400" style={{ fontSize: 13 }}>
            Write your own task description
          </p>
        </div>
        <ArrowRight size={18} className="text-gray-400 flex-shrink-0" />
      </Link>
    </div>
  );
}