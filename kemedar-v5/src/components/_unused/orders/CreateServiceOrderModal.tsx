"use client";
// @ts-nocheck
import { useState } from "react";
import { X } from "lucide-react";
import SOStepSelectBuyer from "./create-order/SOStepSelectBuyer";
import SOStepSelectService from "./create-order/SOStepSelectService";
import SOStepOrderDetails from "./create-order/SOStepOrderDetails";
import SOStepAssignment from "./create-order/SOStepAssignment";
import SOStepReview from "./create-order/SOStepReview";

const STEPS = ["Select Buyer", "Select Service", "Order Details", "Assignment", "Review & Confirm"];

export default function CreateServiceOrderModal({ modules, services, onClose, onCreated }) {
  const [step, setStep] = useState(0);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [orderDetails, setOrderDetails] = useState({
    pricingTierLabel: "",
    unitPrice: 0,
    quantity: 1,
    relatedEntityType: "",
    relatedEntityId: "",
    buyerNotes: "",
  });
  const [assignment, setAssignment] = useState({
    franchiseOwnerId: "",
    skipAssignment: false,
  });

  const canNext = [
    !!selectedBuyer,
    !!selectedService,
    orderDetails.unitPrice > 0,
    true, // assignment step always passable
    true,
  ][step];

  const totalPrice = (orderDetails.unitPrice || 0) * (orderDetails.quantity || 1);

  const handleServiceSelect = (svc) => {
    setSelectedService(svc);
    const basePrice = svc.basePrice ?? (svc.pricingTiers?.[0]?.price ?? 0);
    setOrderDetails(d => ({
      ...d,
      unitPrice: basePrice,
      pricingTierLabel: svc.pricingTiers?.[0]?.label || "",
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/50 py-8 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-lg font-black text-gray-900">Create Service Order</h2>
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
                <span className={`text-[9px] font-bold text-center ${i === step ? "text-orange-600" : "text-gray-400"}`}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="px-6 py-5">
          {step === 0 && (
            <SOStepSelectBuyer selectedBuyer={selectedBuyer} onSelect={setSelectedBuyer} />
          )}
          {step === 1 && (
            <SOStepSelectService
              modules={modules}
              services={services}
              selectedService={selectedService}
              onSelect={handleServiceSelect}
            />
          )}
          {step === 2 && (
            <SOStepOrderDetails
              service={selectedService}
              details={orderDetails}
              onChange={setOrderDetails}
              totalPrice={totalPrice}
            />
          )}
          {step === 3 && (
            <SOStepAssignment
              buyer={selectedBuyer}
              assignment={assignment}
              onChange={setAssignment}
            />
          )}
          {step === 4 && (
            <SOStepReview
              buyer={selectedBuyer}
              service={selectedService}
              details={orderDetails}
              assignment={assignment}
              totalPrice={totalPrice}
              onCreated={onCreated}
              onClose={onClose}
            />
          )}
        </div>

        {/* Footer Nav */}
        {step < 4 && (
          <div className="px-6 pb-5 flex gap-3">
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
              {step === 3 ? "Review →" : "Next →"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}