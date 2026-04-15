// @ts-nocheck
import StepShell from "./StepShell";
import NearbyDistancesInput from "@/components/distance/NearbyDistancesInput";
import TagsInput from "./TagsInput";

const FURNISHED_OPTIONS = ["Not Furnished", "Good", "Old", "Lux", "New"];
const FINISHING_OPTIONS = ["Half Finishing", "Complete Finishing", "High Luxe Finishing"];
const CONDITION_OPTIONS = ["New", "Old", "Not Built Yet", "Under Development"];
const AREA_UNITS = ["SqM", "SqFt", "Feddan", "Hectare", "Acre"];

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

function Label({ children }) {
  return <label className="text-xs font-bold text-gray-600 mb-1 block">{children}</label>;
}

function NumInput({ label, field, form, updateForm, placeholder }) {
  return (
    <div>
      <Label>{label}</Label>
      <input type="number" placeholder={placeholder || "—"} value={form[field] || ""}
        onChange={e => updateForm({ [field]: e.target.value })}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
    </div>
  );
}

function CheckBox({ checked, onChange, label }) {
  return (
    <div className="flex items-center gap-2 cursor-pointer select-none" onClick={() => onChange(!checked)}>
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 transition-all ${checked ? "bg-[#FF6B00] border-[#FF6B00]" : "border-gray-300 bg-white"}`}>
        {checked && <span className="text-white text-[10px] font-black">✓</span>}
      </div>
      <span className="text-sm text-gray-700 font-medium">{label}</span>
    </div>
  );
}

function AreaInput({ label, sizeKey, unitKey, form, updateForm }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex gap-2">
        <input type="number" placeholder="0" value={form[sizeKey] || ""}
          onChange={e => updateForm({ [sizeKey]: e.target.value })}
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        <select value={form[unitKey] || "SqM"} onChange={e => updateForm({ [unitKey]: e.target.value })}
          className="border border-gray-200 rounded-xl px-2 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
          {AREA_UNITS.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
    </div>
  );
}

function SectionHeader({ title }) {
  return (
    <div className="flex items-center gap-2 mb-3 mt-1">
      <span className="w-1 h-5 bg-[#FF6B00] rounded-full" />
      <h3 className="text-sm font-black text-gray-800">{title}</h3>
    </div>
  );
}

export default function Step4Features({ form, updateForm, onNext, onBack }) {
  const toggleAmenity = (val) => {
    const cur = form.amenity_ids || [];
    updateForm({ amenity_ids: cur.includes(val) ? cur.filter(x => x !== val) : [...cur, val] });
  };

  return (
    <StepShell title="Step 4 — Features & Amenities" subtitle="Enter property specifications and select amenities." onNext={onNext} onBack={onBack}>

      {/* Checkboxes */}
      <div>
        <SectionHeader title="Property Flags" />
        <div className="flex flex-wrap gap-5">
          <CheckBox checked={form.is_last_floor || false} onChange={v => updateForm({ is_last_floor: v })} label="Last Floor" />
          <CheckBox checked={form.is_ground_floor || false} onChange={v => updateForm({ is_ground_floor: v })} label="Ground Floor" />
        </div>
      </div>

      {/* Specs grid */}
      <div>
        <SectionHeader title="Specifications" />
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <NumInput label="Year Built" field="year_built" form={form} updateForm={updateForm} placeholder="e.g. 2020" />
          <NumInput label="Bedrooms" field="beds" form={form} updateForm={updateForm} placeholder="e.g. 3" />
          <NumInput label="Bathrooms" field="baths" form={form} updateForm={updateForm} placeholder="e.g. 2" />
          <NumInput label="Receptions" field="receptions" form={form} updateForm={updateForm} placeholder="e.g. 1" />
          <NumInput label="Floor Number" field="floor_number" form={form} updateForm={updateForm} placeholder="e.g. 8" />
          <NumInput label="Total Floors in Building" field="total_floors" form={form} updateForm={updateForm} placeholder="e.g. 15" />

          <div>
            <Label>Furnished</Label>
            <select value={form.furnished_id || ""} onChange={e => updateForm({ furnished_id: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
              <option value="">Select...</option>
              {FURNISHED_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <Label>Finishing Status</Label>
            <select value={form.finishing_status || ""} onChange={e => updateForm({ finishing_status: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
              <option value="">Select...</option>
              {FINISHING_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>

          <div>
            <Label>Condition</Label>
            <select value={form.condition || ""} onChange={e => updateForm({ condition: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
              <option value="">Select...</option>
              {CONDITION_OPTIONS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <Label>Delivery Date</Label>
            <input type="date" value={form.delivery_date || ""} onChange={e => updateForm({ delivery_date: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          </div>
        </div>
      </div>

      {/* Area fields */}
      <div>
        <SectionHeader title="Area Measurements" />
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <AreaInput label="Total Area" sizeKey="area_size" unitKey="area_unit" form={form} updateForm={updateForm} />
          <AreaInput label="Net Area" sizeKey="net_area" unitKey="net_area_unit" form={form} updateForm={updateForm} />
          <AreaInput label="Built Area" sizeKey="built_area" unitKey="built_area_unit" form={form} updateForm={updateForm} />
        </div>
      </div>

      {/* Amenities by category */}
      <div>
        <SectionHeader title="Amenities & Features" />
        <div className="flex flex-col gap-5">
          {AMENITY_CATEGORIES.map(cat => (
            <div key={cat.label}>
              <p className="text-xs font-black text-gray-500 uppercase tracking-wider mb-2">{cat.label}</p>
              <div className="flex flex-wrap gap-2">
                {cat.items.map(item => {
                  const active = (form.amenity_ids || []).includes(item);
                  return (
                    <button key={item} type="button" onClick={() => toggleAmenity(item)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all ${active ? cat.color : "border-gray-200 text-gray-600 bg-white hover:border-gray-400"}`}>
                      {item}
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <SectionHeader title="Property Tags" />
        <p className="text-xs text-gray-500 mb-2">Add tags to help buyers find this property (press Enter or comma to add)</p>
        <TagsInput
          tags={form.tags || []}
          onChange={tags => updateForm({ tags })}
        />
      </div>

      {/* Nearby Distances */}
      <NearbyDistancesInput
        distances={form.nearby_distances || {}}
        onChange={d => updateForm({ nearby_distances: d })}
        mode="property"
      />
    </StepShell>
  );
}