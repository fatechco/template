import { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import CoachOnboarding from "@/components/coach/CoachOnboarding";
import CoachRoadmap from "@/components/coach/CoachRoadmap";
import CoachStepContent from "@/components/coach/CoachStepContent";
import CoachChat from "@/components/coach/CoachChat";
import CoachAchievements from "@/components/coach/CoachAchievements";
import { MessageSquare, Map, Trophy, Star } from "lucide-react";
import { JOURNEY_META } from "@/lib/coachJourneyData";
import { Link } from "react-router-dom";

const NEXT_JOURNEY_SUGGESTIONS = {
  first_time_buyer: { type: 'investor', title: 'Start Your Investor Journey', desc: 'You own property — now make it work for you', emoji: '💰' },
  first_time_renter: { type: 'first_time_buyer', title: 'Buy Your First Home', desc: "Ready to own? Let's make it happen", emoji: '🏠' },
  investor: { type: 'property_seller', title: 'Master the Selling Side', desc: 'Learn to sell at peak market timing', emoji: '🏡' },
  property_seller: { type: 'investor', title: 'Reinvest Your Profits', desc: 'Turn your sale into an investment portfolio', emoji: '💰' },
  expat_buyer: { type: 'investor', title: 'Build Your Portfolio', desc: 'Expand beyond your first Egypt property', emoji: '💰' },
  property_upgrader: { type: 'investor', title: 'Invest the Difference', desc: 'Put your equity to work', emoji: '💰' },
};

function JourneyCompleteScreen({ profile, onStartNext }) {
  const meta = JOURNEY_META[profile.journeyType] || {};
  const next = NEXT_JOURNEY_SUGGESTIONS[profile.journeyType];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-500 via-orange-400 to-yellow-400 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="text-8xl mb-4">🏆</div>
        <h1 className="text-3xl font-black text-gray-900 mb-2">Journey Complete!</h1>
        <p className="text-gray-500 mb-6">You've completed the <span className="font-black text-orange-600">{meta.name}</span></p>

        <div className="bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl p-6 mb-6 border border-orange-100">
          <div className="text-5xl mb-2">🎓</div>
          <p className="font-black text-gray-900 text-lg">Kemedar Coach™ Certificate</p>
          <p className="text-gray-500 text-sm mt-1">Awarded to</p>
          <p className="font-black text-orange-600 text-xl mt-1">{profile.userId}</p>
          <div className="flex items-center justify-center gap-2 mt-3">
            {[1,2,3,4,5].map(i => <Star key={i} size={18} className="fill-yellow-400 text-yellow-400"/>)}
          </div>
        </div>

        <div className="bg-gray-50 rounded-xl p-4 mb-4 text-left">
          <p className="text-xs font-bold text-gray-400 uppercase mb-2">Your Achievement Stats</p>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center"><p className="font-black text-teal-600 text-lg">{profile.completedStepIds?.length || 0}</p><p className="text-xs text-gray-400">Steps Done</p></div>
            <div className="text-center"><p className="font-black text-orange-600 text-lg">{profile.streakDays || 0}🔥</p><p className="text-xs text-gray-400">Day Streak</p></div>
            <div className="text-center"><p className="font-black text-purple-600 text-lg">100%</p><p className="text-xs text-gray-400">Complete</p></div>
          </div>
        </div>

        {next && (
          <div className="mb-4">
            <p className="text-sm font-bold text-gray-600 mb-2">Ready for your next challenge?</p>
            <button onClick={() => onStartNext(next.type)}
              className="w-full flex items-center gap-3 p-4 bg-orange-50 border-2 border-orange-200 rounded-2xl hover:border-orange-400 transition-all text-left">
              <span className="text-3xl">{next.emoji}</span>
              <div>
                <p className="font-black text-gray-900 text-sm">{next.title}</p>
                <p className="text-xs text-gray-500">{next.desc}</p>
              </div>
            </button>
          </div>
        )}

        <Link to="/dashboard" className="block w-full text-center border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:border-gray-300 transition-colors text-sm">
          Return to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default function KemedarCoach() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [journey, setJourney] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStep, setActiveStep] = useState(null);
  const [activeStage, setActiveStage] = useState(null);
  const [showChat, setShowChat] = useState(false);
  const [rightTab, setRightTab] = useState('step'); // step | chat | achievements
  const [showJourneyComplete, setShowJourneyComplete] = useState(false);

  useEffect(() => { init(); }, []);

  const init = async () => {
    const u = await base44.auth.me().catch(() => null);
    setUser(u);
    if (u) {
      const profiles = await base44.entities.CoachProfile.filter({ userId: u.id });
      if (profiles.length > 0) {
        const p = profiles[0];
        setProfile(p);
        await loadJourney(p);
      }
    }
    setLoading(false);
  };

  const loadJourney = async (p) => {
    const journeys = await base44.entities.CoachJourney.filter({ journeyType: p.journeyType });
    if (journeys.length > 0) {
      const j = journeys[0];
      setJourney(j);

      let resolvedStage = null;
      let resolvedStep = null;

      if (p.currentStageId && p.currentStepId) {
        resolvedStage = j.stages?.find(s => s.stageId === p.currentStageId);
        resolvedStep = resolvedStage?.steps?.find(s => s.stepId === p.currentStepId);
      }

      // Fallback: start from first stage/step
      if (!resolvedStage && j.stages?.length > 0) {
        resolvedStage = j.stages[0];
        resolvedStep = resolvedStage.steps?.[0];
        // Initialize profile with first stage/step
        if (!p.currentStageId && resolvedStage && resolvedStep) {
          await base44.entities.CoachProfile.update(p.id, {
            currentStageId: resolvedStage.stageId, currentStepId: resolvedStep.stepId
          });
        }
      }

      if (resolvedStep && resolvedStage) { setActiveStep(resolvedStep); setActiveStage(resolvedStage); }
    }
  };

  const handleOnboardingComplete = async (newProfile) => {
    if (!newProfile) { setProfile(null); setLoading(false); return; }
    setProfile(newProfile);
    await loadJourney(newProfile);
  };

  const handleStepSelect = (step, stage) => {
    setActiveStep(step);
    setActiveStage(stage);
    setRightTab('step');
    if (profile) {
      const today = new Date().toISOString().split('T')[0];
      // Only advance current position if moving to a later step
      const isAlreadyCompleted = profile.completedStepIds?.includes(step.stepId);
      if (!isAlreadyCompleted) {
        base44.entities.CoachProfile.update(profile.id, {
          currentStageId: stage.stageId, currentStepId: step.stepId,
          lastActiveDate: today, lastCoachInteractionAt: new Date().toISOString()
        });
        setProfile(p => ({ ...p, currentStageId: stage.stageId, currentStepId: step.stepId }));
      }
    }
  };

  const handleStepComplete = async () => {
    if (!profile || !activeStep || !activeStage) return;
    const newCompleted = [...(profile.completedStepIds || [])];
    if (!newCompleted.includes(activeStep.stepId)) newCompleted.push(activeStep.stepId);

    // Check if all steps in stage are done
    const stepsInStage = activeStage.steps || [];
    const allStepsDone = stepsInStage.every(s => newCompleted.includes(s.stepId));

    const newCompletedStages = [...(profile.completedStageIds || [])];
    if (allStepsDone && !newCompletedStages.includes(activeStage.stageId)) {
      newCompletedStages.push(activeStage.stageId);
      await base44.entities.CoachAchievement.create({
        coachProfileId: profile.id, userId: profile.userId,
        achievementType: 'stage_complete', achievementName: 'Stage Complete',
        achievementNameAr: 'مرحلة مكتملة', achievementIcon: '🎯',
        description: `Completed stage: ${activeStage.stageName}`,
        pointsEarned: 200, earnedAt: new Date().toISOString()
      });
    }

    // Calculate overall progress
    const totalSteps = journey?.stages?.reduce((s, stage) => s + (stage.steps?.length || 0), 0) || 1;
    const overallProgress = Math.round((newCompleted.length / totalSteps) * 100);

    // Update streak
    const today = new Date().toISOString().split('T')[0];
    const lastActive = profile.lastActiveDate;
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = lastActive === yesterday ? (profile.streakDays || 0) + 1 : lastActive === today ? profile.streakDays : 1;

    // Determine next step to auto-navigate to
    const stepsInCurrentStage = activeStage.steps || [];
    const currentIdx = stepsInCurrentStage.findIndex(s => s.stepId === activeStep.stepId);
    let nextStageId = profile.currentStageId;
    let nextStepId = profile.currentStepId;

    if (currentIdx + 1 < stepsInCurrentStage.length) {
      nextStepId = stepsInCurrentStage[currentIdx + 1].stepId;
    } else {
      const stageIdx = journey?.stages?.findIndex(s => s.stageId === activeStage.stageId);
      if (stageIdx + 1 < (journey?.stages?.length || 0)) {
        const nextStage = journey.stages[stageIdx + 1];
        nextStageId = nextStage.stageId;
        nextStepId = nextStage.steps?.[0]?.stepId || '';
      }
    }

    // Check journey complete
    const journeyComplete = overallProgress >= 100;
    const updateData = {
      completedStepIds: newCompleted, completedStageIds: newCompletedStages, overallProgress,
      currentStageId: nextStageId, currentStepId: nextStepId,
      streakDays: newStreak, lastActiveDate: today,
      lastCoachInteractionAt: new Date().toISOString(),
      coachStatus: journeyComplete ? 'completed' : 'active',
      completedAt: journeyComplete ? new Date().toISOString() : undefined,
    };

    await base44.entities.CoachProfile.update(profile.id, updateData);
    const updatedProfile = { ...profile, ...updateData };
    setProfile(updatedProfile);

    if (journeyComplete) { setShowJourneyComplete(true); return; }

    // Navigate to next step
    if (currentIdx + 1 < stepsInCurrentStage.length) {
      setActiveStep(stepsInCurrentStage[currentIdx + 1]);
    } else {
      const stageIdx = journey?.stages?.findIndex(s => s.stageId === activeStage.stageId);
      if (stageIdx + 1 < (journey?.stages?.length || 0)) {
        const nextStage = journey.stages[stageIdx + 1];
        const nextStep = nextStage.steps?.[0];
        if (nextStep) { setActiveStep(nextStep); setActiveStage(nextStage); }
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <SiteHeader />
        <div className="flex-1 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-teal-500 border-t-transparent rounded-full animate-spin"/>
        </div>
      </div>
    );
  }

  const handleStartNextJourney = async (nextType) => {
    // Delete old profile and restart
    await base44.entities.CoachProfile.update(profile.id, { coachStatus: 'completed' });
    setProfile(null);
    setJourney(null);
    setShowJourneyComplete(false);
  };

  if (!profile) {
    return <CoachOnboarding onComplete={handleOnboardingComplete} />;
  }

  if (showJourneyComplete) {
    return <JourneyCompleteScreen profile={profile} onStartNext={handleStartNextJourney} />;
  }

  const meta = JOURNEY_META[profile.journeyType] || {};

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      <div className="flex-1 flex overflow-hidden" style={{ height: 'calc(100vh - 120px)' }}>
        {/* Left: Roadmap */}
        <div className="w-80 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col overflow-hidden">
          <CoachRoadmap journey={journey} profile={profile} onSelectStep={handleStepSelect} activeStepId={activeStep?.stepId} />
        </div>

        {/* Right: Content + Chat */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-gray-200 bg-white flex-shrink-0">
            {[
              { id: 'step', icon: <Map size={15}/>, label: 'Current Step' },
              { id: 'chat', icon: <MessageSquare size={15}/>, label: 'Coach Chat' },
              { id: 'achievements', icon: <Trophy size={15}/>, label: 'Achievements' },
            ].map(tab => (
              <button key={tab.id} onClick={() => setRightTab(tab.id)}
                className={`flex items-center gap-2 px-5 py-3 text-sm font-semibold border-b-2 transition-colors ${
                  rightTab === tab.id ? 'border-orange-500 text-orange-600' : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}>
                {tab.icon} {tab.label}
              </button>
            ))}
            {/* Journey badge + streak */}
            <div className="ml-auto flex items-center gap-2 px-4">
              {profile.streakDays > 0 && (
                <span className="text-xs bg-orange-100 text-orange-600 font-black px-2 py-0.5 rounded-full">🔥 {profile.streakDays}d</span>
              )}
              <span className="text-lg">{meta.icon}</span>
              <span className="text-xs font-bold text-gray-500 hidden sm:inline">{meta.name}</span>
              <span className="bg-teal-100 text-teal-700 text-xs font-black px-2 py-0.5 rounded-full">{profile.overallProgress}%</span>
            </div>
          </div>

          {/* Content area */}
          <div className="flex-1 overflow-hidden">
            {rightTab === 'step' && activeStep && (
              <CoachStepContent step={activeStep} stage={activeStage} journey={journey} profile={profile}
                content={null} onComplete={handleStepComplete} onAskCoach={() => setRightTab('chat')} />
            )}
            {rightTab === 'step' && !activeStep && (
              <div className="h-full flex items-center justify-center text-gray-400">
                <div className="text-center max-w-sm px-6">
                  <p className="text-5xl mb-4">🗺️</p>
                  <p className="font-black text-gray-700 text-lg mb-2">Your Journey Awaits</p>
                  {!journey ? (
                    <>
                      <p className="text-sm text-gray-400 mb-4">Journey content is being prepared. Seed the journeys first.</p>
                      <button onClick={() => base44.functions.invoke('seedCoachJourneys', {}).then(() => init())}
                        className="bg-teal-500 text-white font-bold px-4 py-2 rounded-xl text-sm hover:bg-teal-600">
                        🌱 Load Journey Content
                      </button>
                    </>
                  ) : (
                    <p className="text-sm text-gray-400">Select any step from the roadmap on the left to begin.</p>
                  )}
                </div>
              </div>
            )}
            {rightTab === 'chat' && <CoachChat profile={profile} currentStep={activeStep} />}
            {rightTab === 'achievements' && (
              <div className="overflow-y-auto h-full">
                <CoachAchievements profile={profile} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}