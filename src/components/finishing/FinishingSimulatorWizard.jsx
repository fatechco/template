import { useState, useEffect } from "react";
import { X, ChevronRight, Sparkles } from "lucide-react";
import { base44 } from "@/api/base44Client";
import FinishingSimulatorResults from "./FinishingSimulatorResults";

const LOADING_MESSAGES = [
  "📐 Measuring floorplan...",
  "🛒 Fetching live material prices from Kemetro...",
  "👷 Fetching labor rates from Kemework...",
  "✨ Finalizing your Bill of Quantities...",
];

const STATES = [
  { value: "Core & Shell", icon: "🧱", label: "Core & Shell (Red Bricks)", desc: "Needs complete electrical, plumbing, plaster, and finishes." },
  { value: "Semi-Finished", icon: "🏗️", label: "Semi-Finished", desc: "Basic plumbing/electrical done. Needs flooring, painting, doors." },
  { value: "Needs Renovation", icon: "🏚️", label: "Needs Renovation", desc: "Requires demolition of old finishes and complete modernization." },
];

const TIERS = [
  { value: "Economy", icon: "🥉", label: "Economy", desc: "Standard local materials, commercial paints. Great for rentals." },
  { value: "Standard", icon: "🥈", label: "Standard", desc: "High-quality durable materials, top local brands." },
  { value: "Premium", icon: "🥇", label: "Premium", desc: "Imported porcelain, branded fixtures, custom woodwork.", popular: true },
  { value: "Luxury", icon: "💎", label: "Luxury", desc: "Imported marble, elite international brands, bespoke design." },
];

const STYLES = [
  { value: "Modern", icon: "🛋️" },
  { value: "Classic", icon: "🏛️" },
  { value: "Minimalist", icon: "🌿" },
  { value: "Industrial", icon: "🏭" },
  { value: "Bohemian", icon: "🎨" },
];

function ProgressBar({ step, total }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all ${i < step ? "bg-purple-600" : "bg-gray-200"}`}
        />
      ))}
    </div>
  );
}

function Toggle({ checked, onChange, label, icon }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <span className="text-sm text-gray-700 flex items-center gap-2">{icon} {label}</span>
      <button
        onClick={() => onChange(!checked)}
        className={`w-11 h-6 rounded-full transition-colors relative ${checked ? "bg-purple-600" : "bg-gray-200"}`}
      >
        <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? "translate-x-5" : "translate-x-0.5"}`} />
      </button>
    </div>
  );
}

export default function FinishingSimulatorWizard({ property, onClose, variant = "desktop" }) {
  const [step, setStep] = useState(1);
  const [currentState, setCurrentState] = useState("Core & Shell");
  const [desiredTier, setDesiredTier] = useState("Premium");
  const [desiredStyle, setDesiredStyle] = useState("Modern");
  const [smartHome, setSmartHome] = useState(false);
  const [centralAc, setCentralAc] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!loading) return;
    let i = 0;
    const t = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[i]);
    }, 1500);
    return () => clearInterval(t);
  }, [loading]);

  const generate = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke("generateFinishingEstimate", {
        propertyId: property?.id,
        userInputs: {
          currentState,
          desiredStyle,
          desiredTier,
          smartHomeEnabled: smartHome,
          centralAcEnabled: centralAc,
        },
      });
      setResult(res.data);
      // Track generation
      base44.analytics.track({
        eventName: "finishing_estimate_generated",
        properties: {
          propertyId: property?.id,
          tier: desiredTier,
          style: desiredStyle,
          currentState
        }
      }).catch(() => {});
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  const isModal = variant !== "mobile";

  const content = (
    <div className={`flex flex-col ${isModal ? "h-full" : ""}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-gray-100 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
            <Sparkles size={16} className="text-purple-600" />
          </div>
          <div>
            <p className="font-black text-gray-900 text-sm">AI Finishing Simulator</p>
            <p className="text-[11px] text-gray-400">{property?.title || "Property"}</p>
          </div>
        </div>
        <button onClick={onClose} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
          <X size={16} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5">
        {result ? (
          <FinishingSimulatorResults result={result} property={property} onClose={onClose} />
        ) : loading ? (
          <div className="flex flex-col items-center justify-center py-16 gap-4">
            <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin" />
            <p className="text-sm font-semibold text-purple-700 animate-pulse">{loadingMsg}</p>
            <p className="text-xs text-gray-400">This takes about 10–15 seconds</p>
          </div>
        ) : (
          <>
            <ProgressBar step={step} total={3} />

            {step === 1 && (
              <div>
                <p className="font-black text-gray-900 text-base mb-1">What is the current state of this property?</p>
                <p className="text-xs text-gray-400 mb-4">Be honest — it helps the AI give accurate estimates.</p>
                <div className="space-y-3">
                  {STATES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setCurrentState(s.value)}
                      className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${currentState === s.value ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-200"}`}
                    >
                      <span className="text-2xl flex-shrink-0">{s.icon}</span>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{s.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{s.desc}</p>
                      </div>
                      {currentState === s.value && <span className="ml-auto text-purple-600 font-black text-lg flex-shrink-0">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 2 && (
              <div>
                <p className="font-black text-gray-900 text-base mb-1">Select your finishing quality</p>
                <p className="text-xs text-gray-400 mb-4">This determines the budget tier and material brands.</p>
                <div className="space-y-3">
                  {TIERS.map(t => (
                    <button
                      key={t.value}
                      onClick={() => setDesiredTier(t.value)}
                      className={`w-full flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all relative ${desiredTier === t.value ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-200"}`}
                    >
                      {t.popular && <span className="absolute -top-2.5 right-3 bg-purple-600 text-white text-[9px] font-black px-2 py-0.5 rounded-full">MOST POPULAR</span>}
                      <span className="text-2xl flex-shrink-0">{t.icon}</span>
                      <div>
                        <p className="font-bold text-gray-900 text-sm">{t.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{t.desc}</p>
                      </div>
                      {desiredTier === t.value && <span className="ml-auto text-purple-600 font-black text-lg flex-shrink-0">✓</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <p className="font-black text-gray-900 text-base mb-1">Design your dream space</p>
                <p className="text-xs text-gray-400 mb-4">Choose a style for AI-personalized advice.</p>
                <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar">
                  {STYLES.map(s => (
                    <button
                      key={s.value}
                      onClick={() => setDesiredStyle(s.value)}
                      className={`flex-shrink-0 flex flex-col items-center gap-2 p-3 rounded-xl border-2 w-24 transition-all ${desiredStyle === s.value ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-200"}`}
                    >
                      <span className="text-3xl">{s.icon}</span>
                      <span className="text-xs font-bold text-gray-700">{s.value}</span>
                      {desiredStyle === s.value && <span className="text-purple-600 text-xs font-black">✓</span>}
                    </button>
                  ))}
                </div>
                <div className="mt-5 bg-gray-50 rounded-xl p-4">
                  <Toggle checked={smartHome} onChange={setSmartHome} icon="🤖" label="Include Smart Home Automation System" />
                  <Toggle checked={centralAc} onChange={setCentralAc} icon="❄️" label="Include Concealed Central AC Preparation" />
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Footer */}
      {!result && !loading && (
        <div className="p-5 border-t border-gray-100 flex-shrink-0">
          <div className="flex gap-3">
            {step > 1 && (
              <button onClick={() => setStep(s => s - 1)} className="flex-1 border-2 border-gray-200 text-gray-700 font-bold py-3 rounded-xl text-sm hover:bg-gray-50">
                Back
              </button>
            )}
            {step < 3 ? (
              <button onClick={() => setStep(s => s + 1)} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors">
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button onClick={generate} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-black py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-purple-200">
                <Sparkles size={16} /> Generate AI Estimate
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (variant === "mobile") {
    return (
      <div className="fixed inset-0 z-[200] flex flex-col justify-end">
        <div className="absolute inset-0 bg-black/50" onClick={onClose} />
        <div className="relative bg-white rounded-t-3xl overflow-hidden flex flex-col" style={{ height: "95vh" }}>
          <div className="w-10 h-1 bg-gray-300 rounded-full mx-auto mt-3 mb-0 flex-shrink-0" />
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-[700px] max-h-[90vh] flex flex-col overflow-hidden">
        {content}
      </div>
    </div>
  );
}