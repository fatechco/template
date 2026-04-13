import { useState } from "react";
import { MapPin } from "lucide-react";

const COUNTRIES = [{ flag: "🇪🇬", name: "Egypt" }, { flag: "🇸🇦", name: "Saudi Arabia" }, { flag: "🇦🇪", name: "UAE" }, { flag: "🇯🇴", name: "Jordan" }];
const PROVINCES = { Egypt: ["Cairo", "Giza", "Alexandria", "Red Sea", "North Sinai", "South Sinai", "Luxor", "Aswan"] };
const CITIES = { Cairo: ["New Cairo", "Heliopolis", "Nasr City", "Maadi", "Zamalek", "Downtown", "Shubra"], Giza: ["6th of October", "Sheikh Zayed", "Mohandessin", "Dokki", "Haram"], Alexandria: ["Smouha", "Stanley", "Gleem", "Sidi Bishr", "Miami"] };

export default function PropStep2Location({ form, update, onNext, canProceed }) {
  const [mapOpen, setMapOpen] = useState(false);
  const provinces = PROVINCES[form.country] || [];
  const cities = CITIES[form.province] || [];

  const Field = ({ label, value, options, onChange, optional }) => (
    <div className="mb-4">
      <p className="text-sm font-bold text-gray-700 mb-1.5">{label} {optional && <span className="text-gray-400 font-normal">(optional)</span>}</p>
      <select value={value} onChange={e => onChange(e.target.value)}
        className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base text-gray-800 outline-none focus:border-orange-400 bg-white appearance-none">
        <option value="">Select {label}</option>
        {options.map(o => <option key={typeof o === "string" ? o : o.name} value={typeof o === "string" ? o : o.name}>{typeof o === "string" ? o : `${o.flag} ${o.name}`}</option>)}
      </select>
    </div>
  );

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center mb-6">Where is the property?</h2>

      <Field label="Country" value={form.country} options={COUNTRIES} onChange={v => update({ country: v, province: "", city: "" })} />
      <Field label="Province / Governorate" value={form.province} options={provinces} onChange={v => update({ province: v, city: "" })} />
      <Field label="City" value={form.city} options={cities} onChange={v => update({ city: v })} />

      <div className="mb-4">
        <p className="text-sm font-bold text-gray-700 mb-1.5">District <span className="text-gray-400 font-normal">(optional)</span></p>
        <input value={form.district} onChange={e => update({ district: e.target.value })}
          placeholder="e.g. South Teseen"
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base outline-none focus:border-orange-400" />
      </div>

      <div className="mb-4">
        <p className="text-sm font-bold text-gray-700 mb-1.5">Full Address</p>
        <textarea value={form.address} onChange={e => update({ address: e.target.value })}
          placeholder="Street name, building number..."
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base outline-none focus:border-orange-400 resize-none" rows={2} />
      </div>

      {/* Map picker */}
      <button onClick={() => setMapOpen(true)}
        className="w-full h-48 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 mb-4">
        <MapPin size={28} className="text-orange-600" />
        <p className="font-bold text-gray-600 text-sm">{form.lat ? "📍 Location set — tap to adjust" : "Tap to set exact location on map"}</p>
        {form.lat && <p className="text-xs text-gray-400">{parseFloat(form.lat).toFixed(4)}, {parseFloat(form.lng).toFixed(4)}</p>}
      </button>

      {/* Direct phone toggle */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-gray-700">Different contact number?</p>
          <button onClick={() => update({ use_direct_phone: !form.use_direct_phone })}
            className={`w-12 h-6 rounded-full transition-colors relative ${form.use_direct_phone ? "bg-orange-600" : "bg-gray-300"}`}>
            <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${form.use_direct_phone ? "left-6" : "left-0.5"}`} />
          </button>
        </div>
        {form.use_direct_phone && (
          <input value={form.direct_phone} onChange={e => update({ direct_phone: e.target.value })}
            placeholder="+20 1XX XXXX XXX" type="tel"
            className="w-full mt-3 border-2 border-gray-200 rounded-xl px-4 py-3 text-base outline-none focus:border-orange-400" />
        )}
      </div>

      <button onClick={onNext} disabled={!canProceed}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base disabled:opacity-40"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        Continue →
      </button>

      {/* Map modal placeholder */}
      {mapOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
          <div className="flex items-center px-4 py-4 gap-3 bg-gray-900">
            <button onClick={() => setMapOpen(false)} className="text-white text-xl">←</button>
            <p className="text-white font-bold flex-1 text-center">Set Location</p>
          </div>
          <div className="flex-1 bg-gray-700 flex items-center justify-center">
            <div className="text-center text-white">
              <MapPin size={48} className="mx-auto mb-3 text-orange-500" />
              <p className="font-bold text-lg">Map Integration</p>
              <p className="text-gray-400 text-sm mt-1">Drag pin to exact location</p>
            </div>
          </div>
          <button onClick={() => { update({ lat: "30.0444", lng: "31.2357" }); setMapOpen(false); }}
            className="bg-orange-600 text-white font-black py-5 text-base"
            style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
            Set This Location ✓
          </button>
        </div>
      )}
    </div>
  );
}