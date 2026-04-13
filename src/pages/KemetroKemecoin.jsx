import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const TIERS = [
  { name: "Bronze", icon: "🥉", minSales: "$0", rate: "1 coin / $10 sold", perks: ["Basic rewards", "Redeem for cash", "Monthly payouts"] },
  { name: "Silver", icon: "🥈", minSales: "$12,000", rate: "1 coin / $2.50 sold", perks: ["Bonus coins on promotions", "Redeem for cash or shares", "Priority support"] },
  { name: "Gold", icon: "🥇", minSales: "$50,000", rate: "1 coin / $2 sold", perks: ["Exclusive deals", "Double coins on flash sales", "Early access to features", "Dedicated account manager"] },
];

const REDEMPTIONS = [
  { icon: "💵", title: "Cash Payout", desc: "Convert your Kemecoins directly into cash, transferred to your XeedWallet or bank account." },
  { icon: "📈", title: "Company Shares", desc: "Exchange your Kemecoins for equity shares in the Kemedar Group — grow with us as we grow." },
  { icon: "🎁", title: "Store Credits", desc: "Use Kemecoins as credits towards your subscription plan or promotional features." },
];

const FAQS = [
  { q: "How do I earn Kemecoins?", a: "For every $10 in sales you generate on Kemetro, you automatically earn 1 Kemecoin. Higher seller tiers earn coins faster." },
  { q: "When can I redeem my coins?", a: "You can request a redemption at any time once you have a minimum of 100 Kemecoins in your account." },
  { q: "What is the value of 1 Kemecoin?", a: "1 Kemecoin = $1 USD when redeemed for cash or equivalent in company shares, based on the current valuation." },
  { q: "Can I lose my Kemecoins?", a: "Kemecoins don't expire as long as your seller account remains active. Inactive accounts for 12+ months may be subject to forfeiture." },
];

export default function KemetroKemecoin() {
  const [openFaq, setOpenFaq] = useState(null);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0a0a2e 0%, #1a1a5e 100%)" }} className="py-20 px-4 text-center">
        <div className="text-6xl mb-4">💰</div>
        <h1 className="text-4xl lg:text-5xl font-black text-white mb-4">Earn Kemecoin on Every Sale</h1>
        <p className="text-gray-300 text-lg max-w-xl mx-auto">Every sale you make earns you Kemecoins — redeemable for real cash or company shares.</p>
      </section>

      {/* HOW IT WORKS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[800px] mx-auto text-center space-y-8">
          <h2 className="text-3xl font-black text-gray-900">How It Works</h2>
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-2xl p-10">
            <p className="text-6xl font-black text-yellow-600 mb-3">$10 = 1 💰</p>
            <p className="text-2xl font-black text-gray-900">For every $10 sold → 1 Kemecoin earned</p>
            <p className="text-gray-500 mt-3">Coins are automatically added to your wallet after each completed order.</p>
          </div>
        </div>
      </section>

      {/* REDEMPTION OPTIONS */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Redemption Options</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {REDEMPTIONS.map((r) => (
              <div key={r.title} className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                <div className="text-4xl mb-3">{r.icon}</div>
                <h3 className="font-black text-gray-900 mb-2">{r.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TIERS */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-[900px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">Seller Tier Levels</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TIERS.map((t) => (
              <div key={t.name} className="bg-[#F8FAFC] rounded-2xl border border-gray-200 p-6 space-y-4 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{t.icon}</span>
                  <h3 className="font-black text-gray-900 text-xl">{t.name}</h3>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Min. Sales</p>
                  <p className="font-black text-gray-900">{t.minSales}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-400">Earn Rate</p>
                  <p className="font-black text-yellow-600">{t.rate}</p>
                </div>
                <div className="space-y-1.5 pt-2 border-t border-gray-200">
                  {t.perks.map((p) => (
                    <div key={p} className="flex items-center gap-2 text-sm text-gray-700"><span className="text-yellow-500">✓</span> {p}</div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 px-4 bg-[#F8FAFC]">
        <div className="max-w-[700px] mx-auto">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-8">Frequently Asked Questions</h2>
          <div className="space-y-2">
            {FAQS.map((faq, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)} className="w-full flex items-center justify-between px-5 py-4 text-left">
                  <span className="font-bold text-gray-900 pr-4">{faq.q}</span>
                  {openFaq === i ? <ChevronUp size={16} className="text-gray-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-gray-400 flex-shrink-0" />}
                </button>
                {openFaq === i && <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-3">{faq.a}</div>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4" style={{ background: "linear-gradient(135deg, #0a0a2e 0%, #1a1a5e 100%)" }}>
        <div className="max-w-[500px] mx-auto text-center space-y-4">
          <h2 className="text-3xl font-black text-white">Start Earning Kemecoins Today</h2>
          <p className="text-gray-300">Open your free store and start earning on every sale.</p>
          <Link to="/kemetro/seller/register" className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-black px-8 py-3 rounded-xl transition-colors">Open Your Free Store →</Link>
        </div>
      </section>

      <KemetroFooter />
    </div>
  );
}