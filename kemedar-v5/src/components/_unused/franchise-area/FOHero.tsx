"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import { ChevronDown, Download } from "lucide-react";

const APPLY_URL = "https://kemodoo.com/register-franchise-owner-area";
const BACKGROUNDS = [
  "Real Estate Professional", "Entrepreneur", "Investor", "Corporate Executive", "Other"
];

export default function FOHero() {
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({ country: "", city: "", background: "", phone: "" });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    apiClient.list("/api/v1/country").then(setCountries).catch(() => {});
  }, []);

  return (
    <section className="relative w-full bg-gradient-to-br from-[#1a1a2e] to-[#0f3460] overflow-hidden">
      {/* City skyline overlay */}
      <div className="absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=1600&q=60')", backgroundSize: "cover", backgroundPosition: "center bottom" }} />
      {/* Decorative glows */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF6B00] rounded-full blur-3xl opacity-10 -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500 rounded-full blur-3xl opacity-10 translate-y-1/2 -translate-x-1/4" />

      <div className="relative max-w-[1400px] mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* LEFT */}
          <div className="flex-[1.5] min-w-0">
            <div className="inline-flex items-center gap-2 bg-[#FF6B00]/20 border border-[#FF6B00]/40 rounded-full px-4 py-1.5 mb-6">
              <span className="text-[#FF6B00] text-xs font-bold tracking-wide">🌍 NOW OPEN IN 30+ COUNTRIES</span>
            </div>
            <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-5">
              Own Your Territory.<br />
              <span className="text-[#FF6B00]">Build Your Real Estate Empire.</span>
            </h1>
            <p className="text-lg text-gray-300 mb-8 leading-relaxed max-w-xl">
              Become a Kemedar Area Franchise Owner and lead the Proptech revolution in your region with the world's most advanced real estate Super App.
            </p>
            <div className="flex items-center gap-4 flex-wrap mb-10">
              <a href={APPLY_URL} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black px-8 py-4 rounded-xl transition-all shadow-lg shadow-orange-900/40 text-base hover:scale-[1.02]">
                Apply Now
              </a>
              <button className="inline-flex items-center gap-2 border-2 border-white/60 hover:border-white text-white font-bold px-8 py-4 rounded-xl transition-all hover:bg-white/10 text-base">
                <Download size={18} /> Download Franchise Guide
              </button>
            </div>
            <div className="flex items-center gap-8 flex-wrap">
              {[["🌍", "30+", "Countries"], ["🏙", "200+", "Cities"], ["💰", "Proven", "Revenue Model"]].map(([emoji, val, label]) => (
                <div key={label} className="text-center">
                  <p className="text-2xl font-black text-[#FF6B00]">{emoji} {val}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Eligibility card */}
          <div className="w-full lg:w-[380px] flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-2xl p-7">
              <h3 className="text-lg font-black text-gray-900 mb-5">Quick Eligibility Check</h3>
              {submitted ? (
                <div className="text-center py-6">
                  <div className="text-4xl mb-3">✅</div>
                  <p className="font-black text-gray-900">Submitted!</p>
                  <p className="text-sm text-gray-500 mt-1">Our team will contact you within 24 hours.</p>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="flex flex-col gap-3">
                  <div className="relative">
                    <select value={form.country} onChange={e => setForm({ ...form, country: e.target.value })}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 pr-8">
                      <option value="">Select Country</option>
                      {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <input placeholder="City / Area" value={form.city} onChange={e => setForm({ ...form, city: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                  <div className="relative">
                    <select value={form.background} onChange={e => setForm({ ...form, background: e.target.value })}
                      className="w-full appearance-none border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 pr-8">
                      <option value="">Your Background</option>
                      {BACKGROUNDS.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                    <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                  </div>
                  <input type="tel" placeholder="Phone Number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                    className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
                  <button type="submit" className="w-full bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-3 rounded-xl transition-colors text-sm mt-1">
                    Check Availability
                  </button>
                  <p className="text-xs text-gray-400 text-center">Our team will contact you within 24 hours</p>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}