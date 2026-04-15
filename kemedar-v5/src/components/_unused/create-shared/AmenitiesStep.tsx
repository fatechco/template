// @ts-nocheck
import StepShell from "@/components/create-property/StepShell";

const AMENITY_CATEGORIES = [
  {
    label: "Outdoor & Community",
    color: "bg-green-600 text-white border-green-600",
    items: ["Gymnasium", "Swimming Pool", "Covered Parking", "Landscaped Gardens", "Restaurants", "Gated Community", "Running Track", "24 Hour Security", "Spa", "Garage", "Children's Playground", "Health Club", "Rooftop Access"],
  },
  {
    label: "Security",
    color: "bg-red-600 text-white border-red-600",
    items: ["CCTV Security", "Alarm System", "Fire Alarm", "Valet Parking", "24hr Concierge"],
  },
  {
    label: "Facilities",
    color: "bg-blue-600 text-white border-blue-600",
    items: ["Business Center", "Mosque", "Sports Facilities", "Elevator", "Generator", "Intercom"],
  },
  {
    label: "Interior",
    color: "bg-purple-600 text-white border-purple-600",
    items: ["Central Air Conditioning", "Built-in Wardrobes", "Kitchen Appliances", "Smart Home", "Walk-in Closet", "Maid's Room", "Storage Room", "Balcony"],
  },
  {
    label: "Utilities",
    color: "bg-yellow-600 text-white border-yellow-600",
    items: ["Natural Gas", "Solar Energy", "Sound Insulation", "Thermal Insulation", "Internet/Fiber"],
  },
];

export default function AmenitiesStep({ title, subtitle, form, updateForm, onNext, onBack, amenityKey = "amenity_ids" }) {
  const toggle = (val) => {
    const cur = form[amenityKey] || [];
    updateForm({ [amenityKey]: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] });
  };

  return (
    <StepShell title={title} subtitle={subtitle || "Select all that apply."} onNext={onNext} onBack={onBack}>
      {AMENITY_CATEGORIES.map(cat => (
        <div key={cat.label}>
          <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">{cat.label}</p>
          <div className="flex flex-wrap gap-2">
            {cat.items.map(item => {
              const active = (form[amenityKey] || []).includes(item);
              return (
                <button key={item} type="button" onClick={() => toggle(item)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${active ? cat.color : "border-gray-200 text-gray-600 bg-white hover:border-gray-400"}`}>
                  {item}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </StepShell>
  );
}