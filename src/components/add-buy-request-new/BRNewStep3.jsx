import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const AMENITIES = [
  "Swimming Pool", "Gym", "Parking", "Security", "Elevator",
  "Garden", "Balcony", "Sea View", "City View", "Concierge",
];

export default function BRNewStep3({ form, update }) {
  const [showAmenities, setShowAmenities] = useState(false);

  const toggleAmenity = (a) => {
    const ids = form.amenity_ids.includes(a)
      ? form.amenity_ids.filter((x) => x !== a)
      : [...form.amenity_ids, a];
    update({ amenity_ids: ids });
  };

  return (
    <div className="space-y-5">
      <p className="font-black text-gray-900 text-base">Tell us more about your request</p>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Request Title <span className="text-red-500">*</span></label>
        <input
          type="text"
          placeholder="e.g. Looking for 3-bed apartment in New Cairo"
          value={form.title}
          onChange={(e) => update({ title: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Description</label>
        <textarea
          rows={4}
          placeholder="Tell sellers exactly what you need. Include any specific requirements, preferred features, timeline, etc."
          value={form.description}
          onChange={(e) => update({ description: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none"
        />
      </div>

      <div>
        <label className="text-sm font-bold text-gray-700 mb-1.5 block">Add Photo (optional)</label>
        <label className="flex flex-col items-center justify-center w-full h-28 border-2 border-dashed border-gray-200 rounded-2xl cursor-pointer bg-gray-50 active:bg-gray-100">
          {form.photo_url ? (
            <img src={form.photo_url} alt="preview" className="w-full h-full object-cover rounded-2xl" />
          ) : (
            <>
              <span className="text-2xl">📷</span>
              <span className="text-xs text-gray-400 mt-1">Tap to add photo</span>
            </>
          )}
          <input type="file" accept="image/*" className="hidden" onChange={(e) => {
            const file = e.target.files[0];
            if (file) update({ photo_url: URL.createObjectURL(file) });
          }} />
        </label>
      </div>

      {/* Amenities collapsible */}
      <div>
        <button
          onClick={() => setShowAmenities(!showAmenities)}
          className="w-full flex items-center justify-between py-3 border border-gray-200 rounded-xl px-4 bg-white"
        >
          <span className="text-sm font-bold text-gray-700">
            Desired Amenities (optional) {form.amenity_ids.length > 0 && <span className="text-orange-600">· {form.amenity_ids.length} selected</span>}
          </span>
          {showAmenities ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        {showAmenities && (
          <div className="mt-2 grid grid-cols-2 gap-2">
            {AMENITIES.map((a) => {
              const sel = form.amenity_ids.includes(a);
              return (
                <button
                  key={a}
                  onClick={() => toggleAmenity(a)}
                  className={`py-2.5 px-3 rounded-xl border text-xs font-semibold text-left transition-all ${
                    sel ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600"
                  }`}
                >
                  {sel ? "✓ " : ""}{a}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}