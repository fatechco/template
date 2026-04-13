import { useState, useEffect } from "react";

const LEVEL_LABELS = {
  1: "Listed — Level 1",
  2: "Seller Verified — Level 2",
  3: "Document Verified — Level 3",
  4: "FO Inspected — Level 4",
  5: "Fully Verified — Level 5",
};

export default function VerifyCertHero({ token }) {
  const isFull = token.verificationLevel >= 5;
  const isFraud = token.verificationStatus === "fraud_flagged";

  return (
    <div className="bg-[#1a1a2e] py-14 px-4 flex flex-col items-center gap-8">
      <img
        src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b5eafc884b1597fb3ea66e/0687980a4_kemedar-Logo-ar-6000.png"
        alt="Kemedar"
        className="h-10 w-auto object-contain brightness-0 invert"
      />

      {isFraud ? (
        <div className="bg-red-900/40 border-2 border-red-500 rounded-2xl px-8 py-6 text-center max-w-md">
          <p className="text-3xl mb-2">⚠️</p>
          <p className="font-black text-red-400 text-xl">THIS VERIFICATION IS SUSPENDED</p>
          <p className="text-red-300 text-sm mt-2">Under investigation — contact Kemedar</p>
        </div>
      ) : (
        <div className="relative flex items-center justify-center" style={{ width: 220, height: 220 }}>
          {/* Rotating border */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(${isFull ? "#FFD700" : "#FF6B00"} 0%, transparent 60%)`,
              animation: "spin 4s linear infinite",
              borderRadius: "50%",
              padding: 3,
            }}
          >
            <div className="w-full h-full rounded-full bg-[#1a1a2e]" />
          </div>
          {/* Static dashed ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: `3px dashed ${isFull ? "#FFD700" : "#FF6B00"}`,
              opacity: 0.4,
            }}
          />
          {/* Content */}
          <div className="relative z-10 flex flex-col items-center text-center px-4">
            <span className="text-3xl mb-1">🔐</span>
            <p className="text-[9px] font-black text-white tracking-widest uppercase">Kemedar Verify Pro™</p>
            <div className="w-12 h-px bg-white/30 my-1.5" />
            {isFull ? (
              <>
                <p className="font-black text-white text-sm leading-tight">FULLY VERIFIED</p>
                <p className="text-[10px] mt-1" style={{ color: "#FFD700" }}>● Level 5 Certificate</p>
              </>
            ) : (
              <>
                <p className="font-bold text-white text-xs leading-tight">{LEVEL_LABELS[token.verificationLevel] || "Partially Verified"}</p>
                <p className="text-[10px] text-orange-300 mt-1">● Verification In Progress</p>
              </>
            )}
            <div className="w-12 h-px bg-white/30 my-1.5" />
            <p className="font-mono text-[9px] text-gray-300 leading-tight">{token.tokenId}</p>
            {token.certificateIssuedAt && (
              <p className="text-[8px] text-gray-400 mt-0.5">
                Issued: {new Date(token.certificateIssuedAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            )}
            {token.certificateExpiresAt && (
              <p className="text-[8px] text-gray-400">
                Valid until: {new Date(token.certificateExpiresAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
              </p>
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}