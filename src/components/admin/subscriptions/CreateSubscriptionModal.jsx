import { useState } from "react";
import { X } from "lucide-react";
import StepSelectUser from "./create-subscription/StepSelectUser";
import StepSelectPlan from "./create-subscription/StepSelectPlan";
import StepDetails from "./create-subscription/StepDetails";
import StepReview from "./create-subscription/StepReview";

const STEPS = ["Select User", "Select Plan", "Details", "Review & Confirm"];

export default function CreateSubscriptionModal({ modules, plans, onClose, onCreated }) {
  const [step, setStep] = useState(0);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [details, setDetails] = useState({
    startDate: new Date().toISOString().slice(0, 10),
    billingCycle: "",
    autoRenew: true,
    paymentMethod: "credit_card",
    franchiseOwnerId: "",
    franchiseCommissionPercent: 10,
    notes: "",
  });

  const canNext = [
    !!selectedUser,
    !!selectedPlan,
    !!details.startDate && !!details.paymentMethod,
    true,
  ][step];

  const handlePlanSelected = (plan) => {
    setSelectedPlan(plan);
    setDetails(d => ({ ...d, billingCycle: plan.billingCycle || "monthly" }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900">Create Subscription</h2>
            <p className="text-xs text-gray-400 mt-0.5">Step {step + 1} of {STEPS.length} — {STEPS[step]}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><X size={20} /></button>
        </div>

        {/* Progress */}
        <div className="px-6 pt-4">
          <div className="flex gap-1">
            {STEPS.map((label, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className={`h-1.5 w-full rounded-full transition-colors ${i <= step ? "bg-orange-500" : "bg-gray-200"}`} />
                <span className={`text-[10px] font-bold ${i === step ? "text-orange-600" : "text-gray-400"}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 py-5">
          {step === 0 && (
            <StepSelectUser
              selectedUser={selectedUser}
              onSelect={setSelectedUser}
              selectedModule={selectedModule}
            />
          )}
          {step === 1 && (
            <StepSelectPlan
              modules={modules}
              plans={plans}
              selectedModule={selectedModule}
              selectedPlan={selectedPlan}
              onSelectModule={mod => { setSelectedModule(mod); setSelectedPlan(null); }}
              onSelectPlan={handlePlanSelected}
              selectedUser={selectedUser}
            />
          )}
          {step === 2 && (
            <StepDetails
              details={details}
              onChange={setDetails}
              selectedPlan={selectedPlan}
            />
          )}
          {step === 3 && (
            <StepReview
              selectedUser={selectedUser}
              selectedModule={selectedModule}
              selectedPlan={selectedPlan}
              details={details}
              onCreated={onCreated}
              onClose={onClose}
            />
          )}
        </div>

        {/* Footer Nav */}
        {step < 3 && (
          <div className="px-6 pb-5 flex justify-between gap-3">
            <button
              onClick={() => step === 0 ? onClose() : setStep(s => s - 1)}
              className="flex-1 border border-gray-200 text-gray-700 font-bold py-2.5 rounded-xl text-sm hover:bg-gray-50"
            >
              {step === 0 ? "Cancel" : "← Back"}
            </button>
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={!canNext}
              className="flex-1 bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-2.5 rounded-xl text-sm"
            >
              {step === 2 ? "Review →" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}