import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function ScoreLanding() {
  return (
    <ModuleLandingTemplate
      badge="⭐ Reputation · Phase 4"
      badgeColor="bg-amber-100 text-amber-700"
      emoji="⭐"
      title="Kemedar Score™"
      subtitle="Universal Real Estate Credit Score. Your reputation on the platform — built by every action you take."
      tagline="Self-regulating platform. Good actors rewarded. Bad actors penalized."
      heroGradient="from-amber-900 via-yellow-900 to-slate-900"
      accentColor="text-amber-300"
      ctaTo="/cp/user/score"
      ctaLabel="⭐ View My Score"
      ctaColor="bg-amber-500 hover:bg-amber-600"
      phase="Phase 4 — Live"
      features={[
        { icon: "🏡", title: "Seller Score", desc: "+Points for verified data, quality photos, fast responses, completed sales. -Points for disputes and ghost listings." },
        { icon: "🏠", title: "Buyer Score", desc: "+Points for identity verification, completed viewings, Kemedar transactions. -Points for no-shows and disputes." },
        { icon: "👷", title: "Professional Score", desc: "+Points for on-time delivery, 5-star reviews, accreditation. -Points for disputes and abandoned jobs." },
        { icon: "📈", title: "Score Affects Rankings", desc: "Higher score = higher search ranking, premium feature access, and Kemedar Escrow limits." },
        { icon: "🏦", title: "Bank Loan Applications", desc: "Your Kemedar Score is exportable — banks can use it as a track record for loan applications." },
        { icon: "🎯", title: "Franchise Owner Alerts", desc: "FO alerted when a lead's score hits 70% readiness — pre-qualified warm leads delivered automatically." },
      ]}
      howItWorks={[
        { title: "Every action earns or costs points", desc: "Listing accurately, responding fast, completing transactions — all contribute to your score." },
        { title: "Score is visible on all profiles", desc: "Buyers, sellers, and professionals all see each other's scores before engaging." },
        { title: "Required for premium features", desc: "Kemedar Escrow, premium listings, and accreditation all require minimum score thresholds." },
        { title: "Exportable for external use", desc: "Share your score with banks or partners as a verified reputation credential." },
      ]}
      whyBrilliant={[
        "Creates a reputation economy — users protect their score and stay on the platform forever.",
        "Incredibly sticky — once you've built your score, you'll never leave Kemedar.",
        "Self-regulating platform that improves quality without manual moderation.",
        "First Arab real estate platform to create an exportable reputation credential.",
      ]}
    />
  );
}