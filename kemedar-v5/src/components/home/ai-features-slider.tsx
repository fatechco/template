"use client";
// @ts-nocheck

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Brain, TrendingUp, Compass, Eye, MapPin, MessageSquare, Star, Shield, ArrowLeftRight, Gavel, BarChart3, Dna, Wrench, Package, Palette, Calculator, Zap, Award, Hammer, Home } from "lucide-react";

const KEMEDAR_FEATURES = [
  { icon: TrendingUp, title: "Predict", desc: "AI price predictions", href: "/kemedar/predict", color: "from-blue-500 to-cyan-500" },
  { icon: Compass, title: "Match", desc: "Smart property matching", href: "/kemedar/match", color: "from-purple-500 to-pink-500" },
  { icon: Star, title: "Coach", desc: "Personal real estate guide", href: "/kemedar/coach", color: "from-amber-500 to-orange-500" },
  { icon: Eye, title: "Vision", desc: "AI image analysis", href: "/kemedar/vision", color: "from-emerald-500 to-teal-500" },
  { icon: MapPin, title: "Life Score", desc: "Neighborhood scoring", href: "/kemedar/life-score", color: "from-green-500 to-lime-500" },
  { icon: MessageSquare, title: "Negotiate", desc: "AI negotiation coach", href: "/kemedar/negotiate", color: "from-sky-500 to-blue-500" },
  { icon: Brain, title: "Advisor", desc: "Personal property advisor", href: "/kemedar/advisor", color: "from-violet-500 to-purple-500" },
  { icon: Shield, title: "Verify Pro", desc: "5-level verification", href: "/kemedar/verify", color: "from-emerald-500 to-green-500" },
  { icon: ArrowLeftRight, title: "Swap", desc: "Property exchange", href: "/kemedar/swap", color: "from-rose-500 to-pink-500" },
  { icon: Gavel, title: "KemedarBid", desc: "Property auctions", href: "/kemedar/auctions", color: "from-red-500 to-orange-500" },
  { icon: BarChart3, title: "KemeFrac", desc: "Fractional ownership", href: "/kemefrac", color: "from-indigo-500 to-blue-500" },
  { icon: Dna, title: "DNA", desc: "Property preference DNA", href: "/kemedar/dna", color: "from-fuchsia-500 to-pink-500" },
];

interface AIFeaturesSliderProps {
  title: string;
  subtitle?: string;
  features?: typeof KEMEDAR_FEATURES;
}

export function AIFeaturesSlider({ title, subtitle, features = KEMEDAR_FEATURES }: AIFeaturesSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      if (scrollRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          scrollRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollRef.current.scrollBy({ left: 220, behavior: "smooth" });
        }
      }
    }, 3000);
    return () => clearInterval(timer);
  }, [isPaused]);

  return (
    <section className="py-10 px-4 bg-slate-50">
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold">{title}</h2>
            {subtitle && <p className="text-slate-500 text-sm mt-1">{subtitle}</p>}
          </div>
          <div className="flex gap-2">
            <button onClick={() => scrollRef.current?.scrollBy({ left: -220, behavior: "smooth" })} className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-white">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 220, behavior: "smooth" })} className="w-8 h-8 border rounded-full flex items-center justify-center hover:bg-white">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div
          ref={scrollRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-auto snap-x scrollbar-hide pb-2"
        >
          {features.map((f) => (
            <Link
              key={f.title}
              href={f.href}
              className="min-w-[200px] snap-start bg-white rounded-xl border p-4 hover:shadow-md transition group"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${f.color} flex items-center justify-center text-white mb-3 group-hover:scale-110 transition-transform`}>
                <f.icon className="w-5 h-5" />
              </div>
              <h3 className="font-semibold text-sm">{f.title}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{f.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
