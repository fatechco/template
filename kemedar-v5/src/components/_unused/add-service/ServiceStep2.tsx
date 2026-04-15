// @ts-nocheck
import { X } from "lucide-react";
import AIPriceWidget from "@/components/ai/AIPriceWidget";

const PRICING_TYPES = [
  { id: "fixed",  label: "Fixed Price" },
  { id: "hourly", label: "Per Hour" },
  { id: "daily",  label: "Per Day" },
  { id: "quote",  label: "Custom Quote" },
];

const CITIES = [
  "Cairo", "Alexandria", "Giza", "Sharm El Sheikh", "Hurghada",
  "Mansoura", "Tanta", "Port Said", "Suez", "Ismailia",
];

const AVAILABILITY = ["Weekdays", "Weekends", "Evenings"];

export default function ServiceStep2({ form, update }) {
  const toggleCity = (city) => {
    const arr = form.coverage_cities.includes(city)
      ? form.coverage_cities.filter((c) => c !== city)
      : [...form.coverage_cities, city];
    update({ coverage_cities: arr });
  };

  const toggleAvail = (a) => {
    const arr = form.availability.includes(a)
      ? form.availability.filter((x) => x !== a)
      : [...form.availability, a];
    update({ availability: arr });
  };

  const handlePortfolio = (e) => {
    const files = Array.from(e.target.files);
    const urls = files.map((f) => URL.createObjectURL(f));
    update({ portfolio_urls: [...form.portfolio_urls, ...urls].slice(0, 5) });
  };

  const removePortfolio = (i) => {
    update({ portfolio_urls: form.portfolio_urls.filter((_, idx) => idx !== i) });
  };

  const showPrice = ["fixed", "hourly", "daily"].includes(form.pricing_type);

  return (
    <div className="space-y-6">
      <p className="font-black text-gray-900 text-base">Pricing & Coverage</p>

      {/* AI Price Suggestion */}
      <AIPriceWidget
        formType="service"
        formData={form}
        onPriceSelected={(price) => update({ price: String(price) })}
        requiredFields={["category_id"]}
      />

      {/* Pricing type */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Pricing Type</label>
        <div className="grid grid-cols-2 gap-2">
          {PRICING_TYPES.map((p) => (
            <button
              key={p.id}
              onClick={() => update({ pricing_type: p.id })}
              className={`py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                form.pricing_type === p.id
                  ? "border-orange-500 bg-orange-50 text-orange-600"
                  : "border-gray-200 text-gray-600"
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {showPrice && (
        <div>
          <label className="text-sm font-bold text-gray-700 mb-1.5 block">
            Price ({form.pricing_type === "hourly" ? "per hour" : form.pricing_type === "daily" ? "per day" : "fixed"})
          </label>
          <div className="flex gap-2">
            <select
              value={form.currency_id}
              onChange={(e) => update({ currency_id: e.target.value })}
              className="border border-gray-200 rounded-xl px-3 py-3 text-sm bg-white w-24"
            >
              {["USD", "EGP", "AED", "SAR"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <input
              type="number"
              placeholder="0.00"
              value={form.price}
              onChange={(e) => update({ price: e.target.value })}
              className="flex-1 border border-gray-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-orange-400"
            />
          </div>
        </div>
      )}

      {/* Coverage cities */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">
          Coverage Areas {form.coverage_cities.length > 0 && <span className="text-orange-600">({form.coverage_cities.length})</span>}
        </label>
        <div className="flex flex-wrap gap-2">
          {CITIES.map((city) => {
            const sel = form.coverage_cities.includes(city);
            return (
              <button
                key={city}
                onClick={() => toggleCity(city)}
                className={`px-3 py-2 rounded-xl border text-xs font-semibold transition-all ${
                  sel ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600"
                }`}
              >
                {sel ? "✓ " : ""}{city}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">Availability</label>
        <div className="flex gap-2">
          {AVAILABILITY.map((a) => {
            const sel = form.availability.includes(a);
            return (
              <button
                key={a}
                onClick={() => toggleAvail(a)}
                className={`flex-1 py-2.5 rounded-xl border-2 text-xs font-bold transition-all ${
                  sel ? "border-orange-500 bg-orange-50 text-orange-600" : "border-gray-200 text-gray-600"
                }`}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      {/* Portfolio */}
      <div>
        <label className="text-sm font-bold text-gray-700 mb-2 block">
          Portfolio Photos (optional) — {form.portfolio_urls.length}/5
        </label>
        <div className="grid grid-cols-3 gap-2">
          {form.portfolio_urls.map((url, i) => (
            <div key={i} className="relative rounded-xl overflow-hidden bg-gray-100" style={{ aspectRatio: "1" }}>
              <img src={url} alt="" className="w-full h-full object-cover" />
              <button
                onClick={() => removePortfolio(i)}
                className="absolute top-1 right-1 w-5 h-5 bg-black/60 rounded-full flex items-center justify-center"
              >
                <X size={10} color="white" />
              </button>
            </div>
          ))}
          {form.portfolio_urls.length < 5 && (
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl cursor-pointer bg-gray-50" style={{ aspectRatio: "1" }}>
              <span className="text-xl text-gray-400">+</span>
              <input type="file" accept="image/*" multiple className="hidden" onChange={handlePortfolio} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}