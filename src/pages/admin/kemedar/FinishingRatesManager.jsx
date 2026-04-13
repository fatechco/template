import { useState, useEffect } from "react";
import { Save, Edit2, Check } from "lucide-react";
import { base44 } from "@/api/base44Client";

const TIERS = ["Economy", "Standard", "Premium", "Luxury"];

function RateCard({ city, indices, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [rates, setRates] = useState({
    Economy: indices.Economy || { baseMaterialCostPerSqm: 1200, baseLaborCostPerSqm: 800 },
    Standard: indices.Standard || { baseMaterialCostPerSqm: 2200, baseLaborCostPerSqm: 1400 },
    Premium: indices.Premium || { baseMaterialCostPerSqm: 3800, baseLaborCostPerSqm: 2200 },
    Luxury: indices.Luxury || { baseMaterialCostPerSqm: 7000, baseLaborCostPerSqm: 4000 },
  });

  const handleSave = async () => {
    const tasks = [];
    for (const tier of TIERS) {
      const idx = indices[tier];
      if (idx?.id) {
        tasks.push(
          base44.entities.FinishingCostIndex.update(idx.id, {
            baseMaterialCostPerSqm: rates[tier].baseMaterialCostPerSqm,
            baseLaborCostPerSqm: rates[tier].baseLaborCostPerSqm,
            lastUpdated: new Date().toISOString(),
          })
        );
      }
    }
    await Promise.all(tasks);
    setEditing(false);
    onUpdate();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-black text-gray-900">{city}</h3>
        {!editing ? (
          <button onClick={() => setEditing(true)} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700">
            <Edit2 size={12} /> Edit
          </button>
        ) : (
          <button onClick={handleSave} className="flex items-center gap-1.5 text-xs font-bold text-green-600 hover:text-green-700">
            <Check size={12} /> Save
          </button>
        )}
      </div>

      <div className="space-y-3">
        {TIERS.map(tier => {
          const rate = rates[tier];
          return (
            <div key={tier} className="bg-gray-50 rounded-lg p-3">
              <p className="text-xs font-semibold text-gray-600 mb-2">{tier}</p>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Material/sqm</label>
                  {editing ? (
                    <input
                      type="number"
                      value={rate.baseMaterialCostPerSqm}
                      onChange={e => setRates(r => ({ ...r, [tier]: { ...r[tier], baseMaterialCostPerSqm: Number(e.target.value) } }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="font-bold text-gray-900">{rate.baseMaterialCostPerSqm} EGP</p>
                  )}
                </div>
                <div className="flex-1">
                  <label className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Labor/sqm</label>
                  {editing ? (
                    <input
                      type="number"
                      value={rate.baseLaborCostPerSqm}
                      onChange={e => setRates(r => ({ ...r, [tier]: { ...r[tier], baseLaborCostPerSqm: Number(e.target.value) } }))}
                      className="w-full border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-bold focus:outline-none focus:border-blue-400"
                    />
                  ) : (
                    <p className="font-bold text-gray-900">{rate.baseLaborCostPerSqm} EGP</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function FinishingRatesManager() {
  const [cities, setCities] = useState([]);
  const [indices, setIndices] = useState({});
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const citiesList = await base44.entities.City.list("-created_date", 100);
      setCities(citiesList);

      const indicesData = await base44.entities.FinishingCostIndex.list("-created_date", 500);
      const byCity = {};
      for (const city of citiesList) {
        byCity[city.id] = {};
        for (const tier of TIERS) {
          const idx = indicesData.find(i => i.cityId === city.id && i.qualityTier === tier);
          byCity[city.id][tier] = idx;
        }
      }
      setIndices(byCity);
    } catch (_) {}
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 mb-1">Finishing Cost Index Manager</h1>
        <p className="text-sm text-gray-500">Set the baseline material and labor costs per sqm for each quality tier by city. The AI uses these rates as ground truth data.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cities.map(city => (
          <RateCard key={city.id} city={city.name} indices={indices[city.id] || {}} onUpdate={load} />
        ))}
      </div>

      {cities.length === 0 && (
        <div className="bg-gray-50 rounded-xl border border-gray-200 p-8 text-center">
          <p className="text-gray-500">No cities found. Create cities first in the Location Manager.</p>
        </div>
      )}
    </div>
  );
}