"use client";
// @ts-nocheck
import { useEffect, useState } from 'react';

export default function AppSplashScreen({ onComplete }) {
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(onComplete, 300);
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 bg-white flex flex-col items-center justify-center z-50 transition-opacity duration-300 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Logo */}
      <div className="w-32 h-32 bg-[#FF6B00] rounded-3xl flex items-center justify-center mb-6 animate-pulse">
        <span className="text-6xl font-black text-white">K</span>
      </div>

      {/* Brand Name */}
      <h1 className="text-3xl font-black text-[#1F2937] mb-2">
        Kemedar®
      </h1>

      {/* Tagline */}
      <p className="text-sm text-[#6B7280] mb-12">
        Proptech Super App
      </p>

      {/* Loading animation */}
      <div className="flex gap-1.5">
        <div className="w-2 h-2 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
        <div className="w-2 h-2 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-2 h-2 bg-[#FF6B00] rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
      </div>
    </div>
  );
}