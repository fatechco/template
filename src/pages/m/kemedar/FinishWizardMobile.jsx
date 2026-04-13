import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronRight } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const STYLES = [
  { id: "modern", name: "Modern Minimalist", emoji: "🤍", desc: "Clean lines, neutral tones" },
  { id: "classic", name: "Classic Elegance", emoji: "✨", desc: "Timeless, sophisticated" },
  { id: "bohemian", name: "Bohemian", emoji: "🎨", desc: "Artistic, eclectic" },
  { id: "industrial", name: "Industrial", emoji: "🏭", desc: "Raw, functional" },
  { id: "mediterranean", name: "Mediterranean", emoji: "🌊", desc: "Warm, coastal" },
  { id: "contemporary", name: "Contemporary", emoji: "💫", desc: "Trendy, sophisticated" },
];

const BUDGET_RANGES = [
  { id: "20-50k", label: "EGP 20K - 50K", min: 20000, max: 50000 },
  { id: "50-100k", label: "EGP 50K - 100K", min: 50000, max: 100000 },
  { id: "100-250k", label: "EGP 100K - 250K", min: 100000, max: 250000 },
  { id: "250k-plus", label: "EGP 250K+", min: 250000, max: 1000000 },
];

export default function FinishWizardMobile() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    projectName: "",
    spaceType: "",
    style: "",
    budget: "",
  });

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handleSubmit = async () => {
    // In a real app, this would create the project
    console.log("Project data:", formData);
    navigate("/m/kemedar/finish/landing");
  };

  const isStepValid = () => {
    if (step === 1) return formData.projectName.trim() && formData.spaceType;
    if (step === 2) return formData.style;
    if (step === 3) return formData.budget;
    return true;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-28">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
        <button onClick={() => step === 1 ? navigate(-1) : setStep(step - 1)} className="p-1.5">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <p className="font-black text-gray-900 text-sm">Step {step} of 4</p>
        <div className="w-6" />
      </div>

      {/* Progress Bar */}
      <div className="h-1 bg-gray-200">
        <div className="h-full" style={{ width: `${(step / 4) * 100}%`, background: "#F97316", transition: "width 0.3s" }} />
      </div>

      <div className="px-4 py-6">
        {/* Step 1: Project Info */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Project Details</h2>
              <p className="text-gray-500 text-sm">What are we finishing today?</p>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Project Name</label>
              <input
                type="text"
                placeholder="e.g., Master Bedroom, Living Room"
                value={formData.projectName}
                onChange={e => setFormData(p => ({ ...p, projectName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-orange-400"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Space Type</label>
              <div className="space-y-2">
                {["Apartment", "Villa", "Office", "Retail", "Other"].map(type => (
                  <button
                    key={type}
                    onClick={() => setFormData(p => ({ ...p, spaceType: type }))}
                    className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                      formData.spaceType === type
                        ? "bg-orange-500 text-white"
                        : "bg-white border border-gray-200 text-gray-700 hover:border-orange-400"
                    }`}>
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Step 2: Style */}
        {step === 2 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Pick Your Style</h2>
              <p className="text-gray-500 text-sm">What vibe are we creating?</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => setFormData(p => ({ ...p, style: style.id }))}
                  className={`rounded-2xl p-4 border-2 transition-all text-center ${
                    formData.style === style.id
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-200 bg-white hover:border-orange-400"
                  }`}>
                  <div className="text-3xl mb-2">{style.emoji}</div>
                  <p className="font-bold text-sm text-gray-900">{style.name}</p>
                  <p className="text-[10px] text-gray-500 mt-1">{style.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Budget */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Your Budget</h2>
              <p className="text-gray-500 text-sm">What's your finishing budget?</p>
            </div>

            <div className="space-y-2">
              {BUDGET_RANGES.map(range => (
                <button
                  key={range.id}
                  onClick={() => setFormData(p => ({ ...p, budget: range.id }))}
                  className={`w-full px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    formData.budget === range.id
                      ? "bg-orange-500 text-white"
                      : "bg-white border border-gray-200 text-gray-700 hover:border-orange-400"
                  }`}>
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Review */}
        {step === 4 && (
          <div className="space-y-4">
            <div>
              <h2 className="text-2xl font-black text-gray-900 mb-1">Review Your Project</h2>
              <p className="text-gray-500 text-sm">Ready to get started?</p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-600 text-sm">Project Name:</span>
                <span className="font-bold text-gray-900">{formData.projectName}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-gray-600 text-sm">Space Type:</span>
                <span className="font-bold text-gray-900">{formData.spaceType}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-gray-600 text-sm">Style:</span>
                <span className="font-bold text-gray-900">{STYLES.find(s => s.id === formData.style)?.name}</span>
              </div>
              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <span className="text-gray-600 text-sm">Budget:</span>
                <span className="font-bold text-orange-600">{BUDGET_RANGES.find(b => b.id === formData.budget)?.label}</span>
              </div>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4">
              <p className="text-sm text-orange-900 leading-relaxed">
                ✨ Our AI will generate a complete Bill of Quantities, match professionals, and coordinate every phase of your finishing project.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Button Bar */}
      <div className="fixed bottom-28 left-0 right-0 bg-white border-t border-gray-100 px-4 py-3 flex gap-2">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}
            className="flex-1 py-3 rounded-xl font-bold text-sm border border-gray-200 text-gray-700">
            Back
          </button>
        )}
        <button
          onClick={step === 4 ? handleSubmit : handleNext}
          disabled={!isStepValid()}
          className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-opacity ${
            isStepValid()
              ? "bg-orange-500 text-white hover:bg-orange-600"
              : "bg-gray-200 text-gray-400 cursor-not-allowed"
          }`}>
          {step === 4 ? "✅ Create Project" : "Continue"} {step < 4 && <ChevronRight size={16} />}
        </button>
      </div>

      <MobileBottomNav />
    </div>
  );
}