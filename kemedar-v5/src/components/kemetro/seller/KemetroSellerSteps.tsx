// @ts-nocheck
import { ChevronRight } from "lucide-react";

const STEPS = [
  { number: 1, title: "Create Account", icon: "👤" },
  { number: 2, title: "Set Up Your Store", icon: "🏪" },
  { number: 3, title: "Add Products", icon: "📦" },
  { number: 4, title: "Start Selling & Earning", icon: "💰" },
];

export default function KemetroSellerSteps() {
  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-12">How It Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {STEPS.map((step, idx) => (
            <div key={step.number} className="relative">
              <div className="bg-white rounded-xl border-2 border-teal-200 p-6 text-center h-full hover:border-teal-500 transition-colors">
                <div className="text-5xl mb-4">{step.icon}</div>
                <div className="text-3xl font-black text-teal-600 mb-2">{step.number}</div>
                <p className="font-bold text-gray-900">{step.title}</p>
              </div>

              {idx < STEPS.length - 1 && (
                <div className="hidden md:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10">
                  <ChevronRight size={32} className="text-teal-400" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}