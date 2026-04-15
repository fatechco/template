"use client";

import { useState } from "react";
import { Brain, ChevronRight, ChevronLeft } from "lucide-react";

const STEPS = ["Intent", "Type", "Usage", "Household", "Budget", "Location", "Lifestyle", "Wishes"];

export default function AdvisorPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="text-center mb-8">
        <Brain className="w-12 h-12 text-purple-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">KemeAdvisor</h1>
        <p className="text-slate-500 mt-2">Your personal AI real estate advisor — 8 steps to your perfect match</p>
      </div>

      <div className="flex gap-1 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className={`flex-1 h-1.5 rounded-full ${i <= step ? "bg-purple-600" : "bg-slate-200"}`} />
        ))}
      </div>

      <div className="bg-white rounded-xl border p-8 text-center">
        <h2 className="text-xl font-bold mb-2">Step {step + 1}: {STEPS[step]}</h2>
        <p className="text-slate-500 mb-6">Configure your preferences for AI-powered property recommendations</p>

        <div className="flex justify-between">
          <button
            onClick={() => setStep(Math.max(0, step - 1))}
            disabled={step === 0}
            className="px-4 py-2 border rounded-lg disabled:opacity-50 flex items-center gap-1"
          >
            <ChevronLeft className="w-4 h-4" />Back
          </button>
          <button
            onClick={() => setStep(Math.min(7, step + 1))}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg flex items-center gap-1"
          >
            {step === 7 ? "Generate Report" : "Next"}<ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
