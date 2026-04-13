import { useState, useEffect } from "react";

const STEPS = [
  { icon: "🤖", label: "Analyzing your property details...", done: "Property details processed" },
  { icon: "📐", label: "Calculating quantities per room...", done: "Quantities calculated" },
  { icon: "🏷️", label: "Finding best materials in Kemetro...", done: "Materials matched to catalog" },
  { icon: "👷", label: "Planning professional work sequence...", done: "Phase sequence created" },
  { icon: "📅", label: "Building project timeline...", done: "Timeline planned" },
  { icon: "💰", label: "Calculating costs & budget breakdown...", done: "Budget breakdown ready" },
];

export default function BOQGeneratingScreen() {
  const [activeStep, setActiveStep] = useState(0);
  const [doneSteps, setDoneSteps] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep(prev => {
        if (prev < STEPS.length - 1) {
          setDoneSteps(d => [...d, prev]);
          return prev + 1;
        }
        clearInterval(interval);
        return prev;
      });
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-gray-900 via-orange-950 to-gray-900 flex items-center justify-center p-6">
      {/* Animated particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400 rounded-full opacity-30 animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 3}s`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-md w-full text-center">
        {/* Spinning icon */}
        <div className="w-20 h-20 bg-orange-500/20 border-2 border-orange-500/40 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin" style={{ animationDuration: "3s" }}>
          <span className="text-4xl">⚙️</span>
        </div>

        <h2 className="text-2xl font-black text-white mb-2">✨ Kemedar Finish AI is Working...</h2>
        <p className="text-orange-200 text-sm mb-8">Generating your complete project plan</p>

        {/* Steps */}
        <div className="text-left space-y-3">
          {STEPS.map((step, i) => {
            const done = doneSteps.includes(i);
            const active = activeStep === i;
            return (
              <div key={i} className={`flex items-center gap-3 transition-all duration-500 ${done || active ? "opacity-100" : "opacity-30"}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${done ? "bg-green-500" : active ? "bg-orange-500 animate-pulse" : "bg-white/10"}`}>
                  {done ? <span className="text-white text-sm">✓</span> : <span className="text-base">{step.icon}</span>}
                </div>
                <div className="flex-1 text-left">
                  {done ? (
                    <p className="text-green-400 text-sm font-bold">✅ {step.done}</p>
                  ) : active ? (
                    <p className="text-orange-300 text-sm animate-pulse">{step.label}</p>
                  ) : (
                    <p className="text-gray-500 text-sm">{step.label}</p>
                  )}
                </div>
              </div>
            );
          })}

          {doneSteps.length === STEPS.length - 1 && (
            <div className="mt-6 p-4 bg-green-500/20 border border-green-500/40 rounded-2xl text-center">
              <p className="text-green-400 font-black text-lg">✅ Your project plan is ready!</p>
              <p className="text-green-300 text-sm mt-1">Redirecting to BOQ review...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}