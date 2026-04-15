// @ts-nocheck
import { Edit2, Heart, Eye, Home } from "lucide-react";

const ROLE_LABELS = {
  admin: "Admin",
  agent: "Agent",
  agency: "Agency",
  developer: "Developer",
  franchise_owner: "Franchise Owner",
  user: "Property Owner",
};

export default function ProfileCard({ user, stats = {} }) {
  const initials = user?.full_name
    ? user.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()
    : "?";

  const roleLabel = ROLE_LABELS[user?.role] || "User";

  return (
    <div className="mx-4 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#E5E7EB]">
      {/* Orange top gradient strip */}
      <div className="h-20 bg-gradient-to-r from-[#FF6B00] to-[#FF8533]" />

      {/* Avatar + Info */}
      <div className="px-4 pb-4 flex flex-col items-center">
        {/* Avatar overlapping strip */}
        <div className="relative -mt-10 mb-3">
          <div className="w-20 h-20 rounded-full bg-[#FF6B00] flex items-center justify-center shadow-lg border-4 border-white">
            <span className="text-white text-2xl font-black">{initials}</span>
          </div>
          <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full border border-[#E5E7EB] flex items-center justify-center shadow-sm">
            <Edit2 size={11} className="text-[#6B7280]" />
          </button>
        </div>

        {/* Name */}
        <p className="text-base font-black text-[#1F2937] text-center">
          {user?.full_name || "User"}
        </p>

        {/* Role Badge */}
        <span className="inline-block mt-1.5 text-xs font-bold bg-orange-100 text-[#FF6B00] px-3 py-1 rounded-full">
          {roleLabel}
        </span>

        {/* Stats Row */}
        <div className="flex gap-4 mt-4 w-full text-center">
          <div className="flex-1">
            <p className="text-lg font-black text-[#1F2937]">{stats.properties || 0}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Properties</p>
          </div>
          <div className="w-px bg-[#E5E7EB]" />
          <div className="flex-1">
            <p className="text-lg font-black text-[#1F2937]">{stats.saved || 0}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Saved</p>
          </div>
          <div className="w-px bg-[#E5E7EB]" />
          <div className="flex-1">
            <p className="text-lg font-black text-[#1F2937]">{stats.views || 0}</p>
            <p className="text-xs text-[#6B7280] mt-0.5">Views</p>
          </div>
        </div>

        {/* Edit Profile Button */}
        <button className="w-full mt-4 border-2 border-[#FF6B00] text-[#FF6B00] font-bold py-2 rounded-lg text-sm active:bg-orange-50 transition-colors">
          Edit Profile
        </button>
      </div>
    </div>
  );
}