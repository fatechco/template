import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Trash2, Plus, X, Search, Share2, RotateCcw } from "lucide-react";
import MobileTopBar from "@/components/mobile-v2/MobileTopBar";

const MOCK_ALL_PROPERTIES = [
  { id: 1, title: "Modern Apartment in New Cairo", price: 280000, category: "Apartment", purpose: "For Sale", location: "New Cairo, 5th Settlement", totalArea: 145, netArea: 120, beds: 3, baths: 2, receptions: 1, floor: 5, yearBuilt: 2022, furnished: "Unfurnished", finishing: "Super Lux", status: "Ready", image: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&q=70" },
  { id: 2, title: "Luxury Villa in Sheikh Zayed", price: 850000, category: "Villa", purpose: "For Sale", location: "Sheikh Zayed, Beverly Hills", totalArea: 420, netArea: 380, beds: 5, baths: 4, receptions: 2, floor: 0, yearBuilt: 2021, furnished: "Furnished", finishing: "Ultra Lux", status: "Ready", image: "https://images.unsplash.com/photo-1613977257592-4871e5fcd7c4?w=200&q=70" },
  { id: 3, title: "Studio for Rent in Maadi", price: 600, category: "Studio", purpose: "For Rent", location: "Maadi, Maadi Degla", totalArea: 55, netArea: 50, beds: 1, baths: 1, receptions: 0, floor: 2, yearBuilt: 2019, furnished: "Furnished", finishing: "Standard", status: "Ready", image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=200&q=70" },
  { id: 4, title: "Penthouse in Heliopolis", price: 650000, category: "Penthouse", purpose: "For Sale", location: "Heliopolis, Korba", totalArea: 300, netArea: 260, beds: 4, baths: 3, receptions: 2, floor: 12, yearBuilt: 2023, furnished: "Unfurnished", finishing: "Super Lux", status: "Under Construction", image: "https://images.unsplash.com/photo-1582407947304-d0b8a61e3a41?w=200&q=70" },
];

const FEATURES = [
  { key: "price", label: "Price", format: v => v >= 10000 ? `$${v.toLocaleString()}` : `$${v}/mo` },
  { key: "category", label: "Category" },
  { key: "purpose", label: "Purpose" },
  { key: "location", label: "Location" },
  { key: "totalArea", label: "Total Area", format: v => `${v} sqm` },
  { key: "netArea", label: "Net Area", format: v => `${v} sqm` },
  { key: "beds", label: "Bedrooms" },
  { key: "baths", label: "Bathrooms" },
  { key: "receptions", label: "Receptions" },
  { key: "floor", label: "Floor" },
  { key: "yearBuilt", label: "Year Built" },
  { key: "furnished", label: "Furnished" },
  { key: "finishing", label: "Finishing" },
  { key: "status", label: "Status" },
];

function AddPropertySheet({ onClose, onAdd, selected }) {
  const [query, setQuery] = useState("");
  const available = MOCK_ALL_PROPERTIES.filter(p => !selected.find(s => s.id === p.id));
  const filtered = available.filter(p => p.title.toLowerCase().includes(query.toLowerCase()));

  return (
    <div className="fixed inset-0 z-50 flex items-end">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-t-3xl w-full max-w-[480px] mx-auto" style={{ maxHeight: "80vh" }}>
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mt-3 mb-3" />
        <p className="font-black text-gray-900 px-5 mb-3">Add Property to Compare</p>
        <div className="flex items-center gap-2 bg-gray-100 rounded-xl mx-5 px-3 py-2.5 mb-3">
          <Search size={16} className="text-gray-400" />
          <input autoFocus value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Search properties to compare..."
            className="flex-1 text-sm bg-transparent outline-none" />
        </div>
        <div className="overflow-y-auto px-4 pb-6 space-y-2" style={{ maxHeight: "50vh" }}>
          {filtered.map(p => (
            <div key={p.id} className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
              <img src={p.image} alt={p.title} className="w-14 h-12 rounded-lg object-cover flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-gray-900 line-clamp-1">{p.title}</p>
                <p className="text-xs text-orange-600 font-bold">${p.price.toLocaleString()}</p>
              </div>
              <button onClick={() => { onAdd(p); onClose(); }}
                className="text-xs font-bold text-white bg-orange-600 px-3 py-1.5 rounded-lg flex-shrink-0">
                Add →
              </button>
            </div>
          ))}
          {filtered.length === 0 && <p className="text-center text-sm text-gray-500 py-6">No properties found</p>}
        </div>
      </div>
    </div>
  );
}

export default function ComparePropertiesPage() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState([MOCK_ALL_PROPERTIES[0], MOCK_ALL_PROPERTIES[1]]);
  const [showAddSheet, setShowAddSheet] = useState(false);

  const addProperty = (p) => { if (selected.length < 4) setSelected(prev => [...prev, p]); };
  const removeProperty = (id) => setSelected(prev => prev.filter(p => p.id !== id));

  const getValue = (prop, key, format) => {
    const val = prop[key];
    return format ? format(val) : String(val);
  };

  const slots = [...selected, ...Array(Math.max(0, 4 - selected.length)).fill(null)];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32 max-w-[480px] mx-auto">
      <MobileTopBar title="Compare Properties" showBack
        rightAction={
          <button onClick={() => setSelected([])} className="text-xs font-bold text-red-500 flex items-center gap-1">
            <Trash2 size={15} /> Clear
          </button>
        } />

      {/* Info strip */}
      <div className="bg-gray-100 text-center py-2">
        <p className="text-[13px] text-gray-500">Select up to 4 properties to compare</p>
      </div>

      {selected.length === 0 ? (
        <div className="text-center py-20 px-6">
          <p className="text-5xl mb-3">⚖️</p>
          <p className="font-bold text-gray-700 text-base">Add properties to compare</p>
          <p className="text-sm text-gray-500 mt-1">Compare up to 4 properties side by side</p>
          <button onClick={() => setShowAddSheet(true)}
            className="mt-5 bg-orange-600 text-white font-bold px-6 py-3 rounded-xl text-sm">
            Browse Properties
          </button>
        </div>
      ) : (
        <>
          {/* Selected slots */}
          <div className="bg-white border-b border-gray-100 px-3 py-3">
            <div className="flex gap-2">
              {slots.map((prop, i) => (
                <div key={i} className="flex-1" style={{ minWidth: 0 }}>
                  {prop ? (
                    <div className="relative">
                      <img src={prop.image} alt={prop.title} className="w-full aspect-square rounded-lg object-cover" />
                      <button onClick={() => removeProperty(prop.id)}
                        className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center">
                        <X size={10} />
                      </button>
                      <p className="text-[9px] font-bold text-gray-700 mt-1 truncate">{prop.title}</p>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddSheet(true)}
                      className="w-full aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center gap-1">
                      <Plus size={18} className="text-gray-400" />
                      <span className="text-[10px] text-gray-400">Add</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Comparison table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="sticky left-0 bg-gray-50 text-left px-4 py-3 font-bold text-gray-700 w-28 border-r border-gray-100">Feature</th>
                  {selected.map(p => (
                    <th key={p.id} className="px-3 py-3 font-bold text-gray-700 text-center min-w-[100px]">
                      <span className="line-clamp-1 text-[10px]">{p.title.split(" ").slice(0, 3).join(" ")}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {FEATURES.map((feat, fi) => {
                  const values = selected.map(p => getValue(p, feat.key, feat.format));
                  const allSame = values.every(v => v === values[0]);
                  return (
                    <tr key={feat.key} className={fi % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                      <td className={`sticky left-0 px-4 py-3 font-bold text-gray-600 border-r border-gray-100 ${fi % 2 === 0 ? "bg-white" : "bg-gray-50"}`}>
                        {feat.label}
                      </td>
                      {values.map((val, vi) => (
                        <td key={vi} className={`px-3 py-3 text-center ${allSame ? "text-green-600 font-bold" : "text-gray-700"}`}>
                          {val}
                        </td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* Bottom actions */}
      {selected.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-white border-t border-gray-100 px-4 py-3 space-y-2">
          <button className="w-full flex items-center justify-center gap-2 border-2 border-orange-600 text-orange-600 font-bold py-3 rounded-xl text-sm">
            <Share2 size={16} /> Share Comparison
          </button>
          <button onClick={() => setSelected([])} className="w-full text-sm text-gray-500 font-bold flex items-center justify-center gap-2 py-2">
            <RotateCcw size={14} /> Start Over
          </button>
        </div>
      )}

      {showAddSheet && <AddPropertySheet onClose={() => setShowAddSheet(false)} onAdd={addProperty} selected={selected} />}
    </div>
  );
}