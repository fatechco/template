"use client";
// @ts-nocheck
import { useState } from "react";
import { MapPin, MessageCircle, User, Heart } from "lucide-react";
import Link from "next/link";
import DeveloperProfileModal from "./DeveloperProfileModal";

const LOGOS = [
  "https://images.unsplash.com/photo-1577495508048-b635879837f1?w=300&q=80",
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=300&q=80",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&q=80",
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&q=80",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?w=300&q=80",
  "https://images.unsplash.com/photo-1449157291145-7efd050a4d0e?w=300&q=80",
];

export default function DeveloperCard({ developer, index }) {
  const [saved, setSaved] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const logo = developer.logo || LOGOS[index % LOGOS.length];
  const projects = developer.projects_count || Math.floor(Math.random() * 15) + 2;
  const props = developer.properties_count || Math.floor(Math.random() * 200) + 50;

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="relative h-44 overflow-hidden bg-gray-50">
          <img src={logo} alt={developer.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <button
            onClick={() => setSaved(!saved)}
            className="absolute top-3 right-3 w-7 h-7 bg-white/90 rounded-full flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <Heart size={13} className={saved ? "fill-red-500 text-red-500" : "text-gray-400"} />
          </button>
          <p className="absolute bottom-3 left-4 text-white font-black text-sm drop-shadow">{developer.name || "Developer Name"}</p>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <span className="bg-blue-100 text-blue-700 text-[10px] font-bold px-2.5 py-1 rounded-full">
              {projects} Projects
            </span>
            <span className="bg-orange-100 text-[#FF6B00] text-[10px] font-bold px-2.5 py-1 rounded-full">
              {props} Properties
            </span>
          </div>

          {(developer.city_name || developer.location) && (
            <p className="text-xs text-gray-400 flex items-center gap-1 mb-3">
              <MapPin size={11} className="text-[#FF6B00]" /> {developer.city_name || developer.location}
            </p>
          )}

          <div className="flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 rounded-xl transition-colors">
              <MessageCircle size={13} /> Chat
            </button>
            <Link
              href={`/developer-profile/${developer.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#FF6B00] hover:bg-[#e55f00] text-white text-xs font-bold py-2 rounded-xl transition-colors"
            >
              <User size={13} /> Profile
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <DeveloperProfileModal developer={developer} index={index} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}