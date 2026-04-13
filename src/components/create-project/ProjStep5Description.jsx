import { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";
import { base44 } from "@/api/base44Client";
import StepShell from "@/components/create-property/StepShell";

const UNIT_CATEGORIES = [
  "Apartment", "Villa", "Duplex", "Townhouse", "Studio", "Penthouse",
  "Office", "Shop", "Clinic", "Warehouse", "Hotel Apt",
];

function Label({ children, required }) {
  return <label className="text-sm font-bold text-gray-700 mb-1 block">{children}{required && <span className="text-red-500 ml-1">*</span>}</label>;
}

function SearchSelect({ label, placeholder, value, onChange }) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const MOCK_OPTIONS = [
    { id: "dev1", name: "Palm Hills Developments" },
    { id: "dev2", name: "Emaar Misr" },
    { id: "dev3", name: "Talaat Mostafa Group" },
    { id: "ag1", name: "Ahmed Hassan (Agent)" },
    { id: "ag2", name: "Sara Mohamed (Agent)" },
  ];
  const filtered = MOCK_OPTIONS.filter(o => o.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <div className="relative">
      <Label>{label}</Label>
      <input type="text" placeholder={value || placeholder} value={query}
        onFocus={() => setOpen(true)} onBlur={() => setTimeout(() => setOpen(false), 150)}
        onChange={e => setQuery(e.target.value)}
        className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
      {value && !query && <span className="absolute right-3 top-9 text-xs text-[#FF6B00] font-bold">{MOCK_OPTIONS.find(o => o.id === value)?.name}</span>}
      {open && filtered.length > 0 && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden">
          {filtered.map(o => (
            <button key={o.id} type="button" onMouseDown={() => { onChange(o.id); setQuery(o.name); setOpen(false); }}
              className="w-full text-left px-3 py-2 text-sm hover:bg-orange-50 hover:text-[#FF6B00] transition-colors">
              {o.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ProjStep5Description({ form, updateForm, onNext, onBack, errors, setErrors }) {
  const validate = () => {
    const e = {};
    if (!form.project_title?.trim()) e.project_title = "Required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const addUnit = () => {
    const cur = form.unit_composition || [];
    updateForm({ unit_composition: [...cur, { count: "", category: "Apartment" }] });
  };
  const updateUnit = (i, field, val) => {
    const cur = [...(form.unit_composition || [])];
    cur[i] = { ...cur[i], [field]: val };
    updateForm({ unit_composition: cur });
  };
  const removeUnit = (i) => {
    updateForm({ unit_composition: form.unit_composition.filter((_, idx) => idx !== i) });
  };

  return (
    <StepShell title="Step 5 — Title, Description & Team" subtitle="Name your project, describe it, and assign the team." onNext={() => { if (validate()) onNext(); }} onBack={onBack}>

      {/* Slogan */}
      <div>
        <Label>Project Slogan</Label>
        <input type="text" placeholder="e.g. Live Beyond Expectations"
          value={form.project_slogan || ""} onChange={e => updateForm({ project_slogan: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
      </div>

      {/* Titles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label required>Project Title (English)</Label>
          {errors?.project_title && <p className="text-red-500 text-xs mb-1">{errors.project_title}</p>}
          <input type="text" placeholder="e.g. Palm Hills October"
            value={form.project_title || ""} onChange={e => updateForm({ project_title: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
        </div>
        <div>
          <Label>Project Title (Arabic)</Label>
          <input type="text" dir="rtl" placeholder="مثال: بالم هيلز اكتوبر"
            value={form.project_title_ar || ""} onChange={e => updateForm({ project_title_ar: e.target.value })}
            className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 text-right" />
        </div>
      </div>

      {/* Descriptions */}
      <div>
        <Label>Project Description (English)</Label>
        <textarea rows={5} placeholder="Describe the project — master plan, vision, amenities, payment plans..."
          value={form.project_description || ""} onChange={e => updateForm({ project_description: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none" />
      </div>
      <div>
        <Label>Project Description (Arabic)</Label>
        <textarea rows={4} dir="rtl" placeholder="صف المشروع بالتفصيل..."
          value={form.project_description_ar || ""} onChange={e => updateForm({ project_description_ar: e.target.value })}
          className="w-full border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400 resize-none text-right" />
      </div>

      {/* Developer & Agent */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <SearchSelect label="Developer Company" placeholder="Search developers..." value={form.developer_id || ""} onChange={v => updateForm({ developer_id: v })} />
        <SearchSelect label="Marketing Agent" placeholder="Search agents..." value={form.marketing_agent_id || ""} onChange={v => updateForm({ marketing_agent_id: v })} />
      </div>

      {/* Unit Composition */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label>Consists Of (Unit Composition)</Label>
          <button type="button" onClick={addUnit}
            className="flex items-center gap-1 text-xs font-bold text-[#FF6B00] hover:underline">
            <Plus size={13} /> Add Row
          </button>
        </div>
        {(form.unit_composition || []).length === 0 && (
          <p className="text-xs text-gray-400 italic">No units added yet. Click "Add Row" to start.</p>
        )}
        <div className="flex flex-col gap-2">
          {(form.unit_composition || []).map((unit, i) => (
            <div key={i} className="flex items-center gap-2">
              <input type="number" placeholder="Count" value={unit.count}
                onChange={e => updateUnit(i, "count", e.target.value)}
                className="w-24 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400" />
              <select value={unit.category} onChange={e => updateUnit(i, "category", e.target.value)}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-orange-400 bg-white">
                {UNIT_CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
              <span className="text-sm text-gray-500 font-medium">units</span>
              <button type="button" onClick={() => removeUnit(i)} className="text-gray-400 hover:text-red-500 transition-colors"><X size={15} /></button>
            </div>
          ))}
        </div>
      </div>
    </StepShell>
  );
}