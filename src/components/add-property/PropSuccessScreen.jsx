import { useState } from "react";

const REF = `KEM-${Math.floor(10000 + Math.random() * 90000)}`;

export default function PropSuccessScreen({ onViewListing, onAddAnother }) {
  const [copied, setCopied] = useState(false);
  const copy = () => { navigator.clipboard.writeText(REF); setCopied(true); setTimeout(() => setCopied(false), 2000); };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6 text-center">
      <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
        <span className="text-5xl">✅</span>
      </div>
      <h1 className="text-3xl font-black text-gray-900 mb-2">Listing Submitted!</h1>
      <button onClick={copy} className="flex items-center gap-2 bg-gray-100 rounded-xl px-4 py-2.5 mb-4">
        <span className="font-black text-gray-700 text-sm">{REF}</span>
        <span className="text-xs text-orange-600 font-bold">{copied ? "Copied!" : "📋 Copy"}</span>
      </button>
      <p className="text-gray-500 text-base leading-relaxed mb-10 max-w-xs">
        Your listing is being reviewed and will be live within 24 hours.
      </p>
      <button onClick={onViewListing} className="w-full bg-orange-600 text-white font-black py-4 rounded-2xl text-base mb-3">
        View My Listing
      </button>
      <button onClick={onAddAnother} className="w-full border-2 border-orange-600 text-orange-600 font-black py-4 rounded-2xl text-base">
        Add Another Property
      </button>
    </div>
  );
}