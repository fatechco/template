// @ts-nocheck
import StepShell from "@/components/create-property/StepShell";
import NearbyDistancesInput from "@/components/distance/NearbyDistancesInput";

const STATUS_OPTIONS = ["New Building", "Old Building", "Not Built Yet", "Under Development"];
const FINISHING_OPTIONS = ["Half Finishing", "Complete Finishing", "High Luxe Finishing"];
const UNITS = ["SqM", "SqFt", "Feddan", "Hectare"];

function Label({ children }) {
  return <label className="text-sm font-bold text-gray-700 mb-1 block">{children}</label>;
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
          {UNITS.map(u => <option key={u}>{u}</option>)}
        </select>
      </div>
    </div>
  );
}

export default function ProjStep3Details({ form, updateForm, onNext, onBack }) {
  return (
    <StepShell title="Step 3 — Area & Details" subtitle="Enter measurements, units, timeline, and project status." onNext={onNext} onBack={onBack}>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <AreaInput label="Total Area" sizeKey="total_area" unitKey="total_area_unit" form={form} updateForm={updateForm} />
        <AreaInput label="Built Area" sizeKey="built_area" unitKey="built_area_unit" form={form} updateForm={updateForm} />
        <AreaInput label="Green Land Area" sizeKey="green_area" unitKey="green_area_unit" form={form} updateForm={updateForm} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <Label>Total Units</Label>
          <input type="number" placeholder="e.g. 500" value={form.total_units || ""}
            onChange={e => updateForm({ total_units: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <Label>Delivery Date</Label>
          <input type="date" value={form.delivery_date || ""}
            onChange={e => updateForm({ delivery_date: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <Label>Project Status</Label>
          <select value={form.project_status || ""} onChange={e => updateForm({ project_status: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
            <option value="">Select...</option>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div>
        <Label>Project Finishing</Label>
        <div className="flex flex-wrap gap-2">
          {FINISHING_OPTIONS.map(f => (
            <button key={f} type="button" onClick={() => updateForm({ project_finishing: f })}
              className={`px-4 py-2.5 rounded-xl text-sm font-bold border-2 transition-all ${form.project_finishing === f ? "border-[#FF6B00] bg-orange-50 text-[#FF6B00]" : "border-gray-200 bg-white text-gray-600 hover:border-orange-300"}`}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Nearby Distances */}
      <NearbyDistancesInput
        distances={form.nearby_distances || {}}
        onChange={d => updateForm({ nearby_distances: d })}
        mode="project"
      />
    </StepShell>
  );
}