import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddFormShell from "@/components/add-forms/AddFormShell";
import SuccessScreen from "@/components/add-forms/SuccessScreen";
import RFQStep1 from "@/components/add-rfq/RFQStep1";
import RFQStep2 from "@/components/add-rfq/RFQStep2";

const STEPS = [
  { id: 1, label: "Product Details" },
  { id: 2, label: "Timeline & Notes" },
];

const INITIAL = {
  category: "",
  subcategory: "",
  description: "",
  quantity: "",
  unit: "pieces",
  currency_id: "USD",
  budget: "",
  delivery_city: "",
  required_by: "",
  payment_terms: [],
  notes: "",
  spec_doc_url: "",
};

export default function AddRFQPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL);
  const [done, setDone] = useState(false);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const canProceed = () => {
    if (step === 1) return !!(form.category && form.description && form.quantity);
    return true;
  };

  const handleNext = () => {
    if (step < STEPS.length && canProceed()) { setStep(step + 1); window.scrollTo(0, 0); }
  };
  const handlePrev = () => {
    if (step > 1) { setStep(step - 1); window.scrollTo(0, 0); }
    else navigate(-1);
  };

  if (done) {
    return (
      <SuccessScreen
        title="RFQ Posted!"
        subtitle="Kemetro sellers will submit their quotes within 24 hours"
        actionLabel="View My RFQs"
        actionPath="/m/account"
      />
    );
  }

  const StepMap = { 1: RFQStep1, 2: RFQStep2 };
  const StepComp = StepMap[step];

  return (
    <AddFormShell
      title="Post RFQ"
      steps={STEPS}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      canProceed={canProceed()}
      onSubmit={() => setDone(true)}
      submitLabel="✅ Post RFQ"
    >
      <StepComp form={form} update={update} />
    </AddFormShell>
  );
}