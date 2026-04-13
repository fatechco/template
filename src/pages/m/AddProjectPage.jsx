import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ProjStep1Info from "@/components/create-project/ProjStep1Info";
import ProjStep2Media from "@/components/create-project/ProjStep2Media";
import ProjStep3Details from "@/components/create-project/ProjStep3Details";
import ProjStep5Description from "@/components/create-project/ProjStep5Description";
import ProjStep6Preview from "@/components/create-project/ProjStep6Preview";

const INITIAL_FORM = {
  title: "",
  title_ar: "",
  description: "",
  description_ar: "",
  category_id: "",
  purpose_id: "",
  country_id: "",
  province_id: "",
  city_id: "",
  address: "",
  latitude: "",
  longitude: "",
  featured_image_url: "",
  image_gallery_urls: [],
  youtube_link_1: "",
  youtube_link_2: "",
  price_amount: "",
  currency_id: "EGP",
  beds: "",
  baths: "",
  area_size: "",
  amenity_ids: [],
  publisher_type_id: "",
};

const STEPS = [
  { id: 1, label: "Basic Info",   component: ProjStep1Info },
  { id: 2, label: "Media",        component: ProjStep2Media },
  { id: 3, label: "Details",      component: ProjStep3Details },
  { id: 4, label: "Description",  component: ProjStep5Description },
  { id: 5, label: "Preview",      component: ProjStep6Preview },
];

export default function AddProjectPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const step = STEPS.find((s) => s.id === currentStep);
  const StepComponent = step?.component;
  const progress = (currentStep / STEPS.length) * 100;

  const canProceed = () => {
    if (currentStep === 1) return !!(formData.title && formData.category_id);
    if (currentStep === 4) return !!formData.description;
    return true;
  };

  const handleNext = () => {
    if (currentStep < STEPS.length && canProceed()) {
      setCurrentStep(currentStep + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    } else {
      navigate(-1);
    }
  };

  const handleGoToStep = (n) => {
    setCurrentStep(n);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    console.log("Submitting project:", formData);
    navigate("/m/account");
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
            <p className="font-black text-gray-900 text-sm">Add Project — Step {currentStep} of {STEPS.length}</p>
            <p className="text-xs text-gray-400">{step?.label}</p>
          </div>
          <button className="text-xs text-gray-400 font-semibold">Save Draft</button>
        </div>
        {/* Progress bar */}
        <div className="w-full h-1 bg-gray-100">
          <div className="h-full bg-orange-600 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
        {/* Step dots */}
        <div className="flex justify-center gap-1.5 py-2">
          {STEPS.map((s) => (
            <div
              key={s.id}
              className={`rounded-full transition-all ${s.id <= currentStep ? "bg-orange-600" : "bg-gray-200"} ${s.id === currentStep ? "w-4 h-2" : "w-2 h-2"}`}
            />
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto pb-28 px-4 py-6 max-w-3xl mx-auto w-full">
        {StepComponent && (
          <StepComponent
            form={formData}
            updateForm={setFormData}
            onNext={handleNext}
            onBack={handlePrev}
            onGoToStep={handleGoToStep}
            errors={errors}
            setErrors={setErrors}
          />
        )}
      </div>

      {/* Footer Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 flex gap-3" style={{ maxWidth: 448, margin: "0 auto" }}>
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-900 font-bold py-3.5 rounded-xl disabled:opacity-40"
        >
          <ChevronLeft size={18} /> Back
        </button>
        {currentStep < STEPS.length ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-600 text-white font-bold py-3.5 rounded-xl disabled:opacity-40 transition-colors"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 text-white font-bold py-3.5 rounded-xl transition-colors"
          >
            ✅ Publish Project
          </button>
        )}
      </div>
    </div>
  );
}