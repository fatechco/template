import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function EscrowLanding() {
  return (
    <ModuleLandingTemplate
      badge="🏦 Trust Layer · Phase 3"
      badgeColor="bg-blue-100 text-blue-700"
      emoji="🏦"
      title="Kemedar Escrow™"
      subtitle="Trusted Digital Transaction Layer. The biggest pain in Arab real estate: TRUST between buyer and seller."
      tagline="Kemedar becomes financial infrastructure, not just listings."
      heroGradient="from-blue-900 via-indigo-900 to-slate-900"
      accentColor="text-blue-300"
      ctaTo="/kemedar/escrow/new"
      ctaLabel="🔒 Start Secure Transaction"
      ctaColor="bg-blue-500 hover:bg-blue-600"
      phase="Phase 3"
      features={[
        { icon: "🔒", title: "Secure Fund Holding", desc: "Buyer deposits earnest money (5-10%) — held securely by Kemedar while deal completes." },
        { icon: "✅", title: "Milestone-Based Release", desc: "Funds release only when contract signed, title checked, inspection complete, and notarization done." },
        { icon: "🤝", title: "Both-Party Confirmation", desc: "Buyer confirms property received. Seller confirms payment. Both must confirm for release." },
        { icon: "⚖️", title: "AI Dispute Resolution", desc: "If deal falls through, AI evaluates fault and manages automatic partial/full refund." },
        { icon: "🗺️", title: "Franchise Owner Guarantee", desc: "FO acts as trusted local guardian and earns commission on each transaction in their area." },
        { icon: "📋", title: "Full Digital Paper Trail", desc: "Every step documented. No cash deals, no fraud risk, full legal protection." },
      ]}
      howItWorks={[
        { title: "Buyer deposits earnest money", desc: "Via XeedWallet or bank transfer — funds held securely by Kemedar." },
        { title: "Kemedar holds while deal completes", desc: "Contract signed digitally. Legal title checked. Property inspected. Notarization complete." },
        { title: "Both parties confirm", desc: "Buyer: 'I confirm property received.' Seller: 'I confirm payment received.'" },
        { title: "Funds released instantly", desc: "Secure, documented, and legally clean. Franchise Owner witnesses the process." },
      ]}
      whyBrilliant={[
        "Solves the #1 trust problem in MENA real estate — cash deals with no paper trail.",
        "Kemedar becomes financial infrastructure, not just a listing site.",
        "Regulatory moat — hard to replicate once established.",
        "Creates transaction fee revenue on top of subscriptions.",
      ]}
    />
  );
}