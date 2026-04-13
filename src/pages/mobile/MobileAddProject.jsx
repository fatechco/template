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
  { id: 1, label: "Basic Info", component: ProjStep1Info },
  { id: 2, label: "Media", component: ProjStep2Media },
  { id: 3, label: "Details", component: ProjStep3Details },
  { id: 4, label: "Description", component: ProjStep5Description },
  { id: 5, label: "Preview", component: ProjStep6Preview },
];

export default function MobileAddProject() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const step = STEPS.find((s) => s.id === currentStep);
  const StepComponent = step?.component;

  const canProceed = () => {
    if (currentStep === 1) return !!(formData.title && formData.category_id);
    if (currentStep === 2) return true;
    if (currentStep === 3) return true;
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
    }
  };

  const handleGoToStep = (n) => {
    setCurrentStep(n);
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    console.log("Submitting project:", formData);
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
          <h1 className="font-black text-gray-900 text-lg">Add Project</h1>
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