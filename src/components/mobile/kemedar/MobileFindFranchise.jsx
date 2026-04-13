import { useState } from "react";
import { MapPin, Search } from "lucide-react";

export default function MobileFindFranchise() {
  const [city, setCity] = useState("");

  return (
    <div className="px-4 mb-6">
      <div className="bg-[#1a1a2e] rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-3">
          <MapPin size={20} color="#FF6B00" />
          <p className="text-white font-black text-base">Find Kemedar Near You</p>
        </div>
        <p className="text-[#9CA3AF] text-sm mb-4 leading-relaxed">
          Connect with our local representative in your area
        </p>
        <div className="flex gap-2">
          <input
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Enter your city or area..."
            className="flex-1 bg-white rounded-xl px-4 text-sm text-[#1F2937] placeholder-[#9CA3AF] focus:outline-none border border-[#E5E7EB]"
            style={{ minHeight: 44 }}
          />
          <button
            className="bg-[#FF6B00] text-white font-black rounded-xl px-4 flex items-center gap-1.5 flex-shrink-0"
            style={{ minHeight: 44 }}
          >
            <Search size={16} />
            Find
          </button>
        </div>
      </div>
    </div>
  );
}