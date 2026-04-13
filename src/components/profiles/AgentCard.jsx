import { useState } from "react";
import { MapPin, MessageCircle, User, Star, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import AgentProfileModal from "./AgentProfileModal";

export default function AgentCard({ agent, index }) {
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const avatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
  ];
  const avatar = agent.avatar || avatars[index % avatars.length];
  const rating = agent.rating || (4 + Math.random()).toFixed(1);
  const props = agent.properties_count || Math.floor(Math.random() * 60) + 5;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
        {/* Top colored band */}
        <div className="h-16 bg-gradient-to-r from-[#FF6B00]/10 to-orange-50 relative">
          <button
            onClick={() => setSaved(!saved)}
            className="absolute top-3 right-3 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-sm hover:bg-red-50 transition-colors"
          >
            <Heart size={13} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
          <span className="absolute top-3 left-3 bg-[#FF6B00] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {props} Properties
          </span>
        </div>

        {/* Avatar (overlap) */}
        <div className="flex flex-col items-center -mt-8 px-5 pb-5">
          <img
            src={avatar}
            alt={agent.full_name || agent.name}
            className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md mb-2"
          />
          <h3 className="font-black text-gray-900 text-base text-center">{agent.full_name || agent.name || "Agent Name"}</h3>
          {agent.agency_name && (
            <p className="text-xs text-[#FF6B00] font-semibold mt-0.5">{agent.agency_name}</p>
          )}

          {/* Stars */}
          <div className="flex items-center gap-0.5 mt-1.5">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={12} className={parseFloat(rating) >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />
            ))}
            <span className="text-xs text-gray-400 ml-1">{rating}</span>
          </div>

          {/* Location */}
          {(agent.city_name || agent.location) && (
            <p className="text-xs text-gray-400 flex items-center gap-1 mt-1.5">
              <MapPin size={11} className="text-[#FF6B00]" />
              {agent.city_name || agent.location}
            </p>
          )}

          {/* Actions */}
          <div className="flex gap-2 w-full mt-4">
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 rounded-xl transition-colors">
              <MessageCircle size={13} /> Chat
            </button>
            <Link
              to={`/agent-profile/${agent.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#FF6B00] hover:bg-[#e55f00] text-white text-xs font-bold py-2 rounded-xl transition-colors"
            >
              <User size={13} /> Profile
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <AgentProfileModal
          agent={agent}
          index={index}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}