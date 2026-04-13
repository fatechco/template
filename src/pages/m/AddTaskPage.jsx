import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddFormShell from "@/components/add-forms/AddFormShell";
import SuccessScreen from "@/components/add-forms/SuccessScreen";
import TaskStep1 from "@/components/add-task/TaskStep1";
import TaskStep2 from "@/components/add-task/TaskStep2";

const STEPS = [
  { id: 1, label: "Task Details" },
  { id: 2, label: "Budget & Timeline" },
];

const INITIAL = {
  category: "",
  title: "",
  description: "",
  photo_urls: [],
  address: "",
  city: "",
  budget_type: "fixed",
  budget: "",
  currency_id: "USD",
  deadline: "",
  is_urgent: false,
  is_private: false,
  is_biddable: true,
};

export default function AddTaskPage() {
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
        title="Task Posted!"
        subtitle="Professionals in your area will contact you soon"
        actionLabel="View Task"
        actionPath="/m/account"
      />
    );
  }

  const StepMap = { 1: TaskStep1, 2: TaskStep2 };
  const StepComp = StepMap[step];

  return (
    <AddFormShell
      title="Post a Task"
      steps={STEPS}
      currentStep={step}
      onNext={handleNext}
      onPrev={handlePrev}
      canProceed={canProceed()}
      onSubmit={() => setDone(true)}
      submitLabel="✅ Post Task"
    >
      <StepComp form={form} update={update} />
    </AddFormShell>
  );
}