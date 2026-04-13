import { useState } from "react";
import { MapPin } from "lucide-react";

const COUNTRIES = [{ flag: "🇪🇬", name: "Egypt" }, { flag: "🇸🇦", name: "Saudi Arabia" }, { flag: "🇦🇪", name: "UAE" }];
const PROVINCES = { Egypt: ["Cairo", "Giza", "Alexandria", "Red Sea", "North Coast"] };
const CITIES = { Cairo: ["New Cairo", "Heliopolis", "Maadi", "Downtown"], Giza: ["6th of October", "Sheikh Zayed"], Alexandria: ["Smouha", "Stanley"] };

export default function ProjMStep2Location({ form, update, onNext, canProceed }) {
  const [mapOpen, setMapOpen] = useState(false);
  const provinces = PROVINCES[form.country] || [];
  const cities = CITIES[form.province] || [];

  return (
    <div>
      <h2 className="text-2xl font-black text-gray-900 text-center mb-6">Where is the project?</h2>

      {[
        { label: "Country", value: form.country, options: COUNTRIES, onChange: v => update({ country: v, province: "", city: "" }) },
        { label: "Province", value: form.province, options: provinces, onChange: v => update({ province: v, city: "" }) },
        { label: "City", value: form.city, options: cities, onChange: v => update({ city: v }) },
      ].map(f => (
        <div key={f.label} className="mb-4">
          <p className="text-sm font-bold text-gray-700 mb-1.5">{f.label}</p>
          <select value={f.value} onChange={e => f.onChange(e.target.value)}
            className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3.5 text-base text-gray-800 outline-none focus:border-orange-400 bg-white">
            <option value="">Select {f.label}</option>
            {f.options.map(o => <option key={typeof o === "string" ? o : o.name} value={typeof o === "string" ? o : o.name}>{typeof o === "string" ? o : `${o.flag} ${o.name}`}</option>)}
          </select>
        </div>
      ))}

      <div className="mb-4">
        <p className="text-sm font-bold text-gray-700 mb-1.5">Full Address</p>
        <textarea value={form.address} onChange={e => update({ address: e.target.value })}
          placeholder="Project location / street..." rows={2}
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 text-base outline-none focus:border-orange-400 resize-none" />
      </div>

      <button onClick={() => setMapOpen(true)}
        className="w-full h-40 bg-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 mb-6">
        <MapPin size={28} className="text-orange-600" />
        <p className="font-bold text-gray-600 text-sm">{form.lat ? "📍 Location set — tap to adjust" : "Tap to pin on map"}</p>
      </button>

      <button onClick={onNext} disabled={!canProceed}
        className="fixed bottom-0 left-0 right-0 bg-orange-600 text-white font-black py-5 text-base disabled:opacity-40"
        style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>
        Continue →
      </button>

      {mapOpen && (
        <div className="fixed inset-0 z-50 bg-gray-900 flex flex-col">
          <div className="flex items-center px-4 py-4 gap-3 bg-gray-900">
            <button onClick={() => setMapOpen(false)} className="text-white text-xl">←</button>
            <p className="text-white font-bold flex-1 text-center">Set Location</p>
          </div>
          <div className="flex-1 bg-gray-700 flex items-center justify-center">
            <div className="text-center text-white"><MapPin size={48} className="mx-auto mb-3 text-orange-500" /><p className="font-bold text-lg">Map Integration</p></div>
          </div>
          <button onClick={() => { update({ lat: "30.0444", lng: "31.2357" }); setMapOpen(false); }}
            className="bg-orange-600 text-white font-black py-5 text-base"
            style={{ paddingBottom: "max(20px,env(safe-area-inset-bottom))" }}>Set This Location ✓</button>
        </div>
      )}
    </div>
  );
}