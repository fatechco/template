import ModuleLandingTemplate from "@/components/modules/ModuleLandingTemplate";

export default function PredictLanding() {
  return (
    <ModuleLandingTemplate
      badge="🧠 AI · Phase 1"
      badgeColor="bg-indigo-100 text-indigo-700"
      emoji="📈"
      title="Kemedar Predict™"
      subtitle="AI Market Price Forecasting Engine. Most platforms show current prices. Kemedar shows FUTURE prices."
      tagline="No other Arab proptech does this."
      heroGradient="from-indigo-900 via-blue-900 to-slate-900"
      accentColor="text-indigo-300"
      ctaTo="/kemedar/predict"
      ctaLabel="🔮 See Price Predictions"
      ctaColor="bg-indigo-500 hover:bg-indigo-600"
      phase="Phase 1 — Live"
      features={[
        { icon: "🏙️", title: "District-Level Forecasts", desc: "AI predicts price trajectory per district for the next 12–36 months based on infrastructure projects, school openings, and metro lines." },
        { icon: "📡", title: "External Signal Analysis", desc: "Combines metro line announcements, compound approvals, government projects, and historical data into one score." },
        { icon: "🏷️", title: "Investment Grade Labels", desc: "'Buy now — Pre-Gentrification', 'Hold — prices plateauing', 'Caution — oversupply incoming'" },
        { icon: "💡", title: "Property-Level Insights", desc: "Every property page shows: 'This area is predicted to rise 18% in 18 months'" },
        { icon: "📊", title: "Historical Accuracy Tracking", desc: "AI model improves over time as predictions are validated against real sold prices." },
        { icon: "🎯", title: "Investor-Grade Data", desc: "Premium subscription feature — serious investors pay for predictive intelligence." },
      ]}
      howItWorks={[
        { title: "AI scans historical price data", desc: "Analyzes all scraped and listed properties across every district to build price baselines." },
        { title: "External signals are layered in", desc: "Metro announcements, school openings, compound approvals, government infrastructure projects." },
        { title: "Prediction model runs", desc: "Machine learning produces a 12/18/36-month price trajectory with confidence scores." },
        { title: "You see the insight", desc: "Every property and district page shows the forecast clearly: direction, %, and what's driving it." },
      ]}
      whyBrilliant={[
        "No other Arab proptech platform offers predictive pricing — this is a first-mover advantage.",
        "Investors will pay premium subscription just for this data.",
        "Franchise Owners use it to guide area sales strategy.",
        "Differentiates Kemedar as an intelligence platform, not just a listing site.",
      ]}
    />
  );
}