import { useState } from "react";

export default function HotspotDot({ hotspot, isActive, onClick }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        position: "absolute",
        left: `${hotspot.xPercent}%`,
        top: `${hotspot.yPercent}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 20,
        cursor: "pointer",
      }}
      onClick={(e) => { e.stopPropagation(); onClick(hotspot); }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Tooltip */}
      {hovered && (
        <div style={{
          position: "absolute",
          bottom: "calc(100% + 10px)",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#0A1628",
          color: "white",
          fontSize: 12,
          borderRadius: 6,
          padding: "4px 10px",
          whiteSpace: "nowrap",
          pointerEvents: "none",
          zIndex: 30,
          maxWidth: 220,
          textOverflow: "ellipsis",
          overflow: "hidden",
        }}>
          {hotspot.itemLabel}
          {/* Arrow */}
          <div style={{
            position: "absolute",
            top: "100%",
            left: "50%",
            transform: "translateX(-50%)",
            borderLeft: "5px solid transparent",
            borderRight: "5px solid transparent",
            borderTop: "5px solid #0A1628",
          }} />
        </div>
      )}

      {/* Outer pulse ring */}
      <div style={{
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: isActive ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.4)",
        animation: "stl-pulse 2s infinite",
      }} />

      {/* Inner dot */}
      <div style={{
        position: "relative",
        width: hovered ? 14 : 10,
        height: hovered ? 14 : 10,
        borderRadius: "50%",
        background: isActive ? "#F59E0B" : "#0A6EBD",
        border: isActive ? "2px solid #F59E0B" : "2px solid white",
        boxShadow: "0 0 6px rgba(0,0,0,0.4)",
        transition: "all 0.15s ease",
        zIndex: 2,
      }} />

      {/* Sponsored star */}
      {hotspot.isSponsored && (
        <div style={{
          position: "absolute",
          top: -6,
          right: -6,
          fontSize: 10,
          lineHeight: 1,
          zIndex: 3,
        }}>⭐</div>
      )}

      <style>{`
        @keyframes stl-pulse {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 0.7; }
          70% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}