import { Sparkles } from "lucide-react";

export default function VisionBadge({ score, grade, compact = false }) {
  if (!score || score < 70) return null;

  const isPremium = score >= 85;

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
        isPremium ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
      }`}>
        <Sparkles size={9} />
        Vision {isPremium ? 'Premium' : 'Verified'}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold ${
      isPremium ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-blue-100 text-blue-700 border border-blue-200'
    }`}>
      <Sparkles size={12} />
      {isPremium ? '✨ Vision Verified — Premium Photos' : '📸 Vision Verified'}
    </div>
  );
}