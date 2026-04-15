"use client";
// @ts-nocheck
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function BottomSheet({ isOpen, onClose, title, children, height = 'auto' }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState(0);

  if (!isOpen) return null;

  const handleTouchStart = (e) => {
    setIsDragging(true);
    setDragStart(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    const dragEnd = e.changedTouches[0].clientY;
    if (dragEnd - dragStart > 100) {
      onClose();
    }
    setIsDragging(false);
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 z-50 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl animate-in slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        style={{
          maxHeight: height === 'auto' ? '90vh' : height,
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-[#E5E7EB] rounded-full"></div>
        </div>

        {/* Title */}
        {title && (
          <div className="px-6 py-3 border-b border-[#E5E7EB]">
            <h2 className="text-lg font-black text-[#1F2937]">{title}</h2>
          </div>
        )}

        {/* Content */}
        <div className="overflow-y-auto px-4 py-6">
          {children}
        </div>
      </div>
    </div>
  );
}