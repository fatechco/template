import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function DNALanding() {
  return (
    <ModuleLandingTemplate
      badge="🧬 Personalization · Ongoing"
      badgeColor="bg-violet-100 text-violet-700"
      emoji="🧬"
      title="Kemedar DNA™"
      subtitle="Platform-Wide Personalization Engine. The entire platform learns and adapts to you — every single day."
      tagline="An AI platform that gets smarter with every visit. Competitors can't replicate the data moat."
      heroGradient="from-violet-900 via-purple-900 to-slate-900"
      accentColor="text-violet-300"
      ctaTo="/cp/user/my-dna"
      ctaLabel="🧬 View My DNA Profile"
      ctaColor="bg-violet-500 hover:bg-violet-600"
      phase="Ongoing — Live"
      features={[
        { icon: "🏘️", title: "Neighborhood Intelligence", desc: "Knows which areas you keep searching — even if you don't explicitly say." },
        { icon: "💰", title: "Real Budget Detection", desc: "Your actual filter behavior reveals your true budget — not just the stated one." },
        { icon: "📸", title: "Photo Preference Learning", desc: "Garden? Modern kitchen? Views? DNA tracks what photos you linger on." },
        { icon: "⏰", title: "Timing Intelligence", desc: "Lunch search = casual. Midnight search = serious buyer. Notifications timed accordingly." },
        { icon: "🤖", title: "Adaptive Homepage", desc: "No apartment banners if you always look at villas. Every section adapts to your actual behavior." },
        { icon: "🎯", title: "Franchise Owner Warm Leads", desc: "FO alerted when DNA readiness score hits 70%: 'Lead warming up in your area →'" },
      ]}
      howItWorks={[
        { title: "Every interaction is a signal", desc: "Searches, swipes, time spent, photos viewed, filters applied — all feed the DNA model." },
        { title: "AI builds your behavioral profile", desc: "After 30 days, Kemedar understands your real preferences better than you stated them." },
        { title: "Platform adapts to you", desc: "Homepage, search defaults, notifications, and Advisor pre-fills — all personalized." },
        { title: "Privacy always respected", desc: "You can view your DNA profile, control what's tracked, and delete your data anytime." },
      ]}
      whyBrilliant={[
        "Creates a platform that users feel truly 'understands them' — ultimate retention driver.",
        "Competitors can't replicate the behavioral data moat without years of users.",
        "Franchise Owners receive pre-qualified, behavior-validated warm leads automatically.",
        "Personalization compounds over time — the longer you use it, the better it gets.",
      ]}
    />
  );
}