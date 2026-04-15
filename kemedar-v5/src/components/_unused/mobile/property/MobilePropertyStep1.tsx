"use client";
// @ts-nocheck
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const CATEGORIES = [
  { id: "apartment", label: "Apartment" },
  { id: "villa", label: "Villa" },
  { id: "studio", label: "Studio" },
  { id: "office", label: "Office" },
  { id: "land", label: "Land" },
  { id: "townhouse", label: "Townhouse" },
  { id: "duplex", label: "Duplex" },
  { id: "penthouse", label: "Penthouse" },
];

const PURPOSES = [
  { id: "for_sale", label: "For Sale" },
  { id: "for_rent", label: "For Rent" },
  { id: "daily_booking", label: "For Daily Booking" },
];

export default function MobilePropertyStep1({ data, onChange }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const categories = CATEGORIES;
  const purposes = PURPOSES;

  const SUITABLE_FOR = [
    { id: "families", label: "Families" },
    { id: "investors", label: "Investors" },
    { id: "professionals", label: "Professionals" },
    { id: "students", label: "Students" },
  ];

  const COUNTRIES = [
    { id: "1", label: "Egypt" },
    { id: "2", label: "UAE" },
    { id: "3", label: "Saudi Arabia" },
  ];

  const PROVINCES_BY_COUNTRY = {
    "1": [{ id: "1", label: "Cairo Governorate" }, { id: "2", label: "Giza Governorate" }],
    "2": [{ id: "3", label: "Dubai" }, { id: "4", label: "Abu Dhabi" }],
    "3": [{ id: "5", label: "Riyadh Region" }, { id: "6", label: "Western Region" }],
  };

  const CITIES_BY_PROVINCE = {
    "1": [{ id: "1", label: "Cairo" }],
    "2": [{ id: "2", label: "Giza" }],
    "3": [{ id: "4", label: "Dubai" }],
    "4": [{ id: "5", label: "Abu Dhabi" }],
    "5": [{ id: "6", label: "Riyadh" }],
    "6": [{ id: "7", label: "Jeddah" }],
  };

  const handleSelect = (field, value) => {
    onChange({ ...data, [field]: value });
    setOpenDropdown(null);
  };

  const toggleSuitableFor = (id) => {
    const updated = data.suitable_for_ids?.includes(id)
      ? data.suitable_for_ids.filter(s => s !== id)
      : [...(data.suitable_for_ids || []), id];
    onChange({ ...data, suitable_for_ids: updated });
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Category *</label>
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "category" ? null : "category")}
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-left text-sm font-medium text-[#1F2937] flex items-center justify-between"
          >
            {data.category_id ? categories.find(c => c.id === data.category_id)?.label : "Select category"}
            <ChevronDown size={18} className={`transition-transform ${openDropdown === "category" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "category" && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-10">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => handleSelect("category_id", cat.id)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#F3F4F6] border-b border-[#E5E7EB] last:border-0"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Suitable For</label>
        <div className="space-y-2">
          {SUITABLE_FOR.map((item) => (
            <label key={item.id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[#F3F4F6] rounded-lg">
              <input
                type="checkbox"
                checked={data.suitable_for_ids?.includes(item.id) || false}
                onChange={() => toggleSuitableFor(item.id)}
                className="accent-[#FF6B00]"
              />
              <span className="text-sm text-[#1F2937]">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Purpose *</label>
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "purpose" ? null : "purpose")}
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-left text-sm font-medium text-[#1F2937] flex items-center justify-between"
          >
            {data.purpose ? purposes.find(p => p.id === data.purpose)?.label : "Select purpose"}
            <ChevronDown size={18} className={`transition-transform ${openDropdown === "purpose" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "purpose" && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-10">
              {purposes.map((purpose) => (
                <button
                  key={purpose.id}
                  onClick={() => handleSelect("purpose", purpose.id)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#F3F4F6] border-b border-[#E5E7EB] last:border-0"
                >
                  {purpose.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Country *</label>
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "country" ? null : "country")}
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-left text-sm font-medium text-[#1F2937] flex items-center justify-between"
          >
            {data.country_id ? COUNTRIES.find(c => c.id === data.country_id)?.label : "Select country"}
            <ChevronDown size={18} className={`transition-transform ${openDropdown === "country" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "country" && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-10">
              {COUNTRIES.map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect("country_id", c.id)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#F3F4F6] border-b border-[#E5E7EB] last:border-0"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Province</label>
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "province" ? null : "province")}
            disabled={!data.country_id}
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-left text-sm font-medium text-[#1F2937] flex items-center justify-between disabled:opacity-50"
          >
            {data.province_id ? (PROVINCES_BY_COUNTRY[data.country_id] || []).find(p => p.id === data.province_id)?.label : "Select province"}
            <ChevronDown size={18} className={`transition-transform ${openDropdown === "province" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "province" && data.country_id && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-10">
              {(PROVINCES_BY_COUNTRY[data.country_id] || []).map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelect("province_id", p.id)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#F3F4F6] border-b border-[#E5E7EB] last:border-0"
                >
                  {p.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">City</label>
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "city" ? null : "city")}
            disabled={!data.province_id}
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-left text-sm font-medium text-[#1F2937] flex items-center justify-between disabled:opacity-50"
          >
            {data.city_id ? (CITIES_BY_PROVINCE[data.province_id] || []).find(c => c.id === data.city_id)?.label : "Select city"}
            <ChevronDown size={18} className={`transition-transform ${openDropdown === "city" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "city" && data.province_id && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-10">
              {(CITIES_BY_PROVINCE[data.province_id] || []).map((c) => (
                <button
                  key={c.id}
                  onClick={() => handleSelect("city_id", c.id)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#F3F4F6] border-b border-[#E5E7EB] last:border-0"
                >
                  {c.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Address *</label>
        <input
          type="text"
          value={data.address || ""}
          onChange={(e) => onChange({ ...data, address: e.target.value })}
          placeholder="Enter full address"
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#6B7280] mb-2">Latitude</label>
          <input
            type="number"
            value={data.latitude || ""}
            onChange={(e) => onChange({ ...data, latitude: parseFloat(e.target.value) })}
            placeholder="e.g. 30.0444"
            step="0.0001"
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#6B7280] mb-2">Longitude</label>
          <input
            type="number"
            value={data.longitude || ""}
            onChange={(e) => onChange({ ...data, longitude: parseFloat(e.target.value) })}
            placeholder="e.g. 31.2357"
            step="0.0001"
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Direct Phone</label>
        <input
          type="tel"
          value={data.direct_phone || ""}
          onChange={(e) => onChange({ ...data, direct_phone: e.target.value })}
          placeholder="+1234567890"
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
        />
      </div>
    </div>
  );
}