import { useState, useEffect } from "react";

const SLIDES = [
  {
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=800&q=80",
    headline: "Find Your Perfect Property",
    sub: "Search millions of listings worldwide",
  },
  {
    image: "https://images.unsplash.com/photo-1582407947304-fd86f28f3b3f?w=800&q=80",
    headline: "List Your Property Free",
    sub: "Reach thousands of buyers instantly",
  },
  {
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
    headline: "Connect with Top Agents",
    sub: "Verified professionals in your area",
  },
];

export default function MobileHeroSlider() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % SLIDES.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = SLIDES[current];

  return (
    <div className="relative w-full overflow-hidden" style={{ height: 220 }}>
      {/* Image */}
      <img
        src={slide.image}
        alt={slide.headline}
        className="w-full h-full object-cover transition-all duration-700"
        style={{ display: "block" }}
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Module badge */}
      <div className="absolute top-4 left-4">
        <span className="bg-[#FF6B00] text-white text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wide">
          🏠 Kemedar®
        </span>
      </div>

      {/* Text */}
      <div className="absolute bottom-10 left-0 right-0 px-4">
        <h2 className="text-white text-xl font-black leading-tight mb-1 line-clamp-2">
          {slide.headline}
        </h2>
        <p className="text-white/80 text-sm font-medium">{slide.sub}</p>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`rounded-full transition-all duration-300 ${
              i === current ? "bg-[#FF6B00] w-5 h-2" : "bg-white/50 w-2 h-2"
            }`}
          />
        ))}
      </div>
    </div>
  );
}