"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { X, Sparkles } from "lucide-react";
import { base44 } from "@/lib/api-client";
import NegotiateBriefing from "./NegotiateBriefing";
import NegotiateOfferPanel from "./NegotiateOfferPanel";

const LOADING_STEPS = [
  "Checking property history...",
  "Comparing similar properties...",
  "Reading seller signals...",
  "Generating your strategy...",
];

export default function NegotiateModal({ property, onClose }) {
  const [step, setStep] = useState("loading");
  const [loadingStep, setLoadingStep] = useState(0);
  const [session, setSession] = useState(null);
  const [strategy, setStrategy] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    let i = 0;
    const t = setInterval(() => {
      i++;
      setLoadingStep(Math.min(i, LOADING_STEPS.length - 1));
    }, 700);

    const run = async () => {
      // Collect buyer context: advisor profile + any existing sessions
      let buyerProfile = { paymentMethod: "cash", urgency: "moderate" };

      const user = await base44.auth.me().catch(() => null);
      if (user?.id) {
        const [advisorProfiles, analytics] = await Promise.all([
          base44.entities.AdvisorProfile?.filter({ userId: user.id }).catch(() => []),
          base44.entities.NegotiationAnalytics?.filter({
            propertyType: property?.category_name || "all"
          }).catch(() => []),
        ]);
        const ap = advisorProfiles?.[0];
        if (ap) {
          buyerProfile = {
            paymentMethod: ap.paymentMethod || "cash",
            urgency: ap.urgency || "moderate",
            budgetMax: ap.budget_max || null,
            purpose: ap.purpose || "own_use",
          };
        }
      }

      const res = await base44.functions.invoke("generateBuyerStrategy", {
        propertyId: property?.id || "mock",
        buyerProfile,
      });

      clearInterval(t);
      setLoadingStep(LOADING_STEPS.length - 1);

      if (res.data?.strategy) {
        setSession(res.data.session);
        setStrategy(res.data.strategy);
        setTimeout(() => setStep("briefing"), 300);
      } else {
        setError("Could not generate strategy. Please try again.");
      }
    };

    run().catch(err => {
      clearInterval(t);
      setError("Could not load strategy. Please try again.");
    });

    return () => clearInterval(t);
  }, []);

  const handleOfferSent = (sessionId) => setStep("success");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/60 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] overflow-hidden flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xl">🤝</span>
              <span className="font-black text-gray-900 text-base sm:text-lg">Kemedar Negotiate™</span>
              <span className="bg-purple-100 text-purple-600 text-[10px] font-black px-2 py-0.5 rounded-full">AI Coaching</span>
            </div>
            <p className="text-xs text-gray-400 mt-0.5 truncate max-w-xs sm:max-w-md">{property?.title}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 hover:bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-hidden">

          {/* Loading */}
          {step === "loading" && (
            <div className="flex flex-col items-center justify-center h-full py-16 px-8">
              <div className="w-20 h-20 bg-gradient-to-br from-purple-100 to-purple-200 rounded-full flex items-center justify-center mb-6">
                <Sparkles size={36} className="text-purple-500 animate-pulse" />
              </div>
              <p className="font-black text-gray-900 text-xl mb-6">Analyzing market data...</p>
              <div className="space-y-3 w-full max-w-sm">
                {LOADING_STEPS.map((s, i) => (
                  <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-300 ${i <= loadingStep ? "opacity-100 text-gray-800" : "opacity-30 text-gray-400"}`}>
                    <span className="w-5 h-5 flex-shrink-0 flex items-center justify-center text-base">
                      {i < loadingStep ? "✅" : i === loadingStep
                        ? <span className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin inline-block" />
                        : "○"}
                    </span>
                    {s}
                  </div>
                ))}
              </div>
              {error && (
                <div className="mt-6 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
                  {error}
                </div>
              )}
            </div>
          )}

          {/* Briefing + Offer panel */}
          {step === "briefing" && strategy && (
            <div className="flex flex-col lg:grid lg:grid-cols-[1fr_380px] h-full overflow-hidden">
              <div className="flex-1 overflow-y-auto p-5 lg:border-r border-gray-100">
                <NegotiateBriefing strategy={strategy} property={property} session={session} />
              </div>
              <div className="overflow-y-auto p-5 bg-gray-50 lg:max-h-full">
                <NegotiateOfferPanel
                  strategy={strategy}
                  session={session}
                  property={property}
                  onOfferSent={handleOfferSent}
                />
              </div>
            </div>
          )}

          {/* Success */}
          {step === "success" && (
            <div className="flex flex-col items-center justify-center h-full py-16 px-8 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <h2 className="font-black text-gray-900 text-2xl mb-2">Offer Sent!</h2>
              <p className="text-gray-500 text-sm mb-6 max-w-sm">
                Your offer has been submitted. You'll be notified when the seller responds.
              </p>
              <div className="flex gap-3 flex-wrap justify-center">
                <button
                  onClick={() => { window.location.href = "/dashboard/negotiations"; }}
                  className="bg-orange-500 text-white font-bold px-6 py-3 rounded-xl text-sm"
                >
                  View Deal Room →
                </button>
                <button onClick={onClose} className="border border-gray-200 text-gray-600 font-bold px-6 py-3 rounded-xl text-sm">
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}