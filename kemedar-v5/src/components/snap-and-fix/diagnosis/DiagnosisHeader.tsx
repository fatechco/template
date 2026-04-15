"use client";
// @ts-nocheck
import { ArrowLeft, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function DiagnosisHeader({ sessionId }) {
  const router = useRouter();

  const handleShare = () => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: "AI Diagnosis — Kemework Snap & Fix",
        url,
      }).catch(() => navigator.clipboard?.writeText(url));
    } else {
      navigator.clipboard?.writeText(url);
    }
  };

  return (
    <div className="sticky top-0 z-30 bg-white border-b border-gray-100 flex items-center justify-between px-4 py-3">
      <button
        onClick={() => router.push(`/kemework/snap`)}
        className="flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={18} />
        <span className="text-sm font-medium">Retake</span>
      </button>

      <p className="text-[17px] font-black text-gray-900">✨ AI Diagnosis</p>

      <button
        onClick={handleShare}
        className="flex items-center gap-1 text-xs font-semibold text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-1.5 rounded-lg transition-colors"
      >
        <Share2 size={13} />
        Share
      </button>
    </div>
  );
}