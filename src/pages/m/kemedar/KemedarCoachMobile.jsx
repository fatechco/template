import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Map, MessageSquare, Trophy, ArrowLeft, Play } from "lucide-react";
import CoachOnboarding from "@/components/coach/CoachOnboarding";
import CoachChat from "@/components/coach/CoachChat";
import CoachRoadmap from "@/components/coach/CoachRoadmap";
import CoachAchievements from "@/components/coach/CoachAchievements";
import CoachStepContent from "@/components/coach/CoachStepContent";
import { JOURNEY_META, STEP_TYPE_STYLES } from "@/lib/coachJourneyData";
import { useNavigate } from "react-router-dom";

export default function KemedarCoachMobile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('journey'); // journey | chat | achievements
  const [activeStep, setActiveStep] = useState(null);
  const [activeStage, setActiveStage] = useState(null);
  const [showStep, setShowStep] = useState(false);

  useEffect(() => { init(); }, []);

  const init = async () => {
    const u = await base44.auth.me().catch(() => null);
    if (u) {
      const profiles = await base44.entities.CoachProfile.filter({ userId: u.id });
      if (profiles.length > 0) {
        const p = profiles[0];
        setProfile(p);
        const journeys = await base44.entities.CoachJourney.filter({ journeyType: p.journeyType });
        if (journeys.length > 0) {
          const j = journeys[0];
          setJourney(j);
          const firstStage = j.stages?.[0];
          const firstStep = firstStage?.steps?.[0];
          if (firstStep) { setActiveStep(firstStep); setActiveStage(firstStage); }
        }
      }
    }
    setLoading(false);
  };

  const handleStepComplete = async () => {
    if (!profile || !activeStep || !activeStage) return;
    const newCompleted = [...(profile.completedStepIds || [])];
    if (!newCompleted.includes(activeStep.stepId)) newCompleted.push(activeStep.stepId);
    const totalSteps = journey?.stages?.reduce((s, st) => s + (st.steps?.length || 0), 0) || 1;
    const overallProgress = Math.round((newCompleted.length / totalSteps) * 100);
    await base44.entities.CoachProfile.update(profile.id, { completedStepIds: newCompleted, overallProgress });
    setProfile(p => ({ ...p, completedStepIds: newCompleted, overallProgress }));
    setShowStep(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"/></div>
  );
  if (!profile) return <CoachOnboarding onComplete={p => { if (p) { setProfile(p); init(); } }} />;

  const meta = JOURNEY_META[profile.journeyType] || {};
  const typeStyle = activeStep ? STEP_TYPE_STYLES[activeStep.stepType] || STEP_TYPE_STYLES.article : null;

  if (showStep && activeStep) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <div className="flex items-center gap-3 p-4 border-b border-gray-100 bg-white sticky top-0 z-10">
          <button onClick={() => setShowStep(false)}><ArrowLeft size={20} className="text-gray-600"/></button>
          <div className="flex-1">
            <p className="font-black text-gray-900 text-sm">{activeStep.stepName}</p>
            <p className="text-xs text-gray-400">{activeStage?.stageName}</p>
          </div>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeStyle?.badge}`}>{typeStyle?.label}</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          <CoachStepContent step={activeStep} stage={activeStage} journey={journey} profile={profile}
            content={null} onComplete={handleStepComplete} onAskCoach={() => { setShowStep(false); setTab('chat'); }}/>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col pb-20">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-500 to-orange-500 text-white px-4 pt-12 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-2xl">{meta.icon}</span>
          <p className="font-black text-white">{meta.name}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 bg-white/30 rounded-full h-2">
            <div className="bg-white h-2 rounded-full transition-all" style={{ width: `${profile.overallProgress}%` }}/>
          </div>
          <span className="font-black text-white text-sm">{profile.overallProgress}%</span>
        </div>
        <p className="text-white/70 text-xs mt-1">Stage progress</p>
      </div>

      {/* Current step card */}
      {tab === 'journey' && activeStep && (
        <div className="mx-4 mt-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-5">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeStyle?.badge}`}>{typeStyle?.icon} {typeStyle?.label}</span>
              <span className="text-xs text-gray-400 ml-auto">⏱ {activeStep.estimatedMinutes} min</span>
            </div>
            <h3 className="font-black text-gray-900 text-lg mb-1">{activeStep.stepName}</h3>
            <p className="text-gray-500 text-sm mb-4">{activeStage?.stageName}</p>
            <button onClick={() => setShowStep(true)} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl flex items-center justify-center gap-2 transition-colors">
              <Play size={16}/> Start This Step
            </button>
          </div>
        </div>
      )}

      {/* Tab content */}
      <div className="flex-1 mt-4">
        {tab === 'journey' && (
          <div className="mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <CoachRoadmap journey={journey} profile={profile}
              onSelectStep={(step, stage) => { setActiveStep(step); setActiveStage(stage); setShowStep(true); }}
              activeStepId={activeStep?.stepId}/>
          </div>
        )}
        {tab === 'chat' && (
          <div className="mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden" style={{ height: '65vh' }}>
            <CoachChat profile={profile} currentStep={activeStep}/>
          </div>
        )}
        {tab === 'achievements' && (
          <div className="mx-4 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-y-auto">
            <CoachAchievements profile={profile}/>
          </div>
        )}
      </div>

      {/* Bottom tabs */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex">
        {[
          { id: 'journey', icon: Map, label: 'Journey' },
          { id: 'chat', icon: MessageSquare, label: 'Chat' },
          { id: 'achievements', icon: Trophy, label: 'Awards' },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs font-semibold transition-colors ${tab === t.id ? 'text-orange-500' : 'text-gray-400'}`}>
            <t.icon size={20}/>
            {t.label}
          </button>
        ))}
      </div>
    </div>
  );
}