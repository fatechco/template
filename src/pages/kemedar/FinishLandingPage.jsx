import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function FinishLandingPage() {
  return (
    <ModuleLandingTemplate
      badge="🏠 Kemework · Phase 3"
      badgeColor="bg-orange-100 text-orange-700"
      emoji="🏗️"
      title="Kemedar Finish™"
      subtitle="End-to-End Home Finishing Coordination Platform. From empty shell to move-in ready — fully managed."
      tagline="Connects Kemedar + Kemework + Kemetro in one seamless experience."
      heroGradient="from-orange-900 via-amber-900 to-slate-900"
      accentColor="text-orange-300"
      ctaTo="/kemedar/finish"
      ctaLabel="🏗️ Start My Finishing Project"
      ctaColor="bg-orange-500 hover:bg-orange-600"
      phase="Phase 3"
      features={[
        { icon: "🎨", title: "3D Design Visualization", desc: "Choose design templates, select materials from Kemetro catalog, AI estimates cost instantly." },
        { icon: "📦", title: "Automated Procurement", desc: "All materials ordered from Kemetro automatically with staged delivery timeline." },
        { icon: "👷", title: "Professional Coordination", desc: "Electrician → Plumber → Tiler → Painter → Carpenter — sequenced automatically." },
        { icon: "📸", title: "Daily Progress Tracking", desc: "Professional sends daily photos. AI checks if project is on schedule. Live feed for homeowner." },
        { icon: "✅", title: "Snagging Comparison", desc: "AI compares 'agreed design' vs 'delivered' — snag list generated, fixes required before payment." },
        { icon: "🗺️", title: "Franchise Owner QC", desc: "Quality control visits at each phase. Dispute arbitration in their area." },
      ]}
      howItWorks={[
        { title: "Phase 1 — Design", desc: "3D visualization, template selection, material choices from Kemetro, instant AI cost estimate." },
        { title: "Phase 2 — Procurement", desc: "All materials automatically ordered and staged for timely delivery." },
        { title: "Phase 3 — Work Coordination", desc: "Kemework professionals matched and sequenced. Each sees their phase automatically." },
        { title: "Phase 4 — Progress Tracking", desc: "Daily photo updates, AI schedule check, milestone payments from escrow." },
        { title: "Phase 5 — Snagging", desc: "AI photo comparison, snag list, final payment only released when work is approved." },
      ]}
      whyBrilliant={[
        "Solves the most painful experience in Egypt/MENA real estate — the finishing nightmare.",
        "Everyone who buys off-plan needs this — enormous addressable market.",
        "Enormous transaction value per project — connects all three Kemedar modules.",
        "Franchise Owners have a tangible quality-control role that builds local trust.",
      ]}
    />
  );
}