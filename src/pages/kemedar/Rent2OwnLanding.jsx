import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function Rent2OwnLanding() {
  return (
    <ModuleLandingTemplate
      emoji="🔑"
      features={[
        { icon: "📋", title: "Structured Agreement", desc: "Buyer and seller agree on final price, monthly rent, equity portion, and timeframe — all managed by Kemedar." },
        { icon: "📈", title: "Equity Progress Dashboard", desc: "'Your home ownership progress: ████████░░ 35% owned. Equity: 288,000 EGP. Target: Jan 2028.'" },
        { icon: "💰", title: "Managed Monthly Payments", desc: "Kemedar collects rent, tracks equity accumulation, enforces contract terms throughout." },
        { icon: "🏠", title: "Seller Benefits", desc: "Immediate rent income + guaranteed buyer at end + premium price agreed upfront." },
        { icon: "⚖️", title: "Contract Enforcement", desc: "Kemedar manages the full lifecycle — from setup to final sale when the term completes." },
        { icon: "🌍", title: "Social Impact", desc: "Solves the affordability crisis for millions who can afford rent but not a down payment." },
      ]}
      howItWorks={[
        { title: "Buyer and seller agree on terms", desc: "Final price, monthly rent, equity portion (e.g. 40% goes toward purchase), and timeframe (e.g. 5 years)." },
        { title: "Kemedar sets up the contract", desc: "Digital contract, payment tracking, and equity accumulation all managed on platform." },
        { title: "Monthly payments collected", desc: "Rent collected automatically. Portion tracked as equity. Dashboard updated in real-time." },
        { title: "Final sale completes", desc: "When term ends (or buyer exercises option early), final payment and title transfer executed via Escrow." },
      ]}
      whyBrilliant={[
        "Opens homeownership to millions who are currently excluded by down payment requirements.",
        "Creates 3–5 year locked-in relationships — highest retention product on the platform.",
        "Kemedar earns setup fees, monthly management fees, and final sale commission.",
        "Enormous social impact story that attracts government partnership and media attention.",
      ]}
    />
  );
}