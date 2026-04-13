import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function CommunityLanding() {
  return (
    <ModuleLandingTemplate
      badge="🏘 Community · Phase 2"
      badgeColor="bg-yellow-100 text-yellow-700"
      emoji="🏘️"
      title="Kemedar Community™"
      subtitle="Hyperlocal Neighborhood Social Network. Your compound, your neighbors, your community."
      tagline="Creates massive retention — people check neighborhood apps daily."
      heroGradient="from-yellow-900 via-amber-900 to-slate-900"
      accentColor="text-yellow-300"
      ctaTo="/kemedar/community"
      ctaLabel="🏘 Join Your Community"
      ctaColor="bg-yellow-500 hover:bg-yellow-600"
      phase="Phase 2 — Live"
      features={[
        { icon: "📢", title: "Compound Announcements", desc: "Management posts maintenance schedules, security alerts, and important updates." },
        { icon: "🤝", title: "Neighbor Marketplace", desc: "'Selling my sofa', 'Need a plumber?' — organic Kemework leads from trusted neighbors." },
        { icon: "📊", title: "Area Price Intelligence", desc: "'My neighbor sold for X — should I list for more?' Community-validated price data." },
        { icon: "🗳️", title: "Community Votes", desc: "'Should we upgrade the gym?' 'New security company — yay or nay?'" },
        { icon: "🔔", title: "Local Alerts", desc: "Water cut, power outage, new nearby development — instant community notifications." },
        { icon: "🗺️", title: "Franchise Owner Moderated", desc: "FO acts as community manager — posts, moderates, announces. Builds deep local relationships." },
      ]}
      howItWorks={[
        { title: "Join your verified community", desc: "Franchise Owner verifies you're a resident or owner in that area." },
        { title: "Connect with your neighbors", desc: "Private space for your compound or district — neighbors only." },
        { title: "Share, vote, ask, sell", desc: "Marketplace, polls, alerts, and price intelligence all in one place." },
        { title: "Discover Kemework professionals", desc: "Neighbor recommendations become direct leads for verified local professionals." },
      ]}
      whyBrilliant={[
        "Creates daily habit — people check their neighborhood community app every day.",
        "Each interaction generates data that improves AI matching and recommendations.",
        "Kemework gets organic referrals from trusted neighbor recommendations.",
        "Makes Kemedar the daily platform, not just the 'every 7 years when moving' platform.",
      ]}
    />
  );
}