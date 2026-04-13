import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function CoachLanding() {
  return (
    <ModuleLandingTemplate
      badge="🎓 AI Coach · Phase 1"
      badgeColor="bg-blue-100 text-blue-700"
      emoji="🎓"
      title="Kemedar Coach™"
      subtitle="Personalized Property Journey Guide. Walk your entire property journey with an AI coach by your side."
      tagline="Reduces buyer anxiety enormously. Every step is a touchpoint for Kemedar to offer a service."
      heroGradient="from-blue-900 via-sky-900 to-slate-900"
      accentColor="text-blue-300"
      ctaTo="/kemedar/coach"
      ctaLabel="🎓 Start My Journey"
      ctaColor="bg-blue-500 hover:bg-blue-600"
      phase="Phase 1 — Live"
      features={[
        { icon: "🗺️", title: "Personalized Journey Map", desc: "After a quick survey, get a custom step-by-step roadmap tailored to your situation — buying, renting, or investing." },
        { icon: "✅", title: "Progress Tracking", desc: "See exactly where you are: documents gathered, properties toured, offer made, legal steps done." },
        { icon: "🏅", title: "Gamification & Badges", desc: "Earn XP and badges: 'First Tour 🏅', 'Offer Made 🏅', 'New Homeowner 🏆'" },
        { icon: "🔗", title: "Connected Services", desc: "Each step links to the right Kemedar tool: Advisor, Negotiate, Escrow, Lawyer network." },
        { icon: "🔔", title: "AI Nudges", desc: "Smart reminders when you've been idle. 'You're 78% through — one step left to make your offer.'" },
        { icon: "🗺️", title: "Franchise Owner Guidance", desc: "FO guides the local steps — viewings, legal, and handover — as part of your journey." },
      ]}
      howItWorks={[
        { title: "Complete a short survey", desc: "5 minutes — your situation, timeline, budget, and goals." },
        { title: "Get your personalized Journey Map", desc: "Phase-by-phase roadmap with specific steps for your exact scenario." },
        { title: "Check off steps as you go", desc: "The platform tracks your progress and unlocks the next step automatically." },
        { title: "AI coach keeps you moving", desc: "Nudges, tips, and celebrations at every milestone — you're never stuck." },
      ]}
      whyBrilliant={[
        "Reduces buyer anxiety enormously — most people don't know what steps to follow.",
        "Every journey step is a natural touchpoint for Kemedar to offer a service.",
        "Creates unprecedented engagement and platform loyalty.",
        "Franchise Owners get a structured role in guiding local buyers.",
      ]}
    />
  );
}