import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { INLINE_CONTENT, STEP_TYPE_STYLES } from "@/lib/coachJourneyData";
import ReactMarkdown from "react-markdown";

function ChecklistStep({ step, content, profile, onComplete }) {
  const inlineData = INLINE_CONTENT[step.contentKey];
  const items = (content?.checklistItems || inlineData?.checklistItems || []);
  const [checked, setChecked] = useState({});

  const requiredItems = items.filter(i => i.isRequired);
  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allRequiredDone = requiredItems.every(i => checked[i.itemId]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500 font-semibold">{checkedCount} / {items.length} completed</p>
        <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2">
          <div className="bg-teal-500 h-2 rounded-full transition-all" style={{ width: `${items.length ? (checkedCount/items.length)*100 : 0}%` }}/>
        </div>
      </div>
      <div className="space-y-2 mb-6">
        {items.map(item => (
          <button key={item.itemId} onClick={() => setChecked(c => ({...c, [item.itemId]: !c[item.itemId]}))}
            className={`w-full flex items-start gap-3 p-3 rounded-xl border-2 text-left transition-all ${checked[item.itemId] ? 'border-teal-300 bg-teal-50' : 'border-gray-100 hover:border-gray-300'}`}>
            <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${checked[item.itemId] ? 'bg-teal-500 border-teal-500 text-white' : 'border-gray-300'}`}>
              {checked[item.itemId] && <span className="text-xs">✓</span>}
            </div>
            <div className="flex-1">
              <p className={`text-sm font-semibold ${checked[item.itemId] ? 'line-through text-gray-400' : 'text-gray-800'}`}>{item.text}</p>
              {item.helpText && <p className="text-xs text-gray-400 mt-0.5">{item.helpText}</p>}
            </div>
            {item.isRequired && <span className="text-[10px] bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-full flex-shrink-0">Required</span>}
          </button>
        ))}
      </div>
      {allRequiredDone && (
        <button onClick={onComplete} className="w-full bg-teal-500 hover:bg-teal-600 text-white font-black py-3 rounded-xl transition-colors">
          ✅ Checklist Complete — Next Step →
        </button>
      )}
      {!allRequiredDone && checkedCount > 0 && (
        <p className="text-center text-sm text-gray-400">{requiredItems.length - requiredItems.filter(i => checked[i.itemId]).length} required items remaining</p>
      )}
    </div>
  );
}

function QuizStep({ step, content, onComplete }) {
  const questions = content?.quizQuestions || [
    { questionId: 'q1', question: 'What is a title deed (عقد تمليك)?', options: [
      { id: 'a', text: 'A receipt from the developer', isCorrect: false },
      { id: 'b', text: 'The official document proving property ownership', isCorrect: true },
      { id: 'c', text: 'A building permit', isCorrect: false },
      { id: 'd', text: 'A rental agreement', isCorrect: false },
    ], explanation: 'A title deed (Aqd Tamleeq) is the official document from the Real Estate Registry that proves you legally own the property.' },
    { questionId: 'q2', question: 'Approximately how much are registration fees in Egypt?', options: [
      { id: 'a', text: '0.5% of property value', isCorrect: false },
      { id: 'b', text: '2.5% of property value', isCorrect: true },
      { id: 'c', text: '5% of property value', isCorrect: false },
      { id: 'd', text: '10% of property value', isCorrect: false },
    ], explanation: 'Registration fees in Egypt are approximately 2.5% of the property value. This is paid to the Real Estate Registry when transferring ownership.' },
  ];

  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState([]);
  const [finished, setFinished] = useState(false);

  const q = questions[current];
  const score = answered.filter(a => a.correct).length;

  const handleAnswer = (option) => {
    if (selected) return;
    setSelected(option);
    setAnswered(prev => [...prev, { questionId: q.questionId, correct: option.isCorrect }]);
  };

  const next = () => {
    if (current + 1 >= questions.length) { setFinished(true); } else {
      setCurrent(c => c + 1); setSelected(null);
    }
  };

  if (finished) return (
    <div className="text-center py-8">
      <div className="text-6xl mb-4">{score === questions.length ? '🎉' : '📚'}</div>
      <h3 className="text-2xl font-black text-gray-900 mb-2">{score} / {questions.length} correct!</h3>
      <p className="text-gray-500 mb-6">{score === questions.length ? 'Perfect score! 🌟' : 'Good effort — keep learning!'}</p>
      <button onClick={onComplete} className="bg-orange-500 hover:bg-orange-600 text-white font-black px-8 py-3 rounded-xl">
        Continue →
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex gap-1 mb-6">
        {questions.map((_, i) => <div key={i} className={`flex-1 h-2 rounded-full ${i < current ? 'bg-teal-500' : i === current ? 'bg-orange-500' : 'bg-gray-200'}`}/>)}
      </div>
      <p className="text-xs text-gray-400 mb-2">Question {current + 1} of {questions.length}</p>
      <h3 className="text-lg font-black text-gray-900 mb-5">{q.question}</h3>
      <div className="space-y-3 mb-4">
        {q.options.map(opt => (
          <button key={opt.id} onClick={() => handleAnswer(opt)}
            className={`w-full p-4 rounded-xl border-2 text-left font-semibold text-sm transition-all ${
              !selected ? 'border-gray-200 hover:border-orange-300 hover:bg-orange-50' :
              opt.isCorrect ? 'border-green-500 bg-green-50 text-green-800' :
              selected?.id === opt.id && !opt.isCorrect ? 'border-red-400 bg-red-50 text-red-700' :
              'border-gray-100 text-gray-400'
            }`}>
            {opt.text}
            {selected && opt.isCorrect && <span className="ml-2">✅</span>}
            {selected?.id === opt.id && !opt.isCorrect && <span className="ml-2">❌</span>}
          </button>
        ))}
      </div>
      {selected && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-4">
          <p className="text-sm text-blue-800">{q.explanation}</p>
        </div>
      )}
      {selected && (
        <button onClick={next} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl">
          {current + 1 >= questions.length ? 'See Results →' : 'Next Question →'}
        </button>
      )}
    </div>
  );
}

function ArticleStep({ step, content, onComplete }) {
  const body = content?.body || `## ${step.stepName}\n\nThis step provides important information about the property buying process. Your coach will guide you through all the key concepts you need to know before proceeding.\n\n### Key Points\n\n- Understanding the process reduces anxiety\n- Each step builds on the previous one\n- Your coach is here to answer questions at any time\n\n### Why This Matters\n\nKnowledge is your best protection when making one of the biggest financial decisions of your life.`;

  return (
    <div>
      <div className="prose prose-sm max-w-none mb-6">
        <ReactMarkdown>{body}</ReactMarkdown>
      </div>
      {content?.tips?.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 mb-4">
          <p className="font-black text-orange-700 text-sm mb-2">💡 Key Tips:</p>
          <ul className="space-y-1">
            {content.tips.map((tip, i) => <li key={i} className="text-sm text-orange-800 flex gap-2"><span>•</span>{tip}</li>)}
          </ul>
        </div>
      )}
      {content?.warnings?.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4">
          <p className="font-black text-red-700 text-sm mb-2">⚠️ Watch Out For:</p>
          <ul className="space-y-1">
            {content.warnings.map((w, i) => <li key={i} className="text-sm text-red-800 flex gap-2"><span>•</span>{w}</li>)}
          </ul>
        </div>
      )}
      <button onClick={onComplete} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-3 rounded-xl">
        ✅ Got It — Next Step →
      </button>
    </div>
  );
}

function ToolStep({ step, onComplete }) {
  const TOOL_CONTENT = {
    ftb_affordability_calc: { why: "Understanding your budget before searching prevents heartbreak later. Knowing your range also gives you leverage in negotiations.", cta: "Open Advisor™ Budget Tool", url: "/kemedar/advisor", instructions: ["Click the button below to open the Advisor tool", "Enter your monthly income and available down payment", "Review your realistic budget range", "Note the recommended areas within your budget", "Come back here when done"] },
    ftb_match_tool: { why: "Match™ learns your taste faster than searching. After 10 swipes, it starts predicting what you'll like — saving hours of scrolling.", cta: "Open Kemedar Match™", url: "/kemedar/match", instructions: ["Click below to open Kemedar Match™", "Swipe right on properties you like, left on those you don't", "Super-like properties you love", "Complete at least 10 swipes", "Come back when done"] },
    ftb_investment_brief: { why: "Understanding a property's value before making an offer could save you 10-20% on the purchase price. Negotiation is much easier with data.", cta: "Open Valuation Tool", url: "/kemedar/valuation", instructions: ["Click below to open the Valuation tool", "Enter the property details you're evaluating", "Review the AI price analysis", "Pay attention to the 'Price vs Market' section", "Note the suggested price range for negotiation"] },
    ftb_negotiate_tool: { why: "Properties in Egypt are typically listed 10-20% above what sellers will accept. A data-driven strategy gets you a better deal every time.", cta: "Open Kemedar Negotiate™", url: "/kemedar/negotiate", instructions: ["Click below to open Negotiate™", "Select the property you want to negotiate on", "Review the AI strategy recommendations", "Follow the guided offer preparation", "Come back when your strategy is ready"] },
    ftb_escrow_setup: { why: "Escrow protects your deposit if the deal falls through for legal reasons. Without it, you may lose your earnest money.", cta: "Set Up Escrow™", url: "/kemedar/escrow/new", instructions: ["Click below to open Kemedar Escrow™", "Enter the deal details (property + parties)", "Choose your milestone structure", "Invite the seller to join", "Your deposit is now protected"] },
    ftb_finishing: { why: "Planning your finishing early means materials arrive on time and professionals are scheduled — avoiding the chaos most buyers face.", cta: "Open Kemedar Finish™", url: "/kemedar/finish", instructions: ["Click below to open Kemedar Finish™", "Describe your finishing vision", "Get an instant BOQ (Bill of Quantities)", "Order materials directly from Kemetro™", "Professionals will be matched automatically"] },
  };
  const tool = TOOL_CONTENT[step.contentKey] || { why: "This tool will help you complete this important step in your journey.", cta: "Open Tool", url: step.platformLink || '/kemedar', instructions: ["Click the button below to open the tool", "Complete the required action", "Come back here when done"] };

  return (
    <div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-5">
        <p className="font-black text-blue-800 text-sm mb-1">💡 Why This Matters:</p>
        <p className="text-blue-700 text-sm">{tool.why}</p>
      </div>
      <div className="mb-5">
        <p className="font-black text-gray-900 text-sm mb-3">How to do it:</p>
        <ol className="space-y-2">
          {tool.instructions.map((inst, i) => (
            <li key={i} className="flex gap-3 text-sm text-gray-700">
              <span className="w-5 h-5 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-black text-xs flex-shrink-0 mt-0.5">{i+1}</span>
              {inst}
            </li>
          ))}
        </ol>
      </div>
      <a href={tool.url} target="_blank" rel="noreferrer"
        className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-xl text-center text-lg transition-colors mb-3">
        🛠️ {tool.cta} →
      </a>
      <button onClick={onComplete} className="w-full border-2 border-gray-200 text-gray-600 font-bold py-3 rounded-xl hover:border-teal-400 hover:text-teal-600 transition-colors">
        ✅ I've Completed This Step
      </button>
    </div>
  );
}

function CelebrationStep({ stage, journey, onComplete }) {
  const milestone = journey?.milestones?.find(m => m.milestoneAfterStage === stage?.stageId);
  return (
    <div className="text-center py-6">
      <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ repeat: 3, duration: 0.6 }}
        className="text-8xl mb-6">{milestone?.milestoneIcon || '🎉'}</motion.div>
      <h2 className="text-3xl font-black text-gray-900 mb-3">{milestone?.milestoneName || 'Stage Complete!'}</h2>
      <p className="text-gray-600 text-base mb-6 max-w-sm mx-auto">{milestone?.celebrationMessage || "Congratulations on completing this stage!"}</p>
      <div className="bg-gradient-to-br from-orange-50 to-teal-50 rounded-2xl p-6 mb-6 border border-orange-100">
        <p className="font-black text-orange-600 text-lg">+200 Coach Points Earned! 🌟</p>
        <p className="text-gray-500 text-sm">Stage milestone achieved</p>
      </div>
      <button onClick={onComplete} className="bg-orange-500 hover:bg-orange-600 text-white font-black px-10 py-4 rounded-2xl text-lg transition-colors">
        Continue My Journey →
      </button>
    </div>
  );
}

export default function CoachStepContent({ step, stage, journey, profile, content, onComplete, onAskCoach }) {
  const [personalizedData, setPersonalizedData] = useState(null);
  const [loadingPersonalized, setLoadingPersonalized] = useState(false);
  const typeStyle = STEP_TYPE_STYLES[step.stepType] || STEP_TYPE_STYLES.article;

  useEffect(() => {
    if (profile?.id && step) {
      setLoadingPersonalized(true);
      base44.functions.invoke('generatePersonalizedStep', { coachProfileId: profile.id, stepData: step })
        .then(r => setPersonalizedData(r.data))
        .catch(() => {})
        .finally(() => setLoadingPersonalized(false));
    }
  }, [step?.stepId, profile?.id]);

  return (
    <div className="flex flex-col h-full">
      {/* Step header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2 mb-1">
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${typeStyle.badge}`}>{typeStyle.icon} {typeStyle.label}</span>
          {step.isRequired && <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-red-100 text-red-600">Required</span>}
          <span className="text-xs text-gray-400 ml-auto">⏱ {step.estimatedMinutes} min</span>
        </div>
        <h2 className="text-xl font-black text-gray-900 mt-2">{step.stepName}</h2>
        {personalizedData?.personalizedIntro && (
          <p className="text-gray-500 text-sm mt-1">{personalizedData.personalizedIntro}</p>
        )}
      </div>

      {/* Personalized coach tip */}
      {personalizedData?.coachTip && (
        <div className="mx-6 mt-4 bg-purple-50 border border-purple-100 rounded-xl p-3 flex gap-2">
          <span className="text-purple-500 flex-shrink-0">🤖</span>
          <div>
            <p className="text-xs font-black text-purple-700 mb-0.5">Coach Tip:</p>
            <p className="text-xs text-purple-700">{personalizedData.coachTip}</p>
          </div>
        </div>
      )}

      {/* Step content */}
      <div className="flex-1 overflow-y-auto p-6">
        {step.stepType === 'checklist' && <ChecklistStep step={step} content={content} profile={profile} onComplete={onComplete}/>}
        {step.stepType === 'quiz' && <QuizStep step={step} content={content} onComplete={onComplete}/>}
        {step.stepType === 'article' && <ArticleStep step={step} content={content} onComplete={onComplete}/>}
        {step.stepType === 'tool_use' && <ToolStep step={step} onComplete={onComplete}/>}
        {step.stepType === 'action' && <ToolStep step={step} onComplete={onComplete}/>}
        {step.stepType === 'celebration' && <CelebrationStep stage={stage} journey={journey} onComplete={onComplete}/>}
        {step.stepType === 'warning' && <ArticleStep step={step} content={content} onComplete={onComplete}/>}
        {step.stepType === 'decision' && <ArticleStep step={step} content={content} onComplete={onComplete}/>}
      </div>

      {/* Ask coach */}
      <div className="p-4 border-t border-gray-100 bg-gray-50">
        <button onClick={onAskCoach} className="w-full flex items-center justify-center gap-2 text-sm text-teal-600 font-bold hover:underline">
          💬 Have questions? Ask Your Coach
        </button>
      </div>
    </div>
  );
}