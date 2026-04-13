import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function MatchLanding() {
  return (
    <ModuleLandingTemplate
      badge="👆 Swipe · Phase 1"
      badgeColor="bg-pink-100 text-pink-700"
      emoji="❤️"
      title="Kemedar Match™"
      subtitle="Two-sided property matching. A completely different search experience — Tinder for Real Estate."
      tagline="More engagement = more data = better AI matching."
      heroGradient="from-pink-900 via-rose-900 to-slate-900"
      accentColor="text-pink-300"
      ctaTo="/kemedar/match"
      ctaLabel="❤️ Start Swiping"
      ctaColor="bg-pink-500 hover:bg-pink-600"
      phase="Phase 1 — Live"
      features={[
        { icon: "👆", title: "Swipe Interface", desc: "Full-screen property cards with photo carousel, specs overlay, Life Score, and match percentage." },
        { icon: "❤️", title: "Right Swipe = Interest", desc: "Property saved to matches. Owner notified: 'Someone is interested in your property.'" },
        { icon: "⭐", title: "Super Like", desc: "Instant notification to owner. Higher visibility for seller. Signal of serious intent." },
        { icon: "🎉", title: "Mutual Match Screen", desc: "Both sides express interest → 'It's a Match!' → Kemedar chat opens automatically." },
        { icon: "🤖", title: "AI First Message", desc: "AI drafts the opening message for you — professional, friendly, and effective." },
        { icon: "🗺️", title: "Franchise Owner Alerts", desc: "FOs notified of all matches in their area — they can facilitate and earn commission." },
      ]}
      howItWorks={[
        { title: "Set 3 quick preferences", desc: "City, budget, property type — takes 30 seconds." },
        { title: "Enter swipe mode", desc: "Full-screen property cards appear. Swipe right to like, left to pass, up to Super Like." },
        { title: "AI learns your preferences", desc: "Every swipe teaches the algorithm what you actually want — not just what you say." },
        { title: "Mutual match unlocks chat", desc: "When both buyer and seller show interest, a conversation opens automatically." },
      ]}
      whyBrilliant={[
        "Younger generation finds traditional property search boring — this reimagines it.",
        "Gamification creates emotional investment in the search process.",
        "More engagement generates more behavioral data for AI improvement.",
        "Creates urgency and excitement around property discovery.",
      ]}
    />
  );
}