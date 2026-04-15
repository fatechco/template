"use client";
// @ts-nocheck
import { useState } from "react";
import { CheckCircle2, Copy, Check } from "lucide-react";

export default function VerifyLevel1({ token }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (token?.tokenId) {
      navigator.clipboard?.writeText(token.tokenId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border-l-4 border-green-500 border border-gray-100 p-6">
      <div className="flex items-start gap-3 mb-4">
        <CheckCircle2 className="text-green-500 flex-shrink-0 mt-0.5" size={22} />
        <div>
          <p className="font-black text-gray-900 text-base">Your property is live on Kemedar</p>
          <p className="text-sm text-gray-500 mt-0.5">Your Verify Pro chain has started</p>
        </div>
      </div>

      {token?.tokenId && (
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2.5 mb-4 w-fit">
          <span className="text-xs text-gray-400 font-semibold">Token ID:</span>
          <span className="font-mono text-sm font-bold text-gray-800">{token.tokenId}</span>
          <button onClick={handleCopy} className="text-gray-400 hover:text-[#FF6B00] transition-colors ml-1">
            {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
          </button>
        </div>
      )}

      <div className="bg-orange-50 border border-orange-100 rounded-xl px-4 py-3 text-xs text-orange-700">
        <span className="font-bold">ℹ️</span> Each verification action is recorded permanently in your property's chain
      </div>
    </div>
  );
}