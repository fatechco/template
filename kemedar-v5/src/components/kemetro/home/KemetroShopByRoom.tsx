// @ts-nocheck
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const ROOMS = [
  {
    title: "Kitchen",
    subtitle: "Tiles, Cabinets, Appliances",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=600&q=80",
    slug: "kitchen",
  },
  {
    title: "Bathroom",
    subtitle: "Plumbing, Tiles, Fixtures",
    image: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=600&q=80",
    slug: "bathroom",
  },
  {
    title: "Living Room",
    subtitle: "Furniture, Flooring, Lighting",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
    slug: "living-room",
  },
  {
    title: "Bedroom",
    subtitle: "Furniture, Lighting, AC",
    image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600&q=80",
    slug: "bedroom",
  },
];

export default function KemetroShopByRoom() {
  return (
    <section className="w-full bg-[#1a1a2e] py-16">
      <div className="max-w-[1400px] mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-black text-white mb-2">Complete Your Space</h2>
          <p className="text-gray-400">Everything you need room by room</p>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {ROOMS.map((room) => (
            <Link
              key={room.slug}
              href={`/kemetro/category/${room.slug}`}
              className="group relative h-64 rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
            >
              {/* Background image */}
              <img
                src={room.image}
                alt={room.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />

              {/* Dark overlay */}
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-all" />

              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <h3 className="text-2xl font-black text-white mb-1">{room.title}</h3>
                <p className="text-sm text-gray-200 mb-4">{room.subtitle}</p>

                {/* Button - hidden by default, shown on hover */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="inline-flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold px-6 py-2.5 rounded-lg transition-colors">
                    Shop Now <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}