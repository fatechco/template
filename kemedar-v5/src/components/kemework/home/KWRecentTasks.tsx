"use client";
// @ts-nocheck
import { useState } from "react";
import Link from "next/link";

const TASKS = [
  { id: 1, title: "Full Kitchen Renovation with New Cabinets and Countertops", category: "Home Remodeling", desc: "Looking for experienced contractor to renovate our 15sqm kitchen. Work includes removing old cabinets, installing new ones, new countertops, tiling floor and walls.", city: "Cairo", hoursAgo: 2, budgetMin: 2000, budgetMax: 5000, skills: ["Kitchen", "Carpentry", "Tiling"], bids: 7, clientRating: 4.8, status: "Open", featured: true },
  { id: 2, title: "Apartment Electrical Rewiring - 3 Bedroom", category: "Electrical", desc: "Need complete electrical rewiring for a 120sqm apartment. All rooms including kitchen and 2 bathrooms. Must be certified electrician.", city: "Dubai", hoursAgo: 5, budgetMin: 800, budgetMax: 1500, skills: ["Electrical", "Wiring", "Safety"], bids: 12, clientRating: 4.5, status: "Open", featured: false },
  { id: 3, title: "Garden Landscaping & Irrigation System Installation", category: "Landscaping", desc: "Design and implement a complete landscaping solution for 200sqm villa garden. Includes lawn, plants, irrigation system and outdoor lighting.", city: "Riyadh", hoursAgo: 8, budgetMin: 3000, budgetMax: 8000, skills: ["Landscaping", "Irrigation", "Lighting"], bids: 4, clientRating: 5.0, status: "Featured", featured: true },
  { id: 4, title: "Bathroom Tiles Installation - 2 Bathrooms", category: "Flooring & Tiling", desc: "Need professional tiler to install new tiles in 2 bathrooms. Total area approximately 30sqm. Materials will be provided.", city: "Amman", hoursAgo: 12, budgetMin: 300, budgetMax: 600, skills: ["Tiling", "Grouting", "Waterproofing"], bids: 9, clientRating: 4.2, status: "Open", featured: false },
  { id: 5, title: "AC Units Installation - 5 Split Units", category: "HVAC", desc: "Installation of 5 new split AC units in a villa. Includes all piping and electrical connections. Must be certified HVAC technician.", city: "Kuwait City", hoursAgo: 18, budgetMin: 500, budgetMax: 1000, skills: ["HVAC", "Electrical", "Installation"], bids: 6, clientRating: 4.7, status: "Open", featured: false },
  { id: 6, title: "Interior Painting - Full Villa 4 Bedrooms", category: "Painting", desc: "Professional painting for entire villa. 4 bedrooms, living room, dining, 3 bathrooms and corridors. Total area ~350sqm.", city: "Alexandria", hoursAgo: 24, budgetMin: 1200, budgetMax: 2500, skills: ["Painting", "Finishing", "Prep Work"], bids: 15, clientRating: 4.6, status: "Featured", featured: true },
];

export default function KWRecentTasks() {
  const [activeFilter, setActiveFilter] = useState("All");
  const filtered = activeFilter === "All" ? TASKS : activeFilter === "Featured" ? TASKS.filter(t => t.featured) : TASKS.filter(t => t.status === "Open");

  return (
    <div className="py-16 px-4" style={{ background: "#F8F5F0" }}>
      <div className="max-w-[1200px] mx-auto">
        <h2 className="text-3xl font-black text-gray-900 text-center mb-2">Recent Tasks</h2>
        <p className="text-gray-500 text-center mb-8">Browse latest tasks posted by homeowners</p>

        {/* Tab filter */}
        <div className="flex justify-center gap-2 mb-8">
          {["All", "Open", "Featured"].map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className="px-5 py-2 rounded-full text-xs font-bold border transition-colors"
              style={{
                background: activeFilter === f ? "#C41230" : "#fff",
                color: activeFilter === f ? "#fff" : "#374151",
                borderColor: activeFilter === f ? "#C41230" : "#e5e7eb",
              }}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(task => (
            <div key={task.id} className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col hover:shadow-md transition-shadow">
              {/* Top badges */}
              <div className="flex items-start justify-between mb-3">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full text-white" style={{ background: "#C41230" }}>{task.category}</span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full" style={{ background: "#FEF3C7", color: "#92400E" }}>
                  ${task.budgetMin.toLocaleString()} – ${task.budgetMax.toLocaleString()}
                </span>
              </div>

              {/* Title */}
              <h4 className="font-black text-gray-900 text-sm leading-snug mb-2 line-clamp-2">{task.title}</h4>
              <p className="text-gray-500 text-xs leading-relaxed mb-3 line-clamp-3">{task.desc}</p>

              {/* Details */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mb-3">
                <span>📍 {task.city}</span>
                <span>⏰ {task.hoursAgo}h ago</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1 mb-3">
                {task.skills.slice(0, 3).map(s => (
                  <span key={s} className="text-[10px] bg-gray-100 text-gray-600 font-semibold px-2 py-0.5 rounded-full">{s}</span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-100">
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="font-semibold">{task.bids} Bids</span>
                  <span>⭐ {task.clientRating}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-white transition-all hover:opacity-90"
                    style={{ background: "#C41230" }}
                  >
                    Place Bid
                  </button>
                  <Link href={`/kemework/task/${task.id}`} className="px-3 py-1.5 rounded-lg text-xs font-bold text-gray-700 border border-gray-200 hover:bg-gray-50 transition-colors">
                    View →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/kemework/tasks"
            className="inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white text-sm transition-all hover:opacity-90"
            style={{ background: "#C41230" }}
          >
            View All Tasks →
          </Link>
        </div>
      </div>
    </div>
  );
}