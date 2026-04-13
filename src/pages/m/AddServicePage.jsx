import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddFormShell from "@/components/add-forms/AddFormShell";
import SuccessScreen from "@/components/add-forms/SuccessScreen";
import ServiceStep1 from "@/components/add-service/ServiceStep1";
import ServiceStep2 from "@/components/add-service/ServiceStep2";

const STEPS = [
  { id: 1, label: "Service Details" },
  { id: 2, label: "Pricing & Area" },
];

const INITIAL = {
  category: "",
  title: "",
  description: "",
  tags: [],
  photo_url: "",
  experience_years: 0,
  pricing_type: "fixed",
  price: "",
  currency_id: "USD",
  coverage_cities: [],
  availability: [],
  portfolio_urls: [],
};

export default function AddServicePage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL);
  const [done, setDone] = useState(false);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const canProceed = () => {
    if (step === 1) return !!(form.category && form.title && form.description);
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
        title="Service Listed!"
        subtitle="Your service profile is now live. Clients can find and book you."
        actionLabel="View My Profile"
        actionPath="/m/account"
      />
    );
  }

  const StepMap = { 1: ServiceStep1, 2: ServiceStep2 };
  const StepComp = StepMap[step];

  return (
    <AddFormShell
      title="Add Service"
      steps={STEPS}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      canProceed={canProceed()}
      onSubmit={() => setDone(true)}
      submitLabel="✅ Create Service Profile"
    >
      <StepComp form={form} update={update} />
    </AddFormShell>
  );
}