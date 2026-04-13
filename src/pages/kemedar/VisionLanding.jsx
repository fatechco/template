import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function VisionLanding() {
  return (
    <ModuleLandingTemplate
      badge="👁 AI · Phase 1"
      badgeColor="bg-cyan-100 text-cyan-700"
      emoji="👁️"
      title="Kemedar Vision™"
      subtitle="AI Property Photo Analyzer. Every photo automatically scored, analyzed, and enhanced."
      tagline="Protects buyers. Helps sellers get better prices. Reduces disputes."
      heroGradient="from-cyan-900 via-teal-900 to-slate-900"
      accentColor="text-cyan-300"
      ctaTo="/cp/user/valuations"
      ctaLabel="✨ Try Vision Report"
      ctaColor="bg-cyan-500 hover:bg-cyan-600"
      phase="Phase 1"
      features={[
        { icon: "📸", title: "Photo Quality Scoring", desc: "AI scores every photo 0–100. 'This photo is too dark — retake for 40% more views.'" },
        { icon: "🏠", title: "Finishing Quality Detection", desc: "Automatically detects high-end marble, premium cabinets, and suggests price adjustments." },
        { icon: "🏷️", title: "Auto Room Labeling", desc: "Master Bedroom | Living Room | Kitchen — detected automatically, no manual input." },
        { icon: "⚠️", title: "Issue Detection & Flags", desc: "Water stain detected? Clutter reducing buyer interest? AI flags it for transparency." },
        { icon: "🛋️", title: "Virtual Staging", desc: "Empty room? One-click AI generates a furnished version that looks 58% more attractive." },
        { icon: "✅", title: "Seller Score Boost", desc: "High Vision score improves listing ranking and buyer confidence automatically." },
      ]}
      howItWorks={[
        { title: "Seller uploads photos", desc: "Standard photo upload — no special equipment needed." },
        { title: "AI analyzes every image", desc: "Quality, finishing, room type, issues, and staging potential all detected in seconds." },
        { title: "Report is generated", desc: "Seller sees a full Vision Report with actionable suggestions to improve their listing." },
        { title: "Buyer sees transparency badge", desc: "Property shows AI-analyzed badge giving buyers confidence and reducing disputes." },
      ]}
      whyBrilliant={[
        "Protects buyers through radical transparency.",
        "Helps sellers command better prices with better listings.",
        "Franchise Owners use it for on-site verification quality control.",
        "Virtual staging drives massive engagement with zero effort from sellers.",
      ]}
    />
  );
}