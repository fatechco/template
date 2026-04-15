"use client";
// @ts-nocheck
import { useState } from "react";
import { MapPin, Phone, User } from "lucide-react";
import Link from "next/link";
import FranchiseOwnerProfileModal from "./FranchiseOwnerProfileModal";

const AVATARS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80",
  "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&q=80",
];

export default function FranchiseOwnerCard({ owner, index }) {
  const [showModal, setShowModal] = useState(false);
  const avatar = owner.avatar || AVATARS[index % AVATARS.length];

  return (
    <>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="h-16 bg-gradient-to-r from-[#1a1a2e] to-[#2d2d4e] relative">
          <span className="absolute top-3 left-3 bg-[#FF6B00] text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
            FRANCHISE OWNER
          </span>
        </div>

        <div className="flex flex-col items-center -mt-8 px-5 pb-5 relative z-10">
          <img src={avatar} alt={owner.full_name || owner.name} className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md mb-2 relative z-10" />
          <h3 className="font-black text-gray-900 text-base text-center">{owner.full_name || owner.name || "Franchise Owner"}</h3>

          <div className="flex flex-col items-center gap-1 mt-2 text-xs text-gray-500">
            {(owner.province_name || owner.city_name) && (
              <span className="flex items-center gap-1">
                <MapPin size={11} className="text-[#FF6B00]" />
                {[owner.province_name, owner.city_name].filter(Boolean).join(" — ")}
              </span>
            )}
            {owner.area_covered && (
              <span className="text-gray-400 text-center">{owner.area_covered}</span>
            )}
          </div>

          <div className="flex gap-2 w-full mt-4">
            <button className="flex-1 flex items-center justify-center gap-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-bold py-2 rounded-xl transition-colors">
              <Phone size={13} /> Contact
            </button>
            <Link
              href={`/franchise-owner-profile/${owner.id}`}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[#1a1a2e] hover:bg-[#0d0d1a] text-white text-xs font-bold py-2 rounded-xl transition-colors"
            >
              <User size={13} /> Profile
            </Link>
          </div>
        </div>
      </div>

      {showModal && (
        <FranchiseOwnerProfileModal owner={owner} index={index} onClose={() => setShowModal(false)} />
      )}
    </>
  );
}