"use client";
// @ts-nocheck
import { useRouter } from "next/navigation";

export default function ProjectCard({ project }) {
  const router = useRouter();

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
      {/* Image */}
      <div className="relative" style={{ height: 220 }}>
        <img
          src={project.image}
          alt={project.name}
          className="w-full h-full object-cover"
        />
        {/* Badge */}
        {project.badge && (
          <div className={`absolute top-3 left-3 px-2.5 py-1 rounded-full text-xs font-black ${
            project.badge === "FEATURED"
              ? "bg-orange-600 text-white"
              : "bg-green-500 text-white"
          }`}>
            {project.badge}
          </div>
        )}
        {/* Developer logo overlapping bottom-left */}
        <div className="absolute -bottom-5 left-4">
          <img
            src={project.developerLogo}
            alt={project.developer}
            className="w-10 h-10 rounded-full border-2 border-white shadow-md object-cover bg-white"
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pt-8 pb-4">
        <p className="font-black text-gray-900 text-[18px] leading-tight">{project.name}</p>
        <p className="text-[13px] text-gray-500 mt-0.5">{project.developer}</p>
        <p className="text-xs text-gray-400 mt-0.5">📍 {project.city}, {project.area}</p>

        {/* Stats row */}
        <div className="flex gap-4 mt-2.5">
          <span className="text-xs text-gray-500 flex items-center gap-1">🏗 <span className="font-bold text-gray-700">{project.units}</span> Units</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">📐 <span className="font-bold text-gray-700">{project.area_sqm}</span> sqm</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">📅 <span className="font-bold text-gray-700">{project.delivery}</span></span>
        </div>

        {/* Price */}
        <div className="mt-2.5 flex items-baseline gap-1">
          <span className="text-xs text-gray-400">From</span>
          <span className="text-base font-black text-orange-600">EGP {project.priceFrom}</span>
        </div>

        {/* Tags */}
        <div className="flex gap-1.5 mt-2.5 overflow-x-auto no-scrollbar pb-0.5">
          {project.tags.map(tag => (
            <span key={tag} className="flex-shrink-0 bg-gray-100 text-gray-600 text-[11px] font-semibold px-2.5 py-1 rounded-full">
              {tag}
            </span>
          ))}
        </div>

        {/* Buttons */}
        <div className="flex gap-2 mt-3">
          <button className="flex-1 py-2.5 rounded-xl border border-orange-600 text-orange-600 text-sm font-bold">
            💬 Inquire
          </button>
          <button
            onClick={() => router.push(`/m/project/${project.slug}`)}
            className="flex-1 py-2.5 rounded-xl bg-orange-600 text-white text-sm font-bold"
          >
            🏗 View Details
          </button>
        </div>
      </div>
    </div>
  );
}