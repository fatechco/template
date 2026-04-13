import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import AdvisorStepShell from "@/components/advisor/AdvisorStepShell";
import Step1Intent from "@/components/advisor/steps/Step1Intent";
import Step2Type from "@/components/advisor/steps/Step2Type";
import Step3Usage from "@/components/advisor/steps/Step3Usage";
import Step4Household from "@/components/advisor/steps/Step4Household";
import Step5Budget from "@/components/advisor/steps/Step5Budget";
import Step6Location from "@/components/advisor/steps/Step6Location";
import Step7Lifestyle from "@/components/advisor/steps/Step7Lifestyle";
import Step8Wishes from "@/components/advisor/steps/Step8Wishes";

const INITIAL = {
  purpose: null, isFirstTime: null, urgency: null,
  propertyTypes: [], furnishingPreference: null,
  usageCategory: null,
  householdCount: 2, householdComposition: { infants: 0, youngChildren: 0, teenagers: 0, adults: 2, seniors: 0 },
  hasPets: null, accessibilityNeeds: [], worksFromHome: null, carOwnership: null,
  incomeRange: null, budgetMin: 500000, budgetMax: 2500000, currency: "EGP",
  paymentMethod: null, installmentMax: null, downPaymentRange: null,
  rentFrequency: null, leaseDuration: null, expectedReturn: null,
  preferredLocationIds: [], preferredLocationsOpen: false,
  workLocation: null, maxCommuteMinutes: null, commuteMethod: null,
  schoolTypes: [], maxSchoolCommuteMinutes: null, proximityNeeds: [],
  prioritiesRanked: [], viewPreference: null, floorPreference: null,
  noiseTolerance: null, communityStyle: null,
  mustHaveFeatures: [], noGoFeatures: [], wishlistFeatures: [], freeTextNotes: "",
  currentStep: 1
};

function canContinueStep(step, answers) {
  switch (step) {
    case 1: return !!(answers.purpose && answers.urgency);
    case 2: return answers.propertyTypes?.length > 0;
    case 3: return !!answers.usageCategory;
    case 4: return !!(answers.householdCount && answers.worksFromHome && answers.carOwnership);
    case 5: return !!(answers.budgetMax);
    case 6: return !!(answers.preferredLocationIds?.length > 0 || answers.preferredLocationsOpen);
    case 7: return answers.prioritiesRanked?.length >= 3 && !!answers.noiseTolerance && !!answers.communityStyle;
    case 8: return true;
    default: return false;
  }
}

// Completion Screen
function CompletionScreen({ onViewReport }) {
  const [stageIdx, setStageIdx] = useState(0);

  const STAGES = [
    { text: "Analyzing your household needs...", result: "3 bedrooms minimum recommended" },
    { text: "Calculating budget comfort zones...", result: "Budget zones calculated" },
    { text: "Scoring locations against your needs...", result: "3 ideal areas identified" },
    { text: "Matching against properties...", result: "Matching properties found!" },
    { text: "Generating your personalized report...", result: "Report ready!" },
  ];

  useEffect(() => {
    const timer = setInterval(() => setStageIdx(p => p < STAGES.length - 1 ? p + 1 : p), 800);
    return () => clearInterval(timer);
  }, []);

  const allDone = stageIdx === STAGES.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-700 via-purple-600 to-orange-500">
      <div className="text-center max-w-md px-6">
        <div className="text-6xl mb-6 animate-bounce">✨</div>
        <h2 className="text-white font-black text-2xl md:text-3xl mb-8">
          {allDone ? "Your Report is Ready!" : "🎉 Processing your profile..."}
        </h2>

        <div className="space-y-3 mb-8">
          {STAGES.map((s, i) => (
            <div key={i} className={`flex items-center gap-3 text-sm transition-all duration-500 ${i <= stageIdx ? "opacity-100" : "opacity-30"}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${i < stageIdx ? "bg-green-400 text-white" : i === stageIdx ? "border-2 border-white text-white animate-spin" : "bg-white/20 text-white/50"}`}>
                {i < stageIdx ? "✓" : i === stageIdx ? "⟳" : "○"}
              </span>
              <span className={`text-left ${i <= stageIdx ? "text-white" : "text-white/40"}`}>
                {i < stageIdx ? `✅ ${s.result}` : s.text}
              </span>
            </div>
          ))}
        </div>

        <div className="h-2 bg-white/20 rounded-full mb-6 overflow-hidden">
          <div className="h-full bg-white rounded-full transition-all duration-500"
            style={{ width: `${((stageIdx + 1) / STAGES.length) * 100}%` }} />
        </div>

        {allDone && (
          <button onClick={onViewReport}
            className="bg-white text-orange-600 font-black text-lg px-10 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all hover:scale-105">
            🎯 View My Report →
          </button>
        )}
      </div>
    </div>
  );
}

export default function AdvisorSurvey() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState(() => {
    try {
      const draft = localStorage.getItem("kemedar_advisor_draft");
      return draft ? JSON.parse(draft) : INITIAL;
    } catch (_) { return INITIAL; }
  });
  const [showCompletion, setShowCompletion] = useState(false);
  const [profileId, setProfileId] = useState(null);

  const updateAnswers = (updates) => {
    setAnswers(prev => {
      const next = { ...prev, ...updates };
      localStorage.setItem("kemedar_advisor_draft", JSON.stringify({ ...next, currentStep }));
      return next;
    });
  };

  const isResidential = !["invest", "commercial"].includes(answers.usageCategory);

  const goNext = async () => {
    // Skip step 4 (household) for non-residential
    if (currentStep === 3 && !isResidential) {
      setCurrentStep(5); return;
    }
    if (currentStep < 8) {
      setCurrentStep(p => p + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    // Final submission
    setShowCompletion(true);
    try {
      let user = null;
      try { user = await base44.auth.me(); } catch (_) {}

      const profile = await base44.entities.AdvisorProfile.create({
        ...answers, userId: user?.id || null, currentStep: 8,
        completionPercent: 100, isCompleted: false, isActive: true,
        language: "en"
      });
      setProfileId(profile.id);

      await base44.functions.invoke("generateAdvisorReport", { profileId: profile.id });
      localStorage.setItem("kemedar_advisor_profile_id", profile.id);
    } catch (err) {
      console.error(err);
    }
  };

  const goBack = () => {
    if (currentStep === 5 && !isResidential) { setCurrentStep(3); return; }
    if (currentStep > 1) setCurrentStep(p => p - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const STEPS = [Step1Intent, Step2Type, Step3Usage, Step4Household, Step5Budget, Step6Location, Step7Lifestyle, Step8Wishes];
  const StepComponent = STEPS[currentStep - 1];

  return (
    <>
      <AdvisorStepShell
        currentStep={currentStep}
        answers={answers}
        onBack={goBack}
        onContinue={goNext}
        canContinue={canContinueStep(currentStep, answers)}
        onGoToStep={n => setCurrentStep(n)}>
        <StepComponent answers={answers} onChange={updateAnswers} />
      </AdvisorStepShell>

      {showCompletion && (
        <CompletionScreen onViewReport={() => navigate("/dashboard/advisor-report")} />
      )}
    </>
  );
}