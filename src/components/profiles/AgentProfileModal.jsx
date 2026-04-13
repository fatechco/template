import { X, MapPin, Star, Phone, Mail, MessageCircle, Building2, Award, Home } from "lucide-react";

const avatars = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&q=80",
];

export default function AgentProfileModal({ agent, index, onClose }) {
  if (!agent) return null;

  const avatar = agent.avatar || avatars[index % avatars.length];
  const rating = agent.rating || 4.7;
  const props = agent.properties_count || 24;
  const name = agent.full_name || agent.name || "Agent Name";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        onClick={e => e.stopPropagation()}
      >
        {/* Header band */}
        <div className="h-28 bg-gradient-to-r from-[#FF6B00] to-orange-400 relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center -mt-12 px-6 pb-6">
          <img
            src={avatar}
            alt={name}
            className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-lg mb-3"
          />
          <h2 className="text-xl font-black text-gray-900 text-center">{name}</h2>
          {agent.agency_name && (
            <div className="flex items-center gap-1.5 text-[#FF6B00] font-semibold text-sm mt-1">
              <Building2 size={14} />
              {agent.agency_name}
            </div>
          )}

          {/* Stars */}
          <div className="flex items-center gap-1 mt-2">
            {[1,2,3,4,5].map(s => (
              <Star key={s} size={14} className={parseFloat(rating) >= s ? "fill-yellow-400 text-yellow-400" : "text-gray-200 fill-gray-200"} />
            ))}
            <span className="text-sm text-gray-500 ml-1 font-semibold">{rating}</span>
          </div>

          {/* Location */}
          {(agent.city_name || agent.location) && (
            <p className="text-sm text-gray-400 flex items-center gap-1.5 mt-2">
              <MapPin size={13} className="text-[#FF6B00]" />
              {agent.city_name || agent.location}
            </p>
          )}

          {/* Stats row */}
          <div className="flex gap-4 mt-5 w-full">
            <div className="flex-1 bg-orange-50 rounded-xl p-3 text-center">
              <Home size={18} className="text-[#FF6B00] mx-auto mb-1" />
              <p className="text-lg font-black text-gray-900">{props}</p>
              <p className="text-xs text-gray-500">Properties</p>
            </div>
            <div className="flex-1 bg-orange-50 rounded-xl p-3 text-center">
              <Star size={18} className="text-[#FF6B00] mx-auto mb-1" />
              <p className="text-lg font-black text-gray-900">{rating}</p>
              <p className="text-xs text-gray-500">Rating</p>
            </div>
            <div className="flex-1 bg-orange-50 rounded-xl p-3 text-center">
              <Award size={18} className="text-[#FF6B00] mx-auto mb-1" />
              <p className="text-lg font-black text-gray-900">Pro</p>
              <p className="text-xs text-gray-500">Status</p>
            </div>
          </div>

          {/* Contact info */}
          {agent.email && (
            <div className="flex items-center gap-2 mt-4 text-sm text-gray-600 w-full bg-gray-50 rounded-xl px-4 py-2.5">
              <Mail size={14} className="text-[#FF6B00]" />
              {agent.email}
            </div>
          )}
          {agent.phone && (
            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600 w-full bg-gray-50 rounded-xl px-4 py-2.5">
              <Phone size={14} className="text-[#FF6B00]" />
              {agent.phone}
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 w-full mt-5">
            <button className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-3 rounded-xl transition-colors text-sm">
              <MessageCircle size={15} /> Chat
            </button>
            <button className="flex-1 flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold py-3 rounded-xl transition-colors text-sm">
              <Phone size={15} /> Call
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}