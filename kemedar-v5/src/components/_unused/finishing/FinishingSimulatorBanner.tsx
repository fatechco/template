"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { Sparkles } from "lucide-react";
import FinishingSimulatorWizard from "./FinishingSimulatorWizard";
import { apiClient } from "@/lib/api-client";

const UNFINISHED_STATES = ["Unfinished", "Half Finishing", "Not Built Yet", "Old Building", "Core & Shell", "Semi-Finished"];

export default function FinishingSimulatorBanner({ property, variant = "desktop" }) {
  const [open, setOpen] = useState(false);
  const [featureEnabled, setFeatureEnabled] = useState(true);

  useEffect(() => {
    apiClient.list("/api/v1/featureregistry", { featureKey: "buy_it_finished_simulator" })
      .then(results => {
        if (results.length > 0) {
          setFeatureEnabled(results[0].isActive !== false);
        }
      })
      .catch(() => setFeatureEnabled(true));
  }, []);

  const finishing = property?.finishing || property?.finishing_status || "";
  const isEligible = UNFINISHED_STATES.some(s => finishing.toLowerCase().includes(s.toLowerCase())) || !finishing;

  if (!isEligible || !featureEnabled) return null;

  return (
    <>
      <div
        className="rounded-2xl p-5 border-2 border-purple-500"
        style={{ background: "linear-gradient(135deg, #F5F3FF 0%, #ffffff 100%)" }}
      >
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm leading-snug">
              Hard to imagine it finished?
            </p>
            <p className="text-gray-500 text-xs mt-1 leading-relaxed">
              Instantly calculate the exact cost to finish this property to your dream style using live market data.
            </p>
          </div>
        </div>
        <button
          onClick={() => setOpen(true)}
          className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-purple-200 hover:shadow-purple-300"
        >
          <Sparkles size={14} />
          Calculate Finishing Cost
        </button>
      </div>

      {open && (
        <FinishingSimulatorWizard
          property={property}
          onClose={() => setOpen(false)}
          variant={variant}
        />
      )}
    </>
  );
}