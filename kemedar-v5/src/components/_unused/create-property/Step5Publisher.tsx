// @ts-nocheck
import StepShell from "./StepShell";

const PUBLISHER_TYPES = [
  { id: "owner", label: "Direct Owner", icon: "🏠", desc: "I own this property and I'm listing it directly." },
  { id: "agent", label: "Agent or Broker", icon: "🤝", desc: "I'm a licensed agent or broker representing the owner." },
  { id: "developer", label: "Developer", icon: "🏗️", desc: "I'm a developer listing a new development or unit." },
];

function CheckBox({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:border-orange-200 cursor-pointer transition-colors" onClick={() => onChange(!checked)}>
      <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${checked ? "bg-[#FF6B00] border-[#FF6B00]" : "border-gray-300 bg-white"}`}>
        {checked && <span className="text-white text-[10px] font-black">✓</span>}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
    </div>
  );
}

export default function Step5Publisher({ form, updateForm, onNext, onBack, errors, setErrors }) {
  const validate = () => {
    if (!form.publisher_type_id) { setErrors({ publisher_type_id: "Please select a publisher type" }); return false; }
    setErrors({});
    return true;
  };

  return (
    <StepShell title="Step 5 — Publisher Type" subtitle="Who is publishing this listing?" onNext={() => { if (validate()) onNext(); }} onBack={onBack}>

      {/* Publisher type cards */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-3 block">Publisher Type <span className="text-red-500">*</span></label>
        {errors?.publisher_type_id && <p className="text-red-500 text-xs mb-2">{errors.publisher_type_id}</p>}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {PUBLISHER_TYPES.map(t => (
            <button key={t.id} type="button" onClick={() => updateForm({ publisher_type_id: t.id })}
              className={`flex flex-col items-center gap-3 p-5 rounded-2xl border-2 text-center transition-all ${
                form.publisher_type_id === t.id
                  ? "border-[#FF6B00] bg-orange-50 shadow-md"
                  : "border-gray-200 bg-white hover:border-orange-200 hover:bg-orange-50/30"
              }`}>
              <span className="text-4xl">{t.icon}</span>
              <div>
                <p className={`font-black text-sm ${form.publisher_type_id === t.id ? "text-[#FF6B00]" : "text-gray-900"}`}>{t.label}</p>
                <p className="text-xs text-gray-400 mt-1 leading-relaxed">{t.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preferences */}
      <div className="border-t border-gray-100 pt-5">
        <label className="text-sm font-bold text-gray-700 mb-3 block">Special Preferences</label>
        <div className="flex flex-col gap-3">
          <CheckBox
            checked={form.pref_video_meeting || false}
            onChange={v => updateForm({ pref_video_meeting: v })}
            label="I am ready for a video meeting with buyers"
          />
          <CheckBox
            checked={form.pref_in_person || false}
            onChange={v => updateForm({ pref_in_person: v })}
            label="I can show buyers the property in person"
          />
          <CheckBox
            checked={form.pref_key_service || false}
            onChange={v => updateForm({ pref_key_service: v })}
            label="I will use Key with Kemedar Service"
            desc="Allow Kemedar to manage property viewings and key handover."
          />
          <CheckBox
            checked={form.pref_no_agents || false}
            onChange={v => updateForm({ pref_no_agents: v })}
            label="No real estate agents please — interested only in direct buyers"
          />
        </div>
      </div>
    </StepShell>
  );
}