export default function MobileHotspotDot({ hotspot, isActive, onClick }) {
  return (
    <div
      style={{
        position: "absolute",
        left: `${hotspot.xPercent}%`,
        top: `${hotspot.yPercent}%`,
        transform: "translate(-50%, -50%)",
        zIndex: 20,
        // Large 48×48 invisible tap target
        width: 48,
        height: 48,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
      }}
      onClick={(e) => { e.stopPropagation(); onClick(hotspot); }}
    >
      {/* Outer pulse ring */}
      <div style={{
        position: "absolute",
        width: 28,
        height: 28,
        borderRadius: "50%",
        background: isActive ? "rgba(245,158,11,0.4)" : "rgba(255,255,255,0.4)",
        animation: "stl-mobile-pulse 2s infinite",
      }} />

      {/* Inner dot */}
      <div style={{
        position: "relative",
        width: 10,
        height: 10,
        borderRadius: "50%",
        background: isActive ? "#F59E0B" : "#0A6EBD",
        border: "2px solid white",
        boxShadow: "0 0 6px rgba(0,0,0,0.4)",
        zIndex: 2,
        transition: "all 0.15s ease",
      }} />

      {/* Sponsored star */}
      {hotspot.isSponsored && (
        <div style={{
          position: "absolute",
          top: 4,
          right: 4,
          fontSize: 10,
          lineHeight: 1,
          zIndex: 3,
        }}>⭐</div>
      )}

      <style>{`
        @keyframes stl-mobile-pulse {
          0% { transform: scale(1); opacity: 0.7; }
          70% { transform: scale(1.5); opacity: 0; }
          100% { transform: scale(1.5); opacity: 0; }
        }
      `}</style>
    </div>
  );
}