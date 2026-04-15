"use client";
// @ts-nocheck
import { useState } from 'react';
import { Share2 } from 'lucide-react';
import BottomSheet from '@/components/responsive/BottomSheet';

export default function ShareButton({ 
  title, 
  text, 
  url,
  className = ''
}) {
  const [showCustomShare, setShowCustomShare] = useState(false);
  const supportsWebShare = navigator.share !== undefined;

  const handleWebShare = async () => {
    try {
      await navigator.share({
        title: `${title} — Kemedar`,
        text,
        url,
      });
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Share failed:', error);
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      // Show toast
      const event = new CustomEvent('toast', {
        detail: { message: '✅ Link copied to clipboard', type: 'success' },
      });
      window.dispatchEvent(event);
      setShowCustomShare(false);
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  if (supportsWebShare) {
    return (
      <button
        onClick={handleWebShare}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${className}`}
      >
        <Share2 size={18} strokeWidth={2.5} />
        Share
      </button>
    );
  }

  // Fallback custom share
  return (
    <>
      <button
        onClick={() => setShowCustomShare(true)}
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition-colors ${className}`}
      >
        <Share2 size={18} strokeWidth={2.5} />
        Share
      </button>

      <BottomSheet
        isOpen={showCustomShare}
        onClose={() => setShowCustomShare(false)}
        title="Share"
      >
        <div className="space-y-3">
          <button
            onClick={() => {
              window.open(
                `https://wa.me/?text=${encodeURIComponent(`${text}\n${url}`)}`,
                '_blank'
              );
              setShowCustomShare(false);
            }}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors"
          >
            <span className="text-2xl">💬</span>
            <span className="font-bold text-[#1F2937]">WhatsApp</span>
          </button>

          <button
            onClick={() => {
              window.open(
                `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
                '_blank'
              );
              setShowCustomShare(false);
            }}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors"
          >
            <span className="text-2xl">f</span>
            <span className="font-bold text-[#1F2937]">Facebook</span>
          </button>

          <button
            onClick={() => {
              window.open(
                `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`,
                '_blank'
              );
              setShowCustomShare(false);
            }}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors"
          >
            <span className="text-2xl">𝕏</span>
            <span className="font-bold text-[#1F2937]">Twitter</span>
          </button>

          <button
            onClick={() => {
              window.open(
                `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
                '_blank'
              );
              setShowCustomShare(false);
            }}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors"
          >
            <span className="text-2xl">in</span>
            <span className="font-bold text-[#1F2937]">LinkedIn</span>
          </button>

          <button
            onClick={() => {
              window.open(
                `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${url}`)}`
              );
              setShowCustomShare(false);
            }}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors"
          >
            <span className="text-2xl">✉️</span>
            <span className="font-bold text-[#1F2937]">Email</span>
          </button>

          <button
            onClick={handleCopyLink}
            className="w-full flex items-center gap-3 p-4 rounded-xl bg-[#F3F4F6] active:bg-[#E5E7EB] transition-colors"
          >
            <span className="text-2xl">🔗</span>
            <span className="font-bold text-[#1F2937]">Copy Link</span>
          </button>
        </div>
      </BottomSheet>
    </>
  );
}