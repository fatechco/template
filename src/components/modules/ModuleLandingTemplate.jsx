import { Link } from "react-router-dom";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";

export default function ModuleLandingTemplate({
  badge,
  badgeColor = "bg-orange-100 text-orange-700",
  emoji,
  title,
  subtitle,
  tagline,
  heroGradient = "from-gray-900 via-slate-900 to-gray-900",
  accentColor = "text-orange-400",
  ctaTo,
  ctaLabel,
  ctaColor = "bg-orange-500 hover:bg-orange-600",
  secondaryCta,
  features,
  howItWorks,
  whyBrilliant,
  phase,
}) {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <SiteHeader />

      {/* Hero */}
      <div className={`bg-gradient-to-br ${heroGradient} text-white py-20 px-6`}>
        <div className="max-w-4xl mx-auto text-center">
          <span className={`inline-block ${badgeColor} text-xs font-black px-3 py-1.5 rounded-full mb-5`}>
            {badge}
          </span>
          <div className="text-6xl mb-4">{emoji}</div>
          <h1 className="text-4xl sm:text-5xl font-black mb-4 leading-tight">
            <span className={accentColor}>{title}</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-4">{subtitle}</p>
          {tagline && (
            <p className="text-sm text-gray-400 italic mb-8">{tagline}</p>
          )}
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to={ctaTo} className={`${ctaColor} text-white font-black px-8 py-4 rounded-2xl text-base transition`}>
              {ctaLabel}
            </Link>
            {secondaryCta && (
              <Link to={secondaryCta.to} className="border border-white/30 text-white font-bold px-6 py-4 rounded-2xl text-sm hover:bg-white/10 transition">
                {secondaryCta.label}
              </Link>
            )}
          </div>
          {phase && (
            <p className="mt-6 text-xs text-gray-500">Implementation: {phase}</p>
          )}
        </div>
      </div>

      {/* Features */}
      {features && features.length > 0 && (
        <div className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-10">What You Get</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-md transition">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* How It Works */}
      {howItWorks && howItWorks.length > 0 && (
        <div className="bg-gray-50 py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-black text-gray-900 text-center mb-10">How It Works</h2>
            <div className="space-y-4">
              {howItWorks.map((step, i) => (
                <div key={i} className="flex items-start gap-4 bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                  <div className="w-10 h-10 rounded-xl bg-orange-500 text-white font-black flex items-center justify-center flex-shrink-0 text-lg">
                    {i + 1}
                  </div>
                  <div>
                    <p className="font-black text-gray-900 mb-1">{step.title}</p>
                    <p className="text-sm text-gray-500 leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Why Brilliant */}
      {whyBrilliant && (
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="bg-gradient-to-br from-gray-900 to-slate-800 rounded-3xl p-8 text-white">
            <h2 className="text-xl font-black mb-5">💡 Why This Changes Everything</h2>
            <ul className="space-y-3">
              {whyBrilliant.map((item, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="text-orange-400 mt-0.5 flex-shrink-0">✦</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Bottom CTA */}
      <div className="bg-gray-50 py-16 px-6 text-center">
        <h2 className="text-2xl font-black text-gray-900 mb-3">Ready to get started?</h2>
        <p className="text-gray-500 mb-6">Join thousands of users on the Kemedar platform</p>
        <Link to={ctaTo} className={`${ctaColor} text-white font-black px-10 py-4 rounded-2xl text-base transition`}>
          {ctaLabel}
        </Link>
      </div>

      <SiteFooter />
    </div>
  );
}