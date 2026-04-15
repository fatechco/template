// @ts-nocheck
import Link from "next/link";

export default function VerifyWizardHeader({ property, token }) {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/">
          <img
            src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b5eafc884b1597fb3ea66e/0687980a4_kemedar-Logo-ar-6000.png"
            alt="Kemedar"
            className="h-8 w-auto object-contain"
          />
        </Link>
        <p className="font-black text-gray-900 text-base">🔐 Verify This Property</p>
        <div className="text-right flex flex-col items-end gap-1">
          {property && (
            <p className="text-xs font-semibold text-gray-700 truncate max-w-[160px]">{property.title}</p>
          )}
          {token?.tokenId && (
            <p className="text-[10px] font-mono text-gray-400">{token.tokenId}</p>
          )}
          <Link href={`/cp`} className="text-xs text-gray-400 hover:text-[#FF6B00] transition-colors">
            Save & Exit
          </Link>
        </div>
      </div>
    </div>
  );
}