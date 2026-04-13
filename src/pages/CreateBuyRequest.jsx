import { useState } from "react";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import StepProgressBar from "@/components/create-property/StepProgressBar";
import BRStep1What from "@/components/create-buy-request/BRStep1What";
import BRStep2Location from "@/components/create-buy-request/BRStep2Location";
import BRStep3Media from "@/components/create-buy-request/BRStep3Media";
import AmenitiesStep from "@/components/create-shared/AmenitiesStep";
import BRStep5Preview from "@/components/create-buy-request/BRStep5Preview";

const STEPS = [
  { label: "Requirements" },
  { label: "Location" },
  { label: "Description" },
  { label: "Amenities" },
  { label: "Preview" },
];

const INITIAL_FORM = {
  category_ids: [],
  purpose: "",
  max_rooms: "",
  beds: "",
  baths: "",
  min_size: "",
  size_unit: "SqM",
  budget: "",
  currency: "EGP",
  country_id: "",
  province_id: "",
  city_id: "",
  district_id: "",
  area_id: "",
  address: "",
  landmark: "",
  zip_code: "",
  request_title: "",
  description: "",
  image_url: "",
  video_link: "",
  amenity_ids: [],
};

export default function CreateBuyRequest() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const updateForm = (fields) => setForm(prev => ({ ...prev, ...fields }));
  const goNext = () => { setStep(s => Math.min(5, s + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goBack = () => { setStep(s => Math.max(1, s - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const stepProps = { form, updateForm, onNext: goNext, onBack: goBack, errors, setErrors };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-[860px] mx-auto px-4 py-8 w-full flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">Post a Buy Request</h1>
          <p className="text-sm text-gray-500">Tell us what you're looking for — agents and sellers will reach out.</p>
        </div>
        <StepProgressBar currentStep={step} steps={STEPS} />
        <div className="mt-6">
          {step === 1 && <BRStep1What {...stepProps} />}
          {step === 2 && <BRStep2Location {...stepProps} />}
          {step === 3 && <BRStep3Media {...stepProps} />}
          {step === 4 && (
            <AmenitiesStep
              title="Step 4 — Desired Amenities"
              subtitle="Select the amenities you want in your ideal property."
              form={form} updateForm={updateForm}
              onNext={goNext} onBack={goBack}
            />
          )}
          {step === 5 && <BRStep5Preview form={form} onBack={goBack} />}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}