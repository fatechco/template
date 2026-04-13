import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { base44 } from "@/api/base44Client";
import { JOURNEY_META } from "@/lib/coachJourneyData";

const JOURNEY_OPTIONS = [
  { type: 'first_time_buyer', emoji: '🏠', title: 'Buy my first home', desc: 'Guide me from zero to keys' },
  { type: 'property_upgrader', emoji: '🔄', title: 'Upgrade my property', desc: "I own but want something bigger" },
  { type: 'investor', emoji: '💰', title: 'Invest in real estate', desc: 'Build wealth through property' },
  { type: 'first_time_renter', emoji: '🔑', title: "I'm looking to rent", desc: 'Find and secure the right rental' },
  { type: 'property_seller', emoji: '🏡', title: 'Sell my property', desc: 'Get the best price for my property' },
  { type: 'expat_buyer', emoji: '🌍', title: "I'm an expat buying in Egypt", desc: 'Buy remotely with local support' },
];

const EXPERIENCE_OPTIONS = [
  { value: 'complete_beginner', emoji: '😊', title: 'Brand New', desc: 'Never bought/rented before. Start from scratch.' },
  { value: 'some_experience', emoji: '🤔', title: 'Some Experience', desc: "I've done some research but need guidance" },
  { value: 'experienced', emoji: '😎', title: 'Experienced', desc: 'I know the basics — just need help on specific steps' },
];

const URGENCY_OPTIONS = [
  { value: 'asap', emoji: '⚡', title: "ASAP — I'm ready now!" },
  { value: '3_months', emoji: '🗓', title: 'In 1–3 months' },
  { value: '6_months', emoji: '📅', title: 'In 3–6 months' },
  { value: 'just_learning', emoji: '🔍', title: 'Just exploring for now' },
];

const LANG_OPTIONS = [
  { value: 'ar', flag: '🇸🇦', label: 'العربية' },
  { value: 'en', flag: '🇬🇧', label: 'English' },
  { value: 'fr', flag: '🇫🇷', label: 'Français' },
];

export default function CoachOnboarding({ onComplete }) {
  const [screen, setScreen] = useState('welcome'); // welcome | q1 | q2 | q3 | q4 | generating
  const [answers, setAnswers] = useState({ journeyType: '', experienceLevel: '', urgency: '', preferredLanguage: 'en' });
  const [creating, setCreating] = useState(false);

  const handleComplete = async () => {
    setScreen('generating');
    setCreating(true);
    const user = await base44.auth.me();
    const now = new Date();

    const profile = await base44.entities.CoachProfile.create({
      userId: user.id,
      journeyType: answers.journeyType,
      experienceLevel: answers.experienceLevel,
      urgency: answers.urgency,
      preferredLanguage: answers.preferredLanguage,
      currentStageId: '',
      currentStepId: '',
      completedStageIds: [],
      completedStepIds: [],
      skippedStepIds: [],
      overallProgress: 0,
      journeyStartedAt: now.toISOString(),
      streakDays: 0,
      totalCoachMessages: 0,
      coachSessionCount: 0,
      achievedMilestones: [],
      coachMemory: {},
      coachStatus: 'active',
    });

    await base44.entities.CoachAchievement.create({
      coachProfileId: profile.id,
      userId: user.id,
      achievementType: 'stage_complete',
      achievementName: 'Journey Begins',
      achievementNameAr: 'بداية الرحلة',
      achievementIcon: '🌱',
      description: 'Started a Kemedar Coach journey',
      pointsEarned: 50,
      earnedAt: now.toISOString(),
    });

    setTimeout(() => onComplete(profile), 2000);
  };

  const screenVariants = {
    initial: { opacity: 0, x: 40 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  };

  if (screen === 'generating') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-500 to-orange-500 flex items-center justify-center">
        <div className="text-center text-white">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
            className="w-24 h-24 mx-auto mb-6 border-4 border-white/30 border-t-white rounded-full" />
          <h2 className="text-3xl font-black mb-2">✨ Building Your Journey...</h2>
          <p className="text-white/80">Personalizing your roadmap</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-lg">
        <AnimatePresence mode="wait">
          {screen === 'welcome' && (
            <motion.div key="welcome" variants={screenVariants} initial="initial" animate="animate" exit="exit"
              className="bg-white rounded-3xl shadow-2xl p-8 text-center">
              <div className="w-24 h-24 bg-gradient-to-br from-teal-400 to-orange-400 rounded-full mx-auto mb-6 flex items-center justify-center text-5xl">
                🎓
              </div>
              <div className="text-2xl font-black text-gray-900 mb-1">👋 مرحباً! Welcome!</div>
              <h1 className="text-3xl font-black text-gray-900 mb-3">I'm your Kemedar Coach™</h1>
              <p className="text-gray-500 text-base mb-2">I'll guide you step by step through your property journey — from first search to getting your keys.</p>
              <p className="text-orange-500 text-sm font-semibold mb-8">Let's get you started. A few quick questions:</p>
              <button onClick={() => setScreen('q1')} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl text-lg transition-colors mb-3">
                Let's Go! →
              </button>
              <button onClick={() => onComplete(null)} className="text-gray-400 text-sm hover:text-gray-600">Skip for now</button>
            </motion.div>
          )}

          {screen === 'q1' && (
            <motion.div key="q1" variants={screenVariants} initial="initial" animate="animate" exit="exit"
              className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400 font-bold uppercase">1 of 4</p>
                <div className="flex gap-1">{[1,2,3,4].map(i => <div key={i} className={`w-8 h-1.5 rounded-full ${i === 1 ? 'bg-orange-500' : 'bg-gray-200'}`}/>)}</div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">What brings you to Kemedar?</h2>
              <div className="space-y-3">
                {JOURNEY_OPTIONS.map(opt => (
                  <button key={opt.type} onClick={() => { setAnswers(a => ({...a, journeyType: opt.type})); setScreen('q2'); }}
                    className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all hover:border-orange-400 hover:bg-orange-50 ${answers.journeyType === opt.type ? 'border-orange-500 bg-orange-50' : 'border-gray-100'}`}>
                    <span className="text-3xl">{opt.emoji}</span>
                    <div>
                      <p className="font-black text-gray-900">{opt.title}</p>
                      <p className="text-sm text-gray-500">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {screen === 'q2' && (
            <motion.div key="q2" variants={screenVariants} initial="initial" animate="animate" exit="exit"
              className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400 font-bold uppercase">2 of 4</p>
                <div className="flex gap-1">{[1,2,3,4].map(i => <div key={i} className={`w-8 h-1.5 rounded-full ${i <= 2 ? 'bg-orange-500' : 'bg-gray-200'}`}/>)}</div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">How much do you know about real estate?</h2>
              <div className="space-y-4">
                {EXPERIENCE_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setAnswers(a => ({...a, experienceLevel: opt.value})); setScreen('q3'); }}
                    className={`w-full flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all hover:border-orange-400 hover:bg-orange-50 ${answers.experienceLevel === opt.value ? 'border-orange-500 bg-orange-50' : 'border-gray-100'}`}>
                    <span className="text-4xl">{opt.emoji}</span>
                    <div>
                      <p className="font-black text-gray-900 text-lg">{opt.title}</p>
                      <p className="text-sm text-gray-500">{opt.desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {screen === 'q3' && (
            <motion.div key="q3" variants={screenVariants} initial="initial" animate="animate" exit="exit"
              className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400 font-bold uppercase">3 of 4</p>
                <div className="flex gap-1">{[1,2,3,4].map(i => <div key={i} className={`w-8 h-1.5 rounded-full ${i <= 3 ? 'bg-orange-500' : 'bg-gray-200'}`}/>)}</div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">How soon do you want to complete your goal?</h2>
              <div className="grid grid-cols-2 gap-3">
                {URGENCY_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => { setAnswers(a => ({...a, urgency: opt.value})); setScreen('q4'); }}
                    className={`flex flex-col items-center gap-2 p-5 rounded-2xl border-2 transition-all hover:border-orange-400 hover:bg-orange-50 ${answers.urgency === opt.value ? 'border-orange-500 bg-orange-50' : 'border-gray-100'}`}>
                    <span className="text-3xl">{opt.emoji}</span>
                    <p className="font-black text-gray-900 text-sm text-center">{opt.title}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {screen === 'q4' && (
            <motion.div key="q4" variants={screenVariants} initial="initial" animate="animate" exit="exit"
              className="bg-white rounded-3xl shadow-2xl p-8">
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs text-gray-400 font-bold uppercase">4 of 4</p>
                <div className="flex gap-1">{[1,2,3,4].map(i => <div key={i} className={`w-8 h-1.5 rounded-full bg-orange-500`}/>)}</div>
              </div>
              <h2 className="text-2xl font-black text-gray-900 mb-6">What language do you prefer?</h2>
              <div className="flex flex-col gap-3 mb-8">
                {LANG_OPTIONS.map(opt => (
                  <button key={opt.value} onClick={() => setAnswers(a => ({...a, preferredLanguage: opt.value}))}
                    className={`flex items-center gap-4 p-5 rounded-2xl border-2 text-left transition-all text-xl font-black ${answers.preferredLanguage === opt.value ? 'border-orange-500 bg-orange-50 text-orange-600' : 'border-gray-100 text-gray-700 hover:border-orange-300'}`}>
                    <span className="text-3xl">{opt.flag}</span> {opt.label}
                    {answers.preferredLanguage === opt.value && <span className="ml-auto text-orange-500">✓</span>}
                  </button>
                ))}
              </div>
              <p className="text-gray-400 text-xs text-center mb-4">You can always change this later</p>
              <button onClick={handleComplete} disabled={creating}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 rounded-2xl text-lg transition-colors">
                🚀 Start My Journey!
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}