import { Link } from "react-router-dom";
import { CheckCircle } from "lucide-react";

const BENEFITS = [
  { icon: "✅", label: "Free to Start" },
  { icon: "📦", label: "Easy Management" },
  { icon: "💰", label: "Competitive Commission" },
];

export default function KemetroBecomeSellerBanner() {
  return (
    <section className="w-full bg-gradient-to-r from-teal-500 to-green-500 py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-12">
          {/* Left side */}
          <div className="flex-1">
            <div className="text-5xl mb-6">🏪</div>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Sell on Kemetro —<br />
              Reach Thousands of Buyers
            </h2>
            <p className="text-white/90 text-lg mb-6 max-w-lg">
              Join hundreds of verified suppliers and grow your business online.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap gap-3">
              {BENEFITS.map((benefit) => (
                <div
                  key={benefit.label}
                  className="inline-flex items-center gap-2 bg-white/20 border border-white/40 rounded-full px-4 py-2 text-white font-semibold text-sm"
                >
                  <span>{benefit.icon}</span>
                  {benefit.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right side — CTA Button */}
          <div className="flex-1 flex items-center justify-center md:justify-end">
            <Link
              to="/kemetro/seller/register"
              className="inline-flex items-center gap-3 bg-white text-gray-900 font-black text-lg px-10 py-5 rounded-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95"
            >
              Open Your Store Now →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}