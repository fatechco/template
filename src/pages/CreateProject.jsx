import { useState } from "react";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import StepProgressBar from "@/components/create-property/StepProgressBar";
import ProjStep1Info from "@/components/create-project/ProjStep1Info";
import ProjStep2Media from "@/components/create-project/ProjStep2Media";
import ProjStep3Details from "@/components/create-project/ProjStep3Details";
import AmenitiesStep from "@/components/create-shared/AmenitiesStep";
import ProjStep5Description from "@/components/create-project/ProjStep5Description";
import ProjStep6Preview from "@/components/create-project/ProjStep6Preview";

const STEPS = [
  { label: "Info & Location" },
  { label: "Media" },
  { label: "Details" },
  { label: "Amenities" },
  { label: "Description" },
  { label: "Preview" },
];

const INITIAL_FORM = {
  project_type: "",
  suitable_for: [],
  country_id: "", province_id: "", city_id: "", district_id: "", area_id: "",
  address: "", latitude: "", longitude: "",
  logo_url: "", featured_image_url: "",
  slider_images: [], image_gallery: [],
  brochure_url: "", floor_plan_url: "",
  vr_video_link: "", interactive_map_link: "",
  youtube_link_1: "", youtube_link_2: "",
  total_area: "", total_area_unit: "SqM",
  built_area: "", built_area_unit: "SqM",
  green_area: "", green_area_unit: "SqM",
  total_units: "", delivery_date: "",
  project_status: "", project_finishing: "",
  amenity_ids: [],
  project_slogan: "", project_title: "", project_title_ar: "",
  project_description: "", project_description_ar: "",
  developer_id: "", marketing_agent_id: "",
  unit_composition: [],
};

export default function CreateProject() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});

  const updateForm = (fields) => setForm(prev => ({ ...prev, ...fields }));
  const goNext = () => { setStep(s => Math.min(6, s + 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goBack = () => { setStep(s => Math.max(1, s - 1)); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const goToStep = (n) => { setStep(n); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const stepProps = { form, updateForm, onNext: goNext, onBack: goBack, errors, setErrors };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />
      <div className="max-w-[860px] mx-auto px-4 py-8 w-full flex-1">
        <div className="mb-6">
          <h1 className="text-2xl font-black text-gray-900 mb-1">List a Project</h1>
          <p className="text-sm text-gray-500">Add your real estate project to Kemedar's platform.</p>
        </div>
        <StepProgressBar currentStep={step} steps={STEPS} />
        <div className="mt-6">
          {step === 1 && <ProjStep1Info {...stepProps} />}
          {step === 2 && <ProjStep2Media {...stepProps} />}
          {step === 3 && <ProjStep3Details {...stepProps} />}
          {step === 4 && (
            <AmenitiesStep
              title="Step 4 — Project Amenities"
              subtitle="Select all amenities and facilities available in this project."
              form={form} updateForm={updateForm}
              onNext={goNext} onBack={goBack}
            />
          )}
          {step === 5 && <ProjStep5Description {...stepProps} />}
          {step === 6 && <ProjStep6Preview form={form} onBack={goBack} onGoToStep={goToStep} />}
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}