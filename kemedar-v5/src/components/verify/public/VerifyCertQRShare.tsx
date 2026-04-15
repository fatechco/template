"use client";
// @ts-nocheck
import { useState } from "react";

export default function VerifyCertQRShare({ token }) {
  const [copied, setCopied] = useState(false);
  const verifyUrl = `https://kemedar.com/verify/${token.tokenId}`;
  const qrSrc = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(verifyUrl)}&color=1a1a2e&bgcolor=ffffff&qzone=2`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white py-12 px-4">
      <div className="max-w-sm mx-auto flex flex-col items-center gap-4">
        <h3 className="font-black text-gray-900 text-lg">Verify Independently</h3>

        {/* QR Code */}
        <div className="relative">
          <img src={qrSrc} alt="QR Code" className="w-48 h-48 rounded-xl shadow-md" />
          {/* Kemedar logo watermark in center */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow">
              <span className="text-xs font-black text-[#1a1a2e]">K</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-gray-500 text-center">Scan to verify from any device, anywhere</p>

        {/* Token ID */}
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-4 py-2">
          <span className="font-mono text-sm text-gray-700 font-bold">{token.tokenId}</span>
          <button onClick={handleCopy} className="text-xs text-[#FF6B00] font-bold hover:underline">
            {copied ? "✓ Copied" : "Copy"}
          </button>
        </div>

        {/* Share buttons */}
        <div className="grid grid-cols-2 gap-2 w-full">
          <button onClick={handleCopy} className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-700 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors">
            📋 Copy Link
          </button>
          <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-700 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors">
            📥 Download PDF
          </button>
          <a
            href={`https://wa.me/?text=${encodeURIComponent(`🏅 This property is Kemedar Verified!\n${verifyUrl}`)}`}
            target="_blank" rel="noreferrer"
            className="flex items-center justify-center gap-2 border border-green-200 rounded-xl py-2.5 text-sm font-bold text-green-700 hover:bg-green-50 transition-colors"
          >
            💬 WhatsApp
          </a>
          <button className="flex items-center justify-center gap-2 border border-gray-200 rounded-xl py-2.5 text-sm font-bold text-gray-700 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors">
            📱 Add to Wallet
          </button>
        </div>
      </div>
    </div>
  );
}