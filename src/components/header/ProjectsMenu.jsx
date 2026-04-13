const FEATURED_CITIES = [
  "Administrative Capital", "5th Settlement", "6th October", "Sheikh Zayed",
  "Ain Sukhna", "North Coast", "New Cairo", "Maadi", "Heliopolis"
];

const PROVINCES = [
  "Cairo", "Giza", "Alexandria", "Aswan", "Luxor", "Assiut", "Dakahlia",
  "Damietta", "Sharqia", "Gharbia", "Kafr El Sheikh", "Menofia", "Qalyubia",
  "Ismailia", "Suez", "Port Said", "North Sinai", "South Sinai", "Red Sea",
  "Matrouh", "Fayoum", "Beni Suef", "Minya", "Sohag", "Qena", "New Valley"
];

import { Link } from "react-router-dom";

export default function ProjectsMenu() {
  return (
    <div className="absolute top-full left-1/2 -translate-x-1/2 mt-0 bg-white rounded-b-xl shadow-2xl border border-gray-100 z-[150] w-[500px]">
      <div className="flex">
        {/* Featured Cities */}
        <div className="flex-1 py-4 px-5 border-r border-gray-100">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Featured Cities</p>
          {FEATURED_CITIES.map((city) => (
            <Link key={city} to={`/kemedar/search-projects?city=${encodeURIComponent(city)}`} className="flex items-center gap-2 w-full text-left px-2 py-2 text-sm text-gray-700 hover:text-[#FF6B00] hover:bg-orange-50 rounded transition-colors">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B00]" />
              {city}
            </Link>
          ))}
        </div>

        {/* All Provinces */}
        <div className="flex-1 py-4 px-5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">All Provinces</p>
          <div className="columns-2 gap-2">
            {PROVINCES.map((prov) => (
              <Link key={prov} to={`/kemedar/search-projects?province=${encodeURIComponent(prov)}`} className="block w-full text-left px-2 py-1.5 text-xs text-gray-600 hover:text-[#FF6B00] hover:bg-orange-50 rounded transition-colors">
                {prov}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}