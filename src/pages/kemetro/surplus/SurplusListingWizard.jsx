import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SurplusStep1Snap from "@/components/surplus/SurplusStep1Snap";
import SurplusStep2Form from "@/components/surplus/SurplusStep2Form";
import SurplusStep3Logistics from "@/components/surplus/SurplusStep3Logistics";
import SurplusSuccessScreen from "@/components/surplus/SurplusSuccessScreen";
import { ArrowLeft } from "lucide-react";

const STEPS = ["Snap", "Fill", "Publish"];

export default function SurplusListingWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [aiResult, setAiResult] = useState(null);
  const [formData, setFormData] = useState({});
  const [capturedImages, setCapturedImages] = useState([]);
  const [published, setPublished] = useState(null);

  if (published) {
    return <SurplusSuccessScreen item={published} onListAnother={() => { setPublished(null); setStep(1); setAiResult(null); setFormData({}); setCapturedImages([]); }} />;
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#F0FDF4" }}>
      {/* Top Bar */}
      <div className="bg-white border-b border-green-100 px-4 py-3 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <button onClick={() => step > 1 ? setStep(s => s - 1) : navigate(-1)} className="flex items-center gap-1.5 text-gray-700">
          <ArrowLeft size={20} />
        </button>
        <p className="font-black text-gray-900" style={{ fontSize: 17 }}>Sell Surplus Materials</p>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full text-green-700 bg-green-100 border border-green-200">
          ♻️ Eco-Market
        </span>
      </div>

      {/* Step Indicator */}
      <div className="bg-white border-b border-green-100 px-6 py-3">
        <div className="flex items-center justify-center gap-0 max-w-xs mx-auto">
          {STEPS.map((label, i) => {
            const num = i + 1;
            const isActive = step === num;
            const isDone = step > num;
            return (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center gap-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black transition-all ${
                    isDone ? "bg-green-600 text-white" : isActive ? "bg-green-600 text-white ring-4 ring-green-100" : "bg-gray-200 text-gray-500"
                  }`}>
                    {isDone ? "✓" : num}
                  </div>
                  <span className={`text-[10px] font-bold ${isActive ? "text-green-700" : "text-gray-400"}`}>{label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-12 h-1 mx-1 rounded-full mb-4 ${step > num ? "bg-green-600" : "bg-gray-200"}`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="flex-1">
        {step === 1 && (
          <SurplusStep1Snap
            capturedImages={capturedImages}
            setCapturedImages={setCapturedImages}
            onAiResult={(result) => { setAiResult(result); setStep(2); }}
            onManual={() => { setAiResult(null); setStep(2); }}
          />
        )}
        {step === 2 && (
          <SurplusStep2Form
            aiResult={aiResult}
            capturedImages={capturedImages}
            formData={formData}
            setFormData={setFormData}
            onNext={() => setStep(3)}
          />
        )}
        {step === 3 && (
          <SurplusStep3Logistics
            formData={formData}
            setFormData={setFormData}
            capturedImages={capturedImages}
            aiResult={aiResult}
            onPublished={setPublished}
          />
        )}
      </div>
    </div>
  );
}