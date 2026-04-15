// @ts-nocheck
import { X, MapPin, MessageCircle, Users, Building2, Home, Phone } from "lucide-react";

const LOGOS = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400&q=80",
  "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=400&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&q=80",
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=400&q=80",
  "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=400&q=80",
];

export default function AgencyProfileModal({ agency, index, onClose }) {
  if (!agency) return null;

  const logo = agency.logo || LOGOS[index % LOGOS.length];
  const props = agency.properties_count || 80;
  const agents = agency.agents_count || 12;
  const name = agency.name || "Agency Name";

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden" onClick={e => e.stopPropagation()}>
        {/* Cover image */}
        <div className="relative h-40 overflow-hidden">
          <img src={logo} alt={name} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 bg-white/20 hover:bg-white/40 text-white rounded-full flex items-center justify-center transition-colors">
            <X size={16} />
          </button>
          <h2 className="absolute bottom-3 left-4 text-white text-xl font-black drop-shadow">{name}</h2>
        </div>

        <div className="px-6 py-5">
          {/* Location */}
          {(agency.city_name || agency.location) && (
            <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-4">
              <MapPin size={13} className="text-[#FF6B00]" />
              {agency.city_name || agency.location}
            </p>
          )}

          {/* Stats */}
          <div className="flex gap-4 mb-5">
            <div className="flex-1 bg-green-50 rounded-xl p-3 text-center">
              <Home size={18} className="text-green-600 mx-auto mb-1" />
              <p className="text-lg font-black text-gray-900">{props}</p>
              <p className="text-xs text-gray-500">Properties</p>
            </div>
            <div className="flex-1 bg-orange-50 rounded-xl p-3 text-center">
              <Users size={18} className="text-[#FF6B00] mx-auto mb-1" />
              <p className="text-lg font-black text-gray-900">{agents}</p>
              <p className="text-xs text-gray-500">Agents</p>
            </div>
            <div className="flex-1 bg-blue-50 rounded-xl p-3 text-center">
              <Building2 size={18} className="text-blue-600 mx-auto mb-1" />
              <p className="text-lg font-black text-gray-900">Pro</p>
              <p className="text-xs text-gray-500">Status</p>
            </div>
          </div>

          {agency.email && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-2.5 mb-2">
              <Building2 size={14} className="text-[#FF6B00]" /> {agency.email}
            </div>
          )}
          {agency.phone && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-xl px-4 py-2.5 mb-2">
              <Phone size={14} className="text-[#FF6B00]" /> {agency.phone}
            </div>
          )}

          <div className="flex gap-3 mt-4">
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