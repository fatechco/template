import { useState } from "react";
import MobileFilterBottomSheet from "@/components/mobile-v2/MobileFilterBottomSheet";

const CATEGORIES = [
  { id: "all", icon: "🏘", label: "All" },
  { id: "apartment", icon: "🏢", label: "Apartment" },
  { id: "house", icon: "🏠", label: "House" },
  { id: "villa", icon: "🏡", label: "Villa" },
  { id: "condo", icon: "🏣", label: "Condo" },
  { id: "chalet", icon: "🏕", label: "Chalet" },
  { id: "land", icon: "🌍", label: "Land" },
  { id: "shop", icon: "🏪", label: "Shop" },
  { id: "office", icon: "🏦", label: "Office" },
  { id: "warehouse", icon: "🏭", label: "Warehouse" },
  { id: "clinic", icon: "🏥", label: "Clinic" },
  { id: "farm", icon: "🌾", label: "Farm" },
  { id: "factory", icon: "🏗", label: "Factory" },
  { id: "hotel", icon: "🏨", label: "Hotel" },
  { id: "building", icon: "🏬", label: "Building" },
  { id: "mall", icon: "🛍", label: "Mall" },
];

export default function CategoryFilterSheet({ open, onClose, value, onApply }) {
  const [selected, setSelected] = useState(value || []);

  const toggle = (id) => {
    if (id === "all") { setSelected([]); return; }
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  return (
    <MobileFilterBottomSheet
      open={open}
      onClose={onClose}
      onApply={() => onApply(selected.length ? selected : null)}
      onReset={() => setSelected([])}
    >
      <p className="font-black text-gray-900 text-base mb-4">Property Category</p>
      <div className="grid grid-cols-4 gap-2">
        {CATEGORIES.map((cat) => {
          const isActive = cat.id === "all" ? selected.length === 0 : selected.includes(cat.id);
          return (
            <button
              key={cat.id}
              onClick={() => toggle(cat.id)}
              className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border transition-colors ${
                isActive ? "bg-orange-600 border-orange-600" : "bg-white border-gray-200"
              }`}
            >
              <span className="text-xl">{cat.icon}</span>
              <span className={`text-[11px] font-bold ${isActive ? "text-white" : "text-gray-700"}`}>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </MobileFilterBottomSheet>
  );
}