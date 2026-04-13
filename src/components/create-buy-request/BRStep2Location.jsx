import StepShell from "@/components/create-property/StepShell";
import LocationCascade from "@/components/create-shared/LocationCascade";

function Label({ children }) {
  return <label className="text-sm font-bold text-gray-700 mb-1 block">{children}</label>;
}

export default function BRStep2Location({ form, updateForm, onNext, onBack }) {
  return (
    <StepShell title="Step 2 — Location" subtitle="Where are you looking to buy or rent?" onNext={onNext} onBack={onBack}>

      <LocationCascade form={form} updateForm={updateForm} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Address</Label>
          <input type="text" placeholder="e.g. 5th Settlement, New Cairo"
            value={form.address || ""} onChange={e => updateForm({ address: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <Label>Landmark</Label>
          <input type="text" placeholder="e.g. Near Cairo Festival City"
            value={form.landmark || ""} onChange={e => updateForm({ landmark: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <Label>Zip / Postal Code</Label>
          <input type="number" placeholder="e.g. 11511"
            value={form.zip_code || ""} onChange={e => updateForm({ zip_code: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
      </div>
    </StepShell>
  );
}