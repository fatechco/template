import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AIFeaturesSlider({ accentColor, title, subtitle, cards, exploreLink = "/sitemap" }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const scrollRef = useRef(null);
  const autoScrollRef = useRef(null);
  const CARD_WIDTH = 280; // card width + gap

  const totalDots = Math.max(0, cards.length - 3);

  const scrollToIndex = useCallback((index) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ left: index * CARD_WIDTH, behavior: "smooth" });
    setActiveIndex(index);
  }, []);

  const prev = () => {
    const next = Math.max(0, activeIndex - 1);
    scrollToIndex(next);
  };

  const next = useCallback(() => {
    const maxIndex = Math.max(0, cards.length - 4);
    const next = activeIndex >= maxIndex ? 0 : activeIndex + 1;
    scrollToIndex(next);
  }, [activeIndex, cards.length, scrollToIndex]);

  useEffect(() => {
    if (isPaused) return;
    autoScrollRef.current = setInterval(next, 4000);
    return () => clearInterval(autoScrollRef.current);
  }, [isPaused, next]);

  return (
    <section
      style={{ background: "#0A1628" }}
      className="w-full py-14"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <Link to="/thinkdar" className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full text-[11px] font-black uppercase tracking-widest transition-all hover:opacity-80" style={{ background: "rgba(99,102,241,0.2)", border: "1px solid #6366F1", color: "#6366F1" }}>
            🧠 ThinkDar™ · The First AI Model Built Exclusively for Real Estate
          </Link>
          <h2 className="text-3xl font-black text-white mb-2">{title}</h2>
          <p className="text-xs font-medium mb-2" style={{ color: accentColor }}>Powered by Kemedar®</p>
          <p className="text-gray-400 text-[15px] max-w-[560px] mx-auto leading-relaxed">{subtitle}</p>
        </div>

        {/* Slider row */}
        <div className="relative flex items-center gap-3">
          {/* Left arrow */}
          <button
            onClick={prev}
            disabled={activeIndex === 0}
            className="hidden md:flex flex-shrink-0 w-11 h-11 rounded-full bg-white items-center justify-center shadow-lg hover:bg-gray-100 transition-colors disabled:opacity-30"
          >
            <ChevronLeft size={20} className="text-gray-800" />
          </button>

          {/* Cards track */}
          <div
            ref={scrollRef}
            className="flex gap-5 overflow-x-auto scroll-smooth no-scrollbar flex-1"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {cards.map((card, i) => (
              <Link
                key={i}
                to={card.link}
                className="flex-shrink-0 flex flex-col rounded-2xl p-6 transition-all duration-250 group"
                style={{
                  width: "260px",
                  minHeight: "200px",
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  scrollSnapAlign: "start",
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.10)";
                  e.currentTarget.style.border = `1px solid ${accentColor}`;
                  e.currentTarget.style.transform = "translateY(-4px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                  e.currentTarget.style.border = "1px solid rgba(255,255,255,0.12)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {/* Icon circle */}
                <div
                  className="w-13 h-13 rounded-full flex items-center justify-center mb-3.5 flex-shrink-0"
                  style={{
                    width: 52, height: 52,
                    background: `${accentColor}33`,
                    border: `2px solid ${accentColor}`,
                  }}
                >
                  <span style={{ fontSize: 24 }}>{card.icon}</span>
                </div>

                {/* Name */}
                <p className="text-white font-black text-base mb-1.5 leading-snug">{card.name}</p>

                {/* Tagline */}
                <p className="font-black text-[11px] uppercase mb-2.5" style={{ color: accentColor, letterSpacing: "0.08em" }}>
                  {card.tagline}
                </p>

                {/* Description */}
                <p className="text-[#9CA3AF] text-[13px] leading-relaxed flex-1 line-clamp-2">
                  {card.description}
                </p>

                {/* Bottom row */}
                <div className="flex items-center justify-between mt-4">
                  <span className="text-xs font-black" style={{ color: accentColor }}>Learn More →</span>
                  <span style={{ color: accentColor, fontSize: 14 }}>✨</span>
                </div>
              </Link>
            ))}
          </div>

          {/* Right arrow */}
          <button
            onClick={next}
            className="hidden md:flex flex-shrink-0 w-11 h-11 rounded-full bg-white items-center justify-center shadow-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={20} className="text-gray-800" />
          </button>
        </div>

        {/* Dot pagination */}
        {totalDots > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: totalDots + 1 }, (_, i) => (
              <button
                key={i}
                onClick={() => scrollToIndex(i)}
                className="rounded-full transition-all duration-300"
                style={{
                  width: activeIndex === i ? 20 : 8,
                  height: 8,
                  background: activeIndex === i ? accentColor : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
        )}

        {/* Footer link */}
        <div className="text-center mt-6">
          <Link to={exploreLink} className="text-white text-sm font-bold hover:underline opacity-70 hover:opacity-100 transition-opacity">
            Explore all AI features →
          </Link>
        </div>
      </div>
    </section>
  );
}