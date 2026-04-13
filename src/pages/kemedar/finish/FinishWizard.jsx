import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import WizardStep1Property from "@/components/finish/wizard/WizardStep1Property";
import WizardStep2Style from "@/components/finish/wizard/WizardStep2Style";
import WizardStep3FloorPlan from "@/components/finish/wizard/WizardStep3FloorPlan";
import WizardStep4Budget from "@/components/finish/wizard/WizardStep4Budget";
import WizardStep5Team from "@/components/finish/wizard/WizardStep5Team";
import WizardStep6Review from "@/components/finish/wizard/WizardStep6Review";
import BOQGeneratingScreen from "@/components/finish/wizard/BOQGeneratingScreen";

const STEPS = [
  { id: 1, label: "Property" },
  { id: 2, label: "Style" },
  { id: 3, label: "Floor Plan" },
  { id: 4, label: "Budget" },
  { id: 5, label: "Team" },
  { id: 6, label: "Review" },
];

const INITIAL = {
  projectName: "",
  projectType: "new_finishing",
  propertyType: "apartment",
  totalAreaSqm: 100,
  numberOfRooms: 2,
  numberOfBathrooms: 2,
  floorNumber: null,
  propertyAddress: "",
  cityId: "",
  districtId: "",
  propertyId: null,
  designStyle: "modern",
  colorPalette: {},
  finishingLevel: "standard",
  floorPlanUrl: "",
  floorPlanMethod: "estimate",
  estimatedBudget: 500000,
  startDate: "",
  estimatedEndDate: "",
  franchiseOwnerId: null,
  requiresFOSupervision: false,
};

export default function FinishWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState(INITIAL);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const update = (patch) => setForm(prev => ({ ...prev, ...patch }));

  const canNext = () => {
    if (step === 1) return !!(form.projectName && form.projectType && form.propertyAddress);
    if (step === 2) return !!(form.designStyle && form.finishingLevel);
    return true;
  };

  const handleNext = () => {
    if (step < 6 && canNext()) { setStep(s => s + 1); window.scrollTo(0, 0); }
  };
  const handleBack = () => {
    if (step > 1) { setStep(s => s - 1); window.scrollTo(0, 0); }
    else navigate("/kemedar/finish");
  };

  const handleLaunch = async () => {
    setGenerating(true);
    setError(null);
    try {
      const user = await base44.auth.me();
      const projectNumber = `KFP-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`;

      const project = await base44.entities.FinishProject.create({
        ...form,
        ownerId: user.id,
        projectNumber,
        status: "planning",
        currentPhase: 1,
        completionPercent: 0,
        actualSpent: 0,
        boqStatus: "not_generated",
      });

      // Trigger BOQ generation
      await base44.functions.invoke("generateBOQ", { projectId: project.id });

      navigate(`/kemedar/finish/${project.id}/boq`);
    } catch (e) {
      setError(e.message || "Failed to create project. Please try again.");
      setGenerating(false);
    }
  };

  if (generating) return <BOQGeneratingScreen />;

  const progress = (step / STEPS.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-3xl mx-auto px-4 flex items-center gap-3 h-14">
          <button onClick={handleBack} className="p-2 rounded-xl hover:bg-gray-100 text-gray-600">
            <ChevronLeft size={20} />
          </button>
          <div className="flex-1">
            <p className="font-black text-gray-900 text-sm">🏗️ Kemedar Finish™ — Step {step} of {STEPS.length}</p>
            <p className="text-xs text-gray-400">{STEPS[step - 1].label}</p>
          </div>
          <div className="flex gap-1">
            {STEPS.map(s => (
              <div key={s.id} className={`rounded-full transition-all ${s.id <= step ? "bg-orange-500" : "bg-gray-200"} ${s.id === step ? "w-5 h-2" : "w-2 h-2"}`} />
            ))}
          </div>
        </div>
        <div className="h-1 bg-gray-100">
          <div className="h-full bg-orange-500 transition-all duration-300" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
            {error}
          </div>
        )}

        {step === 1 && <WizardStep1Property form={form} update={update} />}
        {step === 2 && <WizardStep2Style form={form} update={update} />}
        {step === 3 && <WizardStep3FloorPlan form={form} update={update} />}
        {step === 4 && <WizardStep4Budget form={form} update={update} />}
        {step === 5 && <WizardStep5Team form={form} update={update} />}
        {step === 6 && <WizardStep6Review form={form} onLaunch={handleLaunch} />}

        {/* Navigation */}
        {step < 6 && (
          <div className="flex gap-3 mt-8">
            <button onClick={handleBack} className="flex-1 border border-gray-300 text-gray-700 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
              <ChevronLeft size={18} /> Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canNext()}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-40 transition-colors"
            >
              Next <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}