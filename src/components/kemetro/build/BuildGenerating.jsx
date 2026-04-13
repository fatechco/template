import { useEffect, useState } from "react";

const STEPS = [
  "Analyzing floor plan & room dimensions...",
  "Calculating material quantities per room...",
  "Matching items to Kemetro catalog...",
  "Generating Economy, Standard & Premium scenarios...",
  "Adding saving tips and labor estimates...",
  "Finalizing your BOQ...",
];

export default function BuildGenerating() {
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStepIndex(i => (i + 1) % STEPS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-teal-50 flex flex-col items-center justify-center gap-6 px-4">
      <div className="w-20 h-20 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
      <div className="text-center">
        <h2 className="text-2xl font-black text-teal-800 mb-2">🤖 Generating Your BOQ...</h2>
        <p className="text-teal-600 text-sm">{STEPS[stepIndex]}</p>
      </div>
      <div className="bg-white rounded-2xl p-5 shadow-sm text-sm text-gray-500 max-w-sm text-center">
        AI is calculating material quantities, matching to Kemetro catalog, and comparing 3 budget scenarios. This takes about 20–30 seconds.
      </div>
    </div>
  );
}