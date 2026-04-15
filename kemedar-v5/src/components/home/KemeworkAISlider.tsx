// @ts-nocheck
import AIFeaturesSlider from "./AIFeaturesSlider";

const CARDS = [
  { icon: "📷", name: "Snap & Fix™", tagline: "AI REPAIR DIAGNOSIS", description: "Photo your broken pipe or cracked wall. AI diagnoses it and writes the brief.", link: "/kemework/snap" },
  { icon: "🗝️", name: "Move-In Concierge", tagline: "AUTOMATED MOVING PIPELINE", description: "Just bought a home? We auto-schedule cleaners, movers, and handymen for you.", link: "/dashboard/concierge" },
  { icon: "👷", name: "AI Professional Match", tagline: "SMART JOB MATCHING", description: "AI matches your task to the best available professional in your area.", link: "/kemework/find-professionals" },
  { icon: "🎨", name: "KemeKit Creator™", tagline: "ROOM DESIGN STUDIO", description: "Interior designers build shoppable room kits. Earn commissions on every sale.", link: "/kemework/pro/kemekits/create" },
  { icon: "🏅", name: "Kemework Guarantee™", tagline: "JOB INSURANCE", description: "AI-backed workmanship protection. Defects covered for 90 days after completion.", link: "/kemework" },
  { icon: "🏗️", name: "Kemedar Finish™", tagline: "RENOVATION MANAGEMENT", description: "Manage your full renovation phase by phase with escrow-protected payments.", link: "/kemedar/finish" },
];

export default function KemeworkAISlider() {
  return (
    <AIFeaturesSlider
      accentColor="#14B8A6"
      title="ThinkDar™ for Home Services — AI That Gets the Job Done"
      subtitle="Smart AI tools that diagnose problems, match you with the right professional, and guide your entire move-in journey."
      cards={CARDS}
      exploreLink="/thinkdar"
    />
  );
}