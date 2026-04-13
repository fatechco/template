import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function TwinLanding() {
  return (
    <ModuleLandingTemplate
      badge="🏠 Virtual Twin · Phase 3"
      badgeColor="bg-purple-100 text-purple-700"
      emoji="🏠"
      title="Kemedar Twin™"
      subtitle="Virtual Property Twin & Live Tour. Every property gets a 3D digital twin you can explore from anywhere."
      tagline="Solves the #1 problem in Egyptian real estate: long distances to view properties."
      heroGradient="from-purple-900 via-violet-900 to-slate-900"
      accentColor="text-purple-300"
      ctaTo="/kemedar/match"
      ctaLabel="🏠 Explore Virtual Tours"
      ctaColor="bg-purple-500 hover:bg-purple-600"
      phase="Phase 3"
      features={[
        { icon: "📸", title: "AI Photo Stitching", desc: "Upload 15–20 photos — AI auto-generates a 360° virtual tour with no special equipment." },
        { icon: "📐", title: "AI Floor Plan Extraction", desc: "Accurate floor plan extracted from photos, with AI-estimated measurements." },
        { icon: "🎯", title: "Interactive Hotspots", desc: "Clickable room hotspots with details, specs, and finishing notes." },
        { icon: "📺", title: "Live Tour Streaming", desc: "Seller walks with phone, buyer watches live with 3D overlay — and can give instructions." },
        { icon: "🔍", title: "Remote Verification", desc: "Franchise Owners do remote verification without physically visiting every property." },
        { icon: "✈️", title: "Expat-Ready", desc: "Diaspora investors abroad can view, tour, and decide on Egyptian properties remotely." },
      ]}
      howItWorks={[
        { title: "Seller uploads photos or records walkthrough", desc: "AI guides: 'Now take from this corner, now from here' — ensuring complete coverage." },
        { title: "AI processes into a digital twin", desc: "360° tour, floor plan, measurements, and hotspots generated automatically." },
        { title: "Buyers explore from anywhere", desc: "No travel needed — full property experience from any device, anywhere in the world." },
        { title: "Live sessions on demand", desc: "Seller and buyer connect in real-time for an interactive live walkthrough." },
      ]}
      whyBrilliant={[
        "Particularly valuable for expat buyers and diaspora investing from abroad.",
        "Reduces wasted viewings dramatically — buyers arrive pre-qualified.",
        "Franchise Owners gain a scalable remote verification tool.",
        "First Arab platform to offer AI-generated property twins at scale.",
      ]}
    />
  );
}