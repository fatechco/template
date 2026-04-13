import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function FlashLanding() {
  return (
    <ModuleLandingTemplate
      badge="🛒 Kemetro · Phase 2"
      badgeColor="bg-orange-100 text-orange-700"
      emoji="⚡"
      title="Kemetro Flash™"
      subtitle="Group Buying & Bulk Deals Engine. Individual homeowners pay retail. Contractors get bulk. Now you can too."
      tagline="Disrupts retail material pricing. Franchise Owners have tangible value-add."
      heroGradient="from-orange-900 via-red-900 to-slate-900"
      accentColor="text-orange-300"
      ctaTo="/kemetro/flash"
      ctaLabel="⚡ See Flash Deals"
      ctaColor="bg-orange-500 hover:bg-orange-600"
      phase="Phase 2 — Live"
      features={[
        { icon: "🏘️", title: "Compound Group Buying", desc: "'50 apartments need Italian tiles' → one group order → 35% discount. Progress bar fills as owners join." },
        { icon: "⏰", title: "48-Hour Deals", desc: "Timer-based group deals. When threshold reached, bulk order placed automatically at discounted price." },
        { icon: "⚡", title: "Flash Deals", desc: "Seller has excess stock → 72-hour flash deal → significant discount → push notification to matching buyers." },
        { icon: "🚚", title: "Compound Gate Delivery", desc: "One delivery to the compound gate — coordinated logistics for all participants." },
        { icon: "🗺️", title: "Franchise Owner Organizer", desc: "FO organizes group buys in their area, earns commission, builds community relationships." },
        { icon: "🔔", title: "Smart Notifications", desc: "Alert when a group buy for your material/area opens. Never miss a deal that matches your project." },
      ]}
      howItWorks={[
        { title: "Group Buy opportunity detected", desc: "Kemedar AI detects: 'New compound X has 200 units all being finished now.'" },
        { title: "Notification sent to compound owners", desc: "All buyers in the compound get alerted about the group buying opportunity." },
        { title: "Owners join and commit", desc: "Progress bar fills. Timer counts down. When threshold reached, deal is locked." },
        { title: "Bulk order placed automatically", desc: "Everyone pays discounted price. Staged delivery to compound gate." },
      ]}
      whyBrilliant={[
        "Disrupts retail material pricing — homeowners finally get contractor-level discounts.",
        "Creates community around compounds and neighborhoods.",
        "Sellers clear excess stock efficiently. Buyers save 20–40% on materials.",
        "Franchise Owners have a concrete, commissionable value-add for their area.",
      ]}
    />
  );
}