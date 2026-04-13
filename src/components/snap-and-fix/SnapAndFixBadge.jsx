import { useState } from "react";

export default function SnapAndFixBadge({ compact = false }) {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <div className="relative inline-flex">
      <span
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
        className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-white font-bold cursor-default select-none"
        style={{
          background: "linear-gradient(90deg, #14B8A6, #0A6EBD)",
          fontSize: compact ? 10 : 11,
        }}
      >
        ✨ AI Diagnosed Task
      </span>
      {showTooltip && (
        <div
          className="absolute z-50 bottom-full left-0 mb-2 w-56 bg-gray-900 text-white rounded-xl px-3 py-2.5 shadow-xl"
          style={{ fontSize: 12, lineHeight: 1.4 }}
        >
          This task was AI-analyzed from a real photo. The scope of work is technically precise.
          <div className="absolute top-full left-4 w-0 h-0" style={{ borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #111827" }} />
        </div>
      )}
    </div>
  );
}