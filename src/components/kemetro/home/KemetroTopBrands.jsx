import { useRef } from "react";
import { ChevronLeft, ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const BRANDS = [
  { id: 1, name: "Brand 1", logo: "🏭" },
  { id: 2, name: "Brand 2", logo: "🏗️" },
  { id: 3, name: "Brand 3", logo: "🪟" },
  { id: 4, name: "Brand 4", logo: "⚙️" },
  { id: 5, name: "Brand 5", logo: "🛠️" },
  { id: 6, name: "Brand 6", logo: "📦" },
  { id: 7, name: "Brand 7", logo: "💼" },
  { id: 8, name: "Brand 8", logo: "✨" },
];

function BrandCard({ brand }) {
  return (
    <div className="flex-shrink-0 w-40 bg-white rounded-xl border border-gray-200 p-6 flex flex-col items-center justify-center gap-3 hover:border-teal-500 hover:shadow-lg transition-all duration-300 group">
      <div className="text-6xl group-hover:scale-110 transition-transform duration-300">{brand.logo}</div>
      <p className="font-bold text-gray-900 text-sm text-center">{brand.name}</p>
    </div>
  );
}

export default function KemetroTopBrands() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -240 : 240,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Shop by Brand</h2>
          <p className="text-gray-500">Discover trusted brands and manufacturers</p>
        </div>

        {/* Brands carousel */}
        <div className="relative">
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4">
            {BRANDS.map((brand) => (
              <BrandCard key={brand.id} brand={brand} />
            ))}
          </div>

          {/* Navigation arrows */}
          <button
            onClick={() => scroll("left")}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 hover:shadow-xl transition-all z-10"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 w-10 h-10 bg-white shadow-lg rounded-full flex items-center justify-center text-gray-900 hover:shadow-xl transition-all z-10"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        {/* View All link */}
        <div className="text-center mt-8">
          <Link
            to="/kemetro/brands"
            className="inline-flex items-center gap-2 text-teal-600 hover:text-teal-700 font-bold text-sm"
          >
            View All Brands
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}