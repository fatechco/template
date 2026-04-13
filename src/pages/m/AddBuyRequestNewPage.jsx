import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddFormShell from "@/components/add-forms/AddFormShell";
import SuccessScreen from "@/components/add-forms/SuccessScreen";
import BRNewStep1 from "@/components/add-buy-request-new/BRNewStep1";
import BRNewStep2 from "@/components/add-buy-request-new/BRNewStep2";
import BRNewStep3 from "@/components/add-buy-request-new/BRNewStep3";

const STEPS = [
  { id: 1, label: "What I'm Looking For" },
  { id: 2, label: "Where" },
  { id: 3, label: "Details" },
];

const INITIAL = {
  category_ids: [],
  purpose: "",
  currency_id: "USD",
  budget_min: "",
  budget_max: "",
  rooms: 0,
  beds: 0,
  baths: 0,
  area_size: "",
  area_unit: "SqM",
  country_id: "",
  province_id: "",
  city_id: "",
  district_id: "",
  area_id: "",
  address: "",
  landmark: "",
  title: "",
  description: "",
  photo_url: "",
  amenity_ids: [],
};

export default function AddBuyRequestNewPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL);
  const [done, setDone] = useState(false);

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const canProceed = () => {
    if (step === 1) return form.category_ids.length > 0 && !!form.purpose;
    if (step === 2) return true;
    if (step === 3) return !!form.title;
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
        title="Request Posted!"
        subtitle="Sellers matching your criteria will contact you"
        actionLabel="View My Requests"
        actionPath="/m/account"
      />
    );
  }

  const StepMap = { 1: BRNewStep1, 2: BRNewStep2, 3: BRNewStep3 };
  const StepComp = StepMap[step];

  return (
    <AddFormShell
      title="Buy Request"
      steps={STEPS}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      canProceed={canProceed()}
      onSubmit={() => setDone(true)}
      submitLabel="✅ Post Request"
    >
      <StepComp form={form} update={update} />
    </AddFormShell>
  );
}