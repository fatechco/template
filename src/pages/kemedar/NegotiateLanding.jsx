import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function NegotiateLanding() {
  return (
    <ModuleLandingTemplate
      badge="🤝 AI · Phase 2"
      badgeColor="bg-teal-100 text-teal-700"
      emoji="🤝"
      title="Kemedar Negotiate™"
      subtitle="AI Negotiation Coach for buyers and sellers. Stop guessing. Start winning."
      tagline="Empowers both sides. Increases deal completion. Reduces emotional friction."
      heroGradient="from-teal-900 via-green-900 to-slate-900"
      accentColor="text-teal-300"
      ctaTo="/cp/user/negotiations"
      ctaLabel="🤝 Start Negotiating"
      ctaColor="bg-teal-500 hover:bg-teal-600"
      phase="Phase 2 — Live"
      features={[
        { icon: "📊", title: "Market Intelligence Briefing", desc: "Days on market, price reductions, comparable sales — AI analyzes it all before you make a move." },
        { icon: "💡", title: "AI Buyer Strategy", desc: "Recommended opening offer, expected counter, walk-away point, and your best argument — all AI-generated." },
        { icon: "✍️", title: "AI-Drafted Offer Messages", desc: "Professional offer message in Arabic or English, reviewed by you, sent in one click." },
        { icon: "🏷️", title: "Seller Coaching", desc: "When an offer arrives, AI advises the seller: 'Counter at X — this is standard for this market.'" },
        { icon: "🔄", title: "Live Deal Room", desc: "Both parties negotiate in a structured digital room with offer tracking and round history." },
        { icon: "🤖", title: "Private AI Coach", desc: "Your AI coach is visible only to you — real-time advice as the negotiation unfolds." },
      ]}
      howItWorks={[
        { title: "Buyer initiates an offer on a property", desc: "Instead of just 'Contact Owner', a full AI briefing is generated first." },
        { title: "AI analyzes market position", desc: "Days listed, price drops, seasonal factors, owner type — all considered." },
        { title: "Strategy is presented privately", desc: "Buyer gets recommended offer, counter expectations, and walk-away point." },
        { title: "Offer drafted and sent", desc: "AI writes the message. You review. It's sent through the platform." },
        { title: "Seller coached on response", desc: "Seller gets AI advice too — the platform guides both sides to a fair deal." },
      ]}
      whyBrilliant={[
        "Kemedar becomes the trusted intermediary even without a physical agent.",
        "Deals close faster and at fairer prices for both parties.",
        "Platform earns on every facilitated transaction.",
        "Arabic market is highly negotiation-driven — this is a natural fit.",
      ]}
    />
  );
}