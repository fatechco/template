import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import BRStep1What from "@/components/create-buy-request/BRStep1What";
import BRStep2Location from "@/components/create-buy-request/BRStep2Location";
import BRStep3Media from "@/components/create-buy-request/BRStep3Media";
import BRStep5Preview from "@/components/create-buy-request/BRStep5Preview";

const INITIAL_FORM = {
  category_id: "",
  suitable_for_ids: [],
  purpose_id: "",
  country_id: "",
  province_id: "",
  city_id: "",
  district_id: "",
  area_id: "",
  address: "",
  latitude: "",
  longitude: "",
  budget_min: "",
  budget_max: "",
  currency_id: "EGP",
  beds: "",
  baths: "",
  area_size_min: "",
  area_size_max: "",
  featured_image_url: "",
  image_gallery_urls: [],
  title: "",
  title_ar: "",
  description: "",
  description_ar: "",
  contact_name: "",
  contact_phone: "",
  contact_email: "",
};

const STEPS = [
  { id: 1, label: "What You Want", component: BRStep1What },
  { id: 2, label: "Location", component: BRStep2Location },
  { id: 3, label: "Media", component: BRStep3Media },
  { id: 4, label: "Preview", component: BRStep5Preview },
];

export default function MobileAddBuyRequest() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const step = STEPS.find((s) => s.id === currentStep);
  const StepComponent = step?.component;

  const canProceed = () => {
    if (currentStep === 1) return !!(formData.category_id && formData.purpose_id);
    if (currentStep === 2) return !!(formData.country_id && formData.address);
    if (currentStep === 3) return true;
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
    }
  };

  const handleGoToStep = (n) => {
    setCurrentStep(n);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    console.log("Submitting buy request:", formData);
    navigate(-1);
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 px-4 py-4 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="text-gray-900">
          <ChevronLeft size={24} />
        </button>
        <div className="flex-1">
          <h1 className="font-black text-gray-900 text-lg">Buy Request</h1>
          <p className="text-xs text-gray-500 mt-0.5">Step {currentStep} of {STEPS.length}</p>
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
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 max-w-md mx-auto flex gap-3">
        <button
          onClick={handlePrev}
          disabled={currentStep === 1}
          className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-900 font-bold py-3 rounded-lg disabled:opacity-50"
        >
          <ChevronLeft size={18} /> Back
        </button>
        {currentStep < STEPS.length ? (
          <button
            onClick={handleNext}
            disabled={!canProceed()}
            className="flex-1 flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 rounded-lg disabled:opacity-50 transition-colors"
          >
            Next <ChevronRight size={18} />
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg transition-colors"
          >
            Publish
          </button>
        )}
      </div>
    </div>
  );
}