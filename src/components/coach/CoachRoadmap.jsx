import { CheckCircle, Circle, ChevronDown, ChevronRight, Lock } from "lucide-react";
import { useState } from "react";
import { JOURNEY_META, STEP_TYPE_STYLES } from "@/lib/coachJourneyData";

export default function CoachRoadmap({ journey, profile, onSelectStep, activeStepId }) {
  const [expandedStages, setExpandedStages] = useState(() => {
    const set = new Set();
    if (profile?.currentStageId) set.add(profile.currentStageId);
    // Also expand the first stage if no current stage set
    if (!profile?.currentStageId && journey?.stages?.[0]) set.add(journey.stages[0].stageId);
    return set;
  });

  if (!journey || !profile) return (
    <div className="p-4 text-center text-gray-400 text-sm">Loading your roadmap...</div>
  );

  const completedStages = profile.completedStageIds || [];
  const completedSteps = profile.completedStepIds || [];
  const meta = JOURNEY_META[profile.journeyType] || {};

  const toggleStage = (stageId) => {
    setExpandedStages(prev => {
      const next = new Set(prev);
      if (next.has(stageId)) next.delete(stageId); else next.add(stageId);
      return next;
    });
  };

  const getStageStatus = (stage, idx) => {
    if (completedStages.includes(stage.stageId)) return 'completed';
    if (stage.stageId === profile.currentStageId) return 'active';
    // Unlock next stage after current
    const currentIdx = journey?.stages?.findIndex(s => s.stageId === profile.currentStageId) ?? 0;
    if (idx <= currentIdx + 1) return 'available';
    return 'locked';
  };

  const getStepStatus = (step, stage) => {
    if (completedSteps.includes(step.stepId)) return 'completed';
    if (step.stepId === profile.currentStepId) return 'active';
    const stageStatus = getStageStatus(stage, journey?.stages?.findIndex(s => s.stageId === stage.stageId));
    if (stageStatus === 'completed' || stageStatus === 'active' || stageStatus === 'available') return 'available';
    return 'locked';
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">{meta.icon}</span>
          <div>
            <p className="font-black text-gray-900 text-sm leading-tight">{meta.name}</p>
            <p className="text-xs text-gray-400">{meta.weeks} weeks estimated</p>
          </div>
        </div>

        {/* Progress ring area */}
        <div className="flex items-center gap-4 mb-3">
          <div className="relative w-16 h-16 flex-shrink-0">
            <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#e5e7eb" strokeWidth="6"/>
              <circle cx="32" cy="32" r="28" fill="none" stroke="#14b8a6" strokeWidth="6"
                strokeDasharray={`${2 * Math.PI * 28 * (profile.overallProgress / 100)} ${2 * Math.PI * 28}`}
                strokeLinecap="round"/>
            </svg>
            <span className="absolute inset-0 flex items-center justify-center font-black text-teal-600 text-sm">
              {profile.overallProgress}%
            </span>
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-gray-900">
              Stage {journey.stages?.findIndex(s => s.stageId === profile.currentStageId) + 1 || 1} of {journey.stages?.length}
            </p>
            <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
              <div className="bg-teal-500 h-1.5 rounded-full transition-all" style={{ width: `${profile.overallProgress}%` }} />
            </div>
          </div>
        </div>
      </div>

      {/* Stage list */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        {journey.stages?.map((stage, idx) => {
          const status = getStageStatus(stage, idx);
          const isExpanded = expandedStages.has(stage.stageId);
          const stepsInStage = stage.steps || [];
          const completedInStage = stepsInStage.filter(s => completedSteps.includes(s.stepId)).length;

          return (
            <div key={stage.stageId}>
              <button onClick={() => status !== 'locked' && toggleStage(stage.stageId)}
                className={`w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-left transition-all ${
                  status === 'completed' ? 'bg-green-50 text-green-700' :
                  status === 'active' ? 'bg-orange-50 text-orange-700' :
                  status === 'available' ? 'hover:bg-gray-50 text-gray-600' :
                  'text-gray-300 cursor-not-allowed'
                }`}>
                <span className="text-lg flex-shrink-0">{stage.stageIcon}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-xs font-black truncate ${status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>
                    {idx + 1}. {stage.stageName}
                  </p>
                  {status === 'completed' && <p className="text-[10px] text-green-600">✅ Complete</p>}
                  {status === 'active' && <p className="text-[10px] text-orange-500">{completedInStage}/{stepsInStage.length} steps</p>}
                  {status === 'available' && <p className="text-[10px] text-gray-400">{stepsInStage.length} steps</p>}
                  {status === 'locked' && <p className="text-[10px] text-gray-300">🔒 Locked</p>}
                </div>
                {status !== 'locked' && (isExpanded ? <ChevronDown size={14}/> : <ChevronRight size={14}/>)}
              </button>

              {isExpanded && (status === 'active' || status === 'completed' || status === 'available') && (
                <div className="ml-4 pl-3 border-l-2 border-gray-100 mt-1 space-y-1 pb-1">
                  {stepsInStage.map(step => {
                    const stepStatus = getStepStatus(step, stage);
                    const isActive = step.stepId === activeStepId;
                    const typeStyle = STEP_TYPE_STYLES[step.stepType] || STEP_TYPE_STYLES.article;
                    return (
                      <button key={step.stepId}
                        onClick={() => stepStatus !== 'locked' && onSelectStep(step, stage)}
                        disabled={stepStatus === 'locked'}
                        className={`w-full flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-all ${
                          isActive ? 'bg-orange-100 border border-orange-300' :
                          stepStatus === 'completed' ? 'opacity-70 hover:opacity-100' :
                          stepStatus === 'locked' ? 'opacity-30 cursor-not-allowed' :
                          'hover:bg-gray-50 cursor-pointer'
                        }`}>
                        <span className="text-xs flex-shrink-0">
                          {stepStatus === 'completed' ? '✅' :
                           stepStatus === 'active' ? '🔄' :
                           stepStatus === 'locked' ? '🔒' : typeStyle.icon}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className={`text-[11px] font-semibold truncate ${
                            stepStatus === 'completed' ? 'text-gray-400 line-through' :
                            isActive ? 'text-orange-700 font-black' : 'text-gray-700'
                          }`}>{step.stepName}</p>
                          <p className="text-[10px] text-gray-400">
                            {stepStatus === 'active' ? '● In progress' :
                             stepStatus === 'available' ? `~${step.estimatedMinutes} min` :
                             stepStatus === 'completed' ? 'Done' : 'Locked'}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}