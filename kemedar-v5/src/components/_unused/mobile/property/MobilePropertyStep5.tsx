"use client";
// @ts-nocheck
import { ChevronDown } from "lucide-react";
import { useState } from "react";

const PUBLISHER_TYPES = [
  { id: "owner", label: "Owner" },
  { id: "agent", label: "Real Estate Agent" },
  { id: "agency", label: "Real Estate Agency" },
  { id: "developer", label: "Developer" },
];

export default function MobilePropertyStep5({ data, onChange }) {
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleSelect = (value) => {
    onChange({ ...data, publisher_type_id: value });
    setOpenDropdown(null);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-bold text-[#6B7280] mb-2">Publisher Type *</label>
        <div className="relative">
          <button
            onClick={() => setOpenDropdown(openDropdown === "type" ? null : "type")}
            className="w-full border border-[#E5E7EB] rounded-xl px-4 py-3 text-left text-sm font-medium text-[#1F2937] flex items-center justify-between"
          >
            {PUBLISHER_TYPES.find((t) => t.id === data.publisher_type_id)?.label || "Select type"}
            <ChevronDown size={18} className={`transition-transform ${openDropdown === "type" ? "rotate-180" : ""}`} />
          </button>
          {openDropdown === "type" && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-[#E5E7EB] rounded-xl shadow-lg z-10">
              {PUBLISHER_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleSelect(type.id)}
                  className="w-full text-left px-4 py-3 text-sm hover:bg-[#F3F4F6] border-b border-[#E5E7EB] last:border-0"
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
        <p className="text-xs text-blue-900 font-medium">
          💡 This helps buyers understand who's selling the property and builds trust in your listing.
        </p>
      </div>
    </div>
  );
}