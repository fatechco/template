"use client";
// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import SearchForm from "./SearchForm";

const SLIDES = [
  {
    headline: ["Find Your Next Property.", "Build Your Next Future."],
    subheadline: "Buy, rent, invest, and discover trusted real estate opportunities across homes, projects, agents, and developers — all in one place.",
    highlight: [0], // indices of headline lines to highlight
  },
  {
    headline: ["Where Real Estate", "Meets Opportunity"],
    subheadline: "Discover properties, projects, and trusted partners with a smarter way to search, compare, and invest.",
    highlight: [1],
  },
  {
    headline: ["Search Better. Choose Smarter.", "Move Faster."],
    subheadline: "Kemedar helps you find the right property, connect with the right people, and unlock the right opportunities.",
    highlight: [1],
  },
];

const STATS = [
  { value: "2M+", label: "Properties Listed" },
  { value: "110+", label: "Search Filters" },
  { value: "20+", label: "Free Tools" },
];

export default function HeroBanner() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    if (idx === active || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setAnimating(false);
    }, 300);
  };

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setAnimating(true);
      setTimeout(() => {
        setActive((prev) => (prev + 1) % SLIDES.length);
        setAnimating(false);
      }, 300);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const slide = SLIDES[active];

  return (
    <section className="relative w-full min-h-[560px] flex items-center overflow-hidden p-4 md:p-6">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/69b5eafc884b1597fb3ea66e/da095c8f7_1255.jpg')`,
        }}
      />
      {/* Dark gradient overlay — left-heavy so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0d0d1a]/90 via-[#1a1a2e]/70 to-[#1a1a2e]/20" />

      {/* Decorative accent line */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FF6B00] via-[#FF6B00]/50 to-transparent" />

      <div className="relative z-10 max-w-[1400px] mx-auto px-6 w-full py-4">
        <div className="flex items-center gap-10">
          {/* Left Content — 58% */}
          <div className="flex-[1.45] min-w-0">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#FF6B00]/20 border border-[#FF6B00]/40 rounded-full px-4 py-1.5 mb-6">
              <span className="w-2 h-2 bg-[#FF6B00] rounded-full animate-pulse" />
              <span className="text-[#FF6B00] text-xs font-semibold tracking-wide">KEMEDAR® PROPTECH PLATFORM</span>
            </div>

            {/* Headline */}
            <div
              className="mb-4 transition-all duration-300"
              style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(10px)" : "translateY(0)" }}
            >
              <h1 className="text-4xl xl:text-5xl font-black leading-tight">
                {slide.headline.map((line, i) => (
                  <span key={i} className={`block ${slide.highlight.includes(i) ? "text-[#FF6B00]" : "text-white"}`}>
                    {line}
                  </span>
                ))}
              </h1>
            </div>

            {/* Subheadline */}
            <div
              className="transition-all duration-300 delay-75"
              style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(10px)" : "translateY(0)" }}
            >
              <p className="text-lg xl:text-xl text-gray-200 mb-8 leading-relaxed max-w-xl">
                {slide.subheadline}
              </p>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 mb-10">
              {STATS.map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl font-black text-[#FF6B00]">{stat.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
                </div>
              ))}
            </div>

            {/* Advisor Entry Card */}
            <Link href="/kemedar/advisor"
              className="flex items-center gap-3 bg-white/10 border border-white/30 hover:bg-white/20 hover:border-orange-400 rounded-2xl px-4 py-3 mb-6 transition-all max-w-md group">
              <div className="w-10 h-10 bg-orange-500/20 rounded-xl flex items-center justify-center text-xl flex-shrink-0 group-hover:bg-orange-500/30">🤖</div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-xs font-black">✨ NEW — Kemedar Advisor</p>
                <p className="text-gray-300 text-xs">Let AI find your perfect property in 5 minutes</p>
              </div>
              <span className="text-orange-400 font-black text-sm flex-shrink-0">→</span>
            </Link>

            {/* CTAs */}
            <div className="flex items-center gap-4 flex-wrap">
              <Link
                href="/search-properties"
                className="inline-flex items-center gap-3 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold text-base px-8 py-4 rounded-xl transition-all shadow-lg shadow-orange-900/40 hover:shadow-orange-900/60 hover:scale-[1.02] active:scale-[0.98]"
              >
                Explore Properties
                <ArrowRight size={20} />
              </Link>
              <Link
                href="/create/property"
                className="inline-flex items-center gap-3 border-2 border-white/40 hover:border-white text-white font-bold text-base px-8 py-4 rounded-xl transition-all hover:bg-white/10"
              >
                <Plus size={18} />
                List Your Property
              </Link>
            </div>

            {/* Slide dots */}
            <div className="flex items-center gap-2 mt-8">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={`rounded-full transition-all duration-300 ${
                    i === active ? "w-8 h-2.5 bg-[#FF6B00]" : "w-2.5 h-2.5 bg-white/30 hover:bg-white/60"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Right: Search Card — 42% */}
          <div className="flex-1 min-w-0 max-w-[420px]">
            <SearchForm />
          </div>
        </div>
      </div>
    </section>
  );
}