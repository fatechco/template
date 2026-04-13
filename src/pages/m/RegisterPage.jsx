import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Step1BasicInfo from "@/components/auth/Step1BasicInfo";
import Step2RoleSelection from "@/components/auth/Step2RoleSelection";
import Step3VerifyPhone from "@/components/auth/Step3VerifyPhone";
import Step4CompleteProfile from "@/components/auth/Step4CompleteProfile";

const STEPS = [
  { id: 1, label: "Choose Role" },
  { id: 2, label: "Basic Info" },
  { id: 3, label: "Verify Phone" },
  { id: 4, label: "Complete Profile" },
];

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  countryCode: "+20",
  phone: "",
  password: "",
  confirmPassword: "",
  selectedRoles: [],
  otp: "",
  profilePhoto: null,
  companyName: "",
  licenseNumber: "",
  experience: "",
  specialization: "",
  storeName: "",
  businessType: "",
};

export default function RegisterPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const step = STEPS.find((s) => s.id === currentStep);
  const progress = (currentStep / STEPS.length) * 100;

  const update = (patch) => setForm((prev) => ({ ...prev, ...patch }));

  const canProceed = () => {
    const e = {};
    if (currentStep === 1) {
      if (form.selectedRoles.length === 0) e.selectedRoles = "Select at least one role";
    } else if (currentStep === 2) {
      if (!form.firstName.trim()) e.firstName = "First name required";
      if (!form.lastName.trim()) e.lastName = "Last name required";
      if (!form.email.trim()) e.email = "Email required";
      if (!form.phone.trim()) e.phone = "Phone required";
      if (!form.password || form.password.length < 8) e.password = "Min 8 characters";
      if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleNext = () => {
    if (canProceed() && currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      navigate("/m/login");
    }
  };

  const handleSubmit = async () => {
    console.log("Registration complete:", form);
    // Placeholder for actual registration
    navigate("/m/home");
  };

  const renderStepComponent = () => {
    switch (currentStep) {
      case 1:
        return <Step2RoleSelection form={form} update={update} errors={errors} />;
      case 2:
        return <Step1BasicInfo form={form} update={update} errors={errors} />;
      case 3:
        return <Step3VerifyPhone form={form} update={update} />;
      case 4:
        return <Step4CompleteProfile form={form} update={update} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200">
        <div className="flex items-center px-4 gap-3" style={{ height: 52 }}>
          <button onClick={handlePrev} className="p-1 -ml-1 text-gray-900">
            <ChevronLeft size={22} />
          </button>
          <div className="flex-1 text-center">
            <p className="font-black text-gray-900 text-sm">Step {currentStep} of {STEPS.length}</p>
            <p className="text-xs text-gray-400">{step?.label}</p>
          </div>
          <div className="w-8" />
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-100">
          <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 py-6 max-w-md mx-auto w-full">
        {renderStepComponent()}
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto flex gap-3">
        <button
          onClick={handlePrev}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg transition-colors"
        >
          <ChevronLeft size={18} /> Back
        </button>
        {currentStep < STEPS.length ? (
          <button
            onClick={handleNext}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Complete Setup →
          </button>
        )}
      </div>
    </div>
  );
}