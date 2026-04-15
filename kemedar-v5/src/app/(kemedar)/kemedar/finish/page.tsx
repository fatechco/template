"use client";

import { useState } from "react";
import { Paintbrush, ChevronRight, ChevronLeft, Check } from "lucide-react";

const STEPS = ["Room Selection", "Flooring", "Wall Finishes", "Kitchen", "Bathroom", "Review & Quote"];

export default function FinishPage() {
  const [step, setStep] = useState(0);

  return (
    <div className="container mx-auto max-w-3xl py-8 px-4">
      <div className="text-center mb-8">
        <Paintbrush className="w-12 h-12 text-orange-600 mx-auto mb-3" />
        <h1 className="text-3xl font-bold">Finishing Simulator</h1>
        <p className="text-slate-500 mt-2">Design your interior finishing and get an instant cost estimate</p>
      </div>

      <div className="flex gap-2 mb-6">
        {STEPS.map((s, i) => (
          <div key={s} className="flex-1 text-center">
            <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center text-sm font-bold ${i < step ? "bg-green-600 text-white" : i === step ? "bg-orange-600 text-white" : "bg-slate-200 text-slate-400"}`}>
              {i < step ? <Check className="w-4 h-4" /> : i + 1}
            </div>
            <div className="text-xs mt-1 text-slate-500 hidden md:block">{s}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border p-8 text-center">
        <h2 className="text-xl font-bold mb-2">{STEPS[step]}</h2>
        <p className="text-slate-500 mb-6">Choose your preferred options for this finishing category</p>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {["Option A", "Option B", "Option C", "Option D"].map((opt) => (
            <button key={opt} className="border rounded-lg p-4 hover:border-orange-400 hover:bg-orange-50 transition text-sm font-medium">
              {opt}
            </button>
          ))}
        </div>

        <div className="flex justify-between">
          <button onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0} className="px-4 py-2 border rounded-lg disabled:opacity-50 flex items-center gap-1">
            <ChevronLeft className="w-4 h-4" />Back
          </button>
          <button onClick={() => setStep(Math.min(5, step + 1))} className="px-4 py-2 bg-orange-600 text-white rounded-lg flex items-center gap-1">
            {step === 5 ? "Get Quote" : "Next"}<ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
