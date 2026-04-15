// @ts-nocheck
import { Rocket } from "lucide-react";

export default function DiagnosisStickyBar({ session, onPostTask, isPosting, isGuest }) {
  const laborMin = session?.estimatedLaborCostEGPMin;
  const laborMax = session?.estimatedLaborCostEGPMax;
  const materialsCost = session?.totalEstimatedMaterialsCostEGP;

  const laborText =
    laborMin && laborMax
      ? `${Number(laborMin).toLocaleString()}–${Number(laborMax).toLocaleString()} EGP labor`
      : laborMin
      ? `From ${Number(laborMin).toLocaleString()} EGP labor`
      : null;

  const partsText =
    materialsCost && materialsCost > 0
      ? `+ ${Number(materialsCost).toLocaleString()} EGP parts`
      : null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white px-4 pb-safe"
      style={{
        borderTop: "1px solid #E5E7EB",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
        paddingBottom: "max(12px, env(safe-area-inset-bottom))",
        paddingTop: 12,
      }}
    >
      {/* Summary row */}
      {(laborText || partsText) && (
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[12px] text-gray-400 font-medium">Est. total:</span>
          <span className="text-[13px] font-bold text-gray-800">
            {[laborText, partsText].filter(Boolean).join(" ")}
          </span>
        </div>
      )}

      {/* Post task button */}
      <button
        onClick={onPostTask}
        disabled={isPosting}
        className="w-full flex items-center justify-center gap-2 font-black text-white rounded-2xl transition-all disabled:opacity-60 active:scale-[0.98]"
        style={{
          height: 52,
          background: isPosting ? "#99D6CF" : "#14B8A6",
          fontSize: 16,
          boxShadow: "0 4px 16px rgba(20,184,166,0.35)",
        }}
      >
        {isPosting ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span>Posting...</span>
          </>
        ) : (
          <>
            <Rocket size={18} />
            <span>{isGuest ? "Sign in to Post Task" : "Post Task to Professionals"}</span>
          </>
        )}
      </button>
    </div>
  );
}