import { useState } from "react";
import { Link } from "react-router-dom";
import KemetroHeader from "@/components/kemetro/header/KemetroHeader";
import KemetroFooter from "@/components/kemetro/footer/KemetroFooter";

const BUYER_STEPS = [
  { num: "1️⃣", title: "Browse & Search", desc: "Find products across 13 categories using our smart search and filters.", icon: "🔍" },
  { num: "2️⃣", title: "Compare", desc: "Compare products side by side by specs, prices, and seller ratings.", icon: "⚖️" },
  { num: "3️⃣", title: "Add to Cart", desc: "Select quantity, choose variants, and add items to your cart.", icon: "🛒" },
  { num: "4️⃣", title: "Checkout", desc: "Choose your delivery address and preferred payment method.", icon: "💳" },
  { num: "5️⃣", title: "Track & Receive", desc: "Track your order in real-time from dispatch to delivery.", icon: "📦" },
];

const SELLER_STEPS = [
  { num: "1️⃣", title: "Register Free", desc: "Create your store in less than 20 minutes — completely free.", icon: "🏪" },
  { num: "2️⃣", title: "Add Products", desc: "List products in under 6 minutes each with our easy product form.", icon: "➕" },
  { num: "3️⃣", title: "Receive Orders", desc: "Get instant notifications when customers place orders on your store.", icon: "🔔" },
  { num: "4️⃣", title: "Ship", desc: "Use Kemetro's verified shippers or your own logistics network.", icon: "🚚" },
  { num: "5️⃣", title: "Get Paid", desc: "Receive payouts directly to your XeedWallet or bank account.", icon: "💰" },
];

export default function KemetroHowItWorks() {
  const [tab, setTab] = useState("buyers");

  const steps = tab === "buyers" ? BUYER_STEPS : SELLER_STEPS;

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <KemetroHeader />

      {/* HERO */}
      <section style={{ background: "linear-gradient(135deg, #0077B6 0%, #005f8e 100%)" }} className="py-16 px-4 text-center">
        <h1 className="text-4xl font-black text-white mb-3">How Kemetro Works</h1>
        <p className="text-blue-100 text-lg">Simple, fast, and designed for the real estate products industry.</p>
      </section>

      <div className="max-w-[900px] mx-auto px-4 py-16">
        {/* Tabs */}
        <div className="flex justify-center gap-3 mb-12">
          {[{ id: "buyers", label: "🛒 For Buyers" }, { id: "sellers", label: "🏪 For Sellers" }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`px-8 py-3 rounded-xl font-black text-sm transition-colors ${tab === t.id ? "bg-[#0077B6] text-white shadow-lg" : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Steps */}
        <div className="space-y-6">
          {steps.map((step, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm flex items-start gap-6 hover:shadow-md transition-shadow">
              <div className="flex-shrink-0 w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center text-3xl">{step.icon}</div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-1">
                  <span className="text-xl">{step.num}</span>
                  <h3 className="text-xl font-black text-gray-900">{step.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{step.desc}</p>
              </div>
              {i < steps.length - 1 && (
                <div className="hidden lg:flex flex-col items-center absolute" />
              )}
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center space-y-4">
          {tab === "buyers" ? (
            <>
              <p className="text-gray-600">Ready to find the best products?</p>
              <Link to="/kemetro" className="inline-block bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-8 py-3 rounded-xl transition-colors">Start Shopping →</Link>
            </>
          ) : (
            <>
              <p className="text-gray-600">Ready to start selling?</p>
              <Link to="/kemetro/seller/register" className="inline-block bg-[#FF6B00] hover:bg-orange-600 text-white font-black px-8 py-3 rounded-xl transition-colors">Open Your Free Store →</Link>
            </>
          )}
        </div>
      </div>

      <KemetroFooter />
    </div>
  );
}