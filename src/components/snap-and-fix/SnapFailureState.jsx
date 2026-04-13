import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function SnapFailureState({ message, details, onRetry }) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-56px)] px-6 text-center" style={{ background: "#F0FDFA" }}>
      <div style={{ fontSize: 64, marginBottom: 20 }}>🔍</div>

      <h2 className="font-black text-gray-800 mb-2" style={{ fontSize: 20 }}>
        {message || "We couldn't diagnose this photo"}
      </h2>
      <p className="text-gray-500 mb-8" style={{ fontSize: 14, maxWidth: 300, lineHeight: 1.6 }}>
        Try a closer, clearer shot with better lighting.
      </p>

      <button
        onClick={onRetry}
        className="w-full max-w-xs font-bold text-white transition-all hover:opacity-90 active:scale-98 mb-3"
        style={{
          background: "#0F766E",
          borderRadius: 14,
          height: 52,
          fontSize: 15,
        }}
      >
        📷 Try Another Photo
      </button>

      <Link
        to="/kemework/post-task"
        className="font-medium transition-colors"
        style={{ color: "#6B7280", fontSize: 14 }}
      >
        ✏️ Describe it manually
      </Link>

      {details && (
        <div className="mt-8 w-full max-w-xs">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-600 transition-colors text-xs mx-auto"
          >
            {showDetails ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {showDetails ? "Hide" : "Show"} error details
          </button>
          {showDetails && (
            <p className="mt-2 text-gray-400 text-xs break-words text-left bg-white rounded-xl p-3 border border-gray-100">
              {details}
            </p>
          )}
        </div>
      )}
    </div>
  );
}