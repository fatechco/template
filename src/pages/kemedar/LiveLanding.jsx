import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function LiveLanding() {
  return (
    <ModuleLandingTemplate
      badge="📺 Live Streaming · Phase 3"
      badgeColor="bg-red-100 text-red-700"
      emoji="📺"
      title="Kemedar Live™"
      subtitle="Real Estate Live Streaming Events. Auctions, developer launches, open houses — all live."
      tagline="Positions Kemedar as THE platform for Arab real estate media."
      heroGradient="from-red-900 via-rose-900 to-slate-900"
      accentColor="text-red-300"
      ctaTo="/kemedar/live"
      ctaLabel="📺 Browse Live Events"
      ctaColor="bg-red-500 hover:bg-red-600"
      phase="Phase 3 — Live"
      features={[
        { icon: "🏷️", title: "Live Property Auctions", desc: "Real-time bidding, AI shows highest bid, countdown timer, and 'Buy It Now' option for motivated sellers." },
        { icon: "🏗️", title: "Developer Launch Events", desc: "New compound launches LIVE. Reserve a unit during the stream. Live counter: 'X units remaining.'" },
        { icon: "🏠", title: "Virtual Open Houses", desc: "Agent hosts timed virtual tour. 200 potential buyers attend. Questions answered live." },
        { icon: "📊", title: "Market Report Broadcasts", desc: "Monthly AI + human analysis. Interactive Q&A. Live data visualization. Kemedar as thought leader." },
        { icon: "🗺️", title: "Franchise Owner Area Events", desc: "FO hosts monthly live: New properties, market updates, meet professionals, community news." },
        { icon: "🤖", title: "AI Auto-Answers", desc: "AI responds to common viewer questions from FAQ during live streams automatically." },
      ]}
      howItWorks={[
        { title: "Host schedules a live event", desc: "Agent, developer, or Franchise Owner creates event with date, time, and property details." },
        { title: "Buyers register and attend", desc: "Push notifications go to relevant users. Up to 200 attend simultaneously." },
        { title: "Interactive session runs", desc: "Live video, real-time chat, AI Q&A, bidding or reservations — all in one interface." },
        { title: "Recordings available after", desc: "Every session is archived for buyers who missed the live event." },
      ]}
      whyBrilliant={[
        "Creates massive content marketing — every live event drives new users to the platform.",
        "Developer launches via Kemedar instead of their own website.",
        "Creates FOMO urgency that drives faster purchase decisions.",
        "Monthly market reports build Kemedar as the authoritative voice in Arab real estate.",
      ]}
    />
  );
}