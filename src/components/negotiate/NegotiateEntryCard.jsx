import { useState } from "react";
import { Handshake, Sparkles, ChevronRight } from "lucide-react";
import NegotiateModal from "./NegotiateModal";

export default function NegotiateEntryCard({ property, variant = "desktop" }) {
  const [open, setOpen] = useState(false);

  const discount = property?.district_name ? "7–12" : "5–15";
  const isSale = (property?.purpose || "").toLowerCase().includes("sale");
  if (!isSale) return null;

  return (
    <>
      <div className={`border-2 border-orange-400 rounded-2xl p-4 shadow-sm bg-white ${variant === "mobile" ? "mx-0" : ""}`}>
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Handshake size={24} className="text-orange-500" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-gray-900 text-base">Make an Offer</p>
            <p className="text-xs text-gray-500 leading-snug mt-0.5">
              Kemedar Negotiate™ will coach you through the best strategy
            </p>
          </div>
        </div>

        <button
          onClick={() => setOpen(true)}
          className="mt-3 w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors"
        >
          <Handshake size={16} /> Start Negotiation
        </button>

        <p className="text-center text-[11px] text-gray-400 mt-2 flex items-center justify-center gap-1">
          <Sparkles size={10} className="text-purple-400" />
          AI analyzed this property — estimated {discount}% negotiation room
        </p>
      </div>

      {open && (
        <NegotiateModal property={property} onClose={() => setOpen(false)} />
      )}
    </>
  );
}