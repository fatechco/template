import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const SLIDES = [
  {
    id: 1,
    badge: "🏗️ BUILDING & CONSTRUCTION",
    headline: ["Everything Your Project Needs —", "From Foundation to Finish"],
    subtext: "Source cement, steel, tiles, paint and more from hundreds of verified suppliers.",
    btn1: { label: "Shop Now", to: "/kemetro/search" },
    btn2: { label: "Browse Categories", to: "/kemetro/categories" },
    bg: "from-[#0d1b2a] via-[#0a2540] to-[#0d3b3b]",
    overlay: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=60",
    cards: [
      { img: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=200&q=80", name: "Cement 50kg", price: "$8.50 / bag", tag: "🧱" },
      { img: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=200&q=80", name: "Floor Tiles", price: "from $12 / sqm", tag: "🪟" },
      { img: "https://images.unsplash.com/photo-1587293852726-70cdb56c2866?w=200&q=80", name: "Steel Rods", price: "$450 / ton", tag: "⚙️" },
    ],
  },
  {
    id: 2,
    badge: "🛋️ FURNITURE & INTERIORS",
    headline: ["Furnish Every Room —", "Bedroom, Living, Kitchen & More"],
    subtext: "Discover thousands of furniture pieces from top manufacturers.",
    btn1: { label: "Shop Furniture", to: "/kemetro/category/furniture" },
    btn2: { label: "View New Arrivals", to: "/kemetro/new-arrivals" },
    bg: "from-[#3d2b1f] via-[#5c3d2e] to-[#2c1a0e]",
    overlay: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&q=60",
    cards: [
      { img: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=200&q=80", name: "Sofa Set", price: "from $350", tag: "🛋️" },
      { img: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=200&q=80", name: "Bedroom Set", price: "from $520", tag: "🛏️" },
      { img: "https://images.unsplash.com/photo-1449247709967-d4461a6a6103?w=200&q=80", name: "Dining Table", price: "from $280", tag: "🪑" },
    ],
  },
  {
    id: 3,
    badge: "📺 HOME APPLIANCES",
    headline: ["Smart Appliances for", "the Modern Home"],
    subtext: "Air conditioners, refrigerators, TVs and more — all in one place.",
    btn1: { label: "Shop Appliances", to: "/kemetro/category/appliances" },
    btn2: { label: "Flash Deals", to: "/kemetro/flash-deals" },
    bg: "from-[#0a0a0a] via-[#111827] to-[#1e1b4b]",
    overlay: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1200&q=60",
    cards: [
      { img: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=200&q=80", name: "Air Conditioner", price: "from $320", tag: "❄️" },
      { img: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=200&q=80", name: "Refrigerator", price: "from $450", tag: "🧊" },
      { img: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200&q=80", name: "Smart TV", price: "from $380", tag: "📺" },
    ],
  },
];

function ProductCard({ card }) {
  return (
    <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl overflow-hidden flex items-center gap-3 p-3 hover:bg-white/20 transition-all">
      <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-white/10">
        <img src={card.img} alt={card.name} className="w-full h-full object-cover" />
      </div>
      <div>
        <p className="text-white font-bold text-sm leading-tight">{card.name}</p>
        <p className="text-[#FF6B00] text-xs font-semibold mt-0.5">{card.price}</p>
      </div>
    </div>
  );
}

export default function KemetroHeroSlider() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);
  const timerRef = useRef(null);

  const goTo = (idx) => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(idx);
      setAnimating(false);
    }, 250);
  };

  const prev = () => goTo((active - 1 + SLIDES.length) % SLIDES.length);
  const next = () => goTo((active + 1) % SLIDES.length);

  useEffect(() => {
    timerRef.current = setInterval(next, 5000);
    return () => clearInterval(timerRef.current);
  }, [active]);

  const slide = SLIDES[active];

  return (
    <section className="relative w-full min-h-[480px] overflow-hidden">
      {/* Background */}
      <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} transition-all duration-500`} />
      <div
        className="absolute inset-0 bg-cover bg-center transition-all duration-500"
        style={{ backgroundImage: `url('${slide.overlay}')`, opacity: 0.12 }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-14 flex items-center gap-10">
        {/* Left */}
        <div
          className="flex-[1.4] min-w-0 transition-all duration-300"
          style={{ opacity: animating ? 0 : 1, transform: animating ? "translateY(12px)" : "translateY(0)" }}
        >
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 rounded-full px-4 py-1.5 mb-5">
            <span className="text-white text-xs font-black tracking-widest">{slide.badge}</span>
          </div>

          <h1 className="text-4xl xl:text-5xl font-black text-white leading-tight mb-4">
            {slide.headline.map((line, i) => (
              <span key={i} className={`block ${i === 1 ? "text-[#00B4D8]" : ""}`}>{line}</span>
            ))}
          </h1>

          <p className="text-gray-300 text-base mb-8 max-w-lg leading-relaxed">{slide.subtext}</p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link
              to={slide.btn1.to}
              className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-black px-7 py-3.5 rounded-xl text-sm transition-all shadow-lg shadow-orange-900/40 hover:scale-[1.02]"
            >
              {slide.btn1.label}
            </Link>
            <Link
              to={slide.btn2.to}
              className="inline-flex items-center gap-2 border-2 border-white/50 hover:border-white text-white font-bold px-7 py-3.5 rounded-xl text-sm transition-all hover:bg-white/10"
            >
              {slide.btn2.label}
            </Link>
            <Link
              to="/kemetro/build"
              className="inline-flex items-center gap-2 bg-teal-500 hover:bg-teal-400 text-white font-black px-5 py-3.5 rounded-xl text-sm transition-all"
            >
              🏗️ Build™ BOQ
            </Link>
          </div>

          {/* Dots */}
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

        {/* Right — Product cards */}
        <div
          className="flex-1 flex flex-col gap-3 max-w-[300px] hidden md:flex transition-all duration-300"
          style={{ opacity: animating ? 0 : 1, transform: animating ? "translateX(12px)" : "translateX(0)" }}
        >
          {slide.cards.map((card, i) => (
            <ProductCard key={i} card={card} />
          ))}
        </div>
      </div>

      {/* Arrow buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full flex items-center justify-center text-white transition-all"
      >
        <ChevronRight size={20} />
      </button>
    </section>
  );
}