import { Link } from "react-router-dom";
import { Store, Package, DollarSign, ArrowRight } from "lucide-react";

export default function KemetroBecomeSeller() {
  return (
    <section className="w-full bg-gradient-to-r from-teal-600 to-green-600 py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left content */}
          <div className="flex-1 text-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center">
                <Store size={32} />
              </div>
            </div>

            <h2 className="text-3xl lg:text-4xl font-black mb-3">
              Sell on Kemetro —<br />
              Reach Thousands of Buyers
            </h2>
            <p className="text-lg text-white/90 mb-8 max-w-xl">
              Join hundreds of verified suppliers and grow your business online. Access millions of buyers and manage your store with ease.
            </p>

            {/* Benefits */}
            <div className="flex flex-wrap gap-3">
              {[
                { icon: "✅", label: "Free to Start" },
                { icon: "📦", label: "Easy Management" },
                { icon: "💰", label: "Competitive Commission" },
              ].map((benefit) => (
                <div
                  key={benefit.label}
                  className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg px-4 py-2.5 flex items-center gap-2 text-sm font-semibold"
                >
                  <span className="text-lg">{benefit.icon}</span>
                  {benefit.label}
                </div>
              ))}
            </div>
          </div>

          {/* Right CTA */}
          <div className="flex-shrink-0">
            <Link
              to="/kemetro/seller/register"
              className="inline-flex items-center gap-3 bg-white text-teal-700 hover:bg-gray-100 font-black text-lg px-10 py-4 rounded-xl transition-all hover:scale-105 shadow-2xl"
            >
              Open Your Store Now
              <ArrowRight size={24} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}