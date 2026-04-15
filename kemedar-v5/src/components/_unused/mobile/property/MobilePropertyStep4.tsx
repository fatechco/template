"use client";
// @ts-nocheck
import { ChevronDown } from "lucide-react";
import { useState } from "react";

export default function MobilePropertyStep4({ data, onChange }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const FURNISHED_OPTIONS = [
    { id: "unfurnished", label: "Unfurnished" },
    { id: "semi_furnished", label: "Semi-Furnished" },
    { id: "furnished", label: "Furnished" },
  ];

  const AMENITIES = [
    { id: "gym", label: "Gym" },
    { id: "pool", label: "Swimming Pool" },
    { id: "garden", label: "Garden" },
    { id: "parking", label: "Parking" },
    { id: "ac", label: "Air Conditioning" },
    { id: "heating", label: "Heating" },
    { id: "security", label: "Security" },
    { id: "elevator", label: "Elevator" },
  ];

  const FRONTAGE = [
    { id: "north", label: "North" },
    { id: "south", label: "South" },
    { id: "east", label: "East" },
    { id: "west", label: "West" },
  ];

  const SCENE_VIEW = [
    { id: "city", label: "City View" },
    { id: "garden", label: "Garden View" },
    { id: "street", label: "Street View" },
    { id: "water", label: "Water View" },
  ];

  const handleSelect = (field, value) => {
    onChange({ ...data, [field]: value });
    setOpenDropdown(null);
  };

  const toggleAmenity = (id) => {
    const updated = data.amenity_ids?.includes(id)
      ? data.amenity_ids.filter(a => a !== id)
      : [...(data.amenity_ids || []), id];
    onChange({ ...data, amenity_ids: updated });
  };

  const toggleFrontage = (id) => {
    const updated = data.frontage_ids?.includes(id)
      ? data.frontage_ids.filter(f => f !== id)
      : [...(data.frontage_ids || []), id];
    onChange({ ...data, frontage_ids: updated });
  };

  const toggleSceneView = (id) => {
    const updated = data.scene_view_ids?.includes(id)
      ? data.scene_view_ids.filter(s => s !== id)
      : [...(data.scene_view_ids || []), id];
    onChange({ ...data, scene_view_ids: updated });
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-bold text-[#6B7280] mb-2">Floor Number</label>
          <input
            type="number"
            value={data.floor_number || ""}
            onChange={(e) => onChange({ ...data, floor_number: e.target.value })}
            placeholder="e.g. 3"
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
          />
        </div>
        <div>
          <label className="block text-xs font-bold text-[#6B7280] mb-2">Total Floors</label>
          <input
            type="number"
            value={data.total_floors || ""}
            onChange={(e) => onChange({ ...data, total_floors: e.target.value })}
            placeholder="e.g. 10"
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Year Built</label>
        <input
          type="number"
          value={data.year_built || ""}
          onChange={(e) => onChange({ ...data, year_built: e.target.value })}
          placeholder="e.g. 2020"
          className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#FF6B00]"
        />
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Furnished</label>
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "furnished" ? null : "furnished")}
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-left text-sm font-medium text-[#1F2937] flex items-center justify-between"
          >
            {FURNISHED_OPTIONS.find((f) => f.id === data.furnished_id)?.label || "Select"}
            <ChevronDown size={18} className={`transition-transform ${openDropdown === "furnished" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "furnished" && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-10">
              {FURNISHED_OPTIONS.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleSelect("furnished_id", item.id)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#F3F4F6] border-b border-[#E5E7EB] last:border-0"
                >
                  {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Amenities</label>
        <div className="space-y-2">
          {AMENITIES.map((item) => (
            <label key={item.id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[#F3F4F6] rounded-lg">
              <input
                type="checkbox"
                checked={data.amenity_ids?.includes(item.id) || false}
                onChange={() => toggleAmenity(item.id)}
                className="accent-[#FF6B00]"
              />
              <span className="text-sm text-[#1F2937]">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Frontage Direction</label>
        <div className="space-y-2">
          {FRONTAGE.map((item) => (
            <label key={item.id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[#F3F4F6] rounded-lg">
              <input
                type="checkbox"
                checked={data.frontage_ids?.includes(item.id) || false}
                onChange={() => toggleFrontage(item.id)}
                className="accent-[#FF6B00]"
              />
              <span className="text-sm text-[#1F2937]">{item.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Scene View</label>
        <div className="space-y-2">
          {SCENE_VIEW.map((item) => (
            <label key={item.id} className="flex items-center gap-3 p-2 cursor-pointer hover:bg-[#F3F4F6] rounded-lg">
              <input
                type="checkbox"
                checked={data.scene_view_ids?.includes(item.id) || false}
                onChange={() => toggleSceneView(item.id)}
                className="accent-[#FF6B00]"
              />
              <span className="text-sm text-[#1F2937]">{item.label}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}