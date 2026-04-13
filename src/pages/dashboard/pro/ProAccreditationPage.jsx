import { useState } from "react";
import { Link } from "react-router-dom";
import { Check } from "lucide-react";

// Simulate accreditation status: "none" | "applied" | "interview" | "accredited"
const STATUS = "applied"; // Change to test different states

const TIMELINE = [
  { key: "applied", label: "Application Submitted", icon: "✅", date: "March 15, 2026" },
  { key: "review", label: "Under Review", icon: "⏳", date: "Estimated 5–7 business days" },
  { key: "interview", label: "Interview Scheduled", icon: "📅", date: null },
  { key: "accredited", label: "Accredited", icon: "🏅", date: null },
];

const TIMELINE_ORDER = ["applied", "review", "interview", "accredited"];

export default function ProAccreditationPage() {
  const [applied, setApplied] = useState(STATUS !== "none");

  if (STATUS === "accredited") {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#F8F5F0" }}>
        <div className="bg-white rounded-3xl shadow-xl p-8 max-w-lg w-full text-center">
          <div className="text-7xl mb-4">🏅</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Kemedar Accredited Professional</h2>
          <p className="text-gray-500 mb-6">Your accreditation is active and verified by Kemedar.</p>
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 mb-5">
            <p className="text-xs text-amber-600 font-bold uppercase tracking-widest mb-3">Accreditation Details</p>
            <div className="space-y-2 text-left">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Accreditation Date</span>
                <span className="font-bold text-gray-900">February 28, 2026</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">ID Card Number</span>
                <span className="font-bold text-gray-900">KPP-2026-04812</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Valid Until</span>
                <span className="font-bold text-green-700">February 28, 2028</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-100 rounded-2xl h-32 flex items-center justify-center mb-4 border-2 border-dashed border-gray-300">
            <div className="text-center">
              <p className="text-4xl mb-1">🪪</p>
              <p className="text-xs text-gray-500 font-semibold">ID Card: KPP-2026-04812</p>
            </div>
          </div>
          <button className="w-full py-3 rounded-xl font-bold text-sm" style={{ background: "#D4A017", color: "#1a1a2e" }}>
            Download ID Card (PDF)
          </button>
        </div>
      </div>
    );
  }

  if (!applied) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ background: "#F8F5F0" }}>
        <div className="max-w-lg w-full space-y-5">
          {/* Program overview card */}
          <div className="rounded-3xl p-7 text-white" style={{ background: "linear-gradient(135deg, #B8860B 0%, #D4A017 60%, #8B6914 100%)" }}>
            <div className="text-5xl mb-4">🏅</div>
            <h2 className="text-2xl font-black mb-2">Kemedar Preferred Professional Program</h2>
            <p className="text-amber-100 text-sm leading-relaxed mb-4">
              Join our elite network of certified professionals. Get priority task assignments, exclusive ID card, zero entry fees, and continuous training.
            </p>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {["Zero Entry Fees", "Priority Assignments", "Official ID Card", "Premium Training"].map(b => (
                <div key={b} className="flex items-center gap-2 bg-white/20 rounded-xl p-2.5">
                  <span className="text-white text-sm">✓</span>
                  <span className="text-white text-xs font-semibold">{b}</span>
                </div>
              ))}
            </div>
            <button onClick={() => setApplied(true)} className="w-full py-3.5 rounded-xl font-bold text-amber-900 bg-white hover:bg-amber-50 transition-colors">
              Apply for Kemedar Accreditation →
            </button>
          </div>
          <p className="text-center text-xs text-gray-400">
            Or read the <Link to="/kemework/preferred-professional-program" className="font-bold text-amber-700">full program details</Link>
          </p>
        </div>
      </div>
    );
  }

  // Applied / In Progress state
  const currentStep = STATUS === "interview" ? 2 : 1;

  return (
    <div className="min-h-screen" style={{ background: "#F8F5F0" }}>
      <div className="bg-white border-b border-gray-100 px-4 py-5">
        <div className="max-w-[700px] mx-auto">
          <h1 className="text-xl font-black text-gray-900">Accreditation Status</h1>
        </div>
      </div>

      <div className="max-w-[700px] mx-auto px-4 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-5">
          <p className="font-black text-gray-900 mb-1">Kemedar Preferred Professional Program</p>
          <p className="text-xs text-gray-400 mb-5">Application submitted on March 15, 2026</p>

          {/* Timeline */}
          <div className="relative">
            {TIMELINE.map((step, i) => {
              const done = i < currentStep;
              const active = i === currentStep;
              return (
                <div key={step.key} className="flex items-start gap-4 mb-5 last:mb-0">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${done ? "bg-teal-600 border-teal-600" : active ? "bg-amber-50 border-amber-400" : "bg-gray-50 border-gray-200"}`}>
                      {done ? <Check size={18} className="text-white" /> : step.icon}
                    </div>
                    {i < TIMELINE.length - 1 && <div className={`w-0.5 h-6 mt-1 ${done ? "bg-teal-400" : "bg-gray-200"}`} />}
                  </div>
                  <div className="pt-2">
                    <p className={`font-bold text-sm ${active ? "text-amber-700" : done ? "text-gray-900" : "text-gray-400"}`}>{step.label}</p>
                    {step.date && <p className="text-xs mt-0.5 text-gray-400">{step.date}</p>}
                    {active && <span className="inline-block mt-1 text-[10px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700">Current</span>}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {STATUS === "interview" && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
            <p className="font-black text-amber-800 mb-1">📅 Interview Scheduled</p>
            <p className="text-sm text-amber-700 mb-1">Your interview has been confirmed:</p>
            <p className="text-base font-black text-amber-900">Wednesday, April 2, 2026 — 10:00 AM</p>
            <p className="text-sm text-amber-700">Kemedar Headquarters, Cairo Office</p>
          </div>
        )}

        <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 mt-5">
          <p className="text-sm text-gray-600">
            <span className="font-bold">Questions?</span> Contact our accreditation team at{" "}
            <span className="font-bold text-teal-700">accreditation@kemedar.com</span>
          </p>
        </div>
      </div>
    </div>
  );
}