import { useState } from "react";
import { Plus, X, Check } from "lucide-react";

const SAMPLE_PROPS = [
  { id: 1, title: "Luxury Penthouse in Zamalek", price: "$850,000", category: "Penthouse", purpose: "Sale", area: "320 m²", beds: 4, baths: 3, floor: "Top Floor", year: 2022, furnished: "Fully", finishing: "Ultra Lux", image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=300&q=70", amenities: ["Pool", "Gym", "Security", "Elevator", "Parking"] },
  { id: 2, title: "Family Villa in Sheikh Zayed", price: "$380,000", category: "Villa", purpose: "Sale", area: "550 m²", beds: 5, baths: 4, floor: "Ground", year: 2019, furnished: "Semi", finishing: "Super Lux", image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=300&q=70", amenities: ["Garden", "Security", "Parking", "Pool"] },
  { id: 3, title: "Studio in Maadi", price: "$700/mo", category: "Studio", purpose: "Rent", area: "55 m²", beds: 1, baths: 1, floor: "3rd", year: 2015, furnished: "Fully", finishing: "Standard", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=300&q=70", amenities: ["Security", "Elevator"] },
];

const ALL_AMENITIES = ["Pool", "Gym", "Security", "Elevator", "Parking", "Garden"];

const ROWS = [
  { label: "Price", key: "price" },
  { label: "Category", key: "category" },
  { label: "Purpose", key: "purpose" },
  { label: "Area", key: "area" },
  { label: "Bedrooms", key: "beds" },
  { label: "Bathrooms", key: "baths" },
  { label: "Floor", key: "floor" },
  { label: "Year Built", key: "year" },
  { label: "Furnished", key: "furnished" },
  { label: "Finishing", key: "finishing" },
];

export default function CompareProperties() {
  const [selected, setSelected] = useState(SAMPLE_PROPS.slice(0, 2));

  const remove = (id) => setSelected(s => s.filter(p => p.id !== id));
  const add = () => {
    const next = SAMPLE_PROPS.find(p => !selected.find(s => s.id === p.id));
    if (next) setSelected(s => [...s, next]);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-gray-900">Compare Properties</h1>
        <p className="text-gray-500 text-sm mt-0.5">Compare up to 4 properties side by side</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-x-auto">
        <table className="w-full min-w-[600px]">
          <thead>
            <tr className="border-b border-gray-100">
              <th className="w-36 px-4 py-4 text-left text-sm font-bold text-gray-500 bg-gray-50">Attribute</th>
              {selected.map(p => (
                <th key={p.id} className="px-4 py-4 text-center min-w-[180px]">
                  <div className="relative">
                    <button onClick={() => remove(p.id)} className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                      <X size={12} />
                    </button>
                    <img src={p.image} alt={p.title} className="w-full h-28 object-cover rounded-lg mb-2" />
                    <p className="text-sm font-bold text-gray-900 line-clamp-2">{p.title}</p>
                  </div>
                </th>
              ))}
              {selected.length < 4 && (
                <th className="px-4 py-4 text-center min-w-[160px]">
                  <button onClick={add} className="w-full h-28 border-2 border-dashed border-gray-200 rounded-lg flex flex-col items-center justify-center gap-2 hover:border-orange-300 hover:bg-orange-50 transition-colors text-gray-400 hover:text-orange-500">
                    <Plus size={24} />
                    <span className="text-xs font-semibold">Add Property</span>
                  </button>
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {ROWS.map(({ label, key }, ri) => (
              <tr key={key} className={ri % 2 === 0 ? "bg-gray-50/50" : ""}>
                <td className="px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50">{label}</td>
                {selected.map(p => (
                  <td key={p.id} className="px-4 py-3 text-sm text-center font-medium text-gray-800">{p[key]}</td>
                ))}
                {selected.length < 4 && <td />}
              </tr>
            ))}
            {/* Amenities row */}
            <tr>
              <td className="px-4 py-3 text-sm font-semibold text-gray-600 bg-gray-50">Amenities</td>
              {selected.map(p => (
                <td key={p.id} className="px-4 py-3">
                  <div className="flex flex-col gap-1">
                    {ALL_AMENITIES.map(a => (
                      <div key={a} className={`flex items-center gap-1.5 text-xs ${p.amenities.includes(a) ? "text-green-600" : "text-gray-300"}`}>
                        <Check size={12} className={p.amenities.includes(a) ? "" : "opacity-30"} />
                        {a}
                      </div>
                    ))}
                  </div>
                </td>
              ))}
              {selected.length < 4 && <td />}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}