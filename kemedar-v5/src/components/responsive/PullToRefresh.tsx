"use client";
// @ts-nocheck
import { useState, useRef } from 'react';
import { RefreshCw } from 'lucide-react';

export default function PullToRefresh({ onRefresh, children }) {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStart = useRef(0);
  const scrollContainer = useRef(null);

  const handleTouchStart = (e) => {
    const scrollTop = scrollContainer.current?.scrollTop || 0;
    if (scrollTop === 0) {
      touchStart.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e) => {
    const scrollTop = scrollContainer.current?.scrollTop || 0;
    if (scrollTop === 0) {
      const distance = e.touches[0].clientY - touchStart.current;
      if (distance > 0) {
        setPullDistance(Math.min(distance, 100));
      }
    }
  };

  const handleTouchEnd = async () => {
    if (pullDistance > 50 && !isRefreshing) {
      setIsRefreshing(true);
      await onRefresh();
      setIsRefreshing(false);
      setPullDistance(0);
    } else {
      setPullDistance(0);
    }
  };

  return (
    <div
      ref={scrollContainer}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="overflow-y-auto overflow-x-hidden"
    >
      {/* Pull indicator */}
      {pullDistance > 0 && !isRefreshing && (
        <div className="flex justify-center py-4">
          <div
            className="text-[#FF6B00] transition-opacity"
            style={{ opacity: pullDistance / 100 }}
          >
            <RefreshCw size={20} />
          </div>
        </div>
      )}

      {/* Refreshing state */}
      {isRefreshing && (
        <div className="flex justify-center py-4">
          <div className="text-[#FF6B00] animate-spin">
            <RefreshCw size={20} />
          </div>
        </div>
      )}

      {children}
    </div>
  );
}