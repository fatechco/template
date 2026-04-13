import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function TwinCitiesLanding() {
  return (
    <ModuleLandingTemplate
      badge="🌍 Cross-Market · Phase 4"
      badgeColor="bg-sky-100 text-sky-700"
      emoji="🌍"
      title="Kemedar Twin Cities™"
      subtitle="Cross-Market Expansion Intelligence. One platform connecting Egypt, Saudi, UAE and beyond."
      tagline="First mover in cross-MENA real estate investment. No one connects these markets in a unified platform."
      heroGradient="from-sky-900 via-indigo-900 to-slate-900"
      accentColor="text-sky-300"
      ctaTo="/kemedar/twin-cities"
      ctaLabel="🌍 Compare Markets"
      ctaColor="bg-sky-500 hover:bg-sky-600"
      phase="Phase 4 — Live"
      features={[
        { icon: "💱", title: "Budget Conversion", desc: "'Your AED 200,000 budget could buy in Egypt:' — with live currency conversion and property examples." },
        { icon: "📊", title: "Yield Comparison", desc: "'Egypt rental yield: 8-12% vs Dubai: 4-6%' — data-driven investment comparison." },
        { icon: "⚖️", title: "Legal Guide Per Country", desc: "Ownership rules, tax implications, and legal requirements for each destination market." },
        { icon: "🔒", title: "Cross-Border Escrow", desc: "Kemedar Escrow works across borders — FO in Egypt handles local, FO in UAE handles buyer side." },
        { icon: "🗺️", title: "Country Comparison Tool", desc: "Interactive dashboard: Egypt vs UAE vs KSA vs Morocco — Price/sqm, Yield, Growth, Legal ease, Tax." },
        { icon: "👥", title: "Diaspora Community", desc: "Connect with other Egyptians in Dubai buying in Cairo — community, advice, group buying." },
      ]}
      howItWorks={[
        { title: "Enter your budget in any currency", desc: "AED, SAR, USD, GBP — converted to show what you can buy in each market." },
        { title: "Compare markets side by side", desc: "Price per sqm, rental yield, legal ease, currency risk — all in one interactive dashboard." },
        { title: "Get matched with local properties", desc: "Actual listings in your target market shown with full details and Virtual Twin access." },
        { title: "Close cross-border via Escrow", desc: "FO network on both sides ensures a secure, documented, legally clean transaction." },
      ]}
      whyBrilliant={[
        "Unique position — no platform connects MENA real estate markets in a unified interface.",
        "Gulf residents see Egyptian property as cheap, high-yield investments — perfect audience.",
        "Franchise Owner network creates natural expansion infrastructure across countries.",
        "First mover advantage in cross-MENA real estate investment intelligence.",
      ]}
    />
  );
}