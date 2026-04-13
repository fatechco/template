import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, User } from "lucide-react";
import SectionHeader from "./SectionHeader";

const MOCK_DEVS = [
  { id: "d1", name: "Emaar Misr", properties: 12, logo: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=300&q=80" },
  { id: "d2", name: "Palm Hills", properties: 9, logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80" },
  { id: "d3", name: "Ora Developers", properties: 7, logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80" },
  { id: "d4", name: "Madinet Masr", properties: 15, logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&q=80" },
  { id: "d5", name: "Hyde Park Dev.", properties: 6, logo: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=300&q=80" },
  { id: "d6", name: "Sabbour Consulting", properties: 11, logo: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=300&q=80" },
];

function DeveloperCard({ dev }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex-shrink-0 w-60 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-40 overflow-hidden">
        <img src={dev.logo} alt={dev.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        <span className="absolute top-2 left-2 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {dev.properties} Projects
        </span>
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart size={13} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
        <p className="absolute bottom-2 left-3 text-white font-black text-sm drop-shadow">{dev.name}</p>
      </div>
      <div className="p-3">
        <p className="text-xs text-gray-400 mb-3">Real Estate Developer</p>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-1.5 rounded-lg transition-colors">
            <MessageCircle size={12} /> Chat
          </button>
          <Link to={`/developer-profile/${dev.id}`} className="flex-1 flex items-center justify-center gap-1 bg-[#FF6B00] hover:bg-[#e55f00] text-white text-xs font-semibold py-1.5 rounded-lg transition-colors">
            <User size={12} /> Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedDevelopers() {
  const sliderRef = useRef(null);
  const hovering = useRef(false);

  const scroll = (dir) => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: dir * 260, behavior: "smooth" });
  };

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <SectionHeader title="Featured Developers" />
        <div
          className="relative"
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => (hovering.current = false)}
        >
          <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div ref={sliderRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
            {MOCK_DEVS.map((dev) => <DeveloperCard key={dev.id} dev={dev} />)}
          </div>
          <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}