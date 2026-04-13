import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function LifeScoreLanding() {
  return (
    <ModuleLandingTemplate
      badge="📊 Neighborhood Intelligence · Phase 1"
      badgeColor="bg-green-100 text-green-700"
      emoji="🏙️"
      title="Kemedar Life Score™"
      subtitle="Neighborhood Intelligence Engine. Not just 'close to metro' — what actually matters to real people."
      tagline="No Arab platform has this."
      heroGradient="from-green-900 via-emerald-900 to-slate-900"
      accentColor="text-green-300"
      ctaTo="/kemedar/life-score"
      ctaLabel="🏙️ Explore Life Scores"
      ctaColor="bg-green-500 hover:bg-green-600"
      phase="Phase 1 — Live"
      features={[
        { icon: "🏃", title: "Walkability Score", desc: "Can you reach pharmacy, bakery, and cafe within 10 minutes on foot?" },
        { icon: "🔇", title: "Noise Score", desc: "Traffic levels, school rush hours, weekend quiet — all factored in." },
        { icon: "🌳", title: "Green Score", desc: "Park density, green coverage, and clean air index per neighborhood." },
        { icon: "🔒", title: "Safety Score", desc: "Reported incidents, lighting quality, gated access, and community feedback." },
        { icon: "🏫", title: "Education Score", desc: "Number of schools within 3km, international vs national, ratings." },
        { icon: "🛒", title: "Convenience Score", desc: "Supermarkets, hospitals, pharmacies, and essential services proximity." },
      ]}
      howItWorks={[
        { title: "Data is gathered from multiple sources", desc: "Your property database, OpenStreetMap, user reviews, and Franchise Owner area reports." },
        { title: "AI scores each dimension", desc: "Walkability, noise, green space, safety, education, connectivity, and convenience — each scored 0-100." },
        { title: "Overall Life Score computed", desc: "Weighted composite score shown on every district and property page." },
        { title: "Users compare areas", desc: "Interactive comparison tool lets buyers weigh what matters most to them." },
      ]}
      whyBrilliant={[
        "Buyers make decisions based on lifestyle, not just specs — this matches how people actually think.",
        "Arabic families care deeply about school proximity, mosque access, and family area reputation.",
        "Creates a data moat — no competitor can replicate community-validated scores quickly.",
        "Makes Kemedar the definitive source for neighborhood intelligence in the Arab world.",
      ]}
    />
  );
}