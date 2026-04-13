import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import SiteHeader from "@/components/header/SiteHeader";
import SiteFooter from "@/components/home/SiteFooter";
import ExpatJourneyMap from "@/components/expat/ExpatJourneyMap";
import ExpatCurrencyHook from "@/components/expat/ExpatCurrencyHook";

const COUNTRY_CONFIG = {
  uae:  { flag: "🇦🇪", name: "UAE", currency: "AED", rate: 14.3, adjective: "UAE-based" },
  ksa:  { flag: "🇸🇦", name: "Saudi Arabia", currency: "SAR", rate: 13.9, adjective: "KSA-based" },
  uk:   { flag: "🇬🇧", name: "United Kingdom", currency: "GBP", rate: 66.0, adjective: "UK-based" },
  usa:  { flag: "🇺🇸", name: "USA", currency: "USD", rate: 52.5, adjective: "US-based" },
  default: { flag: "🌍", name: "abroad", currency: "USD", rate: 52.5, adjective: "" },
};

const SAMPLE_PROPERTIES = [
  { name: "3BR Apartment, New Cairo", egp: 3_500_000, img: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400&q=80" },
  { name: "2BR Apartment, 6th October", egp: 1_800_000, img: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=400&q=80" },
  { name: "Villa, Sheikh Zayed", egp: 9_500_000, img: "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400&q=80" },
];

const TESTIMONIALS = [
  { flag: "🇦🇪", name: "Khaled M.", location: "Dubai, UAE", text: "I bought my apartment in 5th Settlement without visiting Egypt once. My FO visited 4 properties, negotiated 8% off, and I signed everything digitally. The whole process took 6 weeks.", property: "3BR — New Cairo" },
  { flag: "🇬🇧", name: "Sara A.", location: "London, UK", text: "The monthly management reports give me complete peace of mind. I see every EGP — rent collected, maintenance done, and my FO sends a personal voice note each month. Incredible service.", property: "2BR — Maadi, Managed" },
  { flag: "🇸🇦", name: "Tarek H.", location: "Riyadh, KSA", text: "My FO Omar spotted a legal issue in the first property that saved me from disaster. He is thorough, honest, and speaks perfect English. I've now bought two properties through Kemedar.", property: "Villa — Sheikh Zayed" },
];

export default function ExpatLanding() {
  const location = useLocation();
  const countrySlug = location.pathname.split("/").pop(); // uae, ksa, uk, usa
  const config = COUNTRY_CONFIG[countrySlug] || COUNTRY_CONFIG.default;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiteHeader />

      {/* HERO */}
      <div className="relative bg-[#0d1b3e] text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20 bg-gradient-to-br from-orange-900 to-blue-900" />
        <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80" alt="Egypt" className="absolute inset-0 w-full h-full object-cover opacity-10" />
        <div className="relative z-10 max-w-5xl mx-auto px-6 py-20 text-center">
          <div className="inline-flex items-center gap-2 bg-orange-500/20 border border-orange-400/30 text-orange-300 font-bold text-sm px-4 py-1.5 rounded-full mb-6">
            {config.flag} Kemedar Expat™ — Built for Egyptians {config.adjective ? `in the ${config.name}` : "abroad"}
          </div>
          <h1 className="text-4xl sm:text-5xl font-black leading-tight mb-4">
            Own Property in Egypt.<br />
            <span className="text-orange-400">Without Leaving {config.name}.</span>
          </h1>
          <p className="text-lg text-blue-200 max-w-2xl mx-auto mb-8">
            From search to purchase to monthly rent — managed remotely by a verified local Franchise Owner. 100% digital, legally secure, fully transparent.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Link to="/kemedar/expat/setup" className="bg-orange-500 hover:bg-orange-400 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all hover:scale-105 shadow-xl">
              Start My Expat Profile →
            </Link>
            <Link to="/search-properties" className="border-2 border-white/30 text-white font-bold px-6 py-4 rounded-2xl hover:bg-white/10 transition-all">
              Browse Properties
            </Link>
          </div>
          {/* Trust pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-blue-200">
            {["✅ No Egypt visit required", "💱 Pay in " + config.currency, "🤝 Verified Franchise Owner", "🔒 Escrow™ protected", "⚖️ 100% legal & digital"].map(t => (
              <span key={t} className="bg-white/10 border border-white/20 px-3 py-1.5 rounded-full">{t}</span>
            ))}
          </div>
        </div>
      </div>

      {/* CURRENCY HOOK */}
      <ExpatCurrencyHook currency={config.currency} rate={config.rate} flag={config.flag} properties={SAMPLE_PROPERTIES} />

      {/* COMPLETE JOURNEY */}
      <div className="bg-white py-16">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-orange-500 font-bold text-sm uppercase tracking-widest mb-2">End-to-End Process</p>
            <h2 className="text-3xl font-black text-gray-900">Your Complete Expat Investment Journey</h2>
            <p className="text-gray-500 mt-2">From discovery to monthly returns — every step handled remotely</p>
          </div>
          <ExpatJourneyMap currency={config.currency} />
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-black text-gray-900 text-center mb-10">What Expats Are Saying</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(t => (
              <div key={t.name} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">{t.flag}</div>
                  <div>
                    <p className="font-black text-gray-900 text-sm">{t.name}</p>
                    <p className="text-xs text-gray-400">{t.location}</p>
                    <p className="text-[10px] text-orange-600 font-bold mt-0.5">{t.property}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed italic">"{t.text}"</p>
                <div className="flex mt-3">{"⭐⭐⭐⭐⭐".split("").map((s, i) => <span key={i}>{s}</span>)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="bg-[#0d1b3e] py-16 text-center text-white">
        <h2 className="text-3xl font-black mb-3">Ready to Invest in Egypt?</h2>
        <p className="text-blue-200 mb-8">Create your free expat profile. We'll match you with a local FO in minutes.</p>
        <Link to="/kemedar/expat/setup" className="inline-block bg-orange-500 hover:bg-orange-400 text-white font-black px-10 py-4 rounded-2xl text-xl transition-all hover:scale-105 shadow-xl">
          Get Started Free →
        </Link>
        <p className="text-blue-300 text-sm mt-4">Takes 3 minutes · No commitment · FO matched instantly</p>
      </div>

      <SiteFooter />
    </div>
  );
}