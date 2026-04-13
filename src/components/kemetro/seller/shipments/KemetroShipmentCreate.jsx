import { useState } from "react";
import KemetroShipmentStep1 from "./KemetroShipmentStep1";
import KemetroShipmentStep2 from "./KemetroShipmentStep2";
import KemetroShipmentStep3 from "./KemetroShipmentStep3";

const STEPS = ["Package Details", "Find Shipper", "Confirm & Post"];

export default function KemetroShipmentCreate() {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({ packageCount: 1, weightUnit: "kg" });

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Create New Shipment</h1>
        <p className="text-gray-500 text-sm mt-1">Post a delivery request to Kemetro shippers</p>
      </div>

      {/* Progress Bar */}
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center">
          {STEPS.map((s, i) => (
            <div key={i} className="flex items-center flex-1">
              <div className="flex items-center gap-2.5 flex-shrink-0">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm transition-all ${i < step ? "bg-green-500 text-white" : i === step ? "bg-[#FF6B00] text-white" : "bg-gray-200 text-gray-500"}`}>
                  {i < step ? "✓" : i + 1}
                </div>
                <span className={`text-sm font-bold hidden sm:block ${i === step ? "text-[#FF6B00]" : i < step ? "text-green-600" : "text-gray-400"}`}>{s}</span>
              </div>
              {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 mx-3 ${i < step ? "bg-green-400" : "bg-gray-200"}`} />}
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {step === 0 && <KemetroShipmentStep1 data={formData} onChange={setFormData} onNext={() => setStep(1)} />}
      {step === 1 && <KemetroShipmentStep2 data={formData} onChange={setFormData} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
      {step === 2 && <KemetroShipmentStep3 data={formData} onBack={() => setStep(1)} onConfirm={() => {}} />}
    </div>
  );
}