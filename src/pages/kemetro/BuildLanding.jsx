import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function BuildLanding() {
  return (
    <ModuleLandingTemplate
      badge="🏗️ Kemetro Build · Phase 2"
      badgeColor="bg-teal-100 text-teal-700"
      emoji="📐"
      title="Kemetro Build™"
      subtitle="Bill of Quantities AI Generator. Upload a floor plan. Get a complete material list in 60 seconds."
      tagline="Every construction project needs a BOQ. AI does it in 60 seconds instead of days."
      heroGradient="from-teal-900 via-cyan-900 to-slate-900"
      accentColor="text-teal-300"
      ctaTo="/kemetro/build/new"
      ctaLabel="📐 Generate My BOQ"
      ctaColor="bg-teal-500 hover:bg-teal-600"
      phase="Phase 2 — Live"
      features={[
        { icon: "📸", title: "Floor Plan Upload", desc: "Upload photo or PDF of your floor plan — AI extracts all dimensions and room types automatically." },
        { icon: "📋", title: "Complete Material List", desc: "Windows, doors, tiles, paint, electrical points, plumbing fixtures — all calculated with quantities." },
        { icon: "🛒", title: "One-Click Order", desc: "'Order All Materials →' — Kemetro cart populated automatically with best-matched products." },
        { icon: "📦", title: "Staged Delivery Schedule", desc: "Tiles arrive before painter, not after. Delivery sequence optimized for your work timeline." },
        { icon: "💰", title: "3 Budget Scenarios", desc: "Economy / Standard / Premium — compare full project cost across all three scenarios instantly." },
        { icon: "🏗️", title: "Contractor-Grade Output", desc: "Professional BOQ that contractors use — now accessible to every homeowner." },
      ]}
      howItWorks={[
        { title: "Upload your floor plan", desc: "Photo, PDF, or manual room entry — AI accepts all formats." },
        { title: "AI calculates quantities", desc: "Every material type calculated with waste factors, installation requirements, and ordering quantities." },
        { title: "Review 3 budget scenarios", desc: "Economy, Standard, and Premium options with full material lists and pricing for each." },
        { title: "Order from Kemetro", desc: "One click adds everything to your Kemetro cart with staged delivery scheduling." },
      ]}
      whyBrilliant={[
        "Every construction or finishing project needs a BOQ — this is a massive addressable market.",
        "Currently done manually by engineers — takes days of work. AI does it in 60 seconds.",
        "Directly drives Kemetro material sales — every BOQ is a purchase funnel.",
        "Contractors will subscribe just for this feature — saves them hours per project.",
      ]}
    />
  );
}