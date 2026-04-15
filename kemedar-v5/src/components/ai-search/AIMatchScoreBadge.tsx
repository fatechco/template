// @ts-nocheck
export default function AIMatchScoreBadge({ score }) {
  const pct = Math.round(score || 0);
  const color = pct >= 95 ? '#15803d' :
                pct >= 85 ? '#16a34a' :
                pct >= 75 ? '#ca8a04' :
                pct >= 65 ? '#ea580c' : '#dc2626';

  return (
    <div
      className="flex flex-col items-center justify-center w-11 h-11 rounded-full shadow-md flex-shrink-0"
      style={{ backgroundColor: color }}
    >
      <span className="text-white text-xs font-black leading-none">{pct}</span>
      <span className="text-white text-[8px] leading-none mt-0.5 opacity-80">Match</span>
    </div>
  );
}