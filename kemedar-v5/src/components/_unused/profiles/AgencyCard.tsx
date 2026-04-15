"use client";
// @ts-nocheck
import { useState } from "react";
import { MapPin, MessageCircle, User, Users, Heart, Building2 } from "lucide-react";
import Link from "next/link";
import AgencyProfileModal from "./AgencyProfileModal";

const LOGOS = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=200&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=200&q=80",
  "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=200&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=200&q=80",
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=200&q=80",
  "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=200&q=80",
];

export default function AgencyCard({ agency, index }) {
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const logo = agency.logo || LOGOS[index % LOGOS.length];
  const props = agency.properties_count || Math.floor(Math.random() * 150) + 20;
  const agents = agency.agents_count || Math.floor(Math.random() * 30) + 5;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="relative h-44 overflow-hidden bg-gray-50">
          <img src={logo} alt={agency.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <button
            onClick={() => setSaved(!saved)}
            className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <Heart size={13} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
          <span className="absolute top-3 left-3 bg-green-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            {props} Properties
          </span>
        </div>

        <div className="p-4">
          <h3 className="font-black text-gray-900 text-base truncate">{agency.name || "Agency Name"}</h3>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <Users size={11} className="text-[#FF6B00]" /> {agents} Agents
            </span>
            {(agency.city_name || agency.location) && (
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-[#FF6B00]" /> {agency.city_name || agency.location}
              </span>
            )}
          </div>

          <div className="flex gap-2 mt-4">
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 rounded-xl transition-colors">
              <MessageCircle size={13} /> Chat
            </button>
            <Link
              href={`/agency-profile/${agency.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#FF6B00] hover:bg-[#e55f00] text-white text-xs font-bold py-2 rounded-xl transition-colors"
            >
              <User size={13} /> Profile
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <AgencyProfileModal agency={agency} index={index} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}