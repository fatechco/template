import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Step1Location from "@/components/create-property/Step1Location";
import Step2Media from "@/components/create-property/Step2Media";
import Step3Price from "@/components/create-property/Step3Price";
import Step4Features from "@/components/create-property/Step4Features";
import Step5Publisher from "@/components/create-property/Step5Publisher";
import Step6Description from "@/components/create-property/Step6Description";
import Step7Preview from "@/components/create-property/Step7Preview";

const INITIAL_FORM = {
  // Step 1: Location
  category_id: "",
  suitable_for_ids: [],
  purpose: "",
  country_id: "",
  province_id: "",
  city_id: "",
  district_id: "",
  area_id: "",
  address: "",
  latitude: "",
  longitude: "",
  project_id: "",
  direct_phone: "",
  // Step 2: Media
  featured_image: null,
  featured_image_url: "",
  image_gallery: [],
  image_gallery_urls: [],
  brochure_file: null,
  brochure_url: "",
  vr_video_link: "",
  floor_plan_file: null,
  floor_plan_url: "",
  youtube_link_1: "",
  youtube_link_2: "",
  youtube_link_3: "",
  // Step 3: Price
  is_contact_for_price: false,
  currency_id: "EGP",
  price_amount: "",
  price_per_unit: "",
  is_negotiable: "no",
  enable_installment: false,
  upfront_payment: "",
  monthly_payment: "",
  quarterly_payment: "",
  yearly_payment: "",
  installment_period: "",
  enable_discount: false,
  discount_value: "",
  discount_type: "percent",
  area_size: "",
  area_unit: "SqM",
  dues_taxes: "",
  // Step 4: Features
  beds: "",
  baths: "",
  floor_number: "",
  total_floors: "",
  year_built: "",
  amenity_ids: [],
  distance_ids: [],
  frontage_ids: [],
  scene_view_ids: [],
  furnished_id: "",
  // Step 5: Publisher
  publisher_type_id: "",
  // Step 6: Description
  title: "",
  title_ar: "",
  description: "",
  description_ar: "",
};

const STEPS = [
  { id: 1, label: "Location", component: Step1Location },
  { id: 2, label: "Media", component: Step2Media },
  { id: 3, label: "Price", component: Step3Price },
  { id: 4, label: "Features", component: Step4Features },
  { id: 5, label: "Publisher", component: Step5Publisher },
  { id: 6, label: "Description", component: Step6Description },
  { id: 7, label: "Preview", component: Step7Preview },
];

export default function MobileAddProperty() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const step = STEPS.find((s) => s.id === currentStep);
  const StepComponent = step?.component;

  const canProceed = () => {
    if (currentStep === 1) return !!(formData.category_id && formData.purpose && formData.address);
    if (currentStep === 2) return true;
    if (currentStep === 3) return !!(formData.price_amount || formData.is_contact_for_price);
    if (currentStep === 4) return true;
    if (currentStep === 5) return !!formData.publisher_type_id;
    if (currentStep === 6) return !!formData.title;
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
    console.log("Submitting property:", formData);
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
          <h1 className="font-black text-gray-900 text-lg">List a Property</h1>
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