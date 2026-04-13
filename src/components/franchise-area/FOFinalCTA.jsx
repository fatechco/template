import { Link } from "react-router-dom";

const APPLY_URL = "https://kemodoo.com/register-franchise-owner-area";

const TRUST = [
  { icon: "🔒", label: "Secure Application" },
  { icon: "⚡", label: "24-Hour Response" },
  { icon: "🌍", label: "Operating in 30+ Countries" },
];

export default function FOFinalCTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-[#FF6B00] to-[#e55a00] relative overflow-hidden">
      <div className="absolute left-10 top-1/2 -translate-y-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
      <div className="absolute right-10 top-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
      <div className="relative max-w-[1400px] mx-auto px-4 text-center">
        <h2 className="text-4xl xl:text-5xl font-black text-white mb-4">Your Territory is Waiting.</h2>
        <p className="text-white/80 text-lg mb-10 max-w-xl mx-auto">
          Join the fastest growing real estate tech franchise network in the world.
        </p>
        <div className="flex items-center justify-center gap-4 flex-wrap mb-10">
          <a href={APPLY_URL} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-[#1a1a2e] font-black px-8 py-4 rounded-xl transition-all text-base shadow-lg hover:scale-[1.02]">
            Apply Now — It's Free
          </a>
          <Link to="/contact"
            className="inline-flex items-center gap-2 border-2 border-white hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all text-base">
            Talk to Our Team
          </Link>
        </div>
        <div className="flex items-center justify-center gap-8 flex-wrap">
          {TRUST.map(t => (
            <div key={t.label} className="flex items-center gap-2 text-white/80 text-sm font-semibold">
              <span>{t.icon}</span> {t.label}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}