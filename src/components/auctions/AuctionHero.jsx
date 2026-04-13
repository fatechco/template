import { useState, useEffect } from "react";
import { Zap } from "lucide-react";

const AnimatedCounter = ({ value, duration = 2 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    const steps = 60;
    const stepDuration = (duration * 1000) / steps;
    const increment = value / steps;
    let current = 0;
    let step = 0;

    const timer = setInterval(() => {
      step++;
      current = Math.floor(increment * step);
      setDisplayValue(current);
      if (step >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      }
    }, stepDuration);

    return () => clearInterval(timer);
  }, [value, duration]);

  return displayValue.toLocaleString();
};

export default function AuctionHero({ stats }) {
  const [isAnimating, setIsAnimating] = useState(true);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-[#1C1917] via-[#1C1917] to-[#DC2626]/20 py-20 lg:py-24">
      {/* Animated diagonal stripe background */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#DC2626] to-transparent rotate-45 transform scale-150" />
      </div>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 text-center flex flex-col items-center">
        {/* Icon with bounce animation */}
        <div className="mb-6 animate-bounce">
          <span className="text-7xl">🔨</span>
        </div>

        {/* Title */}
        <div className="mb-4">
          <p className="text-[#F59E0B] text-sm font-black uppercase tracking-widest mb-2">
            🔨 KemedarBid™
          </p>
          <h1 className="text-4xl lg:text-5xl font-black text-white mb-4 leading-tight">
            Property Auctions
          </h1>
          <p className="text-white/80 text-lg max-w-2xl mx-auto">
            Bid smart. Win real. Compete with verified buyers for Egypt's most exclusive properties.
          </p>
        </div>

        {/* Live Stats Strip */}
        <div className="flex flex-wrap justify-center gap-6 lg:gap-8 my-12 py-6 border-y border-white/10">
          <div className="text-center">
            <div className="text-2xl font-black text-white">
              <span className="inline-block w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
              <AnimatedCounter value={stats.live} />
            </div>
            <p className="text-sm text-gray-400 mt-1">Auctions Live Now</p>
          </div>
          <div className="hidden sm:block w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-black text-white">
              <AnimatedCounter value={stats.endingToday} />
            </div>
            <p className="text-sm text-gray-400 mt-1">Ending Today</p>
          </div>
          <div className="hidden sm:block w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-black text-white">
              <AnimatedCounter value={Math.floor(Math.random() * 3000) + 1000} />
            </div>
            <p className="text-sm text-gray-400 mt-1">Registered Bidders</p>
          </div>
          <div className="hidden sm:block w-px bg-white/10" />
          <div className="text-center">
            <div className="text-2xl font-black text-white">
              <AnimatedCounter value={Math.floor(Math.random() * 500000) + 100000} />M
            </div>
            <p className="text-sm text-gray-400 mt-1">EGP in Active Bids</p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href="#auctions"
            className="px-8 py-3 bg-[#F59E0B] hover:bg-[#D97706] text-white font-black rounded-xl text-sm transition-colors"
          >
            🔨 Browse All Auctions
          </a>
          <a
            href="/kemedar/auctions/how-it-works"
            className="px-8 py-3 border-2 border-white text-white hover:bg-white/5 font-black rounded-xl text-sm transition-colors"
          >
            📋 How Auctions Work
          </a>
        </div>
      </div>
    </div>
  );
}