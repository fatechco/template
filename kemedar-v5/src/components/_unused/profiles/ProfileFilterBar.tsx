"use client";
// @ts-nocheck
import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { apiClient } from "@/lib/api-client";

export default function ProfileFilterBar({ onSearch }) {
  const [countries, setCountries] = useState([]);
  const [provinces, setProvinces] = useState([]);
  const [cities, setCities] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [filters, setFilters] = useState({ country: "", province: "", city: "", district: "", area: "", name: "" });

  useEffect(() => {
    apiClient.list("/api/v1/country").then(setCountries).catch(() => {});
  }, []);

  useEffect(() => {
    setProvinces([]); setCities([]); setDistricts([]); setAreas([]);
    setFilters(f => ({ ...f, province: "", city: "", district: "", area: "" }));
    if (filters.country) apiClient.list("/api/v1/province", { country_id: filters.country }).then(setProvinces).catch(() => {});
  }, [filters.country]);

  useEffect(() => {
    setCities([]); setDistricts([]); setAreas([]);
    setFilters(f => ({ ...f, city: "", district: "", area: "" }));
    if (filters.province) apiClient.list("/api/v1/city", { province_id: filters.province }).then(setCities).catch(() => {});
  }, [filters.province]);

  useEffect(() => {
    setDistricts([]); setAreas([]);
    setFilters(f => ({ ...f, district: "", area: "" }));
    if (filters.city) apiClient.list("/api/v1/district", { city_id: filters.city }).then(setDistricts).catch(() => {});
  }, [filters.city]);

  useEffect(() => {
    setAreas([]);
    setFilters(f => ({ ...f, area: "" }));
    if (filters.district) apiClient.list("/api/v1/area", { district_id: filters.district }).then(setAreas).catch(() => {});
  }, [filters.district]);

  const set = (key, val) => setFilters(f => ({ ...f, [key]: val }));

  const selClass = (disabled) =>
    `border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 transition-all bg-white ${disabled ? "opacity-40 cursor-not-allowed bg-gray-50" : "cursor-pointer"} text-gray-700`;

  return (
    <div className="w-full bg-gray-50 border-b border-gray-200 py-4 sticky top-[112px] z-40">
      <div className="max-w-[1400px] mx-auto px-4 flex flex-wrap items-center gap-3">
        {/* Country */}
        <select value={filters.country} onChange={e => set("country", e.target.value)} className={selClass(false)}>
          <option value="">All Countries</option>
          {countries.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {/* Province */}
        <select value={filters.province} onChange={e => set("province", e.target.value)} disabled={!filters.country} className={selClass(!filters.country)}>
          <option value="">Province</option>
          {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {/* City */}
        <select value={filters.city} onChange={e => set("city", e.target.value)} disabled={!filters.province} className={selClass(!filters.province)}>
          <option value="">City</option>
          {cities.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
        {/* District */}
        <select value={filters.district} onChange={e => set("district", e.target.value)} disabled={!filters.city} className={selClass(!filters.city)}>
          <option value="">District</option>
          {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        {/* Area */}
        <select value={filters.area} onChange={e => set("area", e.target.value)} disabled={!filters.district} className={selClass(!filters.district)}>
          <option value="">Area</option>
          {areas.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        {/* Name search */}
        <input
          type="text"
          placeholder="Search by name..."
          value={filters.name}
          onChange={e => set("name", e.target.value)}
          onKeyDown={e => e.key === "Enter" && onSearch(filters)}
          className="border border-gray-200 rounded-lg px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white text-gray-700 flex-1 min-w-[160px]"
        />
        <button
          onClick={() => onSearch(filters)}
          className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#e55f00] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-colors shadow-sm"
        >
          <Search size={15} /> Search
        </button>
      </div>
    </div>
  );
}