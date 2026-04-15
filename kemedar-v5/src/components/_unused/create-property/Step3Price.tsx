// @ts-nocheck
import StepShell from "./StepShell";

const CURRENCIES = ["EGP", "USD", "EUR", "AED", "SAR", "GBP", "QAR", "KWD", "OMR", "AUD", "CAD", "TRY", "JOD"];
const AREA_UNITS = ["SqM", "SqFt", "Feddan", "Hectare", "Acre"];

function Label({ children, required }) {
  return <label className="text-sm font-bold text-gray-700 mb-1 block">{children}{required && <span className="text-red-500 ml-0.5">*</span>}</label>;
}

function NumberInput({ label, value, onChange, placeholder, prefix, suffix, required }) {
  return (
    <div>
      <Label required={required}>{label}</Label>
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:border-orange-400 bg-white">
        {prefix && <span className="px-3 bg-gray-50 text-gray-500 text-sm border-r border-gray-200 h-full flex items-center py-2.5 font-bold">{prefix}</span>}
        <input type="number" placeholder={placeholder || "0"} value={value} onChange={e => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 text-sm focus:outline-none" />
        {suffix && <span className="px-3 bg-gray-50 text-gray-500 text-sm border-l border-gray-200 py-2.5">{suffix}</span>}
      </div>
    </div>
  );
}

function Toggle({ checked, onChange, label, desc }) {
  return (
    <div className="flex items-start gap-3 p-4 rounded-xl border border-gray-200 bg-gray-50 hover:border-orange-300 transition-colors cursor-pointer" onClick={() => onChange(!checked)}>
      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center mt-0.5 flex-shrink-0 transition-all ${checked ? "bg-[#FF6B00] border-[#FF6B00]" : "border-gray-300"}`}>
        {checked && <span className="text-white text-xs font-black">✓</span>}
      </div>
      <div>
        <p className="text-sm font-bold text-gray-800">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
    </div>
  );
}

export default function Step3Price({ form, updateForm, onNext, onBack, errors, setErrors }) {
  const autoCalc = () => {
    if (form.price_amount && form.area_size) {
      const ppu = (parseFloat(form.price_amount) / parseFloat(form.area_size)).toFixed(2);
      updateForm({ price_per_unit: ppu });
    }
  };

  const validate = () => {
    if (!form.is_contact_for_price && !form.price_amount) {
      setErrors({ price_amount: "Enter a price or check 'Contact for Price'" });
      return false;
    }
    return true;
  };

  return (
    <StepShell title="Step 3 — Price & Area" subtitle="Set pricing, payment plans, and property dimensions." onNext={() => { if (validate()) onNext(); }} onBack={onBack}>

      {/* Contact for price */}
      <Toggle
        checked={form.is_contact_for_price}
        onChange={v => updateForm({ is_contact_for_price: v })}
        label="Contact for Price"
        desc="Hide the price and ask interested buyers to contact you."
      />

      {!form.is_contact_for_price && (
        <div className="flex flex-col gap-4">
          {errors.price_amount && <p className="text-red-500 text-sm">{errors.price_amount}</p>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label required>Currency</Label>
              <select value={form.currency_id} onChange={e => updateForm({ currency_id: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
                {CURRENCIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <NumberInput label="Price" required value={form.price_amount} onChange={v => { updateForm({ price_amount: v }); }} prefix={form.currency_id} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NumberInput label="Price Per Unit (auto)" value={form.price_per_unit} onChange={v => updateForm({ price_per_unit: v })} suffix={`/${form.area_unit || "SqM"}`} />
            <div>
              <Label>Negotiable</Label>
              <select value={form.is_negotiable} onChange={e => updateForm({ is_negotiable: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
                <option value="no">No</option>
                <option value="yes">Yes</option>
                <option value="prefer_not">Prefer not to say</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Installment */}
      <Toggle
        checked={form.enable_installment}
        onChange={v => updateForm({ enable_installment: v })}
        label="Enable Installment / Credit Payments"
        desc="Offer flexible payment plans to buyers."
      />
      {form.enable_installment && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 p-4 bg-orange-50/40 rounded-xl border border-orange-100">
          <NumberInput label="Upfront Payment" value={form.upfront_payment} onChange={v => updateForm({ upfront_payment: v })} prefix={form.currency_id} />
          <NumberInput label="Monthly Payment" value={form.monthly_payment} onChange={v => updateForm({ monthly_payment: v })} prefix={form.currency_id} />
          <NumberInput label="Quarterly Payment" value={form.quarterly_payment} onChange={v => updateForm({ quarterly_payment: v })} prefix={form.currency_id} />
          <NumberInput label="Yearly Payment" value={form.yearly_payment} onChange={v => updateForm({ yearly_payment: v })} prefix={form.currency_id} />
          <div className="col-span-2 sm:col-span-1">
            <Label>Period</Label>
            <div className="flex gap-2">
              <input type="number" placeholder="e.g. 12" value={form.installment_period} onChange={e => updateForm({ installment_period: e.target.value })}
                className="flex-1 border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
              <select value={form.installment_unit || "months"} onChange={e => updateForm({ installment_unit: e.target.value })}
                className="border border-gray-200 rounded-xl px-2 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Discount */}
      <Toggle
        checked={form.enable_discount}
        onChange={v => updateForm({ enable_discount: v })}
        label="Enable Discount"
        desc="Show a discount badge on your listing."
      />
      {form.enable_discount && (
        <div className="flex gap-4 p-4 bg-orange-50/40 rounded-xl border border-orange-100">
          <div className="flex-1">
            <Label>Discount Value</Label>
            <input type="number" placeholder="e.g. 10" value={form.discount_value} onChange={e => updateForm({ discount_value: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400" />
          </div>
          <div>
            <Label>Type</Label>
            <select value={form.discount_type} onChange={e => updateForm({ discount_type: e.target.value })}
              className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white h-[42px]">
              <option value="percent">%</option>
              <option value="amount">{form.currency_id}</option>
            </select>
          </div>
        </div>
      )}

      {/* Area */}
      <div className="pt-2 border-t border-gray-100">
        <label className="text-sm font-bold text-gray-700 mb-3 block">Property Area</label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="col-span-2 sm:col-span-1">
            <NumberInput label="Area Size" required value={form.area_size} onChange={v => { updateForm({ area_size: v }); }} placeholder="e.g. 185" />
          </div>
          <div>
            <Label>Area Unit</Label>
            <select value={form.area_unit} onChange={e => updateForm({ area_unit: e.target.value })}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:border-orange-400 bg-white">
              {AREA_UNITS.map(u => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
          <div>
            <NumberInput label="Dues & Taxes / mo" value={form.dues_taxes} onChange={v => updateForm({ dues_taxes: v })} prefix={form.currency_id} />
          </div>
        </div>
        <button type="button" onClick={autoCalc} className="mt-2 text-xs text-[#FF6B00] font-bold hover:underline">
          ↻ Auto-calculate Price Per Unit
        </button>
      </div>
    </StepShell>
  );
}