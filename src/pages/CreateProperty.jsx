import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SuperFooter from "@/components/layout/SuperFooter";
import StepProgressBar from "@/components/create-property/StepProgressBar";
import Step1Location from "@/components/create-property/Step1Location";
import Step2Media from "@/components/create-property/Step2Media";
import Step3Price from "@/components/create-property/Step3Price";
import Step4Features from "@/components/create-property/Step4Features";
import Step5Publisher from "@/components/create-property/Step5Publisher";
import Step6Description from "@/components/create-property/Step6Description";
import Step7Preview from "@/components/create-property/Step7Preview";

const STEPS = [
  { label: "Location" },
  { label: "Media" },
  { label: "Price" },
  { label: "Features" },
  { label: "Publisher" },
  { label: "Description" },
  { label: "Preview" },
];

const INITIAL_FORM = {
  // Step 1
  category_id: "",
  suitable_for_ids: [],
  purpose: "",
  country_id: "69d0b93e19cff6ef7d6a38a7",
  province_id: "69d0ba78b2324457d06b088f",
  city_id: "",
  district_id: "",
  area_id: "",
  address: "",
  latitude: "",
  longitude: "",
  project_id: "",
  direct_phone: "",
  // Step 2
  featured_image: null,
  featured_image_url: "",
  image_gallery: [],
  image_gallery_urls: [],
  brochure_file: null,
  brochure_url: "",
  vr_video_link: "",
  floor_plan_file: null,
  floor_plan_url: "",
  legal_doc_file: null,
  street_image_url: "",
  entrance_image_url: "",
  hall_image_url: "",
  elevator_image_url: "",
  prop_entrance_image_url: "",
  reception_image_url: "",
  room1_image_url: "",
  kitchen_image_url: "",
  bathroom_image_url: "",
  balcony_image_url: "",
  youtube_link_1: "",
  youtube_link_2: "",
  youtube_link_3: "",
  voice_recording_url: "",
  // Step 3
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
  // Step 4
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
  // Step 5
  publisher_type_id: "",
  // Step 6
  title: "",
  title_ar: "",
  description: "",
  description_ar: "",
};

export default function CreateProperty() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    base44.auth.isAuthenticated().then(authed => {
      if (!authed) base44.auth.redirectToLogin(window.location.href);
      else setAuthChecked(true);
    });
  }, []);

  if (!authChecked) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-gray-200 border-t-[#FF6B00] rounded-full animate-spin" />
    </div>
  );

  const updateForm = (fields) => setForm(prev => ({ ...prev, ...fields }));

  const goNext = () => {
    setStep(s => Math.min(7, s + 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goBack = () => {
    setStep(s => Math.max(1, s - 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goToStep = (n) => {
    setStep(n);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const stepProps = { form, updateForm, onNext: goNext, onBack: goBack, onGoToStep: goToStep, errors, setErrors };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-[860px] mx-auto px-4 py-8 w-full flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">List a Property</h1>
          <p className="text-sm text-gray-500">Fill in the details below to publish your property on Kemedar.</p>
        </div>

        {/* AI Entry Point Banner */}
        <div className="bg-white rounded-2xl mb-6 overflow-hidden shadow-sm"
          style={{ border: '2px solid transparent', background: 'linear-gradient(white, white) padding-box, linear-gradient(135deg, #7C3AED, #3B82F6) border-box' }}>
          <div className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-2xl flex-shrink-0">✨</div>
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="font-black text-gray-900">NEW — Add with AI</span>
                  <span className="bg-purple-100 text-purple-700 text-[10px] font-black px-2 py-0.5 rounded-full">AI-Powered</span>
                </div>
                <p className="text-sm text-gray-500">Describe your property by voice or message and AI fills the entire form</p>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Link to="/kemedar/add/property/ai"
                className="bg-purple-600 hover:bg-purple-700 text-white font-black px-4 py-2.5 rounded-xl text-sm flex items-center gap-1.5 transition-all hover:scale-105 shadow-md whitespace-nowrap">
                🎤 Try AI Assistant
              </Link>
              <span className="text-xs text-gray-400 self-center whitespace-nowrap hidden sm:block">or fill manually below ↓</span>
            </div>
          </div>
        </div>
        <StepProgressBar currentStep={step} steps={STEPS} />
        <div className="mt-6">
          {step === 1 && <Step1Location {...stepProps} />}
          {step === 2 && <Step2Media {...stepProps} />}
          {step === 3 && <Step3Price {...stepProps} />}
          {step === 4 && <Step4Features {...stepProps} />}
          {step === 5 && <Step5Publisher {...stepProps} />}
          {step === 6 && <Step6Description {...stepProps} />}
          {step === 7 && <Step7Preview {...stepProps} />}
        </div>
      </div>
      <SuperFooter />
    </div>
  );
}