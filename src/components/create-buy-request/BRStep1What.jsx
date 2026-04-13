import StepShell from "@/components/create-property/StepShell";
import AIGenerateButton from "@/components/ai/AIGenerateButton";

const CATEGORIES = [
  { id: "apt", label: "Apartment", icon: "🏢" },
  { id: "villa", label: "Villa", icon: "🏡" },
  { id: "office", label: "Office", icon: "🏛️" },
  { id: "shop", label: "Shop", icon: "🏪" },
  { id: "land", label: "Land", icon: "🌍" },
  { id: "warehouse", label: "Warehouse", icon: "🏭" },
  { id: "townhouse", label: "Townhouse", icon: "🏘️" },
  { id: "duplex", label: "Duplex", icon: "🏠" },
  { id: "chalet", label: "Chalet", icon: "⛺" },
  { id: "hotel", label: "Hotel Apt", icon: "🏨" },
  { id: "clinic", label: "Clinic", icon: "🏥" },
  { id: "building", label: "Building", icon: "🏗️" },
];

const CURRENCIES = ["USD", "EGP", "SAR", "AED", "EUR", "GBP", "KWD", "QAR"];
const PURPOSES = ["For Sale", "For Rent", "For Sale or Rent"];
const NUMS = Array.from({ length: 9 }, (_, i) => i + 1);
const AREA_UNITS = ["SqM", "SqFt", "Feddan"];

function Label({ children, required }) {
  return <label className="text-sm font-bold text-gray-700 mb-1 block">{children}{required && <span className="text-red-500 ml-1">*</span>}</label>;
}

export default function BRStep1What({ form, updateForm, onNext, onBack, errors, setErrors }) {
  const toggleCat = (id) => {
    const cur = form.category_ids || [];
    updateForm({ category_ids: cur.includes(id) ? cur.filter(x => x !== id) : [...cur, id] });
  };

  const validate = () => {
    const e = {};
    if (!form.category_ids?.length) e.category_ids = "Select at least one category";
    if (!form.purpose) e.purpose = "Select a purpose";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  return (
    <StepShell title="Step 1 — What Are You Looking For?" subtitle="Tell us what type of property you need." onNext={() => { if (validate()) onNext(); }} onBack={onBack} isFirst>
      {/* Category multi-select */}
      <div>
        <Label required>Property Category</Label>
        {errors?.category_ids && <p className="text-red-500 text-xs mb-2">{errors.category_ids}</p>}
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {CATEGORIES.map(cat => {
            const active = (form.category_ids || []).includes(cat.id);
            return (
              <button key={cat.id} type="button" onClick={() => toggleCat(cat.id)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 transition-all text-center ${active ? "border-[#FF6B00] bg-orange-50 shadow" : "border-gray-200 bg-white hover:border-orange-300 hover:bg-orange-50/50"}`}>
                <span className="text-2xl">{cat.icon}</span>
                <span className={`text-[11px] font-bold ${active ? "text-[#FF6B00]" : "text-gray-600"}`}>{cat.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Purpose */}
      <div>
        <Label required>Property Purpose</Label>
        {errors?.purpose && <p className="text-red-500 text-xs mb-2">{errors.purpose}</p>}
        <div className="flex flex-wrap gap-2">
          {PURPOSES.map(p => (
            <button key={p} type="button" onClick={() => updateForm({ purpose: p })}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${form.purpose === p ? "border-[#FF6B00] bg-[#FF6B00] text-white" : "border-gray-200 bg-white text-gray-600 hover:border-orange-300"}`}>
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Numbers */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { label: "Max Rooms", key: "max_rooms" },
          { label: "Bedrooms", key: "beds" },
          { label: "Bathrooms", key: "baths" },
        ].map(({ label, key }) => (
          <div key={key}>
            <Label>{label}</Label>
            <select value={form[key] || ""} onChange={e => updateForm({ [key]: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
              <option value="">Any</option>
              {NUMS.map(n => <option key={n} value={n}>{n}+</option>)}
            </select>
          </div>
        ))}
      </div>

      {/* Min Size */}
      <div>
        <Label>Minimum Size</Label>
        <div className="flex gap-2">
          <input type="number" placeholder="e.g. 100" value={form.min_size || ""}
            onChange={e => updateForm({ min_size: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          <select value={form.size_unit || "SqM"} onChange={e => updateForm({ size_unit: e.target.value })}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
            {AREA_UNITS.map(u => <option key={u}>{u}</option>)}
          </select>
        </div>
      </div>

      {/* Budget */}
      <div>
        <Label>Budget / Max Price</Label>
        <div className="flex gap-2">
          <input type="number" placeholder="e.g. 2,000,000" value={form.budget || ""}
            onChange={e => updateForm({ budget: e.target.value })}
            className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          <select value={form.currency || "EGP"} onChange={e => updateForm({ currency: e.target.value })}
            className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
            {CURRENCIES.map(c => <option key={c}>{c}</option>)}
          </select>
        </div>
      </div>
    </StepShell>
  );
}