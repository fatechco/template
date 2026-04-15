// @ts-nocheck
const PROJECT_TYPES = [
  { id: "new_finishing", icon: "🏠", label: "New Finishing", desc: "Brand new property, starting from scratch" },
  { id: "renovation", icon: "🔨", label: "Full Renovation", desc: "Complete makeover of existing property" },
  { id: "partial_renovation", icon: "🔧", label: "Partial Renovation", desc: "Specific rooms or areas only" },
  { id: "luxury_upgrade", icon: "✨", label: "Luxury Upgrade", desc: "Premium upgrades to existing finishing" },
  { id: "commercial_fit_out", icon: "🏢", label: "Commercial Fit-Out", desc: "Office, shop or clinic" },
];

const PROPERTY_TYPES = ["apartment", "villa", "duplex", "studio", "commercial", "other"];

function Label({ children, required }) {
  return <label className="text-xs font-bold text-gray-700 mb-1 block">{children} {required && <span className="text-red-500">*</span>}</label>;
}

function Input({ value, onChange, placeholder, type = "text" }) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400"
    />
  );
}

export default function WizardStep1Property({ form, update }) {
  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 mb-1">Tell us about your property</h2>
      <p className="text-gray-500 text-sm mb-6">Fill in the details to help AI generate an accurate plan</p>

      {/* Project Name */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <Label required>Project Name</Label>
        <Input value={form.projectName} onChange={v => update({ projectName: v })} placeholder="e.g. My New Cairo Apartment" />
      </div>

      {/* Project Type */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <Label required>Project Type</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
          {PROJECT_TYPES.map(pt => (
            <button
              key={pt.id}
              onClick={() => update({ projectType: pt.id })}
              className={`flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all ${form.projectType === pt.id ? "border-orange-500 bg-orange-50" : "border-gray-200 hover:border-orange-200"}`}
            >
              <span className="text-2xl">{pt.icon}</span>
              <div>
                <p className="font-bold text-gray-900 text-sm">{pt.label}</p>
                <p className="text-xs text-gray-500">{pt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Property Details */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4">
        <p className="font-bold text-gray-900 mb-4 text-sm">Property Details</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
          <div>
            <Label required>Property Type</Label>
            <select value={form.propertyType} onChange={e => update({ propertyType: e.target.value })} className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400">
              {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <div>
            <Label required>Total Area (m²)</Label>
            <Input type="number" value={form.totalAreaSqm} onChange={v => update({ totalAreaSqm: Number(v) })} placeholder="100" />
          </div>
          <div>
            <Label>Floor Number</Label>
            <Input type="number" value={form.floorNumber || ""} onChange={v => update({ floorNumber: Number(v) })} placeholder="e.g. 3" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <Label required>Bedrooms</Label>
            <div className="flex items-center gap-3">
              <button onClick={() => update({ numberOfRooms: Math.max(0, form.numberOfRooms - 1) })} className="w-9 h-9 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50">-</button>
              <span className="font-bold text-gray-900 text-lg w-8 text-center">{form.numberOfRooms}</span>
              <button onClick={() => update({ numberOfRooms: form.numberOfRooms + 1 })} className="w-9 h-9 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50">+</button>
            </div>
          </div>
          <div>
            <Label required>Bathrooms</Label>
            <div className="flex items-center gap-3">
              <button onClick={() => update({ numberOfBathrooms: Math.max(0, form.numberOfBathrooms - 1) })} className="w-9 h-9 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50">-</button>
              <span className="font-bold text-gray-900 text-lg w-8 text-center">{form.numberOfBathrooms}</span>
              <button onClick={() => update({ numberOfBathrooms: form.numberOfBathrooms + 1 })} className="w-9 h-9 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-50">+</button>
            </div>
          </div>
        </div>

        <div>
          <Label required>Property Address</Label>
          <textarea
            value={form.propertyAddress}
            onChange={e => update({ propertyAddress: e.target.value })}
            placeholder="Full address including compound name, city, district..."
            rows={2}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 resize-none"
          />
        </div>
      </div>
    </div>
  );
}