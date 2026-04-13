import { useState } from "react";
import { Leaf, X } from "lucide-react";

export default function KemedarPostRenovationNudge({ context = "concierge", onDismiss }) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    onDismiss?.();
  };

  if (dismissed) return null;

  const variants = {
    concierge: {
      title: "Finished settling in? Turn clutter into cash.",
      body: "Don't let leftover tiles, paint or materials take up space. Snap a photo and sell them on the Kemetro Surplus Market. Funds go straight to XeedWallet.",
      icon: "🏡"
    },
    finish: {
      title: "Got leftover materials from the renovation?",
      body: "List them on Kemetro Surplus and recover some of your renovation costs.",
      icon: "🔨"
    },
    order: {
      title: "Any leftover materials from your order?",
      body: "Resell unused items on Kemetro Surplus.",
      icon: "📦"
    }
  };

  const variant = variants[context] || variants.concierge;

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-200 p-6 mb-6">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{variant.icon}</span>
          <p className="font-black text-gray-900 text-base">{variant.title}</p>
        </div>
        <button onClick={handleDismiss} className="p-1 hover:bg-white/50 rounded-lg flex-shrink-0">
          <X size={18} className="text-gray-400" />
        </button>
      </div>

      <p className="text-sm text-gray-600 mb-4">{variant.body}</p>

      <a
        href="/kemetro/surplus/add"
        className="inline-flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition-colors"
      >
        <Leaf size={16} /> 📸 Sell My Leftovers
      </a>
    </div>
  );
}