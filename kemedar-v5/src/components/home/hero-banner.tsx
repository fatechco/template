"use client";
// @ts-nocheck

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search, Sparkles, TrendingUp, Shield } from "lucide-react";

const SLIDES = [
  {
    title: "Find Your Dream Home in Egypt",
    subtitle: "Search thousands of properties with AI-powered matching",
    cta: { label: "Search Properties", href: "/search/properties" },
    secondaryCta: { label: "AI Search", href: "/kemedar/ai-search" },
    gradient: "from-blue-700 to-blue-900",
    icon: Search,
  },
  {
    title: "Invest in Fractional Real Estate",
    subtitle: "Own a piece of premium properties starting from 100 EGP",
    cta: { label: "Explore KemeFrac", href: "/kemefrac" },
    secondaryCta: { label: "How It Works", href: "/kemefrac#how" },
    gradient: "from-purple-700 to-indigo-900",
    icon: TrendingUp,
  },
  {
    title: "Verified Properties, Trusted Deals",
    subtitle: "Every property verified with our 5-level Verify Pro system",
    cta: { label: "Browse Verified", href: "/search/properties?isVerified=true" },
    secondaryCta: { label: "Verify Your Property", href: "/kemedar/verify" },
    gradient: "from-emerald-700 to-teal-900",
    icon: Shield,
  },
];

const STATS = [
  { value: "10,000+", label: "Properties" },
  { value: "50,000+", label: "Users" },
  { value: "500+", label: "Projects" },
  { value: "15+", label: "Cities" },
];

export function HeroBanner() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => setCurrent((c) => (c + 1) % SLIDES.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + SLIDES.length) % SLIDES.length), []);

  useEffect(() => {
    const timer = setInterval(next, 6000);
    return () => clearInterval(timer);
  }, [next]);

  const slide = SLIDES[current];

  return (
    <section className="relative overflow-hidden">
      <div className={`bg-gradient-to-br ${slide.gradient} text-white transition-all duration-700`}>
        <div className="container mx-auto max-w-7xl px-4 py-16 md:py-24 relative">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <slide.icon className="w-6 h-6 text-blue-300" />
              <span className="text-blue-200 text-sm font-medium">Kemedar</span>
            </div>
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
              {slide.title}
            </h1>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              {slide.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link href={slide.cta.href} className="bg-white text-blue-700 px-6 py-3 rounded-lg font-semibold text-center hover:bg-blue-50 transition">
                {slide.cta.label}
              </Link>
              <Link href={slide.secondaryCta.href} className="border-2 border-white/50 text-white px-6 py-3 rounded-lg font-semibold text-center hover:bg-white/10 transition">
                {slide.secondaryCta.label}
              </Link>
            </div>
          </div>

          {/* Navigation */}
          <button onClick={prev} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition hidden md:flex">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={next} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition hidden md:flex">
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Dots */}
          <div className="flex justify-center gap-2 mt-8">
            {SLIDES.map((_, i) => (
              <button key={i} onClick={() => setCurrent(i)} className={`w-2.5 h-2.5 rounded-full transition ${i === current ? "bg-white w-8" : "bg-white/40"}`} />
            ))}
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="bg-white border-b">
        <div className="container mx-auto max-w-7xl px-4 py-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="text-2xl font-bold text-blue-600">{stat.value}</div>
                <div className="text-sm text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
