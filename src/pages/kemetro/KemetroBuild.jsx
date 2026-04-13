import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Upload, Calculator, ShoppingCart, Users, Building2, Home, Hammer } from "lucide-react";

const HOW_IT_WORKS = [
  { step: 1, icon: "📐", title: "Upload Floor Plan", desc: "Or enter room dimensions manually — takes 2 minutes" },
  { step: 2, icon: "🎨", title: "Choose Your Style", desc: "Finishing level and material preferences" },
  { step: 3, icon: "🤖", title: "AI Generates BOQ", desc: "Complete material list with quantities in 60 seconds" },
  { step: 4, icon: "🛒", title: "Order from Kemetro", desc: "All materials, one cart, staged delivery" },
];

const USE_CASES = [
  {
    icon: "🏠", label: "Planning Your Home", color: "from-teal-500 to-teal-600",
    desc: "Know your budget BEFORE calling contractors. Compare 3 quality levels side by side.",
    stat: "Avg. time saved: 3 days", user: "Homeowner"
  },
  {
    icon: "👷", label: "Pricing for Clients", color: "from-blue-500 to-blue-600",
    desc: "Generate professional BOQs in minutes. Share with clients. Order materials with one click.",
    stat: "Avg. time saved: 2 days per project", user: "Contractor"
  },
  {
    icon: "🏗️", label: "Multi-Unit Planning", color: "from-purple-500 to-purple-600",
    desc: "BOQ one unit, multiply for entire floor or building. Group buy for maximum discount.",
    stat: "Avg. savings: 15-25% on materials", user: "Developer"
  },
];

const STATS = [
  { val: "12,450+", label: "BOQs Generated" },
  { val: "280,000", label: "Avg Project EGP" },
  { val: "3,200+", label: "Contractors Use Daily" },
  { val: "60 sec", label: "Avg Generation Time" },
];

export default function KemetroBuild() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HERO */}
      <div className="relative bg-gray-900 overflow-hidden" style={{ minHeight: 380 }}>
        <div className="absolute inset-0 bg-gradient-to-br from-teal-900/60 via-gray-900 to-gray-900" />
        <img
          src="https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=1400&q=80"
          alt="Construction"
          className="absolute inset-0 w-full h-full object-cover opacity-15"
        />
        <div className="relative z-10 max-w-4xl mx-auto px-6 py-16 text-center">
          <div className="inline-flex items-center gap-2 bg-teal-500/20 border border-teal-400/30 text-teal-300 font-bold text-sm px-4 py-1.5 rounded-full mb-5 tracking-widest uppercase">
            🏗️ Kemetro Build™
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
            Know Exactly What You Need<br />
            <span className="text-teal-400">Before You Buy a Single Tile</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
            Upload your floor plan — AI calculates every material, quantity, and cost in under 60 seconds
          </p>

          {/* Feature pills */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-8">
            {["📐 Precise Quantities", "💰 3 Budget Scenarios", "🛒 Instant Kemetro Order"].map(f => (
              <span key={f} className="bg-white/10 border border-white/20 text-white text-sm font-semibold px-4 py-1.5 rounded-full backdrop-blur-sm">
                {f}
              </span>
            ))}
          </div>

          <button
            onClick={() => navigate("/kemetro/build/new")}
            className="inline-flex items-center gap-3 bg-teal-500 hover:bg-teal-400 text-white font-black px-10 py-4 rounded-2xl text-xl transition-all hover:scale-105 shadow-xl shadow-teal-500/30 mb-4"
          >
            🏗️ Generate My BOQ Free <ArrowRight size={22} />
          </button>

          <p className="text-gray-400 text-sm">
            Works for: <span className="text-gray-300">Apartments • Villas • Offices • Full Renovations</span>
          </p>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="bg-teal-600 py-4">
        <div className="max-w-4xl mx-auto px-6 flex flex-wrap justify-center gap-8">
          {STATS.map(s => (
            <div key={s.label} className="text-center">
              <p className="text-2xl font-black text-white">{s.val}</p>
              <p className="text-xs text-teal-100">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Use Cases */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Who Uses Kemetro Build™?</h2>
        <p className="text-gray-500 text-center mb-10">From homeowners to large developers — everyone saves time and money</p>
        <div className="grid md:grid-cols-3 gap-6">
          {USE_CASES.map(c => (
            <div key={c.user} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:border-teal-300 transition-all hover:shadow-md group">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${c.color} flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform`}>
                {c.icon}
              </div>
              <span className="text-xs font-bold text-teal-600 uppercase tracking-wider">{c.user}</span>
              <h3 className="font-black text-gray-900 text-lg mt-1 mb-2">{c.label}</h3>
              <p className="text-sm text-gray-500 mb-4 leading-relaxed">{c.desc}</p>
              <p className="text-xs font-bold text-teal-600 bg-teal-50 px-3 py-1.5 rounded-full inline-block">{c.stat}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white py-14">
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-2">How It Works</h2>
          <p className="text-gray-500 text-center mb-10">4 simple steps — from floor plan to delivered materials</p>
          <div className="flex flex-col md:flex-row gap-4 items-stretch">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="flex-1 bg-gray-50 rounded-2xl p-6 border border-gray-100 text-center relative">
                {i < HOW_IT_WORKS.length - 1 && (
                  <div className="hidden md:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-gray-300 text-2xl font-black">›</div>
                )}
                <div className="text-4xl mb-3">{item.icon}</div>
                <div className="w-7 h-7 bg-teal-500 text-white rounded-full text-xs font-black flex items-center justify-center mx-auto mb-2">{item.step}</div>
                <h3 className="font-black text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="max-w-5xl mx-auto px-6 py-14 text-center">
        <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-10">
          <h2 className="text-3xl font-black text-white mb-3">Ready to Build Smarter?</h2>
          <p className="text-gray-400 mb-8">Free BOQ generator. No account required to generate. Sign in to save and order.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => navigate("/kemetro/build/new")}
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-black px-8 py-4 rounded-2xl text-lg transition-all shadow-lg"
            >
              🚀 Start My BOQ <ArrowRight size={20} />
            </button>
            <Link
              to="/kemetro/build/my-projects"
              className="inline-flex items-center gap-2 border-2 border-white/20 text-white font-bold px-8 py-4 rounded-2xl text-lg hover:bg-white/10 transition-all"
            >
              📋 My Saved Projects
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}