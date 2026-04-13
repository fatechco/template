import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Heart, MessageCircle, User } from "lucide-react";
import { base44 } from "@/api/base44Client";
import SectionHeader from "./SectionHeader";

const MOCK_AGENTS = [
  { id: "a1", full_name: "Ahmed Hassan", properties: 34, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80" },
  { id: "a2", full_name: "Sara Mohamed", properties: 21, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80" },
  { id: "a3", full_name: "Omar Khalil", properties: 58, avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80" },
  { id: "a4", full_name: "Nour Adel", properties: 15, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80" },
  { id: "a5", full_name: "Karim Samir", properties: 42, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80" },
  { id: "a6", full_name: "Layla Farouk", properties: 27, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80" },
];

function AgentCard({ agent }) {
  const [saved, setSaved] = useState(false);
  return (
    <div className="flex-shrink-0 w-52 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group">
      {/* Image area */}
      <div className="relative pt-6 pb-2 px-4 flex flex-col items-center bg-gradient-to-b from-orange-50 to-white">
        <span className="absolute top-3 left-3 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded">
          {agent.properties} Props
        </span>
        <button
          onClick={() => setSaved(!saved)}
          className="absolute top-3 right-3 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
        >
          <Heart size={12} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
        </button>
        <img
          src={agent.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(agent.full_name)}&background=FF6B00&color=fff`}
          alt={agent.full_name}
          className="w-20 h-20 rounded-full object-cover border-4 border-white shadow-md"
        />
      </div>
      <div className="px-4 pb-4">
        <p className="font-bold text-gray-900 text-sm text-center mt-1 truncate">{agent.full_name}</p>
        <p className="text-xs text-gray-400 text-center mb-3">Real Estate Agent</p>
        <div className="flex gap-2">
          <button className="flex-1 flex items-center justify-center gap-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold py-1.5 rounded-lg transition-colors">
            <MessageCircle size={12} /> Chat
          </button>
          <Link to={`/agent-profile/${agent.id}`} className="flex-1 flex items-center justify-center gap-1 bg-[#FF6B00] hover:bg-[#e55f00] text-white text-xs font-semibold py-1.5 rounded-lg transition-colors">
            <User size={12} /> Profile
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function FeaturedAgents() {
  const [agents, setAgents] = useState([]);
  const sliderRef = useRef(null);
  const hovering = useRef(false);

  useEffect(() => {
    base44.entities.User.list()
      .then((data) => {
        const filtered = data.filter((u) => u.role === "agent" || u.role === "user");
        setAgents(filtered.length >= 3 ? filtered : MOCK_AGENTS);
      })
      .catch(() => setAgents(MOCK_AGENTS));
  }, []);

  const scroll = (dir) => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: dir * 220, behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hovering.current && sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderRef.current.scrollBy({ left: 220, behavior: "smooth" });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-14 bg-white">
      <div className="max-w-[1400px] mx-auto px-4">
        <SectionHeader title="Featured Agents" />
        <div
          className="relative"
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => (hovering.current = false)}
        >
          <button onClick={() => scroll(-1)} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors">
            <ChevronLeft size={18} />
          </button>
          <div ref={sliderRef} className="flex gap-4 overflow-x-auto scroll-smooth pb-2" style={{ scrollbarWidth: "none" }}>
            {agents.map((agent) => <AgentCard key={agent.id} agent={agent} />)}
          </div>
          <button onClick={() => scroll(1)} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
}