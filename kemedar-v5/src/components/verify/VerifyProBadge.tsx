// @ts-nocheck
/**
 * Reusable Verify Pro badge — used in title rows and cards.
 * level: 1-5, size: "sm" | "md"
 */
export default function VerifyProBadge({ level, size = "md" }) {
  if (!level || level < 2) return null;

  const sm = size === "sm";

  if (level === 5) {
    return (
      <span
        title="Fully verified — certificate issued"
        className={`inline-flex items-center gap-1 font-black rounded-full animate-pulse
          ${sm ? "text-[9px] px-2 py-0.5" : "text-xs px-3 py-1"}
          bg-yellow-400 text-white shadow-md`}
        style={{ boxShadow: "0 0 8px rgba(255,215,0,0.5)" }}
      >
        🔐 VERIFIED
      </span>
    );
  }

  const configs = {
    2: { icon: "◔", label: "Seller Verified", title: "Seller identity has been confirmed", color: "border-orange-400 text-orange-600 bg-white" },
    3: { icon: "◑", label: "Doc Verified", title: "Documents reviewed and approved by Franchise Owner", color: "border-orange-500 text-orange-600 bg-orange-50" },
    4: { icon: "◕", label: "Inspected", title: "Property physically inspected by Kemedar FO", color: "border-orange-600 text-orange-700 bg-orange-50" },
  };

  const cfg = configs[level];
  if (!cfg) return null;

  return (
    <span
      title={cfg.title}
      className={`inline-flex items-center gap-1 font-bold rounded-full border
        ${sm ? "text-[9px] px-1.5 py-0.5" : "text-xs px-2.5 py-1"}
        ${cfg.color}`}
    >
      <span>{cfg.icon}</span>
      {!sm && cfg.label}
    </span>
  );
}