import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle, Award, Zap, TrendingUp } from "lucide-react";
import MobileBottomNav from "@/components/mobile-v2/MobileBottomNav";

const BENEFITS = [
  { icon: "⭐", title: "Higher Visibility", desc: "Featured in search results and get more clients" },
  { icon: "📊", title: "Exclusive Opportunities", desc: "Access to premium tasks and clients" },
  { icon: "💰", title: "Better Rates", desc: "Command higher rates and attract quality clients" },
  { icon: "🏆", title: "Badge & Recognition", desc: "Display 'Preferred Professional' badge on profile" },
  { icon: "📱", title: "Priority Support", desc: "Dedicated support team for faster assistance" },
  { icon: "📈", title: "Growth Tools", desc: "Analytics and insights to grow your business" },
];

const REQUIREMENTS = [
  { text: "Minimum 4.8 star rating", icon: "⭐" },
  { text: "At least 50 completed tasks", icon: "✅" },
  { text: "Zero cancellations in last 90 days", icon: "🎯" },
  { text: "100% response rate", icon: "💬" },
  { text: "Verification status active", icon: "🔐" },
];

const PRICING = [
  { duration: "Monthly", price: "49", popular: false },
  { duration: "Quarterly", price: "129", popular: true },
  { duration: "Annually", price: "399", popular: false },
];

export default function KemeworkPreferredProMobile() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-gray-100 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate(-1)} className="p-1">
          <ArrowLeft size={22} className="text-gray-700" />
        </button>
        <h1 className="font-black text-gray-900">Preferred Professional</h1>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 px-4 py-8">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">⭐</div>
          <h2 className="text-2xl font-black text-gray-900 mb-2">Become a Preferred Professional</h2>
          <p className="text-sm text-gray-600">Get featured, earn more, and grow your business</p>
        </div>
        <button onClick={() => navigate("/m/kemework/home")} className="w-full py-3 rounded-xl font-bold text-white text-base" style={{ background: "#C41230" }}>
          🚀 Apply Now
        </button>
      </div>

      {/* Benefits */}
      <div className="px-4 py-6">
        <h3 className="font-black text-gray-900 text-lg mb-4">Why Join?</h3>
        <div className="space-y-3">
          {BENEFITS.map((b, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 flex items-start gap-3">
              <div className="text-2xl flex-shrink-0">{b.icon}</div>
              <div>
                <p className="font-bold text-gray-900 text-sm">{b.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{b.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Requirements */}
      <div className="px-4 py-6 bg-white border-t border-gray-100">
        <h3 className="font-black text-gray-900 text-lg mb-4">Requirements</h3>
        <div className="space-y-2">
          {REQUIREMENTS.map((r, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="text-lg">{r.icon}</span>
              <span className="text-gray-700 font-semibold">{r.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Pricing */}
      <div className="px-4 py-6">
        <h3 className="font-black text-gray-900 text-lg mb-4">Pricing</h3>
        <div className="space-y-3">
          {PRICING.map((p, i) => (
            <div
              key={i}
              className={`rounded-xl p-4 border-2 transition-all ${
                p.popular
                  ? "border-red-600 bg-red-50 shadow-md"
                  : "border-gray-100 bg-white"
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  {p.popular && (
                    <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: "#C41230", color: "#fff" }}>
                      MOST POPULAR
                    </span>
                  )}
                  <p className={`text-base font-bold mt-2 ${p.popular ? "text-gray-900" : "text-gray-600"}`}>{p.duration}</p>
                </div>
                <div>
                  <p className="text-2xl font-black" style={{ color: "#C41230" }}>${p.price}</p>
                  <p className="text-xs text-gray-500">/ {p.duration.toLowerCase()}</p>
                </div>
              </div>
              <button className="w-full py-2.5 rounded-lg font-bold text-sm mt-3"
                style={{
                  background: p.popular ? "#C41230" : "#fff",
                  color: p.popular ? "#fff" : "#C41230",
                  border: `2px solid #C41230`
                }}
              >
                Select Plan
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ */}
      <div className="px-4 py-6 bg-white border-t border-gray-100">
        <h3 className="font-black text-gray-900 text-lg mb-4">FAQ</h3>
        <div className="space-y-3">
          {[
            { q: "Can I cancel anytime?", a: "Yes, cancel your subscription anytime from your dashboard" },
            { q: "How do I apply?", a: "You need to meet all requirements, then click 'Apply Now' above" },
            { q: "What if I don't meet requirements?", a: "Focus on building your ratings and completed tasks to qualify" },
          ].map((faq, i) => (
            <div key={i} className="bg-gray-50 rounded-lg p-3">
              <p className="font-bold text-sm text-gray-900 mb-1">{faq.q}</p>
              <p className="text-xs text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
      <MobileBottomNav />
    </div>
  );
}