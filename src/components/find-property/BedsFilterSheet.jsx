import { useState } from "react";
import MobileFilterBottomSheet from "@/components/mobile-v2/MobileFilterBottomSheet";

const OPTIONS = ["Any", "1", "2", "3", "4", "5+"];

function Selector({ label, value, onChange }) {
  return (
    <div className="mb-5">
      <p className="text-sm font-black text-gray-900 mb-3">{label}</p>
      <div className="flex gap-2">
        {OPTIONS.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt === "Any" ? null : opt)}
            className={`flex-1 py-3 rounded-2xl text-sm font-bold border transition-colors ${
              (opt === "Any" && !value) || opt === value
                ? "bg-orange-600 text-white border-orange-600"
                : "bg-white text-gray-700 border-gray-200"
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function BedsFilterSheet({ open, onClose, value, onApply }) {
  const [beds, setBeds] = useState(value?.beds || null);
  const [baths, setBaths] = useState(value?.baths || null);
  const [receptions, setReceptions] = useState(value?.receptions || null);

  return (
    <MobileFilterBottomSheet
      open={open}
      onClose={onClose}
      onApply={() => onApply(beds || baths || receptions ? { beds, baths, receptions } : null)}
      onReset={() => { setBeds(null); setBaths(null); setReceptions(null); }}
    >
      <Selector label="Bedrooms" value={beds} onChange={setBeds} />
      <Selector label="Bathrooms" value={baths} onChange={setBaths} />
      <Selector label="Receptions" value={receptions} onChange={setReceptions} />
    </MobileFilterBottomSheet>
  );
}