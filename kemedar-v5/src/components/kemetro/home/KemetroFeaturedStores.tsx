// @ts-nocheck
import { ChevronLeft, ChevronRight, Star, ShoppingCart } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

const STORES = [
  {
    id: 1,
    name: "BuildRight Materials",
    logo: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=100&q=80",
    cover: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&q=80",
    verified: true,
    rating: 4.8,
    reviewCount: 1245,
    productCount: 342,
    categories: ["Cement", "Aggregates", "Tools"],
  },
  {
    id: 2,
    name: "Tile Experts Co.",
    logo: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=100&q=80",
    cover: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=80",
    verified: true,
    rating: 4.9,
    reviewCount: 892,
    productCount: 156,
    categories: ["Floor Tiles", "Wall Tiles", "Mosaics"],
  },
  {
    id: 3,
    name: "Furniture Plus",
    logo: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&q=80",
    cover: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&q=80",
    verified: true,
    rating: 4.7,
    reviewCount: 567,
    productCount: 289,
    categories: ["Sofas", "Beds", "Tables"],
  },
  {
    id: 4,
    name: "ColorMax Paints",
    logo: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=100&q=80",
    cover: "https://images.unsplash.com/photo-1574269909862-7e1d70bb8078?w=400&q=80",
    verified: true,
    rating: 4.6,
    reviewCount: 723,
    productCount: 98,
    categories: ["Interior Paint", "Exterior Paint", "Varnish"],
  },
  {
    id: 5,
    name: "Bright Lights Ltd",
    logo: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=100&q=80",
    cover: "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=400&q=80",
    verified: true,
    rating: 4.5,
    reviewCount: 1089,
    productCount: 234,
    categories: ["LED Bulbs", "Fixtures", "Smart Lighting"],
  },
];

function StoreCard({ store }) {
  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-all group">
      {/* Cover image */}
      <div className="relative h-28 overflow-hidden bg-gray-200">
        <img src={store.cover} alt={store.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
      </div>

      {/* Logo - overlapping */}
      <div className="px-4 -mt-12 pb-2 relative z-10">
        <div className="w-20 h-20 rounded-xl border-4 border-white bg-white overflow-hidden shadow-lg mx-auto">
          <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4 text-center space-y-2">
        <div className="flex items-center justify-center gap-1">
          <h3 className="font-bold text-gray-900 text-sm">{store.name}</h3>
          {store.verified && <span className="text-green-600 font-bold">✅</span>}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-center gap-1">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                className={`${i < Math.floor(store.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500">({store.reviewCount})</span>
        </div>

        {/* Product count */}
        <p className="text-xs text-gray-500">{store.productCount} Products</p>

        {/* Category tags */}
        <div className="flex flex-wrap gap-1 justify-center pt-1">
          {store.categories.slice(0, 2).map((cat) => (
            <span key={cat} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
              {cat}
            </span>
          ))}
        </div>

        {/* CTA */}
        <Link
          href={`/kemetro/store/${store.id}`}
          className="block w-full bg-[#0077B6] hover:bg-[#005fa3] text-white font-bold py-2 rounded-lg text-sm mt-3 transition-colors"
        >
          Visit Store
        </Link>
      </div>
    </div>
  );
}

export default function KemetroFeaturedStores() {
  const scrollRef = useRef(null);

  const scroll = (dir) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: dir === "left" ? -280 : 280,
        behavior: "smooth",
      });
    }
  };

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-gray-900 mb-2">Top Verified Sellers</h2>
          <p className="text-gray-500">Shop from our trusted and verified store partners</p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
            {STORES.map((store) => (
              <div key={store.id} className="snap-start">
                <StoreCard store={store} />
              </div>
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
      </div>
    </section>
  );
}