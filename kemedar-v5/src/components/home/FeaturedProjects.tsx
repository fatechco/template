"use client";
// @ts-nocheck
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Building2, Maximize2, User } from "lucide-react";
import { apiClient } from "@/lib/api-client";
import SectionHeader from "./SectionHeader";

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&q=80",
  "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
  "https://images.unsplash.com/photo-1626178793926-22b28830aa30?w=600&q=80",
  "https://images.unsplash.com/photo-1600607688969-a5bfcd646154?w=600&q=80",
  "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80",
  "https://images.unsplash.com/photo-1555636222-cae831e670b3?w=600&q=80",
];

const MOCK_PROJECTS = [
  { id: "m1", title: "Marassi North Coast", developer: "Emaar Misr", built_area: 120, total_area: 6200, total_units: 5000 },
  { id: "m2", title: "The Crown New Cairo", developer: "Palm Hills", built_area: 85, total_area: 3100, total_units: 1200 },
  { id: "m3", title: "Zaha Park", developer: "Ora Developers", built_area: 95, total_area: 4500, total_units: 2800 },
  { id: "m4", title: "Capital Gardens", developer: "Madinet Masr", built_area: 110, total_area: 5000, total_units: 3500 },
  { id: "m5", title: "Sarai New Cairo", developer: "Madinet Masr", built_area: 130, total_area: 7000, total_units: 6000 },
  { id: "m6", title: "Park Lane 6th Oct", developer: "Hyde Park", built_area: 70, total_area: 2800, total_units: 900 },
];

function ProjectCard({ project, index }) {
  const image = project.featured_image || FALLBACK_IMAGES[index % FALLBACK_IMAGES.length];

  return (
    <Link href={`/property/${project.id}`} className="flex-shrink-0 w-64 bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer group">
      {/* Image */}
      <div className="relative h-44 overflow-hidden">
        <img
          src={image}
          alt={project.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        {project.is_verified && (
          <span className="absolute top-2 left-2 bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
            VERIFIED
          </span>
        )}
        {project.is_featured && (
          <span className="absolute top-2 right-2 bg-[#FF6B00] text-white text-[10px] font-bold px-2 py-0.5 rounded">
            FEATURED
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-3">
        <p className="font-black text-gray-900 text-sm leading-tight truncate">{project.title}</p>
        <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
          <User size={11} className="text-[#FF6B00]" />
          {project.developer || "Developer N/A"}
        </p>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-1 mt-3 pt-2 border-t border-gray-100 text-center">
          <div>
            <p className="text-[10px] text-gray-400">Build</p>
            <p className="text-xs font-bold text-gray-700">{project.built_area ? `${project.built_area} m²` : "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400">Total</p>
            <p className="text-xs font-bold text-gray-700">{project.total_area ? `${project.total_area} m²` : "—"}</p>
          </div>
          <div>
            <p className="text-[10px] text-gray-400">Units</p>
            <p className="text-xs font-bold text-gray-700">{project.total_units ? `${project.total_units.toLocaleString()}` : "—"}</p>
          </div>
        </div>

        {/* CTA */}
        <div className="w-full mt-3 bg-[#FF6B00] hover:bg-[#e55f00] text-white text-xs font-bold py-2 rounded-lg transition-colors text-center">
          DETAILS
        </div>
      </div>
    </Link>
  );
}

export default function FeaturedProjects() {
  const [projects, setProjects] = useState([]);
  const sliderRef = useRef(null);
  const hovering = useRef(false);

  useEffect(() => {
    apiClient.list("/api/v1/project", { is_featured: true, is_active: true }, "-created_date", 20)
      .then((data) => setProjects(data.length > 0 ? data : MOCK_PROJECTS))
      .catch(() => setProjects(MOCK_PROJECTS));
  }, []);

  const scroll = (dir) => {
    if (sliderRef.current) sliderRef.current.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      if (!hovering.current && sliderRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = sliderRef.current;
        if (scrollLeft + clientWidth >= scrollWidth - 10) {
          sliderRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          sliderRef.current.scrollBy({ left: 280, behavior: "smooth" });
        }
      }
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-14 bg-gray-50">
      <div className="max-w-[1400px] mx-auto px-4">
        <SectionHeader title="Featured Projects" />

        {/* Slider */}
        <div
          className="relative"
          onMouseEnter={() => (hovering.current = true)}
          onMouseLeave={() => (hovering.current = false)}
        >
          <button
            onClick={() => scroll(-1)}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors"
          >
            <ChevronLeft size={18} />
          </button>

          <div
            ref={sliderRef}
            className="flex gap-4 overflow-x-auto scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {projects.map((proj, i) => (
              <ProjectCard key={proj.id} project={proj} index={i} />
            ))}
          </div>

          <button
            onClick={() => scroll(1)}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 w-9 h-9 bg-white rounded-full shadow-lg border border-gray-100 flex items-center justify-center hover:bg-[#FF6B00] hover:text-white transition-colors"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* View All */}
        <div className="text-center mt-8">
          <Link href="/search-properties" className="inline-flex items-center gap-1 text-[#FF6B00] font-semibold hover:underline text-sm">
            View All Projects <ChevronRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}