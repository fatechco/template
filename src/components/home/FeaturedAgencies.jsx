import { useState, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, User, MapPin, Users } from "lucide-react";
import SectionHeader from "./SectionHeader";

const MOCK_AGENCIES = [
  { id: "ag1", name: "Coldwell Banker Egypt", properties: 142, agents: 28, address: "New Cairo, Egypt", logo: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80" },
  { id: "ag2", name: "RE/MAX Egypt", properties: 98, agents: 19, address: "Sheikh Zayed, Giza", logo: "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&q=80" },
  { id: "ag3", name: "JLL Egypt", properties: 215, agents: 45, address: "Downtown Cairo", logo: "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&q=80" },
  { id: "ag4", name: "Savills Middle East", properties: 76, agents: 12, address: "Heliopolis, Cairo", logo: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80" },
  { id: "ag5", name: "Nawy Real Estate", properties: 183, agents: 37, address: "5th Settlement, Cairo", logo: "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80" },
  { id: "ag6", name: "Aqarmap Broker", properties: 67, agents: 9, address: "Maadi, Cairo", logo: "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=400&q=80" },
];

function AgencyCard({ agency }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      <div className="relative h-36 overflow-hidden">
        <img src={agency.logo} alt={agency.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {agency.properties} Props
        </span>
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-2 right-2 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center hover:bg-white transition-colors"
        >
          <Heart size={13} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
      </div>
      <div className="p-3">
        <p className="font-bold text-gray-900 text-sm truncate">{agency.name}</p>
        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
          <MapPin size={11} className="text-[#FF6B00]" /> {agency.address}
        </p>
        <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
          <Users size={11} className="text-[#FF6B00]" /> {agency.agents} Agents
        </p>
        <div className="flex gap-2 mt-3">
          <button className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-1.5 rounded-lg transition-colors">
            <MessageCircle size={12} /> Chat
          </button>
          <Link to={`/agency-profile/${agency.id}`} className="flex-1 flex items-center justify-center gap-1 bg-[#FF6B00] hover:bg-[#e55f00] text-white text-xs font-semibold py-1.5 rounded-lg transition-colors">
            <User size={12} /> Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedAgencies() {
  const sliderRef = useRef(null);
  const hovering = useRef(false);

  const scroll = (dir) => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4">
        <SectionHeader title="Featured Agencies" />
        <div
          className="relative"
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => (hovering.current = false)}
        >
          <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div ref={sliderRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
            {MOCK_AGENCIES.map((agency) => <AgencyCard key={agency.id} agency={agency} />)}
          </div>
          <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}