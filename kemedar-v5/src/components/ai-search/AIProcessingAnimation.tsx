"use client";
// @ts-nocheck
import { useState, useEffect } from 'react';

const STEPS = [
  { icon: '🧠', label: 'Understanding your requirements...', detail: null },
  { icon: '🔍', label: 'Extracting key criteria...', detail: null },
  { icon: '📊', label: 'Searching our database...', detail: null },
  { icon: '🤖', label: 'AI is ranking best matches...', detail: null },
];

export default function AIProcessingAnimation({ criteria }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const timers = STEPS.map((_, i) => setTimeout(() => setStep(i + 1), (i + 1) * 1200));
    return () => timers.forEach(clearTimeout);
  }, []);

  const criteriaDetails = criteria ? [
    criteria.locations?.length > 0 && `📍 Location: ${criteria.locations.map(l => l.name).join(', ')}`,
    criteria.budgetMax && `💰 Budget: Up to ${Number(criteria.budgetMax).toLocaleString()} ${criteria.currency || 'EGP'}`,
    criteria.bedroomsMin !== null && criteria.bedroomsMin !== undefined && `🛏 Bedrooms: ${criteria.bedroomsMin}+`,
    criteria.propertyType && `🏠 Type: ${criteria.propertyType}`,
    criteria.purpose && `🎯 Purpose: ${criteria.purpose}`,
    ...(criteria.mustHaveAmenities || []).map(a => `✅ Must-have: ${a}`),
  ].filter(Boolean) : [];

  return (
    <div className="bg-purple-50 border-2 border-purple-200 rounded-2xl p-6 space-y-4">
      {STEPS.map((s, i) => {
        const done = step > i + 1;
        const active = step === i + 1;
        const pending = step < i + 1;
        return (
          <div key={i} className={`flex items-start gap-3 transition-all duration-500 ${pending ? 'opacity-30' : 'opacity-100'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-black transition-all ${
              done ? 'bg-green-100 text-green-600' :
              active ? 'bg-purple-200 text-purple-800 animate-pulse' :
              'bg-gray-100 text-gray-400'
            }`}>
              {done ? '✓' : s.icon}
            </div>
            <div className="flex-1 pt-1">
              <p className={`text-sm font-bold transition-colors ${
                done ? 'text-green-700 line-through' :
                active ? 'text-purple-900' :
                'text-gray-400'
              }`}>
                {s.label}
              </p>
              {/* Show extracted criteria after step 2 */}
              {i === 1 && done && criteriaDetails.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {criteriaDetails.slice(0, 6).map((d, j) => (
                    <span key={j} className="bg-white border border-purple-200 text-purple-700 text-xs font-medium px-2 py-0.5 rounded-full">
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}