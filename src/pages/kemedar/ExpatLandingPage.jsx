import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function ExpatLandingPage() {
  return (
    <ModuleLandingTemplate
      badge="🌍 Diaspora · Phase 3"
      badgeColor="bg-sky-100 text-sky-700"
      emoji="✈️"
      title="Kemedar Expat™"
      subtitle="International & Diaspora Property Platform. 40M+ Egyptians abroad. All want to invest back home."
      tagline="Huge underserved market. Higher purchasing power. Premium service = premium price."
      heroGradient="from-sky-900 via-blue-900 to-slate-900"
      accentColor="text-sky-300"
      ctaTo="/kemedar/expat"
      ctaLabel="✈️ Invest From Abroad"
      ctaColor="bg-sky-500 hover:bg-sky-600"
      phase="Phase 3 — Live"
      features={[
        { icon: "🎬", title: "Remote Property Search", desc: "Advanced video tours, live virtual tours on demand, and Franchise Owner as your local eyes." },
        { icon: "📋", title: "Expat Buyer Legal Package", desc: "Power of Attorney (digital), vetted local lawyer, title deed registration — all handled remotely." },
        { icon: "🏠", title: "Property Management", desc: "FO manages your property after purchase: tenant finding, rent collection, maintenance, monthly reports." },
        { icon: "💱", title: "Currency & Transfer", desc: "Multi-currency wallet, best exchange rate notifications, direct EGP deposit to developers." },
        { icon: "🤝", title: "Expat Community", desc: "'Egyptians in Dubai buying in Cairo' — group community, shared advice, group buying opportunities." },
        { icon: "📊", title: "Cross-Market Comparison", desc: "Your Gulf budget shown in Egyptian properties — with rental yield and legal guide per country." },
      ]}
      howItWorks={[
        { title: "Browse remotely with confidence", desc: "Virtual tours, Live Twin sessions, and Franchise Owner reports eliminate the need to visit." },
        { title: "Select your legal package", desc: "Kemedar handles Power of Attorney, lawyer assignment, and registration — fully remote." },
        { title: "Complete transaction via Escrow", desc: "Cross-border Kemedar Escrow with FO on both sides ensures zero risk." },
        { title: "FO manages your investment", desc: "Ongoing property management, tenant relations, and monthly financial reports delivered to you." },
      ]}
      whyBrilliant={[
        "40M+ Egyptians abroad represent a massive underserved market with high purchasing power.",
        "Gulf residents see Egyptian property as cheap, high-yield investments — perfect audience.",
        "Franchise Owners gain property management as a recurring income stream.",
        "Creates locked-in multi-year relationships through ongoing management contracts.",
      ]}
    />
  );
}