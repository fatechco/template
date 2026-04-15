"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, Globe2, ArrowRight } from "lucide-react";
import { apiClient } from "@/lib/api-client";

function BannerSelect({ label, value, onChange, options, disabled }) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className={`appearance-none bg-white/10 border border-white/20 text-white rounded-lg px-3 py-2.5 pr-8 text-sm focus:outline-none focus:border-orange-400 transition-all w-36 ${
          disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer hover:bg-white/20"
        } ${!value ? "text-white/50" : "text-white"}`}
      >
        <option value="" className="text-gray-800">{label}</option>
        {options.map((o) => (
          <option key={o.id || o} value={o.id || o} className="text-gray-800">{o.name || o}</option>
        ))}
      </select>
      <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 text-white/60 pointer-events-none" />
    </div>
  );
}

export default function FranchiseBanner() {
  const router = useRouter();
  const [province, setProvince] = useState("");
  const [city, setCity] = useState("");
  const [district, setDistrict] = useState("");
  const [area, setArea] = useState("");

  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);

  // Load all provinces on mount (Egypt-wide for franchise)
  useEffect(() => {
    apiClient.list("/api/v1/province").then(setProvinces).catch(() => {});
  }, []);

  useEffect(() => {
    setCity(""); setDistrict(""); setArea("");
    setCities([]); setDistricts([]); setAreas([]);
    if (province) apiClient.list("/api/v1/city", { province_id: province }).then(setCities).catch(() => {});
  }, [province]);

  useEffect(() => {
    setDistrict(""); setArea("");
    setDistricts([]); setAreas([]);
    if (city) apiClient.list("/api/v1/district", { city_id: city }).then(setDistricts).catch(() => {});
  }, [city]);

  useEffect(() => {
    setArea(""); setAreas([]);
    if (district) apiClient.list("/api/v1/area", { district_id: district }).then(setAreas).catch(() => {});
  }, [district]);

  return (
    <section className="w-full bg-[#1a1a2e] py-12 relative overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-[#FF6B00] rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-[#FF6B00] rounded-full translate-x-1/2 translate-y-1/2" />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-4">
        <div className="flex flex-col items-center gap-8 text-center">
          {/* Text */}
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-[#FF6B00]/20 border border-[#FF6B00]/40 rounded-full px-4 py-1 mb-4">
              <Globe2 size={14} className="text-[#FF6B00]" />
              <span className="text-[#FF6B00] text-xs font-semibold tracking-wide">KEMEDAR® FRANCHISE NETWORK</span>
            </div>
            <h2 className="text-2xl xl:text-3xl font-black text-white leading-tight">
              Find Our Franchise Owners<br />
              <span className="text-[#FF6B00]">Near You</span>
            </h2>
            <p className="text-gray-400 text-sm mt-2 max-w-lg mx-auto">
              Connect with certified Kemedar franchise partners in your area for local real estate expertise.
            </p>
          </div>

          {/* Search filters */}
          <div className="flex flex-wrap items-center gap-3 justify-center">
            <BannerSelect label="Province" value={province} onChange={setProvince} options={provinces} />
            <BannerSelect label="City" value={city} onChange={setCity} options={cities} disabled={!province} />
            <BannerSelect label="District" value={district} onChange={setDistrict} options={districts} disabled={!city} />
            <BannerSelect label="Area" value={area} onChange={setArea} options={areas} disabled={!district} />
            <button
              onClick={() => router.push(`/find-profile/franchise-owner?province=${province}&city=${city}&district=${district}&area=${area}`)}
              className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold px-6 py-2.5 rounded-lg transition-colors shadow-lg shadow-orange-900/30 text-sm">
              <Search size={15} />
              Search
            </button>
          </div>

          {/* CTA */}
          <Link
            href="/user-benefits/franchise-owner-area"
            className="inline-flex items-center gap-2 border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white font-bold px-7 py-3 rounded-xl transition-all text-sm"
          >
            Be a Kemedar Area Franchise Owner
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}